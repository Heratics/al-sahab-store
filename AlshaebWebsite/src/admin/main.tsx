import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import AdminApp from "@/admin/AdminApp";

const queryClient = new QueryClient();

createRoot(document.getElementById("admin-root")!).render(
  <QueryClientProvider client={queryClient}>
    <AdminApp />
  </QueryClientProvider>
);
