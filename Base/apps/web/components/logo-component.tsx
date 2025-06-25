"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import LogoAuth from "@/public/logo_auth.svg";

export function LogoComponent() {
  const { theme } = useTheme();
  return (
    <Image
      src={theme === "dark" ? LogoAuth.src : LogoAuth.src}
      alt="background"
      width={400}
      height={400}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
    />
  );
}
