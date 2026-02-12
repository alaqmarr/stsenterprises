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
                <a href={`https://wa.me/?text=Hi, interested in ${product.name}`} target="_blank" rel="noreferrer" className="bg-white text-[#25D366] p-3 rounded-full hover:bg-[#25D366] hover:text-white transition transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75" title="WhatsApp Enquiry">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
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
        orderBy: { updatedAt: 'desc' }
    });

    if (products.length === 0) return null;

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
                    {products.map((product, i) => (
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
