import db from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Trash } from "lucide-react";

export default async function CategoriesPage() {
    const categories = await db.category.findMany({ orderBy: { name: "asc" } });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-outfit">Categories</h1>
                <Link href="/admin/categories/new" className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700 transition font-medium">
                    <Plus size={20} /> Add Category
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
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{cat.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{cat.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-3">
                                    <Link href={`/admin/categories/${cat.id}`} className="text-blue-600 hover:text-blue-800">
                                        <Pencil size={18} />
                                    </Link>
                                    {/* Delete is handled via client component usually, or a form action. For now, we just link edit. Delete button requires a client component wrapper or separate delete button component. 
                                        TODO: Add Delete Button Component if strictly required. 
                                    */}
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-500 italic">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
