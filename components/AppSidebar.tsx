"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { Switch } from "./ui/switch"
import { Label } from "./ui/label"
import Moon from "@/public/icons/moon.svg";
import Image from "next/image";
import Sun from "@/public/icons/sun.svg";
import { useTheme } from "@/contexts/ThemeContext"
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLink from "./SidebarLink";
import { useBoardContext } from "@/contexts/BoardContext"



export interface NavLink {
    href: string,
    name: string
}

export default function AppSidebar() {

    const { state, toggleSidebar } = useSidebar();
    const { toggleTheme, theme } = useTheme();
    const { boards } = useBoardContext();
    const pathname = usePathname();

    const Links: NavLink[] =
        boards?.map((board) => ({
            href: `/dashboard/${board._id}`,
            name: board.name,
        })) ?? []

    console.log(pathname);



    return (
        <>
            <Sidebar
                className={`bg-sidebar static h-full  duration-300 ease-in-out transition-all overflow-hidden ${state === "expanded" ? "w-60  border-r border-sidebar-border/20 transition-all duration-200" : "w-0 p-0 transition-all  border-r-0"
                    }`}
            >
                <SidebarContent className="p-0 ">
                    {/* Main Navigation */}
                    <SidebarGroup className="p-0 m-0 pr-3">
                        <SidebarGroupLabel className="text-medium-gray pl-6">ALL BOARDS</SidebarGroupLabel>
                        <SidebarGroupContent >
                            <SidebarMenu>
                                {Links.map((link) =>
                                    <SidebarLink key={link.href} link={link} />
                                )}
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild className="hover:dark:bg-white hover:bg-primary/20 pl-6 rounded-l-none rounded-r-full m-0">
                                        <Link href="/" className="flex">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z" className="fill-primary" />
                                            </svg>
                                            <span className="text-primary">+ Create New board</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="p-3">
                    <SidebarMenu>
                        <SidebarMenuItem className="w-full flex gap-4 justify-center bg-sidebar-accent p-3 rounded-md">
                            <Label htmlFor="airplane-mode">
                                <Image src={Moon} alt="moon" width={20} height={20} className="cursor-pointer w-4 h-4" />
                            </Label>
                            <Switch
                                checked={theme === "dark"}
                                onCheckedChange={toggleTheme}
                                className="cursor-pointer data-[state=unchecked]:bg-primary" id="airplane-mode" />

                            <Label htmlFor="airplane-mode">
                                <Image src={Sun} alt="moon" width={20} height={20} className="cursor-pointer w-4 h-4" />
                            </Label>
                        </SidebarMenuItem>



                    </SidebarMenu>
                </SidebarFooter>

                <div className="mr-3">
                    <SidebarTrigger className="flex w-full justify-start duration-200 ease-in transition-colors hover:duration-200 p-4 mb-4 text-[#828FA3]   rounded-l-none rounded-r-full hover:text-primary" />
                </div>
            </Sidebar>


            {/* Sidebar Trigger Button */}
            <div className={`fixed left-0 bottom-4 group duration-300 bg-primary md:flex hidden hover:bg-primary/80 cursor-pointer rounded-r-2xl p-3 pl-4 ease-in-out transition-all ${state === "expanded" ? "-translate-x-full" : "-translate-x-1 hover:translate-x-0"}`
            } onClick={toggleSidebar}>

                <svg className="group-hover:-rotate-12 ease-in-out hover:duration-300 duration-300" xmlns="http://www.w3.org/2000/svg" width="16" height="11" viewBox="0 0 16 11" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.8154 4.43419C14.2491 1.77636 11.328 0 8 0C4.67056 0 1.75012 1.77761 0.184624 4.43419C-0.0615413 4.8519 -0.0615413 5.37033 0.184624 5.78805C1.75087 8.44585 4.67195 10.2222 8 10.2222C11.3294 10.2222 14.2499 8.4446 15.8154 5.78802C16.0615 5.37031 16.0615 4.85189 15.8154 4.43419ZM8 8.88887C5.91217 8.88887 4.22223 7.19924 4.22223 5.1111C4.22223 3.02327 5.91184 1.33333 8 1.33333C10.0878 1.33333 11.7778 3.02294 11.7778 5.1111C11.7778 7.19893 10.0882 8.88887 8 8.88887ZM8 7.99999C9.5955 7.99999 10.8889 6.7066 10.8889 5.1111C10.8889 3.51561 9.5955 2.22222 8 2.22222C7.50811 2.22222 7.04503 2.3453 6.63964 2.56211L6.64053 2.56208C7.2975 2.56208 7.83008 3.09466 7.83008 3.75163C7.83008 4.40858 7.2975 4.94116 6.64053 4.94116C5.98356 4.94116 5.45098 4.4086 5.45098 3.75163L5.451 3.75074C5.2342 4.15613 5.11112 4.61921 5.11112 5.1111C5.11112 6.7066 6.4045 7.99999 8 7.99999Z" fill="white" />
                </svg>

            </div >
        </>
    )
}
