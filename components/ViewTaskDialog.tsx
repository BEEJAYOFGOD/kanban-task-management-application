import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import Image from "next/image";
import checkIcon from "@/public/icons/check.png"
import { Column, Subtask, Task } from "@/types/Boards";
import { Id } from "@/convex/_generated/dataModel";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useState } from "react";
import Option from "@/public/icons/headeroptions.png";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import AddNewTaskDialog from "./AddTaskDialog";

interface ViewTaskDialogProps {
    mode?: "edit" | 'add';
    open?: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task;
}

export default function ViewTaskDialog({
    mode = "edit",
    open = false,
    task,
    onOpenChange,
}: ViewTaskDialogProps) {

    const { statuses, boardId } = useBoardContext();

    const noCompleted = task.subtasks?.filter(st => st.isCompleted).length || 0;
    const [changeStatus, setIsChangingStatus] = useState(false);
    const updateTaskMutation = useMutation(api.queries.boards.updateTask);
    const [currentStatus, setCurrentStatus] = useState(task.status);
    const [editTask, setEdiTask] = useState(false);
    const [delTask, setDelTask] = useState(false);

    console.log(currentStatus, "task");
    console.log(task, 'task w status')


    const updateTask = async ({ columnId, taskId, status }: { columnId: Id<"columns">, taskId: Id<"tasks">, status: string }) => {
        setIsChangingStatus(true);

        await updateTaskMutation({ taskId, columnId, status });

        setIsChangingStatus(false);
    }


    const toggleSubtask = useMutation(api.queries.boards.toggleSubtask).withOptimisticUpdate(
        (localStore, { subtaskId, isCompleted }) => {
            if (!boardId) return;

            const board = localStore.getQuery(api.queries.boards.getFullBoard, { boardId });

            if (board) {
                localStore.setQuery(api.queries.boards.getFullBoard, { boardId }, {
                    ...board,

                    columns: board.columns.map((col: Column) => ({
                        ...col,
                        tasks: col.tasks.map((t: Task) => ({
                            ...t,
                            subtasks: t.subtasks.map((st: Subtask) =>
                                st._id === subtaskId ? { ...st, isCompleted } : st
                            )
                        }))
                    }))
                });
            }
        }
    );

    const toggleTaskStatus = async (subtaskId: Id<"subtasks">, isCompleted: boolean) => {
        await toggleSubtask({
            subtaskId,
            isCompleted: !isCompleted
        });
    }

    return (
        <>
            {editTask == true ?
                <AddNewTaskDialog open={editTask} onOpenChange={() => { setEdiTask(false); onOpenChange(false); }} mode="edit" task={task} /> :
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <form>
                        <DialogTrigger asChild>
                            {mode == "add" && <Button>Add New Column</Button>}
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                            <DialogHeader >
                                <div className="flex justify-between flex-col items-left">
                                    <DialogTitle>
                                        <div className="flex justify-between">
                                            <p className="text-base">{task.title}</p>


                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Image src={Option} alt="Option" className="w-1" />
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="mt-4">
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem onClick={() => setEdiTask(true)}>
                                                            Edit Task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>

                                                    <DropdownMenuGroup>
                                                        <DropdownMenuItem onClick={() => setDelTask(true)} variant="destructive">
                                                            Delete Task
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>


                                        </div>

                                    </DialogTitle>

                                    <DialogDescription className="text-xs text-medium-gray">{task.description}</DialogDescription>
                                </div>
                            </DialogHeader>


                            <section className="space-y-4">
                                <p>Subtasks ({task?.subtasks?.length > 0 ? noCompleted + " of " + task?.subtasks?.length : 0})</p>

                                <ul className="space-y-2">
                                    {task.subtasks?.map((subtask) => (
                                        <div
                                            key={subtask._id}
                                            onClick={() => toggleTaskStatus(subtask._id, subtask.isCompleted)}
                                            className="bg-dashboard-bg gap-2 items-center flex p-2 rounded-md cursor-pointer hover:bg-medium-gray/10"
                                        >
                                            <div className={`${subtask.isCompleted ? "bg-primary " : "border-medium-gray/80 border bg-medium-gray/20"} w-6 h-6 flex items-center justify-center rounded-sm`}>
                                                <Image width="4" height="4" src={checkIcon} alt="checkbox" className={`w-4 ${subtask.isCompleted ? "visible" : "invisible"}`} />

                                            </div>
                                            <li className={`${subtask.isCompleted ? "line-through text-medium-gray" : ""} text-xs`}>{subtask.title}</li>
                                        </div>
                                    ))}
                                </ul>
                            </section>

                            <DialogFooter>
                                <div className="flex flex-col items-start w-full">
                                    <p>Current Status</p>

                                    <Select onValueChange={async (e) => {
                                        setCurrentStatus(e);

                                        const columnId = statuses?.find(s => s.name === e)?._id as Id<"columns">;
                                        const taskId = task._id;

                                        await updateTask({ columnId, taskId, status: e })

                                    }} value={currentStatus}>
                                        <SelectTrigger disabled={changeStatus} className={`w-full mt-4 ${changeStatus ? "border-medium-gray/20 border-2 animate-pulse" : ""}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="w-full mt-18">
                                            {statuses?.map(status => (
                                                <SelectItem key={status._id} className="text-sm" value={status.name}>{status.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog >}
        </>
    )
}
