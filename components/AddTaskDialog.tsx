'use client'
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import closeBtn from "@/public/icons/closeBtn.png"
import Image from "next/image";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { SelectContent, Select, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export default function AddNewTaskDialog({ statuses }: { statuses: string[] }) {

    const [subtasks, setSubtasks] = useState<string[]>(statuses);

    const addNewSubTask = () => {
        setSubtasks([...subtasks, ""])
    }
    const removeSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setSubtasks((prev) => {

            const newSubtask = [...prev];
            newSubtask[index] = e.target.value;

            return newSubtask;
        })
    }

    return (
        <Dialog >
            <form>
                <DialogTrigger asChild>
                    <Button>Add New Task</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                    <DialogHeader >
                        <div className="flex justify-between items-center">
                            <DialogTitle>
                                Add New Task
                            </DialogTitle>
                        </div>

                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Title</Label>
                            <Input type="text" id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>

                        <Field>
                            <Label htmlFor="name-1">Description</Label>
                            <Textarea id="name-1" name="name" defaultValue="Pedro Duarte" />
                        </Field>

                        <Field>
                            <Label htmlFor="username-1">Subtasks</Label>

                            {subtasks.map((subtask, index) => (
                                <div className="flex items-center gap-4">
                                    <Input onChange={(e) => handleInputChange(e, index)} type="text" value={subtask} id="username-1" name="username" placeholder="e.g make a coffee" />
                                    <Image src={closeBtn} onClick={() => removeSubtask(index)} alt="closeBtn" className="w-4 h-4 cursor-pointer" />
                                </div>
                            ))}

                        </Field>
                    </FieldGroup>

                    <DialogFooter >
                        <div className="flex flex-col gap-2 w-full">
                            <Button onClick={() => addNewSubTask()} className="w-full" variant="outline">+ Add New Subtask</Button>

                            <div className="space-y-2 w-full">
                                <Label htmlFor="task-status">Status</Label>
                                <Select defaultValue={statuses[0]}>
                                    <SelectTrigger className="w-full" id="task-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="mt-12 w-full">
                                        {statuses.map(status =>
                                            <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="w-full" type="submit">Save changes</Button>
                        </div>
                    </DialogFooter>


                </DialogContent>
            </form>
        </Dialog >
    )
}
