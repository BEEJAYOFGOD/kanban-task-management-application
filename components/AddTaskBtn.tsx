'use client'
import Option from "@/public/icons/headeroptions.png";
import Image from "next/image";
import AddNewTaskDialog from "./AddTaskDialog";

export default function AddTaskBtn() {
    return (
        <div className="flex gap-4 items-center">
            <AddNewTaskDialog />
            <div className="cursor-pointer">
                <Image height="8" width="8" className="w-1 " src={Option} alt="kanban logo" />
            </div>
        </div>
    )
}
