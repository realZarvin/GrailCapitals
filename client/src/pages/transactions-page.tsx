import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Loader2, Calendar, FileDown, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: !!user,
  });
  
  // Filter transactions based on active tab and filters
  const getFilteredTransactions = () => {
    if (!transactions) return [];
    
    let filtered = [...transactions];
    
    // Apply type filter from tabs
    if (activeTab !== "all") {
      filtered = filtered.filter(transaction => transaction.type === activeTab);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.walletAddress && transaction.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(transaction => new Date(transaction.date) >= filterDate);
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    // Apply type filter from dropdown (if not already filtered by tab)
    if (typeFilter !== "all" && activeTab === "all") {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }
    
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Calculate totals
  const calculateTotals = () => {
    if (!transactions) return { deposits: 0, withdrawals: 0, roi: 0 };
    
    return transactions.reduce((acc, transaction) => {
      if (transaction.status === "completed") {
        if (transaction.type === "deposit") {
          acc.deposits += transaction.amount;
        } else if (transaction.type === "withdrawal") {
          acc.withdrawals += transaction.amount;
        } else if (transaction.type === "roi") {
          acc.roi += transaction.amount;
        }
      }
      return acc;
    }, { deposits: 0, withdrawals: 0, roi: 0 });
  };
  
  const totals = calculateTotals();
  
  // Handle export CSV
  const handleExportCSV = () => {
    // In a real application, this would generate and download a CSV file
    alert("Exporting transactions to CSV...");
  };
  
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
          <h2 className="text-2xl font-bold mb-1">Transaction History</h2>
          <p className="text-muted-foreground">View and filter your transaction history</p>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-1">Total Deposits</p>
                  <p className="text-2xl font-bold text-green-400">${totals.deposits.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-400/20 flex items-center justify-center">
                  <i className="fas fa-arrow-down text-green-400"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-1">Total Withdrawals</p>
                  <p className="text-2xl font-bold text-red-400">${totals.withdrawals.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-400/20 flex items-center justify-center">
                  <i className="fas fa-arrow-up text-red-400"></i>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground mb-1">Total ROI</p>
                  <p className="text-2xl font-bold text-accent">${totals.roi.toFixed(2)}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <i className="fas fa-chart-line text-accent"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Transactions Table Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={handleExportCSV}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
            
            {/* Filters */}
            {showFilters && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Search</label>
                    <Input
                      placeholder="ID or wallet address"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Date Range</label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter} disabled={activeTab !== "all"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="deposit">Deposits</SelectItem>
                        <SelectItem value="withdrawal">Withdrawals</SelectItem>
                        <SelectItem value="roi">ROI Earnings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setDateFilter("all");
                      setStatusFilter("all");
                      setTypeFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => {
              setActiveTab(value);
              if (value !== "all") {
                setTypeFilter("all");
              }
            }} className="mt-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposit">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
                <TabsTrigger value="roi">ROI</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <TransactionsTable transactions={filteredTransactions} />
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                  No transactions match your current filters. Try adjusting your search criteria or clear filters.
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setDateFilter("all");
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setActiveTab("all");
                }}>
                  Clear All Filters
                </Button>
              </div>
            )}
            
            {filteredTransactions.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                <div>
                  Showing {Math.min(filteredTransactions.length, 10)} of {filteredTransactions.length} transactions
                </div>
                <div className="mt-4 sm:mt-0">
                  Last updated: {format(new Date(), "MMM d, yyyy, HH:mm")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Additional Info */}
        <div className="mt-8">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Transaction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500">
                  Completed
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Transaction has been confirmed and processed successfully.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500">
                  Pending
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Transaction is being processed and waiting for confirmation.
                </p>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500">
                  Failed
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Transaction could not be completed due to an error or rejection.
                </p>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  For any issues with your transactions, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
