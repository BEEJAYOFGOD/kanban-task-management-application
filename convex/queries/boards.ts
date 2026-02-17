import { mutation, query } from "../_generated/server";
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


// This is the one query you need to render a full board!
export const getFullBoard = query({
    args: { boardId: v.id("boards") },

    handler: async (ctx, args) => {
        // 1. Get the board
        const board = await ctx.db.get(args.boardId);

        if (!board) return null;

        // 2. Get all columns for this board (ordered)
        const columns = await ctx.db
            .query("columns")
            .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
            .collect();

        // Sort columns by order
        columns.sort((a, b) => a.order - b.order);

        // 3. For each column, get its tasks and subtasks
        const columnsWithTasks = await Promise.all(

            columns.map(async (column) => {
                // Get tasks for this column (ordered)
                const tasks = await ctx.db
                    .query("tasks")
                    .withIndex("by_column", (q) => q.eq("columnId", column._id))
                    .collect();

                // Sort tasks by order
                tasks.sort((a, b) => a.order - b.order);

                // Get subtasks for each task
                const tasksWithSubtasks = await Promise.all(
                    tasks.map(async (task) => {
                        const subtasks = await ctx.db
                            .query("subtasks")
                            .withIndex("by_task", (q) => q.eq("taskId", task._id))
                            .collect();

                        return { ...task, subtasks };
                    })
                );

                return { ...column, tasks: tasksWithSubtasks };
            })
        );

        // 4. Return full board structure
        return { ...board, columns: columnsWithTasks };
    },
});


// Toggle subtask isCompleted - super simple now!
export const toggleSubtask = mutation({
    args: {
        subtaskId: v.id("subtasks"),
        isCompleted: v.boolean(),
    },

    handler: async (ctx, args) => {
        await ctx.db.patch(args.subtaskId, {
            isCompleted: args.isCompleted,
        });
    },
});


// Move task between columns (for drag and drop)
export const moveTask = mutation({
    args: {
        taskId: v.id("tasks"),
        newColumnId: v.id("columns"),
        newOrder: v.number(),
        newStatus: v.string(),
    },

    handler: async (ctx, args) => {
        await ctx.db.patch(args.taskId, {
            columnId: args.newColumnId,
            order: args.newOrder,
            status: args.newStatus,
        });
    },
});

// Create a new task
export const createTask = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        status: v.string(),
        columnId: v.id("columns"),
        boardId: v.id("boards"),
        subtasks: v.array(v.object({ title: v.string() })),
    },

    handler: async (ctx, args) => {
        // Get current task count for ordering
        const existingTasks = await ctx.db
            .query("tasks")
            .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
            .collect();

        const taskId = await ctx.db.insert("tasks", {
            title: args.title,
            description: args.description,
            status: args.status,
            columnId: args.columnId,
            boardId: args.boardId,
            order: existingTasks.length,
        });

        // Insert subtasks
        for (const subtask of args.subtasks) {

            await ctx.db.insert("subtasks", {
                title: subtask.title,
                isCompleted: false,
                taskId,
            });
        }

        return taskId;
    },
});

// Update task details
export const updateTask = mutation({
    args: {
        taskId: v.id("tasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.string()),
        columnId: v.optional(v.id("columns")),
    },

    handler: async (ctx, args) => {
        const { taskId, ...updates } = args;

        await ctx.db.patch(taskId, updates);
    },
});

// Delete a task and its subtasks
export const deleteTask = mutation({
    args: { taskId: v.id("tasks") },
    handler: async (ctx, args) => {
        // Delete subtasks first
        const subtasks = await ctx.db
            .query("subtasks")
            .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
            .collect();

        for (const subtask of subtasks) {
            await ctx.db.delete(subtask._id);
        }

        await ctx.db.delete(args.taskId);
    },
});


// Add a new column to a board
export const addColumn = mutation({
    args: {
        boardId: v.id("boards"),
        name: v.string(),
    },

    handler: async (ctx, args) => {
        const existingColumns = await ctx.db
            .query("columns")
            .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
            .collect();

        return await ctx.db.insert("columns", {
            name: args.name,
            boardId: args.boardId,
            order: existingColumns.length,
        });
    },
});
