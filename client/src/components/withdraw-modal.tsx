import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Crypto options
const cryptoOptions = [
  { id: "btc", name: "BTC", icon: "fab fa-bitcoin" },
  { id: "eth", name: "ETH", icon: "fab fa-ethereum" },
  { id: "sol", name: "SOL", icon: "fas fa-sun" },
];

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
}

export function WithdrawModal({ open, onClose, availableBalance }: WithdrawModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  
  // Calculate minimum withdrawal amount (10% of available balance)
  const minWithdrawalAmount = Math.max(10, availableBalance * 0.1);
  
  // Withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number; crypto: string; walletAddress: string }) => {
      const res = await apiRequest("POST", "/api/withdraw", data);
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted and is being processed.",
      });
      
      onClose();
      
      // Reset form
      setAmount("");
      setSelectedCrypto("");
      setWalletAddress("");
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Failed",
        description: `Failed to process withdrawal: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleWithdraw = () => {
    if (!amount || !selectedCrypto || !walletAddress) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const amountNumber = parseFloat(amount);
    
    if (isNaN(amountNumber) || amountNumber < minWithdrawalAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum withdrawal amount is $${minWithdrawalAmount.toFixed(2)}.`,
        variant: "destructive",
      });
      return;
    }
    
    if (amountNumber > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: "Withdrawal amount exceeds your available balance.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate wallet address
    if (!walletAddress.trim() || walletAddress.length < 10) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }
    
    withdrawMutation.mutate({
      amount: amountNumber,
      crypto: selectedCrypto,
      walletAddress,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Request a withdrawal from your investment account
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div>
            <label className="block text-muted-foreground mb-2">Available Balance</label>
            <div className="bg-muted p-3 rounded-md text-2xl font-bold">
              ${availableBalance.toFixed(2)}
            </div>
          </div>
          
          <div>
            <label className="block text-muted-foreground mb-2">Amount to Withdraw (USD)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={minWithdrawalAmount}
              max={availableBalance}
              placeholder="Enter amount"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum withdrawal: ${minWithdrawalAmount.toFixed(2)}
            </p>
          </div>
          
          <div>
            <label className="block text-muted-foreground mb-2">Select Cryptocurrency</label>
            <div className="flex space-x-3">
              {cryptoOptions.map((crypto) => (
                <label 
                  key={crypto.id}
                  className={`relative flex-1 border rounded-md p-3 cursor-pointer hover:border-accent ${
                    selectedCrypto === crypto.id ? 'border-accent bg-accent/10' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="withdraw-crypto"
                    value={crypto.id}
                    className="sr-only"
                    checked={selectedCrypto === crypto.id}
                    onChange={() => setSelectedCrypto(crypto.id)}
                  />
                  <div className="flex flex-col items-center">
                    <i className={`${crypto.icon} text-2xl`}></i>
                    <span className="mt-2">{crypto.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-muted-foreground mb-2">Wallet Address</label>
            <Input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter your wallet address"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Double-check your address before confirming
            </p>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-md">
            <div className="flex items-start">
              <i className="fas fa-info-circle text-accent mt-1 mr-2"></i>
              <p className="text-sm text-muted-foreground">
                Withdrawals are processed within 24 hours. A 1% fee applies to all withdrawals.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            className="flex-1"
            disabled={withdrawMutation.isPending}
          >
            {withdrawMutation.isPending ? "Processing..." : "Request Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
