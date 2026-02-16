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
import closeBtn from "@/public/icons/closeBtn.png"
import Image from "next/image";

interface AddNewColumnDialogProps {
    mode?: "edit" | 'add';
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function AddNewColumnDialog({
    mode = "edit",
    open = false,
    onOpenChange,
}: AddNewColumnDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <form>
                <DialogTrigger asChild>
                    {mode == "add" && <Button>Add New Column</Button>}
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader >
                        <div className="flex justify-between items-center">
                            <DialogTitle>
                                {mode == "edit" ? "Edit Board" : "Add New Board"}
                            </DialogTitle>
                        </div>

                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Board Name</Label>
                            <Input type="text" id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>
                        <Field>
                            <Label htmlFor="username-1">Board Columns</Label>
                            <div className="flex items-center gap-4">
                                <Input type="text" id="username-1" name="username" defaultValue="@peduarte" />
                                <Image src={closeBtn} alt="closeBtn" className="w-4 h-4" />
                            </div>
                        </Field>
                    </FieldGroup>

                    <DialogFooter >
                        <div className="flex flex-col gap-2 w-full">
                            <Button className="w-full" variant="outline">+ Add New Column</Button>
                            <Button className="w-full" type="submit">Save changes</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog >
    )
}
