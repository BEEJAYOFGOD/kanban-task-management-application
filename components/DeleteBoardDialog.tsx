import { Board } from "@/types/Boards";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "./ui/dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useRouter } from "next/navigation";


interface DeleteBoardDialogProps {
    currentBoard: Board | null | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DeleteBoardDialog({ currentBoard, open, onOpenChange }: DeleteBoardDialogProps) {
    const deleteBoard = useMutation(api.queries.boards.deleteBoard);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const close = () => {
        onOpenChange(false);
    }

    const delBoard = async () => {

        setIsDeleting(true);
        if (currentBoard) {
            await deleteBoard({ boardId: currentBoard._id });
        }

        setIsDeleting(false);

        close();
        router.push("/dashboard");



    }


    return (
        <Dialog open={open} onOpenChange={onOpenChange} >
            <DialogContent className="max-w-sm" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-[#EA5555]">Delete This Board</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-medium-gray">
                    {`Are you sure you want to delete the ‘${currentBoard?.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
                </DialogDescription>
                <DialogFooter >

                    <div className="flex w-full gap-4">

                        <Button disabled={isDeleting} onClick={() => delBoard()} className="flex-1" variant="destructive">Delete</Button>
                        <Button disabled={isDeleting} onClick={() => close()} className="flex-1" variant="outline">Cancel</Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>

    )

}
