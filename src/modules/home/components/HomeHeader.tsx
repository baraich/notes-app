"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon, SparklesIcon } from "lucide-react";

export default function HomeHeader() {
  const { open, setOpen } = useSidebar();

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => setOpen(!open)}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-[#23232b] text-blue-400 border border-blue-400 hover:bg-blue-500/20"
        >
          <span>Upgrade</span>
          <SparklesIcon />
        </Button>
      </div>
    </header>
  );
}
