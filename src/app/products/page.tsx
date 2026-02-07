import db from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal, Eye, MessageCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; brand?: string }>;
}) {
    const { q, category, brand } = await searchParams;

    const where: any = {};
    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
        ];
    }
    if (category) where.category = { slug: category };
    if (brand) where.brand = { slug: brand };

    const products = await db.product.findMany({
        where,
        include: { category: true, brand: true },
        orderBy: { createdAt: "desc" },
    });

    const categories = await db.category.findMany({ orderBy: { name: "asc" } });
    const brands = await db.brand.findMany({ orderBy: { name: "asc" } });

    return (
        <main className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container mx-auto px-6">
                {/* Header with Search */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <FadeIn>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Our Products</h1>
                        <p className="text-slate-500 text-lg">Browse our premium safety equipment catalog.</p>
                    </FadeIn>

                    <FadeIn delay={0.1} className="w-full md:w-auto">
                        <form action="/products" method="GET" className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input
                                name="q"
                                defaultValue={q}
                                placeholder="Search products..."
                                className="w-full md:w-80 pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition outline-none bg-white shadow-sm"
                            />
                        </form>
                    </FadeIn>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <FadeIn delay={0.2} className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-24">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-lg font-outfit">
                                <SlidersHorizontal size={20} /> Filters
                            </div>

                            <div className="mb-8">
                                <h3 className="font-semibold text-slate-700 mb-3">Categories</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    <Link
                                        href="/products"
                                        className={`block text-sm py-1.5 px-3 rounded transition-colors ${!category ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        All Categories
                                    </Link>
                                    {categories.map(c => (
                                        <Link
                                            key={c.id}
                                            href={`/products?category=${c.slug}`}
                                            className={`block text-sm py-1.5 px-3 rounded transition-colors ${category === c.slug ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-700 mb-3">Brands</h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    <Link
                                        href="/products"
                                        className={`block text-sm py-1.5 px-3 rounded transition-colors ${!brand ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        All Brands
                                    </Link>
                                    {brands.map(b => (
                                        <Link
                                            key={b.id}
                                            href={`/products?brand=${b.slug}`}
                                            className={`block text-sm py-1.5 px-3 rounded transition-colors ${brand === b.slug ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                                        >
                                            {b.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FadeIn>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <FadeIn delay={0.3}>
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Search size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No products found</h3>
                                    <p className="text-slate-500 mb-6">Try adjusting your search or filters.</p>
                                    <Button href="/products" variant="outline">Clear Filters</Button>
                                </div>
                            </FadeIn>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product, i) => (
                                    <FadeIn key={product.id} delay={i * 0.05}>
                                        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
                                            <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                {product.images && product.images[0] ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                                                ) : (
                                                    <span className="text-slate-400 font-medium">No Image</span>
                                                )}

                                                {/* Overlay Buttons */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                                    <Link href={`/products/${product.slug}`} className="bg-white text-slate-900 p-3 rounded-full hover:bg-emerald-500 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300" title="View Details">
                                                        <Eye size={20} />
                                                    </Link>
                                                    <a href={`https://wa.me/?text=Hi, interested in ${product.name}`} target="_blank" rel="noreferrer" className="bg-white text-[#25D366] p-3 rounded-full hover:bg-[#25D366] hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="WhatsApp Enquiry">
                                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="text-xs text-emerald-600 font-bold mb-2 uppercase tracking-wide">
                                                    {product.category?.name || "Uncategorized"}
                                                </div>
                                                <h3 className="font-bold text-lg mb-2 text-slate-800 font-outfit line-clamp-2 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                                                {product.brand && (
                                                    <p className="text-sm text-slate-400 mb-4">{product.brand.name}</p>
                                                )}

                                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                    <Link href={`/products/${product.slug}`} className="text-slate-600 text-sm font-semibold hover:text-emerald-600 flex items-center gap-1 transition-colors">
                                                        Details <ArrowRight size={16} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
