"use client";
import AddNewBoardDialog from "./AddBoardDialog";
import { useState } from "react";
import { Button } from "./ui/button";

export default function DashboardEmpty() {

    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-full  space-y-4">
            <h1>There's currently no board created. Create a new board to get started.</h1>


            <Button onClick={() => setOpen(true)}>+ Add New Board</Button>

            <AddNewBoardDialog open={open} onOpenChange={setOpen} />
        </div>
    )
}
