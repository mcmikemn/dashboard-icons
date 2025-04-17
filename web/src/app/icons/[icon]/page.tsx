import { IconDetails } from "@/components/icon-details"
import { BASE_URL } from "@/constants"
import { getAllIcons, getAuthorData, getTotalIcons } from "@/lib/api"
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = false

export async function generateStaticParams() {
	const iconsData = await getAllIcons()
	return Object.keys(iconsData).map((icon) => ({
		icon,
	}))
}

export const dynamic = "force-static"

type Props = {
	params: Promise<{ icon: string }>
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: Props, parent: ResolvingMetadata): Promise<Metadata> {
	const { icon } = await params
	const iconsData = await getAllIcons()
	if (!iconsData[icon]) {
		notFound()
	}
	const previousImages = (await parent).openGraph?.images || []
	const authorData = await getAuthorData(iconsData[icon].update.author.id)
	const authorName = authorData.name || authorData.login
	const updateDate = new Date(iconsData[icon].update.timestamp)
	const totalIcons = Object.keys(iconsData).length

	console.debug(`Generated metadata for ${icon} by ${authorName} (${authorData.html_url}) updated at ${updateDate.toLocaleString()}`)

	const iconImageUrl = `${BASE_URL}/png/${icon}.png`
	const pageUrl = `${BASE_URL}/icons/${icon}`
	const formattedIconName = icon
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	return {
		title: `${formattedIconName} Icon | Dashboard Icons`,
		description: `Download the ${formattedIconName} icon in SVG, PNG, and WEBP formats. Part of a collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
		keywords: [
			`${formattedIconName} icon`,
			"dashboard icon",
			"service icon",
			"application icon",
			"tool icon",
			"web dashboard",
			"app directory",
		],
		authors: [
			{
				name: "homarr",
				url: "https://homarr.dev",
			},
			{
				name: authorName,
				url: authorData.html_url,
			},
		],
		openGraph: {
			title: `${formattedIconName} Icon | Dashboard Icons`,
			description: `Download the ${formattedIconName} icon in SVG, PNG, and WEBP formats. Part of a collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
			type: "article",
			url: pageUrl,
			images: [
				{
					url: iconImageUrl,
					width: 512,
					height: 512,
					alt: `${formattedIconName} Icon`,
					type: "image/png",
				},
				...previousImages,
			],
			authors: [authorName, "homarr"],
			publishedTime: updateDate.toISOString(),
			modifiedTime: updateDate.toISOString(),
		},
		twitter: {
			card: "summary_large_image",
			title: `${formattedIconName} Icon | Dashboard Icons`,
			description: `Download the ${formattedIconName} icon in SVG, PNG, and WEBP formats. Part of a collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
			images: [iconImageUrl],
			creator: "@homarr_app",
		},
		alternates: {
			canonical: pageUrl,
		},
	}
}

export default async function IconPage({ params }: { params: Promise<{ icon: string }> }) {
	const { icon } = await params
	const iconsData = await getAllIcons()
	const originalIconData = iconsData[icon]

	if (!originalIconData) {
		notFound()
	}

	// Fetch total icons
	const { totalIcons } = await getTotalIcons()
	// Format icon name
	const formattedIconName = icon
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")

	const authorData = await getAuthorData(originalIconData.update.author.id)

	return (
		<div className="relative isolate overflow-hidden pt-14">
			{/* Background glow effect */}
			<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-400/50 to-red-300/50 dark:from-red-600/70 dark:to-red-900/70 opacity-50 dark:opacity-60 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			{/* Secondary glow for additional effect */}
			<div
				className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				aria-hidden="true"
			>
				<div
					className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-300/50 to-rose-500/50 dark:from-red-700/50 dark:to-red-500/50 opacity-50 dark:opacity-50 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			{/* Additional central glow */}
			<div className="absolute inset-x-0 top-1/2 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
				<div
					className="relative left-[calc(50%)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-rose-300/50 to-red-400/50 dark:from-red-800/40 dark:to-red-600/40 opacity-50 dark:opacity-40 sm:w-[50.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			{/* Title and Description Section */}
			<div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 text-center">
				<h1 className="text-2xl md:text-4xl font-bold tracking-tight text-foreground sm:text-6xl">{formattedIconName} Icon</h1>
				<p className="mt-3 md:mt-6 text-sm md:text-lg leading-6 md:leading-8 text-muted-foreground">
					Part of a collection of {totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and
					app directories.
				</p>
			</div>

			{/* Existing Icon Details */}
			<IconDetails icon={icon} iconData={originalIconData} authorData={authorData} />
		</div>
	)
}
