import { query, mutation, internalMutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        status: v.optional(v.union(v.literal("live"), v.literal("ended"))),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const base = ctx.db.query("items");

        let indexed;
        if (args.status && args.category) {
            indexed = base.withIndex("by_category_status", (q) =>
                q.eq("category", args.category!).eq("status", args.status!)
            );
        } else if (args.status) {
            indexed = base.withIndex("by_status_expiringAt", (q) =>
                q.eq("status", args.status!)
            );
        }

        const toPaginate = indexed ?? base;
        const paginated = await toPaginate.order("desc").paginate(args.paginationOpts);

        // Return only IDs
        return {
            page: paginated.page.map((item) => item._id),
            isDone: paginated.isDone,
            continueCursor: paginated.continueCursor,
        };
    },
});

export const getAllItems = query({
    handler: async (ctx) => {
        const items = await ctx.db.query("items").order("desc").collect();
        const itemsWithUrl = await Promise.all(
            items.map(async (item) => {
                let imageUrl = null;
                if (item.imageStorageIds && item.imageStorageIds.length > 0) {
                    imageUrl = await ctx.storage.getUrl(item.imageStorageIds[0]);
                }
                return {
                    ...item,
                    imageUrl,
                };
            })
        );
        return itemsWithUrl;
    }
});

export const getStatics = query({
    args: { itemIds: v.array(v.id("items")) },
    handler: async (ctx, args) => {
        const items = await Promise.all(
            args.itemIds.map(async (id) => {
                const item = await ctx.db.get(id);
                if (!item) return null;
                return {
                    _id: item._id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                };
            })
        );
        const result: Record<string, { _id: string; title: string; description: string; category: string } | null> = {};
        items.forEach((item, index) => {
            if (item) {
                result[args.itemIds[index]] = item;
            }
        });
        return result;
    },
});

// ... rest of the file unchanged
export const getItem = query({
    args: { itemId: v.id("items") },
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.itemId);
        if (!item) return null;

        // Get seller info
        const seller = await ctx.db.get(item.sellerId);

        let imageUrl = null;
        if (item.imageStorageIds && item.imageStorageIds.length > 0) {
            imageUrl = await ctx.storage.getUrl(item.imageStorageIds[0]);
        }

        const bids: any = await Promise.all(
            item.bids.map(async (b) => {
                if (!item.bids) return
                const bid = await ctx.db.query("bids")
                    .withIndex("by_id", (q) => q.eq("_id", b))
                    .unique()

                if (!bid) return

                const user = await ctx.db.query("users")
                    .withIndex("by_id", (q) => q.eq("_id", bid.bidderId))
                    .unique()

                const amount = bid?.amount

                return {
                    amount,
                    user
                }
            })
        )

        return {
            ...item,
            imageUrl,
            seller: seller ? { name: seller.name, email: seller.email } : null,
            bids: bids ? { bids: bids } : null,
        };
    },
});

export const create = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        startingPrice: v.number(),
        category: v.string(),
        endDate: v.string(),
        endTime: v.string(),
        state: v.string(),
        city: v.string(),
        imageStorageIds: v.optional(v.array(v.id("_storage"))),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Usuário não logado");
        const user = await ctx.db.get(userId)
        if (!user) throw new Error("Usuário não encontrado");

        const now = new Date().toISOString();
        const expiringAt = new Date(args.endDate + 'T' + args.endTime).toISOString()

        const item: Id<"items"> = await ctx.db.insert("items", {
            title: args.title,
            description: args.description,
            startingPrice: args.startingPrice * 100, // convert to cents
            lastBidValue: args.startingPrice * 100,
            sellerId: userId,
            status: "live",
            startingAt: now,
            expiringAt,
            state: args.state,
            city: args.city,
            category: args.category,
            bids: [],
            imageStorageIds: args.imageStorageIds ?? [],
        });

        await ctx.db.patch(userId, {
            items: [...(user.items ?? []), item]
        })
    },
});

export const myItems = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Usuário não logado")

        return await ctx.db
            .query("items")
            .withIndex("by_seller", (q) => q.eq("sellerId", userId))
            .order("desc")
            .collect()
    },
});

export const endAuction = internalMutation({
    args: { itemId: v.id("items") },
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.itemId);
        if (!item || item.status !== "live") return;

        const updates: any = { status: "ended" as const };

        if (item.lastBidderId) {
            updates.winnerId = item.lastBidderId;

            await ctx.db.insert("transactions", {
                itemId: args.itemId,
                sellerId: item.sellerId,
                buyerId: item.lastBidderId,
                amount: item.lastBidValue,
                status: "pending",
            });

            await ctx.runMutation(internal.notifications.createNotification, {
                type: "itemSoldSeller",
                fromUserId: item.lastBidderId,
                toUserId: item.sellerId,
                itemId: args.itemId
            })

            await ctx.runMutation(internal.notifications.createNotification, {
                type: "itemSoldBidder",
                fromUserId: item.sellerId,
                toUserId: item.lastBidderId,
                itemId: args.itemId
            })
        }

        await ctx.db.patch(args.itemId, updates);
    },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});