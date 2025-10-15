import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const addToWatchlist = mutation({
    args: {
        itemId: v.id("items")
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Unauthorized")
        const { itemId } = args

        const user = await ctx.db.get(userId)
        if (!user) throw new ConvexError("User not found")

        const newWatchlist = user.watchlist.includes(itemId)
            ? user.watchlist
            : [...user.watchlist, itemId]

        await ctx.db.patch(userId, {
            watchlist: newWatchlist
        })
            .catch(() => {
                return { success: false, error: "Erro ao adicionar item na watchlist" }
            })

        return {
            success: true
        }

    }
})

export const getWatchlist = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Unauthorized")

        const user = await ctx.db.get(userId)
        if (!user) throw new ConvexError("User not found")

        const watchlistIds = user.watchlist

        const items = Promise.all(
            watchlistIds.map(id => {
                ctx.db.query("items")
                    .withIndex("by_id", (q) => q.eq("_id", id))
                    .collect
            })
        )

        return items
    }
})
