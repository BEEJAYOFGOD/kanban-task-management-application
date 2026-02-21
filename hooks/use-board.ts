import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";

export function useCurrentBoard() {
    const params = useParams();
    const boardId = params.id as Id<"boards">;

    const boards = useQuery(api.queries.boards.getAll);
    const board = useQuery(api.queries.boards.getFullBoard,
        boardId ? { boardId } : "skip");

    const preloadedBoard = boards?.find((b) => b._id === boardId);

    return {
        board,
        boardId,
        boardName: board?.name || preloadedBoard?.name,
        statuses: board?.columns?.map((c: any) => c.name) ?? [],
        isLoading: !board && !preloadedBoard,
    };
}
