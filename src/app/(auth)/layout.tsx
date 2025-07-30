import BetterImage from "@/components/better-image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const url = `https://picsum.photos/1600?t=${Date.now()}`;

  return (
    <div className="w-full md:grid md:min-h-screen md:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        {children}
      </div>
      <div className="hidden relative bg-gray-100 md:flex items-center justify-center p-10 dark:bg-gray-800">
        <BetterImage
          fill
          src={url}
          alt="Random Image"
          suppressHydrationWarning
          className="object-cover grayscale"
        />
        <div className="inset-0 absolute bg-black/50"></div>
      </div>
    </div>
  );
}
