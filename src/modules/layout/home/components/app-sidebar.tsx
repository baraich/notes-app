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
import { PlusIcon } from "lucide-react";

export default function AppSidebar() {
  const trpc = useTRPC();
  const pathname = usePathname();
  const { data: conversations = [] } = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
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
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-400 flex items-center justify-between">
            <span>Conversations</span>
            <Button
              size={"icon"}
              variant={"ghost"}
              className="h-7 w-7"
            >
              <PlusIcon className="h-3.5! w-3.5!" />
            </Button>
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {conversations.length === 0 && (
              <SidebarMenuItem>
                <SidebarMenuButton className="text-zinc-500 p-2.5 py-1 pl-2 h-full hover:bg-zinc-800 hover:text-zinc-300 active:bg-zinc-800 active:text-zinc-300 transition-colors">
                  No conversation yet!
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {conversations.map((link) => (
              <SidebarMenuItem key={link.id}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "text-zinc-300 p-2.5 h-full hover:bg-zinc-800 hover:text-white active:bg-zinc-800 active:text-white transition-colors",
                    pathname.includes(link.id) &&
                      "bg-zinc-800 text-white"
                  )}
                >
                  <Link href={`/c/${link.id}`}>{link.name}</Link>
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
