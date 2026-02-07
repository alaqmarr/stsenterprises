import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, MessageCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export default async function CategoryDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const category = await db.category.findUnique({
        where: { slug },
        include: {
            products: {
                include: { brand: true, category: true }
            }
        },
    });

    if (!category) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <Link href="/categories" className="inline-flex items-center text-slate-500 hover:text-emerald-700 mb-8 transition font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Back to Categories
                    </Link>
                </FadeIn>

                <div className="text-center mb-16">
                    <FadeIn delay={0.1}>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 font-outfit">{category.name}</h1>
                        <p className="text-slate-500 text-lg">Found {category.products.length} products in this category.</p>
                    </FadeIn>
                </div>

                {category.products.length === 0 ? (
                    <FadeIn delay={0.2}>
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No products available in this category yet.</p>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {category.products.map((product, i) => (
                            <FadeIn key={product.id} delay={i * 0.05}>
                                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
                                    <div className="h-56 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                        {product.images && product.images[0] ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                                        ) : (
                                            <span className="text-slate-400 font-medium">No Image</span>
                                        )}

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
                                        <h3 className="font-bold text-lg mb-2 text-slate-800 font-outfit line-clamp-2 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
                                        {product.brand && (
                                            <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded mb-3 self-start">
                                                {product.brand.name}
                                            </span>
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
        </main>
    );
}
