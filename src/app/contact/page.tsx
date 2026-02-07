"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Phone, Send, Loader2 } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function ContactPage() {
    const [config, setConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });

    useEffect(() => {
        fetch("/api/admin/settings")
            .then((res) => res.json())
            .then((data) => setConfig(data))
            .catch((err) => console.error(err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submission for UI demo
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setIsLoading(false);
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-slate-50">
            {/* Header */}
            <section className="bg-emerald-900 text-white py-20 mb-12 -mt-24 pb-32">
                <div className="container mx-auto px-6 text-center">
                    <FadeIn>
                        <h1 className="text-5xl font-bold mb-4 font-outfit">Get in Touch</h1>
                        <p className="text-emerald-200 text-lg">We&apos;re here to help with your safety equipment needs.</p>
                    </FadeIn>
                </div>
            </section>

            <div className="container mx-auto px-6 -mt-24 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Card */}
                    <FadeIn className="lg:col-span-1">
                        <div className="bg-emerald-800 text-white p-8 rounded-2xl shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-700 rounded-full blur-3xl -mr-16 -mt-16"></div>

                            <div>
                                <h2 className="text-2xl font-bold mb-8 font-outfit relative z-10">Contact Information</h2>
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-emerald-300 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-100 mb-1">Visit Us</p>
                                            <p className="text-white/90 leading-relaxed">{config?.address || "Loading..."}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone className="text-emerald-300 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-100 mb-1">Call Us</p>
                                            <p className="text-white/90">{config?.phone || "Loading..."}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Mail className="text-emerald-300 mt-1 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-emerald-100 mb-1">Email Us</p>
                                            <p className="text-white/90">{config?.email || "Loading..."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 relative z-10">
                                {/* Social Links placeholder */}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Contact Form */}
                    <FadeIn delay={0.2} className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 h-full">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 font-outfit">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none bg-slate-50 focus:bg-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none bg-slate-50 focus:bg-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition outline-none bg-slate-50 focus:bg-white"
                                        placeholder="How can we help you?"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={18} />}
                                        {isLoading ? "Sending..." : "Send Message"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </FadeIn>
                </div>

                {/* Map Section */}
                <FadeIn delay={0.3} className="mt-12">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="aspect-[21/9] w-full bg-slate-200 rounded-xl overflow-hidden relative">
                            {/* Placeholder for Map */}
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                <MapPin size={48} className="mb-2" />
                                <span className="font-semibold block ml-2">Google Maps Integration</span>
                            </div>
                            <iframe
                                className="w-full h-full opacity-60 hover:opacity-100 transition-opacity duration-500"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.467464731835!2d78.48667131481775!3d17.43827678804706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9a06f7aa3f0f%3A0x6a0c0b0a0b0a0b0a!2sRanigunj%2C%20Secunderabad!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
