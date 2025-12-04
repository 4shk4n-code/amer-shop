import Link from 'next/link'
import { Trophy, Gift } from 'lucide-react'

export default function InFocus() {
  return (
    <div className="bg-white">
      <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">IN FOCUS</h2>
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <Link
            key={item}
            href="/promotions"
            className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-lg p-4 overflow-hidden hover:shadow-lg transition-all block"
          >
            {/* Decorative light streaks */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-0.5 h-full bg-yellow-300 transform rotate-12"></div>
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-yellow-300 transform -rotate-12"></div>
              <div className="absolute top-0 right-1/4 w-0.5 h-full bg-yellow-300 transform rotate-12"></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                PLAY TO WIN IN THE FINAL WEEK!
              </h3>
              
              <div className="bg-yellow-400 rounded-full w-24 h-24 flex flex-col items-center justify-center mb-3 mx-auto">
                <Trophy className="w-6 h-6 text-gray-900 mb-1" />
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">CONSOLATION</p>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">PRIZES</p>
                  <p className="text-sm font-bold text-gray-900">10x 100K</p>
                  <p className="text-[10px] font-bold text-gray-900 leading-tight">GUARANTEED</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold text-sm">BIG TICKET</span>
              </div>
              
              <div className="text-[10px] text-white/80 text-center space-y-0.5">
                <p>Play Responsibly 18+</p>
                <p>SERIES 241 | T&C'S APPLY | PRIZES IN AED</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

