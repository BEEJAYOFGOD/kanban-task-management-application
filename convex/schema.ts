import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    boards: defineTable({
        name: v.string(),
    }),

    columns: defineTable({
        name: v.string(),
        boardId: v.id("boards"),
        order: v.number(), // for ordering columns
    }).index("by_board", ["boardId"]),

    tasks: defineTable({
        title: v.string(),
        description: v.string(),
        status: v.string(),
        columnId: v.id("columns"),
        boardId: v.id("boards"),
        order: v.number(), // for drag-and-drop ordering
    })
        .index("by_column", ["columnId"])
        .index("by_board", ["boardId"]),

    subtasks: defineTable({
        title: v.string(),
        isCompleted: v.boolean(),
        taskId: v.id("tasks"),
    }).index("by_task", ["taskId"]),
});
