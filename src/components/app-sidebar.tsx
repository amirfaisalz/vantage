"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gauge, Calculator, Sparkles, LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "./user-button";
import Image from "next/image";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Velocity Scanner",
    url: "/dashboard/scanner",
    icon: Gauge,
  },
  {
    title: "ROI Simulator",
    url: "/dashboard/roi",
    icon: Calculator,
  },
  {
    title: "AI Insights",
    url: "/dashboard/insights",
    icon: Sparkles,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-zinc-800">
      <SidebarHeader className="border-b border-zinc-800 px-4 py-[0.6rem]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white">
            <Image src="/vantage-icon.png" alt="Logo" width={24} height={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-zinc-100">Vantage</span>
            <span className="text-xs text-zinc-500">Growth Analytics</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                          : "text-zinc-400 hover:text-zinc-100"
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-800">
        <UserButton />
      </SidebarFooter>
    </Sidebar>
  );
}
