import Board from "@/components/Board";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

export default async function Dashboard({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const preloadedFullBoard = await preloadQuery(api.queries.boards.getFullBoard, {
        boardId: id as Id<"boards">
    });

    return (
        <Board preloadedFullBoard={preloadedFullBoard} />
    )
}
