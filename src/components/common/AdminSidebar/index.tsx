"use client";
import * as React from "react";
import {
  GalleryVerticalEnd,
  Minus,
  Plus,
  Sun,
  Moon,
  User,
  LogOut,
  FileText,
  Layers,
  Folder,
  Tag,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { AdminSidebarNav } from "@/context/constants/admin/sidebar";

export default function AdminSidebar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "user@example.com";

  const isActive = (url: string) => url !== "#" && pathname === url;
  const hasActiveChild = (items: any[]) =>
    items?.some((item) => isActive(item.url));

  return (
    <Sidebar className="sticky top-0 h-screen">
      <SidebarHeader className="px-4">
        <div className="flex flex-row items-center w-full justify-between gap-2">
          <div className="flex flex-row items-center gap-3">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold">Admin Panel</span>
              <span className="">v1.0.0</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {AdminSidebarNav.map((item, index) => {
              const isCollapsible = !!item.items && item.items.length > 0;
              const activeState = isCollapsible
                ? item.items !== undefined && hasActiveChild(item.items)
                : isActive(item.url ?? "");

              if (isCollapsible) {
                return (
                  <Collapsible
                    key={item.title}
                    defaultOpen={activeState || index === 2}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                          {item.title}
                          <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                          <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items &&
                            item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(subItem.url)}
                                >
                                  <a
                                    href={subItem.url}
                                    className="flex items-center"
                                  >
                                    {subItem.icon && (
                                      <subItem.icon className="w-4 h-4 mr-2" />
                                    )}
                                    {subItem.title}
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={activeState}>
                      <a href={item.url} className="flex items-center">
                        {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                        {item.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center space-x-3">
              <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-sidebar-muted">
                <User className="size-6" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
                <span className="text-sm font-semibold truncate">
                  {userEmail}
                </span>
                <span className="text-xs text-muted-foreground">Account</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => signOut()}
                title="Logout"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
