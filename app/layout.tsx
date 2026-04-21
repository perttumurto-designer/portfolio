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
  src: [
    { path: "../public/fonts/HelveticaNowDisplay-Hairline.woff2",  weight: "100", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Thin.woff2",      weight: "200", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-ExtLt.woff2",     weight: "250", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Light.woff2",     weight: "300", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Regular.woff2",   weight: "400", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Medium.woff2",    weight: "500", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Bold.woff2",      weight: "700", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-Black.woff2",     weight: "900", style: "normal" },
    { path: "../public/fonts/HelveticaNowDisplay-ExtBlk.woff2",    weight: "950", style: "normal" },
  ],
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
