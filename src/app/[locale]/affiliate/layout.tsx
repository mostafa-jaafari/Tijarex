import { SellerHeader } from "@/components/SellerHeader";
import { Sidebar } from "@/components/Sidebar";




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
          <SellerHeader />
          <div 
            className="overflow-y-hidden bg-gray-100 rounded-t-xl 
              flex h-[calc(100vh-64px)]">
            <Sidebar />
              {children}
          </div>
        </main>
  );
}