import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar.tsx";
import { NavLink } from "react-router-dom";
import { NavUser } from "@/components/common/nav-user.tsx";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      variant="inset"
      {...props}
      className="dark scheme-only-dark max-lg:p-3 lg:pe-1"
    >
      <SidebarHeader>
        <NavLink className="font-bold text-2xl flex justify-center" to="/">
          MED ANALYZE
        </NavLink>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-1 mt-3 pt-4">
          <SidebarGroupLabel className="uppercase text-muted-foreground/65">
            MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative flex items-center rounded-lg p-2 text-sm font-medium ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/analyze"
                className={({ isActive }) =>
                  `relative flex items-center rounded-lg p-2 text-sm font-medium ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : ""
                  }`
                }
              >
                Analyzing
              </NavLink>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
