interface UserMessageProps {
  content: string;
}

export default function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-start">
        <div className="flex flex-col items-end gap-2">
          <div className="max-w-full rounded-2xl rounded-br-md bg-gradient-to-r from-zinc-700 to-zinc-800 px-4 py-3 text-white shadow-lg">
            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
