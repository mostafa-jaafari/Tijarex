import OrdersPage from "./Pages/OrdersPage";
import ProductsPage from "./Pages/ProductsPage";
import { SingleProductPage } from "./Pages/SingleProductPage";
import ProfilePage from "./Pages/ProfilePage";
import AddBalance from "./Pages/AddBalance";
import MyWithdraw from "./Pages/MyWithdraw";
import MyStore from "./Pages/MyStore";
import UploadProducts from "./Pages/UploadProducts";
import FavoritesProductsPage from "./Pages/FavoritesProductsPage";
import StoreTemplates from "./Pages/StoreTemplates";

interface PageProps {
  params: Promise<{
    affiliatepageid: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  // Await the params and searchParams as they are now Promises in Next.js 15
  const { affiliatepageid } = await params;
  const resolvedSearchParams = await searchParams;
  
  const PAGE_ID = affiliatepageid;

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
    case "my-store":
      TabRender = <MyStore />;
      break;
    case "upload-products":
      TabRender = <UploadProducts />;
      break;
    case "favorites":
      TabRender = <FavoritesProductsPage />;
      break;
    case "store-templates":
      TabRender = <StoreTemplates />;
      break;
    case "products":
      // Check if a product ID exists in searchParams
      const productId = typeof resolvedSearchParams.p_id === "string" ? resolvedSearchParams.p_id : undefined;

      if (productId) {
        TabRender = <SingleProductPage ProductId={productId} />;
      } else {
        TabRender = <ProductsPage />;
      }
      break;
    default:
      TabRender = <div className="w-full h-screen bg-gray-200 flex items-center justify-center text-6xl font-bold">Page not found</div>;
      break;
  }

  return (
    <div
      className="w-full overflow-auto bg-gray-100"
    >
      {TabRender}
    </div>
  )
}