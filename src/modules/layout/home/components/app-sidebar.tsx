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
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function AppSidebar() {
  const trpc = useTRPC();
  const conversations = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
  );

  const favoriteLinks = (conversations.data ?? []).filter(
    (conversation) => conversation.labels.includes("favorite")
  );
  const recentLinks = (conversations.data ?? []).filter(
    (conversation) => !conversation.labels.includes("favorite")
  );

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
        {favoriteLinks.length > 0 && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="text-white/70">
              Favorites
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0">
              {favoriteLinks.map((link) => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className="text-white/80 p-2.5 h-full hover:bg-[#18181c] hover:text-white active:bg-[#18181c] active:text-white transition-colors"
                  >
                    <Link href={`/${link.id}`}>{link.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">
            Recents
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {recentLinks.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-white/80 p-2.5 py-1 pl-2 h-full hover:bg-[#18181c] hover:text-white active:bg-[#18181c] active:text-white transition-colors">
                  No conversation yet!
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {recentLinks.map((link) => (
              <SidebarMenuItem key={link.id}>
                <SidebarMenuButton
                  asChild
                  className="text-white/80 p-2.5 h-full hover:bg-[#18181c] hover:text-white active:bg-[#18181c] active:text-white transition-colors"
                >
                  <Link href={`/${link.id}`}>{link.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-[#101014] pt-1 border-t border-white/10">
        <Button
          onClick={() =>
            authClient.signOut().then(({ error }) =>
              error
                ? toast.error("Failed to sign out", {
                    id: "sidebar-signout",
                  })
                : typeof window !== "undefined"
                ? (window.location.pathname = "/signin")
                : null
            )
          }
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
