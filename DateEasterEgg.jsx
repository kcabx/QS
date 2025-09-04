import { useState, useEffect } from 'react'
import { Heart, Sparkles, Star, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import soundManager from '../utils/soundManager'

const DateEasterEgg = ({ isOpen, onClose }) => {
  const [inputDate, setInputDate] = useState('')
  const [showFireworks, setShowFireworks] = useState(false)
  const [showHearts, setShowHearts] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')

  // 特殊日期配置
  const specialDates = {
    '0214': {
      type: 'hearts',
      message: '💕 情人节快乐！愿我们的爱情如这满天的心形一样美丽永恒！',
      color: 'pink'
    },
    '0520': {
      type: 'fireworks',
      message: '🎆 我爱你！520，让烟花为我们的爱情绽放！',
      color: 'red'
    },
    '1225': {
      type: 'hearts',
      message: '🎄 圣诞快乐！在这个特殊的日子里，你就是我最好的礼物！',
      color: 'green'
    },
    '0101': {
      type: 'fireworks',
      message: '🎊 新年快乐！愿新的一年我们的爱情更加甜蜜！',
      color: 'gold'
    },
    '0809': {
      type: 'hearts',
      message: '💖 今天是我们第一次相遇的日子，感谢命运让我们相遇！',
      color: 'purple'
    }
  }

  // 处理日期输入
  const handleDateSubmit = () => {
    if (!inputDate) return

    const date = new Date(inputDate)
    const monthDay = String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0')
    
    const specialDate = specialDates[monthDay]
    
    if (specialDate) {
      setEasterEggMessage(specialDate.message)
      
      if (specialDate.type === 'hearts') {
        triggerHeartEffect()
      } else if (specialDate.type === 'fireworks') {
        triggerFireworksEffect()
      }
      
      soundManager.playHeartbeat()
    } else {
      setEasterEggMessage('这也是一个特别的日子，因为有你在身边 💕')
      triggerHeartEffect()
      soundManager.playClick()
    }
  }

  // 触发心形特效
  const triggerHeartEffect = () => {
    setShowHearts(true)
    setTimeout(() => setShowHearts(false), 5000)
  }

  // 触发烟花特效
  const triggerFireworksEffect = () => {
    setShowFireworks(true)
    setTimeout(() => setShowFireworks(false), 6000)
  }

  // 关闭弹窗
  const handleClose = () => {
    soundManager.playClick()
    setInputDate('')
    setEasterEggMessage('')
    setShowHearts(false)
    setShowFireworks(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* 心形特效 */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-400 animate-float-up opacity-80"
              size={Math.random() * 30 + 15}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: '5s'
              }}
            />
          ))}
        </div>
      )}

      {/* 烟花特效 */}
      {showFireworks && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50 + 10}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {Array.from({ length: 8 }, (_, j) => (
                <Sparkles
                  key={j}
                  className="absolute text-yellow-400 animate-firework opacity-90"
                  size={Math.random() * 20 + 10}
                  style={{
                    transform: `rotate(${j * 45}deg)`,
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 主要内容 */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20 relative">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-pink-400" />
              <CardTitle className="text-white">特殊日期</CardTitle>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-2">
            输入一个特殊的日期，看看会发生什么神奇的事情 ✨
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-pink-400"
            />
            
            <Button
              onClick={handleDateSubmit}
              disabled={!inputDate}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              发现惊喜
            </Button>
          </div>

          {/* 彩蛋消息 */}
          {easterEggMessage && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 animate-bounce-in">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-pink-400 animate-pulse mr-2" />
                  <span className="text-pink-300 text-sm font-medium">惊喜消息</span>
                  <Heart className="h-5 w-5 text-pink-400 animate-pulse ml-2" />
                </div>
                <p className="text-white/90 text-center leading-relaxed">
                  {easterEggMessage}
                </p>
              </div>
            </div>
          )}

          {/* 提示信息 */}
          <div className="text-center text-white/60 text-xs">
            <p>💡 试试这些特殊日期：</p>
            <p>2-14, 5-20, 12-25, 1-1, 8-9</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DateEasterEgg

