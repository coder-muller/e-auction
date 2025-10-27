import { query } from "./_generated/server";
import { v } from "convex/values";

// Lightweight subscription for real-time updates
export const subscribeToItem = query({
    args: { itemId: v.id("items") },
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.itemId);
        if (!item) return null;

        // Return only minimal fields for real-time updates
        return {
            _id: item._id,
            status: item.status,
            lastBidValue: item.lastBidValue,
            expiringAt: item.expiringAt,
            lastBidderId: item.lastBidderId
        };
    },
});

// Subscribe to multiple items (for catalog view)
export const subscribeToItems = query({
    args: { itemIds: v.array(v.id("items")) },
    handler: async (ctx, args) => {
        const items = await Promise.all(
            args.itemIds.map(async (itemId) => {
                const item = await ctx.db.get(itemId);
                if (!item) return null;

                return {
                    _id: item._id,
                    status: item.status,
                    lastBidValue: item.lastBidValue,
                    expiringAt: item.expiringAt,
                    lastBidderId: item.lastBidderId,
                };
            })
        );

        return items.filter(Boolean);
    },
});
