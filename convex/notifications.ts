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
    args: {
        notificationIds: v.array(v.id("notifications"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError({
            status: 401,
            message: "usuário não autenticado"
        })

        const items = await Promise.all(
            args.notificationIds.map(async (n) => {
                const notification = await ctx.db.get(n)
                if (notification?.toUserId !== userId) throw new ConvexError({
                    status: 401,
                    message: "usuário não autorizado"
                })
                else {
                    await ctx.db.patch(n, { seen: true })
                }
            })
        )

        return items
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
