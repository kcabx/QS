import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { AlertCircle, Heart, Lock } from 'lucide-react'

// SHA-256 哈希函数
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimeLeft, setLockTimeLeft] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // 正确的凭据
  const CORRECT_USERNAME = 'QSuser'
  const CORRECT_PASSWORD_HASH = '0ed625947f28ad8d6fe7565c283fa6f77e4b0d15f9493fa1021726effece5dda'
  const MAX_ATTEMPTS = 3
  const LOCK_TIME = 5 * 60 * 1000 // 5分钟

  // 检查是否被锁定
  useEffect(() => {
    const lockEndTime = localStorage.getItem('lockEndTime')
    if (lockEndTime) {
      const now = Date.now()
      const endTime = parseInt(lockEndTime)
      if (now < endTime) {
        setIsLocked(true)
        setLockTimeLeft(Math.ceil((endTime - now) / 1000))
      } else {
        localStorage.removeItem('lockEndTime')
        localStorage.removeItem('loginAttempts')
      }
    }

    const storedAttempts = localStorage.getItem('loginAttempts')
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts))
    }
  }, [])

  // 锁定倒计时
  useEffect(() => {
    let timer
    if (isLocked && lockTimeLeft > 0) {
      timer = setInterval(() => {
        setLockTimeLeft(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setAttempts(0)
            localStorage.removeItem('lockEndTime')
            localStorage.removeItem('loginAttempts')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, lockTimeLeft])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLocked) {
      setError(`账户已锁定，请等待 ${Math.floor(lockTimeLeft / 60)}:${(lockTimeLeft % 60).toString().padStart(2, '0')} 后重试`)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // 验证用户名
      if (username !== CORRECT_USERNAME) {
        throw new Error('用户名或密码错误')
      }

      // 计算密码哈希
      const passwordHash = await sha256(password)
      
      // 验证密码哈希
      if (passwordHash !== CORRECT_PASSWORD_HASH) {
        throw new Error('用户名或密码错误')
      }

      // 登录成功
      localStorage.removeItem('loginAttempts')
      localStorage.removeItem('lockEndTime')
      onLogin(true)
      
    } catch (err) {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem('loginAttempts', newAttempts.toString())

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockEndTime = Date.now() + LOCK_TIME
        localStorage.setItem('lockEndTime', lockEndTime.toString())
        setIsLocked(true)
        setLockTimeLeft(LOCK_TIME / 1000)
        setError(`登录失败次数过多，账户已锁定 5 分钟`)
      } else {
        setError(`${err.message}，还有 ${MAX_ATTEMPTS - newAttempts} 次尝试机会`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            欢迎回来
          </CardTitle>
          <CardDescription className="text-white/70">
            请输入您的凭据以访问我们的回忆
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/90">用户名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLocked || isLoading}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-pink-400"
                placeholder="请输入用户名"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLocked || isLoading}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-pink-400"
                placeholder="请输入密码"
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-red-200 text-sm">{error}</span>
              </div>
            )}

            {isLocked && (
              <div className="flex items-center space-x-2 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg">
                <Lock className="h-4 w-4 text-orange-400" />
                <span className="text-orange-200 text-sm">
                  账户已锁定，剩余时间：{formatTime(lockTimeLeft)}
                </span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLocked || isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? '验证中...' : isLocked ? '账户已锁定' : '进入我们的世界'}
            </Button>
          </form>

          {attempts > 0 && !isLocked && (
            <div className="text-center text-white/60 text-sm">
              已尝试 {attempts}/{MAX_ATTEMPTS} 次
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm

