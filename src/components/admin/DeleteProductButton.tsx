"use client";

import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
            toast.success("Product deleted");
            router.refresh();
        } catch (err) {
            toast.error("Failed to delete");
        }
    };

    return (
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 transition-colors">
            <Trash size={18} />
        </button>
    );
}
