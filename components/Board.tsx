'use client'

import Column from "./Column";
import { useBoardContext } from "@/contexts/BoardContext";


export default function Board() {
    const { currentBoard } = useBoardContext();

    return (
        <div className={`flex w-full  gap-4`}>
            {currentBoard?.columns.map((column: any, idx: number) => (
                <Column key={idx} column={column} />
            ))}
        </div>
    )
}

