"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"

export function ThemeSwitcher() {
	const { setTheme } = useTheme()
	const [open, setOpen] = useState(false)

	return (
		<TooltipProvider>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button
								className="rounded-md cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-900/30 transition-colors duration-200 group"
								variant="ghost"
								size="icon"
							>
								<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-rose-500" />
								<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-rose-500" />
								<span className="sr-only">Toggle theme</span>
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent side="bottom">
						<p>Change theme</p>
					</TooltipContent>
				</Tooltip>
				<DropdownMenuContent align="end">
					<DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
						Light
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</TooltipProvider>
	)
}
