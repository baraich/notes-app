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
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { cn, makeConversationsLink } from "@/lib/utils";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarMenuButtonClassname =
  "text-zinc-300 p-2.5 h-full hover:bg-zinc-800 hover:text-white active:bg-zinc-800 active:text-white transition-colors";

export default function AppSidebar() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const { data: conversations = [], isLoading } = useQuery(
    trpc.conversations.listUserConversations.queryOptions()
  );

  const createConversationMutation = useMutation(
    trpc.conversations.create.mutationOptions({
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions()
        );
        router.push(makeConversationsLink(data.id));
      },
    })
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
            <span className="pl-0.5">Conversations</span>
            <Button
              onClick={() => createConversationMutation.mutate()}
              size={"icon"}
              variant={"ghost"}
              className="h-7 w-7"
            >
              {createConversationMutation.isPending ? (
                <Loader2Icon className="h-3.5! w-3.5! animate-spin" />
              ) : (
                <PlusIcon className="h-3.5! w-3.5!" />
              )}
            </Button>
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0">
            {isLoading || createConversationMutation.isPending ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      disabled
                      className="h-full bg-transparent hover:bg-transparent"
                    >
                      <Skeleton className="h-4 w-full p-4" />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            ) : conversations.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={sidebarMenuButtonClassname}
                >
                  No conversation yet!
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              conversations.map((link) => (
                <SidebarMenuItem key={link.id}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      sidebarMenuButtonClassname,
                      pathname.includes(link.id) &&
                        "bg-zinc-800 text-white"
                    )}
                  >
                    <Link href={makeConversationsLink(link.id)}>
                      {link.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
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
