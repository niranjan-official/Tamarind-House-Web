"use client"

import {
  checkTokenExistence,
  generateToken,
  getServerDate,
  isTimeBetween10AMAnd3PM,
  isTokenCollected,
} from "@/Functions/functions"
import { useEffect, useLayoutEffect, useState } from "react"
import { Loader2, Clock, CheckCircle2, AlertCircle, CalendarClock, Utensils, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function TokenPage() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [tokenLoad, setTokenLoad] = useState(true)
  const [isValidTime, setIsValidTime] = useState(false)
  const [time, setTime] = useState("")
  const [tokenDispensed, setTokenDispensed] = useState(false)
  const [tokenDispensedLoad, setTokenDispensedLoad] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [progress, setProgress] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  // Get current server time and check if it's between 10 AM and 3 PM
  useEffect(() => {
    getDate();
    window.scrollTo(0, 0);

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      updateProgress()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Calculate progress for the time bar
  const updateProgress = () => {
    if (!isValidTime) return

    const now = new Date()
    const start = new Date(now)
    start.setHours(10, 0, 0, 0)
    const end = new Date(now)
    end.setHours(15, 0, 0, 0)

    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()

    const newProgress = Math.min(100, Math.max(0, (elapsed / total) * 100))
    setProgress(newProgress)
  }

  const getDate = async () => {
    const currentTime = await getServerDate()
    const checkTime = isTimeBetween10AMAnd3PM(currentTime)
    if (checkTime) {
      setIsValidTime(true)
      updateProgress()
    }
    setCurrentTime(new Date(currentTime))
  }

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"))
    if (userData) {
      setEmail(userData.email)
    }
  }, [])

  useEffect(() => {
    if (email) {
      checkToken(email)
    }
  }, [email])

  const checkToken = async (email) => {
    const status = await checkTokenExistence(email)
    if (status.tokenExist) {
      setTokenDispensedLoad(true)
      tokenCollectionStatus(status.token)
      setToken(status.token)
      setTime(status.time)
    } else if (status.err) {
      toast.error("Unknown error occurred. Please refresh the page.")
    }
    setTokenLoad(false)
  }

  const tokenCollectionStatus = async (tokenNumber) => {
    const status = await isTokenCollected(tokenNumber)
    if (status.tokenCollected) {
      setTokenDispensed(true)
    }
    setTokenDispensedLoad(false)
  }

  const triggerConfetti = () => {
    setShowConfetti(true)

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1F4529", "#47663B", "#E8ECD7", "#EED3B1"],
    })

    setTimeout(() => {
      setShowConfetti(false)
    }, 3000)
  }

  const TokenGeneration = async () => {
    setTokenLoad(true)
    const status = await generateToken(email)
    if (status.success) {
      setToken(status.token)
      setTime(status.time)
      toast.success("Token generated successfully!")

      // Trigger confetti after a short delay
      setTimeout(() => {
        triggerConfetti()
      }, 500)
    } else if (status.err) {
      toast.error("Failed to generate token. Please try again.")
    }
    setTokenLoad(false)
  }

  // Format the current time for display
  const formattedTime = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col flex-1 p-4 pb-10 bg-th-light-cream"
    >
      {/* Header with date and time */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-th-dark-green">Today's Meal Token</h1>
        <div className="flex items-center text-th-medium-green mt-1">
          <CalendarClock className="h-4 w-4 mr-2" />
          <span className="text-sm leading-3">
            {formattedDate} • {formattedTime}
          </span>
        </div>
      </motion.div>

      {/* Service status indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: isValidTime ? [1, 1.2, 1] : 1,
                backgroundColor: isValidTime ? "#22c55e" : "#9ca3af",
              }}
              transition={{
                repeat: isValidTime ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 2,
                duration: 1,
              }}
              className={`h-3 w-3 rounded-full mr-2`}
            />
            <span className="font-medium text-gray-700">{isValidTime ? "Service Active" : "Service Closed"}</span>
          </div>
          <span className="text-sm text-gray-500">10:00 AM - 3:00 PM</span>
        </div>
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.4, duration: 0.5 }}>
          <Progress value={isValidTime ? progress : 0} className="h-2" />
        </motion.div>
      </motion.div>

      {/* Main token section */}
      <AnimatePresence mode="wait">
        {!tokenLoad ? (
          isValidTime ? (
            token ? (
              <TokenDisplay
                key="token-display"
                token={token}
                time={time}
                tokenDispensed={tokenDispensed}
                tokenDispensedLoad={tokenDispensedLoad}
                showConfetti={showConfetti}
              />
            ) : (
              <GenerateTokenSection key="generate-token" onGenerate={TokenGeneration} />
            )
          ) : (
            <ServiceClosedSection key="service-closed" />
          )
        ) : (
          <LoadingSection key="loading" />
        )}
      </AnimatePresence>

      {/* Today's menu preview */}
      {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="mt-6 border-none shadow-md bg-white overflow-hidden">
          <CardContent className="p-0">
            <motion.div whileHover={{ backgroundColor: "rgba(232, 236, 215, 0.3)" }} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-th-dark-green flex items-center">
                  <Utensils className="h-4 w-4 mr-2" /> Today's Special
                </h3>
                <Button variant="ghost" size="sm" className="text-th-medium-green h-8 px-2">
                  View Menu
                </Button>
              </div>
              <div className="space-y-2">
                <MenuItem name="Vegetable Biryani" type="Veg" />
                <MenuItem name="Chicken Curry" type="Non-veg" />
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div> */}
    </motion.div>
  )
}

