import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { router } from "./router";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner.tsx";

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const isMobile = useIsMobile();
  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);
  return loading ? (
    <Spinner
      size="large"
      className="flex h-screen items-center justify-center"
    />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster
          richColors
          expand
          visibleToasts={8}
          closeButton
          position={isMobile ? "top-center" : "bottom-right"}
        />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}

export default App;
