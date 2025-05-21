"use client"

import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useRef } from "react"

const team = ["Christy John Biju", "Deepu Sasi", "Uk Ullas", "Vineeth KV", "Niranjan Sabarinath"]

export default function CreditsPage() {
  const { scrollY } = useScroll()
  const headerRef = useRef(null)
  const acknowledgementsRef = useRef(null)
  const teamHeaderRef = useRef(null)
  const footerRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isAcknowledgementsInView = useInView(acknowledgementsRef, { once: true })
  const isTeamHeaderInView = useInView(teamHeaderRef, { once: true })
  const isFooterInView = useInView(footerRef, { once: true })

  const opacity = useTransform(scrollY, [0, 200], [1, 0.2])
  const y = useTransform(scrollY, [0, 200], [0, -50])

  // Animation variants
  const backButtonVariants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
    hover: { x: -5, transition: { duration: 0.2 } },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const teamHeaderVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const teamContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const teamItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
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
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    hover: {
      scale: 1.1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-th-light-cream">
      <motion.div
        style={{ opacity, y }}
        className="fixed top-0 left-0 w-full bg-th-light-cream/80 backdrop-blur-sm z-10 p-4"
      >
        <motion.div variants={backButtonVariants} initial="initial" animate="animate" whileHover="hover">
          <Link href="/home" className="inline-flex items-center text-th-medium-green hover:text-th-dark-green">
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="flex-1 p-4 pb-16 pt-16">
        <div className="mb-6 mt-4">
          <motion.div
            variants={backButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            className="inline-block"
          >
            <Link href="/home" className="inline-flex items-center text-th-medium-green hover:text-th-dark-green">
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </div>

        <motion.h1
          ref={headerRef}
          variants={headerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
          className="text-3xl font-bold text-th-dark-green text-center mb-6"
        >
          Credits
        </motion.h1>

        <motion.div
          ref={acknowledgementsRef}
          variants={cardVariants}
          initial="hidden"
          animate={isAcknowledgementsInView ? "visible" : "hidden"}
          className="mb-8"
        >
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-6">
              <motion.h2 variants={textVariants} className="text-xl font-semibold text-th-dark-green mb-3">
                Acknowledgements
              </motion.h2>
              <motion.p variants={textVariants} className="text-gray-700 leading-relaxed">
                Special thanks to our principal,{" "}
                <span className="font-semibold text-th-dark-green">Dr. Santhosh Simon</span>, our classmates from the{" "}
                <span className="font-semibold text-th-dark-green">CSE 2022</span> batch, and all the faculties in the
                CSE department for their support. A heartfelt acknowledgment to the HOD of Computer Science,{" "}
                <span className="font-semibold text-th-dark-green">Dr. Bibin Vincent</span>, for his exceptional
                contributions, and gratitude to our IT admin,{" "}
                <span className="font-semibold text-th-dark-green">Renjiv Rajan</span>, for their invaluable assistance.
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.h2
          ref={teamHeaderRef}
          variants={teamHeaderVariants}
          initial="hidden"
          animate={isTeamHeaderInView ? "visible" : "hidden"}
          className="text-2xl font-bold text-th-dark-green mb-4"
        >
          Development Team
        </motion.h2>

        <motion.div
          variants={teamContainerVariants}
          initial="hidden"
          animate={isTeamHeaderInView ? "visible" : "hidden"}
          className="space-y-4"
        >
          {team.map((name, index) => (
            <motion.div key={index} variants={teamItemVariants} whileHover="hover" className="origin-center">
              <Card className="border-none shadow-sm transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-th-dark-green to-th-medium-green p-[2px]"
                      variants={imageVariants}
                      whileHover="hover"
                    >
                      <div className="absolute inset-0 rounded-full overflow-hidden bg-white">
                        <Image src={`/images/team/${index + 1}.jpg`} alt={name} fill className="object-cover" />
                      </div>
                    </motion.div>
                    <div className="flex flex-col">
                      <motion.span
                        className="text-xl font-medium text-th-dark-green"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                      >
                        {name}
                      </motion.span>
                      <motion.span
                        className="text-sm text-th-medium-green"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * index + 0.4, duration: 0.4 }}
                      >
                        CSE 2022-26
                      </motion.span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        ref={footerRef}
        variants={footerVariants}
        initial="hidden"
        animate={isFooterInView ? "visible" : "hidden"}
        className="w-full py-4 bg-th-dark-green text-white text-center"
      >
        <motion.p
          className="text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          &copy; {new Date().getFullYear()}{" "}
          <motion.span className="opacity-90" whileHover={{ opacity: 1 }}>
            Providence College of Engineering and School of Business
          </motion.span>
        </motion.p>
      </motion.div>
    </div>
  )
}
