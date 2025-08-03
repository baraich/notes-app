import MapDisplay from "./map-display";

interface AssistantMessageProps {
  content: string;
  toolCalls?: { toolName: string; output: unknown; input: unknown }[];
}

export default function AssistantMessage({
  content,
  toolCalls,
}: AssistantMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-3 ">
        <div className="flex flex-col gap-2">
          <div className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-2xl rounded-bl-md shadow-lg max-w-full">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          {toolCalls?.map((tool, idx) =>
            tool.toolName == "map" ? (
              <MapDisplay
                key={idx}
                locationName={
                  (tool.input as { location: string })?.location
                }
                location={
                  tool.output as {
                    latitude: number;
                    longitude: number;
                  }
                }
              />
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
