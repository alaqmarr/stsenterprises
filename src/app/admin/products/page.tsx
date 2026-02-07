import db from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";
import DeleteProductButton from "@/components/admin/DeleteProductButton"; // Need to create this for consistent client-side delete

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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Image</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="h-12 w-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                                        {p.images && p.images[0] && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{p.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{p.category?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-600">{p.brand?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-3">
                                    <Link href={`/admin/products/${p.id}`} className="text-blue-600 hover:text-blue-800">
                                        <Pencil size={18} />
                                    </Link>
                                    <DeleteProductButton id={p.id} />
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No products found. Add one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
