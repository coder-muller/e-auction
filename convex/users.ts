import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getUserById = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)
        if (!user) throw new ConvexError("Usuário não encontrado")

        return {
            name: user.name,
            items: user.items,
        }
    }
})

export const getLoggedInUser = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Usuário não logado")
        const user = await ctx.db.get(userId)
        if (!user) throw new ConvexError("Usuário não encontrado")

        return {
            name: user.name,
            email: user.email,
            phone: user.phone ?? undefined,
            items: user.items,
            profileImage: user.profileImage,
            watchlist: user.watchlist,
            address: user.address ?? undefined
        }
    }
})

export const profileEdit = mutation({
    args: {
        name: v.string(),
        phone: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Usuário não logado")

        const { name, phone } = args

        await ctx.db.patch(userId, {
            name,
            phone
        })
    }
})

export const addressEdit = mutation({
    args: {
        street: v.string(),
        number: v.string(),
        complement: v.optional(v.string()),
        neighborhood: v.string(),
        zipCode: v.string(),
        city: v.string(),
        state: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) throw new ConvexError("Usuário não logado")

        await ctx.db.patch(userId, {
            address: {
                ...args
            }
        })
    }
})
