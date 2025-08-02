import { Sidebar } from "@/components/Sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <main
        className="w-full flex"
    >
        <Sidebar />
        {children}
    </main>
  );
}