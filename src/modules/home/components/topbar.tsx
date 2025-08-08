"use client";
import ComingSoonDialog from "@/components/coming-soon-dialog";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarIcon, SparklesIcon } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const isMobile = useIsMobile();
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  return (
    <header className="flex w-full items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-zinc-400 hover:text-white"
          onClick={() =>
            isMobile ? setOpenMobile(!openMobile) : setOpen(!open)
          }
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setUpgradeDialogOpen(true)}
          size="sm"
          className="border border-zinc-700 bg-zinc-800 text-white hover:border-zinc-600 hover:bg-zinc-700"
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
