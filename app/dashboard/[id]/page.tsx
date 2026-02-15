import Board from "@/components/Board";
import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";



export default async function Dashboard({ params }: { params: { id: string } }) {
    const { id } = await params;

    const preloadedBoard = await preloadQuery(api.queries.boards.getBoardById, { id: id as Id<"boards"> });

    return <Board preloadedBoard={preloadedBoard} />;
}
