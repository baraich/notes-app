import { useEffect, useState } from "react";

const shimmerTextChoices: string[] = [
  "Thinking...",
  "Brewing something good...",
  "Working on it...",
  "Just a sec...",
  "Cooking up a response...",
  "Hold tight...",
  "Loading...",
  "Almost ready...",
  "Putting pieces together...",
  "Getting my ducks in a row...",
  "Bear with me...",
  "Magic happening...",
];

export default function ShimmerMessage() {
  const [textIdx, setTextIdx] = useState(0);

  useEffect(function () {
    const intervalId = setInterval(function () {
      setTextIdx((idx) =>
        idx === shimmerTextChoices.length - 1 ? 0 : idx + 1,
      );
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="flex items-start">
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white">
            <p className="animate-pulse text-sm leading-relaxed break-words whitespace-pre-wrap">
              {shimmerTextChoices[textIdx]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
