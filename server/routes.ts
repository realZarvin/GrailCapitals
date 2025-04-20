import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { generateWallet } from "../client/src/lib/crypto-utils";
import { setupCronJobs } from "./cron";
import { weeksToDays, isValidInvestmentAmount } from "../client/src/lib/crypto-utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Setup periodic cron jobs for ROI calculation
  setupCronJobs();
  
  // API Routes
  
  // Get dashboard data
  app.get("/api/dashboard", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Get user active investment
    const activeInvestment = await storage.getUserActiveInvestment(userId);
    
    // Get user transactions
    const transactions = await storage.getTransactionsByUserId(userId);
    
    // Get investment plan details if active investment exists
    let activeInvestmentPlan = null;
    if (activeInvestment) {
      const plan = await storage.getInvestmentPlan(activeInvestment.planId);
      
      if (plan) {
        activeInvestmentPlan = {
          name: plan.name,
          dailyRoi: Number(activeInvestment.dailyRoi),
        };
      }
    }
    
    // Calculate earned ROI and ROI progress
    let earnedRoi = 0;
    let roiProgress = 0;
    let daysRemaining = 0;
    let dailyGrowth = 0;
    
    if (activeInvestment) {
      const currentDate = new Date();
      const startDate = new Date(activeInvestment.startDate);
      const endDate = new Date(activeInvestment.endDate);
      
      // Calculate days invested
      const daysInvested = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate earned ROI based on daily ROI and days invested
      earnedRoi = daysInvested * Number(activeInvestment.dailyRoi);
      
      // Calculate ROI progress percentage
      const totalDays = Number(activeInvestment.durationDays);
      roiProgress = Math.min(100, Math.floor((daysInvested / totalDays) * 100));
      
      // Calculate days remaining
      daysRemaining = Math.max(0, totalDays - daysInvested);
      
      // Current daily growth percentage relative to total investment
      dailyGrowth = Number(activeInvestment.dailyRoi);
    }
    
    // Calculate total profit from ROI transactions
    const totalProfit = transactions
      .filter(tx => tx.type === "roi" && tx.status === "completed")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    // Generate sample performance data for chart
    const performanceData = generatePerformanceData(transactions, activeInvestment);
    
    return res.json({
      balance: Number(req.user.balance),
      activeInvestmentPlan,
      earnedRoi,
      roiProgress,
      daysRemaining,
      dailyGrowth,
      totalProfit,
      performanceData
    });
  });
  
  // Get user transactions
  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const transactions = await storage.getTransactionsByUserId(req.user.id);
    
    // Transform transactions for frontend display
    const transformedTransactions = transactions.map(tx => {
      // Don't expose private keys to frontend
      const { privateKey, ...txWithoutPrivateKey } = tx;
      return {
        ...txWithoutPrivateKey,
        amount: Number(txWithoutPrivateKey.amount),
        date: txWithoutPrivateKey.createdAt.toISOString()
      };
    });
    
    return res.json(transformedTransactions);
  });
  
  // Generate wallet address for deposit
  app.post("/api/wallet/generate", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { planId, amount, crypto } = req.body;
    
    // Validate planId
    const plan = await storage.getInvestmentPlan(parseInt(planId));
    if (!plan) {
      return res.status(400).json({ message: "Invalid investment plan" });
    }
    
    // Validate amount meets minimum investment
    if (!isValidInvestmentAmount(amount, Number(plan.minInvestment))) {
      return res.status(400).json({ 
        message: `Minimum investment for ${plan.name} plan is $${plan.minInvestment}` 
      });
    }
    
    // Validate crypto
    if (!["btc", "eth", "sol"].includes(crypto)) {
      return res.status(400).json({ message: "Invalid cryptocurrency" });
    }
    
    try {
      // Generate wallet
      const wallet = generateWallet(crypto);
      
      // Save wallet to storage
      await storage.createWallet({
        userId: req.user.id,
        cryptocurrency: crypto,
        address: wallet.address,
        privateKey: wallet.privateKey
      });
      
      return res.json({ walletAddress: wallet.address });
    } catch (error) {
      console.error("Wallet generation error:", error);
      return res.status(500).json({ message: "Failed to generate wallet address" });
    }
  });
  
  // Confirm deposit
  app.post("/api/deposit/confirm", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { planId, amount, crypto, walletAddress } = req.body;
    
    // Validate plan
    const plan = await storage.getInvestmentPlan(parseInt(planId));
    if (!plan) {
      return res.status(400).json({ message: "Invalid investment plan" });
    }
    
    // Create transaction record
    const transaction = await storage.createTransaction({
      userId: req.user.id,
      type: "deposit",
      amount,
      cryptocurrency: crypto,
      walletAddress,
      status: "completed", // For demo, auto-complete the transaction
      note: `Deposit for ${plan.name} plan`
    });
    
    // Check if user already has an active investment
    const existingInvestment = await storage.getUserActiveInvestment(req.user.id);
    if (existingInvestment) {
      // Mark existing investment as completed
      await storage.updateInvestment(existingInvestment.id, { status: "completed" });
    }
    
    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Number(plan.durationDays));
    
    // Create investment record
    await storage.createInvestment({
      userId: req.user.id,
      planId: parseInt(planId),
      amount,
      dailyRoi: plan.dailyRoi,
      durationDays: plan.durationDays,
      startDate,
      endDate,
      status: "active"
    });
    
    // Update user balance
    const user = await storage.getUser(req.user.id);
    if (user) {
      await storage.updateUser(user.id, { 
        balance: Number(user.balance) + amount 
      });
    }
    
    return res.json({ success: true });
  });
  
  // Process withdrawal
  app.post("/api/withdraw", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const { amount, crypto, walletAddress } = req.body;
    const user = await storage.getUser(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if amount is valid
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal amount" });
    }
    
    // Check if user has enough balance
    if (Number(user.balance) < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    
    // Check minimum withdrawal (10% of balance)
    const minWithdrawal = Math.max(10, Number(user.balance) * 0.1);
    if (amount < minWithdrawal) {
      return res.status(400).json({ 
        message: `Minimum withdrawal amount is $${minWithdrawal.toFixed(2)}` 
      });
    }
    
    // Create withdrawal transaction
    await storage.createTransaction({
      userId: user.id,
      type: "withdrawal",
      amount,
      cryptocurrency: crypto,
      walletAddress,
      status: "pending", // Withdrawals are pending by default
      note: "Withdrawal request"
    });
    
    // For demo purposes, automatically approve the withdrawal
    // In a real system, this would be handled by an admin
    await storage.updateUser(user.id, { 
      balance: Number(user.balance) - amount 
    });
    
    return res.json({ success: true });
  });
  
  // Admin routes
  
  // Get admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const stats = await storage.getDashboardStats();
    return res.json(stats);
  });
  
  // Get all users for admin
  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const users = await storage.getAllUsers();
    
    // Transform users for frontend display (remove sensitive data)
    const transformedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      
      // Get active plan for user
      const activePlan = "Diamond"; // Mock data, would fetch from active investment
      
      return {
        ...userWithoutPassword,
        balance: Number(userWithoutPassword.balance),
        activePlan
      };
    });
    
    return res.json(transformedUsers);
  });
  
  // Get all transactions for admin
  app.get("/api/admin/transactions", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const transactions = await storage.getAllTransactions();
    const users = await storage.getAllUsers();
    
    // Transform transactions for frontend display
    const transformedTransactions = transactions.map(tx => {
      // Find user for this transaction
      const user = users.find(u => u.id === tx.userId);
      
      return {
        ...tx,
        amount: Number(tx.amount),
        userName: user ? user.fullName : "Unknown",
        date: tx.createdAt.toISOString()
      };
    });
    
    return res.json(transformedTransactions);
  });
  
  // Admin user actions (suspend, activate, etc.)
  app.post("/api/admin/users/:userId/:action", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { userId, action } = req.params;
    const user = await storage.getUser(parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    switch (action) {
      case "suspend":
        await storage.updateUser(user.id, { status: "suspended" });
        break;
      case "activate":
        await storage.updateUser(user.id, { status: "active" });
        break;
      case "edit":
        // For a complete implementation, this would handle editing user details
        break;
      default:
        return res.status(400).json({ message: "Invalid action" });
    }
    
    return res.json({ success: true });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to generate performance data for the chart
function generatePerformanceData(transactions: any[], activeInvestment: any) {
  // If no active investment, return empty array
  if (!activeInvestment) {
    return [];
  }
  
  const data = [];
  const startDate = new Date(activeInvestment.startDate);
  const amount = Number(activeInvestment.amount);
  const dailyRoi = Number(activeInvestment.dailyRoi) / 100;
  
  // Generate data points for the past 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Skip future dates
    if (date > new Date()) {
      break;
    }
    
    const value = amount * (1 + (dailyRoi * i));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(2))
    });
  }
  
  return data;
}
