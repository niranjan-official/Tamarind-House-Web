"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CalendarClock, UserCog } from 'lucide-react'
import { motion } from "framer-motion"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-[5%] transform -translate-x-1/2 flex justify-evenly w-[90%] h-16 bg-th-dark-green text-white rounded-2xl shadow-lg z-40 border border-th-medium-green/20"
    >
      <NavItem
        href="/home"
        label="Home"
        isActive={pathname === "/home"}
        icon={<LayoutGrid size={22} strokeWidth={1.5} />}
      />
      <NavItem
        href="/history"
        label="History"
        isActive={pathname === "/history"}
        icon={<CalendarClock size={22} strokeWidth={1.5} />}
      />
      <NavItem
        href="/profile"
        label="Profile"
        isActive={pathname === "/profile"}
        icon={<UserCog size={22} strokeWidth={1.5} />}
      />
    </motion.div>
  )
}

function NavItem({ href, label, isActive, icon }) {
  return (
    <Link href={href} className="w-1/3">
      <div className={`flex flex-col h-full w-full justify-center items-center transition-all duration-200`}>
        {isActive ? (
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }} 
              className="relative"
            >
              <div className="relative z-10 text-th-light-cream">{icon}</div>
            </motion.div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs mt-1 font-medium text-th-light-cream"
            >
              {label}
            </motion.span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-th-light-cream/60">{icon}</div>
            <span className="text-xs mt-1 font-medium text-th-light-cream/60">{label}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
