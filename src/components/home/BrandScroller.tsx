import db from "@/lib/db";
import FadeIn from "@/components/ui/FadeIn";

export default async function BrandScroller() {
    const brands = await db.brand.findMany({
        orderBy: { name: "asc" },
    });

    if (brands.length === 0) return null;

    const displayBrands = [...brands, ...brands, ...brands];

    return (
        <section className="py-20 border-y border-slate-100 overflow-hidden bg-slate-50/50">
            <div className="container mx-auto px-6 mb-10 text-center">
                <FadeIn>
                    <p className="text-slate-400 uppercase tracking-[0.2em] text-sm font-bold">Trusted Distributions</p>
                </FadeIn>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient-x">
                <div className="flex animate-scroll whitespace-nowrap gap-16 items-center">
                    {displayBrands.map((brand, i) => (
                        <div key={`${brand.id}-${i}`} className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-default">
                            <div className="text-2xl font-bold text-slate-800 font-outfit">
                                {brand.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-scroll {
            animation: scroll 40s linear infinite;
        }
        .mask-gradient-x {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        `}</style>
        </section>
    );
}
