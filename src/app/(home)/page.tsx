"use client";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import HomeHeader from "@/modules/home/components/HomeHeader";
import MessageInput from "@/modules/home/components/MessageInput";

export default function HomePage() {
  const { open } = useSidebar();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        className={cn(
          "my-1.5 rounded-lg overflow-hidden bg-[var(--custom-bg)] border border-white/15 flex flex-col",
          !open ? "mx-2" : "mr-2"
        )}
      >
        <HomeHeader />
        <div className="flex-1 flex items-center justify-center">
          <MessageInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
