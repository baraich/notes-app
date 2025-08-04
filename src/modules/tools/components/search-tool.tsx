import { SearchToolInput, SearchToolOutput } from "../interface";
import { Globe, Youtube } from "lucide-react";

interface Props {
  input: SearchToolInput;
  output: SearchToolOutput;
}

const output: SearchToolOutput = {
  results: {
    id: "fc9a4b0c-264d-45c9-9ab9-5fa55a7fcc5b",
    model: "sonar-pro",
    created: 1754299231,
    usage: {
      prompt_tokens: 13,
      completion_tokens: 455,
      total_tokens: 468,
      search_context_size: "low",
      cost: {
        input_tokens_cost: 0.000039,
        output_tokens_cost: 0.006825,
        request_cost: 0.006,
        total_cost: 0.012864,
      },
    },
    citations: [
      "https://www.gands.com/blog/2025/01/07/what-to-expect-in-2025-priorities-for-canadian-immigration/",
      "https://www.cicnews.com/2025/06/major-changes-announced-in-irccs-2025-2026-departmental-plan-0657047.html",
      "https://www.youtube.com/watch?v=AlJRR9IR3gg",
      "https://www.canadavisa.com/canada-immigration-levels-plans.html",
      "https://www.youtube.com/watch?v=todpWQWVtXU",
    ],
    search_results: [
      {
        title:
          "What to Expect in 2025: Priorities for Canadian Immigration",
        url: "https://www.gands.com/blog/2025/01/07/what-to-expect-in-2025-priorities-for-canadian-immigration/",
        date: "2025-01-07",
        last_updated: "2025-06-16",
      },
      {
        title: "Major changes announced in IRCC's 2025-2026 ...",
        url: "https://www.cicnews.com/2025/06/major-changes-announced-in-irccs-2025-2026-departmental-plan-0657047.html",
        date: "2025-06-26",
        last_updated: "2025-07-23",
      },
      {
        title: "Canada Immigration Newsletter August 2025 - YouTube",
        url: "https://www.youtube.com/watch?v=AlJRR9IR3gg",
        date: "2025-08-03",
        last_updated: "2025-08-03",
      },
      {
        title: "Canada's Immigration Levels Plan 2024-2026",
        url: "https://www.canadavisa.com/canada-immigration-levels-plans.html",
        date: "2024-10-25",
        last_updated: "2025-06-16",
      },
      {
        title:
          "Canada Open Work Permit August 2025 | No Job Offer or ... - YouTube",
        url: "https://www.youtube.com/watch?v=todpWQWVtXU",
        date: "2025-07-18",
        last_updated: "2025-07-21",
      },
    ],
    object: "chat.completion",
    choices: [
      {
        index: 0,
        finish_reason: "stop",
        message: {
          role: "assistant",
          content:
            "As of August 2025, Canadian immigration policy has seen several significant updates announced by Immigration, Refugees and Citizenship Canada (IRCC), including new pathways to permanent residence, changes to family reunification programs, and adjustments to work permit streams.\n\nKey updates include:\n- The IRCC has begun sending 17,860 invitations for the 2025 Parents and Grandparents Program (PGP) intake as of July 28, 2025, with only 10,000 complete applications to be accepted on a first-come, first-served basis. Minimum income requirements for the Super Visa program were also raised by about 4% effective July 29, 2025[3].\n- A new permanent PR pathway will be established by making the Economic Mobility Pathways Pilot a permanent feature by the end of 2025. There will also be a new work permit stream introduced for the agriculture and fish processing sectors[2].\n- Changes to eligibility for Spousal Open Work Permits (SOWPs) for spouses of foreign workers and international students are anticipated, as well as updates to the field of study requirements for Post-Graduate Work Permits (PGWP)[2][5].\n- Key pilot programs include a 2-year open work permit pilot for in-demand sectors like construction and healthcare, and ongoing PGWP extensions and bridging open work permits. These updates are designed to increase flexibility for graduates, skilled workers, and spouses of workers/students[5].\n- Canada’s immigration targets were reduced for 2025 with a plan to admit 395,000 new permanent residents, placing greater emphasis on students and workers already in the country and prioritizing economic immigrants for critical sectors, especially healthcare and skilled trades[1][4].\n- IRCC is also advancing a new digital client portal for all applicants, implementing Free Trade Agreement work permits related to new international agreements, and operationalizing the Welcoming Francophone Communities Initiative[2].\n- Canada is considering a potential PR pathway specifically for refugee students[2].\n\nThese changes reflect the government’s sharpened focus on economic needs, family reunification, and modernizing immigration processes, while also tightening admission numbers in response to evolving domestic priorities and labor market needs[1][2][3][4][5].",
        },
        delta: {
          role: "assistant",
          content: "",
        },
      },
    ],
  },
};

export default function SearchTool({ input, output }: Props) {
  const searchResults = output.results.search_results || [];
  const totalCost = output.results.usage?.cost?.total_cost;
  const searchTerm = input.query || "Search";

  // Helper to determine if a result is a video (YouTube)
  const isVideo = (url: string) => /youtube\.com|youtu\.be/.test(url);

  return (
    <div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-4 shadow-lg relative">
      {/* Search Term */}
      <div className="text-sm text-zinc-400 mb-2">
        Search:{" "}
        <span className="text-zinc-200 font-medium">
          "{searchTerm}"
        </span>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {searchResults.map((result, idx) => {
            const video = isVideo(result.url);
            return (
              <div
                key={idx}
                className={`flex flex-col bg-zinc-800 rounded-xl p-4 border border-zinc-700 hover:border-blue-500 transition group shadow-sm h-full`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0">
                    {video ? (
                      <span title="Video Source">
                        <Youtube className="w-5 h-5 text-red-500" />
                      </span>
                    ) : (
                      <span title="Web Source">
                        <Globe className="w-5 h-5 text-blue-400" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-300 hover:underline line-clamp-2"
                    >
                      {result.title}
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-2">
                  <span>{result.date}</span>
                  {result.last_updated && (
                    <span>• Updated: {result.last_updated}</span>
                  )}
                </div>

                <div className="text-xs text-zinc-500 break-all mb-3 line-clamp-1">
                  {result.url}
                </div>

                {video && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-400 underline opacity-80 group-hover:opacity-100 mt-auto"
                  >
                    Watch Video →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-zinc-400 text-sm">No results found.</div>
      )}

      {/* Total Cost - Bottom Right */}
      {typeof totalCost === "number" && (
        <div className="absolute bottom-2 right-4 text-xs text-zinc-500">
          ${totalCost.toFixed(5)}
        </div>
      )}
    </div>
  );
}
