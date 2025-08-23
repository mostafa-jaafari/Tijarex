"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";
import { ColorInput, ColorOption } from "@/components/Upload-Products/ColorInput";
import { SizeInput, SizeOption } from "@/components/Upload-Products/SizeInput";
import { UploadCloud, X, Loader2, CheckCircle2, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

// Define the type for the upload progress state
interface UploadProgress {
    [fileName: string]: number;
}

// --- Reusable Form Components ---
const FormSection = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {children}
    </div>
);

const LabeledInput = ({ label, id, children }: { label: string; id: string; children: React.ReactNode }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        {children}
    </div>
);

/**
 * NEW skeleton component for image processing.
 */
const ImageProcessingSkeleton = ({ count }: { count: number }) => (
    <>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="relative aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
    </>
);


export default function UploadProductPage() {
    // --- State Management ---
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [currentCategory, setCurrentCategory] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [stock, setStock] = useState("");
    const [colors, setColors] = useState<ColorOption[]>([]);
    const [sizes, setSizes] = useState<SizeOption[]>([]);
    const [isTrend, setIsTrend] = useState(false);
    
    // File & Upload State
    const [productFiles, setProductFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [processingFileCount, setProcessingFileCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
    
    // Component State
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [purchaseType, setPurchaseType] = useState('fixed');

    // --- Form Reset Logic ---
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategories([]);
        setCurrentCategory("");
        setRegularPrice("");
        setSalePrice("");
        setStock("");
        setColors([]);
        setSizes([]);
        setIsTrend(false);
        setProductFiles([]);
        setFileErrors([]);
    };

    // --- Category & File Handling ---
    const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentCategory.trim() !== "") {
            e.preventDefault();
            if (!categories.includes(currentCategory.trim())) {
                setCategories([...categories, currentCategory.trim()]);
            }
            setCurrentCategory("");
        }
    };

    const removeCategory = (indexToRemove: number) => {
        setCategories(categories.filter((_, index) => index !== indexToRemove));
    };

    const processFiles = async (files: File[]) => {
        if (!files.length) return;
        
        setIsProcessingImages(true);
        setProcessingFileCount(files.length);
        setFileErrors([]);

        const newFiles: File[] = [];
        const errors: string[] = [];
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                errors.push(`${file.name}: Is not an image.`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                errors.push(`${file.name}: Exceeds 10MB limit.`);
                continue;
            }
            try {
                const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
                newFiles.push(compressedFile);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Image compression failed.");
                newFiles.push(file);
            }
        }
        
        setProductFiles(prev => [...prev, ...newFiles]);
        setFileErrors(errors);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        setIsProcessingImages(false);
        setProcessingFileCount(0);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        processFiles(files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const removeFile = (indexToRemove: number) => {
        setProductFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Form Submission Logic ---
    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError(null);
        setUploadSuccess(false);

        if (!title || !regularPrice || productFiles.length === 0 || colors.length === 0 || sizes.length === 0) {
            setFormError("Please fill all required fields: Title, Price, Images, Colors, and Sizes.");
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            setFormError("You must be logged in to upload a product.");
            return;
        }
        
        setIsSubmitting(true);
        setUploadProgress({});

        try {
            const uploadedImageUrls = await Promise.all(productFiles.map(async (file) => {
                const timestamp = Math.round(new Date().getTime() / 1000);
                const publicId = `products/${user.uid}/${Date.now()}_${file.name}`;
                
                const signatureResponse = await fetch('/api/cloudinary/sign-upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paramsToSign: { timestamp, public_id: publicId } }),
                });
                const { signature } = await signatureResponse.json();
                if (!signature) throw new Error("Could not get upload signature.");

                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
                formData.append("timestamp", timestamp.toString());
                formData.append("public_id", publicId);
                formData.append("signature", signature);

                return new Promise<string>((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`);
                    
                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const percentCompleted = Math.round((event.loaded * 100) / event.total);
                            setUploadProgress(prev => ({ ...prev, [file.name]: percentCompleted }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            const cloudinaryData = JSON.parse(xhr.responseText);
                            resolve(cloudinaryData.secure_url);
                        } else {
                            const cloudinaryData = JSON.parse(xhr.responseText);
                            reject(new Error(cloudinaryData.error?.message || "A file failed to upload."));
                        }
                    };
                    xhr.onerror = () => reject(new Error("Network error during file upload."));
                    xhr.send(formData);
                });
            }));

            const productData = { /* ...product data object... */ };
            const idToken = await user.getIdToken(true);
            const apiResponse = await fetch('/api/products/create', { /* ...API request... */ });

            if (!apiResponse.ok) { /* ...error handling... */ }

            setUploadSuccess(true);
            toast.success("Product listed successfully!");
            resetForm();
            
        } catch (err: unknown) {
            console.error("Product submission error:", err);
            setFormError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section
            className="w-full flex justify-center"
        >
            <div className="bg-gray-50/50 w-full max-w-3/4 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create Item</h1>
                        <p className="text-gray-500 mt-1">Dashboard / Create Item</p>
                    </header>
                    
                    <form onSubmit={handleProductSubmit}>
                        <fieldset disabled={isSubmitting} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* --- Main Content (Left Column) --- */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* File Upload */}
                                <FormSection title="Upload File">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`relative w-full h-56 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${isDragging ? 'border-teal-600 bg-teal-50' : 'border-gray-300'} ${isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer hover:border-teal-500'}`}
                                    >
                                        <UploadCloud size={48} className="text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">Max 10MB, PNG, JPG</p>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                                    </div>
                                    {fileErrors.length > 0 && <p className="text-sm text-red-600 mt-2">{fileErrors.join(', ')}</p>}

                                    {/* NEW: Image Preview Grid with Loading State */}
                                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-4">
                                        {productFiles.map((file, i) => (
                                            <div key={i} className="relative group aspect-square border rounded-lg overflow-hidden">
                                                <Image src={URL.createObjectURL(file)} alt="preview" fill style={{objectFit:"cover"}} />
                                                <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-white/70 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X size={16} />
                                                </button>
                                                {isSubmitting && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <div className="w-10/12 bg-gray-200 rounded-full h-2">
                                                            <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${uploadProgress[file.name] || 0}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {isProcessingImages && <ImageProcessingSkeleton count={processingFileCount} />}
                                    </div>
                                </FormSection>

                                {/* Purchase Type */}
                                <FormSection title="Purchase Type">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className={`p-4 border-2 rounded-lg cursor-pointer ${purchaseType === 'fixed' ? 'border-teal-600' : 'border-gray-200'}`}>
                                            <h4 className="font-semibold text-gray-800">Fixed Price</h4>
                                            <p className="text-sm text-gray-500">Set a fixed price for your product.</p>
                                        </div>
                                        <div className="p-4 border-2 rounded-lg bg-gray-100 cursor-not-allowed opacity-60">
                                            <h4 className="font-semibold text-gray-500">Timed Auction</h4>
                                            <p className="text-sm text-gray-400">Not available.</p>
                                        </div>
                                        <div className="p-4 border-2 rounded-lg bg-gray-100 cursor-not-allowed opacity-60">
                                            <h4 className="font-semibold text-gray-500">Open for Bids</h4>
                                            <p className="text-sm text-gray-400">Not available.</p>
                                        </div>
                                    </div>
                                </FormSection>
                                
                                {/* Main Details */}
                                <FormSection title="Main Details">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                                        <div className="md:col-span-2">
                                            <LabeledInput label="Product Title" id="title">
                                                <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Handcrafted Wooden Chair" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                            </LabeledInput>
                                        </div>
                                        <LabeledInput label="Regular Price (DH)" id="regularPrice">
                                            <input id="regularPrice" type="number" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} placeholder="350.00" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </LabeledInput>
                                        <LabeledInput label="Sale Price (Optional)" id="salePrice">
                                            <input id="salePrice" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="275.00" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </LabeledInput>

                                        <div className="md:col-span-2">
                                            <LabeledInput label="Categories" id="category">
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {categories.map((cat, index) => (
                                                        <div key={index} className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium pl-3 pr-2 py-1 rounded-full">
                                                            {cat}
                                                            <button type="button" onClick={() => removeCategory(index)} className="ml-1.5 flex-shrink-0 h-5 w-5 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-300 hover:text-gray-700 focus:outline-none">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <input id="category" type="text" value={currentCategory} onChange={e => setCurrentCategory(e.target.value)} onKeyDown={handleCategoryKeyDown} placeholder="Type a category and press Enter..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                            </LabeledInput>
                                        </div>
                                        <LabeledInput label="Colors" id="colors">
                                            <ColorInput colors={colors} setColors={setColors} />
                                        </LabeledInput>
                                        <LabeledInput label="Sizes" id="sizes">
                                            <SizeInput sizes={sizes} setSizes={setSizes} />
                                        </LabeledInput>
                                        <LabeledInput label="Stock Quantity" id="stock">
                                            <input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="95" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </LabeledInput>
                                        
                                        <div className="md:col-span-2">
                                            <LabeledInput label="Description" id="description">
                                                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the product in detail..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"></textarea>
                                            </LabeledInput>
                                        </div>
                                    </div>
                                </FormSection>

                                {/* Submit Button Area */}
                                <div className="pt-4">
                                    {formError && <div className="bg-red-50 text-red-800 p-3 rounded-lg mb-4 text-sm flex items-center"><AlertTriangle size={16} className="inline mr-2" />{formError}</div>}
                                    {uploadSuccess && <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-4 text-sm flex items-center"><CheckCircle2 size={16} className="inline mr-2" />Success! Your product has been listed.</div>}
                                    
                                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-10 py-3 flex items-center justify-center border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-wait">
                                        {isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Publishing...</> : "Create Item"}
                                    </button>
                                </div>
                            </div>

                            {/* --- Preview (Right Column) --- */}
                            <aside className="space-y-8">
                                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                                <div className="bg-white p-4 flex-shrink-0 min-w-[300px] rounded-xl border border-gray-200 shadow-sm sticky top-20">
                                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4">
                                        {productFiles.length > 0 ? (
                                            <Image 
                                                src={URL.createObjectURL(productFiles[0])} 
                                                alt="preview" 
                                                fill 
                                                style={{objectFit:"cover"}}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <ImageIcon className="text-gray-400" size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-bold text-lg text-gray-900 truncate">{title || "Product Title"}</h4>
                                    <div className="flex items-center gap-2 mt-1 mb-3">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                        <span className="text-sm text-gray-500">{auth.currentUser?.displayName || "Creator Name"}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                                        <span className="text-sm text-gray-600">Price</span>
                                        <span className="font-semibold text-teal-700">{regularPrice ? `${regularPrice} DH` : "0.00 DH"}</span>
                                    </div>
                                </div>
                            </aside>
                        </fieldset>
                    </form>
                </div>
            </div>
        </section>
    );
}