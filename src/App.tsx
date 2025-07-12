import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { CentroEstudios } from "./pages/CentroEstudios";
import { Patrimonio } from "./pages/Patrimonio";
import { Cashflow } from "./pages/Cashflow";
import { Duplicador } from "./pages/Duplicador";
import { CalidadVida } from "./pages/CalidadVida";
import { IngresosActivos } from "./pages/IngresosActivos";
import { AhorrosFondo } from "./pages/AhorrosFondo";
import { Gastos } from "./pages/Gastos";
import { ProgramaPromotor } from "./pages/ProgramaPromotor";
import { Profile } from "./pages/Profile";
import { Paywall } from "./pages/Paywall";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/centro-estudios" element={<CentroEstudios onBack={() => window.history.back()} />} />
          <Route path="/patrimonio" element={<Patrimonio onBack={() => window.history.back()} />} />
          <Route path="/cashflow" element={<Cashflow onBack={() => window.history.back()} />} />
          <Route path="/duplicador" element={<Duplicador onBack={() => window.history.back()} />} />
          <Route path="/calidad-vida" element={<CalidadVida onBack={() => window.history.back()} />} />
          <Route path="/ingresos-activos" element={<IngresosActivos onBack={() => window.history.back()} />} />
          <Route path="/ahorros-fondo" element={<AhorrosFondo onBack={() => window.history.back()} />} />
          <Route path="/gastos" element={<Gastos onBack={() => window.history.back()} />} />
          <Route path="/programa-promotor" element={<ProgramaPromotor onBack={() => window.history.back()} />} />
          <Route path="/profile" element={<Profile onBack={() => window.history.back()} />} />
          <Route path="/paywall" element={<Paywall />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
