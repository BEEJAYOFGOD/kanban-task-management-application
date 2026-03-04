'use client'
import AddNewBoardDialog from "@/components/AddBoardDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function NotFound() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col justify-center items-center h-full gap-4">
            <p> This Board Cannot Be Found create a Board Below or select one on Sidebar</p>
            <Button onClick={() => setOpen(true)}>Create Board</Button>
            <AddNewBoardDialog open={open} onOpenChange={setOpen} />
        </div>
    )
}
