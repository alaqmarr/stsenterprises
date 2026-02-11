import db from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import CategoriesTable from "@/components/admin/CategoriesTable";

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

            <CategoriesTable categories={categories} />
        </div>
    );
}
