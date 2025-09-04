import { useState, useEffect } from 'react'
import { Heart, Star, Sparkles, Calendar, Music, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import Timeline from './Timeline'
import DateEasterEgg from './DateEasterEgg'
import MusicPlayer from './MusicPlayer'
import soundManager from '../utils/soundManager'

const MainPage = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('home') // 'home', 'timeline', 'special', 'music'
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [showDateEasterEgg, setShowDateEasterEgg] = useState(false)

  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 心形动画触发
  useEffect(() => {
    const interval = setInterval(() => {
      setShowHeartAnimation(true)
      setTimeout(() => setShowHeartAnimation(false), 3000)
    }, 10000) // 每10秒触发一次
    return () => clearInterval(interval)
  }, [])

  // 生成随机星星
  const generateStars = () => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      animationDelay: Math.random() * 3,
      animationDuration: Math.random() * 2 + 2
    }))
  }

  const [stars] = useState(generateStars())

  // 处理导航点击
  const handleNavClick = (view) => {
    soundManager.playClick()
    setCurrentView(view)
  }

  // 处理退出登录
  const handleLogout = () => {
    soundManager.playClick()
    onLogout()
  }

  // 渲染不同视图
  if (currentView === 'timeline') {
    return <Timeline onBack={() => setCurrentView('home')} />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {stars.map(star => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse opacity-80"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* 流光粒子效果 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* 流动的光线 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-slide-right"></div>
        <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-blue-400 to-transparent animate-slide-left delay-3000"></div>
      </div>

      {/* 心形动画 */}
      {showHeartAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <Heart
              key={i}
              className="absolute text-pink-400 animate-float-up opacity-80"
              size={Math.random() * 20 + 10}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '4s'
              }}
            />
          ))}
        </div>
      )}

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-full">
              <Heart className="h-6 w-6 text-pink-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">我们的回忆</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-white/80 text-sm">
              {currentTime.toLocaleString('zh-CN')}
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出
            </Button>
          </div>
        </div>

        {/* 欢迎区域 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="h-12 w-12 text-yellow-400 animate-spin-slow" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            欢迎来到我们的世界
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            这里记录着我们从相识到现在的每一个美好瞬间，每一份珍贵的回忆都在这里闪闪发光
          </p>
          
          {/* 悄悄话 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border border-white/20">
            <div className="flex items-center justify-center mb-3">
              <Heart className="h-5 w-5 text-pink-400 mr-2" />
              <span className="text-pink-300 text-sm font-medium">悄悄话</span>
            </div>
            <p className="text-white/90 text-center italic">
              "在这个充满星光的夜晚，我想对你说：你是我生命中最美的奇迹 ✨"
            </p>
          </div>
        </div>

        {/* 功能导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            onClick={() => handleNavClick('timeline')}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">时间线</h3>
            <p className="text-white/70 text-center text-sm">浏览我们的美好回忆</p>
          </div>

          <div 
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
            onClick={() => {
              soundManager.playClick()
              setShowDateEasterEgg(true)
            }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">特殊时刻</h3>
            <p className="text-white/70 text-center text-sm">纪念日和重要时刻</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full group-hover:scale-110 transition-transform">
                <Music className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white text-center mb-2">音乐盒</h3>
            <p className="text-white/70 text-center text-sm">我们的专属背景音乐</p>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
            <Heart className="h-4 w-4 text-pink-400" />
            <span>用爱编织的每一个瞬间</span>
            <Heart className="h-4 w-4 text-pink-400" />
          </div>
        </div>
      </div>

      {/* 特殊日期彩蛋弹窗 */}
      <DateEasterEgg 
        isOpen={showDateEasterEgg} 
        onClose={() => setShowDateEasterEgg(false)} 
      />

      {/* 背景音乐播放器 */}
      <MusicPlayer />
    </div>
  )
}

export default MainPage

