import { Calendar, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HistoryCard({ tokenNumber, dispenseTime, generationTime, date }) {
  return (
    <Card className="w-full overflow-hidden border-none shadow-md">
      <CardContent className="p-4 flex justify-between">
        <div className="flex flex-col justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-th-dark-green">{tokenNumber}</span>
          </div>
          {dispenseTime ? (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 pt-1 font-normal">
              Collected at {dispenseTime}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-normal">
              Expired
            </Badge>
          )}
        </div>
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-th-medium-green" />
            <span className="leading-3 mt-1">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-th-medium-green" />
            <span className="leading-3 mt-1">{generationTime}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
