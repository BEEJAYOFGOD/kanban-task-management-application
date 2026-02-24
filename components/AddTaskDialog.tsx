'use client'
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
import { useEffect, useMemo, useState } from "react";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import { Column, Task } from "@/types/Boards";
import SubtaskInput from "./SubtaskInput";
import { Id } from "@/convex/_generated/dataModel";

interface AddTaskDialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    mode: "edit" | 'add';
    task?: Task;
}

export default function AddNewTaskDialog({ open, onOpenChange, mode, task }: AddTaskDialogProps) {
    const { statuses, boardId, currentBoard, isLoading } = useBoardContext();
    const createTask = useMutation(api.queries.boards.createTask);
    const updateTask = useMutation(api.queries.boards.updateTask)

    console.log('statuses', statuses);

    const emptyStatus = [{ title: "" }, { title: "" }];

    const [subtasks, setSubtasks] = useState<{ _id?: Id<"subtasks">, title: string }[]>(
        mode === "edit" ? (task?.subtasks ?? emptyStatus) : emptyStatus
    );

    const [title, setTitle] = useState(mode === 'edit' ? task?.title : "");
    const [description, setDescription] = useState(mode === 'edit' ? task?.description : "");
    const [status, setStatus] = useState(mode === 'edit' ? task?.status : statuses[0]?.name);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (mode === 'add' && statuses?.[0]?.name && !status) {
            setStatus(statuses[0].name);
        }

    }, [statuses]);

    console.log(status);

    const [isOpen, setIsOpen] = useState(false);

    const addNewSubTask = () => {
        setSubtasks([...subtasks, { title: '' }]);
    }
    const removeSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setSubtasks((prev) => {
            const newSubtask = [...prev];

            newSubtask[index] = { ...newSubtask[index], title: e.target.value };
            return newSubtask;
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!boardId || !currentBoard) return;



        try {


            // Find the column ID for the selected status
            console.log(task?.status, "task status");
            console.log(currentBoard.columns, "current board columns");
            const selectedColumn = currentBoard.columns?.find((c: Column) => c.name === (status));

            console.log(selectedColumn);
            if (!selectedColumn) return;

            setIsSubmitting(true);

            const subtasksToSend = subtasks.map(({ _id, title }) => ({ _id, title }));

            if (mode == "edit" && task) {

                await updateTask({
                    taskId: task._id,
                    title,
                    description,
                    status: status,
                    columnId: selectedColumn._id,
                    subtasks: subtasksToSend
                });


            } else {


                await createTask({
                    title: title!,
                    description: description!,
                    status: status!,
                    columnId: selectedColumn._id,
                    boardId,
                    subtasks
                });
            }
        } catch (error) {

            console.log(error);

        }


        setIsSubmitting(false);
        clearForm();
    };

    const hasChanges = useMemo(() => {
        if (mode !== "edit" || !task) return true;

        // Check name change
        const descriptionChanged = description !== task?.description;
        const titleChanged = title !== task?.title;
        const statusChanged = status !== task?.status;



        // Check subtask change
        const originalSubtasks = task.subtasks || [];

        // Different number of columns
        if (subtasks.length !== originalSubtasks.length) return true;

        // Check if any column name changed
        const subtasksChanged = subtasks.some((col, index) => {
            const original = originalSubtasks[index];

            return col.title !== original?.title || col._id !== original?._id;
        });

        return titleChanged || statusChanged || descriptionChanged || subtasksChanged;
    }, [mode, task, description, status, subtasks, title]);

    const clearForm = () => {
        setIsOpen(false);
        onOpenChange && onOpenChange(false);
        setTitle("");
        setDescription("");
        setSubtasks(emptyStatus);
    }



    return (

        <Dialog open={isOpen || open} onOpenChange={setIsOpen || onOpenChange}>

            <DialogTrigger asChild className={`${mode === 'edit' && 'hidden'}`}>
                <Button disabled={isLoading || !currentBoard} >+ Add New Task</Button>
            </DialogTrigger>

            <DialogContent
                onEscapeKeyDown={() => {
                    { mode === 'edit' && (onOpenChange && onOpenChange(false)) };
                    clearForm();
                }
                }

                onPointerDownOutside={() => {
                    { mode === 'edit' && (onOpenChange && onOpenChange(false)) };
                    clearForm();
                }}

                className="sm:max-w-sm" showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader >
                        <div className="flex justify-between items-center mb-6">
                            <DialogTitle>
                                {`${mode === 'edit' ? 'Edit Task' : 'Add New Task'}`}
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
                                    <SubtaskInput key={index} index={index} subtask={subtask.title} handleInputChange={handleInputChange} removeSubtask={removeSubtask} />
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    <div className="mt-4 flex flex-col gap-4">
                        <Button type="button" onClick={() => addNewSubTask()} className="w-full" variant="outline">+ Add New Subtask</Button>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="task-status">Status</Label>

                            <Select value={status} onValueChange={setStatus} defaultValue={statuses?.[0]?.name}>
                                <SelectTrigger className="w-full" id="task-status">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent className="mt-12 w-full">
                                    {statuses?.map(s =>
                                        <SelectItem key={s._id} value={s.name}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button disabled={isSubmitting || !hasChanges} className="w-full" type="submit">{`${mode === 'edit' ? 'Update Task' : 'Create Task'}`}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
