"use client"

import {
  checkTokenExistence,
  generateToken,
  getServerDate,
  getMealType,
  MEAL_WINDOWS,
  isTokenCollected,
} from "@/Functions/functions"
import { useEffect, useLayoutEffect, useState } from "react"
import { Loader2, Clock, CheckCircle2, AlertCircle, CalendarClock, Utensils, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { useRouter } from "next/navigation"

const INITIAL_MEAL_STATE = { load: true, token: null, time: null, dispensed: false, dispensedLoad: false, showConfetti: false }

export default function TokenPage() {
  const [email, setEmail] = useState("")
  const [meals, setMeals] = useState({
    lunch: { ...INITIAL_MEAL_STATE },
    snacks: { ...INITIAL_MEAL_STATE },
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [progress, setProgress] = useState(0)

  const router = useRouter();

  // Get current server time and keep the status bar/progress ticking
  useEffect(() => {
    getDate();
    window.scrollTo(0, 0);

    const interval = setInterval(() => {
      setCurrentTime(new Date())
      updateProgress()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Calculate progress for the 10am-5pm service window bar
  const updateProgress = (now = new Date()) => {
    const start = new Date(now)
    start.setHours(10, 0, 0, 0)
    const end = new Date(now)
    end.setHours(17, 0, 0, 0)

    const total = end.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()

    const newProgress = Math.min(100, Math.max(0, (elapsed / total) * 100))
    setProgress(newProgress)
  }

  const getDate = async () => {
    const serverTimeStr = await getServerDate()
    const now = new Date(serverTimeStr)
    setCurrentTime(now)
    updateProgress(now)
  }

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"))
    if (userData) {
      setEmail(userData.email)
    }
  }, [])

  useEffect(() => {
    if (email) {
      checkAllMeals()
    }
  }, [email])

  const updateMeal = (mealType, patch) => {
    setMeals((prev) => ({
      ...prev,
      [mealType]: { ...prev[mealType], ...patch },
    }))
  }

  const checkAllMeals = async () => {
    const serverTimeStr = await getServerDate()
    const now = new Date(serverTimeStr)
    await Promise.all([
      checkMealToken("lunch", now),
      checkMealToken("snacks", now),
    ])
  }

  const checkMealToken = async (mealType, now) => {
    const status = await checkTokenExistence(email, mealType, now)
    if (status.err === "Gender not found") {
      router.push("/login")
    } else if (status.tokenExist) {
      updateMeal(mealType, { dispensedLoad: true, token: status.token, time: status.time })
      checkDispensedStatus(mealType, status.token)
    } else if (status.err) {
      toast.error("Unknown error occurred. Please refresh the page.")
    }
    updateMeal(mealType, { load: false })
  }

  const checkDispensedStatus = async (mealType, tokenNumber) => {
    const status = await isTokenCollected(tokenNumber)
    updateMeal(mealType, { dispensed: !!status.tokenCollected, dispensedLoad: false })
  }

  const triggerConfetti = (mealType) => {
    updateMeal(mealType, { showConfetti: true })

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#1F4529", "#47663B", "#E8ECD7", "#EED3B1"],
    })

    setTimeout(() => {
      updateMeal(mealType, { showConfetti: false })
    }, 3000)
  }

  const handleGenerate = async (mealType) => {
    updateMeal(mealType, { load: true })
    const status = await generateToken(email, mealType)
    const label = MEAL_WINDOWS[mealType].label
    if (status.success) {
      updateMeal(mealType, { token: status.token, time: status.time })
      toast.success(`${label} token generated successfully!`)

      // Trigger confetti after a short delay
      setTimeout(() => {
        triggerConfetti(mealType)
      }, 500)
    } else if (status.tokenExist) {
      updateMeal(mealType, { dispensedLoad: true, token: status.token, time: status.time })
      checkDispensedStatus(mealType, status.token)
      toast.info(`You already have a ${label.toLowerCase()} token for today.`)
    } else if (status.err) {
      toast.error(`Failed to generate ${label.toLowerCase()} token. Please try again.`)
    }
    updateMeal(mealType, { load: false })
  }

  const currentMealType = getMealType(currentTime)
  const isValidTime = currentMealType !== null

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
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-11 h-11 shrink-0 rounded-xl bg-th-dark-green/10 flex items-center justify-center">
          <Utensils className="h-5 w-5 text-th-dark-green" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-th-dark-green leading-tight">Today's Meal Tokens</h1>
          <div className="flex items-center text-th-medium-green/80 mt-0.5">
            <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs leading-3">
              {formattedDate} • {formattedTime}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Service status indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm border border-th-dark-green/10 p-4 mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <motion.div
              animate={{
                scale: isValidTime ? [1, 1.2, 1] : 1,
                backgroundColor: isValidTime ? "#508C9B" : "#9ca3af",
              }}
              transition={{
                repeat: isValidTime ? Number.POSITIVE_INFINITY : 0,
                repeatDelay: 2,
                duration: 1,
              }}
              className={`h-2 w-2 rounded-full mr-2`}
            />
            <span className="text-sm font-semibold text-gray-700">{isValidTime ? "Service Active" : "Service Closed"}</span>
          </div>
          <span className="text-xs font-medium text-gray-400">10:00 AM – 5:00 PM</span>
        </div>
        <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.4, duration: 0.5 }}>
          <Progress value={isValidTime ? progress : 0} className="h-1.5" />
        </motion.div>
      </motion.div>

      {/* Lunch + Snacks sections */}
      {["lunch", "snacks"].map((mealType) => (
        <MealSection
          key={mealType}
          mealType={mealType}
          config={MEAL_WINDOWS[mealType]}
          state={meals[mealType]}
          currentTime={currentTime}
          onGenerate={() => handleGenerate(mealType)}
        />
      ))}

      <TokenInstructions />
    </motion.div>
  )
}

