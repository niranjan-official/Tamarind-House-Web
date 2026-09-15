"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutGrid, CalendarClock, UserCog } from 'lucide-react'
import { motion } from "framer-motion"

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: LayoutGrid },
  { href: "/history", label: "History", icon: CalendarClock },
  { href: "/profile", label: "Profile", icon: UserCog },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-[5%] transform -translate-x-1/2 flex justify-evenly w-[90%] h-16 bg-th-dark-green text-white rounded-2xl shadow-lg z-40 border border-white/10"
    >
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} {...item} isActive={pathname === item.href} />
      ))}
    </motion.div>
  )
}

function NavItem({ href, label, icon: Icon, isActive }) {
  return (
    <Link href={href} className="w-1/3 h-full">
      <div
        className={`flex flex-col h-full w-full justify-center items-center transition-colors duration-200 ${
          isActive ? "text-th-light-tan" : "text-white/45"
        }`}
      >
        <Icon size={22} strokeWidth={1.5} />
        <span className={`text-xs mt-1 font-medium ${isActive ? "text-white" : "text-white/45"}`}>{label}</span>
      </div>
    </Link>
  )
}
