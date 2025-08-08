import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/modules/layout/home/components/app-sidebar";

interface Props {
  children: React.ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <main className="flex h-screen w-full bg-black">
        <AppSidebar />
        <div className="relative flex h-full flex-1 flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
