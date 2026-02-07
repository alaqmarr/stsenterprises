"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Category, Brand } from "@/generated/prisma/client";

interface ProductFilterSheetProps {
    categories: Category[];
    brands: Brand[];
    currentCategory?: string;
    currentBrand?: string;
}

export default function ProductFilterSheet({ categories, brands, currentCategory, currentBrand }: ProductFilterSheetProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Filter Trigger Button */}
            <div className="lg:hidden mb-6">
                <Button onClick={() => setIsOpen(true)} className="w-full flex items-center justify-between" variant="outline">
                    <span className="flex items-center gap-2"><SlidersHorizontal size={18} /> Filters</span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                        {(currentCategory ? 1 : 0) + (currentBrand ? 1 : 0)} Active
                    </span>
                </Button>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-over Sheet */}
            <div className={`fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-900 font-outfit">Filters</h3>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Categories */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3">Categories</h4>
                            <div className="space-y-2">
                                <Link
                                    href="/products"
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-sm py-2 px-3 rounded-lg transition-colors ${!currentCategory ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    All Categories
                                </Link>
                                {categories.map(c => (
                                    <Link
                                        key={c.id}
                                        href={`/products?category=${c.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`block text-sm py-2 px-3 rounded-lg transition-colors ${currentCategory === c.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Brands */}
                        <div>
                            <h4 className="font-semibold text-slate-800 mb-3">Brands</h4>
                            <div className="space-y-2">
                                <Link
                                    href="/products"
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-sm py-2 px-3 rounded-lg transition-colors ${!currentBrand ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    All Brands
                                </Link>
                                {brands.map(b => (
                                    <Link
                                        key={b.id}
                                        href={`/products?brand=${b.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className={`block text-sm py-2 px-3 rounded-lg transition-colors ${currentBrand === b.slug ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {b.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50">
                        <Button href="/products" variant="primary" className="w-full" onClick={() => setIsOpen(false)}>
                            Clear All Filters
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
