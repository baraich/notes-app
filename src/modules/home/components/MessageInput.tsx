import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, GraduationCap, Plus } from "lucide-react";

export default function MessageInput() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="w-full bg-[var(--custom-sidebar)] rounded-xl p-2">
        <div className="relative">
          <Input
            className="bg-transparent border-0 w-full pl-4 pr-12 py-8 text-lg placeholder:text-[#636366] text-white focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Ask anything..."
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-[#636366]"
          >
            <ArrowUp className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add tools
            </Button>
            <Button
              variant="ghost"
              className="text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white"
            >
              <GraduationCap className="mr-1.5 h-4 w-4" />
              DeepTutor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}