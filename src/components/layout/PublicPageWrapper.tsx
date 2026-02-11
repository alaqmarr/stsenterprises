"use client";

import { usePathname } from "next/navigation";

export default function PublicPageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/api");

    if (isAdmin) return null;

    return <>{children}</>;
}
