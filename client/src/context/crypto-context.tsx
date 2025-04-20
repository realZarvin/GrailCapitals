import { createContext, ReactNode, useContext, useState } from "react";

// Investment plan type
export interface InvestmentPlan {
  id: string;
  name: string;
  dailyRoi: number;
  duration: number;
  minInvestment: number;
  icon?: React.ReactNode;
  iconBg?: string;
  isPopular?: boolean;
}

interface CryptoContextType {
  selectedPlan: InvestmentPlan | null;
  setSelectedPlan: (plan: InvestmentPlan | null) => void;
}

const CryptoContext = createContext<CryptoContextType | undefined>(undefined);

export function CryptoProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);

  const value = {
    selectedPlan,
    setSelectedPlan,
  };

  return (
    <CryptoContext.Provider value={value}>
      {children}
    </CryptoContext.Provider>
  );
}

export function useCrypto() {
  const context = useContext(CryptoContext);
  if (context === undefined) {
    throw new Error("useCrypto must be used within a CryptoProvider");
  }
  return context;
}
