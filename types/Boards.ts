
export interface Board {
    _id: string;
    _creationTime: number;
    name: string;
    status: string;
    columns: Column[];
}

interface Column {
    name: string;
    tasks: Task[];
}

interface Task {
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
}

interface Subtask {
    title: string;
    isCompleted: boolean;
}
