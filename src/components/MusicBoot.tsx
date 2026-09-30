"use client";

import { useEffect } from "react";
import { armMusic } from "@/lib/music";

export function MusicBoot() {
  useEffect(() => armMusic(), []);
  return null;
}
