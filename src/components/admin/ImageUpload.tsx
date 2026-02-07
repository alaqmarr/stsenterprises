"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    onRemove: (value: string) => void;
    disabled?: boolean;
    maxFiles?: number;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    disabled,
    maxFiles
}: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const uploadToCloudinary = async (file: File) => {
        try {
            // Get signature
            const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
            if (!signRes.ok) throw new Error("Failed to get signature");
            const { signature, timestamp, cloudName, apiKey } = await signRes.json();

            // Upload
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", timestamp.toString());
            formData.append("signature", signature);
            formData.append("folder", "sts-enterprises");

            const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: formData
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const data = await uploadRes.json();

            return data.secure_url;
        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Image upload failed");
            return null;
        }
    };

    const handleFiles = async (files: File[]) => {
        if (maxFiles && (value.length + files.length > maxFiles)) {
            toast.error(`You can only upload a maximum of ${maxFiles} image(s).`);
            return;
        }

        setIsUploading(true);
        const urls: string[] = [];

        for (const file of files) {
            const url = await uploadToCloudinary(file);
            if (url) urls.push(url);
        }

        onChange([...value, ...urls]);
        setIsUploading(false);
    };

    // Global Paste Listener
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData?.files.length) {
                const files = Array.from(e.clipboardData.files);
                // check for images
                const imageFiles = files.filter(f => f.type.startsWith("image/"));
                if (imageFiles.length > 0) {
                    handleFiles(imageFiles);
                }
            }
        }
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, maxFiles]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        await handleFiles(acceptedFiles);
    }, [handleFiles]); // eslint-disable-line

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.webp']
        },
        maxFiles: maxFiles,
        multiple: maxFiles !== 1,
        disabled: disabled || isUploading
    });

    if (!isMounted) return null;

    return (
        <div>
            <div className="mb-4 flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-gray-100 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Uploaded" className="object-cover w-full h-full" />
                        <button
                            title="Remove"
                            onClick={() => onRemove(url)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                            type="button"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            {(!maxFiles || value.length < maxFiles) && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition cursor-pointer flex flex-col items-center justify-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
                    ) : (
                        <Upload className="h-10 w-10 text-gray-400" />
                    )}
                    <p className="text-gray-500 text-sm">
                        {isUploading ? "Uploading..." : "Drag & drop images here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-400">You can also Paste (Ctrl+V) anywhere on the page</p>
                </div>
            )}
        </div>
    );
}
