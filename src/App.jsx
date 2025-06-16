import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import "./index.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div>
          <AppRoutes />
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
