// File: app/[locale]/c/shop/product/[productId]/page.tsx

import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductImageGallery from "@/components/SingleProductPage/ProductImageGallery";
// --- ⭐️ FIXED: Import both fetch functions ---
import { fetchProductById, fetchAllProducts } from "./fetchProductById";
import { AffiliateProductType, ProductType } from "@/types/product";
import { ProductDetailsClient } from "./ProductDetailsClient";
// --- ⭐️ FIXED: Assume correct component paths ---
import { ProductReviews } from "./ProductReviews";
import { RelatedProducts } from "./RelatedProducts";

// --- Helper type guard ---
function isAffiliateProduct(
  product: ProductType | AffiliateProductType
): product is AffiliateProductType {
  return "AffiliateTitle" in product;
}

// --- Main Page Component (Server Component) ---
export default async function ProductPage({
  searchParams,
}: {
  searchParams: { pid?: string; ref?: string };
}) {
  const { pid, ref } = searchParams;

  // --- Affiliate Referral Cookie Logic ---
  if (ref) {
    (await cookies()).set("referralid", ref, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30-day expiration
      path: "/",
    });
  }

  if (!pid) {
    notFound();
  }

  // --- ⭐️ FIXED: Efficient Parallel Data Fetching ---
  const [product, allProducts] = await Promise.all([
    fetchProductById(pid),
    fetchAllProducts(),
  ]);

  if (!product) {
    notFound();
  }

  // --- Related Products Filtering Logic ---
  let relatedProducts: ProductType[] = [];
  if (!isAffiliateProduct(product) && product.category) {
    relatedProducts = allProducts
      .filter((p: ProductType) => p.category === product.category)
      // --- ⭐️ FIXED: Use `id` for comparison, not `id` ---
      .filter((p: ProductType) => p.id !== product.id)
      .filter((p: ProductType) => p.stock > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }

  const title = isAffiliateProduct(product)
    ? product.AffiliateTitle
    : product.title;

  return (
    <div className="bg-gray-50">
      {/* --- ⭐️ FIXED: All page content should be inside <main> --- */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-6">
        <div className="lg:grid lg:grid-cols-12 lg:items-start">
          {/* --- Left Column: Image Gallery --- */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <ProductImageGallery
              // --- ⭐️ FIXED: Use `id` for key ---
              key={product.id} 
              images={product.product_images}
              productName={title}
            />
          </div>

          {/* --- Right Column: Product Details --- */}
          <ProductDetailsClient 
            // --- ⭐️ FIXED: Use `id` for key ---
            key={product.id} 
            product={product} 
          />
        </div>

        {/* --- ⭐️ FIXED: Related/Reviews sections are now inside main --- */}
        {!isAffiliateProduct(product) && (
          <>
            {/* 1. Related Products Section */}
            <RelatedProducts 
              products={relatedProducts}
            />
            
            {/* 2. Reviews Section */}
            <div className="mt-16">
              <ProductReviews
                // --- ⭐️ FIXED: Use `id` for productId prop ---
                id={product.id}
                initialReviews={product.reviews || []}
                averageRating={product.rating || 0}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}