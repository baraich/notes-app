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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { cn, makeConversationsLink } from "@/lib/utils";
import { Loader2Icon, PlusIcon } from "lucide-react";
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
            <Loader2Icon className="h-3.5! w-3.5! animate-spin" />
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

  const createConversationMutation = useMutation(
    trpc.conversations.create.mutationOptions({
      onMutate() {
        toast.loading("Creating a new conversation", {
          id: "create-conversation-sidebar",
        });
      },
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.conversations.listUserConversations.queryOptions(),
        );
        router.push(makeConversationsLink(data.id));
        toast.success("Conversation created", {
          id: "create-conversation-sidebar",
        });
      },
      onError() {
        toast.error("Failed to create a new conversation", {
          id: "create-conversation-sidebar",
        });
      },
    }),
  );

  const createDocumentMutation = useMutation(
    trpc.documents.create.mutationOptions({
      onMutate() {
        toast.loading("Creating a new document", {
          id: "create-document-sidebar",
        });
      },
      onSuccess(data) {
        queryClient.invalidateQueries(
          trpc.documents.listUserDocuments.queryOptions(),
        );
        router.push(makeDocumentsLink(data.id));
        toast.success("Document created", {
          id: "create-document-sidebar",
        });
      },
      onError() {
        toast.error("Failed to create a new document", {
          id: "create-document-sidebar",
        });
      },
    }),
  );

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
