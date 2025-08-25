import { SellerHeader } from "@/components/SellerHeader";
import { Sidebar } from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <main
          className="w-full bg-[#1A1A1A]"
        >
          <SellerHeader />
          <section
              className="w-full flex"
              >
              <Sidebar />
              <div className="w-full">
                {children}
              </div>
          </section>
        </main>
  );
}