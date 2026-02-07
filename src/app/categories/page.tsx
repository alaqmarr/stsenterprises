import db from "@/lib/db";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default async function CategoriesPage() {
    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } }
    });

    return (
        <main className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Product Categories</h1>
                        <p className="text-slate-500 text-lg">Browse our extensive range of safety equipment by category.</p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((cat, i) => (
                        <FadeIn key={cat.id} delay={i * 0.05}>
                            <Link
                                href={`/products?category=${cat.slug}`}
                                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                    <Package size={32} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2 font-outfit px-2">{cat.name}</h3>
                                <p className="text-sm text-slate-500 mb-6">{cat._count.products} Products</p>

                                <span className="text-emerald-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                                    View Collection <ArrowRight size={16} />
                                </span>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </main>
    );
}
