import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  items: defineTable({
    title: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    startingPrice: v.number(), // in cents
    lastBidValue: v.number(), // in cents, denormalized
    lastBidderId: v.optional(v.id("users")),
    sellerId: v.id("users"),
    status: v.union(v.literal("draft"), v.literal("live"), v.literal("ended")),
    startingAt: v.number(),
    expiringAt: v.number(), // denormalized for quick access
    winnerId: v.optional(v.id("users")),
    category: v.string(),
  })
    .index("by_status_expiringAt", ["status", "expiringAt"])
    .index("by_seller", ["sellerId"])
    .index("by_category_status", ["category", "status"]),

  bids: defineTable({
    itemId: v.id("items"),
    bidderId: v.id("users"),
    amount: v.number(), // in cents
    clientBidId: v.string(), // for idempotency
  })
    .index("by_item", ["itemId"])
    .index("by_bidder", ["bidderId"])
    .index("by_client_bid_id", ["clientBidId"]),

  transactions: defineTable({
    itemId: v.id("items"),
    sellerId: v.id("users"),
    buyerId: v.id("users"),
    amount: v.number(), // in cents
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("failed")),
  })
    .index("by_seller", ["sellerId"])
    .index("by_buyer", ["buyerId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
