"use client";

import { MessageSquare } from "lucide-react";

export default function AdminMessagesPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 font-outfit">Messages</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 font-outfit">No Messages Yet</h2>
                <p className="text-slate-500 max-w-sm mx-auto">
                    When customers contact you via the form, their messages will appear here.
                </p>
            </div>
        </div>
    );
}
