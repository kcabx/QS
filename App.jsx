import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import MainPage from './components/MainPage'
import WelcomeAnimation from './components/WelcomeAnimation'
import soundManager from './utils/soundManager'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false)

  // 检查登录状态
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('isLoggedIn')
      const loginTime = localStorage.getItem('loginTime')
      
      // 检查登录是否过期（24小时）
      if (loginStatus === 'true' && loginTime) {
        const now = Date.now()
        const loginTimestamp = parseInt(loginTime)
        const hoursPassed = (now - loginTimestamp) / (1000 * 60 * 60)
        
        if (hoursPassed < 24) {
          setIsLoggedIn(true)
        } else {
          // 登录过期，清除状态
          localStorage.removeItem('isLoggedIn')
          localStorage.removeItem('loginTime')
        }
      }
      setIsLoading(false)
    }

    checkLoginStatus()
  }, [])

  const handleLogin = (success) => {
    if (success) {
      // 播放成功音效
      soundManager.playSuccess()
      
      // 显示欢迎动画
      setShowWelcomeAnimation(true)
      
      // 延迟设置登录状态，让动画播放完成
      setTimeout(() => {
        setIsLoggedIn(true)
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('loginTime', Date.now().toString())
      }, 4000)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('loginTime')
  }

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white text-xl">加载中...</div>
      </div>
    )
  }

  // 显示欢迎动画
  if (showWelcomeAnimation) {
    return (
      <WelcomeAnimation 
        onComplete={() => setShowWelcomeAnimation(false)} 
      />
    )
  }

  // 未登录状态
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />
  }

  // 已登录状态 - 主应用内容
  return <MainPage onLogout={handleLogout} />
}

export default App

