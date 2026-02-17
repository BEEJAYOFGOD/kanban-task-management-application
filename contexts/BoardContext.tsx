'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, Preloaded, usePreloadedQuery } from "convex/react";
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

    const currentBoard = useQuery(api.queries.boards.getBoardById,
        boardId ? { id: boardId } : "skip"
    );

    const activeBoardFromList = boards?.find((b) => b._id === boardId);
    const activeBoard = currentBoard || activeBoardFromList;

    const value: BoardContextType = {
        boards,
        currentBoard: activeBoard,
        boardId,
        boardName: activeBoard?.name,
        statuses: activeBoard?.columns.map((column: Column) => column.name) ?? [],
        isLoading: !activeBoard,
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