// Token display component when a token exists
function TokenDisplay({ token, time, tokenDispensed, tokenDispensedLoad, showConfetti }) {
  // Split token into individual digits for animation
  const tokenDigits = token.toString().split("")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-br from-th-dark-green to-th-medium-green rounded-2xl shadow-lg overflow-hidden mb-4"
      >
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-medium opacity-90 leading-3"
            >
              Your Token
            </motion.h2>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/20 px-3 py-1 pt-[6px] leading-3 rounded-full text-sm"
            >
              {time}
            </motion.div>
          </div>

          <div className="flex justify-center items-center py-8 relative">
            <div className="flex">
              {tokenDigits.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 300 }}
                  className="text-7xl font-bold tracking-wider text-white relative"
                >
                  {digit}
                  {showConfetti && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [-20, 20] }}
                      transition={{ duration: 1.5, delay: index * 0.1 }}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs"
                    >
                      ✨
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-between items-center mt-2"
          >
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-1 opacity-80" />
              <span className="text-sm opacity-80 leading-3 mt-1">Valid until 3:00 PM</span>
            </div>

            {tokenDispensedLoad ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                <span className="text-sm leading-3">Checking status...</span>
              </div>
            ) : tokenDispensed ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center text-green-200">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-sm leading-3">Collected</span>
              </motion.div>
            ) : (
              <motion.div
                animate={{ x: [0, 3, -3, 3, 0] }}
                transition={{ repeat: 3, duration: 0.5, delay: 1 }}
                className="flex items-center text-yellow-200"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm leading-3 mt-[0.8px]">Not collected</span>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 px-6 py-3 text-center"
        >
          <p className="text-sm text-white/90">
            {tokenDispensed
              ? "Token has been dispensed. Come back tomorrow."
              : "Punch in this token at the token box to grab your meal."}
          </p>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <TokenInstructions />
      </motion.div>
    </motion.div>
  )
}

// Generate token section when no token exists
function GenerateTokenSection({ onGenerate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl shadow-md p-6 mb-4 text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className="w-24 h-24 bg-th-light-cream rounded-full flex items-center justify-center mb-6"
        >
          <Utensils className="h-12 w-12 text-th-medium-green" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-semibold text-th-dark-green mb-2"
        >
          No Active Token
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 mb-6"
        >
          Generate a token to claim your meal for today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onGenerate}
            className="bg-gradient-to-r from-th-dark-green to-th-medium-green hover:opacity-90 text-white px-8 py-6 rounded-full text-lg"
          >
            Generate Token
          </Button>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <TokenInstructions />
      </motion.div>
    </motion.div>
  )
}

// Service closed section when outside service hours
function ServiceClosedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl shadow-md p-6 mb-4 text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Clock className="h-12 w-12 text-gray-400" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xl font-semibold text-gray-700 mb-2"
        >
          Service Closed
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-500 mb-2"
        >
          The canteen token service is currently closed.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-gray-400"
        >
          Service Hours: 10:00 AM - 3:00 PM
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// Loading section while data is being fetched
function LoadingSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <motion.div>
        <Loader2 className="h-12 w-12 text-th-medium-green mb-4 animate-spin" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-th-medium-green"
      >
        Loading your token...
      </motion.p>
    </motion.div>
  )
}

// Token instructions component
function TokenInstructions() {
  const steps = [
    { text: "Generate your 6-digit token number" },
    { text: "Enter it into the token box at the counter" },
    { text: "Grab your meal and enjoy!" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h3 className="font-medium text-th-dark-green mb-3">Get your food in 3 steps</h3>
      <div className="space-y-3 text-sm text-gray-600">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.2 }}
            className="flex items-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, backgroundColor: "#1F4529", color: "#FFFFFF" }}
              className="bg-th-light-cream rounded-full p-1 mr-2 transition-colors duration-300"
            >
              <span className="block h-4 w-4 text-center text-xs font-medium text-th-dark-green">{index + 1}</span>
            </motion.div>
            <span className="leading-3">{step.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Menu item component for the menu preview
function MenuItem({ name, type }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      whileHover={{ x: 3 }}
      className="flex items-center justify-between py-1"
    >
      <div className="flex items-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
          className={`h-2 w-2 rounded-full mr-2 ${type === "Veg" ? "bg-green-500" : "bg-red-500"}`}
        />
        <span className="text-gray-700">{name}</span>
      </div>
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${type === "Veg" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
      >
        {type}
      </span>
    </motion.div>
  )
}