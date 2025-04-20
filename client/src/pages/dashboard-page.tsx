import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useQuery, useMutation } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Button } from "@/components/ui/button";
import { DepositModal } from "@/components/deposit-modal";
import { WithdrawModal } from "@/components/withdraw-modal";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: !!user,
  });

  // Fetch user transactions
  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });

  // Function to handle withdrawal eligibility
  const canWithdraw = dashboardData?.activeInvestmentPlan && dashboardData?.balance > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Mobile Sidebar */}
      <MobileSidebar />
      
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Welcome back, <span className="text-accent">{user?.fullName}</span></h2>
          <p className="text-muted-foreground">Here's an overview of your investments</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Current Balance"
            value={`$${dashboardData?.balance.toFixed(2) || '0.00'}`}
            icon="fas fa-wallet"
            change={dashboardData?.dailyGrowth ? `${dashboardData.dailyGrowth.toFixed(2)}% today` : undefined}
            changeType="positive"
          />
          
          <StatsCard
            title="Active Plan"
            value={dashboardData?.activeInvestmentPlan?.name || 'None'}
            subValue={dashboardData?.activeInvestmentPlan ? `${dashboardData.activeInvestmentPlan.dailyRoi}% daily ROI` : 'No active investment'}
            icon="fas fa-crown"
          />
          
          <StatsCard
            title="ROI Progress"
            value={`${dashboardData?.earnedRoi || 0}%`}
            progressValue={dashboardData?.roiProgress || 0}
            subValue={`${dashboardData?.daysRemaining || 0} days remaining`}
            icon="fas fa-chart-line"
          />
          
          <StatsCard
            title="Total Profit"
            value={`$${dashboardData?.totalProfit.toFixed(2) || '0.00'}`}
            subValue="Lifetime earnings"
            icon="fas fa-coins"
          />
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button 
            variant="default" 
            size="lg" 
            className="h-16 text-lg"
            onClick={() => setShowDepositModal(true)}
          >
            <i className="fas fa-plus-circle mr-2"></i> Deposit Funds
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="h-16 text-lg border-accent text-accent hover:bg-accent hover:text-primary"
            disabled={!canWithdraw}
            onClick={() => canWithdraw ? setShowWithdrawModal(true) : toast({
              title: "Withdrawal not available",
              description: "You need an active investment plan with a positive balance to withdraw funds.",
              variant: "destructive"
            })}
          >
            <i className="fas fa-money-bill-wave mr-2"></i> Withdraw Funds
          </Button>
        </div>
        
        {/* Chart Section */}
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4">Investment Performance</h3>
          <div className="h-64 w-full">
            <PerformanceChart data={dashboardData?.performanceData || []} />
          </div>
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <TransactionsTable transactions={transactions || []} />
          {transactions && transactions.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="link" className="text-accent hover:underline">View all transactions</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Deposit Modal */}
      <DepositModal 
        open={showDepositModal} 
        onClose={() => setShowDepositModal(false)} 
      />
      
      {/* Withdraw Modal */}
      <WithdrawModal 
        open={showWithdrawModal} 
        onClose={() => setShowWithdrawModal(false)} 
        availableBalance={dashboardData?.balance || 0}
      />
    </div>
  );
}
