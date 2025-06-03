import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useState } from 'react'
import './App.css'
import {
  SignTransactionsModals,
  TransactionsToastList
} from '@multiversx/sdk-dapp/UI';

const queryClient = new QueryClient();

const App = () => {
  const [count, setCount] = useState(0)

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* MultiversX SDK UI components for transaction feedback and notifications */}
        <SignTransactionsModals />
        <TransactionsToastList />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
