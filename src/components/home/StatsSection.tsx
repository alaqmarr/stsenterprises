"use client";

import Counter from "@/components/ui/Counter";
import FadeIn from "@/components/ui/FadeIn";

export default function StatsSection() {
    const stats = [
        { value: 30, label: "+", text: "Years of Experience" },
        { value: 500, label: "+", text: "Products Available" },
        { value: 90, label: "%", text: "Client Satisfaction" },
        { value: 1000, label: "+", text: "Orders Delivered" },
    ];

    return (
        <section className="py-20 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x-0 md:divide-x divide-gray-100">
                    {stats.map((stat, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="p-4">
                                <Counter value={stat.value} label={stat.label} />
                                <p className="text-slate-500 mt-2 font-medium text-sm md:text-base">{stat.text}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
