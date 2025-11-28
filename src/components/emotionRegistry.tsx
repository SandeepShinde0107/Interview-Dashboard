"use client";

import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/src/lib/createEmotionCache";
import { useState } from "react";

export default function EmotionRegistry({ children }: any) {
  const [cache] = useState(() => createEmotionCache());
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
