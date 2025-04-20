import { 
  User, InsertUser, 
  InvestmentPlan, InsertInvestmentPlan, 
  Investment, InsertInvestment, 
  Transaction, InsertTransaction, 
  Wallet, InsertWallet 
} from "@shared/schema";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);
const scryptAsync = promisify(scrypt);

// Hash password function
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Generate unique ID for each entity type
function generateId(entityIds: Map<number, any>): number {
  let id = 1;
  while (entityIds.has(id)) {
    id++;
  }
  return id;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Investment plan methods
  getInvestmentPlan(id: number): Promise<InvestmentPlan | undefined>;
  getInvestmentPlans(): Promise<InvestmentPlan[]>;
  
  // Investment methods
  createInvestment(investment: InsertInvestment): Promise<Investment>;
  getInvestmentsByUserId(userId: number): Promise<Investment[]>;
  getUserActiveInvestment(userId: number): Promise<Investment | undefined>;
  updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Wallet methods
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  
  // Session store
  sessionStore: session.SessionStore;
  
  // For admin purposes
  getDashboardStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private investmentPlans: Map<number, InvestmentPlan>;
  private investments: Map<number, Investment>;
  private transactions: Map<number, Transaction>;
  private wallets: Map<number, Wallet>;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.investmentPlans = new Map();
    this.investments = new Map();
    this.transactions = new Map();
    this.wallets = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize default investment plans
    this.initializeInvestmentPlans();
    // Create admin user
    this.createAdminUser();
  }

  async initializeInvestmentPlans() {
    const plans = [
      {
        id: 1,
        name: "Silver",
        dailyRoi: 2,
        durationDays: 7, // 1 week
        minInvestment: 100,
        isActive: true
      },
      {
        id: 2,
        name: "Gold",
        dailyRoi: 3,
        durationDays: 14, // 2 weeks
        minInvestment: 150,
        isActive: true
      },
      {
        id: 3,
        name: "Platinum",
        dailyRoi: 4,
        durationDays: 21, // 3 weeks
        minInvestment: 250,
        isActive: true
      },
      {
        id: 4,
        name: "Diamond",
        dailyRoi: 5,
        durationDays: 28, // 4 weeks
        minInvestment: 400,
        isActive: true
      }
    ];
    
    plans.forEach(plan => {
      this.investmentPlans.set(plan.id, plan as InvestmentPlan);
    });
  }
  
  async createAdminUser() {
    const adminExists = await this.getUserByEmail("Admin@Admin.com");
    if (!adminExists) {
      const adminPassword = await hashPassword("AdminPassword");
      const admin: User = {
        id: 1,
        fullName: "Admin User",
        email: "Admin@Admin.com",
        password: adminPassword,
        country: "US",
        gender: "prefer-not-to-say",
        balance: 0,
        isVerified: true,
        isAdmin: true,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(admin.id, admin);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = generateId(this.users);
    const hashedPassword = await hashPassword(userData.password);
    
    const user: User = {
      id,
      ...userData,
      password: hashedPassword,
      balance: 0,
      isVerified: false, // Requires email verification
      isAdmin: false,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Investment plan methods
  async getInvestmentPlan(id: number): Promise<InvestmentPlan | undefined> {
    return this.investmentPlans.get(id);
  }

  async getInvestmentPlans(): Promise<InvestmentPlan[]> {
    return Array.from(this.investmentPlans.values());
  }

  // Investment methods
  async createInvestment(investmentData: InsertInvestment): Promise<Investment> {
    const id = generateId(this.investments);
    
    const investment: Investment = {
      id,
      ...investmentData,
      totalProfit: 0,
      createdAt: new Date()
    };
    
    this.investments.set(id, investment);
    return investment;
  }

  async getInvestmentsByUserId(userId: number): Promise<Investment[]> {
    return Array.from(this.investments.values()).filter(
      (investment) => investment.userId === userId
    );
  }

  async getUserActiveInvestment(userId: number): Promise<Investment | undefined> {
    return Array.from(this.investments.values()).find(
      (investment) => investment.userId === userId && investment.status === "active"
    );
  }

  async updateInvestment(id: number, investmentData: Partial<Investment>): Promise<Investment | undefined> {
    const investment = this.investments.get(id);
    if (!investment) return undefined;
    
    const updatedInvestment = {
      ...investment,
      ...investmentData
    };
    
    this.investments.set(id, updatedInvestment);
    return updatedInvestment;
  }

  // Transaction methods
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const id = generateId(this.transactions);
    
    const transaction: Transaction = {
      id,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateTransaction(id: number, transactionData: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = {
      ...transaction,
      ...transactionData,
      updatedAt: new Date()
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Wallet methods
  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const id = generateId(this.wallets);
    
    const wallet: Wallet = {
      id,
      ...walletData,
      createdAt: new Date()
    };
    
    this.wallets.set(id, wallet);
    return wallet;
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId
    );
  }

  // Admin dashboard stats
  async getDashboardStats(): Promise<any> {
    const totalUsers = this.users.size;
    // Count new users in the last 7 days
    const newUsers = Array.from(this.users.values()).filter(
      user => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return user.createdAt >= oneWeekAgo;
      }
    ).length;
    
    // Count active investments
    const activeInvestments = Array.from(this.investments.values()).filter(
      investment => investment.status === "active"
    ).length;
    
    // Calculate total deposits
    const deposits = Array.from(this.transactions.values())
      .filter(tx => tx.type === "deposit" && tx.status === "completed");
    
    const totalDeposits = deposits.reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    // Calculate new deposits in the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const newDeposits = deposits
      .filter(tx => tx.createdAt >= oneWeekAgo)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    // Calculate total withdrawals
    const totalWithdrawals = Array.from(this.transactions.values())
      .filter(tx => tx.type === "withdrawal" && tx.status === "completed")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    return {
      totalUsers,
      newUsers,
      activeInvestments,
      totalDeposits,
      newDeposits,
      totalWithdrawals
    };
  }
}

export const storage = new MemStorage();
