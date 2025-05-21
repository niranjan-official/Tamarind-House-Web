"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, UserIcon as Male, UserIcon as Female, Users } from "lucide-react"
import Image from "next/image"

export default function GenderSelectionDialog({ open, onOpenChange, onSubmit }) {
  const [gender, setGender] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!gender) return

    setIsSubmitting(true)
    try {
      await onSubmit(gender)
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to save gender:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const genderOptions = [
    {
      value: "male",
      label: "Male",
      icon: <Male className="h-6 w-6" />,
      color: "bg-blue-50 border-blue-200 text-blue-600",
      activeColor: "bg-blue-600 text-white border-blue-600",
    },
    {
      value: "female",
      label: "Female",
      icon: <Female className="h-6 w-6" />,
      color: "bg-pink-50 border-pink-200 text-pink-600",
      activeColor: "bg-pink-600 text-white border-pink-600",
    },
    {
      value: "other",
      label: "Other",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-50 border-purple-200 text-purple-600",
      activeColor: "bg-purple-600 text-white border-purple-600",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        delay: 0.2,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
      },
    },
  }

  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.6,
        duration: 0.5,
      },
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none bg-white/95 backdrop-blur-md shadow-xl">
        <DialogHeader>
          <motion.div className="flex justify-center mb-2" variants={logoVariants} initial="hidden" animate="visible">
            <div className="relative h-16 w-16 overflow-hidden">
              <div className="absolute inset-0">
                <div className="h-full w-full rounded-full flex items-center justify-center">
                  <Image src="/images/logo.png" width={80} height={80} alt="Tamarind House" />
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={titleVariants} initial="hidden" animate="visible">
            <DialogTitle className="text-xl text-center text-th-dark-green">Complete Your Profile</DialogTitle>
          </motion.div>
          <motion.div variants={descriptionVariants} initial="hidden" animate="visible">
            <DialogDescription className="text-center">
              Please select your gender to complete your profile. This helps us provide better service.
            </DialogDescription>
          </motion.div>
        </DialogHeader>

        <motion.div className="py-6" variants={containerVariants} initial="hidden" animate="visible">
          <div className="grid grid-cols-3 gap-3">
            {genderOptions.map((option, index) => (
              <motion.div
                key={option.value}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGender(option.value)}
                className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center transition-all duration-200 ${
                  gender === option.value ? option.activeColor : option.color
                }`}
              >
                <motion.div
                  animate={
                    gender === option.value ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  {option.icon}
                </motion.div>
                <motion.span
                  className="mt-2 font-medium"
                  animate={gender === option.value ? { fontWeight: 700 } : { fontWeight: 500 }}
                  transition={{ duration: 0.3 }}
                >
                  {option.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <DialogFooter>
          <AnimatePresence mode="wait">
            <motion.div
              key={gender ? "active" : "inactive"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
              className="w-full"
            >
              <motion.div
                whileHover={gender ? { scale: 1.03 } : {}}
                whileTap={gender ? { scale: 0.97 } : {}}
                className="w-full"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!gender || isSubmitting}
                  className={`w-full ${
                    gender === "male"
                      ? "bg-blue-600 hover:bg-blue-700"
                      : gender === "female"
                        ? "bg-pink-600 hover:bg-pink-700"
                        : gender === "other"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-th-dark-green hover:bg-th-medium-green"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        Saving...
                      </motion.span>
                    </>
                  ) : (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      Continue
                    </motion.span>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
