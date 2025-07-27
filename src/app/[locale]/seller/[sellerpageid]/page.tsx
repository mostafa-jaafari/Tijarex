import OrdersPage from "./Pages/OrdersPage";
import { ProductsPage } from "./Pages/ProductsPage";

interface PageProps {
  params: Promise<{
    sellerpageid: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { sellerpageid } = await params;
  const PAGE_ID = sellerpageid;
  
  let TabRender;
  switch (PAGE_ID) {
    case "orders":
        TabRender = <OrdersPage />;
        break;
    case "products":
        TabRender = <ProductsPage />
        break;
    default:
        break;
  }
  return TabRender;
}