import db from "@/lib/db";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default async function BrandsPage() {
    const brands = await db.brand.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true } } }
    });

    return (
        <main className="min-h-screen pt-24 pb-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Our Brands</h1>
                        <p className="text-slate-500 text-lg">We deal in top industrial safety brands.</p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {brands.map((brand, i) => (
                        <FadeIn key={brand.id} delay={i * 0.05}>
                            <Link
                                href={`/products?brand=${brand.slug}`}
                                className="group bg-slate-50 p-6 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col items-center text-center justify-center min-h-[180px]"
                            >
                                <ShieldCheck size={40} className="text-emerald-300 group-hover:text-emerald-600 group-hover:scale-110 transition duration-300 mb-4" />
                                <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors font-outfit">{brand.name}</h3>
                                <p className="text-sm text-slate-400 mt-1">{brand._count.products} Products</p>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </main>
    );
}
