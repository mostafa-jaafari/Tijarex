"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";
import { ColorInput, ColorOption } from "@/components/Upload-Products/ColorInput";
import { SizeInput, SizeOption } from "@/components/Upload-Products/SizeInput";
import { UploadCloud, X, Loader2, CheckCircle2, AlertTriangle, Package, DollarSign, ClipboardList } from "lucide-react";

export default function UploadProductPage() {
    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [regularPrice, setRegularPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [stock, setStock] = useState("");
    const [colors, setColors] = useState<ColorOption[]>([]);
    const [sizes, setSizes] = useState<SizeOption[]>([]);
    const [isTrend, setIsTrend] = useState(false);

    // File Upload State
    const [productFiles, setProductFiles] = useState<File[]>([]);
    const [fileErrors, setFileErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // General Component State
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    
    // --- File Handling Logic (Same as before) ---
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
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
                newFiles.push(file);
            }
        }
        setProductFiles(prev => [...prev, ...newFiles]);
        setFileErrors(errors);
        if (fileInputRef.current) fileInputRef.current.value = "";
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

        try {
            // Step 1: Upload images to Cloudinary
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

                const uploadResponse = await fetch( `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
                const cloudinaryData = await uploadResponse.json();
                if (!uploadResponse.ok) throw new Error(cloudinaryData.error?.message || "A file failed to upload.");
                
                return cloudinaryData.secure_url;
            }));

            // Step 2: Prepare the final product data object
            const productData = {
                title,
                name: title, // 'name' and 'title' seem to be the same in your structure
                description,
                category,
                regular_price: parseFloat(regularPrice),
                sale_price: salePrice ? parseFloat(salePrice) : parseFloat(regularPrice),
                stock: parseInt(stock, 10) || 0,
                status: (parseInt(stock, 10) || 0) > 0 ? "In Stock" : "Out of Stock",
                currency: "Dh",
                colors: colors.map((c, i) => ({ ...c, selected: i === 0 })), // Set first color as selected
                sizes,
                isTrend,
                product_images: uploadedImageUrls
            };
            
            // Step 3: Submit data to our backend
            const idToken = await user.getIdToken(true);
            const apiResponse = await fetch('/api/products/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
                body: JSON.stringify(productData),
            });

            const result = await apiResponse.json();
            if (!apiResponse.ok) throw new Error(result.error || "Failed to create the product.");

            // Step 4: Handle Success
            setUploadSuccess(true);
            // Reset form could go here
            
        } catch (err: unknown) {
            console.error("Product submission error:", err);
            setFormError(err instanceof Error ? err.message : "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Render Logic ---
    return (
        <div className="w-full bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">List a New Product</h1>
                    <p className="text-gray-600 mt-1">Provide detailed information to add your item to the marketplace.</p>
                </div>

                <form onSubmit={handleProductSubmit} className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                    {/* Section 1: Core Details */}
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Core Details</h3>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Product Title <span className="text-red-500">*</span></label>
                            <input id="title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Amazing Handcrafted Wooden Chair" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the product..." className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input id="category" type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., Electronics" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>

                    {/* Section 2: Pricing & Stock */}
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Pricing & Stock</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="regularPrice" className="block text-sm font-medium text-gray-700 mb-1">Regular Price (DH) <span className="text-red-500">*</span></label>
                                <input id="regularPrice" type="number" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} placeholder="350.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">Sale Price (Optional)</label>
                                <input id="salePrice" type="number" value={salePrice} onChange={e => setSalePrice(e.target.value)} placeholder="275.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input id="stock" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="95" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Section 3: Variants */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 mb-3">Colors <span className="text-red-500">*</span></h3>
                             <ColorInput colors={colors} setColors={setColors} />
                        </div>
                        <div>
                             <h3 className="text-lg font-semibold text-gray-800 mb-3">Sizes <span className="text-red-500">*</span></h3>
                             <SizeInput sizes={sizes} setSizes={setSizes} />
                        </div>
                    </div>

                    {/* Section 4: Images */}
                    <div className="p-6 space-y-4">
                         <h3 className="text-lg font-semibold text-gray-800">Product Images <span className="text-red-500">*</span></h3>
                         <div onClick={() => fileInputRef.current?.click()} className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                             <UploadCloud size={32} className="text-gray-400 mb-2" />
                             <span className="text-sm font-semibold text-blue-600">Click to upload</span>
                             <span className="text-xs text-gray-500 mt-1">PNG, JPG (Max 10MB)</span>
                         </div>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
                         {fileErrors.length > 0 && <p className="text-sm text-red-600">{fileErrors.join(', ')}</p>}
                         {productFiles.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {productFiles.map((file, i) => (
                                    <div key={i} className="relative group aspect-square border rounded-lg overflow-hidden">
                                        <Image src={URL.createObjectURL(file)} alt="preview" layout="fill" objectFit="cover" />
                                        <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 p-1 bg-white/70 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         )}
                    </div>
                    
                    {/* Section 5: Metadata & Submission */}
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                             <input type="checkbox" id="isTrend" checked={isTrend} onChange={e => setIsTrend(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                             <label htmlFor="isTrend" className="ml-2 block text-sm text-gray-900">Mark as a trending product</label>
                        </div>

                         {formError && <div className="bg-red-50 text-red-800 p-3 rounded-lg mb-4 text-sm"><AlertTriangle size={16} className="inline mr-2" />{formError}</div>}
                         {uploadSuccess && <div className="bg-green-50 text-green-800 p-3 rounded-lg mb-4 text-sm"><CheckCircle2 size={16} className="inline mr-2" />Success! Your product has been listed.</div>}
                        
                         <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300">
                             {isSubmitting ? <><Loader2 size={20} className="animate-spin mr-2" /> Publishing...</> : "Publish Product"}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
}