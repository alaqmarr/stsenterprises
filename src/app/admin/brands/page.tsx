import db from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function BrandsPage() {
    const brands = await db.brand.findMany({ orderBy: { name: "asc" } });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-outfit">Brands</h1>
                <Link href="/admin/brands/new" className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700 transition font-medium">
                    <Plus size={20} /> Add Brand
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{brand.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{brand.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-3">
                                    <Link href={`/admin/brands/${brand.id}`} className="text-blue-600 hover:text-blue-800">
                                        <Pencil size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {brands.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No brands found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
