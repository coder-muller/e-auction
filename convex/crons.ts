import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalQuery, internalAction } from "./_generated/server";

// Check for expired auctions every minute
const crons = cronJobs();

crons.interval(
  "end expired auctions",
  { minutes: 1 },
  internal.crons.endExpiredAuctions,
  {}
);

export const endExpiredAuctions = internalAction({
  args: {},
  handler: async (ctx) => {
    const expiredItems = await ctx.runQuery(internal.crons.getExpiredItems);
    
    for (const item of expiredItems) {
      await ctx.runMutation(internal.items.endAuction, { itemId: item._id });
    }
  },
});

export const getExpiredItems = internalQuery({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    return await ctx.db
      .query("items")
      .withIndex("by_status_expiringAt", (q) => 
        q.eq("status", "live").lt("expiringAt", now)
      )
      .collect();
  },
});

export default crons;
