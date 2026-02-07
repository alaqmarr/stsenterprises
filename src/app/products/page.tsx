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
                                                    <a href={`https://wa.me/?text=Hi, interested in ${product.name}`} target="_blank" rel="noreferrer" className="bg-white text-green-600 p-3 rounded-full hover:bg-green-600 hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="WhatsApp Enquiry">
                                                        <MessageCircle size={20} />
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
