'use client'

import DashboardEmpty from "@/components/DashboardEmpty"
import { useBoardContext } from "@/contexts/BoardContext";

export default function Dashboard() {
    const { boards } = useBoardContext();

    // Show empty state if no boards
    if (!boards || boards.length === 0) {
        return <DashboardEmpty />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-full space-y-4">
            <h1>There's currently no board selected. Click a board on the Sidebar to view.</h1>
        </div>
    );
}
