import { SearchToolInput, SearchToolOutput } from "../interface";
import { Globe, Youtube } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getActualPrice } from "@/lib/utils";

interface Props {
  input: SearchToolInput;
  output: SearchToolOutput;
}

export default function SearchTool({ input, output }: Props) {
  const searchResults = output.results.search_results || [];
  const totalCost = output.results.usage.cost.total_cost;
  const searchTerm = input.query || "Search";

  const getYouTubeVideoId = (url: string) => {
    const regex =
      /(?:youtube\.com\/(?:[^/]+\/\S*|v\/|embed\/|watch\?v=)|youtu\.be\/)([^"&?/<>{}\[\] ]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 shadow-lg">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="search-results">
          <AccordionTrigger>
            <div className="flex w-full items-start justify-between gap-4">
              <div className="text-sm text-zinc-400">
                Search:{" "}
                <span className="font-medium text-zinc-200">
                  &quot;{searchTerm}&quot;
                </span>
              </div>
              {totalCost && (
                <div>
                  <span className="text-xs text-zinc-400">
                    {"₹"}
                    {(Math.ceil(getActualPrice(totalCost) * 100) / 100).toFixed(
                      2,
                    )}
                  </span>
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 pt-3 md:grid-cols-2">
                {searchResults.map((result, idx) => {
                  const videoId = getYouTubeVideoId(result.url);
                  return (
                    <div
                      key={idx}
                      className="group flex h-full flex-col rounded-lg border border-zinc-700 bg-zinc-800 p-3 shadow-sm transition hover:border-zinc-600"
                    >
                      {videoId && (
                        <div className="relative mb-2 aspect-video overflow-hidden rounded-md">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="h-full w-full"
                          ></iframe>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 pt-0.5">
                          {videoId ? (
                            <Youtube className="h-4 w-4 text-zinc-400" />
                          ) : (
                            <Globe className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="line-clamp-2 text-sm font-medium text-zinc-300 hover:underline"
                          >
                            {result.title}
                          </a>
                        </div>
                      </div>
                      <div className="mt-1.5 line-clamp-1 pl-6 text-xs break-all text-zinc-500">
                        {result.url}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pt-3 text-sm text-zinc-400">
                No results found.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
