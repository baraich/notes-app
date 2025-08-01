import ConversationListing from "@/modules/conversations/components/conversation-listing";

interface Props {
  params: Promise<{
    conversationId: string;
  }>;
}

export default async function ConversationPage() {
  return <ConversationListing />;
}
