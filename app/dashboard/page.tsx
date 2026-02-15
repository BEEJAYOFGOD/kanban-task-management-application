import DashboardEmpty from "@/components/DashboardEmpty"
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";

import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";



export default async function Dashboard() {
    // const preloadedBoards = await preloadQuery(api.queries.boards.getAll);

    const boards = await fetchQuery(api.queries.boards.getAll);

    // Redirect to first board if boards exist
    if (boards.length > 0) {
        redirect(`/dashboard/${boards[0]._id}`);
    }

    // Show empty state if no boards
    return <DashboardEmpty />;



    // return <BoardsList preloaded={preloadedBoards} />;
}
