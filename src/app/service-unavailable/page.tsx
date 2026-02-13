
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = {
    title: "Service Unavailable | STS Enterprises",
    description: "This service is currently unavailable.",
};

export default function ServiceUnavailable() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border border-slate-100">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                    <AlertTriangle size={40} />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Service Unavailable</h1>

                <p className="text-slate-500 mb-8 leading-relaxed">
                    We are currently experiencing technical difficulties or the service is temporarily suspended.
                    Please try again later or contact support if the issue persists.
                </p>

                <div className="flex flex-col gap-3">
                    <Button href="/" variant="primary" className="w-full justify-center">
                        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                    </Button>

                    <a
                        href="mailto:support@stsenterprises.com"
                        className="text-slate-400 text-sm hover:text-emerald-600 transition-colors mt-4"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
