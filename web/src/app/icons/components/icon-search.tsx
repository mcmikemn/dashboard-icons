"use client"

import { IconSubmissionContent } from "@/components/icon-submission-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { BASE_URL } from "@/constants"
import { fuzzySearch } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Icon, IconSearchProps, IconWithName } from "@/types/icons"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { ArrowDownAZ, ArrowUpZA, Calendar, Filter, Search, SortAsc, X } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

type SortOption = "relevance" | "alphabetical-asc" | "alphabetical-desc" | "newest"

export function IconSearch({ icons }: IconSearchProps) {
	const searchParams = useSearchParams()
	const initialQuery = searchParams.get("q")
	const initialCategories = searchParams.getAll("category")
	const initialSort = (searchParams.get("sort") as SortOption) || "relevance"
	const router = useRouter()
	const pathname = usePathname()
	const [searchQuery, setSearchQuery] = useState(initialQuery ?? "")
	const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories ?? [])
	const [sortOption, setSortOption] = useState<SortOption>(initialSort)
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { resolvedTheme } = useTheme()

	// Extract all unique categories
	const allCategories = useMemo(() => {
		const categories = new Set<string>()
		for (const icon of icons) {
			for (const category of icon.data.categories) {
				categories.add(category)
			}
		}
		return Array.from(categories).sort()
	}, [icons])

	// Define filterIconsByQueryAndCategory BEFORE it's used in useState
	const filterIconsByQueryAndCategories = useCallback((iconList: typeof icons, query: string, categories: string[], sort: SortOption) => {
		let filtered = iconList

		// Apply category filters (if any are selected)
		if (categories.length > 0) {
			filtered = filtered.filter(({ data }) =>
				// Check if the icon has at least one of the selected categories
				data.categories.some((cat) => categories.some((selectedCat) => cat.toLowerCase() === selectedCat.toLowerCase())),
			)
		}

		// Create a scored version of icons for relevance and other sorting
		let scoredIcons: { icon: (typeof filtered)[0]; score: number; matchedAlias?: string }[] = []

		// Apply search query filter and calculate scores
		if (query.trim()) {
			scoredIcons = filtered.map((icon) => {
				// Calculate scores for different fields
				const nameScore = fuzzySearch(icon.name, query) * 1.5 // Give more weight to name matches

				// Find matching alias if any
				let matchedAlias: string | undefined = undefined
				let maxAliasScore = 0

				// Check each alias for a match
				if (icon.data.aliases.length > 0) {
					for (const alias of icon.data.aliases) {
						const aliasScore = fuzzySearch(alias, query) * 1.4
						if (aliasScore > maxAliasScore) {
							maxAliasScore = aliasScore
							matchedAlias = alias
						}
					}
				}

				// Get max score from categories
				const categoryScore =
					icon.data.categories.length > 0 ? Math.max(...icon.data.categories.map((category) => fuzzySearch(category, query))) : 0

				// Use the highest score
				const score = Math.max(nameScore, maxAliasScore, categoryScore)

				return {
					icon,
					score,
					matchedAlias: score === maxAliasScore && maxAliasScore > 0 ? matchedAlias : undefined,
				}
			})

			// Filter icons with a minimum score
			scoredIcons = scoredIcons.filter((item) => item.score > 0.2) // Minimum threshold

			// If we're using relevance sorting, apply it now
			if (sort === "relevance") {
				// Sort by score
				scoredIcons.sort((a, b) => b.score - a.score)
				return scoredIcons.map((item) => item.icon)
			}

			// Otherwise, we'll use the filtered results for other sorting methods
			filtered = scoredIcons.map((item) => item.icon)
		}

		// Apply sorting if not by relevance (which was already handled above)
		if (sort === "alphabetical-asc") {
			return filtered.sort((a, b) => a.name.localeCompare(b.name))
		}
		if (sort === "alphabetical-desc") {
			return filtered.sort((a, b) => b.name.localeCompare(a.name))
		}
		if (sort === "newest") {
			return filtered.sort((a, b) => {
				return new Date(b.data.update.timestamp).getTime() - new Date(a.data.update.timestamp).getTime()
			})
		}

		// Default alphabetical sort if no query or sort option not recognized
		return filtered.sort((a, b) => a.name.localeCompare(b.name))
	}, [])

	// Now use the function after it's been defined
	const [filteredIcons, setFilteredIcons] = useState(() => {
		return filterIconsByQueryAndCategories(icons, initialQuery ?? "", initialCategories ?? [], initialSort)
	})

	// Store matched aliases separately
	const [matchedAliases, setMatchedAliases] = useState<Record<string, string>>({})

	const updateResults = useCallback(
		(query: string, categories: string[], sort: SortOption) => {
			// Clear existing matched aliases
			setMatchedAliases({})

			// If we have a query, capture any matched aliases before filtering
			if (query.trim()) {
				const newMatches: Record<string, string> = {}
				const scoredResults = icons.map((icon) => {
					// Check for alias matches
					let bestAliasScore = 0
					let bestAlias = ""
					for (const alias of icon.data.aliases) {
						const score = fuzzySearch(alias, query) * 1.4
						if (score > bestAliasScore && score > 0.3) {
							// Only consider strong matches
							bestAliasScore = score
							bestAlias = alias
						}
					}

					// If the name match is weaker than alias match, store the alias
					const nameScore = fuzzySearch(icon.name, query) * 1.5
					if (bestAliasScore > nameScore && bestAliasScore > 0.3) {
						newMatches[icon.name] = bestAlias
					}

					return { icon }
				})

				// Update the matched aliases
				setMatchedAliases(newMatches)
			}

			// Continue with normal filtering
			setFilteredIcons(filterIconsByQueryAndCategories(icons, query, categories, sort))
			const params = new URLSearchParams()
			if (query) params.set("q", query)

			// Clear existing category params and add new ones
			for (const category of categories) {
				params.append("category", category)
			}

			// Add sort parameter if not default
			if (sort !== "relevance" || initialSort !== "relevance") {
				params.set("sort", sort)
			}

			const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
			router.push(newUrl, { scroll: false })
		},
		[filterIconsByQueryAndCategories, icons, pathname, router, initialSort],
	)

	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = setTimeout(() => {
				updateResults(query, selectedCategories, sortOption)
			}, 100)
		},
		[updateResults, selectedCategories, sortOption],
	)

	const handleCategoryChange = useCallback(
		(category: string) => {
			let newCategories: string[]

			if (selectedCategories.includes(category)) {
				// Remove the category if it's already selected
				newCategories = selectedCategories.filter((c) => c !== category)
			} else {
				// Add the category if it's not selected
				newCategories = [...selectedCategories, category]
			}

			setSelectedCategories(newCategories)
			updateResults(searchQuery, newCategories, sortOption)
		},
		[updateResults, searchQuery, selectedCategories, sortOption],
	)

	const handleSortChange = useCallback(
		(sort: SortOption) => {
			setSortOption(sort)
			updateResults(searchQuery, selectedCategories, sort)
		},
		[updateResults, searchQuery, selectedCategories],
	)

	const clearFilters = useCallback(() => {
		setSearchQuery("")
		setSelectedCategories([])
		setSortOption("relevance")
		updateResults("", [], "relevance")
	}, [updateResults])

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	// Helper function to get the appropriate icon variant based on theme
	const getIconVariant = (name: string, data: Icon) => {
		// Check if the icon has theme variants and use appropriate one
		if (data.colors) {
			// If in dark mode and a light variant exists, use the light variant
			if (resolvedTheme === "dark" && data.colors.light) {
				return data.colors.light
			}
			// If in light mode and a dark variant exists, use the dark variant
			if (resolvedTheme === "light" && data.colors.dark) {
				return data.colors.dark
			}
		}
		// Fall back to the default name if no appropriate variant
		return name
	}

	if (!searchParams) return null

	const getSortLabel = (sort: SortOption) => {
		switch (sort) {
			case "relevance":
				return "Best match"
			case "alphabetical-asc":
				return "A to Z"
			case "alphabetical-desc":
				return "Z to A"
			case "newest":
				return "Newest first"
			default:
				return "Sort"
		}
	}

	const getSortIcon = (sort: SortOption) => {
		switch (sort) {
			case "relevance":
				return <Search className="h-4 w-4" />
			case "alphabetical-asc":
				return <ArrowDownAZ className="h-4 w-4" />
			case "alphabetical-desc":
				return <ArrowUpZA className="h-4 w-4" />
			case "newest":
				return <Calendar className="h-4 w-4" />
			default:
				return <SortAsc className="h-4 w-4" />
		}
	}

	return (
		<>
			<motion.div
				className="space-y-4 w-full"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				{/* Search input */}
				<div className="relative w-full">
					<div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-all duration-300">
						<Search className="h-4 w-4" />
					</div>
					<Input
						type="search"
						placeholder="Search icons by name, alias, or category..."
						className="w-full h-10 pl-9 cursor-text transition-all duration-300 text-sm md:text-base bg-background/80 dark:bg-background/90 border-border shadow-sm hover:border-rose-500/50 focus-visible:ring-rose-500/20"
						value={searchQuery}
						onChange={(e) => handleSearch(e.target.value)}
					/>
				</div>

				{/* Filter and sort controls */}
				<div className="flex flex-wrap gap-2 justify-start">
					{/* Filter dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="flex-1 sm:flex-none cursor-pointer bg-background/80 dark:bg-background/90 border-border shadow-sm hover:bg-rose-500/10 dark:hover:bg-rose-900/20 hover:border-rose-500"
							>
								<Filter className="h-4 w-4 mr-2" />
								<span>Filter</span>
								{selectedCategories.length > 0 && (
									<Badge variant="secondary" className="ml-2 px-1.5">
										{selectedCategories.length}
									</Badge>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-64 sm:w-56">
							<DropdownMenuLabel className="font-semibold">Categories</DropdownMenuLabel>
							<DropdownMenuSeparator />

							<div className="max-h-[40vh] overflow-y-auto p-1">
								{allCategories.map((category) => (
									<DropdownMenuCheckboxItem
										key={category}
										checked={selectedCategories.includes(category)}
										onCheckedChange={() => handleCategoryChange(category)}
										className="cursor-pointer capitalize"
									>
										{category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
									</DropdownMenuCheckboxItem>
								))}
							</div>

							{selectedCategories.length > 0 && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={() => {
											setSelectedCategories([])
											updateResults(searchQuery, [], sortOption)
										}}
										className="cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/20"
									>
										Clear all filters
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Sort dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="flex-1 sm:flex-none cursor-pointer bg-background/80 dark:bg-background/90 border-border shadow-sm hover:bg-rose-500/10 dark:hover:bg-rose-900/20 hover:border-rose-500"
							>
								{getSortIcon(sortOption)}
								<span className="ml-2">{getSortLabel(sortOption)}</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-56">
							<DropdownMenuLabel className="font-semibold">Sort By</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => handleSortChange(value as SortOption)}>
								<DropdownMenuRadioItem value="relevance" className="cursor-pointer">
									<Search className="h-4 w-4 mr-2" />
									Best match
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="alphabetical-asc" className="cursor-pointer">
									<ArrowDownAZ className="h-4 w-4 mr-2" />A to Z
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="alphabetical-desc" className="cursor-pointer">
									<ArrowUpZA className="h-4 w-4 mr-2" />Z to A
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="newest" className="cursor-pointer">
									<Calendar className="h-4 w-4 mr-2" />
									Newest first
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Clear all button */}
					{(searchQuery || selectedCategories.length > 0 || sortOption !== "relevance") && (
						<Button
							variant="outline"
							size="sm"
							onClick={clearFilters}
							className="flex-1 sm:flex-none cursor-pointer bg-background/80 dark:bg-background/90 hover:bg-rose-500/10 dark:hover:bg-rose-900/20 border-rose-500/20"
						>
							<X className="h-4 w-4 mr-2" />
							<span>Clear all</span>
						</Button>
					)}
				</div>

				{/* Active filter badges */}
				{selectedCategories.length > 0 && (
					<div className="flex flex-wrap items-center gap-2 mt-2">
						<span className="text-sm text-muted-foreground">Filters:</span>
						<div className="flex flex-wrap gap-2">
							{selectedCategories.map((category) => (
								<Badge
									key={category}
									variant="secondary"
									className="flex items-center gap-1 pl-2 pr-1 bg-rose-500/10 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border border-rose-500/20"
								>
									{category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
									<Button
										variant="ghost"
										size="sm"
										className="h-4 w-4 p-0 hover:bg-transparent cursor-pointer"
										onClick={() => handleCategoryChange(category)}
									>
										<X className="h-3 w-3" />
									</Button>
								</Badge>
							))}
						</div>

						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setSelectedCategories([])
								updateResults(searchQuery, [], sortOption)
							}}
							className="text-xs h-7 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
						>
							Clear all
						</Button>
					</div>
				)}

				<Separator className="my-2" />
			</motion.div>

			{filteredIcons.length === 0 ? (
				<motion.div
					className="flex flex-col gap-8 py-12 max-w-2xl mx-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="text-center">
						<h2 className="text-3xl sm:text-5xl font-semibold">We don't have this one...yet!</h2>
						<p className="mt-4 text-muted-foreground">
							{searchQuery && selectedCategories.length > 0
								? `No icons found matching "${searchQuery}" with the selected filters.`
								: searchQuery
									? `No icons found matching "${searchQuery}".`
									: selectedCategories.length > 0
										? "No icons found with the selected filters."
										: "No icons found matching your criteria."}
						</p>
						<Button variant="outline" className="mt-4 cursor-pointer" onClick={clearFilters}>
							Clear all filters
						</Button>
					</div>
					<IconSubmissionContent />
				</motion.div>
			) : (
				<>
					<div className="flex justify-between items-center pb-2">
						<p className="text-sm text-muted-foreground">
							Found {filteredIcons.length} icon{filteredIcons.length !== 1 ? "s" : ""}.
						</p>
						<div className="flex items-center gap-1 text-xs text-muted-foreground">
							{getSortIcon(sortOption)}
							<span>{getSortLabel(sortOption)}</span>
						</div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-2">
						{filteredIcons.map(({ name, data }) => (
							<IconCard key={name} name={name} data={data} getIconVariant={getIconVariant} matchedAlias={matchedAliases[name] || null} />
						))}
					</div>
				</>
			)}
		</>
	)
}

