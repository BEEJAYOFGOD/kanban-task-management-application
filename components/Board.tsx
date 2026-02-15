'use client'
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import Column from "./Column";

type BoardProps = {
    preloadedBoard: Preloaded<typeof api.queries.boards.getBoardById>;
};


export default function Board({ preloadedBoard }: BoardProps) {
    const board = usePreloadedQuery(preloadedBoard);

    return (
        <div className={`flex w-full  gap-4`}>
            {board?.columns.map((column, idx) => (
                <Column key={idx} column={column} />
            ))}
        </div>
    )
}
