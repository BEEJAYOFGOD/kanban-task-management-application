import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import { Column } from "@/types/Boards";
import SubtaskInput from "./SubtaskInput";


export default function AddNewTaskDialog() {
    const { statuses, boardId, currentBoard, boards } = useBoardContext();

    console.log('statuses', statuses);
    const createTask = useMutation(api.queries.boards.createTask);

    const [subtasks, setSubtasks] = useState<string[]>(["", ""]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const addNewSubTask = () => {
        setSubtasks([...subtasks, ""])
    }
    const removeSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setSubtasks((prev) => {
            const newSubtask = [...prev];

            newSubtask[index] = e.target.value;
            return newSubtask;
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!boardId || !currentBoard) return;

        // Find the column ID for the selected status
        const selectedColumn = currentBoard.columns?.find((c: Column) => c.name === (status || statuses[0]));
        if (!selectedColumn) return;

        await createTask({
            title,
            description,
            status: status || statuses[0],
            columnId: selectedColumn._id,
            boardId,
            subtasks: subtasks.filter(s => s.trim() !== "").map(s => ({ title: s }))
        });

        setIsOpen(false);
        setTitle("");
        setDescription("");
        setSubtasks(["", ""]);
    };

    const clearForm = () => {
        setTitle('');
        setDescription('');
        setSubtasks(["", ""])
    }



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button disabled={boards?.length == 0} >+ Add New Task</Button>
            </DialogTrigger>
            <DialogContent
                onEscapeKeyDown={clearForm}
                onPointerDownOutside={clearForm}
                className="sm:max-w-sm" showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader >
                        <div className="flex justify-between items-center mb-6">
                            <DialogTitle>
                                Add New Task
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Take coffee break"
                                required
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="e.g. It's always good to take a break."
                            />
                        </Field>

                        <Field>
                            <Label>Subtasks</Label>

                            <div className="h-24 overflow-y-auto
                             [&::-webkit-scrollbar]:w-2 pr-2
                             [&::-webkit-scrollbar-track]:bg-dashboard-bg
                             [&::-webkit-scrollbar-track]:dark:bg-background
                             [&::-webkit-scrollbar-thumb]:bg-primary
                             [&::-webkit-scrollbar-thumb]:dark:bg-primary
                             [&::-webkit-scrollbar-thumb]:rounded-full"
                            >

                                {subtasks.map((subtask, index) => (
                                    <SubtaskInput key={index} index={index} subtask={subtask} handleInputChange={handleInputChange} removeSubtask={removeSubtask} />
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    <div className="mt-4 flex flex-col gap-4">
                        <Button type="button" onClick={() => addNewSubTask()} className="w-full" variant="outline">+ Add New Subtask</Button>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="task-status">Status</Label>

                            <Select onValueChange={setStatus} value={status || statuses[0]}>
                                <SelectTrigger className="w-full" id="task-status">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent className="mt-12 w-full">
                                    {statuses.map(s =>
                                        <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full" type="submit">Create Task</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
