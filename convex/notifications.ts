import { internalMutation, mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

export const createNotification = internalMutation({
    args: {
        type: v.union(
            v.literal("outbid"),
            v.literal("newBid"),
            v.literal("itemSoldSeller"),
            v.literal("itemSoldBidder"),
            v.literal("endingSoon")
        ),
        fromUserId: v.optional(v.id("users")),
        toUserId: v.id("users"),
        itemId: v.optional(v.id("items"))
    },
    handler: async (ctx, args) => {
        const { type, fromUserId, toUserId, itemId } = args
        const newNotification = await ctx.db
            .insert("notifications", {
                itemId,
                fromUserId,
                toUserId,
                type,
                seen: false,
                createdAt: new Date().toISOString()
            })

        return newNotification
    }
})

export const seeNotifications = mutation({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError({
            status: 401,
            message: "usuário não autenticado"
        })

        const notifications = await ctx.db.query("notifications")
            .withIndex("byToUserId", (q) => q.eq("toUserId", userId))
            .collect()

        const seen = await Promise.all(
            notifications.map(async (n) => {
                await ctx.db.patch(n._id, {
                    seen: true
                })
            })
        )

        return seen

    }
})

export const getNotifications = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("byToUserId", (q) => q.eq("toUserId", userId))
            .order("desc")
            .take(20)

        const notificationsWithItems = await Promise.all(
            notifications.map(async (n) => {
                if (!n.itemId) return

                const item = await ctx.db.query("items")
                    .withIndex("by_id", (q) => q.eq("_id", n.itemId!))
                    .unique()

                return {
                    ...n,
                    item
                }
            })

        )

        return notificationsWithItems
    }
})
