"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getGame } from "./registry";

export default function GameLoader({ id }: { id: string }) {
  const router = useRouter();
  const entry = getGame(id);

  useEffect(() => {
    if (!entry) router.replace("/");
  }, [entry, router]);

  if (!entry) {
    return <div className="flex min-h-dvh items-center justify-center text-5xl">🤔</div>;
  }

  const { Component } = entry;
  return <Component onHome={() => window.location.assign("/")} />;
}
