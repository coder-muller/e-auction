import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";

export const seedDatabase = mutation({
  args: { 
    userId: v.id("users"),
    count: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<{ message: string; itemIds: any[] }> => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Must be logged in");
    
    // Use the current user as the seller for all items
    return await ctx.runMutation(internal.seed.seedDatabase, {
      userId: currentUserId,
      count: args.count,
    });
  },
});

export const clearDatabase = mutation({
  args: {},
  handler: async (ctx): Promise<{ message: string }> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Must be logged in");
    
    return await ctx.runMutation(internal.seed.clearAllItems);
  },
});
