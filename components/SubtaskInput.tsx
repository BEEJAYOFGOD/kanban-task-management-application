import { Input } from "./ui/input";
import Image from "next/image";
import closeBtn from "@/public/icons/closeBtn.png";
import { FieldArrayWithId, UseFormRegisterReturn } from "react-hook-form";
import CloseIcon from "./CloseBtn";

interface SubtaskInputProps {
    removeSubtask: () => void;
    registration: UseFormRegisterReturn;
    error?: string;
    isOnly?: boolean;
}

export default function SubtaskInput({ removeSubtask, registration, error, isOnly }: SubtaskInputProps) {
    return (
        <div className="flex flex-col gap-1 mb-2">
            <div className="flex items-center gap-4">
                <div className="w-full">
                    <Input
                        error={error}
                        {...registration}
                        type="text"
                        placeholder="e.g. Make coffee"
                    />

                </div>
                <button onMouseDown={(e) => {
                    e.preventDefault();  // prevents the input from losing focus
                    removeSubtask();
                }}
                    type="button" disabled={isOnly} className={`${isOnly && "opacity-50 "}`} onClick={() => removeSubtask()}>
                    <CloseIcon />
                </button>
            </div>
            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
        </div>
    )
}
