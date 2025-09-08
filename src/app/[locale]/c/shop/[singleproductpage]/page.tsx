// File: app/[locale]/c/shop/product/[productId]/page.tsx

import { notFound } from "next/navigation";
import { cookies } from "next/headers"; // <-- Import cookies function
import ProductImageGallery from "@/components/SingleProductPage/ProductImageGallery";
import { fetchProductById } from "./fetchProductById";
import { AffiliateProductType, ProductType } from "@/types/product";
import { ProductDetailsClient } from "./ProductDetailsClient"; // Assuming client component is in its own file
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
  // --- Correctly type searchParams to accept both pid and ref ---
  searchParams: { pid?: string; ref?: string };
}) {
  const { pid, ref } = searchParams;

  // --- ⭐️ IMPORTANT: Affiliate Referral Cookie Logic (Server-Side) ---
  // If a referral code `ref` is present in the URL, set a cookie to track the affiliate.
  if (ref) {
    (await cookies()).set("referral_id", ref, {
      httpOnly: true, // Recommended for security
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30-day expiration
      path: "/", // Cookie available across the entire site
    });
  }

  // --- Product Fetching Logic ---
  if (!pid) {
    notFound();
  }
  const product = await fetchProductById(pid);
  if (!product) {
    notFound();
  }

  // --- ⭐️ Fetch Related Products on the Server ---
  let relatedProducts: ProductType[] = [];
  // Only find related products if the current one is a standard product with a category
  if (!isAffiliateProduct(product) && product.category) {
    const Res = await fetch("/api/products");
    const data = await Res.json();
    relatedProducts = data.products
      // 1. Filter by the same category
      .filter((p: ProductType) => p.category === product.category)
      // 2. Exclude the current product from the list
      .filter((p: ProductType) => p.id !== product.id)
      // 3. (Optional but recommended) Exclude out-of-stock products
      .filter((p: ProductType) => p.stock > 0)
      // 4. Shuffle the results for variety on each page load
      .sort(() => 0.5 - Math.random())
      // 5. Take the first 8 products from the shuffled list
      .slice(0, 8);
  }
  // This logic stays on the server as it's a prop for a server component
  const title = isAffiliateProduct(product)
    ? product.AffiliateTitle
    : product.title;

  // --- Render the page ---
  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-16 lg:py-6">
        <div className="lg:grid lg:grid-cols-12 lg:items-start">
          {/* --- Left Column: Image Gallery (Server Component) --- */}
          <div className="lg:col-span-7 lg:sticky lg:top-20">
            <ProductImageGallery
              key={product.id}
              images={product.product_images}
              productName={title}
            />
          </div>

          {/* --- Right Column: Renders the Client Component for interactivity --- */}
          <ProductDetailsClient key={product.id} product={product} />
        </div>
      </main>
      {/* --- Reviews Section --- */}
      {!isAffiliateProduct(product) && (
        <>
          {/* 1. Related Products Section */}
          <RelatedProducts products={relatedProducts} />
          
          {/* 2. Reviews Section */}
          <div className="mt-16">
            <ProductReviews
              productId={product.id}
              initialReviews={product.reviews || []}
              averageRating={product.rating || 0}
            />
          </div>
        </>
      )}
    </div>
  );
}