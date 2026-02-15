import { Task } from "@/types/Boards";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Subtask({ task }: { task: Task }) {
    const noOfCompleted = task.subtasks.filter((subtask) => subtask.isCompleted).length;

    return (
        <Card className="p-4 px-3 rounded-sm">
            <CardHeader className="p-0 space-y-0">
                <CardTitle>{task.title}</CardTitle>
                <CardDescription>{noOfCompleted} of {task.subtasks.length} subtasks</CardDescription>
            </CardHeader>
        </Card>
    )
}
