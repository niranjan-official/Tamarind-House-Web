"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { HelpCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { auth } from "@/firebase/config"
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { doc, getDoc, setDoc, getFirestore } from "firebase/firestore"
import GenderSelectionDialog from "@/components/login/gender-selection-modal"
import { motion, AnimatePresence } from "framer-motion"
import InstallPWA from "@/components/InstallPWA"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showGenderDialog, setShowGenderDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [initialCheckDone, setInitialCheckDone] = useState(false)
  const db = getFirestore()

  // Check if user is already logged in from a previous session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !initialCheckDone) {
        try {
          // Only check if user has complete profile and redirect
          const userRef = doc(db, "users", user.email)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userData = userSnap.data()
            // Only redirect if user has gender set (complete profile)
            if (userData.gender) {
              localStorage.setItem("studentData", JSON.stringify({ email: user.email, ...userData }))
              router.push("/home")
            } else {
              // User exists but needs to set gender
              setCurrentUser(user)
              setShowGenderDialog(true)
            }
          } else {
            // User is authenticated but not in database - sign them out
            auth.signOut()
          }
        } catch (error) {
          console.error("Error checking existing user:", error)
        }
      }
      setInitialCheckDone(true)
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user's email exists in the database
      const userRef = doc(db, "users", user.email)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        // User exists in database
        const userData = userSnap.data()

        // Check if gender is already set
        if (!userData.gender) {
          // User exists but gender is not set (new user)
          setCurrentUser(user)
          setShowGenderDialog(true)
        } else {
          // User exists and has gender set
          localStorage.setItem("studentData", JSON.stringify({ email: user.email, ...userData }))
          toast.success("Signed in successfully!")
          router.push("/home")
        }
      } else {
        // User is not in the database
        toast.error("You are not authorized to access this application.")
        console.error("You are not authorized to access this application.")
        auth.signOut()
      }
    } catch (error) {
      console.error("Error during sign in:", error)
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in was cancelled. Please try again.")
      } else {
        toast.error("Sign in failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const extractDetailsFromEmail = (email) => {
    const match = email.match(/^[^.]+\.([a-z]+)(\d{2})([a-z]+)(\d+)@/i)
    if (!match) return null

    const id = `${match[1]}${match[2]}${match[3]}${match[4]}`
    const year = `20${match[2]}`
    const branchCode = match[3].toLowerCase()
    const program = ["mba", "bba"].includes(branchCode) ? branchCode : "btech"

    return { id, year, program }
  }

  const handleGenderSubmit = async (gender) => {
    try {
      if (!currentUser) return
      console.log(currentUser)

      const details = extractDetailsFromEmail(currentUser.email)
      if (!details) throw new Error("Invalid email format")

      const userRef = doc(db, "users", currentUser.email)
      const userData = {
        gender,
        ...details,
        name: currentUser.displayName || "",
        dateOfReg: new Date(),
      }

      await setDoc(userRef, userData, { merge: true })

      localStorage.setItem("studentData", JSON.stringify({ email: currentUser.email, ...userData }))

      toast.success("Profile completed successfully!")
      router.push("/home")
    } catch (error) {
      console.error("Error saving gender:", error)
      toast.error("Failed to save profile information.")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-th-light-cream">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-th-light-tan opacity-30"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        ></motion.div>
        <motion.div
          className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-th-medium-green opacity-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-th-medium-green opacity-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        ></motion.div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 items-center justify-center px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Card className="w-full max-w-md border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-col items-center space-y-2">
              <motion.div
                className="relative h-24 w-24 mb-2"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <Image src="/images/logo.png" fill className="object-contain" alt="Tamarind House Logo" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <CardTitle className="text-2xl font-bold text-th-dark-green">Tamarind House</CardTitle>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.4 }}>
                <CardDescription className="text-center text-th-medium-green">
                  Welcome to the College Canteen Token Portal of PRC
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || !initialCheckDone}
                  className="w-full bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : !initialCheckDone ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking session...
                    </>
                  ) : (
                    <>
                      <Image src="/images/google-logo.png" alt="Google" width={20} height={20} className="mr-2" />
                      Continue with Google
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.p
                className="text-sm text-gray-500 text-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                Please note food tokens are exclusively for our hostel students to collect.
              </motion.p>
              <div className="mt-4 flex items-center justify-center text-sm text-th-dark-green hover:text-th-dark-green/80 transition-colors duration-200">
                <HelpCircle className="w-4 h-4 mr-1" />
                <span className="mt-[0.5px]">
                  Having trouble?{" "}
                  <a
                    href="mailto:tamarind.house@providence.edu.in?subject=Support%20Request"
                    className="font-medium underline hover:no-underline"
                  >
                    Get in touch
                  </a>
                </span>
              </div>
            </CardContent>

            {/* PWA Install Banner */}
            <CardFooter className="pt-0">
              <InstallPWA variant="banner" className="w-full mt-4" />
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="pb-4 text-center z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.4 }}
      >
        <Link href="/credits" className="text-th-medium-green hover:text-th-dark-green text-sm">
          Credits
        </Link>
      </motion.div>

      {/* Gender Selection Dialog */}
      <AnimatePresence>
        {showGenderDialog && (
          <GenderSelectionDialog
            open={showGenderDialog}
            onOpenChange={setShowGenderDialog}
            onSubmit={handleGenderSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}