import Subtask from "./Subtask";
import type { Column } from "@/types/Boards";

export default function Column({ column }: { column: Column }) {
    const { name, tasks } = column;
    const noOfTasks = tasks.length;

    return (
        <div className="flex flex-col gap-4 w-[240px]">
            <h1 className="uppercase text-medium-gray tracking-widest">{name} ({noOfTasks})</h1>

            {tasks.map((task, idx) => (
                <Subtask key={idx} task={task} />
            ))}
        </div>
    );
}
