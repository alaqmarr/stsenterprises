"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash, CheckSquare, Square } from "lucide-react";
import toast from "react-hot-toast";

// Define a type that matches the structure returned by the include query
interface ProductWithRelations {
    id: string;
    name: string;
    slug: string;
    images: string[];
    category: { name: string } | null;
    brand: { name: string } | null;
}

interface ProductsTableProps {
    products: ProductWithRelations[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map((p) => p.id));
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
            let res;
            if (ids.length === 1) {
                res = await fetch(`/api/admin/products?id=${ids[0]}`, { method: "DELETE" });
            } else {
                res = await fetch("/api/admin/products", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ids }),
                });
            }

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
                                {products.length > 0 && selectedIds.length === products.length ? (
                                    <CheckSquare size={20} className="text-emerald-600" />
                                ) : (
                                    <Square size={20} />
                                )}
                            </button>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Image</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {products.map((p) => (
                        <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.includes(p.id) ? "bg-slate-50/50" : ""}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button onClick={() => toggleSelect(p.id)} className="flex items-center text-slate-400 hover:text-slate-600">
                                    {selectedIds.includes(p.id) ? (
                                        <CheckSquare size={20} className="text-emerald-600" />
                                    ) : (
                                        <Square size={20} />
                                    )}
                                </button>
                            </td>
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
                                <button
                                    onClick={() => handleDelete([p.id])}
                                    disabled={isLoading}
                                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                >
                                    <Trash size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {products.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">No products found. Add one to get started.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
