"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { motion, useAnimation } from "framer-motion"
import { Circle, Github, Heart, Search, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface IconCardProps {
	name: string
	imageUrl: string
}

function IconCard({ name, imageUrl }: IconCardProps) {
	return (
		<Card className="p-4 hover:shadow-md transition-shadow duration-300 flex flex-col items-center gap-2 cursor-pointer group">
			<div className="w-16 h-16 flex items-center justify-center">
				<img src={imageUrl} alt={name} className="max-w-full max-h-full" />
			</div>
			<p className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">{name}</p>
		</Card>
	)
}

function ElegantShape({
	className,
	delay = 0,
	width = 400,
	height = 100,
	rotate = 0,
	gradient = "from-rose-500/[0.5]",
	mobileWidth,
	mobileHeight,
}: {
	className?: string
	delay?: number
	width?: number
	height?: number
	rotate?: number
	gradient?: string
	mobileWidth?: number
	mobileHeight?: number
}) {
	const controls = useAnimation()
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768)
		}
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	return (
		<motion.div
			initial={{
				opacity: 0,
				y: -150,
				rotate: rotate - 15,
			}}
			animate={{
				opacity: 1,
				y: 0,
				rotate: rotate,
			}}
			transition={{
				duration: 2.4,
				delay,
				ease: [0.23, 0.86, 0.39, 0.96],
				opacity: { duration: 1.2 },
			}}
			className={cn("absolute", className)}
		>
			<motion.div
				animate={{
					y: [0, 15, 0],
				}}
				transition={{
					duration: 12,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
				style={{
					width: isMobile && mobileWidth ? mobileWidth : width,
					height: isMobile && mobileHeight ? mobileHeight : height,
				}}
				className="relative"
			>
				<div
					className={cn(
						"absolute inset-0 rounded-full",
						"bg-gradient-to-r from-rose-500/[0.6] via-rose-500/[0.4] to-rose-500/[0.1]",
						gradient,
						"backdrop-blur-[3px]",
						"shadow-[0_0_40px_0_rgba(244,63,94,0.35),inset_0_0_0_1px_rgba(244,63,94,0.2)]",
						"after:absolute after:inset-0 after:rounded-full",
						"after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]",
					)}
				/>
			</motion.div>
		</motion.div>
	)
}

export function HeroSection({ totalIcons }: { totalIcons: number }) {
	const [searchQuery, setSearchQuery] = useState("")

	const fadeUpVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				duration: 1,
				delay: 0.5 + i * 0.2,
				ease: [0.25, 0.4, 0.25, 1],
			},
		}),
	}

	return (
		<div className="relative pt-20 md:pt-40 pb-10 md:pb-20 w-full flex items-center justify-center overflow-hidden bg-background">
			<div className="absolute inset-0 bg-gradient-to-br from-rose-500/[0.1] via-transparent to-rose-500/[0.1] blur-3xl" />

			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<ElegantShape
					delay={0.3}
					width={600}
					height={140}
					mobileWidth={300}
					mobileHeight={80}
					rotate={12}
					gradient="from-rose-500/[0.6]"
					className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
				/>

				<ElegantShape
					delay={0.5}
					width={500}
					height={120}
					mobileWidth={250}
					mobileHeight={70}
					rotate={-15}
					gradient="from-rose-500/[0.55]"
					className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
				/>

				<ElegantShape
					delay={0.4}
					width={300}
					height={80}
					mobileWidth={150}
					mobileHeight={50}
					rotate={-8}
					gradient="from-rose-500/[0.65]"
					className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
				/>

				<ElegantShape
					delay={0.6}
					width={200}
					height={60}
					mobileWidth={100}
					mobileHeight={40}
					rotate={20}
					gradient="from-rose-500/[0.58]"
					className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
				/>

				<ElegantShape
					delay={0.7}
					width={150}
					height={40}
					mobileWidth={80}
					mobileHeight={30}
					rotate={-25}
					gradient="from-rose-500/[0.62]"
					className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
				/>
			</div>

			<div className="relative z-10 container mx-auto px-4 md:px-6">
				<div className="max-w-4xl mx-auto text-center flex flex-col gap-4">
					<Link prefetch href="https://github.com/homarr-labs" target="_blank" rel="noopener noreferrer" className="mx-auto">
						<motion.div variants={fadeUpVariants} custom={0} initial="hidden" animate="visible" whileHover="hover">
							<motion.div
								className="overflow-hidden rounded-md relative"
								variants={{
									hover: {
										scale: 1.05,
										boxShadow: "0 10px 20px rgba(244, 63, 94, 0.15)",
									},
								}}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 17,
								}}
							>
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-fuchsia-500/10 to-rose-500/10 opacity-0 z-0"
									variants={{
										hover: {
											opacity: 1,
											backgroundPosition: ["0% 0%", "100% 100%"],
										},
									}}
									transition={{
										duration: 1.5,
										ease: "easeInOut",
										backgroundPosition: {
											repeat: Number.POSITIVE_INFINITY,
											duration: 3,
										},
									}}
								/>
								<Card className="p-2 flex flex-row items-center gap-2 border-rose-200 dark:border-rose-900/30 shadow-sm bg-background z-10 relative">
									<motion.div
										variants={{
											hover: {
												scale: [1, 1.2, 1],
												rotate: [0, 5, -5, 0],
											},
										}}
										transition={{
											duration: 0.6,
											repeat: Number.POSITIVE_INFINITY,
											repeatType: "reverse",
										}}
									>
										<Heart className="h-4 w-4 text-rose-500" />
									</motion.div>
									<span className="text-sm text-foreground/70 tracking-wide">Made with love by Homarr Labs</span>
								</Card>
							</motion.div>
						</motion.div>
					</Link>

					<motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
						<h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-8 tracking-tight">
							<span className="text-foreground relative inline-block">
								Your definitive source for
								<motion.span
									className="absolute -right-4 sm:-right-6 md:-right-8 -top-3 sm:-top-4 md:-top-6 text-rose-500"
									animate={{ rotate: [0, 15, 0] }}
									transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
								>
									<Sparkles className="h-4 w-4 sm:h-5 sm:w-5 md:h-8 md:w-8" />
								</motion.span>
							</span>
							<br />
							<motion.span
								className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-fuchsia-500 to-rose-500 bg-[length:200%] relative inline-block"
								animate={{
									backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
									textShadow: ["0 0 10px rgba(244,63,94,0.3)", "0 0 20px rgba(244,63,94,0.5)", "0 0 10px rgba(244,63,94,0.3)"],
								}}
								transition={{
									duration: 8,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							>
								dashboard icons.
							</motion.span>
						</h1>
					</motion.div>

					<motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
						<p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
							A collection of <span className="font-medium text-rose-500">{totalIcons}</span> curated icons for services, applications and
							tools, designed specifically for dashboards and app directories.
						</p>
					</motion.div>

					<motion.div
						custom={3}
						variants={fadeUpVariants}
						initial="hidden"
						animate="visible"
						className="flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12"
					>
						<form action="/icons" method="GET" className="relative w-full max-w-md group">
							<Input
								name="q"
								type="search"
								placeholder={`Search ${totalIcons} icons...`}
								className="pl-10 h-10 md:h-12 rounded-lg border-muted-foreground/20 focus:border-rose-500 focus:ring-rose-500/20 transition-all"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground group-focus-within:text-rose-500 transition-colors" />
							<motion.span
								className="absolute inset-0 -z-10 rounded-lg bg-rose-500/5 opacity-0 transition-opacity group-hover:opacity-100"
								initial={{ scale: 0.95 }}
								whileHover={{ scale: 1 }}
								transition={{ duration: 0.2 }}
							/>
						</form>
						<div className="flex gap-3 md:gap-4 flex-wrap justify-center">
							<Button variant="default" className="h-9 md:h-10 px-4 gap-2 bg-rose-500 hover:bg-rose-600 text-white" asChild>
								<Link href="/icons" className="flex items-center text-sm md:text-base">
									Browse all icons
								</Link>
							</Button>
							<Button
								variant="outline"
								className="h-9 md:h-10 px-4 gap-2 border-rose-200 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-800"
								asChild
							>
								<Link
									href="https://github.com/homarr-labs/dashboard-icons"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center text-sm md:text-base"
								>
									GitHub
									<Github className="h-4 w-4 ml-1" />
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
		</div>
	)
}
