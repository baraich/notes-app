"use client";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";

export default function HomeHeader() {
  const { setOpen, open } = useSidebar();

  return (
    <header className="flex items-center justify-between p-2">
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
        {/* TODO: Add actions button in the future */}
      </div>
    </header>
  );
}
