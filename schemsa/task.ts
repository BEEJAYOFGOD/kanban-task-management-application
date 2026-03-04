import * as z from "zod";

const subtaskSchema = z.object({
    _id: z.string().optional(),
    title: z.string().trim().min(1, "Can't be empty")
});

export const taskSchema = z.object({
    title: z.string().trim().min(1, "Can't be empty"),
    description: z.string().trim().min(1, "Can't be empty"),
    status: z.string(),
    subtasks: z.array(subtaskSchema)
});


export type TaskFormValues = z.infer<typeof taskSchema>