function IconCard({
	name,
	data,
	getIconVariant,
	matchedAlias,
}: {
	name: string
	data: Icon
	getIconVariant: (name: string, data: Icon) => string
	matchedAlias?: string | null
}) {
	const ref = useRef(null)
	const isInView = useInView(ref, {
		once: false,
		amount: 0.2,
		margin: "100px 0px",
	})

	const variants = {
		hidden: { opacity: 0, y: 20, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] },
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.98,
			transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
		},
	}

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={isInView ? "visible" : "hidden"}
			exit="exit"
			variants={variants}
			className="will-change-transform"
		>
			<Link
				prefetch={false}
				href={`/icons/${name}`}
				className="group flex flex-col items-center p-3 sm:p-4 rounded-lg border border-border bg-background hover:border-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-900/30 dark:hover:border-rose-500 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 relative overflow-hidden cursor-pointer"
			>
				<div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

				<div className="relative h-12 w-12 sm:h-16 sm:w-16 mb-2">
					<Image
						src={`${BASE_URL}/${data.base}/${getIconVariant(name, data)}.${data.base}`}
						alt={`${name} icon`}
						fill
						className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
					/>
				</div>
				<span className="text-xs sm:text-sm text-center truncate w-full capitalize group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-200 font-medium">
					{name.replace(/-/g, " ")}
				</span>

				{matchedAlias && (
					<span className="text-[10px] text-center truncate w-full text-rose-500 dark:text-rose-400 mt-1">Alias: {matchedAlias}</span>
				)}
			</Link>
		</motion.div>
	)
}
