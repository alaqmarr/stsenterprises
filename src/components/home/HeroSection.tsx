import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-emerald-950 text-white overflow-hidden">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-950 to-slate-950 opacity-100"></div>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl pt-20 lg:pt-0">
                    <FadeIn delay={0.1}>
                        <div className="inline-flex items-center gap-2 bg-emerald-900/50 border border-emerald-700/50 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-200 tracking-wide uppercase">Trusted Since 1989</span>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] font-outfit">
                            Industrial <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Safety Gear</span> <br />
                            You Can Trust.
                        </h1>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <p className="text-lg md:text-xl mb-10 text-slate-300 max-w-lg leading-relaxed">
                            Premium wholesale traders of Hand Protection, Hillson Gumboots, and Safety Equipment. Protecting your workforce with top-notch quality.
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4">
                        <Button href="/products" icon variant="white" className="shadow-emerald-900/20 shadow-xl border-none">
                            Explore Products
                        </Button>
                        <Button href="/contact" variant="outline" className="border-emerald-500/30 text-emerald-100 hover:bg-emerald-800/30 hover:border-emerald-400 hover:text-white backdrop-blur-md">
                            Contact Us
                        </Button>
                    </FadeIn>
                </div>

                {/* Hero Visual */}
                <div className="hidden lg:block relative">
                    <FadeIn direction="left" delay={0.5} className="relative z-10">
                        {/* Abstract Glass Card Composition */}
                        <div className="relative w-full max-w-lg mx-auto aspect-square">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl"></div>

                            {/* Main Image Card */}
                            <div className="absolute top-10 left-10 right-10 bottom-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition duration-700">
                                {/* Placeholder for high-quality Hero Image */}
                                <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-slate-500">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/shop.webp" alt="STS Enterprises Shop" className="w-full h-full object-cover opacity-90" />
                                </div>
                            </div>

                            {/* Floating Stat Card 1 */}
                            <div className="absolute top-0 right-0 bg-white/90 backdrop-blur border border-white/50 p-4 rounded-2xl shadow-xl transform translate-x-4 translate-y-8 animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-full text-green-700">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Quality</p>
                                        <p className="text-gray-900 font-bold">Guaranteed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
                <span className="text-[10px] uppercase tracking-widest text-emerald-200">Scroll</span>
                <div className="w-[1px] h-8 bg-emerald-400/50"></div>
            </div>
        </section>
    );
}
