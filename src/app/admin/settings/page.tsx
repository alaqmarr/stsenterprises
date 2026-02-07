"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [config, setConfig] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/admin/settings")
            .then((res) => res.json())
            .then((data) => {
                setConfig(data);
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error("Failed to load settings");
                setIsLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const loadingToast = toast.loading("Saving...");

        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });

            if (!res.ok) throw new Error("Failed to update");

            toast.success("Settings updated!", { id: loadingToast });
            router.refresh();
        } catch (error) {
            toast.error("Error saving settings", { id: loadingToast });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    if (isLoading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-green-900">Site Settings</h1>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Company Info</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input name="companyName" value={config.companyName || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="companyDesc" value={config.companyDesc || ""} onChange={handleChange} rows={3} className="mt-1 w-full border rounded p-2" />
                    </div>

                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Contact Details</h2>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input name="address" value={config.address || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input name="phone" value={config.phone || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                        <input name="whatsapp" value={config.whatsapp || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input name="email" value={config.email || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>

                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 mt-4">Social Media</h2>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Facebook</label>
                        <input name="facebook" value={config.facebook || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram</label>
                        <input name="instagram" value={config.instagram || ""} onChange={handleChange} className="mt-1 w-full border rounded p-2" />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button type="submit" className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition">Save Changes</button>
                </div>
            </form>
        </div>
    );
}
