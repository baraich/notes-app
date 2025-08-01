"use client";
import ComingSoonDialog from "@/components/coming-soon-dialog";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

export default function HomeHeader() {
  const { open, setOpen } = useSidebar();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

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
          onClick={() => setUpgradeDialogOpen(true)}
          size="sm"
          className="bg-[#23232b] text-blue-400 border border-blue-400 hover:bg-blue-500/20"
        >
          <span>Upgrade</span>
          <SparklesIcon />
        </Button>
      </div>

      <ComingSoonDialog
        open={upgradeDialogOpen}
        setOpen={setUpgradeDialogOpen}
        description="The ability to upgrade to premium plan for higher usage limits would be shipped in future updates."
      />
    </header>
  );
}
