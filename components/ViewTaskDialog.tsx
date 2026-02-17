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
import { Task } from "@/types/Boards";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useCurrentBoard } from "@/hooks/use-board";
import Image from "next/image";
import checkIcon from "@/public/icons/check.png"

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

    const { statuses } = useCurrentBoard();


    const noCompleted = task.subtasks?.filter(subtask => !subtask.isCompleted).length;


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
                            {task.subtasks?.map((subtask, index) => (
                                <div className="bg-dashboard-bg gap-2 items-center flex p-2 rounded-md">
                                    <div className={`${subtask.isCompleted ? "bg-primary" : "border-medium-gray/80 border bg-medium-gray/20"} w-6 h-6 flex items-center justify-center rounded-sm`}>
                                        {subtask.isCompleted && (
                                            <Image width="4" height="4" src={checkIcon} alt="checkbox" className="w-4" />
                                        )}

                                    </div>
                                    <li className="text-xs" key={index}>{subtask.title}</li>
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
