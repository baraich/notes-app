import Topbar from "@/modules/home/components/topbar";
import { FileText, MessageSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-white">
      <Topbar />
      <main className="flex-grow p-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-zinc-400">
            Welcome back! Here&apos;s a summary of your activity.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-zinc-400" />
                <div>
                  <h3 className="font-semibold text-white">Total Notes</h3>
                  <p className="text-sm text-zinc-400">
                    You have created 12 notes in total.
                  </p>
                </div>
              </div>
              <div className="text-lg font-bold text-white">12</div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center gap-4">
                <MessageSquare className="h-6 w-6 text-zinc-400" />
                <div>
                  <h3 className="font-semibold text-white">
                    Active Conversations
                  </h3>
                  <p className="text-sm text-zinc-400">
                    You have 5 active conversations.
                  </p>
                </div>
              </div>
              <div className="text-lg font-bold text-white">5</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}