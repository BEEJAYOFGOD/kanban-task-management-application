import { Input } from "./ui/input";
import Image from "next/image";
import closeBtn from "@/public/icons/closeBtn.png";

interface SubtaskInputProps {
    index: number;
    subtask: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
    removeSubtask: (index: number) => void;
}

export default function SubtaskInput({ index, subtask, handleInputChange, removeSubtask }: SubtaskInputProps) {
    return (
        <div className="flex items-center gap-4 mb-2">
            <Input
                onChange={(e) => handleInputChange(e, index)}
                type="text"
                value={subtask}
                placeholder="e.g. Make coffee"
                required
            />
            <Image src={closeBtn} onClick={() => removeSubtask(index)} alt="closeBtn" className="w-4 h-4 cursor-pointer" />
        </div>
    )
}
