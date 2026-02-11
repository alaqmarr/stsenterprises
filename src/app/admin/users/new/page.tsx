"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewUserPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "ADMIN" // Default role
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            toast.success("User created successfully!");
            router.push("/admin/users");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Link href="/admin/users" className="inline-flex items-center text-slate-500 hover:text-emerald-700 mb-6 transition font-medium">
                <ArrowLeft size={18} className="mr-2" /> Back to Users
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 font-outfit">Add New User</h1>
                    <p className="text-slate-500">Create a new administrator account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none bg-white"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User (Read Only)</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={loading} icon={!loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "Create User"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
