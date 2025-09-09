"use client";

import React, { useState, useRef, useEffect, useMemo } from "react"; // Import useEffect
import Image from "next/image";
import { auth } from "@/lib/FirebaseClient";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { ColorInput } from "@/components/Upload-Products/ColorInput";
import { SizeInput } from "@/components/Upload-Products/SizeInput";
import { CategoryInput } from "@/components/Upload-Products/CategoryInput";
import { Upload, X, Loader2, Info, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { InputStyles } from "@/app/[locale]/page";
import { PermissionCheckBox, ProductPermissions } from "../Upload-Products/UploadPermission";
import { Highlights } from "../Upload-Products/AddHighlights";

// --- Type Definitions ---
interface ProductFile {
    file: File;
    url: string; // Memoized URL to prevent flicker
}

// --- Accordion Component ---
interface AccordionProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AccordionSection = ({ title, children, isOpen, setIsOpen }: AccordionProps) => {
    return (
        <div 
            className="w-full bg-white ring ring-neutral-200 
                rounded-md">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-start items-center 
                    py-2.5 border-b border-transparent cursor-pointer
                    data-[state=open]:border-neutral-200"
                data-state={isOpen ? 'open' : 'closed'}
            >
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6"
                >
                    <ChevronDown 
                        size={20} 
                        className="text-neutral-600"
                    />
                </motion.div>
                <h2 
                    className={`text-md py-2 text-neutral-800
                        ${isOpen ? "font-semibold" : "font-medium"}`}
                >
                    {title}
                </h2>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="py-2.5 px-6">
                             {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


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
    const [permissions, setPermissions] = useState<ProductPermissions>({
        availableForAffiliates: false,
        sellInMarketplace: false,
    });
    const [highlights, setHighlights] = useState<string[]>([]);

    const [productFiles, setProductFiles] = useState<ProductFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessingImages, setIsProcessingImages] = useState(false);
    const [processingFileCount, setProcessingFileCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Accordion State ---
    const [isGeneralOpen, setIsGeneralOpen] = useState(true);
    const [isPricingOpen, setIsPricingOpen] = useState(true);
    const [isImagesOpen, setIsImagesOpen] = useState(true);
    const [isVariantsOpen, setIsVariantsOpen] = useState(true);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(true);
    const [isHighlightsOpen, setIsHighlightsOpen] = useState(true);


    // --- CRUCIAL: Cleanup Object URLs to prevent memory leaks ---
    useEffect(() => {
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
            URL.revokeObjectURL(fileToRemove.url);
        }
        setProductFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // --- Submission Logic ---
    const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isSubmitting || isProcessingImages) return;

        const requiredFields = { title, salePrice, stock, category, permissions };
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
                    const file = productFile.file;
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
                original_sale_price: parseFloat(salePrice),
                original_regular_price: salePrice ? parseFloat(regularPrice) : null,
                stock: parseInt(stock, 10),
                colors,
                sizes,
                product_images: uploadedImageUrls,
                currency: 'DH',
                permissions: permissions,
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

    const isPriceInvalid = useMemo(() => {
        const regNum = parseFloat(regularPrice);
        const saleNum = parseFloat(salePrice);
        if (!isNaN(saleNum) && !isNaN(regNum)) {
            return saleNum >= regNum;
        }
        return false;
    }, [regularPrice, salePrice]);
    
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
                    <p className="mt-1 text-sm text-neutral-500">Add a new item to your marketplace inventory.</p>
                    </div>
                </header>

                <fieldset 
                    disabled={isSubmitting} 
                    className="max-w-7xl mx-auto grid grid-cols-1 
                        lg:grid-cols-5 gap-3 pb-24"
                >
                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-3 space-y-3">
                        <AccordionSection 
                            title="Title & Description" 
                            isOpen={isGeneralOpen} 
                            setIsOpen={setIsGeneralOpen}
                        >
                            <div className="space-y-2.5">
                                <div>
                                    <label 
                                        htmlFor="title" 
                                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                                    >
                                        Title
                                    </label>
                                    <input 
                                        id="title" 
                                        type="text" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        placeholder="e.g., Premium Cotton Hoodie" 
                                        className={InputStyles}
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between">
                                    <label 
                                        htmlFor="description" 
                                        className="block text-sm font-medium text-neutral-700 mb-1.5">Description</label>
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
                        </AccordionSection>

                        <AccordionSection 
                            title="Category & Pricing" 
                            isOpen={isPricingOpen} 
                            setIsOpen={setIsPricingOpen}
                        >
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {isPriceInvalid && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="py-2 px-3 rounded-lg bg-yellow-100 border text-yellow-800 border-yellow-300 text-sm flex items-center gap-2"
                                        >
                                            <Info size={16}/> 
                                            <span className="font-semibold">Sale Price</span> must be lower than the <span className="font-semibold">Regular Price.</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div>
                                    <label 
                                        className="block text-sm font-medium text-neutral-700 
                                            mb-1.5"
                                    >
                                        Category
                                    </label>
                                    <CategoryInput 
                                        category={category} 
                                        setCategory={setCategory} 
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <div>
                                        <label
                                            htmlFor="regularPrice" 
                                            className="block text-sm font-medium 
                                            text-neutral-700 mb-1.5"
                                        >
                                            Regular Price (Optional)
                                        </label>
                                        <input 
                                            id="regularPrice" 
                                            type="number" 
                                            value={regularPrice} 
                                            onChange={e => setRegularPrice(e.target.value)} 
                                            placeholder="299.99 Dh" 
                                            className={InputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label 
                                            htmlFor="salePrice" 
                                            className="block text-sm font-medium text-neutral-700 
                                                mb-1.5"
                                        >
                                            Sale Price
                                        </label>
                                        <input 
                                            id="salePrice" 
                                            type="number" 
                                            value={salePrice} 
                                            onChange={e => setSalePrice(e.target.value)} 
                                            placeholder="249.99 Dh" 
                                            className={InputStyles}
                                        />
                                    </div>
                                    <div>
                                        <label 
                                            htmlFor="stock" 
                                            className="block text-sm font-medium text-neutral-700 
                                                mb-1.5"
                                        >
                                            Stock Quantity
                                        </label>
                                        <input 
                                            id="stock" 
                                            type="number" 
                                            value={stock} 
                                            onChange={e => setStock(e.target.value)} 
                                            placeholder="99 Unit"
                                            className={InputStyles}
                                        />
                                    </div>
                                </div>
                            </div>
                        </AccordionSection>

                        <AccordionSection title="Images" isOpen={isImagesOpen} setIsOpen={setIsImagesOpen}>
                            <div>
                                <label
                                    htmlFor="UploadImages"
                                    className="block text-sm font-medium text-neutral-700"
                            >
                                Product Photos (Max 5)
                            </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    id="UploadImages"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative mt-1.5 w-full flex flex-col 
                                        items-center justify-center p-6 border-2 
                                        border-dashed rounded-lg transition-colors 
                                        ${isDragging ? 
                                            'border-neutral-500 bg-neutral-50'
                                            :
                                            'border-neutral-300'} 
                                            ${isSubmitting || isProcessingImages ? 
                                                'cursor-not-allowed opacity-60'
                                                :
                                                'cursor-pointer hover:border-neutral-400'}
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
                        </AccordionSection>
                    </div>

                    {/* --- RIGHT COLUMN --- */}
                    <div className="lg:col-span-2 space-y-3">
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
                        
                        <AccordionSection 
                            title="Sizes & Colors" 
                            isOpen={isVariantsOpen} 
                            setIsOpen={setIsVariantsOpen}
                        >
                            <div className="space-y-2.5">
                                <div>
                                    <label 
                                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                                    >
                                        Size
                                    </label>
                                    <SizeInput 
                                        sizes={sizes} 
                                        setSizes={setSizes}
                                    />
                                </div>
                                <div>
                                    <label 
                                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                                    >
                                        Color
                                    </label>
                                    <ColorInput 
                                        colors={colors} 
                                        setColors={setColors}
                                    />
                                </div>
                            </div>
                        </AccordionSection>

                        <AccordionSection title="Permissions" isOpen={isPermissionsOpen} setIsOpen={setIsPermissionsOpen}>
                            <PermissionCheckBox 
                                permissions={permissions}
                                setPermissions={setPermissions}
                            />
                        </AccordionSection>

                        <AccordionSection title="Highlights" isOpen={isHighlightsOpen} setIsOpen={setIsHighlightsOpen}>
                            <Highlights
                                highlights={highlights}
                                setHighlights={setHighlights}
                            />
                        </AccordionSection>

                        <div className="fixed bottom-0 left-0 w-full bg-white py-3 px-4 border-t border-neutral-200 shadow-t-lg z-20">
                    <div className="max-w-7xl mx-auto flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isProcessingImages ||
                                !title ||
                                !salePrice ||
                                isPriceInvalid ||
                                !stock ||
                                !category ||
                                sizes.length === 0 ||
                                colors.length === 0 ||
                                productFiles.length === 0 ||
                                (!permissions.availableForAffiliates && !permissions.sellInMarketplace) ||
                                (permissions.availableForAffiliates && permissions.sellInMarketplace)
                            }
                            className="px-6 py-3 text-sm font-semibold text-white 
                                cursor-pointer bg-neutral-600 rounded-lg hover:bg-neutral-700 
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
                    </div>
                </fieldset>
            </form>
        </motion.section>
    );
};