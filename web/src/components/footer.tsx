"use client"

import { REPO_PATH } from "@/constants"
import { motion } from "framer-motion"
import { ExternalLink, Github, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-t py-12 bg-background relative overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-rose-500/[0.03] via-transparent to-rose-500/[0.03]" />

			<div className="container mx-auto px-4 md:px-6 relative z-10">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
					<motion.div
						className="flex flex-col gap-3"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						<h3 className="font-bold text-lg text-foreground/90">Dashboard Icons</h3>
						<p className="text-sm text-muted-foreground leading-relaxed">
							A collection of curated icons for services, applications and tools, designed specifically for dashboards and app directories.
						</p>
					</motion.div>

					<motion.div
						className="flex flex-col gap-3"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h3 className="font-bold text-lg text-foreground/90">Links</h3>
						<div className="flex flex-col gap-2">
							<Link
								href="/"
								className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200 flex items-center w-fit"
							>
								<span>Home</span>
							</Link>
							<Link
								href="/icons"
								className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200 flex items-center w-fit"
							>
								<span>Icons</span>
							</Link>
							<Link
								href={REPO_PATH}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground hover:text-rose-500 transition-colors duration-200 flex items-center gap-1.5 w-fit group"
							>
								<span>GitHub</span>
								<Github className="h-3.5 w-3.5 group-hover:text-rose-500 transition-colors duration-200 flex-shrink-0 self-center" />
							</Link>
						</div>
					</motion.div>

					<motion.div
						className="flex flex-col gap-3"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h3 className="font-bold text-lg text-foreground/90">Community</h3>
						<p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1.5 leading-relaxed">
							Made with <Heart className="h-3.5 w-3.5 text-rose-500 flex-shrink-0 animate-pulse" /> by Homarr Labs and the open source
							community.
						</p>
						<Link
							href="https://github.com/homarr-labs"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-rose-500 hover:text-rose-600 transition-colors duration-200 flex items-center gap-1.5 w-fit mt-1 group"
						>
							<span>Contribute to this project</span>
							<ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
						</Link>
					</motion.div>
				</div>

				<motion.div
					className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground/80"
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<p>© {new Date().getFullYear()} Homarr Labs. All rights reserved.</p>
				</motion.div>
			</div>
		</footer>
	)
}
