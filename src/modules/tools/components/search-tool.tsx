import { SearchToolInput, SearchToolOutput } from "../interface";
import { Globe, Youtube } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col gap-3 shadow-lg px-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="search-results">
          <AccordionTrigger>
            <div className="flex justify-between items-start gap-4 w-full">
              <div className="text-sm text-zinc-400">
                Search:{" "}
                <span className="text-zinc-200 font-medium">
                  &quot;{searchTerm}&quot;
                </span>
              </div>
              {totalCost && (
                <div>
                  <span className="text-zinc-400 text-xs">
                    ₹
                    {(
                      Math.ceil(totalCost * 87.65 * 100) / 100
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                {searchResults.map((result, idx) => {
                  const videoId = getYouTubeVideoId(result.url);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col bg-zinc-800 rounded-lg p-3 border border-zinc-700 hover:border-zinc-600 transition group shadow-sm h-full"
                    >
                      {videoId && (
                        <div className="relative mb-2 aspect-video rounded-md overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 pt-0.5">
                          {videoId ? (
                            <Youtube className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <Globe className="w-4 h-4 text-zinc-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-zinc-300 hover:underline line-clamp-2"
                          >
                            {result.title}
                          </a>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-500 break-all mt-1.5 pl-6 line-clamp-1">
                        {result.url}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-zinc-400 text-sm pt-3">
                No results found.
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
