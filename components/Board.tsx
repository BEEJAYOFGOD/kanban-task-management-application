'use client'

import Column from "./Column";
import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "./ui/button";
import AddNewBoardDialog from "./AddBoardDialog";


export default function Board({ preloadedFullBoard }: { preloadedFullBoard: Preloaded<typeof api.queries.boards.getFullBoard> }) {
    // If we have preloaded data, use it. Otherwise, use what's in the context.
    const currentBoard = usePreloadedQuery(preloadedFullBoard);

    if (!currentBoard) {
        return <div>Board Not Found</div>
    }

    return (
        <div className={`flex w-full  gap-4`}>
            {currentBoard?.columns?.map((column: any, idx: number) => (
                <Column key={idx} column={column} />
            ))}

            <div className="w-60 h-[calc(100vh-4rem)] flex mt-8 justify-center items-center bg-medium-gray/10 rounded-md">
                <p className="text-medium-gray font-bold">+ New Column</p>
            </div>
            {/* <AddNewBoardDialog /> */}

        </div>
    )
}

