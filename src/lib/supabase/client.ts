"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/env";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!client) {
    const { url, anonKey } = getSupabaseEnv();
    client = createBrowserClient(url, anonKey);
  }

  return client;
}
