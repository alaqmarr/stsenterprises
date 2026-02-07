import FadeIn from "@/components/ui/FadeIn";
import { ShieldCheck, Users, Trophy, Target, Award, HardHat } from "lucide-react";

export default function AboutPage() {
    const stats = [
        { label: "Years Experience", value: "30+" },
        { label: "Products", value: "500+" },
        { label: "Happy Clients", value: "95%" },
        { label: "Quality Assured", value: "100%" },
    ];

    const values = [
        {
            icon: ShieldCheck,
            title: "Uncompromised Safety",
            description: "We never cut corners on quality. Every glove, boot, and helmet is tested to meet rigorous safety standards."
        },
        {
            icon: Users,
            title: "Customer First",
            description: "From our first handshake in 1989 to today, our relationships are built on trust, transparency, and service."
        },
        {
            icon: Trophy,
            title: "Market Leaders",
            description: "Recognized as the premier wholesale partner for industrial safety gear across the region."
        },
        {
            icon: Target,
            title: "Precision Delivery",
            description: "Getting the right gear to your workforce exactly when you need it. Reliability is our promise."
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50 pt-24">
            {/* Hero Section - Clean White with Emerald Typography */}
            <section className="relative py-20 px-6 overflow-hidden bg-white border-b border-slate-100">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <FadeIn>
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-5xl md:text-7xl font-bold mb-8 font-outfit text-slate-900 tracking-tight">
                                Delivering <span className="text-emerald-600">Safety</span> <br /> Since 1989.
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
                                Wholesale traders of premium Hand Protection, Hillson Gumboots, and Industrial Safety Equipment.
                            </p>
                        </div>
                    </FadeIn>
                </div>

                {/* Abstract Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl"></div>
                    <div className="absolute top-[40%] -left-[10%] w-[300px] h-[300px] bg-slate-100 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Stats Section - High Contrast */}
            <section className="py-12 bg-emerald-900 border-y border-emerald-800">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-emerald-800/50">
                        {stats.map((stat, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="p-4">
                                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 font-outfit">{stat.value}</h3>
                                    <p className="text-emerald-200 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Company Story - Split Layout */}
            <section className="py-24 px-6 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <FadeIn className="relative">
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                                {/* Using a placeholder for now, would be replaced by actual warehouse/team image */}
                                <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative group">
                                    <HardHat className="text-slate-300 w-32 h-32 absolute transition-all duration-500 group-hover:scale-110 group-hover:text-emerald-200" strokeWidth={1} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                                </div>
                            </div>
                            {/* Floating Card */}
                            <div className="absolute -bottom-10 -right-10 w-64 bg-white p-8 rounded-xl shadow-xl border border-slate-100 hidden md:block z-20">
                                <Award className="w-12 h-12 text-emerald-600 mb-4" />
                                <div className="text-slate-900 font-bold text-lg font-outfit">Certified Excellence</div>
                                <div className="text-slate-500 text-sm mt-1">ISO 9001:2015 Compliant Standards</div>
                            </div>
                        </FadeIn>

                        <div className="space-y-8">
                            <FadeIn delay={0.2}>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-6">
                                    Over 3 Decades of <br /> <span className="text-emerald-600">Trust & Innovation</span>
                                </h2>
                                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                                    <p>
                                        Founded in Hyderabad, <span className="font-semibold text-slate-900">STS Enterprises</span> began with a single mission: to provide the local workforce with protective gear that doesn't compromise on comfort or cost.
                                    </p>
                                    <p>
                                        Today, we have evolved into a major wholesale distributor, partnering with industry giants to supply everything from heavy-duty Gumboots to precision hand protection. Our growth is fueled by a simple philosophy: **Your safety is our business.**
                                    </p>
                                    <p>
                                        Whether you are a small construction unit or a large-scale manufacturing plant, we have the inventory and logistics to meet your demands instantly.
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Grid - Clean Cards */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20 max-w-2xl mx-auto">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-outfit mb-4">Why Choose STS?</h2>
                            <p className="text-slate-600 text-lg">We don&#39;t just sell products; we deliver peace of mind. Here is what sets us apart.</p>
                        </FadeIn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((val, i) => (
                            <FadeIn key={i} delay={i * 0.1} className="h-full">
                                <div className="bg-white p-8 rounded-2xl h-full border border-slate-100 hover:border-emerald-200 card-hover group transition-all">
                                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <val.icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{val.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{val.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
