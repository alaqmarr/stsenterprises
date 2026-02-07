import BrandForm from "@/components/admin/BrandForm";

export default function NewBrandPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Add New Brand</h1>
            <BrandForm />
        </div>
    );
}
