"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import InstallPWA from "./InstallPWA"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full fixed z-40 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white shadow-sm"
      }`}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo and App Name */}
          <Link href="/home">
            <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <div className="relative h-9 w-9 overflow-hidden">
                <div className="absolute inset-0">
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center">
                    <Image src="/images/logo.png" width={40} height={40} alt="Tamarind House" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col mt-1">
                <h1 className="text-lg font-bold text-th-dark-green leading-tight">Tamarind House</h1>
                <span className="text-[10px] text-th-medium-green leading-tight -mt-1 ml-1">Food Token System</span>
              </div>
            </motion.div>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* PWA Install Button */}
            <InstallPWA variant="icon" />

            {/* Refresh Button */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9 text-th-medium-green"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh Page"
              >
                <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
