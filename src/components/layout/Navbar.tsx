"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);

    // Check if we are on the home page
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Products", href: "/products" },
        { name: "Categories", href: "/categories" },
        { name: "Brands", href: "/brands" },
        { name: "Contact", href: "/contact" },
    ];

    // Determine if we should use the "dark text / white background" style
    // This happens if we are scrolled OR if we are NOT on the home page (where the header is transparent over a dark hero)
    const useDarkStyle = scrolled || !isHome;

    return (
        <>
            <header
                className={clsx(
                    "fixed w-full z-50 transition-all duration-500 border-b",
                    useDarkStyle
                        ? "bg-white/90 backdrop-blur-xl shadow-lg border-white/20 py-3"
                        : "bg-transparent py-6 border-transparent"
                )}
            >
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="group flex items-center gap-2">
                            <div className="relative w-12 h-12 overflow-hidden rounded-lg bg-white shadow-sm border border-slate-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="/logo.jpeg"
                                    alt="STS Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className={clsx("text-xl font-bold font-outfit leading-none tracking-tight", useDarkStyle ? "text-slate-900" : "text-white")}>
                                    STS <span className={useDarkStyle ? "text-emerald-600" : "text-emerald-300"}>Enterprises</span>
                                </span>
                                <span className={clsx("text-[10px] uppercase tracking-widest font-medium opacity-80", useDarkStyle ? "text-slate-500" : "text-emerald-100")}>
                                    Industrial Safety
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={clsx(
                                        "relative px-4 py-2 text-sm font-semibold transition-colors duration-300 rounded-full font-outfit tracking-wide",
                                        pathname === link.href
                                            ? (useDarkStyle ? "text-emerald-700 bg-emerald-50" : "text-white bg-white/20 backdrop-blur-sm")
                                            : (useDarkStyle ? "text-slate-600 hover:text-emerald-600 hover:bg-slate-50" : "text-white/80 hover:text-white hover:bg-white/10")
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="ml-4 pl-4 border-l border-slate-200/20">
                                <Button
                                    href="/contact"
                                    variant={useDarkStyle ? "primary" : "white"}
                                    className={clsx("text-sm px-6 py-2.5 shadow-xl", !useDarkStyle && "bg-white text-emerald-900 hover:bg-emerald-50 border-none")}
                                >
                                    Get Quote
                                </Button>
                            </div>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            className={clsx(
                                "md:hidden p-2 rounded-lg transition active:scale-95",
                                useDarkStyle ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
                            )}
                            onClick={() => setIsOpen(true)}
                        >
                            <Menu size={28} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm md:hidden"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white shadow-2xl p-8 flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-10">
                                <span className="text-2xl font-bold font-outfit text-slate-900">Menu</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={clsx(
                                                "block text-lg font-bold font-outfit py-3 px-4 rounded-xl transition-all",
                                                pathname === link.href
                                                    ? "text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500"
                                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:pl-6"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <a href="tel:+919876543210" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition">
                                        <Phone size={20} className="mb-2" />
                                        <span className="text-xs font-bold">Call</span>
                                    </a>
                                    <a href="mailto:info@sts.com" className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition">
                                        <Mail size={20} className="mb-2" />
                                        <span className="text-xs font-bold">Email</span>
                                    </a>
                                </div>
                                <Button href="/contact" onClick={() => setIsOpen(false)} className="w-full justify-center">
                                    Get a Quote
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
