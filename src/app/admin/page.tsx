import db from "@/lib/db";
import Link from "next/link";
import {
    Package,
    Tags,
    Layers,
    Settings,
    Plus,
    ExternalLink,
    ArrowRight,
    TrendingUp,
    MessageSquare
} from "lucide-react";

export default async function AdminDashboard() {
    // 1. Fetch Key Stats
    const [productCount, brandCount, categoryCount, recentProducts] = await Promise.all([
        db.product.count(),
        db.brand.count(),
        db.category.count(),
        db.product.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { brand: true, category: true }
        })
    ]);

    const stats = [
        {
            label: "Total Products",
            value: productCount,
            icon: Package,
            href: "/admin/products",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Active Brands",
            value: brandCount,
            icon: Tags,
            href: "/admin/brands",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            label: "Categories",
            value: categoryCount,
            icon: Layers,
            href: "/admin/categories",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
    ];

    const quickActions = [
        { label: "New Product", href: "/admin/products/new", icon: Plus, primary: true },
        { label: "New Brand", href: "/admin/brands/new", icon: Tags, primary: false },
        { label: "New Category", href: "/admin/categories/new", icon: Layers, primary: false },
        { label: "Messages", href: "/admin/messages", icon: MessageSquare, primary: false },
        { label: "Settings", href: "/admin/settings", icon: Settings, primary: false },
        { label: "Live Site", href: "/", icon: ExternalLink, primary: false },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 font-outfit">Dashboard Overview</h1>
                <p className="text-slate-500 mt-1">Welcome back. Here is what is happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Link key={i} href={stat.href} className="group">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all card-hover">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1">
                                    <TrendingUp size={12} /> +2.5%
                                </span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-1 font-outfit">{stat.value}</h3>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions & Recent Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Quick Actions Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 font-outfit">Quick Actions</h2>
                        <div className="space-y-3">
                            {quickActions.map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={`flex items-center justify-between p-4 rounded-lg transition-all border ${action.primary
                                        ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm"
                                        : "bg-white text-slate-700 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <action.icon size={20} />
                                        <span className="font-semibold">{action.label}</span>
                                    </div>
                                    <ArrowRight size={16} className={action.primary ? "text-emerald-100" : "text-slate-400"} />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 font-outfit">Recent Products</h2>
                            <Link href="/admin/products" className="text-sm text-emerald-600 font-semibold hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Product Name</th>
                                        <th className="px-6 py-4 font-semibold">Brand</th>
                                        <th className="px-6 py-4 font-semibold">Category</th>
                                        <th className="px-6 py-4 font-semibold text-right">Added</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentProducts.length > 0 ? (
                                        recentProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-semibold">
                                                        {product.brand?.name || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{product.category?.name || "N/A"}</td>
                                                <td className="px-6 py-4 text-slate-400 text-sm text-right">
                                                    {new Date(product.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                                No products added yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
