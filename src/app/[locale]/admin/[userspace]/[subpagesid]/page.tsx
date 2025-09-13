import Loading from "@/app/loading";
import AddBalance from "@/components/Pages/AddBalance";
import { FavoritesProducts } from "@/components/Pages/FavoritesProducts";
import { MyCollection } from "@/components/Pages/MyCollection";
import { MyProducts } from "@/components/Pages/MyProducts";
import MyWithdraw from "@/components/Pages/MyWithdraw";
import OrdersPage from "@/components/Pages/OrdersPage";
import ProductsPage from "@/components/Pages/ProductsPage";
import ProfilePage from "@/components/Pages/ProfilePage";
import { SingleProductPage } from "@/components/Pages/SingleProductPage";
import UploadProducts from "@/components/Pages/UploadProducts";
import { Suspense } from "react";


interface PageProps {
  params: Promise<{
    subpagesid: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function page({ params, searchParams }: PageProps) {
  // Await the params and searchParams as they are now Promises in Next.js 15
  const { subpagesid } = await params;
  const resolvedSearchParams = await searchParams;
  
  const PAGE_ID = subpagesid;

  let TabRender;

  switch (PAGE_ID) {
    case "orders":
      TabRender = <OrdersPage />;
      break;
    case "profile":
      TabRender = <ProfilePage />
      break;
    case "add-balance":
      TabRender = <AddBalance />
      break;
    case "my-withdraw":
      TabRender = <MyWithdraw />
      break;
    case "my-collection":
      TabRender = <MyCollection />;
      break;
    case "my-products":
      TabRender = <MyProducts />;
      break;
    case "upload-products":
      TabRender = <UploadProducts />;
      break;
    case "favorites":
      TabRender = <FavoritesProducts />;
      break;
    case "products":
      // Check if a product ID exists in searchParams
      const productId = typeof resolvedSearchParams.p_id === "string" ? resolvedSearchParams.p_id : undefined;

      if (productId) {
        TabRender = <SingleProductPage ProductId={productId} />;
      } else {
        TabRender = <ProductsPage />
      }
      break;
    default:
      TabRender = <div className="w-full h-screen bg-gray-200 flex items-center justify-center text-6xl font-bold">Page not found</div>;
      break;
  }

  return (
    <div
      className="w-full pt-3 pb-12 px-12"
    >
      <Suspense fallback={<Loading />}>
        {TabRender}
      </Suspense>
    </div>
  )
}