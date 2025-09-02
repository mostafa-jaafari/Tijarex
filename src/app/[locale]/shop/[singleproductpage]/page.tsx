import { Check, Star, Info } from 'lucide-react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import ProductImageGallery from '@/components/SingleProductPage/ProductImageGallery';
import AddToCartButtons from '@/components/SingleProductPage/AddToCartButtons';
import { fetchProductById } from '@/components/SingleProductPage/fetchProductById';
import { getAffiliateInfoFromCookie } from '@/components/Functions/GenerateUniqueRefLink';

// The props are now based on the dynamic path `[productId]`
type ProductPageProps = {
  searchParams: {
    ref?: string;
    pid?: string;
  };
};

export default async function ProductPage({ searchParams }: ProductPageProps) {

  // --- CORRECTED REFERRAL LOGIC ---
  const cookieStore = cookies();
  const referralCookie = (await cookieStore).get('referral_id');
  // Use the new function that does NOT try to decode
  const affiliateInfo = referralCookie ? getAffiliateInfoFromCookie(referralCookie.value) : null;
  // ---

  // --- CORRECTED DATA FETCHING ---
  // Get the product ID from the dynamic path `params`, not searchParams.
  if (!searchParams.pid) return;
  const product = await fetchProductById(searchParams.pid);

  // If no product is found for the given ID, render a 404 page.
  if (!product) {
    notFound();
  }

  const isOnSale = product.original_sale_price && product.original_regular_price > product.original_sale_price;
  const displayPrice = isOnSale ? product.original_sale_price : product.original_regular_price;
  const highlights = [ "Made from 100% full-grain leather", "Slim bifold design", "Holds up to 8 cards and cash", "Hand-stitched for durability" ];

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
          
          <ProductImageGallery images={product.product_images} productName={product.title} />

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">

            {affiliateInfo && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-200">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <span>
                        You were referred by: <strong className="font-semibold">{affiliateInfo.affiliateId}</strong>
                    </span>
                </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-neutral-700">{product.title}</h1>
            
            <div className="mt-3">
              <p className="text-3xl tracking-tight text-neutral-700">
                ${displayPrice.toFixed(2)}
              </p>
              {isOnSale && (
                  <span className="ml-2 text-xl text-neutral-500 line-through">
                      ${product.original_regular_price.toFixed(2)}
                  </span>
              )}
            </div>

            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 flex-shrink-0 ${product.rating > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <a href="#reviews" className="ml-3 text-sm font-medium text-neutral-500 hover:text-neutral-700">
                  {product.reviews} reviews
                </a>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="space-y-6 text-base text-neutral-500">
                <p>{product.description}</p>
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