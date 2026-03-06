'use client'
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import { Column, Task } from "@/types/Boards";
import SubtaskInput from "./SubtaskInput";
import { Id } from "@/convex/_generated/dataModel";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, TaskFormValues } from "@/schemsa/task";


interface AddTaskDialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    mode: "edit" | 'add';
    task?: Task;
}

export default function AddNewTaskDialog({ open, onOpenChange, mode, task }: AddTaskDialogProps) {
    const { statuses, boardId, currentBoard, isLoading } = useBoardContext();
    const createTask = useMutation(api.queries.boards.createTask);
    const updateTask = useMutation(api.queries.boards.updateTask);
    const [isOpen, setIsOpen] = useState(false);

    const [shake, setShake] = useState(false);


    const onError = () => {
        setShake(s => !s); // toggles true → false → true each submit
    };




    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<TaskFormValues>({
        resolver: zodResolver(taskSchema),
        mode: "onTouched",

        defaultValues: {
            title: mode === 'edit' ? task?.title : "",
            description: mode === 'edit' ? task?.description : "",
            status: mode === 'edit' ? task?.status : statuses[0]?.name,
            subtasks: mode === 'edit' ? task?.subtasks : [{ title: "" }, { title: "" }]
        }
    });

    useEffect(() => {
        if (mode === 'add' && statuses?.[0]?.name) {
            setValue("status", statuses[0].name);
        }

    }, [statuses]);


    const { fields, append, remove } = useFieldArray({
        control,
        name: "subtasks"
    });

    const onSubmit = async (data: TaskFormValues) => {


        // this will only apply for edit mode
        if (!isDirty) {
            clearForm();
            return;
        }

        if (!boardId || !currentBoard) return;

        try {
            const selectedColumn = currentBoard.columns?.find((c: Column) => c.name === data.status);
            if (!selectedColumn) return;

            const subtasksToSend = data.subtasks.map(({ _id, title }) => ({
                _id: _id as Id<"subtasks"> | undefined,
                title
            }));

            if (mode === "edit" && task) {
                await updateTask({
                    taskId: task._id,
                    title: data.title,
                    description: data.description,
                    status: data.status,
                    columnId: selectedColumn._id,
                    subtasks: subtasksToSend
                });
            } else {
                await createTask({
                    title: data.title,
                    description: data.description!,
                    status: data.status,
                    columnId: selectedColumn._id,
                    boardId,
                    subtasks: data.subtasks
                });
            }
        } catch (error) {
            console.log(error);
        }

        clearForm();
    };

    const clearForm = () => {
        reset();
        setShake(!shake);
        setIsOpen(false);
        onOpenChange?.(false);
    }



    return (
        <Dialog onOpenChange={(open) => { setIsOpen(open); onOpenChange?.(open); }}>
            <DialogTrigger asChild className={`${mode === 'edit' && 'hidden'}`}>
                <Button disabled={isLoading || !currentBoard}>+ Add New Task</Button>
            </DialogTrigger>

            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={() => {
                    mode === 'edit' && (onOpenChange && onOpenChange(false));
                    clearForm();
                }}
                onPointerDownOutside={() => {
                    mode === 'edit' && (onOpenChange && onOpenChange(false));
                    clearForm();
                }}
                className="sm:max-w-sm"
                showCloseButton={false}
            >
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <DialogHeader>
                        <div className="flex justify-between items-center mb-6">
                            <DialogTitle>
                                {mode === 'edit' ? 'Edit Task' : 'Add New Task'}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="title">Title</Label>
                            <Input
                                error={errors?.title?.message}
                                //  error={shake ? errors?.title?.message : undefined}
                                type="text"
                                {...register("title")}
                                id="title"
                                key={`title-${shake}`}
                                placeholder="e.g. Take coffee break"
                            />
                        </Field>

                        <Field>
                            <Label htmlFor="description">Description</Label>

                            <Textarea
                                maxLength={200}
                                error={errors?.description?.message}
                                id="description"
                                key={`description-${shake}`}
                                {...register("description")}
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
                                {fields.map((field, index) => (
                                    <SubtaskInput
                                        isOnly={fields.length === 1}
                                        key={errors.subtasks?.[index]?.title?.message ? `subtask-${index}-error-${shake}` : `subtask-${index}`}
                                        removeSubtask={() => {
                                            console.log("ademola");
                                            remove(index);

                                            console.log("ademolauu");
                                        }}
                                        registration={register(`subtasks.${index}.title`)}
                                        error={errors.subtasks?.[index]?.title?.message}
                                    />
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    <div className="mt-4 flex flex-col gap-4">
                        <Button
                            type="button"
                            onClick={() => append({ title: "" })}
                            className="w-full"
                            variant="outline"
                        >
                            + Add New Subtask
                        </Button>

                        <div className="space-y-2 w-full">
                            <Label htmlFor="task-status">Status</Label>

                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full" id="task-status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="mt-12 w-full">
                                            {statuses?.map(s =>
                                                <SelectItem key={s._id} value={s.name}>{s.name}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                )}
                            />

                        </div>

                        <Button
                            disabled={isSubmitting}
                            className="w-full"
                            type="submit"
                        >
                            {mode === 'edit' ? 'Update Task' : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
