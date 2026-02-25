'use client'

import Column from "./Column";
import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import AddNewBoardDialog from "./AddBoardDialog";
import { useState } from "react";


export default function Board({ preloadedFullBoard }: { preloadedFullBoard: Preloaded<typeof api.queries.boards.getFullBoard> }) {
    // If we have preloaded data, use it. Otherwise, use what's in the context.
    const currentBoard = usePreloadedQuery(preloadedFullBoard);
    const [open, setOpen] = useState(false);

    if (!currentBoard) {
        return <div className="flex flex-col justify-center items-center h-full gap-4">
            <p> This Board Cannot Be Found create a Board Below or select one on Sidebar</p>
            <Button onClick={() => setOpen(true)}>Create Board</Button>
            <AddNewBoardDialog open={open} onOpenChange={setOpen} />
        </div>
    }

    return (
        <div className={`flex w-full  gap-4`}>
            {currentBoard?.columns?.map((column: any, idx: number) => (
                <Column key={idx} column={column} />
            ))}

            <div onClick={() => setOpen(true)} className="cursor-pointer w-60 h-[calc(100vh-4rem)] flex mt-8 justify-center items-center bg-medium-gray/4 rounded-md ">
                <p className="text-medium-gray font-bold  hover:rounded-full hover:bg-medium-gray/10 hover:p-1 hover:text-white/80  hover:px-4">+ New Column</p>
            </div>

            <AddNewBoardDialog
                edit={true}
                open={open}
                onOpenChange={setOpen} />

        </div>
    )
}

