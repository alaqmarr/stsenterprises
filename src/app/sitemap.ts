import { MetadataRoute } from "next";
import db from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://stsenterprises.in"; // Helper needed here if env not set

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/about",
    "/products",
    "/categories",
    "/brands",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Dynamic Products
  const products = await db.product.findMany({
    select: { slug: true, updatedAt: true },
  });
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // 3. Dynamic Categories
  const categories = await db.category.findMany({
    select: { slug: true, updatedAt: true },
  });
  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 4. Dynamic Brands
  const brands = await db.brand.findMany({ select: { slug: true } });
  // Assuming brand pages exist at /brands/[slug] - verifying if that route exists or if it's hypothetical
  // Based on file structure, client has src/app/brands/[slug]/page.tsx
  const brandRoutes = brands.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: new Date(), // Brands might not have updatedAt
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
}
