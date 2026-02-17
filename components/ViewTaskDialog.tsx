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

interface AddNewColumnDialogProps {
    mode?: "edit" | 'add';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    task: Task;
}

export default function ViewTaskDialog({
    mode = "edit",
    open = false,
    task,
    onOpenChange,
}: AddNewColumnDialogProps) {

    const { statuses, boardId } = useBoardContext();

    const noCompleted = task.subtasks?.filter(st => st.isCompleted).length || 0;

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogTrigger asChild>
                    {mode == "add" && <Button>Add New Column</Button>}
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader >
                        <div className="flex justify-between flex-col items-left">
                            <DialogTitle>
                                <p className="text-base">{task.title}</p>
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
                                        {subtask.isCompleted && (
                                            <Image width="4" height="4" src={checkIcon} alt="checkbox" className="w-4" />
                                        )}

                                    </div>
                                    <li className={`${subtask.isCompleted ? "line-through text-medium-gray" : ""} text-xs`}>{subtask.title}</li>
                                </div>
                            ))}
                        </ul>
                    </section>

                    <DialogFooter>
                        <div className="flex flex-col items-start w-full">
                            <p>Current Status</p>
                            <Select defaultValue={task.status}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="w-full mt-18">
                                    {statuses.map(status => (
                                        <SelectItem key={status} className="text-sm" value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog >
    )
}
