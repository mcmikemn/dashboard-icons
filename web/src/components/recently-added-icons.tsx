"use client"

import { BASE_URL } from "@/constants"
import type { IconWithName } from "@/types/icons"
import { format, isToday, isYesterday } from "date-fns"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Clock, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRef } from "react"

function formatIconDate(timestamp: string): string {
	const date = new Date(timestamp)
	if (isToday(date)) {
		return "Today"
	}
	if (isYesterday(date)) {
		return "Yesterday"
	}
	return format(date, "MMM d, yyyy")
}

export function RecentlyAddedIcons({ icons }: { icons: IconWithName[] }) {
	const { resolvedTheme } = useTheme()

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

	return (
		<div className="relative isolate overflow-hidden py-16 md:py-24">
			{/* Background glow */}
			<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-400/40 to-red-300/40 dark:from-red-600/50 dark:to-red-900/50 opacity-60 dark:opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<motion.div
					className="mx-auto max-w-2xl text-center mb-12"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8 }}
				>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-rose-500">
						Recently Added Icons
					</h2>
					<p className="mt-3 text-lg text-muted-foreground">Check out the latest additions to our collection.</p>
				</motion.div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-5">
					{icons.map(({ name, data }) => (
						<RecentIconCard key={name} name={name} data={data} getIconVariant={getIconVariant} />
					))}
				</div>

						<motion.div
					className="mt-12 text-center"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					<Link
						href="/icons"
						className="text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-medium inline-flex items-center py-2 px-4 rounded-full border border-rose-200 dark:border-rose-800/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 group hover-lift soft-shadow"
					>
						View all icons
						<ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
					</Link>
				</motion.div>
			</div>
		</div>
	)
}

// Extracted component for better animation handling
function RecentIconCard({ name, data, getIconVariant }: {
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
				className="group flex flex-col items-center p-3 sm:p-4 rounded-xl border border-border bg-background/95 dark:bg-background/80 hover:border-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-900/30 dark:hover:border-rose-500 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 relative overflow-hidden hover-lift"
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
				<div className="flex items-center justify-center mt-2 w-full">
					<span className="text-[10px] sm:text-xs text-muted-foreground flex items-center whitespace-nowrap group-hover:text-rose-500/70 transition-colors duration-200">
						<Clock className="w-3 h-3 mr-1.5 shrink-0" />
						{formatIconDate(data.update.timestamp)}
					</span>
				</div>

				<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<ExternalLink className="w-3 h-3 text-rose-500" />
				</div>
			</Link>
		</motion.div>
	);
}
