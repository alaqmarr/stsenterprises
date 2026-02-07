import Link from "next/link";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    variant?: "primary" | "outline" | "ghost" | "white";
    className?: string;
    icon?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}

export default function Button({ href, onClick, children, variant = "primary", className, icon, type = "button", disabled }: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    const variants = {
        primary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-200 hover:shadow-xl",
        outline: "border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50",
        ghost: "text-emerald-700 hover:bg-emerald-50",
        white: "bg-white text-emerald-900 hover:bg-gray-100 shadow-lg"
    };

    const content = (
        <>
            {children}
            {icon && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={clsx(baseStyles, variants[variant], className, "group")}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={clsx(baseStyles, variants[variant], className, "group")}>
            {content}
        </button>
    );
}
