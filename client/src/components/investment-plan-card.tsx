import { Button } from "@/components/ui/button";
import { useCrypto } from "@/context/crypto-context";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface InvestmentPlan {
  id: string;
  name: string;
  dailyRoi: number;
  duration: number;
  minInvestment: number;
  icon: React.ReactNode;
  iconBg: string;
  isPopular: boolean;
}

interface InvestmentPlanCardProps {
  plan: InvestmentPlan;
}

export function InvestmentPlanCard({ plan }: InvestmentPlanCardProps) {
  const { user } = useAuth();
  const { setSelectedPlan } = useCrypto();
  const [, setLocation] = useLocation();

  const totalRoi = plan.dailyRoi * 7 * plan.duration;
  
  const handleSelectPlan = () => {
    if (!user) {
      setLocation('/auth');
      return;
    }
    
    setSelectedPlan(plan);
    setLocation('/dashboard');
  };
  
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-gray-800 hover:border-accent transition-all duration-300 flex flex-col relative">
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-accent text-primary px-4 py-1 font-bold">
          Best Value
        </div>
      )}
      
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className={`w-12 h-12 ${plan.iconBg} rounded-full flex items-center justify-center`}>
            {plan.icon}
          </div>
        </div>
        
        <div className="mb-6">
          <span className="text-4xl font-bold text-accent">{plan.dailyRoi}%</span>
          <span className="text-muted-foreground"> daily ROI</span>
        </div>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-center">
            <i className="fas fa-check text-accent mr-2"></i>
            <span>${plan.minInvestment} minimum investment</span>
          </li>
          <li className="flex items-center">
            <i className="fas fa-check text-accent mr-2"></i>
            <span>{plan.duration} {plan.duration === 1 ? 'week' : 'weeks'} duration</span>
          </li>
          <li className="flex items-center">
            <i className="fas fa-check text-accent mr-2"></i>
            <span>Total ROI: {totalRoi}%</span>
          </li>
          <li className="flex items-center">
            <i className="fas fa-check text-accent mr-2"></i>
            <span>Daily payouts</span>
          </li>
        </ul>
      </div>
      
      <div className="p-6 bg-accent/5">
        <Button 
          variant={plan.isPopular ? "default" : "outline"} 
          className={plan.isPopular ? "w-full py-6 h-auto font-bold" : "border-accent text-accent hover:bg-accent hover:text-primary w-full py-6 h-auto font-bold"}
          onClick={handleSelectPlan}
          size="lg"
        >
          Select Plan
        </Button>
      </div>
    </div>
  );
}
