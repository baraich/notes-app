import { Button } from "@/components/ui/button";
import { SidebarIcon } from "lucide-react";
import Image from "next/image";

export default function HomeHeader() {
  return (
    <header className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-[#8E8E93]"
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {/* TODO: Add actions button in the future */}
      </div>
    </header>
  );
}
