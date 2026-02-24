import { useBoardContext } from "@/contexts/BoardContext";
import Option from "@/public/icons/headeroptions.png";
import Image from "next/image";
import AddNewBoardDialog from "./AddBoardDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DeleteBoardDialog from "./DeleteBoardDialog";


export default function MoreOptions() {
    const { currentBoard, isLoading } = useBoardContext();
    const [edit, setEdit] = useState(false);
    const [del, setDel] = useState(false);

    const handleMoreOptions = () => {
        if (!currentBoard) return;
    }

    return (
        <>
            <div className="cursor-pointer" onClick={handleMoreOptions}>
                {!isLoading ?
                    <DropdownMenu>
                        <DropdownMenuTrigger className={`${currentBoard ? 'flex' : 'hidden'}`} asChild>
                            <Image src={Option} alt="Option" className="w-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-4">
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setEdit(true)}>
                                    Edit Board
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setDel(true)} variant="destructive">
                                    Delete Board
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <div>
                        <div className="w-6 h-6 borde-white rounded-full border-2 border-b-primary animate-spin"></div>
                    </div>}
            </div>
            <AddNewBoardDialog edit={edit} open={edit} onOpenChange={setEdit} />
            <DeleteBoardDialog currentBoard={currentBoard} open={del} onOpenChange={setDel} />
        </>
    )
}
