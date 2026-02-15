
export interface Board {
    _id: string;
    _creationTime: number;
    name: string;
    status: string;
    columns: Column[];
}

export interface Column {
    name: string;
    tasks: Task[];
}

export interface Task {
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
}

interface Subtask {
    title: string;
    isCompleted: boolean;
}
