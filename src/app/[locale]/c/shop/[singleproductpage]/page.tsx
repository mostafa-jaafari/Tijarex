// File: app/[locale]/c/shop/product/[productId]/page.tsx

import { Check, Star, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductImageGallery from "@/components/SingleProductPage/ProductImageGallery";
import { getAffiliateInfoFromCookie } from "@/components/Functions/GenerateUniqueRefLink";
import {
  AffiliateProductType,
  ProductType,
} from "@/types/product";
import { fetchProductById } from "./fetchProductById";
import {
  AddToCartButtons,
  SingleProductColors,
  SingleProductQuantity,
  SingleProductSizes,
} from "@/components/SingleProductPage/SingleProductColors";

// --- Helper type guard to safely check the product type ---
function isAffiliateProduct(
  product: ProductType | AffiliateProductType
): product is AffiliateProductType {
  return (product as AffiliateProductType).AffiliateTitle !== undefined;
}

// --- Component Props for the dynamic route ---
type ProductPageProps = {
  searchParams: {
    ref?: string;
    pid?: string;
  };
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { pid } = searchParams;
  if (!pid) {
    notFound(); // If no product ID is in the URL, show a 404 page
  }

  // --- Referral Logic ---
  const cookieStore = cookies();
  const referralCookie = (await cookieStore).get("referral_id");
  const affiliateInfo = referralCookie
    ? getAffiliateInfoFromCookie(referralCookie.value)
    : null;

  const product = await fetchProductById(pid);
  if (!product) {
    notFound(); // If the product fetch fails, show a 404 page
  }

  // --- Type-Safe Property Access ---
  const title = isAffiliateProduct(product) ? product.AffiliateTitle : product.title;
  const description = isAffiliateProduct(product) ? product.AffiliateDescription : product.description;
  const salePrice = isAffiliateProduct(product) ? product.AffiliateSalePrice : product.original_sale_price;
  const regularPrice = isAffiliateProduct(product) ? product.AffiliateRegularPrice : product.original_regular_price;
  const ProductColors = isAffiliateProduct(product) ? product.colors : product.colors;
  const ProductSizes = isAffiliateProduct(product) ? product.sizes : product.sizes;
  const rating = !isAffiliateProduct(product) ? product.rating : 0;
  const reviews = !isAffiliateProduct(product) ? product.reviews : [];

  const isOnSale = regularPrice && salePrice < regularPrice;

  // --- Static data for demonstration ---
  const highlights = [
    "Crafted with premium materials",
    "Designed for modern aesthetics",
    "Eco-friendly packaging",
    "Durable and built to last",
  ];

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl py-6 px-3">
        <div className="lg:grid lg:grid-cols-12 lg:items-start">
          {/* --- Image Gallery (with sticky positioning restored) --- */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <ProductImageGallery images={product.product_images} productName={title} />
          </div>

          {/* --- Product Information --- */}
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            {/* Header: Title, Price, and Reviews */}
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {title}
              </h1>

              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold tracking-tight text-gray-900">
                  {salePrice.toFixed(2)} dh
                  {isOnSale && (
                    <span className="ml-3 text-xl font-medium text-gray-400 line-through">
                      {regularPrice.toFixed(2)} dh
                    </span>
                  )}
                </p>

                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 flex-shrink-0 ${
                          rating > i
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <a
                    href="#reviews"
                    className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    ({reviews?.length || 0} reviews)
                  </a>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            {/* Options & Actions Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-800">Description</h3>
                <p className="mt-2 text-base text-gray-600">{description}</p>
              </div>

              {/* Color & Size Selectors */}
              <div className="space-y-4">
                <SingleProductColors ProductColors={ProductColors} />
                <SingleProductSizes ProductSizes={ProductSizes} />
              </div>

              {/* Stock Status */}
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                  product.stock > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mt-6 flex w-full items-stretch gap-3">
                <SingleProductQuantity />
                <div className="flex-grow">
                  <AddToCartButtons />
                </div>
              </div>
            </div>
            
            {/* Details & Highlights Section */}
            <section aria-labelledby="details-heading" className="mt-10">
              <div className="divide-y divide-gray-200 border-t border-gray-200">
                <div className="py-6">
                  <h3 className="text-base font-medium text-gray-900">
                    Product Highlights
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center text-sm text-gray-600">
                        <Check
                          className="mr-3 h-5 w-5 flex-shrink-0 text-green-500"
                          aria-hidden="true"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="py-6">
                   <h3 className="text-base font-medium text-gray-900">
                    Our Guarantee
                  </h3>
                   <div className="flex items-center mt-4 text-sm text-gray-600">
                       <ShieldCheck className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500" aria-hidden="true"/>
                       <span>Secure payments & 30-day money-back guarantee.</span>
                   </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}