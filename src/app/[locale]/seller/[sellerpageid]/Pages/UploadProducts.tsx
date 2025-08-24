"use client";

import React, { useState, useRef, useEffect } from "react"; // Import useEffect
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { ColorInput, ColorOption } from "@/components/Upload-Products/ColorInput";
import { SizeInput, SizeOption } from "@/components/Upload-Products/SizeInput";
import { CategoryInput } from "@/components/CategoryInput";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BlackButtonStyles } from "@/components/Header";

// --- Type Definitions ---
interface UploadProgress { [fileName: string]: number; }
interface ProductFile {
    file: File;
    url: string; // Memoized URL to prevent flicker
}

const ImageProcessingSkeleton = ({ count }: { count: number }) => (
    Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
    ))
);

// --- Main Page Component ---
export default function UploadProductPage() {
    // --- State Management ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [regularPrice, setRegularPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [stock, setStock] = useState("");
    const [colors, setColors] = useState<ColorOption[]>([]);
    const [sizes, setSizes] = useState<SizeOption[]>([]);
    const [productFiles, setProductFiles] = useState<ProductFile[]>([]); // <-- UPDATED STATE
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [processingFileCount, setProcessingFileCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- CRUCIAL: Cleanup Object URLs to prevent memory leaks ---
    useEffect(() => {
        // This function will be called when the component unmounts
        return () => {
            productFiles.forEach(productFile => URL.revokeObjectURL(productFile.url));
        };
    }, [productFiles]);

    // --- Form Reset Logic ---
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategories([]);
        setRegularPrice("");
        setSalePrice("");
        setStock("");
        setColors([]);
        setSizes([]);
        setProductFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // --- File Handling Logic (Updated to memoize URLs) ---
    const processFiles = async (files: File[]) => {
        if (!files.length) return;
        if (productFiles.length + files.length > 5) {
            toast.error("You can only upload a maximum of 5 images.");
            return;
        }
        setIsProcessingImages(true);
        setProcessingFileCount(files.length);

        const newProductFiles: ProductFile[] = [];
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name}: Is not a valid image file.`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name}: Exceeds the 10MB size limit.`);
                continue;
            }
            try {
                const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
                // Create the URL ONCE and store it
                newProductFiles.push({ file: compressedFile, url: URL.createObjectURL(compressedFile) });
            } catch (err) {
                toast.error(`Could not process ${file.name}.`);
                console.error(err);
                newProductFiles.push({ file, url: URL.createObjectURL(file) });
            }
        }
        
        setProductFiles(prev => [...prev, ...newProductFiles].slice(0, 5));
        if (fileInputRef.current) fileInputRef.current.value = "";
        setIsProcessingImages(false);
        setProcessingFileCount(0);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => processFiles(Array.from(e.target.files || []));
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        processFiles(Array.from(e.dataTransfer.files));
    };
    
    const removeFile = (indexToRemove: number) => {
        const fileToRemove = productFiles[indexToRemove];
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.url); // Clean up the specific URL from memory
        }
        setProductFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Submission Logic ---
    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting || isProcessingImages) return;

        if (!title || !regularPrice || !stock || productFiles.length === 0) {
            toast.error("Please fill required fields: Title, Price, Stock, and Images.");
            return;
        }
        
        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in to upload a product.");
            return;
        }

        setIsSubmitting(true);
        setUploadProgress({});
        toast.info("Uploading images, please wait...");

        try {
            const uploadedImageUrls = await Promise.all(
                productFiles.map(productFile => {
                    const file = productFile.file; // Use the file from our state object
                    return new Promise<string>(async (resolve, reject) => {
                        const publicId = `products/${user.uid}/${Date.now()}_${file.name}`;
                        const timestamp = Math.round(new Date().getTime() / 1000);
                        const paramsToSign = { public_id: publicId, timestamp };

                        const sigResponse = await fetch('/api/cloudinary/sign-upload', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paramsToSign }),
                        });
                        if (!sigResponse.ok) return reject(new Error("Failed to get upload signature."));
                        
                        const { signature } = await sigResponse.json();
                        if (!signature) return reject(new Error("Invalid signature received."));

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
                        formData.append("timestamp", timestamp.toString());
                        formData.append("public_id", publicId);
                        formData.append("signature", signature);

                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const percent = Math.round((event.loaded * 100) / event.total);
                                setUploadProgress(prev => ({ ...prev, [file.name]: percent }));
                            }
                        };
                        xhr.onload = () => {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                resolve(JSON.parse(xhr.responseText).secure_url);
                            } else {
                                reject(new Error(JSON.parse(xhr.responseText).error?.message || "A file failed to upload."));
                            }
                        };
                        xhr.onerror = () => reject(new Error("Network error during file upload."));
                        xhr.send(formData);
                    });
                })
            );
            toast.success("Images uploaded! Saving product details...");

            const productData = {
                title, name: title, description, category: categories,
                regular_price: parseFloat(regularPrice),
                sale_price: salePrice ? parseFloat(salePrice) : null,
                stock: parseInt(stock, 10),
                colors, sizes, product_images: uploadedImageUrls,
                status: 'active', currency: 'DH',
            };

            const idToken = await user.getIdToken(true);
            const apiResponse = await fetch('/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(productData),
            });

            if (!apiResponse.ok) {
                const errorData = await apiResponse.json();
                throw new Error(errorData.error || "Failed to save product on the server.");
            }

            toast.success("Product created successfully!");
            resetForm();

        } catch (error) {
            const message = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full p-3 flex flex-col items-center"
        >
            <form 
                className="w-full"
                onSubmit={handleProductSubmit}>
                <header 
                    className={`p-6 max-w-7xl mx-auto flex items-center 
                        justify-between mb-6 rounded-lg
                        ${BlackButtonStyles}`}
                >
                    <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Upload Product</h1>
                    <p className="mt-2 text-gray-400">Add a new item to your marketplace inventory.</p>
                    </div>
                </header>

                <fieldset disabled={isSubmitting} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg border border-gray-300 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800">Product Details</h2>
                    
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">Name Product</label>
                        <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Premium Cotton Hoodie" className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                        <CategoryInput categories={categories} setCategories={setCategories} />
                    </div>
                    
                    <div>
                        <div className="flex justify-between">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                        <span className="text-xs text-gray-400">{description.length}/1000</span>
                        </div>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} maxLength={1000} placeholder="Describe the key features of your product..." className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all"></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                        <label htmlFor="regularPrice" className="block text-sm font-semibold text-gray-700 mb-1.5">Regular Price (DH)</label>
                        <input id="regularPrice" type="number" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} placeholder="299.99" className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all" />
                        </div>
                        <div>
                        <label htmlFor="salePrice" className="block text-sm font-semibold text-gray-700 mb-1.5">Sale Price (Optional)</label>
                        <input id="salePrice" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="249.99" className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all" />
                        </div>
                        <div>
                        <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                        <input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="99" className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-800 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all" />
                        </div>
                    </div>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-300 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Product Photos (Max 5)</label>
                        <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                        className={`relative mt-1.5 w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'} ${isSubmitting || isProcessingImages ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-teal-400'}`}
                        >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" disabled={isSubmitting || isProcessingImages} />
                        <div className="text-center text-gray-500">
                            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                            <p className="text-sm font-semibold text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs mt-1">Max 10MB per file. Up to 5 images.</p>
                        </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {(productFiles.length > 0 || isProcessingImages) && (
                        <motion.div layout className="grid grid-cols-4 gap-4">
                            {productFiles.map((productFile, i) => (
                            <motion.div 
                                key={productFile.url}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }} 
                                animate={{ opacity: 1, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group aspect-square border 
                                    border-gray-200 rounded-lg overflow-hidden"
                            >
                                <Image src={productFile.url} alt="preview" fill sizes="20vw" className="object-cover" />
                                <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-black/40 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all z-10">
                                    <X size={14} />
                                </button>
                            </motion.div>
                            ))}
                            {isProcessingImages && <ImageProcessingSkeleton count={processingFileCount} />}
                        </motion.div>
                        )}
                    </AnimatePresence>
                    
                    <div className="space-y-4 pt-2">
                        <h3 className="text-base font-semibold text-gray-800">Variant</h3>
                        <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Size</label>
                        <SizeInput sizes={sizes} setSizes={setSizes} />
                        </div>
                        <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Color</label>
                        <ColorInput colors={colors} setColors={setColors} />
                        </div>
                        </div>
                        <div className="w-full flex items-center 
                            justify-end gap-3">
                            <button
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    isProcessingImages ||
                                    !title ||
                                    !regularPrice ||
                                    !stock ||
                                    categories.length === 0 ||
                                    sizes.length === 0 ||
                                    colors.length === 0 ||
                                    productFiles.length === 0
                                }
                                className="px-6 py-3 text-sm font-semibold text-white 
                                    bg-teal-600 rounded-lg hover:bg-teal-700 
                                    disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                <span>{isSubmitting ? 'Uploading...' : 'Upload Product'}</span>
                            </button>
                        </div>
                        </div>
                </fieldset>
            </form>
        </motion.section>
    );
};