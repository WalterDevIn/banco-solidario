import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  memberType: varchar("member_type", { length: 20 }).notNull(), // 'member' or 'external'
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'inactive'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  remainingBalance: decimal("remaining_balance", { precision: 15, scale: 2 }).notNull(),
  termMonths: integer("term_months").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 4 }).notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"), // 'active', 'liquidated', 'overdue'
  startDate: timestamp("start_date").defaultNow().notNull(),
  liquidatedAt: timestamp("liquidated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  principalAmount: decimal("principal_amount", { precision: 15, scale: 2 }).notNull(),
  interestAmount: decimal("interest_amount", { precision: 15, scale: 2 }).notNull(),
  paymentDate: timestamp("payment_date").defaultNow().notNull(),
  meetingId: integer("meeting_id").references(() => meetings.id),
});

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  totalCollected: decimal("total_collected", { precision: 15, scale: 2 }).notNull().default("0"),
  totalLent: decimal("total_lent", { precision: 15, scale: 2 }).notNull().default("0"),
  totalInterest: decimal("total_interest", { precision: 15, scale: 2 }).notNull().default("0"),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'loan_created', 'payment_made', 'member_added', etc.
  description: text("description").notNull(),
  entityId: integer("entity_id"), // references to loan, member, etc.
  entityType: varchar("entity_type", { length: 20 }), // 'loan', 'member', 'payment'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
  liquidatedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  paymentDate: true,
});

export const insertMeetingSchema = createInsertSchema(meetings).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Member = typeof members.$inferSelect;
export type InsertMember = z.infer<typeof insertMemberSchema>;

export type Loan = typeof loans.$inferSelect;
export type InsertLoan = z.infer<typeof insertLoanSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = z.infer<typeof insertMeetingSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Extended types for UI
export type LoanWithMember = Loan & {
  member: Member;
  payments: Payment[];
};

export type MemberWithLoans = Member & {
  loans: Loan[];
};

export type MeetingWithDetails = Meeting & {
  payments: (Payment & { loan: Loan; member: Member })[];
  newLoans: (Loan & { member: Member })[];
};
