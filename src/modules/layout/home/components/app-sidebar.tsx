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
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const trpc = useTRPC();
  const pathname = usePathname();
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
    <Sidebar className="px-2 pt-1 bg-zinc-900 border-r border-zinc-800 text-white">
      <SidebarHeader className="bg-zinc-900">
        <Image
          className="mt-2"
          src="/favicon.ico"
          alt="Logo"
          width={32}
          height={32}
        />
      </SidebarHeader>
      <SidebarContent className="bg-zinc-900">
        {favoriteLinks.length > 0 && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="text-zinc-400">
              Favorites
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0">
              {favoriteLinks.map((link) => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-zinc-300 p-2.5 h-full hover:bg-zinc-800 hover:text-white active:bg-zinc-800 active:text-white transition-colors",
                      pathname.includes(link.id) &&
                        "bg-zinc-800 text-white"
                    )}
                  >
                    <Link href={`/${link.id}`}>{link.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400">
            Recents
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {recentLinks.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-zinc-500 p-2.5 py-1 pl-2 h-full hover:bg-zinc-800 hover:text-zinc-300 active:bg-zinc-800 active:text-zinc-300 transition-colors">
                  No conversation yet!
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {recentLinks.map((link) => (
              <SidebarMenuItem key={link.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-zinc-300 p-2.5 h-full hover:bg-zinc-800 hover:text-white active:bg-zinc-800 active:text-white transition-colors",
                    pathname.includes(link.id) &&
                      "bg-zinc-800 text-white"
                  )}
                >
                  <Link href={`/${link.id}`}>{link.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-zinc-900 pt-1 border-t border-zinc-800">
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
          variant="normal"
        >
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
