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
          <div className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-2xl">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words animate-pulse">
              {shimmerTextChoices[textIdx]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
