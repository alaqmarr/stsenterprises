import db from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, ShieldCheck, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeIn from "@/components/ui/FadeIn";
import { Metadata } from "next";

// 1. Enable SSG: Generate all product paths at build time
export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: { slug: true },
    });
    return products.map((product) => ({
        slug: product.slug,
    }));
}

// 2. Dynamic SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = await db.product.findUnique({
        where: { slug },
        include: { category: true, brand: true },
    });

    if (!product) {
        return {
            title: "Product Not Found | STS Enterprises",
            description: "The requested product currently unavailable.",
        };
    }

    const title = `${product.name} | ${product.brand?.name || "STS Enterprises"}`;
    const description = product.description?.replace(/<[^>]*>/g, '').slice(0, 160) || `Buy ${product.name} from STS Enterprises. Best quality safety equipment.`;
    const imageUrl = product.images?.[0] || "/og-image.jpg"; // Fallback image needed in public

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: imageUrl }],
            type: "website",
        },
    };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Prisma automatically deduplicates request for the same data in a render pass if using 'cache' strategy,
    // but here we are using standard fetch. standard prisma calls aren't auto-cached in Next 15+ the same way fetch is.
    // However, for SSG/ISR, this runs at build time so DB hit is fine.
    const product = await db.product.findUnique({
        where: { slug },
        include: { category: true, brand: true },
    });

    if (!product) {
        notFound();
    }

    // Get config for phone number
    const config = await db.appConfig.findFirst();
    const whatsappNumber = config?.phone?.replace(/\D/g, '') || "919876543210";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi, I am interested in ${product.name}`;

    // 3. Structured Data (JSON-LD)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "image": product.images || [],
        "description": product.description?.replace(/<[^>]*>/g, '') || "Safety Product",
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "STS Enterprises"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://stsenterprises.com/products/${product.slug}`, // Replace with actual domain env var later
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock",
            "price": "0" // Price on Request
        }
    };

    return (
        <main className="min-h-screen pt-28 pb-20 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-6">
                <FadeIn>
                    <Link href="/products" className="inline-flex items-center text-slate-500 hover:text-emerald-700 mb-8 transition font-medium">
                        <ArrowLeft size={18} className="mr-2" /> Back to Products
                    </Link>
                </FadeIn>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Image Gallery Section */}
                        <div className="bg-slate-100 p-8 lg:p-12 flex flex-col justify-center items-center relative min-h-[400px]">
                            <FadeIn delay={0.2} className="w-full max-w-md aspect-square bg-white rounded-2xl shadow-lg p-4 flex items-center justify-center relative overflow-hidden group">
                                {product.images && product.images[0] ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition duration-500" />
                                ) : (
                                    <span className="text-slate-400 font-medium">No Image Available</span>
                                )}
                                {product.isFeatured && (
                                    <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">Featured</span>
                                )}
                            </FadeIn>

                            {/* Thumbnails (Placeholder for now since we usually only have 1 image uploaded in demo) */}
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-4 mt-8 overflow-x-auto w-full justify-center pb-2">
                                    {product.images.map((img, i) => (
                                        <div key={i} className="w-20 h-20 rounded-lg border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-emerald-500 transition">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info Section */}
                        <div className="p-8 lg:p-12 flex flex-col">
                            <FadeIn delay={0.3}>
                                <div className="flex items-center gap-3 mb-4">
                                    {product.category && (
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                                            {product.category.name}
                                        </span>
                                    )}
                                    {product.brand && (
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold tracking-wide">
                                            {product.brand.name}
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-outfit leading-tight">{product.name}</h1>

                                {/* Description with HTML support */}
                                {product.description && (
                                    <div
                                        className="prose prose-slate prose-lg text-slate-600 mb-10 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                    />
                                )}

                                {/* Features List */}
                                {product.features && product.features.length > 0 && (
                                    <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <ShieldCheck className="text-emerald-600" size={20} />
                                            Key Features
                                        </h3>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {product.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-2 text-slate-600 text-sm">
                                                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                        <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] shadow-green-200 text-white border-transparent">
                                            <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                            </svg> Enquire on WhatsApp
                                        </Button>
                                    </a>
                                    <Button href="/contact" variant="outline" className="flex-1">
                                        Request Bulk Quote
                                    </Button>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
