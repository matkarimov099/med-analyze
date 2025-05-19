import {
  RiExpandUpDownLine,
  RiUserLine,
  RiGroupLine,
  RiSparklingLine,
  RiLogoutCircleLine,
} from "@remixicon/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthContext.ts";
import { useLogout } from "@/hooks/useAuth.ts";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";
import type { ServerError } from "@/types/auth.ts";

export function NavUser() {
  const authContext = useContext(AuthContext);
  const { mutate: logout, isPending } = useLogout();

  if (!authContext) {
    throw new Error("NavUser must be used within an AuthContextProvider");
  }

  const { currentUser } = authContext;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully!");
      },
      onError: (error: ServerError) => {
        toast.error("Logout failed", {
          description: error?.message || "An error occurred",
        });
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
            >
              <Avatar className="size-8">
                <AvatarFallback className="rounded-lg">
                  {currentUser?.firstname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {currentUser?.firstname}
                </span>
              </div>
              <RiExpandUpDownLine className="ml-auto size-5 text-muted-foreground/80" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] dark bg-sidebar"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                asChild
                className="gap-3 focus:bg-sidebar-accent"
              >
                <NavLink to="/profile">
                  <RiUserLine
                    size={20}
                    className="size-5 text-muted-foreground/80"
                  />
                  Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="gap-3 focus:bg-sidebar-accent"
              >
                <NavLink to="/accounts">
                  <RiGroupLine
                    size={20}
                    className="size-5 text-muted-foreground/80"
                  />
                  Accounts
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="gap-3 focus:bg-sidebar-accent"
              >
                <NavLink to="/upgrade">
                  <RiSparklingLine
                    size={20}
                    className="size-5 text-muted-foreground/80"
                  />
                  Upgrade
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-3 focus:bg-sidebar-accent"
                onClick={handleLogout}
                disabled={isPending}
              >
                <RiLogoutCircleLine
                  size={20}
                  className="size-5 text-muted-foreground/80"
                />
                {isPending ? "Logging out..." : "Logout"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
