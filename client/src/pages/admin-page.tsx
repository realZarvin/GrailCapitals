import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AdminUsersTable } from "@/components/dashboard/admin-users-table";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch admin stats
  const { data: adminStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: !!isAdmin,
  });
  
  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!isAdmin,
  });
  
  // Fetch transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["/api/admin/transactions"],
    enabled: !!isAdmin,
  });
  
  // Redirect if not admin
  if (user && !isAdmin) {
    return <Redirect to="/dashboard" />;
  }
  
  const isLoading = isLoadingStats || isLoadingUsers || isLoadingTransactions;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
      </div>
    );
  }
  
  // Filter users based on search query
  const filteredUsers = users ? users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      {/* Mobile Sidebar */}
      <MobileSidebar isAdmin={true} />
      
      {/* Desktop Sidebar */}
      <Sidebar isAdmin={true} />
      
      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage users and platform operations</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Users"
            value={adminStats?.totalUsers.toString() || "0"}
            icon="fas fa-users"
            change={adminStats?.newUsers ? `${adminStats.newUsers} new this week` : undefined}
            changeType="positive"
          />
          
          <StatsCard
            title="Active Investments"
            value={adminStats?.activeInvestments.toString() || "0"}
            subValue="Across all plans"
            icon="fas fa-chart-pie"
          />
          
          <StatsCard
            title="Total Deposits"
            value={`$${adminStats?.totalDeposits.toLocaleString() || "0"}`}
            icon="fas fa-arrow-down"
            change={adminStats?.newDeposits ? `$${adminStats.newDeposits.toLocaleString()} this week` : undefined}
            changeType="positive"
          />
          
          <StatsCard
            title="Total Withdrawals"
            value={`$${adminStats?.totalWithdrawals.toLocaleString() || "0"}`}
            subValue="Lifetime total"
            icon="fas fa-arrow-up"
          />
        </div>
        
        {/* Users Table */}
        <div className="bg-card p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">User Management</h3>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search users..."
                className="w-64 pr-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"></i>
            </div>
          </div>
          <AdminUsersTable users={filteredUsers} />
          {users && users.length > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-muted-foreground">
                Showing {Math.min(filteredUsers.length, 10)} of {filteredUsers.length} users
              </div>
              <div className="flex space-x-2">
                <Button disabled variant="outline" size="sm">Previous</Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Recent Transactions */}
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <TransactionsTable transactions={transactions || []} isAdmin />
          {transactions && transactions.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="link" className="text-accent hover:underline">View all transactions</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
