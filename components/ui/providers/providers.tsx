"use client";

import { SessionProvider as NextAuthProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <NextAuthProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextAuthProvider>
  );
}
