import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UiPreferencesProvider } from "@/lib/ui-preferences";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import About from "@/pages/About";
import ProductDetails from "@/pages/ProductDetails";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function RouteScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/about" component={About} />
      <Route path="/item/:id" component={ProductDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UiPreferencesProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RouteScrollManager />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </UiPreferencesProvider>
    </QueryClientProvider>
  );
}

export default App;
