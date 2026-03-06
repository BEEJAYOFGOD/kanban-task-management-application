import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState, } from "react";
import SubtaskInput from "./SubtaskInput";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import { Id } from "@/convex/_generated/dataModel";
import { BoardFormValues, boardSchema } from "@/schemsa/Board";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";

interface AddNewColumnDialogProps {
    edit?: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type ColumnInput = {
    _id?: Id<"columns">;
    name: string;
};

export default function AddNewBoardDialog({
    edit = false,
    open = false,
    onOpenChange,
}: AddNewColumnDialogProps) {
    const { currentBoard } = useBoardContext();
    const defaultColumns: ColumnInput[] = [{ name: "Todo" }, { name: "Doing" }];

    const [shake, setShake] = useState(false);


    const onError = () => {
        setShake(s => !s); // toggles true → false → true each submit
    };

    const { handleSubmit, control, register, setValue, reset, formState: { isSubmitting, isDirty, errors } } = useForm<BoardFormValues>({
        resolver: zodResolver(boardSchema),
        mode: 'onTouched',

        defaultValues: {
            name: edit ? currentBoard?.name : "",
            columns: edit ? currentBoard?.columns : defaultColumns
        },

    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "columns"
    });

    const createBoard = useMutation(api.queries.boards.createBoard);
    const updateBoard = useMutation(api.queries.boards.updateBoard);

    // Only sync when dialog opens/closes
    useEffect(() => {
        if (open) {
            if (edit && currentBoard) {
                setValue("name", currentBoard?.name);

            }
        }


    }, [open]);





    const onSubmit = async (data: BoardFormValues) => {

        if (!isDirty) {
            clearForm(); // just close silently
            return;
        }

        const columnsToSend = data.columns.map(({ _id, name }) => ({
            _id: _id as Id<"columns"> || undefined,
            name
        }));

        if (edit && currentBoard) {
            await updateBoard({
                boardId: currentBoard._id,
                name: data.name,
                columns: columnsToSend
            });
        } else {
            await createBoard({
                name: data.name,
                columns: data.columns
            });
        }


        clearForm();
    };

    const clearForm = () => {
        onOpenChange(false);
        reset()

    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onEscapeKeyDown={() => clearForm()}
                onPointerDownOutside={() => clearForm()}
                className="sm:max-w-sm"
                showCloseButton={false}
            >
                <form onSubmit={handleSubmit(onSubmit, onError)}>
                    <DialogHeader>
                        <div className="flex justify-between items-center mb-8">
                            <DialogTitle>
                                {edit ? "Edit" : "Add New"} Board
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="board-name">Board Name</Label>

                            <div>
                                <Input
                                    {...register("name")}
                                    key={`name-${shake}`}
                                    type="text"
                                    id="name"
                                    placeholder="e.g. Web Design"
                                    className="placeholder:text-medium-gray/50"
                                    error={errors?.name?.message}
                                />
                            </div>
                        </Field>
                        <Field>
                            <Label htmlFor="columns">Board Columns</Label>
                            <div className="h-24 overflow-y-auto pr-2
                                [&::-webkit-scrollbar]:w-2
                                [&::-webkit-scrollbar-track]:bg-dashboard-bg
                                [&::-webkit-scrollbar-track]:dark:bg-background
                                [&::-webkit-scrollbar-thumb]:bg-primary
                                [&::-webkit-scrollbar-thumb]:dark:bg-primary
                                [&::-webkit-scrollbar-thumb]:rounded-full
                                [&::-webkit-scrollbar-track]:border-t-4
                                [&::-webkit-scrollbar-track]:border-transparent
                                [&::-webkit-scrollbar-track]:bg-clip-padding"
                            >
                                {fields.map((field, index) => (
                                    <SubtaskInput
                                        error={errors.columns?.[index]?.name?.message}
                                        key={errors.columns?.[index]?.name ? `col-${index}-error-${shake}` : `col-${index}`}
                                        isOnly={fields.length === 1}
                                        registration={register(`columns.${index}.name`)}
                                        removeSubtask={() => remove(index)}
                                    />
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <div className="flex flex-col gap-2 w-full">
                            <Button onClick={() => append({ name: "" })} className="w-full" variant="outline">
                                + Add New Column
                            </Button>
                            <Button disabled={isSubmitting} className="w-full" type="submit">
                                {edit ? "Save Changes" : "Create New Board"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
