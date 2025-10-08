import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const placeBid = mutation({
  args: {
    itemId: v.id("items"),
    amount: v.number(), // in dollars
    clientBidId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    // Check for duplicate bid using clientBidId
    const existingBid = await ctx.db
      .query("bids")
      .withIndex("by_client_bid_id", (q) => q.eq("clientBidId", args.clientBidId))
      .first();
    
    if (existingBid) {
      return { success: true, bidId: existingBid._id, message: "Bid already placed" };
    }
    
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");
    
    const now = Date.now();
    const amountInCents = Math.round(args.amount * 100);
    
    // Validate bid
    if (item.status !== "live") {
      throw new Error("Auction is not live");
    }
    
    if (now >= item.expiringAt) {
      throw new Error("Auction has ended");
    }
    
    if (amountInCents <= item.lastBidValue) {
      throw new Error(`Bid must be higher than $${(item.lastBidValue / 100).toFixed(2)}`);
    }
    
    if (item.sellerId === userId) {
      throw new Error("Cannot bid on your own item");
    }
    
    // Atomic operation: insert bid + update item
    const bidId = await ctx.db.insert("bids", {
      itemId: args.itemId,
      bidderId: userId,
      amount: amountInCents,
      clientBidId: args.clientBidId,
    });
    
    // Anti-sniping: extend auction if bid placed in last 5 minutes
    let newExpiringAt = item.expiringAt;
    const timeLeft = item.expiringAt - now;
    if (timeLeft < 5 * 60 * 1000) { // 5 minutes
      newExpiringAt = now + 5 * 60 * 1000; // extend by 5 minutes
    }
    
    await ctx.db.patch(args.itemId, {
      lastBidValue: amountInCents,
      lastBidderId: userId,
      expiringAt: newExpiringAt,
    });
    
    return { success: true, bidId, message: "Bid placed successfully" };
  },
});

export const getBidHistory = query({
  args: { 
    itemId: v.id("items"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const bids = await ctx.db
      .query("bids")
      .withIndex("by_item", (q) => q.eq("itemId", args.itemId))
      .order("desc")
      .paginate(args.paginationOpts);
    
    // Enrich with bidder info
    const enrichedBids = await Promise.all(
      bids.page.map(async (bid) => {
        const bidder = await ctx.db.get(bid.bidderId);
        return {
          ...bid,
          bidder: bidder ? { name: bidder.name } : null,
        };
      })
    );
    
    return {
      ...bids,
      page: enrichedBids,
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
