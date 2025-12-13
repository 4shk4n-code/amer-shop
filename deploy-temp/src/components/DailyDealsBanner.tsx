'use client'

import { useState, useEffect } from 'react'
import { Zap, Clock, TrendingUp, Gift } from 'lucide-react'

export default function DailyDealsBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev
        seconds--
        
        if (seconds < 0) {
          seconds = 59
          minutes--
        }
        if (minutes < 0) {
          minutes = 59
          hours--
        }
        if (hours < 0) {
          hours = 23
        }
        
        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const flashDeals = [
    { icon: Zap, text: 'Flash Sale', color: 'text-yellow-400' },
    { icon: Gift, text: 'Free Gifts', color: 'text-green-400' },
    { icon: TrendingUp, text: 'Up to 80% OFF', color: 'text-red-400' },
  ]

  return (
    <div className="bg-gray-800 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold">
              NEW DEALS <span className="text-yellow-400">EVERY DAY</span>
            </h2>
          </div>
          
          {/* Center: Flash Deals Badges */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {flashDeals.map((deal, index) => {
              const Icon = deal.icon
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition-colors"
                >
                  <Icon className={`w-4 h-4 ${deal.color}`} />
                  <span className="text-sm font-medium">{deal.text}</span>
                </div>
              )
            })}
          </div>
          
          {/* Right: Countdown Timer */}
          <div className="flex items-center gap-3 bg-red-600 px-6 py-2 rounded-lg">
            <Clock className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-lg font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">HRS</div>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="text-center">
                <div className="text-lg font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">MIN</div>
              </div>
              <span className="text-xl font-bold">:</span>
              <div className="text-center">
                <div className="text-lg font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-xs opacity-80">SEC</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

