import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
    items: defineTable({
        title: v.string(),
        description: v.string(),
        imageUrl: v.optional(v.array(v.string())),
        startingPrice: v.number(), // in cents
        lastBidValue: v.number(), // in cents, denormalized
        lastBidderId: v.optional(v.id("users")),
        sellerId: v.id("users"),
        status: v.union(v.literal("draft"), v.literal("live"), v.literal("ended")),
        startingAt: v.string(),
        bids: v.array(v.id("bids")),
        expiringAt: v.string(),
        winnerId: v.optional(v.id("users")),
        category: v.string(),
        state: v.string(),
        city: v.string()
    })
        .index("by_status_expiringAt", ["status", "expiringAt"])
        .index("by_seller", ["sellerId"])
        .index("by_state", ["state"])
        .index("by_city", ["city"])
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
        // adicionar chave única para autenticidade
    })
        .index("by_seller", ["sellerId"])
        .index("by_buyer", ["buyerId"]),

    notifications: defineTable({
        type: v.union(
            v.literal("outbid"),
            v.literal("newBid"),
            v.literal("itemSoldSeller"),
            v.literal("itemSoldBidder"),
            v.literal("endingSoon")
        ),
        fromUserId: v.optional(v.id("users")),
        seen: v.boolean(),
        toUserId: v.id("users"),
        itemId: v.optional(v.id("items")),
        createdAt: v.string()
    })
        .index("byItem", ["itemId"])
        .index("byType", ["type"])
        .index("byFromUserId", ["fromUserId"])
        .index("byToUserId", ["toUserId"]),
    users: defineTable({
        name: v.string(),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        profileImage: v.optional(v.string()),
        document: v.optional(v.string()),
        items: v.array(v.id("items")),
        watchlist: v.array(v.id("items")),
        address: v.optional(v.object({
            street: v.string(),
            number: v.string(),
            complement: v.optional(v.string()),
            neighborhood: v.string(),
            zipCode: v.string(),
            city: v.string(),
            state: v.string()
        }))
    })
};

export default defineSchema({
    ...authTables,
    ...applicationTables,
});
