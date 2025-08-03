import { SellerHeader } from "@/components/SellerHeader";
import { Sidebar } from "@/components/Sidebar";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await getServerSession(authOptions);
  return (
    <main
      className="w-full"
    >
      <section
          className="w-full flex"
          >
          <Sidebar />
          <div className="w-full">
            <SellerHeader session={session} />
            {children}
          </div>
      </section>
    </main>
  );
}