"use client";
import React from "react";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

function Providers(props: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
}

export default Providers;
