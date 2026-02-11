import db from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProductsTable from "@/components/admin/ProductsTable";

export default async function ProductsPage() {
    const products = await db.product.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true, brand: true },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-outfit">Products</h1>
                <Link href="/admin/products/new" className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700 transition font-medium">
                    <Plus size={20} /> Add Product
                </Link>
            </div>

            <ProductsTable products={products} />
        </div>
    );
}
