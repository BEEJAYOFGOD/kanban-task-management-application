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
import { useState } from "react";
import SubtaskInput from "./SubtaskInput";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AddNewColumnDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface DialogContentProp {
    onEscapeKeyDown: (e: KeyboardEvent) => void
    onPointerDownOutside: (e: CustomEvent<{ originalEvent: PointerEvent }>) => void

}

export default function AddNewBoardDialog({
    open = false,
    onOpenChange,
}: AddNewColumnDialogProps) {

    const defaultColumns = ["Todo", "Doing"]
    const [columns, setColumns] = useState<string[]>(defaultColumns);
    const createBoard = useMutation(api.queries.boards.createBoard);
    const [boardName, setBoardName] = useState("")

    const removeSubtask = (index: number) => {
        setColumns(columns.filter((_, i) => i !== index));
    };

    const addNewSubTask = () => {
        setColumns([...columns, ""])
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setColumns((prev) => {
            const newSubtask = [...prev];

            newSubtask[index] = e.target.value;
            return newSubtask;
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await createBoard({
            name: boardName,
            columns
        });

        onOpenChange(false)

        console.log("amen")

    }

    const clearForm = () => {
        setBoardName("");
        setColumns(defaultColumns)
    }

    return (
        <Dialog
            open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onEscapeKeyDown={clearForm}
                onPointerDownOutside={clearForm}

                className="sm:max-w-sm" showCloseButton={false}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader >
                        <div className="flex justify-between items-center mb-8">
                            <DialogTitle>
                                Add New Board
                            </DialogTitle>
                        </div>

                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="board-name">Board Name</Label>
                            <Input required onChange={(e) => setBoardName(e.target.value)} type="text" id="board-name" name="board-name" placeholder="e.g. Web Design" className="placeholder:text-medium-gray/50" value={boardName} />
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
                             [&::-webkit-scrollbar-track]:bg-clip-padding
                             ">

                                {columns.map((column, index) => (
                                    <SubtaskInput key={index} index={index} subtask={column} handleInputChange={handleInputChange} removeSubtask={removeSubtask} />
                                ))}
                            </div>

                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <div className="flex flex-col gap-2 w-full">
                            <Button onClick={() => addNewSubTask()} className="w-full" variant="outline">+ Add New Column</Button>
                            <Button className="w-full" type="submit">Create New Board</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog >
    )
}
