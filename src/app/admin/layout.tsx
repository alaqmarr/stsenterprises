import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Package,
    Tags,
    Layers,
    MessageSquare,
    Settings,
    LogOut,
    Upload
} from "lucide-react";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/admin");
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/brands", label: "Brands", icon: Tags },
        { href: "/admin/categories", label: "Categories", icon: Layers },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare },
        { href: "/admin/import", label: "Import Data", icon: Upload }, // Added Import Link
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-inter">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-slate-800">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold font-outfit tracking-tight">STS <span className="text-emerald-500">Admin</span></h1>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
                        >
                            <item.icon size={20} className="group-hover:text-emerald-400 transition-colors" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="bg-slate-800 rounded-lg p-4 mb-4">
                        <p className="text-xs text-slate-400 uppercase font-bold mb-1">Signed in as</p>
                        <p className="text-sm font-medium truncate">{session.user?.email}</p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-bold transition-all"
                    >
                        View Live Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
}
