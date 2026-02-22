import AddNewTaskDialog from "./AddTaskDialog";
import MoreOptions from "./MoreOptions";

export default function AddTaskBtn() {
    return (
        <div className="flex gap-4 items-center">
            <AddNewTaskDialog />

            <MoreOptions />
        </div>
    )
}
