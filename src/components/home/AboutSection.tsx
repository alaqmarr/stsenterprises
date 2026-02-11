import Link from "next/link";
import FadeIn from "@/components/ui/FadeIn";
import { CheckCircle2, ShieldCheck, Truck, Users } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AboutSection() {
    const features = [
        {
            icon: <ShieldCheck size={28} className="text-emerald-600" />,
            title: "Premium Quality",
            description: "Certified safety equipment meeting international standards."
        },
        {
            icon: <Truck size={28} className="text-emerald-600" />,
            title: "Fast Delivery",
            description: "Reliable shipping across India for bulk and retail orders."
        },
        {
            icon: <Users size={28} className="text-emerald-600" />,
            title: "Expert Support",
            description: "Dedicated team to help you choose the right protection."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-32 opacity-50 pointer-events-none" />

            <div className="container mx-auto px-6 relative">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Text Content */}
                    <div className="flex-1 space-y-8">
                        <FadeIn>
                            <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2 block">Who We Are</span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 font-outfit leading-tight">
                                Your Trusted Partner in <span className="text-emerald-600">Industrial Safety</span>
                            </h2>
                        </FadeIn>

                        <FadeIn delay={0.1}>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                At STS Enterprises, we are dedicated to providing top-tier safety solutions for industries across the board.
                                From precision hand protection to heavy-duty footwear, our catalog is curated to ensure the maximum safety and comfort of your workforce.
                                We are authorized distributors of Hillson Gumboots and specialize in a wide range of protective gear.
                            </p>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-100 transition-colors">
                                        <div className="bg-white p-2 rounded-lg shadow-sm shrink-0">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{feature.title}</h4>
                                            <p className="text-sm text-slate-500">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.3} className="pt-4">
                            <Button href="/about">
                                Learn More About Us
                            </Button>
                        </FadeIn>
                    </div>

                    {/* Image/Visual Content */}
                    <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center">
                        <FadeIn delay={0.2} className="relative w-full h-full">
                            <div className="absolute inset-0 bg-slate-200 rounded-3xl -rotate-6 scale-95 opacity-50"></div>
                            <div className="absolute inset-0 bg-slate-100 rounded-3xl rotate-3 scale-95 opacity-80"></div>
                            <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex items-center justify-center group">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/shop.webp" alt="STS Enterprises" className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <ShieldCheck size={24} className="text-emerald-400" />
                                        <span className="font-bold tracking-wider uppercase text-sm">Est. 1995</span>
                                    </div>
                                    <h3 className="text-2xl font-bold font-outfit">STS Enterprises</h3>
                                    <p className="text-slate-200 text-sm">Your Safety, Our Priority</p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
