"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ImageIcon, Search } from "lucide-react"
import Link from "next/link"

interface CommandMenuProps {
	icons: string[]
	triggerButtonId?: string
	displayAsButton?: boolean
}

export function CommandMenu({ icons, triggerButtonId, displayAsButton = false }: CommandMenuProps) {
	const router = useRouter()
	const [open, setOpen] = React.useState(false)
	const [mounted, setMounted] = React.useState(false)
	const [inputValue, setInputValue] = React.useState("")
	const getFilteredIcons = React.useCallback(() => {
		const query = inputValue.toLowerCase().trim()
		if (!query) return icons.slice(0, 75)
		return icons.filter((icon) => {
			const iconName = icon.toLowerCase()
			if (iconName.includes(query)) return true
			const parts = query.split(/\s+/)
			let lastIndex = -1
			return parts.every((part) => {
				const index = iconName.indexOf(part, lastIndex + 1)
				if (index === -1) return false
				lastIndex = index
				return true
			})
		})
	}, [icons, inputValue])

	const filteredIcons = getFilteredIcons()

	React.useEffect(() => {
		setMounted(true)
	}, [])

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen((open) => !open)
			}
		}

		document.addEventListener("keydown", down)
		return () => document.removeEventListener("keydown", down)
	}, [])

	// Effect to connect to external trigger button
	React.useEffect(() => {
		if (!triggerButtonId || !mounted) return

		const triggerButton = document.getElementById(triggerButtonId)
		if (!triggerButton) return

		const handleClick = () => {
			setOpen(true)
		}

		triggerButton.addEventListener("click", handleClick)
		return () => triggerButton.removeEventListener("click", handleClick)
	}, [triggerButtonId, mounted])

	const handleInputChange = React.useCallback((value: string) => {
		setInputValue(value)
	}, [])

	const handleSelectIcon = React.useCallback(
		(iconName: string) => {
			router.push(`/icons/${iconName}`)
			setOpen(false)
		},
		[router],
	)

	if (!mounted) return null

	return (
		<CommandDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type to search icons..." value={inputValue} onValueChange={handleInputChange} />
			<CommandList className="max-h-[300px]">
				{filteredIcons.length === 0 && <CommandEmpty>No results found. Try a different search term.</CommandEmpty>}
				{filteredIcons.map((icon) => (
					<CommandItem key={icon} onSelect={() => handleSelectIcon(icon)} className="cursor-pointer">
						<Link prefetch={filteredIcons.length < 3} href={`/icons/${icon}`} className="flex items-center gap-2 w-full">
							<span className="text-rose-500">
								<ImageIcon className="h-4 w-4" />
							</span>
							<span className="capitalize">{icon.replace(/-/g, " ")}</span>
						</Link>
					</CommandItem>
				))}
			</CommandList>
		</CommandDialog>
	)
}
