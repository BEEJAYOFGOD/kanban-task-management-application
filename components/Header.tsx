'use client'
import Image from "next/image";
import logo from "@/public/icons/logo.png"
import { useBoardContext } from "@/contexts/BoardContext";
import { useSidebar } from "./ui/sidebar";
import AddTaskBtn from "./AddTaskBtn";

export default function Header() {
    const { state } = useSidebar();
    const { boardName } = useBoardContext();

    return (
        <nav className="flex justify-between w-full h-16 bg-sidebar">
            <div className={`flex p-4 gap-4 w-60 pl-6 border-r-sidebar-border/20 border-r items-center ${state === "collapsed" ? "border-r-sidebar-border border-b" : "border-b-0"}`}>
                <Image height="20" width="20" className="w-8" src={logo} alt="kanban logo" />
                <h1 className="font-bold text-4xl">Kanban</h1>
            </div>
            <div className="flex p-4 flex-1 justify-between border-b-sidebar-border/20 border-b items-center">
                <h1 className="text-xl font-bold">{boardName || "Create a board to get started"}</h1>

                <AddTaskBtn />

            </div>
        </nav>
    )
}
