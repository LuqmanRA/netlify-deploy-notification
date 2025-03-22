import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(), // Project ID dari Netlify
  name: text("name").notNull(),
  webhook_lark: text("webhook_lark").notNull(), // Webhook untuk kirim ke Lark
});
