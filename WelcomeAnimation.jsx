import { useState, useEffect } from 'react'
import { Heart, Sparkles, Star } from 'lucide-react'

const WelcomeAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState(0) // 0: 光点汇聚, 1: 文字显示, 2: 完成

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 1000)
    const timer2 = setTimeout(() => setStage(2), 3000)
    const timer3 = setTimeout(() => onComplete(), 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      {/* 背景星空 */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>

      {/* 光点汇聚动画 */}
      {stage >= 0 && (
        <div className="relative">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-converge opacity-80"
              style={{
                left: `${Math.cos((i * 30) * Math.PI / 180) * 200}px`,
                top: `${Math.sin((i * 30) * Math.PI / 180) * 200}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s',
                animationFillMode: 'forwards'
              }}
            />
          ))}
          
          {/* 中心光芒 */}
          <div className="w-16 h-16 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full animate-pulse-glow flex items-center justify-center">
            <Heart className="h-8 w-8 text-white animate-bounce" />
          </div>
        </div>
      )}

      {/* 欢迎文字 */}
      {stage >= 1 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center animate-fade-in-up">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-yellow-400 animate-spin-slow mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold text-white bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                欢迎回来
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-400 animate-spin-slow ml-3" />
            </div>
            <p className="text-xl text-white/80 animate-fade-in-up delay-500">
              让我们一起重温那些美好的时光
            </p>
            
            {/* 装饰性元素 */}
            <div className="mt-8 flex items-center justify-center space-x-4 animate-fade-in-up delay-1000">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 animate-twinkle"
                  style={{
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 渐出效果 */}
      {stage >= 2 && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 animate-fade-out"></div>
      )}
    </div>
  )
}

export default WelcomeAnimation

