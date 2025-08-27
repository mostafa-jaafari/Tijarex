import { PrivateHeader } from "@/components/PrivateHeader";
import { Sidebar } from "@/components/Sidebar";
import { AffiliateProductsContextProvider } from "@/context/AffiliateProductsContext";




export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main 
      className="w-full h-screen bg-[#1A1A1A] 
        overflow-hidden"
    >
      <AffiliateProductsContextProvider>
        <PrivateHeader />
        <div 
          className="overflow-y-hidden bg-gray-100 rounded-t-xl 
          flex h-[calc(100vh-64px)]">
          <Sidebar />
            {children}
        </div>
      </AffiliateProductsContextProvider>
    </main>
  );
}