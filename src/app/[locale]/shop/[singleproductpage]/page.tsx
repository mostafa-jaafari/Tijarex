// File: app/[locale]/shop/product/[productId]/page.tsx

import { Check, Star, Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductImageGallery from '@/components/SingleProductPage/ProductImageGallery';
import AddToCartButtons from '@/components/SingleProductPage/AddToCartButtons';
import { getAffiliateInfoFromCookie } from '@/components/Functions/GenerateUniqueRefLink';
import { AffiliateProductType, ProductType } from '@/types/product'; // Import both types

// --- Helper type guard to safely check the product type ---
function isAffiliateProduct(product: ProductType | AffiliateProductType): product is AffiliateProductType {
  return (product as AffiliateProductType).AffiliateTitle !== undefined;
}

// --- Corrected props for a dynamic route ---
// The page now receives `params` for the ID and `searchParams` for the referral code.
type ProductPageProps = {
  searchParams: {
    ref?: string;
    pid?: string;
  };
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { ref, pid } = searchParams;
  if (!pid) {
    notFound(); // If no ID is in the URL, show 404
  }

  // --- REFERRAL LOGIC (No change needed) ---
  const cookieStore = cookies();
  const referralCookie = (await cookieStore).get('referral_id');
  const affiliateInfo = referralCookie ? getAffiliateInfoFromCookie(referralCookie.value) : null;
  // ---

  // --- Data fetching using the unified API route ---
  // This is the same robust method used in QuickViewProduct.
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${pid}`, {
    cache: 'no-store', // Ensures fresh data for stock levels, etc.
  });
  
  if (!response.ok) {
    notFound(); // The API will correctly trigger a 404 if the product isn't found
    return;
  }

  const { product } = await response.json();
  if (!product) {
    notFound();
  }

  // --- Type-Safe Property Access ---
  // Use the type guard to safely get the correct properties for either product type.
  const title = isAffiliateProduct(product) ? product.AffiliateTitle : product.title;
  const description = isAffiliateProduct(product) ? product.AffiliateDescription : product.description;
  const salePrice = isAffiliateProduct(product) ? product.AffiliateSalePrice : product.original_sale_price;
  const regularPrice = isAffiliateProduct(product) ? product.AffiliateRegularPrice : product.original_regular_price;
  // Provide defaults for properties that only exist on the original ProductType
  const rating = !isAffiliateProduct(product) ? product.rating : 0;
  const reviews = !isAffiliateProduct(product) ? product.reviews : [];

  // Corrected logic for checking if the product is on sale.
  const isOnSale = regularPrice && salePrice < regularPrice;
  
  const highlights = [ "Made from 100% full-grain leather", "Slim bifold design", "Holds up to 8 cards and cash", "Hand-stitched for durability" ];

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
          
          <ProductImageGallery images={product.product_images} productName={title} />

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">

            {affiliateInfo && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-200">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <span>
                        You were referred by: <strong className="font-semibold">{affiliateInfo.affiliateId}</strong>
                    </span>
                </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-neutral-700">{title}</h1>
            
            <div className="mt-3">
              <p className="text-3xl tracking-tight text-neutral-700">
                ${salePrice.toFixed(2)}
              </p>
              {isOnSale && (
                  <span className="ml-2 text-xl text-neutral-500 line-through">
                      ${regularPrice.toFixed(2)}
                  </span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 flex-shrink-0 ${rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <a href="#reviews" className="ml-3 text-sm font-medium text-neutral-500 hover:text-neutral-700">
                  {reviews?.length || 0} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-neutral-500">
                <p>{description}</p>
              </div>
            </div>
            
            <p className={`mt-4 text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            <AddToCartButtons />

            <section aria-labelledby="details-heading" className="mt-12">
              <div className="divide-y divide-gray-200 border-t">
                  <div className="py-6">
                      <h3 className="text-lg font-medium text-neutral-700">Highlights</h3>
                      <ul className="mt-4 list-disc list-inside space-y-2">
                          {highlights.map((highlight) => (
                              <li key={highlight} className="flex items-center text-neutral-500">
                                  <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                  <span>{highlight}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}