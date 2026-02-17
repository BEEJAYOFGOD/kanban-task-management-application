'use client'
import { createContext, useContext, ReactNode } from 'react';
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Column } from '@/types/Boards';

interface BoardContextType {
    boards: any[] | undefined;
    currentBoard: any | undefined;
    boardId: Id<"boards"> | undefined;
    boardName: string | undefined;
    statuses: string[];
    isLoading: boolean;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({
    children,
    preloadedBoards
}: {
    children: ReactNode;
    preloadedBoards: Preloaded<typeof api.queries.boards.getAll>;
}) {
    const boards = usePreloadedQuery(preloadedBoards);
    const params = useParams();
    const boardId = params.id as Id<"boards">;
    const fullBoard = useQuery(api.queries.boards.getFullBoard,
        boardId ? { boardId } : "skip"
    );

    const activeBoardFromList = boards?.find((b) => b._id === boardId);

    const value: BoardContextType = {
        boards,
        currentBoard: fullBoard,
        boardId,
        boardName: fullBoard?.name || activeBoardFromList?.name,
        statuses: fullBoard?.columns?.map((column: any) => column.name) ?? [],
        isLoading: !fullBoard && !!boardId,
    };

    return (
        <BoardContext.Provider value={value}>
            {children}
        </BoardContext.Provider>
    );
}

export function useBoardContext() {
    const context = useContext(BoardContext);
    if (context === undefined) {
        throw new Error('useBoardContext must be used within a BoardProvider');
    }
    return context;
}
