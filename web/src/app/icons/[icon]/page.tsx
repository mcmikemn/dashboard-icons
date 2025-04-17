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
				}
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

	const authorData = await getAuthorData(originalIconData.update.author.id)

	return (
		<div className="relative isolate overflow-hidden pt-14">
			{/* Existing Icon Details */}
			<IconDetails icon={icon} iconData={originalIconData} authorData={authorData} />
		</div>
	)
}
