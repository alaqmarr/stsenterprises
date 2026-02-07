"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function Counter({
    value,
    direction = "up",
    label,
}: {
    value: number;
    direction?: "up" | "down";
    label?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value);
        }
    }, [isInView, motionValue, direction, value]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Number(latest.toFixed(0))
                );
            }
        });
    }, [springValue]);

    return (
        <div className="flex flex-col items-center">
            <span className="flex text-4xl font-bold text-green-700">
                <span ref={ref} />
                {label && <span className="ml-1">{label}</span>}
            </span>
        </div>
    );
}
