"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";

interface BrandFormProps {
    initialData?: {
        id: string;
        name: string;
        logo: string | null;
    };
}

export default function BrandForm({ initialData }: BrandFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || "");
    const [logo, setLogo] = useState(initialData?.logo || "");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const url = "/api/admin/brands";
        const method = initialData ? "PUT" : "POST";
        const body = initialData
            ? { id: initialData.id, name, logo }
            : { name, logo };

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("Failed to save");

            toast.success(initialData ? "Brand updated" : "Brand created");
            router.push("/admin/brands");
            router.refresh();
        } catch (error) {
            toast.error("Error saving brand");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border rounded p-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Hillson"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo (Optional)</label>
                <ImageUpload
                    value={logo ? [logo] : []}
                    onChange={(urls) => setLogo(urls[0] || "")}
                    onRemove={() => setLogo("")}
                    maxFiles={1}
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50"
                >
                    {isLoading ? "Saving..." : "Save Brand"}
                </button>
            </div>
        </form>
    );
}
