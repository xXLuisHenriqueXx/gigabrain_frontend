import type { ReactNode } from "react";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset } from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

/**
 * Shared application shell for authenticated/dashboard routes.
 * SidebarInset is required by shadcn's Sidebar layout to offset the page
 * content on desktop while preserving the mobile Sheet behavior.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <AppSidebar />
      <SidebarInset className="min-h-dvh min-w-0">
        {children}
      </SidebarInset>
    </>
  );
}
