"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, useAnimation, useInView } from "framer-motion";
import { DollarSign, Heart, Search, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AuroraText } from "./magicui/aurora-text";
import { InteractiveHoverButton } from "./magicui/interactive-hover-button";

interface IconCardProps {
	name: string;
	imageUrl: string;
}

function IconCard({ name, imageUrl }: IconCardProps) {
	return (
		<Card className="p-4 flex flex-col items-center gap-2 cursor-pointer group hover-lift card-hover">
			<div className="w-16 h-16 flex items-center justify-center">
				<img src={imageUrl} alt={name} className="max-w-full max-h-full" />
			</div>
			<p className="text-sm text-center text-muted-foreground group-hover:text-foreground transition-colors">
				{name}
			</p>
		</Card>
	);
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
	className?: string;
	delay?: number;
	width?: number;
	height?: number;
	rotate?: number;
	gradient?: string;
	mobileWidth?: number;
	mobileHeight?: number;
}) {
	const controls = useAnimation();
	const [isMobile, setIsMobile] = useState(false);
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.1 });

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	useEffect(() => {
		if (isInView) {
			controls.start({
				opacity: 1,
				y: 0,
				rotate: rotate,
				transition: {
					type: "spring",
					stiffness: 50,
					damping: 20,
					duration: 1.8,
					delay,
					ease: [0.23, 0.86, 0.39, 0.96],
					opacity: { duration: 1.2 },
				},
			});
		}
	}, [controls, delay, isInView, rotate]);

	return (
		<motion.div
			ref={ref}
			initial={{
				opacity: 0,
				y: -150,
				rotate: rotate - 15,
			}}
			animate={controls}
			className={cn("absolute will-change-transform", className)}
		>
			<motion.div
				animate={{
					y: [0, 15, 0],
				}}
				transition={{
					duration: 8 + Math.random() * 4, // Random duration between 8-12s for varied movement
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
					repeatType: "reverse",
				}}
				style={{
					width: isMobile && mobileWidth ? mobileWidth : width,
					height: isMobile && mobileHeight ? mobileHeight : height,
				}}
				className="relative will-change-transform"
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
	);
}

export function HeroSection({
	totalIcons,
	stars,
}: { totalIcons: number; stars: number }) {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="relative my-20 w-full flex items-center justify-center overflow-hidden">
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
					<Link
						prefetch
						href="https://github.com/homarr-labs"
						target="_blank"
						rel="noopener noreferrer"
						className="mx-auto"
					>
						<Card className="group p-2 px-4 flex flex-row items-center gap-2 border-2  z-10 relative glass-effect motion-safe:motion-preset-slide-up motion-duration-1500 hover:scale-105 transition-all duration-300">
							<Heart
								// Filled when hovered
								className="h-4 w-4 text-primary group-hover:fill-primary transition-all duration-300"
							/>
							<span className="text-sm text-foreground/70 tracking-wide">
								Made with love by Homarr Labs
							</span>
						</Card>
					</Link>

					<h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-8 tracking-tight motion-safe:motion-preset-slide-up motion-duration-1500">
						Your definitive source for
						<br />
						<AuroraText colors={["#FA5352", "#FA5352", "orange"]}>
							dashboard icons
						</AuroraText>
					</h1>

					<motion.div
						custom={2}
						className="motion-safe:motion-preset-slide-up motion-duration-1500"
					>
						<p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4">
							A collection of <span className="font-medium ">{totalIcons}</span>{" "}
							curated icons for services, applications and tools, designed
							specifically for dashboards and app directories.
						</p>
					</motion.div>

					<motion.div
						custom={3}
						className="flex flex-col items-center gap-4 md:gap-6 mb-8 md:mb-12 motion-safe:motion-preset-slide-up motion-duration-1500"
					>
						<form
							action="/icons"
							method="GET"
							className="relative w-full max-w-md group"
						>
							<Input
								name="q"
								autoFocus
								type="search"
								placeholder={`Find any of ${totalIcons} icons by name or category...`}
								className="pl-10 h-10 md:h-12 rounded-lg border-muted-foreground/20  focus:ring-rose-500/20 text-sm md:text-base"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 md:h-5 w-4 md:w-5 text-muted-foreground group-focus-within: transition-all duration-300" />
							<motion.span
								className="absolute inset-0 -z-10 rounded-lg bg-rose-500/5 opacity-0 transition-opacity group-hover:opacity-100"
								initial={{ scale: 0.95 }}
								whileHover={{ scale: 1 }}
								transition={{ duration: 0.2 }}
							/>
						</form>
						<div className="flex gap-3 md:gap-4 flex-wrap justify-center">
							<Link href="/icons">
								<InteractiveHoverButton className="rounded-md bg-input/30">
									Explore icons
								</InteractiveHoverButton>
							</Link>
							<Link
								href="https://github.com/homarr-labs/dashboard-icons"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center text-sm md:text-base"
							>
								<Button variant="outline" className="h-9 md:h-10 px-4" asChild>
									<div>
										<p>Give us a star</p>
										<Star className="h-4 w-4 ml-1 text-yellow-500 fill-yellow-500" />
										<span className="text-xs text-muted-foreground">
											{stars}
										</span>
									</div>
								</Button>
							</Link>
							{/* Give us money */}
							<Link href="https://github.com/sponsors/homarr-labs">
								<Button variant="outline" className="h-9 md:h-10 px-4" asChild>
									<div className="flex items-center gap-2">
										<p>Give us money</p>
										<DollarSign className="h-4 w-4 ml-1 text-yellow-500" />
									</div>
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</div>

			<div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none" />
		</div>
	);
}
