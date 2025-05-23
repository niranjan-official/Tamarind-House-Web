"use client"

import { convertTime, formatDate, getData } from "@/Functions/functions"
import { useEffect, useLayoutEffect, useState } from "react"
import Loading from "../loading"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/config"
import { signOut } from "firebase/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, BadgeIcon as IdCard, Mail, Calendar, LogOut } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import InstallPWA from "@/components/InstallPWA"

function ProfileItem({ icon, label, value, className, delay = 0 }) {
  return (
    <motion.div
      className="flex items-center p-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.4,
        delay,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        backgroundColor: "rgba(0, 0, 0, 0.02)",
        transition: { duration: 0.2 },
      }}
    >
      <motion.div
        className="mr-3"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 },
        }}
      >
        {icon}
      </motion.div>
      <div className="flex flex-col w-full overflow-hidden">
        <motion.span
          className="text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.3, delay: delay + 0.1 }}
        >
          {label}
        </motion.span>
        <motion.span
          className={`text-gray-700 truncate max-w-full ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2 }}
        >
          {value}
        </motion.span>
      </div>
    </motion.div>
  )
}

export default function Profile() {
  const Router = useRouter()
  const [email, setEmail] = useState("")
  const [data, setData] = useState({
    name: "",
    id: "",
    dateOfReg: "",
  })
  const [load, setLoad] = useState(true)

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"))
    if (userData) {
      setEmail(userData.email)
    }
  }, [])

  useEffect(() => {
    if (email) {
      fetchData()
    }
  }, [email])

  const fetchData = async () => {
    const data = await getData(email)
    if (data) {
      const date = convertTime(data.dateOfReg)
      const newDate = new Date(date)
      setData({
        name: data.name,
        id: data.id,
        dateOfReg: formatDate(newDate),
      })
      setLoad(false)
    } else {
      toast.error("Unknown error occurred!")
    }
  }

  const handleSignout = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        signOut(auth)
          .then(() => {
            setTimeout(() => {
              Router.push("/login")
              resolve(true)
            }, 1000)
          })
          .catch((error) => {
            reject(error)
          })
      }),
      {
        loading: "Signing out...",
        success: "Signed out successfully!",
        error: "Sign out failed. Please try again.",
      },
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  if (!load) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          className="w-full flex flex-col flex-1 items-center p-4 overflow-y-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="w-full max-w-md" variants={itemVariants}>
            <motion.div className="flex flex-col items-center mb-6" variants={itemVariants}>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                  delay: 0.2,
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
              >
                <Avatar className="h-24 w-24 bg-th-light-tan text-th-dark-green">
                  <AvatarFallback className="text-3xl">{data.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h2
                className="mt-4 text-2xl font-bold text-th-dark-green"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {data?.name}
              </motion.h2>
              <motion.p
                className="text-th-medium-green uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {data?.id}
              </motion.p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card className="border-none shadow-md mb-6">
                <CardContent className="p-0">
                  <ProfileItem
                    icon={<User className="h-5 w-5 text-th-dark-green" />}
                    label="Name"
                    value={data?.name}
                    delay={0.7}
                  />
                  <Separator />
                  <ProfileItem
                    icon={<IdCard className="h-5 w-5 text-th-dark-green" />}
                    label="ID"
                    value={data?.id}
                    delay={0.8}
                  />
                  <Separator />
                  <ProfileItem
                    icon={<Mail className="h-5 w-5 text-th-dark-green" />}
                    className={"text-sm"}
                    label="Email"
                    value={email}
                    delay={0.9}
                  />
                  <Separator />
                  <ProfileItem
                    icon={<Calendar className="h-5 w-5 text-th-dark-green" />}
                    label="Registered On"
                    value={data?.dateOfReg}
                    delay={1.0}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mb-6"
            >
              <InstallPWA variant="banner" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.1,
                duration: 0.5,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.2 },
              }}
              whileTap={{
                scale: 0.97,
                transition: { duration: 0.1 },
              }}
            >
              <Button onClick={handleSignout} className="w-full bg-th-dark-green hover:bg-th-medium-green text-white">
                <motion.div
                  className="flex items-center justify-center w-full"
                  whileHover={{
                    x: [0, -2, 2, -2, 0],
                    transition: { duration: 0.5 },
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
  } else {
    return <Loading />
  }
}
