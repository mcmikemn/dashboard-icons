"use client"

import { IconSubmissionForm } from "@/components/icon-submission-form"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { REPO_PATH } from "@/constants"
import { getIconsArray } from "@/lib/api"
import type { IconWithName } from "@/types/icons"
import { motion } from "framer-motion"
import { Github, Menu, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { CommandMenu } from "./command-menu"
import { HeaderNav } from "./header-nav"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export function Header() {
	const [iconsData, setIconsData] = useState<IconWithName[]>([])
	const [isLoaded, setIsLoaded] = useState(false)
	const [commandMenuOpen, setCommandMenuOpen] = useState(false)

	useEffect(() => {
		async function loadIcons() {
			try {
				const icons = await getIconsArray()
				setIconsData(icons)
				setIsLoaded(true)
			} catch (error) {
				console.error("Failed to load icons:", error)
				setIsLoaded(true)
			}
		}

		loadIcons()
	}, [])

	// Function to open the command menu
	const openCommandMenu = () => {
		setCommandMenuOpen(true)
	}

	return (
		<motion.header
			className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-md border-border/50"
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
		>
			<div className="px-4 md:px-12 flex items-center justify-between h-16 md:h-18">
				<div className="flex items-center gap-2 md:gap-6">
					<Link href="/" className="text-lg md:text-xl font-bold group">
						<span className="transition-colors duration-300 group-hover:text-rose-500">Dashboard Icons</span>
					</Link>
					<div className="hidden md:block">
						<HeaderNav />
					</div>
				</div>
				<div className="flex items-center gap-2 md:gap-4">
					{/* Desktop search button */}
					<div className="hidden md:block">
						<Button
							variant="outline"
							className="gap-2 cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-900/30 hover:border-rose-500 dark:hover:border-rose-500 transition-all duration-300"
							onClick={openCommandMenu}
						>
							<Search className="h-4 w-4 transition-all duration-300" />
							<span>Find icons</span>
							<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/80 bg-muted/80 px-1.5 font-mono text-[10px] font-medium opacity-100">
								<span className="text-xs">⌘</span>K
							</kbd>
						</Button>
					</div>

					{/* Mobile search button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							className="rounded-lg cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-900/30 transition-all duration-300 focus:ring-2 focus:ring-rose-500/20"
							onClick={openCommandMenu}
						>
							<Search className="h-5 w-5 transition-all duration-300" />
							<span className="sr-only">Find icons</span>
						</Button>
					</div>

					<div className="hidden md:flex items-center gap-2 md:gap-4">
						<IconSubmissionForm />
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="rounded-lg cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-900/30 transition-all duration-300 focus:ring-2 focus:ring-rose-500/20"
										asChild
									>
										<Link href={REPO_PATH} target="_blank" className="group">
											<Github className="h-5 w-5 group-hover:text-rose-500 transition-all duration-300" />
											<span className="sr-only">View on GitHub</span>
										</Link>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>View on GitHub</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<ThemeSwitcher />

					{/* Mobile menu */}
					<div className="md:hidden">
						<Sheet>
							<SheetTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="h-10 w-10 rounded-full cursor-pointer hover:bg-rose-500/10 dark:hover:bg-rose-900/30 transition-all duration-300 focus:ring-2 focus:ring-rose-500/20"
								>
									<Menu className="h-5 w-5 transition-all duration-300" />
									<span className="sr-only">Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
								<div className="flex flex-col h-full py-6">
									<div className="px-6 mb-6">
										<h2 className="text-xl font-bold text-rose-500">Dashboard Icons</h2>
									</div>

									<div className="flex-1 overflow-auto px-6">
										<nav className="space-y-6">
											<HeaderNav />
											<div className="border-t pt-6" />
											<Button
												variant="outline"
												size="sm"
												className="text-sm h-8 rounded-md cursor-pointer flex items-center gap-2 bg-background border-border hover:bg-rose-500/10 hover:text-rose-500 w-full justify-start transition-all duration-300"
												onClick={openCommandMenu}
											>
												<Search className="h-3.5 w-3.5 transition-all duration-300" />
												<span>Find and filter icons</span>
											</Button>
											<IconSubmissionForm />
											<Link
												href={REPO_PATH}
												target="_blank"
												className="flex items-center gap-2 text-sm font-medium text-rose-500 hover:text-rose-600 transition-all duration-300 cursor-pointer p-2 hover:bg-rose-500/5 rounded-md"
											>
												<Github className="h-4 w-4 transition-all duration-300" />
												GitHub Repository
											</Link>
										</nav>
									</div>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</div>

			{/* Single instance of CommandMenu */}
			{isLoaded && <CommandMenu icons={iconsData} open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />}
		</motion.header>
	)
}
