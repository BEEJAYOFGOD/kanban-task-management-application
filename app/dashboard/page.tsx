import DashboardEmpty from "@/components/DashboardEmpty"


export default async function Dashboard() {
    // const preloadedBoards = await preloadQuery(api.queries.boards.getAll);
    // Show empty state if no boards
    // There's already a proxy for this page that redirects to the first board if it exists
    return <DashboardEmpty />;
}
