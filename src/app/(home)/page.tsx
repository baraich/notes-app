import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import HomeHeader from "@/modules/home/components/HomeHeader";
import MessageInput from "@/modules/home/components/MessageInput";

export default function HomePage() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="my-1.5 mr-2 rounded-lg overflow-hidden bg-[var(--custom-bg)] border border-white/15 flex flex-col">
        <HomeHeader />
        <div className="flex-1 flex items-center justify-center">
          <MessageInput />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
