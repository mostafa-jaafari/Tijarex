import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProductImageGallery from "@/components/SingleProductPage/ProductImageGallery";
import { fetchProductById, fetchAllProducts } from "./fetchProductById";
import { AffiliateProductType, ProductType } from "@/types/product";
import { ProductDetailsClient } from "./ProductDetailsClient";
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
  // --- This section remains unchanged ---
  const { pid, ref } = searchParams;
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
  const [product, allProducts] = await Promise.all([
    fetchProductById(pid),
    fetchAllProducts(),
  ]);
  if (!product) {
    notFound();
  }
  let relatedProducts: ProductType[] = [];
  if (!isAffiliateProduct(product) && product.category) {
    relatedProducts = allProducts
      .filter((p: ProductType) => p.category === product.category)
      .filter((p: ProductType) => p.id !== product.id)
      .filter((p: ProductType) => p.stock > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
  }
  const title = isAffiliateProduct(product)
    ? product.AffiliateTitle
    : product.title;
  // --- End of unchanged section ---

  return (
    <div className="bg-gray-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-6">
        {/* --- ⭐️ POSITIONING CHANGE HERE --- */}
        {/* Replaced the 'flex' container with a 'grid' layout for clean columns. */}
        {/* On large screens (lg:), it creates two columns with a significant gap. */}
        {/* On smaller screens, it automatically stacks them into a single column. */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">

          {/* --- Left Column: Image Gallery (No internal changes) --- */}
          <ProductImageGallery
            key={product.id} 
            images={product.product_images}
            productName={title}
          />

          {/* --- Right Column: Product Details (No internal changes) --- */}
          <ProductDetailsClient 
            key={product.id} 
            product={product} 
          />
        </div>

        {/* --- This lower section remains unchanged --- */}
        {!isAffiliateProduct(product) && (
          <>
            <RelatedProducts 
              products={relatedProducts}
            />
            <div className="mt-16">
              <ProductReviews
                key={product.id}
                id={product.id}
                initialReviews={product.reviews || []}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}