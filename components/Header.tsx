import Image from "next/image";
import logo from "@/public/icons/logo.png"
import options from "@/public/icons/headeroptions.png"

export default function Header() {


    return (
        <nav className="flex justify-between">
            <div className="flex p-4 gap-4 w-50 border-r-line border-r">
                <Image height="20" width="20" src={logo} alt="kanban logo" />
                <p>Kanban</p>
            </div>
            <div className="flex p-4 flex-1 justify-between border-line border">
                <h1>Board Name</h1>

                <div className="flex gap-4 items-center">
                    <button>+ Add New Task</button>
                    <div className="cursor-pointer">
                        <Image height="8" width="8" className="w-1 " src={options} alt="kanban logo" />
                    </div>
                </div>

            </div>
        </nav>
    )
}
