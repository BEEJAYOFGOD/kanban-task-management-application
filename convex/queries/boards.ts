import { Columns } from "lucide-react";
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

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
            .order("asc")
            .collect();

        // Sort columns by order
        // columns.sort((a, b) => a._creationTime - b._creationTime);

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

export const createBoard = mutation({
    args: {
        name: v.string(),
        columns: v.array(v.object({
            name: v.string(),
        }))
    },

    handler: async (ctx, args) => {
        const boardId = await ctx.db.insert("boards", {
            name: args.name
        });

        for (const column of args.columns) {
            await ctx.db.insert("columns", {
                name: column.name,
                boardId,
            });
        }
    }
})

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
        });
    },
});


export const addBoard = mutation({
    args: {
        name: v.string()
    },

    handler: async (ctx, args) => {

        const board = await ctx.db.insert("boards", {
            name: args.name
        })

        return board;
    }
})


export const updateBoard = mutation({ // Fixed typo
    args: {
        boardId: v.id("boards"),
        name: v.optional(v.string()),
        columns: v.array(v.object({
            _id: v.optional(v.id("columns")),
            name: v.string(),
        }))
    },

    handler: async (ctx, args) => {
        const { boardId, name, columns } = args; // Remove 'let'

        // Update board name
        if (name) {
            await ctx.db.patch(boardId, { name });
        }

        // Get existing columns
        const existingColumns = await ctx.db.query("columns")
            .withIndex("by_board", (q) => q.eq("boardId", boardId))
            .collect();

        // Get IDs of columns to keep
        const undeletedColumnsId = columns
            .map((col) => col._id)
            .filter((id): id is Id<"columns"> => id !== undefined);

        // Get columns to delete
        const deletedCols = existingColumns.filter(
            (col) => !undeletedColumnsId.includes(col._id)
        );

        // Process each column
        for (const col of columns) {
            // check if it's an old column
            if (col._id) {

                // find the column and check if it's on existingColumn
                const existingColumn = existingColumns.find(
                    existingCol => existingCol._id === col._id
                    //  ^^^^^^^^^^^^ Different name!     ^^^
                );


                // check if name changed
                if (existingColumn && existingColumn.name !== col.name) {
                    // Update only if name changed
                    await ctx.db.patch(col._id, { name: col.name });
                }

            } else {
                // No _id = new column
                await ctx.db.insert("columns", {
                    boardId,
                    name: col.name,
                });
            }
        }

        // Delete removed columns
        await Promise.all(
            deletedCols.map((col) => ctx.db.delete(col._id))
        );
    }
});


// export const deleteBoard = mutation({
//     args: {
//         boardId: v.id("boards"),
//     },

//     handler: async (ctx, args) => {
//         const existingColumns = await ctx.db.query("columns")
//             .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
//             .collect();

//         await Promise.all(
//             existingColumns.map(async (column) => {
//                 // Get tasks for this column (ordered)
//                 const tasks = await ctx.db
//                     .query("tasks")
//                     .withIndex("by_column", (q) => q.eq("columnId", column._id))
//                     .collect();


//                 await Promise.all(
//                     tasks.map(async (task) => {

//                         const subtasks = await ctx.db
//                             .query("subtasks")
//                             .withIndex("by_task", (q) => q.eq("taskId", task._id))
//                             .collect();

//                         if (subtasks.length) {
//                             await Promise.all(
//                                 subtasks.map(async (subtask) => {
//                                     await ctx.db.delete(subtask._id);
//                                 })
//                             )
//                         }

//                         await ctx.db.delete(task._id);
//                     })

//                 )
//                 await ctx.db.delete(column._id);
//             }
//             ))

//         await ctx.db.delete(args.boardId);
//     }
// })

export const deleteBoard = mutation({
    args: {
        boardId: v.id("boards"),
    },

    handler: async (ctx, args) => {
        const { boardId } = args;

        // Collect all IDs to delete
        const columns = await ctx.db
            .query("columns")
            .withIndex("by_board", (q) => q.eq("boardId", boardId))
            .collect();

        const columnIds = columns.map(c => c._id);

        // Get all tasks across all columns at once
        const allTasks = await Promise.all(
            columnIds.map(columnId =>
                ctx.db
                    .query("tasks")
                    .withIndex("by_column", (q) => q.eq("columnId", columnId))
                    .collect()
            )
        ).then(results => results.flat());

        const taskIds = allTasks.map(t => t._id);

        // Get all subtasks across all tasks at once
        const allSubtasks = await Promise.all(
            taskIds.map(taskId =>
                ctx.db
                    .query("subtasks")
                    .withIndex("by_task", (q) => q.eq("taskId", taskId))
                    .collect()
            )
        ).then(results => results.flat());

        // Delete everything in parallel (fastest approach)
        await Promise.all([
            ...allSubtasks.map(s => ctx.db.delete(s._id)),
            ...allTasks.map(t => ctx.db.delete(t._id)),
            ...columns.map(c => ctx.db.delete(c._id)),
        ]);

        // Delete the board last
        await ctx.db.delete(boardId);
    }
});

// Get subtasks for each task




