import { BASE_URL } from "@/constants"
import { getAllIcons } from "@/lib/api"
import { ImageResponse } from "next/og"

export const dynamic = "force-static"

export async function generateStaticParams() {
	const iconsData = await getAllIcons()
	return Object.keys(iconsData).map((icon) => ({
		icon,
	}))
}

export const size = {
	width: 1200,
	height: 630,
}
export default async function Image({ params }: { params: { icon: string } }) {
	const { icon } = params
	const iconsData = await getAllIcons()
	const totalIcons = Object.keys(iconsData).length
	const index = Object.keys(iconsData).indexOf(icon)
	let iconUrl = `${BASE_URL}/png/${icon}.png`
	console.log(`Generating opengraph image for ${icon} (${index + 1} / ${totalIcons}) with url ${iconUrl}`)

	// Format the icon name for display
	const formattedIconName = icon
	.split("-")
	.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
	.join(" ")
	
	// Get the icon URL
	// Check if the image exists if the return type of the image is of image type
  try {
		const response = await fetch(iconUrl) 
		if (!response.ok) {
			console.error(`Icon ${icon} was not found at ${iconUrl}`)
			iconUrl = `https://placehold.co/600x400?text=${formattedIconName}`
		}
	} catch (error) {
		console.error(`Icon ${icon} was not found at ${iconUrl}`)
		iconUrl = `https://placehold.co/600x400?text=${formattedIconName}`
	}
	

	return new ImageResponse(
		<div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        position: "relative",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background with gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
          zIndex: 0,
        }}
      />

      {/* Subtle pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      {/* Decorative elements */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
          filter: "blur(80px)",
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -150,
          right: -150,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.1) 100%)",
          filter: "blur(100px)",
          zIndex: 2,
        }}
      />

      {/* Content container - horizontal layout */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "60px",
          gap: "70px",
          zIndex: 10,
        }}
      >
        {/* Left side - Icon container with enhanced styling */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 320,
            height: 320,
            borderRadius: 32,
            background: "white",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            padding: 30,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle gradient in icon background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
              zIndex: 0,
            }}
          />

          {/* Icon image */}
          <img
            src={iconUrl || "/placeholder.svg"}
            alt={formattedIconName}
            width={260}
            height={260}
            style={{
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))",
            }}
          />
        </div>

        {/* Right side - Text content with improved typography */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 28,
            maxWidth: 650,
          }}
        >
          {/* Main title with enhanced styling */}
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Download {formattedIconName} icon for free
          </div>

          {/* Subtitle with improved styling */}
          <div
            style={{
              display: "flex",
              fontSize: 32,
              fontWeight: 500,
              color: "#64748b",
              lineHeight: 1.4,
              position: "relative",
              paddingLeft: 16,
              borderLeft: "4px solid #94a3b8",
            }}
          >
            Amongst {totalIcons.toLocaleString()} other high-quality dashboard icons
          </div>

          {/* Format badges */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 8,
            }}
          >
            {["SVG", "PNG", "WEBP"].map((format) => (
              <div
                key={format}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  borderRadius: 12,
                  padding: "8px 16px",
                  fontSize: 18,
                  fontWeight: 600,
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
              >
                {format}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with enhanced branding */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            color: "#334155",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              marginRight: 4,
            }}
          />
          dashboardicons.com
        </div>
      </div>
    </div>,
		{
			...size,
		},
	)
}
