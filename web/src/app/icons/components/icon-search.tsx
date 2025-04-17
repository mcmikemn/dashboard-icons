"use client"

import { IconSubmissionContent } from "@/components/icon-submission-form"
import { Input } from "@/components/ui/input"
import { BASE_URL } from "@/constants"
import type { IconSearchProps } from "@/types/icons"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useInView } from "framer-motion"

export function IconSearch({ icons }: IconSearchProps) {
	const searchParams = useSearchParams()
	const initialQuery = searchParams.get("q")
	const router = useRouter()
	const pathname = usePathname()
	const [searchQuery, setSearchQuery] = useState(initialQuery ?? "")
	const timeoutRef = useRef<NodeJS.Timeout | null>(null)
	const { resolvedTheme } = useTheme()
	const [filteredIcons, setFilteredIcons] = useState(() => {
		if (!initialQuery?.trim()) return icons

		const q = initialQuery.toLowerCase()
		return icons.filter(({ name, data }) => {
			if (name.toLowerCase().includes(q)) return true
			if (data.aliases.some((alias) => alias.toLowerCase().includes(q))) return true
			if (data.categories.some((category) => category.toLowerCase().includes(q))) return true

			return false
		})
	})
	const filterIcons = useCallback(
		(query: string) => {
			if (!query.trim()) {
				return icons
			}

			const q = query.toLowerCase()
			return icons.filter(({ name, data }) => {
				if (name.toLowerCase().includes(q)) return true
				if (data.aliases.some((alias) => alias.toLowerCase().includes(q))) return true
				if (data.categories.some((category) => category.toLowerCase().includes(q))) return true

				return false
			})
		},
		[icons],
	)
	const updateResults = useCallback(
		(query: string) => {
			setFilteredIcons(filterIcons(query))
			const params = new URLSearchParams()
			if (query) params.set("q", query)

			const newUrl = query ? `${pathname}?${params.toString()}` : pathname

			router.push(newUrl, { scroll: false })
		},
		[filterIcons, pathname, router],
	)
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query)
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			timeoutRef.current = setTimeout(() => {
				updateResults(query)
			}, 100)
		},
		[updateResults],
	)
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	// Helper function to get the appropriate icon variant based on theme
	const getIconVariant = (name: string, data: any) => {
		// Check if the icon has theme variants and use appropriate one
		if (data.colors) {
			// If in dark mode and a light variant exists, use the light variant
			if (resolvedTheme === 'dark' && data.colors.light) {
				return data.colors.light;
			}
			// If in light mode and a dark variant exists, use the dark variant
			else if (resolvedTheme === 'light' && data.colors.dark) {
				return data.colors.dark;
			}
		}
		// Fall back to the default name if no appropriate variant
		return name;
	}

	if (!searchParams) return null

	return (
		<>
			<motion.div
				className="relative w-full sm:max-w-md"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-all duration-300" />
				<Input
					type="search"
					placeholder="Search icons by name, aliases, or categories..."
					className="w-full pl-8 cursor-text transition-all duration-300 text-sm md:text-base"
					value={searchQuery}
					onChange={(e) => handleSearch(e.target.value)}
				/>
			</motion.div>

			{filteredIcons.length === 0 ? (
				<motion.div
					className="flex flex-col gap-8 py-12 max-w-2xl mx-auto"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<div className="text-center">
						<h2 className="text-5xl font-semibold">We don't have this one...yet!</h2>
					</div>
					<IconSubmissionContent />
				</motion.div>
			) : (
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mt-8">
					{filteredIcons.map(({ name, data }, index) => (
						<IconCard key={name} name={name} data={data} getIconVariant={getIconVariant} />
					))}
				</div>
			)}
		</>
	)
}

function IconCard({ name, data, getIconVariant }: {
	name: string;
	data: any;
	getIconVariant: (name: string, data: any) => string;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, {
		once: false,
		amount: 0.2,
		margin: "100px 0px"
	});

	const variants = {
		hidden: { opacity: 0, y: 20, scale: 0.95 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.98,
			transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
		}
	};

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
				className="group flex flex-col items-center p-3 sm:p-4 rounded-lg border border-border bg-background/95 dark:bg-background/80 hover:border-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-900/30 dark:hover:border-rose-500 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 relative overflow-hidden"
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
			</Link>
		</motion.div>
	);
}
