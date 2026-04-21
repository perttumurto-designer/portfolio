import { Geist_Mono, Inter, JetBrains_Mono } from "next/font/google"
import localFont from "next/font/local"
import Script from "next/script"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const jetbrainsMonoHeading = JetBrains_Mono({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const helveticaNowDisplay = localFont({
  src: "../public/fonts/HelveticaNowDisplay-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-display",
  display: "swap",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, jetbrainsMonoHeading.variable, helveticaNowDisplay.variable)}
    >
      <body>
        <Script src="/simpleBackground.js" strategy="afterInteractive" />
        <ThemeProvider>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
