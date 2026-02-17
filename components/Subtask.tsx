'use client'
import { Task } from "@/types/Boards";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import AddNewColumnBtn from "./AddNewColumnBtn";
import { useState } from "react";
import ViewTaskDialog from "./ViewTaskDialog";

export default function Subtask({ task }: { task: Task }) {
    const noOfCompleted = task.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0;
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const viewTask = () => {
        setIsDialogOpen(true);
    }


    return (
        <>
            <Card onClick={viewTask} className="p-4 px-3 rounded-sm">
                <CardHeader className="p-0 space-y-0">
                    <CardTitle>{task.title}</CardTitle>
                    <CardDescription>{noOfCompleted} of {task.subtasks.length} subtasks</CardDescription>
                </CardHeader>
            </Card>


            <ViewTaskDialog task={task} onOpenChange={setIsDialogOpen} open={isDialogOpen} />
        </>
    )
}
