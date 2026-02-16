import { query } from "../_generated/server";
import { v } from "convex/values";

export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("boards").collect();
    },
});


export const getBoardById = query({
    args: {
        id: v.id("boards"),
    },

    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
