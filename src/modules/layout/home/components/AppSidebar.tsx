"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const favoriteLinks = [
  { href: "#", label: "Hero section for e-commerce" },
  { href: "#", label: "3-tier subscription pricing" },
];

const recentLinks = [
  { href: "#", label: "Generative AI chat bio" },
  { href: "#", label: "Color palette selector" },
  { href: "#", label: "2 CTA buttons" },
  { href: "#", label: "Tag sorting and selecting" },
  { href: "#", label: "Project timeline" },
  { href: "#", label: "Share with team modal" },
];

export default function AppSidebar() {
  return (
    <Sidebar className="px-2 pt-1 bg-[#101014] border-r border-white/10 text-white">
      <SidebarHeader className="bg-[#101014]">
        <Image
          className="mt-2"
          src="/favicon.ico"
          alt="Logo"
          width={32}
          height={32}
        />
      </SidebarHeader>
      <SidebarContent className="bg-[#101014]">
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-white/70">
            Favorites
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {favoriteLinks.map((link) => (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  asChild
                  className="text-white/80 p-2.5 h-full hover:bg-[#18181c] hover:text-white transition-colors"
                >
                  <Link href={link.href}>{link.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">
            Recents
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {recentLinks.map((link) => (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  asChild
                  className="text-white/80 p-2.5 h-full hover:bg-[#18181c] hover:text-white transition-colors"
                >
                  <Link href={link.href}>{link.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#101014] pt-1 border-t border-white/10">
        <Button
          size={"sm"}
          variant="ghost"
          className="w-full bg-[#18181c] text-white mt-1 hover:bg-[#23232b] border border-white/10 hover:text-white"
        >
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
