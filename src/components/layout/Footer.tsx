import Link from "next/link";
import db from "@/lib/db";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { splitContactValues, extractDigits } from "@/lib/contacts";

export default async function Footer() {
    const [config, categories] = await Promise.all([
        db.appConfig.findUnique({ where: { id: 1 } }),
        db.category.findMany({
            take: 6,
            orderBy: { name: 'asc' }
        })
    ]);

    const phones = splitContactValues(config?.phone);
    const emails = splitContactValues(config?.email);

    return (
        <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Company Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-white rounded-lg p-1 shadow-sm overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo.jpeg" alt="STS Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold font-outfit tracking-tight">
                            {config?.companyName || "STS Enterprises"}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            {config?.companyDesc || "Leading wholesale trader of premium Hand Protection, Safety Gloves, and Industrial Safety Equipment since 1989. Committed to protecting your workforce."}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {config?.facebook && <Link href={config.facebook} className="text-slate-400 hover:text-emerald-400 transition-colors"><Facebook size={20} /></Link>}
                            {config?.instagram && <Link href={config.instagram} className="text-slate-400 hover:text-emerald-400 transition-colors"><Instagram size={20} /></Link>}
                            {config?.twitter && <Link href={config.twitter} className="text-slate-400 hover:text-emerald-400 transition-colors"><Twitter size={20} /></Link>}
                            {config?.linkedin && <Link href={config.linkedin} className="text-slate-400 hover:text-emerald-400 transition-colors"><Linkedin size={20} /></Link>}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold font-outfit mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><Link href="/" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">Home</Link></li>
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">About Us</Link></li>
                            <li><Link href="/products" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">Products</Link></li>
                            <li><Link href="/brands" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">Brands</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Dynamic Categories */}
                    <div>
                        <h4 className="text-lg font-bold font-outfit mb-6 text-white">Top Categories</h4>
                        {categories.length > 0 ? (
                            <ul className="space-y-3 text-sm text-slate-400">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <Link
                                            href={`/categories/${category.slug}`}
                                            className="hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No categories added yet.</p>
                        )}
                        <div className="mt-4">
                            <Link href="/categories" className="text-emerald-500 text-xs font-bold uppercase tracking-wider hover:text-emerald-400 hover:underline">
                                View All &rarr;
                            </Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold font-outfit mb-6 text-white">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3 items-start group">
                                <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                                    <MapPin size={16} />
                                </div>
                                <span className="mt-1 leading-relaxed">{config?.address || "Ranigunj-Secunderabad, Hyderabad, Telangana, India"}</span>
                            </li>

                            {/* Multiple phone numbers */}
                            {phones.length > 0 ? (
                                <li className="flex gap-3 items-start group">
                                    <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {phones.map((phone, i) => (
                                            <a key={i} href={`tel:${extractDigits(phone)}`} className="hover:text-white transition-colors">
                                                {phone}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            ) : (
                                <li className="flex gap-3 items-center group">
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                                        <Phone size={16} />
                                    </div>
                                    <span>+91-0000000000</span>
                                </li>
                            )}

                            {/* Multiple emails */}
                            {emails.length > 0 ? (
                                <li className="flex gap-3 items-start group">
                                    <div className="mt-1 p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <div className="flex flex-col gap-1 mt-1">
                                        {emails.map((email, i) => (
                                            <a key={i} href={`mailto:${email}`} className="hover:text-white transition-colors">
                                                {email}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            ) : (
                                <li className="flex gap-3 items-center group">
                                    <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-emerald-900/50 group-hover:text-emerald-400 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <span>info@stsenterprises.com</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} STS Enterprises. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
