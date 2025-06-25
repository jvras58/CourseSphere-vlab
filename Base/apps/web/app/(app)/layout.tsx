import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getSession } from "@/lib/session";
import { SessionProvider } from "@/modules/auth/utils/sync-session";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <div className="flex h-screen w-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}