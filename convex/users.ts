import { v } from "convex/values"
import { query } from "./_generated/server"

export const getUserById = query({
    args: {
        userId: v.id("users")
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId)

        return user
    }
})
