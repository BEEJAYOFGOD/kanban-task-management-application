import AddNewColumnBtn from "./AddNewColumnBtn";

export default function DashboardEmpty() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full  space-y-4">
            <h1>This board is empty. Create a new column to get started.</h1>
            <AddNewColumnBtn />
        </div>
    )
}
