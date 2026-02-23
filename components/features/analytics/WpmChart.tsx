"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DataPoint {
  wpm: number
  accuracy: number
  date: string
}

interface WpmChartProps {
  data: DataPoint[]
  className?: string
}

type Range = 7 | 14 | 30

export function WpmChart({ data, className }: WpmChartProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [range, setRange] = React.useState<Range>(14)

  const filteredData = React.useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - range)
    return data
      .filter(d => new Date(d.date) >= cutoff)
      .slice(-range)
  }, [data, range])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || filteredData.length < 2) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, right: 50, bottom: 30, left: 40 }
    const chartW = w - padding.left - padding.right
    const chartH = h - padding.top - padding.bottom

    ctx.clearRect(0, 0, w, h)

    const wpmValues = filteredData.map(d => d.wpm)
    const accValues = filteredData.map(d => d.accuracy * 100)

    const wpmMin = Math.max(0, Math.min(...wpmValues) - 5)
    const wpmMax = Math.max(...wpmValues) + 5
    const accMin = Math.max(0, Math.min(...accValues) - 5)
    const accMax = Math.min(100, Math.max(...accValues) + 5)

    const getComputedColor = (varName: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#6366f1'
    }

    const primaryColor = getComputedColor('--primary')
    const successColor = getComputedColor('--success')
    const mutedColor = getComputedColor('--muted-foreground')
    const borderColor = getComputedColor('--border')

    // Grid lines
    ctx.strokeStyle = borderColor
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(w - padding.right, y)
      ctx.stroke()
    }

    // WPM Y-axis labels
    ctx.fillStyle = mutedColor
    ctx.font = "10px sans-serif"
    ctx.textAlign = "right"
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(wpmMax - ((wpmMax - wpmMin) / 4) * i)
      const y = padding.top + (chartH / 4) * i
      ctx.fillText(`${val}`, padding.left - 6, y + 3)
    }

    // Accuracy Y-axis labels (right side)
    ctx.textAlign = "left"
    for (let i = 0; i <= 4; i++) {
      const val = Math.round(accMax - ((accMax - accMin) / 4) * i)
      const y = padding.top + (chartH / 4) * i
      ctx.fillText(`${val}%`, w - padding.right + 6, y + 3)
    }

    // Draw lines
    const drawLine = (values: number[], min: number, max: number, color: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.lineJoin = "round"
      ctx.lineCap = "round"
      ctx.beginPath()

      values.forEach((val, i) => {
        const x = padding.left + (chartW / (values.length - 1)) * i
        const y = padding.top + chartH - ((val - min) / (max - min)) * chartH
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()

      // Points
      ctx.fillStyle = color
      values.forEach((val, i) => {
        const x = padding.left + (chartW / (values.length - 1)) * i
        const y = padding.top + chartH - ((val - min) / (max - min)) * chartH
        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    drawLine(wpmValues, wpmMin, wpmMax, primaryColor)
    drawLine(accValues, accMin, accMax, successColor)

    // Legend
    ctx.font = "11px sans-serif"
    const legendY = h - 6

    ctx.fillStyle = primaryColor
    ctx.fillRect(padding.left, legendY - 6, 12, 3)
    ctx.fillStyle = mutedColor
    ctx.textAlign = "left"
    ctx.fillText("WPM", padding.left + 16, legendY)

    ctx.fillStyle = successColor
    ctx.fillRect(padding.left + 60, legendY - 6, 12, 3)
    ctx.fillStyle = mutedColor
    ctx.fillText("정확도", padding.left + 76, legendY)

  }, [filteredData])

  if (data.length < 2) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">WPM 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            최소 2회 이상 연습 후 그래프가 표시됩니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">WPM 추이</CardTitle>
        <div className="flex gap-1">
          {([7, 14, 30] as Range[]).map(r => (
            <Button
              key={r}
              variant={range === r ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => setRange(r)}
            >
              {r}일
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ height: 200 }}
        />
      </CardContent>
    </Card>
  )
}