// One meal's card: loading / has-token / can-generate / not-open
function MealSection({ mealType, config, state, currentTime, onGenerate }) {
  const hour = currentTime.getHours()
  let phase = "active"
  if (hour < config.start) phase = "before"
  else if (hour >= config.end) phase = "after"

  return (
    <div className="mb-1">
      <span className="block text-xs font-semibold uppercase tracking-widest text-th-medium-green/70 mb-2 px-1">
        {config.label}
      </span>
      <AnimatePresence mode="wait">
        {state.load ? (
          <LoadingSection key={`${mealType}-loading`} />
        ) : phase !== "active" ? (
          <ClosedSection key={`${mealType}-closed`} config={config} phase={phase} />
        ) : state.token ? (
          <TokenDisplay
            key={`${mealType}-token`}
            config={config}
            token={state.token}
            time={state.time}
            tokenDispensed={state.dispensed}
            tokenDispensedLoad={state.dispensedLoad}
            showConfetti={state.showConfetti}
          />
        ) : (
          <GenerateTokenSection key={`${mealType}-generate`} config={config} onGenerate={onGenerate} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Format an hour (0-23) as a 12-hour clock label, e.g. 14 -> "2:00 PM"
function formatHour(hour) {
  const period = hour < 12 ? "AM" : "PM"
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:00 ${period}`
}

// Token display component when a token exists
function TokenDisplay({ config, token, time, tokenDispensed, tokenDispensedLoad, showConfetti }) {
  // Split token into individual digits for animation
  const tokenDigits = token.toString().split("")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-1 bg-th-light-cream"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative bg-gradient-to-br from-th-dark-green via-th-dark-green to-th-medium-green rounded-2xl shadow-lg overflow-hidden mb-4 text-white"
      >
        <Utensils className="absolute -right-3 -bottom-3 h-24 w-24 text-white/[0.06] rotate-12 pointer-events-none" />

        <div className="relative flex justify-between items-center px-5 pt-4 pb-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-white/80">{config.label} Token</span>
          <span className="text-xs font-medium bg-white/15 px-2.5 py-1 rounded-full">{time}</span>
        </div>

        {/* Ticket perforation */}
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-5 h-5 rounded-full bg-th-light-cream" />
          <div className="border-t border-dashed border-white/25 mx-6" />
          <div className="absolute top-1/2 -translate-y-1/2 -right-2.5 w-5 h-5 rounded-full bg-th-light-cream" />
        </div>

        <div className="relative flex justify-center gap-1.5 px-5 py-5">
          {tokenDigits.map((digit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
              className="w-9 h-11 flex items-center justify-center rounded-lg bg-white/10 border border-white/20 text-2xl font-mono font-bold"
            >
              {digit}
            </motion.div>
          ))}
          {showConfetti && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
              transition={{ duration: 1.2 }}
              className="absolute -top-1 right-4 text-lg"
            >
              ✨
            </motion.span>
          )}
        </div>

        <div className="relative flex justify-between items-center px-5 pb-4 text-xs">
          <span className="flex items-center text-white/70">
            <Timer className="h-3.5 w-3.5 mr-1" /> Valid until {formatHour(config.end)}
          </span>

          {tokenDispensedLoad ? (
            <span className="flex items-center text-white/70">
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Checking...
            </span>
          ) : tokenDispensed ? (
            <span className="flex items-center gap-1 bg-emerald-400/20 text-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Collected
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-amber-400/20 text-amber-100 px-2 py-0.5 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" /> Not collected
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Generate token section when no token exists yet and this meal's window is active
function GenerateTokenSection({ config, onGenerate }) {
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
        className="bg-white rounded-2xl shadow-sm border border-th-dark-green/10 p-4 mb-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
            className="w-11 h-11 shrink-0 bg-th-light-cream rounded-full flex items-center justify-center"
          >
            <Utensils className="h-5 w-5 text-th-medium-green" />
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base font-semibold text-th-dark-green"
            >
              No Active {config.label} Token
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-gray-400"
            >
              {config.window}
            </motion.p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onGenerate}
            className="w-full bg-gradient-to-r from-th-dark-green to-th-medium-green hover:opacity-90 text-white py-5 rounded-full"
          >
            Generate {config.label} Token
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Shown when this meal's token wasn't generated and its window isn't open right now
// (either it hasn't started yet, or it already passed)
function ClosedSection({ config, phase }) {
  const isUpcoming = phase === "before"

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
        className="bg-white rounded-2xl shadow-sm border border-th-dark-green/10 p-4 mb-4 flex items-center gap-3"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.3 }}
          className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center ${isUpcoming ? "bg-amber-50" : "bg-gray-100"
            }`}
        >
          <motion.div
            animate={isUpcoming ? { rotate: 360 } : {}}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Clock className={`h-5 w-5 ${isUpcoming ? "text-amber-500" : "text-gray-400"}`} />
          </motion.div>
        </motion.div>

        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base font-semibold text-gray-700"
          >
            {isUpcoming ? `${config.label} Opens Soon` : `${config.label} Window Closed`}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-gray-400"
          >
            Service Hours: {config.window}
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Skeleton placeholder while this meal's status is being fetched
function LoadingSection() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
      <div className="bg-white rounded-2xl shadow-sm border border-th-dark-green/10 p-4 mb-4 flex items-center gap-3">
        <div className="w-11 h-11 shrink-0 rounded-full bg-gray-100 animate-pulse" />
        <div className="flex-1 space-y-2 py-0.5">
          <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
          <div className="h-2.5 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
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
    <div className="bg-white rounded-2xl shadow-sm border border-th-dark-green/10 p-4 mt-2">
      <h3 className="text-sm font-semibold text-th-dark-green mb-3">Get your food in 3 steps</h3>
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
              whileHover={{ scale: 1.1 }}
              className="flex items-center justify-center h-5 w-5 rounded-full bg-th-dark-green text-white text-[10px] font-bold mr-2.5 shrink-0"
            >
              {index + 1}
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
