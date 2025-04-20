import { useState, useEffect } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { useCrypto } from "@/context/crypto-context";

// Investment plans
const plans = [
  { id: "silver", name: "Silver", dailyRoi: 2, minAmount: 100 },
  { id: "gold", name: "Gold", dailyRoi: 3, minAmount: 150 },
  { id: "platinum", name: "Platinum", dailyRoi: 4, minAmount: 250 },
  { id: "diamond", name: "Diamond", dailyRoi: 5, minAmount: 400 },
];

// Crypto options
const cryptoOptions = [
  { id: "btc", name: "BTC", icon: "fab fa-bitcoin" },
  { id: "eth", name: "ETH", icon: "fab fa-ethereum" },
  { id: "sol", name: "SOL", icon: "fas fa-sun" },
];

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
}

export function DepositModal({ open, onClose }: DepositModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { selectedPlan: initialPlan, setSelectedPlan } = useCrypto();
  
  const [selectedPlan, setSelectedPlanLocal] = useState<string>(initialPlan?.id || "");
  const [amount, setAmount] = useState<string>("");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [showWalletSection, setShowWalletSection] = useState(false);
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setSelectedPlanLocal(initialPlan?.id || "");
      setAmount(initialPlan ? initialPlan.minInvestment.toString() : "");
      setSelectedCrypto("");
      setShowWalletSection(false);
    }
  }, [open, initialPlan]);
  
  // Generate wallet address mutation
  const generateWalletMutation = useMutation({
    mutationFn: async (data: { planId: string; amount: number; crypto: string }) => {
      const res = await apiRequest("POST", "/api/wallet/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setWalletAddress(data.walletAddress);
      setShowWalletSection(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate wallet address: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const handleGenerateWallet = () => {
    if (!selectedPlan || !amount || !selectedCrypto) {
      toast({
        title: "Incomplete Form",
        description: "Please fill out all fields to continue.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedPlanDetails = plans.find(p => p.id === selectedPlan);
    const amountNumber = parseFloat(amount);
    
    if (!selectedPlanDetails) {
      toast({
        title: "Invalid Plan",
        description: "Please select a valid investment plan.",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(amountNumber) || amountNumber < selectedPlanDetails.minAmount) {
      toast({
        title: "Invalid Amount",
        description: `Minimum investment for ${selectedPlanDetails.name} plan is $${selectedPlanDetails.minAmount}.`,
        variant: "destructive",
      });
      return;
    }
    
    generateWalletMutation.mutate({
      planId: selectedPlan,
      amount: amountNumber,
      crypto: selectedCrypto,
    });
  };
  
  // Confirm deposit mutation
  const confirmDepositMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/deposit/confirm", {
        planId: selectedPlan,
        amount: parseFloat(amount),
        crypto: selectedCrypto,
        walletAddress,
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      toast({
        title: "Deposit Initiated",
        description: "Your deposit has been initiated. It will be credited after blockchain confirmation.",
      });
      
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to confirm deposit: ${(error as Error).message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleConfirm = () => {
    confirmDepositMutation.mutate();
  };
  
  // Get minimum amount for selected plan
  const getMinAmount = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    return plan ? plan.minAmount : 100;
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Choose your investment plan and deposit method
          </DialogDescription>
        </DialogHeader>
        
        {!showWalletSection ? (
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-muted-foreground mb-2">Select Investment Plan</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {plans.map((plan) => (
                  <label 
                    key={plan.id}
                    className={`relative border rounded-md p-3 cursor-pointer hover:border-accent ${
                      selectedPlan === plan.id ? 'border-accent bg-accent/10' : 'border-border'
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      className="sr-only"
                      checked={selectedPlan === plan.id}
                      onChange={() => {
                        setSelectedPlanLocal(plan.id);
                        setAmount(plan.minAmount.toString());
                      }}
                    />
                    <div className="flex flex-col items-center">
                      <span className="font-bold">{plan.name}</span>
                      <span className="text-sm text-muted-foreground">{plan.dailyRoi}% Daily</span>
                      <span className="text-xs text-muted-foreground">Min: ${plan.minAmount}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-muted-foreground mb-2">Amount (USD)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={getMinAmount()}
                placeholder="Enter amount"
                required
              />
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
                      name="crypto"
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
            
            <DialogFooter className="mt-6 flex space-x-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateWallet} 
                className="flex-1"
                disabled={!selectedPlan || !amount || !selectedCrypto || generateWalletMutation.isPending}
              >
                {generateWalletMutation.isPending ? "Generating..." : "Continue"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="bg-muted p-4 rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-2">Deposit to this wallet address:</p>
              <div className="font-mono text-accent break-all mb-2 select-all p-2 bg-card border border-border rounded-md">
                {walletAddress}
              </div>
              <div className="flex justify-center mb-2">
                <div className="w-32 h-32 bg-white p-2 rounded-md">
                  {/* Display QR code here */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-full h-full border-2 border-black"
                    style={{ background: 'white' }}
                  >
                    <rect x="10" y="10" width="10" height="10" />
                    <rect x="30" y="10" width="10" height="10" />
                    <rect x="50" y="10" width="10" height="10" />
                    {/* This is just a simple representation, use a real QR code library */}
                  </svg>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Send only <span className="text-accent">{selectedCrypto.toUpperCase()}</span> to this address. 
                Your investment will be credited after <span className="text-accent">1 confirmation</span>.
              </p>
            </div>
            
            <div className="bg-accent/10 p-4 rounded-md">
              <div className="flex items-start">
                <i className="fas fa-info-circle text-accent mt-1 mr-2"></i>
                <p className="text-sm text-muted-foreground">
                  After sending the payment, click "Confirm" to notify our system. 
                  We'll automatically detect your deposit on the blockchain.
                </p>
              </div>
            </div>
            
            <DialogFooter className="mt-6 flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                className="flex-1"
                disabled={confirmDepositMutation.isPending}
              >
                {confirmDepositMutation.isPending ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
