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
    <Sidebar className="px-2 pt-1 bg-gray-800 border-r border-gray-700 text-gray-100">
      <SidebarHeader className="bg-gray-800">
        <Image
          className="mt-2"
          src="/favicon.ico"
          alt="Logo"
          width={32}
          height={32}
        />
      </SidebarHeader>
      <SidebarContent className="bg-gray-800">
        {favoriteLinks.length > 0 && (
          <SidebarGroup className="mt-2">
            <SidebarGroupLabel className="text-gray-400">
              Favorites
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0">
              {favoriteLinks.map((link) => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "text-gray-300 p-2.5 h-full hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700 active:text-gray-100 transition-colors",
                      pathname.includes(link.id) &&
                        "bg-gray-700 text-gray-100"
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
          <SidebarGroupLabel className="text-gray-400">
            Recents
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {recentLinks.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-500 p-2.5 py-1 pl-2 h-full hover:bg-gray-700 hover:text-gray-300 active:bg-gray-700 active:text-gray-300 transition-colors">
                  No conversation yet!
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {recentLinks.map((link) => (
              <SidebarMenuItem key={link.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-gray-300 p-2.5 h-full hover:bg-gray-700 hover:text-gray-100 active:bg-gray-700 active:text-gray-100 transition-colors",
                    pathname.includes(link.id) &&
                      "bg-gray-700 text-gray-100"
                  )}
                >
                  <Link href={`/${link.id}`}>{link.name}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-gray-800 pt-1 border-t border-gray-700">
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
          className="w-full bg-gray-700 text-gray-300 mt-1 hover:bg-gray-600 border border-gray-600 hover:text-gray-100"
        >
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
