import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'roi';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  cryptocurrency?: string;
  walletAddress?: string;
  userName?: string; // for admin view
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isAdmin?: boolean;
}

export function TransactionsTable({ transactions, isAdmin = false }: TransactionsTableProps) {
  const [expandedDetails, setExpandedDetails] = useState<string | null>(null);
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <i className="fas fa-receipt text-3xl mb-2"></i>
        <p>No transactions yet</p>
      </div>
    );
  }
  
  const toggleDetails = (id: string) => {
    if (expandedDetails === id) {
      setExpandedDetails(null);
    } else {
      setExpandedDetails(id);
    }
  };
  
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
          <i className="fas fa-arrow-down text-green-500"></i>
        </div>;
      case 'withdrawal':
        return <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
          <i className="fas fa-arrow-up text-red-500"></i>
        </div>;
      case 'roi':
        return <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
          <i className="fas fa-plus text-blue-500"></i>
        </div>;
    }
  };
  
  const getCryptoIcon = (crypto?: string) => {
    if (!crypto) return null;
    
    switch (crypto.toLowerCase()) {
      case 'btc':
        return <i className="fab fa-bitcoin text-[#F7931A]"></i>;
      case 'eth':
        return <i className="fab fa-ethereum text-[#627EEA]"></i>;
      case 'sol':
        return <i className="fas fa-sun text-[#00FFA3]"></i>;
      default:
        return null;
    }
  };
  
  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/20 text-green-500 border-0">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-0">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/20 text-red-500 border-0">Failed</Badge>;
    }
  };
  
  const formatAmount = (amount: number, type: Transaction['type']) => {
    const prefix = type === 'withdrawal' ? '-' : '+';
    return `${prefix}$${amount.toFixed(2)}`;
  };
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead>User</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            {isAdmin && <TableHead>Crypto</TableHead>}
            {isAdmin && <TableHead>Wallet</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <>
              <TableRow key={transaction.id}>
                {isAdmin && (
                  <TableCell>{transaction.userName}</TableCell>
                )}
                <TableCell>
                  <div className="flex items-center">
                    {getTypeIcon(transaction.type)}
                    <span className="capitalize">{transaction.type}</span>
                  </div>
                </TableCell>
                <TableCell className={transaction.type === 'withdrawal' ? 'text-red-500' : 'text-accent'}>
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {transaction.cryptocurrency && (
                      <div className="flex items-center gap-2">
                        {getCryptoIcon(transaction.cryptocurrency)}
                        <span>{transaction.cryptocurrency.toUpperCase()}</span>
                      </div>
                    )}
                  </TableCell>
                )}
                {isAdmin && (
                  <TableCell className="max-w-[150px] truncate">
                    {transaction.walletAddress || '-'}
                  </TableCell>
                )}
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleDetails(transaction.id)}
                    >
                      <i className={`fas ${expandedDetails === transaction.id ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </Button>
                  </TableCell>
                )}
              </TableRow>
              {isAdmin && expandedDetails === transaction.id && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-muted/30">
                    <div className="p-4">
                      <h4 className="font-medium mb-2">Transaction Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Transaction ID</p>
                          <p className="font-mono">{transaction.id}</p>
                        </div>
                        {transaction.walletAddress && (
                          <div>
                            <p className="text-sm text-muted-foreground">Wallet Address</p>
                            <p className="font-mono break-all">{transaction.walletAddress}</p>
                          </div>
                        )}
                        {/* Additional details could be added here */}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
