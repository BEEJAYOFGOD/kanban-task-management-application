'use client'

import { Button } from "@/components/ui/button";
import Option from "@/public/icons/headeroptions.png";
import Image from "next/image";

export default function AddTaskBtn() {
    return (

        <div className="flex gap-4 items-center">
            <Button className="rounded-full">+ Add New Task</Button>
            <div className="cursor-pointer">
                <Image height="8" width="8" className="w-1 " src={Option} alt="kanban logo" />
            </div>
        </div>
    )
}
