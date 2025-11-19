import { query, mutation } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { api, internal } from "./_generated/api";

export const placeBid = mutation({
    args: {
        itemId: v.id("items"),
        amount: v.number(), // in cents
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("É necessário estar logado para dar um lance");

        // Check for duplicate bid using clientBidId
        const existingBid = await ctx.db
            .query("bids")
            .withIndex("by_client_bid_id", (q) => q.eq("clientBidId", userId))
            .first();

        if (existingBid?.amount === args.amount) {
            throw new ConvexError("Lance já realizado.")
        }

        const item = await ctx.db.get(args.itemId);
        if (!item) throw new ConvexError("Item não encontrado");

        const now = Date.now()

        // Validate bid
        if (item.status !== "live") {
            throw new ConvexError("O leilão não está ativo no momento.");
        }

        if (now >= new Date(item.expiringAt).getTime()) {
            throw new ConvexError("O leilão já foi encerrado.");
        }

        if (args.amount <= item.lastBidValue) {
            throw new ConvexError("O valor não pode ser menor que o valor atual.");
        }

        if (item.sellerId === userId) {
            throw new ConvexError("Não é possível dar um lance no seu próprio anúncio.");
        }

        // Atomic operation: insert bid + update item
        const bidId = await ctx.db.insert("bids", {
            itemId: args.itemId,
            bidderId: userId,
            amount: args.amount,
            clientBidId: userId,
        });

        // Anti-sniping: extend auction if bid placed in last 5 minutes
        let end = new Date(item.expiringAt).getTime();
        const timeLeft = end - now;
        if (timeLeft < 5 * 60 * 1000) { // 5 minutes
            end = now + 5 * 60 * 1000; // extend by 5 minutes
        }

        const data = {
            fromUserId: userId,
            toUserId: item.sellerId,
            itemId: item._id,
            prevBidder: item.lastBidderId
        }

        // create notification for seller
        await ctx.runMutation(internal.notifications.createNotification, {
            type: "newBid",
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            itemId: data.itemId
        })

        // create notification for outbid
        if (data.prevBidder) {
            await ctx.runMutation(internal.notifications.createNotification, {
                type: "outbid",
                toUserId: data.prevBidder,
                itemId: data.itemId
            })
        }

        await ctx.db.patch(args.itemId, {
            lastBidValue: args.amount,
            lastBidderId: userId,
            expiringAt: new Date(end).toISOString(),
            bids: [...(item.bids ?? []), bidId]
        });

        await ctx.runMutation(api.watchlist.addToWatchlist, {
            itemId: data.itemId
        })

        return { success: true, bidId, message: "Lance criado com sucesso!" };
    },
});

export const getBidHistory = query({
    args: {
        itemId: v.id("items"),
    },
    handler: async (ctx, args) => {
        const bids = await ctx.db
            .query("bids")
            .withIndex("by_item", (q) => q.eq("itemId", args.itemId))
            .order("desc")
            .take(3)

        // Enrich with bidder info
        const enrichedBids = await Promise.all(
            bids.map(async (bid) => {
                const bidder = await ctx.db.get(bid.bidderId);
                return {
                    ...bid,
                    bidder: bidder ? { name: bidder.name } : null,
                };
            })
        );

        return {
            enrichedBids,
        };
    },
});

export const myBids = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return { page: [], isDone: true, continueCursor: null };

        const bids = await ctx.db
            .query("bids")
            .withIndex("by_bidder", (q) => q.eq("bidderId", userId))
            .order("desc")
            .paginate(args.paginationOpts);

        // Enrich with item info
        const enrichedBids = await Promise.all(
            bids.page.map(async (bid) => {
                const item = await ctx.db.get(bid.itemId);
                return {
                    ...bid,
                    item: item ? { title: item.title, status: item.status } : null,
                };
            })
        );

        return {
            ...bids,
            page: enrichedBids,
        };
    },
});
