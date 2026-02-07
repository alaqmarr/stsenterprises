import db from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Validate ID format (CUID/UUID) lightly if needed, but Prisma handles it.
    const category = await db.category.findUnique({
        where: { id: id }
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Edit Category</h1>
            <CategoryForm initialData={category} />
        </div>
    );
}
