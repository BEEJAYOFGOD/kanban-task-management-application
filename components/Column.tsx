import TaskCard from "./Task";
import type { Column } from "@/types/Boards";
import { useMemo } from "react";

export default function Column({ column }: { column: Column }) {
    const { name, tasks } = column;
    const noOfTasks = tasks.length;

    // Generate consistent random color based on column name
    const color = useMemo(() => {
        // Hash the column name to get a consistent number
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Generate HSL color (360 degrees for hue)
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    }, [name]);

    return (
        <div className="flex flex-col gap-4 w-[240px]">
            <div className="flex items-center gap-3">
                {/* Glowing colored box */}
                <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}, 0 0px 5px ${color}`,
                    }}
                />
                <h1 className="uppercase text-medium-gray tracking-widest text-sm font-semibold">
                    {name} ({noOfTasks})
                </h1>
            </div>

            <div className="flex gap-2 flex-col">
                {tasks.map((task, idx) => (
                    <TaskCard key={idx} task={task} />
                ))}
            </div>
        </div>
    );
}
