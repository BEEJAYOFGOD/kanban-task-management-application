import * as z from "zod";


const columnScheme = z.object({
    _id: z.string().optional(),
    name: z.string().trim().min(1, "Can't be empty"),
})

export const boardSchema = z.object({
    _id: z.string().optional(),
    name: z.string().trim().min(1, "Can't be empty"),
    columns: z.array(columnScheme)
})


export type BoardFormValues = z.infer<typeof boardSchema>
