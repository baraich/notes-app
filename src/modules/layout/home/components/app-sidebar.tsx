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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { cn, makeConversationsLink } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import InlineSpinner from "@/components/common/inline-spinner";
import { useAppMutation } from "@/hooks/use-app-mutation";
import { Skeleton } from "@/components/ui/skeleton";

const sidebarMenuButtonClassname =
  "text-zinc-300 p-2.5 h-full hover:bg-zinc-800 hover:text-white active:bg-zinc-800 active:text-white transition-colors";

const makeDocumentsLink = (id: string) => `/d/${id}`;

interface SidebarSectionProps<T extends { id: string; name: string }> {
  title: string;
  items: T[];
  isLoading: boolean;
  isCreating: boolean;
  onCreate: () => void;
  makeLink: (id: string) => string;
  emptyMessage: string;
}

function SidebarSection<T extends { id: string; name: string }>({
  title,
  items,
  isLoading,
  isCreating,
  onCreate,
  makeLink,
  emptyMessage,
}: SidebarSectionProps<T>) {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="flex items-center justify-between text-zinc-400">
        <span className="pl-0.5">{title}</span>
        <Button
          onClick={onCreate}
          size={"icon"}
          variant={"ghost"}
          className="h-7 w-7"
          disabled={isCreating}
        >
          {isCreating ? (
            <InlineSpinner className="h-3.5! w-3.5!" />
          ) : (
            <PlusIcon className="h-3.5! w-3.5!" />
          )}
        </Button>
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0">
        {isLoading || isCreating ? (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
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
        ) : items.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton className={sidebarMenuButtonClassname}>
              {emptyMessage}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                className={cn(
                  sidebarMenuButtonClassname,
                  pathname.includes(item.id) && "bg-zinc-800 text-white",
                )}
              >
                <Link href={makeLink(item.id)}>{item.name}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default function AppSidebar() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading: isLoadingConversations } =
    useQuery(trpc.conversations.listUserConversations.queryOptions());

  const { data: documents = [], isLoading: isLoadingDocuments } = useQuery(
    trpc.documents.listUserDocuments.queryOptions(),
  );

  const createConversationMutation = useAppMutation({
    base: trpc.conversations.create.mutationOptions({
      onSuccess(data) {
        router.push(makeConversationsLink(data.id));
      },
    }),
    toast: {
      id: "create-conversation-sidebar",
      loading: "Creating a new conversation",
      success: "Conversation created",
      error: "Failed to create a new conversation",
    },
    invalidate: [
      (qc: ReturnType<typeof useQueryClient>) =>
        // Type cast to QueryClient for correct method usage
        (qc as unknown as import("@tanstack/react-query").QueryClient).invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        ),
    ],
  });

  const createDocumentMutation = useAppMutation({
    base: trpc.documents.create.mutationOptions({
      onSuccess(data) {
        router.push(makeDocumentsLink(data.id));
      },
    }),
    toast: {
      id: "create-document-sidebar",
      loading: "Creating a new document",
      success: "Document created",
      error: "Failed to create a new document",
    },
    invalidate: [
      (qc: ReturnType<typeof useQueryClient>) =>
        (qc as unknown as import("@tanstack/react-query").QueryClient).invalidateQueries(
          trpc.documents.listUserDocuments.queryOptions(),
        ),
    ],
  });

  return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-900 px-2 pt-1 text-white">
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
        <SidebarSection
          title="Documents"
          items={documents}
          isLoading={isLoadingDocuments}
          isCreating={createDocumentMutation.isPending}
          onCreate={() => createDocumentMutation.mutate()}
          makeLink={makeDocumentsLink}
          emptyMessage="No documents yet!"
        />
        <SidebarSection
          title="Conversations"
          items={conversations}
          isLoading={isLoadingConversations}
          isCreating={createConversationMutation.isPending}
          onCreate={() => createConversationMutation.mutate()}
          makeLink={makeConversationsLink}
          emptyMessage="No conversation yet!"
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-zinc-800 bg-zinc-900 pt-1">
        <Button
          onClick={() =>
            authClient.signOut().then(({ error }) =>
              error
                ? toast.error("Failed to sign out", {
                    id: "sidebar-signout",
                  })
                : typeof window !== "undefined"
                  ? (window.location.pathname = "/signin")
                  : null,
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
