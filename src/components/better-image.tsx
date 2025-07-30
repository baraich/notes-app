"server-only";
// import Image from "@sohanemon/next-image";
import Image from "next/image";
import type { ImageProps } from "next/image";

export default function BetterImage(props: ImageProps) {
  return <Image {...props} />;
}
