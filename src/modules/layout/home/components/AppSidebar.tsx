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
    <Sidebar className="px-2 py-1 bg-[var(--custom-sidebar)] border-none text-white">
      <SidebarHeader className="bg-[var(--custom-sidebar)]">
        <Image
          className="mt-2"
          src="/favicon.ico"
          alt="Logo"
          width={32}
          height={32}
        />
      </SidebarHeader>
      <SidebarContent className="bg-[var(--custom-sidebar)]">
        <SidebarGroup className="mt-2">
          <SidebarGroupLabel className="text-[#8E8E93]">
            Favorites
          </SidebarGroupLabel>
          <SidebarMenu>
            {favoriteLinks.map((link) => (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  asChild
                  className="text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white"
                >
                  <Link href={link.href}>{link.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#8E8E93]">
            Recents
          </SidebarGroupLabel>
          <SidebarMenu>
            {recentLinks.map((link) => (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  asChild
                  className="text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white"
                >
                  <Link href={link.href}>{link.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="pb-2 bg-[var(--custom-sidebar)]">
        <Button variant="ghost" className="w-full bg-[#2C2C2E]">
          Sign out
        </Button>
        <div className="flex justify-around mt-2">
          <Link
            href="/privacy"
            className="text-xs text-[#8E8E93] hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-[#8E8E93] hover:underline"
          >
            Terms of Service
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
