"use client"

import { useAuth } from "@/firebase/auth"
import { usePathname } from "next/navigation"
import Loading from "./loading"
import Header from "@/components/Header"
import BottomNavigation from "@/components/bottom-navigation"

export default function Layout({ children }) {
  const pathname = usePathname()
  const User = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-th-light-cream">
      <Header />
      <div className="flex flex-1 pt-16 pb-16">{User ? children : <Loading />}</div>
      <BottomNavigation />
    </div>
  )
}
