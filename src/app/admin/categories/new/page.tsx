import CategoryForm from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 font-outfit text-slate-900">Add New Category</h1>
            <CategoryForm />
        </div>
    );
}
