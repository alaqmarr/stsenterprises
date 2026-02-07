"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, AlertCircle, Image as ImageIcon, XCircle, MinusCircle, CloudUpload } from "lucide-react";
import toast from "react-hot-toast";

interface ProductPreview {
    id: string; // Unique ID for tracking
    categoryKey: string; // Original key for API
    category: string; // Formatted name
    name: string;
    image: string;
    description: string;
    info: string;
    // Processing State
    status: 'idle' | 'processing' | 'success' | 'skipped' | 'error';
    imageUploaded: boolean;
}

export default function ImportPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [jsonContent, setJsonContent] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<ProductPreview[]>([]);
    const [progress, setProgress] = useState({ total: 0, current: 0, success: 0, skipped: 0, errors: 0 });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const json = JSON.parse(text);
                setJsonContent(text);

                // Parse for preview
                const previews: ProductPreview[] = [];
                const categories = Object.keys(json);

                categories.forEach(catKey => {
                    // Format category name: "body-protection" -> "Body Protection"
                    const formattedCatName = catKey
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    const products = json[catKey];
                    Object.keys(products).forEach((prodKey, idx) => {
                        const prod = products[prodKey];
                        previews.push({
                            id: `${catKey}-${idx}`,
                            categoryKey: catKey,
                            category: formattedCatName,
                            name: prod.name || prodKey,
                            image: prod.image || "",
                            description: prod.description || "",
                            info: prod.info || "",
                            status: 'idle',
                            imageUploaded: false
                        });
                    });
                });

                setPreviewData(previews);
                setProgress({ total: previews.length, current: 0, success: 0, skipped: 0, errors: 0 });

            } catch (error) {
                toast.error("Invalid JSON file");
                setJsonContent(null);
                setPreviewData([]);
            }
        };
        reader.readAsText(file);
    };

    const processItem = async (item: ProductPreview) => {
        try {
            const res = await fetch("/api/admin/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryName: item.categoryKey,
                    productKey: item.name, // Pass name as key for slug generation fallback
                    productData: {
                        name: item.name,
                        image: item.image,
                        description: item.description,
                        info: item.info
                    }
                }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            return {
                status: data.status === 'skipped' ? 'skipped' : 'success',
                imageUploaded: data.imageUploaded
            };
        } catch (error) {
            return { status: 'error', imageUploaded: false };
        }
    };

    const handleImport = async () => {
        if (previewData.length === 0) return;

        setIsLoading(true);
        const toastId = toast.loading("Starting batch import...");

        let newProgress = { ...progress, total: previewData.length };

        // Process items sequentially to avoid overwhelming server/network for image uploads
        // We could do small batches (e.g., 3 at a time) if needed, but 1 by 1 is safest for 500+ items with images

        const updatedData = [...previewData]; // Copy for mutation

        for (let i = 0; i < updatedData.length; i++) {
            updatedData[i].status = 'processing';
            setPreviewData([...updatedData]); // Trigger UI update

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result: any = await processItem(updatedData[i]);

            updatedData[i].status = result.status;
            updatedData[i].imageUploaded = result.imageUploaded;

            // Update stats
            newProgress.current++;
            if (result.status === 'success') newProgress.success++;
            if (result.status === 'skipped') newProgress.skipped++;
            if (result.status === 'error') newProgress.errors++;

            setProgress({ ...newProgress });
            setPreviewData([...updatedData]);
        }

        setIsLoading(false);
        toast.success(`Import Complete! Added: ${newProgress.success}, Skipped: ${newProgress.skipped}, Errors: ${newProgress.errors}`, { id: toastId });
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-outfit">Import Data</h1>
                    <p className="text-slate-500 mt-2">
                        Bulk import products. Duplicates will be skipped. Images migrated automatically.
                    </p>
                </div>
                {previewData.length > 0 && (
                    <div className="text-right">
                        <div className="text-2xl font-bold font-outfit text-slate-900">
                            {Math.round((progress.current / progress.total) * 100)}%
                        </div>
                        <div className="text-sm text-slate-500">
                            {progress.current} / {progress.total} Processed
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                {/* File Upload Area - Hide if processing */}
                {!isLoading && progress.current === 0 && (
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-10 text-center hover:bg-slate-50 transition-colors mb-8">
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="hidden"
                            id="json-upload"
                            disabled={isLoading}
                        />
                        <label htmlFor="json-upload" className="cursor-pointer flex flex-col items-center gap-4">
                            <Upload className="w-12 h-12 text-slate-400" />
                            <div>
                                <span className="text-emerald-600 font-semibold text-lg">Click to upload JSON</span>
                            </div>
                        </label>
                    </div>
                )}

                {/* Progress Stats */}
                {previewData.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                            <span className="text-emerald-600 text-xs font-bold uppercase">Success</span>
                            <div className="text-2xl font-bold text-emerald-700">{progress.success}</div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <span className="text-amber-600 text-xs font-bold uppercase">Skipped</span>
                            <div className="text-2xl font-bold text-amber-700">{progress.skipped}</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                            <span className="text-red-600 text-xs font-bold uppercase">Errors</span>
                            <div className="text-2xl font-bold text-red-700">{progress.errors}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <span className="text-slate-500 text-xs font-bold uppercase">Pending</span>
                            <div className="text-2xl font-bold text-slate-700">{progress.total - progress.current}</div>
                        </div>
                    </div>
                )}

                {previewData.length > 0 && (
                    <div className="space-y-6">
                        <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[600px] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold w-16">Status</th>
                                        <th className="px-4 py-3 font-semibold">Image</th>
                                        <th className="px-4 py-3 font-semibold">Product Name</th>
                                        <th className="px-4 py-3 font-semibold">Category</th>
                                        <th className="px-4 py-3 font-semibold">Info</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {previewData.map((item) => (
                                        <tr key={item.id} className={`hover:bg-slate-50 transition-colors ${item.status === 'processing' ? 'bg-blue-50/50' : ''}`}>
                                            <td className="px-4 py-3 text-center">
                                                {item.status === 'idle' && <div className="w-2 h-2 rounded-full bg-slate-300 mx-auto" />}
                                                {item.status === 'processing' && <Loader2 size={18} className="animate-spin text-blue-500 mx-auto" />}
                                                {item.status === 'success' && <CheckCircle size={18} className="text-emerald-500 mx-auto" />}
                                                {item.status === 'skipped' && <MinusCircle size={18} className="text-amber-500 mx-auto" />}
                                                {item.status === 'error' && <XCircle size={18} className="text-red-500 mx-auto" />}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="relative w-12 h-12">
                                                    {item.image ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded bg-slate-100" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center text-slate-300">
                                                            <ImageIcon size={20} />
                                                        </div>
                                                    )}
                                                    {/* Cloudinary Upload Indicator */}
                                                    {item.imageUploaded && (
                                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md" title="Uploaded to Cloudinary">
                                                            <CloudUpload size={14} className="text-blue-500 fill-blue-50" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-900">
                                                {item.name}
                                                {item.status === 'skipped' && <span className="text-amber-600 text-xs font-normal ml-2">(Duplicate)</span>}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {item.category}
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 max-w-[200px] truncate">
                                                {item.info}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {!isLoading && progress.current === 0 && (
                            <div className="flex justify-end pt-4 border-t border-slate-200">
                                <button
                                    onClick={handleImport}
                                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-700 shadow-lg hover:shadow-xl transform active:scale-95 transition-all flex items-center gap-2"
                                >
                                    Start Import ({previewData.length} Items)
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
