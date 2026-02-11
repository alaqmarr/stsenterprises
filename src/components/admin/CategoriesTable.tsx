"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";
interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoriesTableProps {
    categories: Category[];
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleSelectAll = () => {
        if (selectedIds.length === categories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(categories.map((c) => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((cid) => cid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm("Are you sure you want to delete the selected items?")) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Deleted successfully");
            setSelectedIds([]);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSingleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });

            if (!res.ok) throw new Error("Failed to delete");

            toast.success("Category deleted");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete");
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {selectedIds.length > 0 && (
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">{selectedIds.length} selected</span>
                    <button
                        onClick={() => handleDelete(selectedIds)}
                        disabled={isLoading}
                        className="text-red-600 text-sm font-medium hover:text-red-700 flex items-center gap-2"
                    >
                        <Trash size={16} /> Delete Selected
                    </button>
                </div>
            )}
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left w-10">
                            <button onClick={toggleSelectAll} className="flex items-center text-slate-400 hover:text-slate-600">
                                {categories.length > 0 && selectedIds.length === categories.length ? (
                                    <CheckSquare size={20} className="text-emerald-600" />
                                ) : (
                                    <Square size={20} />
                                )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Slug</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {categories.map((cat) => (
                        <tr key={cat.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(cat.id) ? "bg-slate-50/50" : ""}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button onClick={() => toggleSelect(cat.id)} className="flex items-center text-slate-400 hover:text-slate-600">
                                    {selectedIds.includes(cat.id) ? (
                                        <CheckSquare size={20} className="text-emerald-600" />
                                    ) : (
                                        <Square size={20} />
                                    )}
                                </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{cat.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm">{cat.slug}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end gap-3">
                                <Link href={`/admin/categories/${cat.id}`} className="text-blue-600 hover:text-blue-800">
                                    <Pencil size={18} />
                                </Link>
                                <button
                                    onClick={() => handleSingleDelete(cat.id)}
                                    disabled={isLoading}
                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                >
                                    <Trash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500 italic">No categories found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
