import type React from "react"
import type { Metadata } from "next"
import { Inter, Archivo_Black } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
})

export const metadata: Metadata = {
  title: "Defense IQ",
  description: "Learn basketball defensive strategies through interactive lessons",
    generator: 'Columbia University - UI Design Final Project'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${archivoBlack.variable} font-sans`}>{children}</body>
    </html>
  )
}
