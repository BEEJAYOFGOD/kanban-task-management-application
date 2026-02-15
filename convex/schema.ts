// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    boards: defineTable({
        name: v.string(),

        columns: v.array(
            v.object({
                name: v.string(),
                tasks: v.array(
                    v.object({
                        title: v.string(),
                        description: v.string(),
                        status: v.string(),
                        subtasks: v.array(
                            v.object({
                                title: v.string(),
                                isCompleted: v.boolean(),
                            })
                        ),
                    })
                ),
            })
        ),
    }),
});
