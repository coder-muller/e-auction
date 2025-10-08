import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

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
export const get = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return null;
    
    // Get seller info
    const seller = await ctx.db.get(item.sellerId);
    
    // Get last bidder info if exists
    let lastBidder = null;
    if (item.lastBidderId) {
      lastBidder = await ctx.db.get(item.lastBidderId);
    }
    
    return {
      ...item,
      seller: seller ? { name: seller.name, email: seller.email } : null,
      lastBidder: lastBidder ? { name: lastBidder.name } : null,
    };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    startingPrice: v.number(),
    category: v.string(),
    durationHours: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    const now = Date.now();
    const expiringAt = now + (args.durationHours * 60 * 60 * 1000);
    
    return await ctx.db.insert("items", {
      title: args.title,
      description: args.description,
      startingPrice: args.startingPrice * 100, // convert to cents
      lastBidValue: args.startingPrice * 100,
      sellerId: userId,
      status: "live",
      startingAt: now,
      expiringAt,
      category: args.category,
    });
  },
});

export const myItems = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: null };
    
    return await ctx.db
      .query("items")
      .withIndex("by_seller", (q) => q.eq("sellerId", userId))
      .order("desc")
      .paginate(args.paginationOpts);
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
    }
    
    await ctx.db.patch(args.itemId, updates);
  },
});