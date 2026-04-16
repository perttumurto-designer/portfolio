"use client"

import { useLottie } from "lottie-react"
import logoLottieLight from "@/data/logo-lottie-light.json"
import logoLottieDark from "@/data/logo-lottie-dark.json"

interface LogoLottieProps {
  isDark: boolean
}

export function LogoLottie({ isDark }: LogoLottieProps) {
  const { View } = useLottie({
    animationData: isDark ? logoLottieDark : logoLottieLight,
    loop: true,
  })

  return <div className="h-[26px] w-[57px] shrink-0">{View}</div>
}
