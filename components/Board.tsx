'use client'
import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";


type BoardProps = {
    preloadedBoard: Preloaded<typeof api.queries.boards.getBoardById>;
};


export default function Board({ preloadedBoard }: BoardProps) {
    const board = usePreloadedQuery(preloadedBoard);
    return (
        <div>
            <h1>Board {board?.name}</h1>
        </div>
    )
}
