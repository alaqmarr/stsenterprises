import db from "@/lib/db";
import Link from "next/link";
import { ArrowRight, Eye, MessageCircle } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

const ProductCard = ({ product }: { product: any }) => (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full card-hover">
        <div className="h-64 bg-slate-100 relative overflow-hidden flex items-center justify-center">
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

            {product.isFeatured && (
                <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md uppercase tracking-wider">Featured</span>
            )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
            <div className="text-xs text-emerald-600 font-bold mb-2 uppercase tracking-wide">
                {product.category?.name || "Uncategorized"}
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-800 font-outfit line-clamp-1 group-hover:text-emerald-700 transition-colors">{product.name}</h3>
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
)

export default async function ProductShowcase() {
    const products = await db.product.findMany({
        where: { isFeatured: true },
        take: 8,
        include: { category: true, brand: true },
    });

    const displayProducts = products.length > 0
        ? products
        : await db.product.findMany({ take: 8, orderBy: { createdAt: 'desc' }, include: { category: true, brand: true } });

    if (displayProducts.length === 0) return null;

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <FadeIn>
                        <h2 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Featured Products</h2>
                        <p className="text-slate-500 text-lg">High-performance gear curated for your safety.</p>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <Button href="/products" variant="ghost" icon>
                            View All Products
                        </Button>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayProducts.map((product, i) => (
                        <FadeIn key={product.id} delay={i * 0.1}>
                            <ProductCard product={product} />
                        </FadeIn>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Button href="/products" variant="primary" icon>
                        View All Products
                    </Button>
                </div>
            </div>
        </section>
    );
}
