import { getServerSession } from "next-auth";
import OrdersPage from "./Pages/OrdersPage";
import { ProductsPage } from "./Pages/ProductsPage";
import { SingleProductPage } from "./Pages/SingleProductPage";

interface PageProps {
  params: {
    sellerpageid: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { sellerpageid } = params;
  const PAGE_ID = sellerpageid;

  const session = await getServerSession();

  let TabRender;

  switch (PAGE_ID) {
    case "orders":
      TabRender = <OrdersPage />;
      break;

    case "products":
      // Check if a product ID exists in searchParams
      const productId = typeof searchParams.p_id === "string" ? searchParams.p_id : undefined;

      if (productId) {
        TabRender = <SingleProductPage ProductId={productId} />;
      } else {
        TabRender = <ProductsPage session={session} />;
      }
      break;

    default:
      TabRender = <div>Page not found</div>;
      break;
  }

  return <>{TabRender}</>;
}
