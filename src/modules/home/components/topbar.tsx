"use client";
import ComingSoonDialog from "@/components/coming-soon-dialog";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const { open, setOpen } = useSidebar();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white"
          onClick={() => setOpen(!open)}
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setUpgradeDialogOpen(true)}
          size="sm"
          className="bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600"
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
