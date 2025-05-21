import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="w-full h-[80vh] flex flex-col justify-center items-center gap-4">
      <div class="loader"></div>
      <p className="text-th-medium-green font-medium">Loading...</p>
    </div>
  )
}