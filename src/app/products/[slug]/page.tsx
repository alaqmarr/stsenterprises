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
                                            <MessageCircle size={20} className="mr-2" /> Enquire on WhatsApp
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
