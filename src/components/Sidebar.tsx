import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SidebarClient } from "./SidebarClient";

export async function Sidebar() {
    const session = await getServerSession(authOptions);
    const UserRole = session?.user?.role || "guest" as string;

    return (
        <SidebarClient
            UserRole={UserRole}
        />
    );
}