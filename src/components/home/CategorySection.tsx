import db from "@/lib/db";
import Link from "next/link";
import { Package } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default async function CategorySection() {
    const categories = await db.category.findMany({
        take: 6,
        orderBy: { name: "asc" },
    });

    if (categories.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <FadeIn>
                        <h2 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Explore Categories</h2>
                        <p className="text-slate-500 text-lg">Browse our extensive range of safety equipment tailored for every industrial need.</p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {categories.map((cat, i) => (
                        <FadeIn key={cat.id} delay={i * 0.1}>
                            <Link
                                href={`/categories/${cat.slug}`}
                                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center text-center gap-6 h-full"
                            >
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                    <Package size={32} />
                                </div>
                                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
