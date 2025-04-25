import { MagicCard } from "@/components/magicui/magic-card"
import { BASE_URL } from "@/constants"
import type { Icon } from "@/types/icons"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function IconCard({
	name,
	data: iconData,
	matchedAlias,
}: {
	name: string
	data: Icon
	matchedAlias?: string
}) {
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	// Construct URLs for both WebP and the original format
	const webpSrc = `${BASE_URL}/webp/${name}.webp`
	const originalSrc = `${BASE_URL}/${iconData.base}/${name}.${iconData.base}`

	const handleLoadingComplete = () => {
		setIsLoading(false)
		setHasError(false)
	}

	const handleError = () => {
		setIsLoading(false)
		setHasError(true)
	}

	return (
		<MagicCard className="rounded-md shadow-md">
			<Link prefetch={false} href={`/icons/${name}`} className="group flex flex-col items-center p-3 sm:p-4 cursor-pointer">
				<div className="relative h-16 w-16 mb-2 flex items-center justify-center">
					{isLoading && !hasError && (
						<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
					)}
					{hasError ? (
						<TooltipProvider delayDuration={300}>
							<Tooltip>
								<TooltipTrigger aria-label="Image loading error">
									<AlertTriangle className="h-8 w-8 text-red-500 cursor-help" />
								</TooltipTrigger>
								<TooltipContent side="bottom">
									<p>Image failed to load, likely due to size limits. Please raise an issue on GitHub.</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					) : (
						<picture>
							<source srcSet={webpSrc} type="image/webp" />
							<source srcSet={originalSrc} type={`image/${iconData.base === 'svg' ? 'svg+xml' : iconData.base}`} />
							<Image
								src={originalSrc}
								alt={`${name} icon`}
								fill
								className={`object-contain p-1 group-hover:scale-110 transition-transform duration-300 ${isLoading || hasError ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
								onLoadingComplete={handleLoadingComplete}
								onError={handleError}
							/>
						</picture>
					)}
				</div>
				<span className="text-xs sm:text-sm text-center truncate w-full capitalize group- dark:group-hover:text-primary transition-colors duration-200 font-medium">
					{name.replace(/-/g, " ")}
				</span>

				{matchedAlias && <span className="text-[10px] text-center truncate w-full mt-1">Alias: {matchedAlias}</span>}
			</Link>
		</MagicCard>
	)
}
