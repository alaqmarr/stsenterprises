import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Eye, MessageCircle, Package } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import { Prisma } from "@/generated/prisma/client";

export default async function BrandDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const brand = await db.brand.findUnique({
        where: { slug },
        include: {
            products: {
                include: { category: true }
            }
        }
    });

    if (!brand) {
        notFound();
    }

    // Group products by category
    type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

    const productsByCategory: { [key: string]: ProductWithCategory[] } = {};

    brand.products.forEach((product: ProductWithCategory) => {
        const catName = product.category?.name || "Other";
        if (!productsByCategory[catName]) {
            productsByCategory[catName] = [];
        }
        productsByCategory[catName].push(product);
    });

    return (
        <main className="min-h-screen pt-24 pb-12 bg-slate-50">
            <div className="container mx-auto px-6">
                <FadeIn>
                    <Link href="/brands" className="inline-flex items-center text-slate-500 hover:text-emerald-700 mb-8 transition font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Back to Brands
                    </Link>
                </FadeIn>

                <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 mb-16 flex flex-col items-center text-center">
                    <FadeIn>
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6 text-2xl font-bold border border-emerald-100">
                            {brand.name.charAt(0)}
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 font-outfit">{brand.name}</h1>
                        <p className="text-slate-500 text-lg">Browse all {brand.name} safety products organized by category.</p>
                    </FadeIn>
                </div>

                {Object.keys(productsByCategory).length === 0 ? (
                    <FadeIn delay={0.2}>
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No products found for this brand.</p>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="space-y-20">
                        {Object.entries(productsByCategory).map(([categoryName, products], sectionIndex) => (
                            <section key={categoryName}>
                                <FadeIn delay={sectionIndex * 0.1}>
                                    <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4">
                                        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                                            <Package size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-800 font-outfit">{categoryName}</h2>
                                    </div>
                                </FadeIn>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {products.map((product, i) => (
                                        <FadeIn key={product.id} delay={i * 0.05}>
                                            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
                                                <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
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
                                                        <a href={`https://wa.me/?text=Hi, interested in ${product.name}`} target="_blank" rel="noreferrer" className="bg-white text-[#25D366] p-3 rounded-full hover:bg-[#25D366] hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="WhatsApp Enquiry">
                                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-lg mb-2 text-slate-800 font-outfit line-clamp-1 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
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
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
