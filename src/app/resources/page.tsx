import fs from "fs";
import path from "path";
import Link from "next/link";
import { FileText, Image as ImageIcon, Download, File } from "lucide-react";
import FadeIn from "@/components/ui/FadeIn";

export const dynamic = "force-dynamic";

export default function ResourcesPage() {
    const resourcesDir = path.join(process.cwd(), "public/resources");
    let resources: string[] = [];

    try {
        if (fs.existsSync(resourcesDir)) {
            const files = fs.readdirSync(resourcesDir);
            // Filter for common resource types
            resources = files.filter((file) => /\.(pdf|jpg|jpeg|png|webp|svg|doc|docx|xls|xlsx|ppt|pptx)$/i.test(file));
        }
    } catch (error) {
        console.error("Error reading resources directory:", error);
    }

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (["jpg", "jpeg", "png", "webp", "svg"].includes(ext!)) return <ImageIcon className="text-emerald-500" size={32} />;
        if (ext === "pdf") return <FileText className="text-red-500" size={32} />;
        return <File className="text-slate-400" size={32} />;
    };

    const getFileTypeLabel = (fileName: string) => {
        const ext = fileName.split(".").pop()?.toUpperCase();
        return ext || "FILE";
    };

    return (
        <main className="min-h-screen pt-24 pb-12 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <FadeIn>
                        <h1 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Downloads & Resources</h1>
                        <p className="text-slate-500 text-lg">Technical documents, catalogs, and other resources.</p>
                    </FadeIn>
                </div>

                {resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((file, i) => (
                            <FadeIn key={file} delay={i * 0.05}>
                                <a
                                    href={`/resources/${file}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-200 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-emerald-50 transition-colors">
                                            {getFileIcon(file)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 truncate transition-colors" title={file}>
                                                {file}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">{getFileTypeLabel(file)}</p>
                                        </div>
                                        <div className="text-slate-300 group-hover:text-emerald-500 transition-colors">
                                            <Download size={20} />
                                        </div>
                                    </div>
                                </a>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500">No resources available at the moment.</p>
                        <p className="text-sm text-slate-400 mt-2">Please check back later.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
