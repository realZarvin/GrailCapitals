import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import ProfilePage from "@/pages/profile-page";
import TransactionsPage from "@/pages/transactions-page";
import InvestmentPlansPage from "@/pages/investment-plans-page";
import SupportPage from "@/pages/support-page";
import { ProtectedRoute } from "./lib/protected-route";
import { CryptoProvider } from "./context/crypto-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/plans" component={InvestmentPlansPage} />
      <Route path="/support" component={SupportPage} />
      <ProtectedRoute path="/dashboard" component={DashboardPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/transactions" component={TransactionsPage} />
      <ProtectedRoute path="/admin" component={AdminPage} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <CryptoProvider>
        <Toaster />
        <Router />
      </CryptoProvider>
    </TooltipProvider>
  );
}

export default App;
