import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
    image: text("image"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull().unique(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Scan History - stores PageSpeed analysis results
export const scanHistory = sqliteTable("scan_history", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    finalUrl: text("final_url").notNull(),
    strategy: text("strategy").notNull(), // "mobile" | "desktop"
    performanceScore: integer("performance_score").notNull(),
    // Core Web Vitals and other metrics stored as JSON
    metrics: text("metrics").notNull(), // JSON string of CoreWebVitals
    categoryScores: text("category_scores"), // JSON string of CategoryScores
    fieldData: text("field_data"), // JSON string of FieldData
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// AI Suggestions - stores Gemini AI recommendations
export const aiSuggestion = sqliteTable("ai_suggestion", {
    id: text("id").primaryKey(),
    scanId: text("scan_id")
        .notNull()
        .references(() => scanHistory.id, { onDelete: "cascade" }),
    suggestions: text("suggestions").notNull(), // JSON array of AISuggestion
    source: text("source").notNull(), // "gemini" | "fallback"
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Type exports for easier usage
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type ScanHistory = typeof scanHistory.$inferSelect;
export type NewScanHistory = typeof scanHistory.$inferInsert;
export type AiSuggestion = typeof aiSuggestion.$inferSelect;
export type NewAiSuggestion = typeof aiSuggestion.$inferInsert;
