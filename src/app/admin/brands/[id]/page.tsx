import db from "@/lib/db";
import BrandForm from "@/components/admin/BrandForm";
import { notFound } from "next/navigation";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const brand = await db.brand.findUnique({
        where: { id: id }
    });

    if (!brand) {
        notFound();
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Edit Brand</h1>
            <BrandForm initialData={brand} />
        </div>
    );
}
