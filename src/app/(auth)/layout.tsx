import AuthImagesContainer from "@/modules/auth/components/auth-images-container";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full min-h-screen w-full bg-black md:grid md:grid-cols-2 lg:grid-cols-8">
      <div className="mx-5 flex h-full items-center justify-center py-12 lg:col-span-3">
        {children}
      </div>
      <div className="relative hidden items-center justify-center bg-zinc-900 p-10 md:flex lg:col-span-5">
        <AuthImagesContainer />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
    </div>
  );
}
