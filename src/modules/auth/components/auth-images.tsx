"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
  (i) => `${i}.jpeg`
);

const getRandomImageIndex = () =>
  Math.floor(Math.random() * images.length);

export default function AuthImages() {
  const pathname = usePathname();
  const [idx, setIdx] = useState(() => getRandomImageIndex());

  const setRandomImage = () => setIdx(getRandomImageIndex());
  useEffect(
    function () {
      setRandomImage();
      const intervalId = setInterval(() => {
        setRandomImage();
      }, 10000);
      return () => clearInterval(intervalId);
    },
    [pathname]
  );

  return (
    <Image
      fill
      className="object-cover grayscale"
      alt="Random Auth Page Banner Image"
      src={"/images/" + images[idx]}
    />
  );
}
