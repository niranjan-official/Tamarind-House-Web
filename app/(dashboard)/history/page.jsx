"use client"

import { getStudentTokenHistory } from "@/Functions/functions" 
import HistoryCard from "@/components/HistoryCard"
import { useEffect, useLayoutEffect, useState } from "react"
import Loading from "../loading"
import { FileX } from "lucide-react"

export default function History() {
  const [email, setEmail] = useState("")
  const [studentHistory, setStudentHistory] = useState("")
  const [load, setLoad] = useState(true)
  const [empty, setEmpty] = useState(false)

  useLayoutEffect(() => {
    const userData = JSON.parse(localStorage.getItem("studentData"))
    if (userData) {
      setEmail(userData.email)
    }
  }, [])

  useEffect(() => {
    if (email) {
      fetchHistory()
    }
  }, [email])

  const fetchHistory = async () => {
    const data = await getStudentTokenHistory(email)
    if (data) {
      setStudentHistory(data)
    } else {
      setEmpty(true)
    }
    setLoad(false)
  }

  if (!load) {
    if (!empty) {
      return (
        <div className="w-full flex flex-1 flex-col gap-3 p-4 overflow-y-auto">
          <h1 className="text-xl font-semibold text-th-dark-green mb-2">Your Token History</h1>
          {studentHistory &&
            studentHistory.map((obj, key) => (
              <HistoryCard
                key={key}
                tokenNumber={obj.key}
                dispenseTime={obj.value.Printing_time}
                generationTime={obj.value.generationTime}
                date={obj.value.date}
              />
            ))}
        </div>
      )
    } else {
      return (
        <div className="w-full flex flex-1 flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center max-w-sm">
            <FileX className="h-16 w-16 text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold text-th-dark-green mb-2">No History Found</h1>
            <p className="text-gray-500 text-center">
              You haven't generated any tokens yet. Generate a token from the home screen.
            </p>
          </div>
        </div>
      )
    }
  } else {
    return <Loading />
  }
}