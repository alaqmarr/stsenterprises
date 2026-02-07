import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

// Helper: Title Case "body-protection" -> "Body Protection"
const formatCategoryName = (text: string) => {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Helper to upload image from URL to Cloudinary
async function uploadImageToCloudinary(
  imageUrl: string,
  folder: string = "sts-enterprises/products",
) {
  if (!imageUrl) return null;

  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image: ${imageUrl}`, error);
    return null;
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Mode check: Single item or bulk (legacy/full json)
    // We will prioritize the new single item mode
    if (body.categoryName && body.productData) {
      const { categoryName: catKey, productData, productKey } = body;

      // 1. Resolve Category
      const formattedCatName = formatCategoryName(catKey);
      const categorySlug = slugify(catKey);

      let category = await db.category.findFirst({
        where: { OR: [{ name: formattedCatName }, { slug: categorySlug }] },
      });

      if (!category) {
        category = await db.category.create({
          data: { name: formattedCatName, slug: categorySlug },
        });
      }

      // 2. Resolve Product
      const prodName = productData.name || productKey;
      const prodSlug = slugify(prodName);

      const existingProduct = await db.product.findUnique({
        where: { slug: prodSlug },
      });

      if (existingProduct) {
        return NextResponse.json({
          status: "skipped",
          message: "Product already exists",
        });
      }

      // 3. Migrate Image
      let finalImageUrl = "";
      let imageUploaded = false;
      if (productData.image) {
        const uploadedUrl = await uploadImageToCloudinary(productData.image);
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          imageUploaded = true;
        }
      }

      // 4. Create Product
      await db.product.create({
        data: {
          name: prodName,
          slug: prodSlug,
          description: productData.description || "",
          categoryId: category.id,
          images: finalImageUrl ? [finalImageUrl] : [],
          features: productData.info ? [productData.info] : [],
        },
      });

      return NextResponse.json({ status: "created", imageUploaded });
    }

    // Fallback or Error for bulk (we are moving away from bulk in one go)
    return NextResponse.json(
      { error: "Invalid payload. Expected single item." },
      { status: 400 },
    );
  } catch (error) {
    console.error("Import Error:", error);
    return NextResponse.json(
      { error: "Failed to process item" },
      { status: 500 },
    );
  }
}
