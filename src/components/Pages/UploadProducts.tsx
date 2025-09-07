"use client";

import React, { useState, useRef, useEffect } from "react"; // Import useEffect
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { ColorInput } from "@/components/Upload-Products/ColorInput";
import { SizeInput } from "@/components/Upload-Products/SizeInput";
import { CategoryInput } from "@/components/Upload-Products/CategoryInput";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InputStyles } from "@/app/[locale]/page";
// --- Type Definitions ---
interface ProductFile {
    file: File;
    url: string; // Memoized URL to prevent flicker
}

const ImageProcessingSkeleton = ({ count }: { count: number }) => (
    Array.from({ length: count }).map((_, i) => (
        <div key={i} className="relative aspect-square bg-neutral-200 rounded-lg animate-pulse"></div>
    ))
);

// --- Main Page Component ---
export default function UploadProducts() {
    // --- State Management ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<string>("");
    const [regularPrice, setRegularPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [stock, setStock] = useState("");
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<string[]>([]);
    const [productFiles, setProductFiles] = useState<ProductFile[]>([]); // <-- UPDATED STATE
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [processingFileCount, setProcessingFileCount] = useState(0);
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
        setCategory("");
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

        const requiredFields = { title, regularPrice, stock, category };
        const missingFields = Object.entries(requiredFields)
            .filter(([value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0 || productFiles.length === 0 || sizes.length === 0 || colors.length === 0) {
            toast.error(`Please fill all required fields. Missing: ${missingFields.join(', ')}`);
            return;
        }
        
        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in to upload a product.");
            return;
        }

        setIsSubmitting(true);
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
                title,
                description,
                category,
                original_regular_price: parseFloat(regularPrice),
                original_sale_price: salePrice ? parseFloat(salePrice) : null,
                stock: parseInt(stock, 10),
                colors,
                sizes,
                product_images: uploadedImageUrls,
                currency: 'DH',
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
                    className={`max-w-7xl mx-auto flex items-center 
                        justify-between mb-6 rounded-lg`}
                >
                    <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-700">Upload Product</h1>
                    <p className="text-sm text-neutral-500">Add a new item to your marketplace inventory.</p>
                    </div>
                </header>

                <fieldset 
                    disabled={isSubmitting} 
                    className="max-w-7xl mx-auto grid grid-cols-1 
                        lg:grid-cols-5 gap-6"
                >
                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-3 space-y-3">
                        {/* --- Title & Description --- */}
                        <div
                            className="w-full bg-white border-b border-purple-400/80 ring 
                                    ring-purple-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg"
                        >
                            <h2 
                                className="py-2.5 px-6 border-b border-neutral-200 text-lg font-semibold text-neutral-800"
                            >
                                Title & Description
                            </h2>
                            
                            <div
                                className="py-2.5 px-6 space-y-2.5"
                            >
                                <div>
                                    <label 
                                        htmlFor="title" 
                                        className="block text-sm font-semibold text-neutral-700 mb-1.5"
                                    >
                                        Title
                                    </label>
                                    <input 
                                        id="title" 
                                        type="text" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        placeholder="e.g., Premium Cotton Hoodie" 
                                        className={`${InputStyles}`}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                    <label htmlFor="description" className="block text-sm font-semibold text-neutral-700 mb-1.5">Description</label>
                                    <span className="text-xs text-neutral-400">{description.length}/1000</span>
                                    </div>
                                    <textarea 
                                        id="description" 
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)} 
                                        rows={5}
                                        maxLength={1000}
                                        placeholder="Describe the key features of your product..." 
                                        className={InputStyles}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        {/* --- Category --- */}
                        <div
                            className="bg-white rounded-lg 
                                shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] border-b 
                                border-purple-400/80 ring ring-purple-200"
                        >
                            <h2 
                                className="py-2.5 px-6 border-b border-neutral-200 text-lg font-semibold text-neutral-800"
                            >
                                Category & Price
                            </h2>
                            {/* --- Input --- */}
                            <div className="px-6 pt-2.5">
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Category</label>
                                <CategoryInput 
                                    category={category} 
                                    setCategory={setCategory} 
                                />
                            </div>

                            <div className="py-2.5 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div>
                                    <label htmlFor="regularPrice" className="block text-sm font-semibold text-neutral-700 mb-1.5">Regular Price (DH)</label>
                                    <div
                                        className="flex items-center border-b border-purple-400
                                            ring ring-purple-200 rounded-lg bg-white 
                                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-10 
                                            overflow-hidden gap-3 focus-within:ring-purple-400
                                            focus-within:border-violet-600"
                                    >
                                        <span
                                            className="bg-purple-600 text-neutral-200 
                                                font-semibold h-full flex justify-center 
                                                items-center px-4"
                                        >
                                            Dh
                                        </span>
                                        <input 
                                            id="regularPrice" 
                                            type="number" 
                                            value={regularPrice} 
                                            onChange={e => setRegularPrice(e.target.value)} 
                                            placeholder="299.99" 
                                            className="w-full py-2.5 text-neutral-800 
                                                placeholder:text-neutral-400 
                                                focus:outline-none 
                                                transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="salePrice" className="block text-sm font-semibold text-neutral-700 mb-1.5">Sale Price (Optional)</label>
                                    <div
                                        className="flex items-center border-b border-purple-400
                                            ring ring-purple-200 rounded-lg bg-white 
                                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-10 
                                            overflow-hidden gap-3 focus-within:ring-purple-400
                                            focus-within:border-violet-600"
                                    >
                                        <span
                                            className="bg-purple-600 text-neutral-200 
                                                font-semibold h-full flex justify-center 
                                                items-center px-4"
                                        >
                                            Dh
                                        </span>
                                        <input 
                                            id="salePrice" 
                                            type="number" 
                                            value={salePrice} 
                                            onChange={e => setSalePrice(e.target.value)} 
                                            placeholder="249.99" 
                                            className="w-full py-2.5 text-neutral-800 
                                                placeholder:text-neutral-400 
                                                focus:outline-none 
                                                transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-semibold text-neutral-700 mb-1.5">Stock Quantity</label>
                                    <div
                                        className="flex items-center border-b border-purple-400
                                            ring ring-purple-200 rounded-lg bg-white 
                                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] h-10 
                                            overflow-hidden gap-3 focus-within:ring-purple-400
                                            focus-within:border-violet-600"
                                    >
                                        <span
                                            className="bg-purple-600 text-neutral-200 
                                                font-semibold h-full flex justify-center 
                                                items-center px-4"
                                        >
                                            U
                                        </span>
                                        <input 
                                            id="stock" 
                                            type="number" 
                                            value={stock} 
                                            onChange={e => setStock(e.target.value)} 
                                            placeholder="99" 
                                            className="w-full py-2.5 text-neutral-800 
                                                placeholder:text-neutral-400 
                                                focus:outline-none 
                                                transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-3">
                    <div
                        className="bg-white rounded-lg 
                            border-b border-purple-400 ring ring-purple-200 
                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)]"
                    >
                        <h3 
                            className="py-2.5 px-6 border-b border-neutral-200 text-lg font-semibold text-neutral-800">
                                Colors & Sizes
                        </h3>
                        <div
                            className="py-2.5 px-6"
                        >
                            <label className="block text-sm font-semibold text-neutral-700">Product Photos (Max 5)</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative mt-1.5 w-full flex flex-col 
                                    items-center justify-center p-6 border-2 
                                    border-dashed rounded-lg transition-colors 
                                    ${isDragging ? 
                                        'border-purple-500 bg-purple-50'
                                        :
                                        'border-neutral-300'} 
                                        ${isSubmitting || isProcessingImages ? 
                                            'cursor-not-allowed opacity-60'
                                            :
                                            'cursor-pointer hover:border-purple-400'}
                                            `}
                            >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                className="hidden"
                                disabled={isSubmitting || isProcessingImages}
                            />
                            <div className="text-center text-neutral-500">
                                <Upload size={24} className="mx-auto mb-2 text-neutral-400" />
                                <p className="text-sm font-semibold text-neutral-600">Click to upload or drag and drop</p>
                                <p className="text-xs mt-1">Max 10MB per file. Up to 5 images.</p>
                            </div>
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
                                    border-neutral-200 rounded-lg overflow-hidden"
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
                    
                    <div
                        className="bg-white border-b 
                            border-purple-400 ring ring-purple-200
                            shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04)] rounded-lg"
                    >
                        <h3 
                            className="py-2.5 px-6 border-b border-neutral-200 text-lg font-semibold text-neutral-800">
                                Colors & Sizes
                        </h3>
                        <div className="px-6 py-2.5 space-y-2.5">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Size</label>
                                <SizeInput sizes={sizes} setSizes={setSizes} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Color</label>
                                <ColorInput colors={colors} setColors={setColors} />
                            </div>
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
                                !category ||
                                sizes.length === 0 ||
                                colors.length === 0 ||
                                productFiles.length === 0
                            }
                            className="px-6 py-3 text-sm font-semibold text-white 
                                cursor-pointer bg-purple-600 rounded-lg hover:bg-purple-700 
                                disabled:bg-neutral-300 
                                disabled:text-neutral-500 
                                disabled:cursor-not-allowed 
                                transition-colors flex items-center gap-2"
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