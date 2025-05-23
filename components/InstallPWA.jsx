"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowBigDownDash, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function InstallPWA({
    variant = "button",
    className = "",
    showText = true,
    text = "Install App",
    iconOnly = false,
}) {
    const [deferredPrompt, setDeferredPrompt] = useState(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isInstalling, setIsInstalling] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    // Handle PWA installation
    useEffect(() => {
        // Check if app is already installed
        const checkIfInstalled = () => {
            if (window.matchMedia("(display-mode: standalone)").matches) {
                setIsInstalled(true)
                return
            }

            // Check for iOS standalone mode
            if ((window.navigator).standalone === true) {
                setIsInstalled(true)
                return
            }

            // Check if running in TWA (Trusted Web Activity)
            if (document.referrer.includes("android-app://")) {
                setIsInstalled(true)
                return
            }
        }

        // Check if device is iOS
        const checkIfIOS = () => {
            const userAgent = window.navigator.userAgent.toLowerCase()
            return /iphone|ipad|ipod/.test(userAgent)
        }

        checkIfInstalled()
        setIsIOS(checkIfIOS())

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault()
            setDeferredPrompt(e)
            setIsInstallable(true)
        }

        // Listen for app installed event
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setIsInstallable(false)
            setDeferredPrompt(null)
            toast.success("App installed successfully!")
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
            window.removeEventListener("appinstalled", handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (isIOS) {
            toast.info(
                <div className="space-y-2">
                    <p className="font-medium">Install on iOS</p>
                    <p>
                        Tap the share button <span className="inline-block w-5 h-5 leading-5 text-center border rounded">↑</span>{" "}
                        then "Add to Home Screen"
                    </p>
                </div>,
                {
                    duration: 5000,
                },
            )
            return
        }

        if (!deferredPrompt) {
            // Fallback for browsers that don't support beforeinstallprompt
            toast.info("To install this app, use your browser's 'Add to Home Screen' option in the menu.")
            return
        }

        setIsInstalling(true)

        try {
            // Show the install prompt
            await deferredPrompt.prompt()

            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === "accepted") {
                toast.success("App installation started!")
                setIsInstallable(false)
                setDeferredPrompt(null)
            } else {
                toast.info("App installation cancelled")
            }
        } catch (error) {
            console.error("Error during installation:", error)
            toast.error("Installation failed. Please try again.")
        } finally {
            setIsInstalling(false)
        }
    }

    if (isInstalled) {
        return null // Don't show anything if already installed
    }

    if (!isInstallable && !isIOS) {
        return null // Don't show if not installable (except on iOS where we can guide manual installation)
    }

    // Icon-only button (for header)
    if (variant === "icon") {
        return (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full h-9 w-9 transition-colors ${isInstallable ? "text-th-dark-green hover:bg-th-light-cream" : "text-gray-400 cursor-not-allowed"
                        } ${className}`}
                    onClick={handleInstallClick}
                    disabled={!isInstallable && !isIOS}
                    title={isIOS ? "Install on iOS" : isInstallable ? "Install App" : "App installation not available"}
                >
                    {isInstalling ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                        >
                            <Download size={20} />
                        </motion.div>
                    ) : (
                        <Download size={20} />
                    )}
                </Button>
            </motion.div>
        )
    }

    // Link variant
    if (variant === "link") {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-th-dark-green hover:text-th-medium-green flex items-center cursor-pointer ${className}`}
                onClick={handleInstallClick}
            >
                {isInstalling ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                    >
                        <Download size={16} className="mr-1.5" />
                    </motion.div>
                ) : (
                    <Download size={16} className="mr-1.5" />
                )}
                <span className="text-sm font-medium">{text}</span>
            </motion.div>
        )
    }

    // Banner variant
    if (variant === "banner") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border border-th-medium-green/20 rounded-lg p-3 flex items-center justify-between ${className}`}
            >
                <div className="flex items-center">
                    <div className="bg-th-medium-green/10 rounded-full p-2 mr-3">
                        <Download size={20} className="text-th-dark-green" />
                    </div>
                    <div>
                        <p className="font-medium text-th-dark-green">Install our app</p>
                        {/* <p className="text-sm text-th-medium-green">Get quick access to tokens anytime</p> */}
                    </div>
                </div>
                <Button
                    size="sm"
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="bg-th-dark-green hover:bg-th-medium-green text-white h-fit pt-2 pb-1"
                >
                    {isInstalling ? (
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ y: [0, 5, 0], opacity: [1, 0, 1] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            >
                                <ArrowBigDownDash size={12} className="mx-2" />
                            </motion.div>
                            <div className="w-5 border-t-2 relative -top-1 border-dashed border-gray-400 mt-1" />
                        </div>


                    ) : (
                        <span className="leading-0">
                            Install
                        </span>
                    )}
                </Button>
            </motion.div>
        )
    }

    // Default button variant
    return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={className}>
            <Button
                onClick={handleInstallClick}
                disabled={isInstalling}
                className={`${iconOnly ? "px-3" : "px-4"} bg-th-dark-green hover:bg-th-medium-green text-white`}
                size={iconOnly ? "sm" : "default"}
            >
                {isInstalling ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                    >
                        <Download size={iconOnly ? 16 : 18} className={iconOnly ? "" : "mr-2"} />
                    </motion.div>
                ) : (
                    <>
                        <Download size={iconOnly ? 16 : 18} className={iconOnly ? "" : "mr-2"} />
                        {!iconOnly && showText && <span>{text}</span>}
                    </>
                )}
            </Button>
        </motion.div>
    )
}
