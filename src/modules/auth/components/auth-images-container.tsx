"use client";
import dynamic from "next/dynamic";

const AuthImages = dynamic(
  async () => import("@/modules/auth/components/auth-images"),
  { ssr: false }
);

export default function AuthImagesContainer() {
  return <AuthImages />;
}
