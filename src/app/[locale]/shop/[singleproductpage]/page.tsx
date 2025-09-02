import { Check, Star, Info } from 'lucide-react';
import ProductImageGallery from '@/components/SingleProductPage/ProductImageGallery';
import AddToCartButtons from '@/components/SingleProductPage/AddToCartButtons';
import { ProductType } from '@/types/product';
import { parseReferralUrl } from '@/components/Functions/GenerateUniqueRefLink';

// The props for this page now include searchParams to read the URL query string
type ProductPageProps = {
  searchParams: {
    ref?: string; // The 'ref' parameter is optional
  };
};

// The component is now async to handle props
export default async function ProductPage({ searchParams }: ProductPageProps) {

  // --- REFERRAL LINK LOGIC ---
  const referralCode = searchParams.ref;
  const affiliateInfo = referralCode ? parseReferralUrl(referralCode) : null;
  // ---

  // --- FAKE PRODUCT DATA ---
  // The page continues to use this hardcoded product object for display.
  const selectedProduct: ProductType = {
    id: 'prod-fake-12345',
    title: 'Artisan Handcrafted Leather Wallet',
    description: 'A timeless accessory, this wallet is handcrafted from premium full-grain leather that patinas beautifully over time. Its slim profile is designed for the modern minimalist, offering ample space without the bulk. Perfect for daily use or as a thoughtful gift.',
    product_images: [
      '/images/wallet-1.jpg',
      '/images/wallet-2.jpg',
      '/images/wallet-3.jpg',
      '/images/wallet-4.jpg',
    ],
    original_regular_price: 75.00,
    original_sale_price: 59.99,
    stock: 150,
    rating: 4.8,
    reviews: new Array(128),
    category: 'Accessories',
    currency: 'USD',
    sales: 432,
    lastUpdated: new Date().toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    sizes: ['One Size'],
    colors: ['Cognac Brown', 'Matte Black'],
    productrevenu: 25915.68,
  };
  // --- END OF FAKE PRODUCT DATA ---

  const product = selectedProduct;
  const isOnSale = product.original_sale_price && product.original_regular_price > product.original_sale_price;
  const displayPrice = isOnSale ? product.original_sale_price : product.original_regular_price;
  const highlights = [
      "Made from 100% full-grain leather",
      "Slim bifold design",
      "Holds up to 8 cards and cash",
      "Hand-stitched for durability"
    ];

  return (
    <div className="bg-white">
        hiiii
        {referralCode}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-16">
          
          <ProductImageGallery images={product.product_images} productName={product.title} />

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">

            {/* --- REFERRAL BANNER --- */}
            {/* This banner will ONLY show if a valid 'ref' is in the URL */}
            {affiliateInfo && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-blue-50 p-4 text-sm text-blue-700 border border-blue-200">
                    <Info className="h-5 w-5 flex-shrink-0" />
                    <span>
                        You were referred by: <strong className="font-semibold">{affiliateInfo.affiliateId}</strong>
                    </span>
                </div>
            )}
            {/* --- END REFERRAL BANNER --- */}

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
                  {product.reviews.length} reviews
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