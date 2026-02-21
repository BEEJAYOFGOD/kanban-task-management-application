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
import { useState, useEffect } from "react"; // Add useEffect
import SubtaskInput from "./SubtaskInput";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useBoardContext } from "@/contexts/BoardContext";
import { Id } from "@/convex/_generated/dataModel";

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
    const defaultColumns = [{ name: "Todo" }, { name: "Doing" }];
    const [columns, setColumns] = useState<ColumnInput[]>(defaultColumns);
    const [boardName, setBoardName] = useState("");


    const createBoard = useMutation(api.queries.boards.createBoard);
    const updateBoard = useMutation(api.queries.boards.updateBoard);
    const [editMount, setEditMount] = useState(false);


    // Sync state when dialog opens in edit mode
    useEffect(() => {
        if (open && edit && currentBoard) {
            setBoardName(currentBoard.name || "");
            setColumns(currentBoard.columns || defaultColumns);
        } else if (open && !edit) {
            // Reset for "Add New" mode
            setBoardName("");
            setColumns(defaultColumns);
        }
    }, [open, edit, currentBoard]);


    const removeSubtask = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index));
    };


    const addNewSubTask = () => {
        setColumns([...columns, { name: "" }])
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (editMount == false) {
            setEditMount(true)
        }

        setColumns((prev) => {
            const newSubtask = [...prev];
            newSubtask[index].name = e.target.value;
            return newSubtask;
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (edit && currentBoard) {
            updateBoard({
                boardId: currentBoard?._id,
                name: boardName,
                columns: columns.map(col => ({
                    _id: col._id,
                    name: col.name
                }))

            });


        } else {
            await createBoard({
            name: boardName,
            columns
        });

        }

        onOpenChange(false);
    }

    const clearForm = () => {
        setBoardName("");
        setColumns(defaultColumns)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onEscapeKeyDown={clearForm}
                onPointerDownOutside={clearForm}
                className="sm:max-w-sm"
                showCloseButton={false}
            >
                <form onSubmit={handleSubmit}>
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
                            <Input
                                required
                                onChange={(e) => {
                                    if (editMount == false) {
                                        setEditMount(true)
                                    }
                                    setBoardName(e.target.value)
                                }}
                                type="text"
                                id="board-name"
                                name="board-name"
                                placeholder="e.g. Web Design"
                                className="placeholder:text-medium-gray/50"
                                value={boardName}
                            />
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
                                {columns.map((column, index) => (
                                    <SubtaskInput
                                        key={index}
                                        index={index}
                                        subtask={column.name}
                                        handleInputChange={handleInputChange}
                                        removeSubtask={removeSubtask}
                                    />
                                ))}
                            </div>
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <div className="flex flex-col gap-2 w-full">
                            <Button onClick={() => addNewSubTask()} className="w-full" variant="outline">
                                + Add New Column
                            </Button>
                            <Button disabled={edit && !editMount} className="w-full" type="submit">
                                {edit ? "Save Changes" : "Create New Board"}
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
