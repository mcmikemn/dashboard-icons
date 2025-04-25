import { MagicCard } from "@/components/magicui/magic-card"
import { BASE_URL } from "@/constants"
import type { Icon } from "@/types/icons"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

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

	// Construct URLs for both WebP and the original format
	const webpSrc = `${BASE_URL}/webp/${name}.webp`
	const originalSrc = `${BASE_URL}/${iconData.base}/${name}.${iconData.base}`

	return (
		<MagicCard className="rounded-md shadow-md">
			<Link prefetch={false} href={`/icons/${name}`} className="group flex flex-col items-center p-3 sm:p-4 cursor-pointer">
				<div className="relative h-16 w-16 mb-2">
					{isLoading && (
						<div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
					)}
					{/* Use <picture> tag for WebP support with fallback */}
					<picture>
						<source srcSet={webpSrc} type="image/webp" />
						<source srcSet={originalSrc} type={`image/${iconData.base === 'svg' ? 'svg+xml' : iconData.base}`} />
						{/* next/image as the img fallback and for optimization */}
						<Image
							src={originalSrc} // Fallback src for next/image
							alt={`${name} icon`}
							fill
							className={`object-contain p-1 group-hover:scale-110 transition-transform duration-300 ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
							onLoadingComplete={() => setIsLoading(false)}
							// Add sizes prop for responsive optimization if needed, e.g.,
							// sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 16.6vw"
						/>
					</picture>
				</div>
				<span className="text-xs sm:text-sm text-center truncate w-full capitalize group- dark:group-hover:text-primary transition-colors duration-200 font-medium">
					{name.replace(/-/g, " ")}
				</span>

				{matchedAlias && <span className="text-[10px] text-center truncate w-full mt-1">Alias: {matchedAlias}</span>}
			</Link>
		</MagicCard>
	)
}
