import { Id } from "@/convex/_generated/dataModel";

export interface Board {
    _id: Id<"boards">;
    _creationTime: number;
    name: string;
    columns: Column[];
}

export interface Column {
    _id: Id<"columns">;
    _creationTime: number;
    boardId: Id<"boards">;
    name: string;
    tasks: Task[];
    order: number;
}

export interface Task {
    _id: Id<"tasks">;
    _creationTime: number;
    boardId: Id<"boards">;
    columnId: Id<"columns">;
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
    order: number;
}

export interface Subtask {
    _id: Id<"subtasks">;
    _creationTime: number;
    taskId: Id<"tasks">;
    title: string;
    isCompleted: boolean;
}
