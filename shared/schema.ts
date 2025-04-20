import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  country: text("country").notNull(),
  gender: text("gender").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).default("0").notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Investment Plans table
export const investmentPlans = pgTable("investment_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  dailyRoi: decimal("daily_roi", { precision: 5, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  minInvestment: decimal("min_investment", { precision: 12, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Investments table
export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  dailyRoi: decimal("daily_roi", { precision: 5, scale: 2 }).notNull(),
  durationDays: integer("duration_days").notNull(),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date").notNull(),
  status: text("status").default("active").notNull(),
  totalProfit: decimal("total_profit", { precision: 12, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // deposit, withdrawal, roi
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  cryptocurrency: text("cryptocurrency"),
  walletAddress: text("wallet_address"),
  privateKey: text("private_key"),
  status: text("status").default("pending").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Wallets table
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cryptocurrency: text("cryptocurrency").notNull(),
  address: text("address").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert and Select Types
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  balance: true,
  isVerified: true,
  isAdmin: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvestmentPlanSchema = createInsertSchema(investmentPlans).omit({
  id: true,
  isActive: true,
});

export const insertInvestmentSchema = createInsertSchema(investments).omit({
  id: true,
  totalProfit: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

// Login Schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InvestmentPlan = typeof investmentPlans.$inferSelect;
export type InsertInvestmentPlan = z.infer<typeof insertInvestmentPlanSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type LoginData = z.infer<typeof loginSchema>;
