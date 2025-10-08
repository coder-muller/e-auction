import { internalMutation, query } from "./_generated/server"
import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"

export const createNotification = internalMutation({
    args: {
        type: v.union(
            v.literal("outbid"),
            v.literal("newBid"),
            v.literal("itemSold"),
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
                createdAt: new Date().toISOString()
            })

        return newNotification
    }
})

export const getNotifications = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new Error("usuário não encontrado")

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("byToUserId", (q) => q.eq("toUserId", userId))
            .order("desc")
            .take(20)

        return notifications
    }
})
