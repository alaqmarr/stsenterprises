import db from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [product, categories, brands] = await Promise.all([
        db.product.findUnique({ where: { id: id } }),
        db.category.findMany({ orderBy: { name: "asc" } }),
        db.brand.findMany({ orderBy: { name: "asc" } })
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Edit Product</h1>
            <ProductForm initialData={product} categories={categories} brands={brands} />
        </div>
    );
}
