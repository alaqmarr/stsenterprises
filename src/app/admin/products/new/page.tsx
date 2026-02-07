import db from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
    const [categories, brands] = await Promise.all([
        db.category.findMany({ orderBy: { name: "asc" } }),
        db.brand.findMany({ orderBy: { name: "asc" } })
    ]);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Add New Product</h1>
            <ProductForm categories={categories} brands={brands} />
        </div>
    );
}
