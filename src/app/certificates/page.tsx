import fs from "fs";
import path from "path";
import FadeIn from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";

export default function CertificatesPage() {
    const certificatesDir = path.join(process.cwd(), "public/certificates");
    let certificates: string[] = [];

    try {
        if (fs.existsSync(certificatesDir)) {
            const files = fs.readdirSync(certificatesDir);
            certificates = files.filter((file) => /\.(jpg|jpeg|png|webp|svg)$/i.test(file));
        }
    } catch (error) {
        console.error("Error reading certificates directory:", error);
    }

    return (
        <main className="min-h-screen pt-24 pb-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Certifications</h1>
                        <p className="text-slate-500 text-lg">Our commitment to quality and safety standards.</p>
                    </FadeIn>
                </div>

                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certificates.map((cert, i) => (
                            <FadeIn key={cert} delay={i * 0.1}>
                                <div className="relative overflow-hidden rounded-xl bg-slate-50 transition-all duration-300 group hover:shadow-lg">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/certificates/${cert}`}
                                        alt={`Certificate ${cert}`}
                                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No certificates found.</p>
                        <p className="text-sm text-slate-400 mt-2">Please add images to the public/certificates folder.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
