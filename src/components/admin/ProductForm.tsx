"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { X, Zap } from "lucide-react";

interface ProductFormProps {
    initialData?: any;
    categories: any[];
    brands: any[];
    defaultCategoryId?: string;
    defaultBrandId?: string;
    defaultBulkMode?: boolean;
}

export default function ProductForm({
    initialData,
    categories,
    brands,
    defaultCategoryId,
    defaultBrandId,
    defaultBulkMode = false,
}: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [bulkMode, setBulkMode] = useState(defaultBulkMode);
    const [savedCount, setSavedCount] = useState(0);

    const [formData, setFormData] = useState({
        id: initialData?.id || "",
        name: initialData?.name || "",
        description: initialData?.description || "",
        categoryId: initialData?.categoryId || defaultCategoryId || "",
        brandId: initialData?.brandId || defaultBrandId || "",
        images: initialData?.images || [] as string[],
        isFeatured: initialData?.isFeatured || false,
        features: initialData?.features || [] as string[]
    });

    const [featureInput, setFeatureInput] = useState("");

    const handleAddFeature = () => {
        if (!featureInput.trim()) return;
        setFormData({ ...formData, features: [...formData.features, featureInput] });
        setFeatureInput("");
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...formData.features];
        newFeatures.splice(index, 1);
        setFormData({ ...formData, features: newFeatures });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const url = "/api/admin/products";
        const method = initialData ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to save");

            if (bulkMode && !initialData) {
                // Bulk mode: reset form but keep category & brand
                setSavedCount(prev => prev + 1);
                toast.success(`Product created! (${savedCount + 1} added this session)`);
                setFormData({
                    id: "",
                    name: "",
                    description: "",
                    categoryId: formData.categoryId,
                    brandId: formData.brandId,
                    images: [],
                    isFeatured: false,
                    features: []
                });
                setFeatureInput("");
            } else {
                toast.success(initialData ? "Product updated" : "Product created");
                router.push("/admin/products");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error saving product");
        } finally {
            setIsLoading(false);
        }
    };

    const isEditMode = !!initialData;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
            {/* Bulk Mode Toggle — only show on create, not edit */}
            {!isEditMode && (
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <Zap size={20} className={bulkMode ? "text-amber-500" : "text-slate-400"} />
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Bulk Mode</p>
                            <p className="text-xs text-slate-500">Keep category &amp; brand selected after saving. Form resets for the next product.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setBulkMode(!bulkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bulkMode ? "bg-amber-500" : "bg-slate-300"}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${bulkMode ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                </div>
            )}

            {/* Saved counter in bulk mode */}
            {bulkMode && savedCount > 0 && (
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 font-medium">
                    ✅ {savedCount} product{savedCount > 1 ? "s" : ""} added this session
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="Product Name"
                        autoFocus={bulkMode}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={formData.categoryId}
                        onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        className="mt-1 w-full border rounded p-2"
                    >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <select
                        value={formData.brandId}
                        onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                        className="mt-1 w-full border rounded p-2"
                    >
                        <option value="">Select Brand</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description (HTML supported)</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 w-full border rounded p-2"
                        placeholder="Product description..."
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                    <ImageUpload
                        value={formData.images}
                        onChange={(newImages: string[]) => setFormData({ ...formData, images: newImages })}
                        onRemove={(url: string) => setFormData({ ...formData, images: formData.images.filter((i: string) => i !== url) })}
                    />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            value={featureInput}
                            onChange={e => setFeatureInput(e.target.value)}
                            className="flex-1 border rounded p-2"
                            placeholder="Add a feature..."
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                        />
                        <button type="button" onClick={handleAddFeature} className="bg-gray-200 px-4 rounded hover:bg-gray-300">Add</button>
                    </div>
                    <ul className="space-y-1">
                        {formData.features.map((f: string, i: number) => (
                            <li key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <span>{f}</span>
                                <button type="button" onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700"><X size={16} /></button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="featured"
                        checked={formData.isFeatured}
                        onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured Product</label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 disabled:opacity-50">
                    {isLoading ? "Saving..." : bulkMode && !isEditMode ? "Save & Add Next" : "Save Product"}
                </button>
            </div>
        </form>
    );
}
