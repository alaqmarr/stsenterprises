import db from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage({
    searchParams,
}: {
    searchParams: Promise<{ categoryId?: string; brandId?: string; bulk?: string }>;
}) {
    const params = await searchParams;
    const [categories, brands] = await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }),
        db.brand.findMany({ orderBy: { name: "asc" } })
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Add New Product</h1>
            <ProductForm
                categories={categories}
                brands={brands}
                defaultCategoryId={params.categoryId}
                defaultBrandId={params.brandId}
                defaultBulkMode={params.bulk === "true"}
            />
        </div>
    );
}
