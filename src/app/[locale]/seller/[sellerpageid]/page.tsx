import { getServerSession } from "next-auth";
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
  const session = await getServerSession();
  let TabRender;
  switch (PAGE_ID) {
    case "orders":
        TabRender = <OrdersPage />;
        break;
    case "products":
        TabRender = <ProductsPage session={session} />
        break;
    default:
        break;
  }
  return TabRender;
}