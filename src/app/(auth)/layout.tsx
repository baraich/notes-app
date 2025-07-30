import AuthImagesContainer from "@/modules/auth/components/auth-images-container";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen h-full md:grid md:grid-cols-2 lg:grid-cols-8">
      <div className="flex items-center justify-center py-12 mx-5 lg:col-span-3 h-full">
        {children}
      </div>
      <div className="hidden relative bg-gray-100 md:flex items-center justify-center p-10 dark:bg-gray-800 lg:col-span-5">
        <AuthImagesContainer />
        <div className="inset-0 absolute bg-black/50"></div>
      </div>
    </div>
  );
}
