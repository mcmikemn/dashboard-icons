import { BASE_URL } from "@/constants"
import { getIconsArray } from "@/lib/api"
import type { Metadata } from "next"
import { IconSearch } from "./components/icon-search"

export async function generateMetadata(): Promise<Metadata> {
	const icons = await getIconsArray()
	const totalIcons = icons.length

	return {
		title: "Browse Icons | Dashboard Icons",
		description: `Search and browse through our collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
		keywords: [
			"browse icons",
			"dashboard icons",
			"icon search",
			"service icons",
			"application icons",
			"tool icons",
			"web dashboard",
			"app directory",
		],
		openGraph: {
			title: "Browse Dashboard Icons Collection",
			description: `Search and browse through our collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
			type: "website",
			url: `${BASE_URL}/icons`,
			images: [
				{
					url: "/og-image.png",
					width: 1200,
					height: 630,
					alt: "Browse Dashboard Icons Collection",
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: "Browse Dashboard Icons Collection",
			description: `Search and browse through our collection of ${totalIcons} curated icons for services, applications and tools, designed specifically for dashboards and app directories.`,
			images: ["/og-image-browse.png"],
		},
		alternates: {
			canonical: `${BASE_URL}/icons`,
		},
	}
}

export const dynamic = "force-static"

export default async function IconsPage() {
	const icons = await getIconsArray()
	return (
		<div className="relative isolate overflow-hidden">
			{/* Main background glow */}
			<div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
				<div
					className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-rose-400/50 to-red-300/50 dark:from-red-600/60 dark:to-red-900/60 opacity-50 dark:opacity-50 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			{/* Secondary glow */}
			<div
				className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
				aria-hidden="true"
			>
				<div
					className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-300/50 to-rose-500/50 dark:from-red-700/40 dark:to-red-500/40 opacity-50 dark:opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
					style={{
						clipPath:
							"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
					}}
				/>
			</div>

			<div className="py-8">
				<div className="space-y-4 mb-8 mx-auto max-w-[80vw] relative">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold">Browse icons</h1>
							<p className="text-muted-foreground">Search through our collection of {icons.length} beautiful icons.</p>
						</div>
					</div>

					<IconSearch icons={icons} />
				</div>
			</div>
		</div>
	)
}
