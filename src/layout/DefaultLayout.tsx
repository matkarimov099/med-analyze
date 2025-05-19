import { AppSidebar } from "@/components/common/app-sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/common/theme-toggle.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

export const DefaultLayout = () => {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="border-b shadow px-4 flex justify-between h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 sticky top-0 z-50 bg-background">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <ThemeToggle />
        </header>

        <main className="h-full bg-slate-100/45 dark:bg-gray-900/45 md:p-5 p-4">
          <div className="flex flex-col dark:shadow-accent shadow-md rounded-md border p-6 bg-white dark:bg-gray-950/45">
            <Suspense
              fallback={
                <Spinner
                  size="large"
                  className="flex h-screen items-center justify-center"
                />
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
