import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  project_id: text("project_id").notNull(), // Project ID dari Netlify
  webhook_lark: text("webhook_lark").notNull(), // Webhook untuk kirim ke Lark
  total_deploy: integer("total_deploy").default(0),
  success_count: integer("success_count").default(0),
  failed_count: integer("failed_count").default(0),
});
