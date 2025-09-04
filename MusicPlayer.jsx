import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import soundManager from '../utils/soundManager'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)

  // 模拟的音乐曲目列表
  const tracks = [
    { name: '星空下的约定', duration: 180 },
    { name: '温柔的时光', duration: 200 },
    { name: '我们的回忆', duration: 165 },
    { name: '浪漫的夜晚', duration: 190 }
  ]

  // 创建音频上下文和音效
  const createAudioContext = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // 设置轻柔的背景音乐音效
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime) // A3
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)

      audioContextRef.current = audioContext
      oscillatorRef.current = oscillator
      gainNodeRef.current = gainNode

      return { audioContext, oscillator, gainNode }
    } catch (error) {
      console.log('音频上下文创建失败:', error)
      return null
    }
  }

  // 播放音乐
  const playMusic = () => {
    if (!audioContextRef.current) {
      createAudioContext()
    }

    try {
      if (audioContextRef.current && oscillatorRef.current && gainNodeRef.current) {
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume()
        }

        // 创建新的振荡器（因为振荡器只能启动一次）
        if (!isPlaying) {
          const oscillator = audioContextRef.current.createOscillator()
          const gainNode = audioContextRef.current.createGain()

          oscillator.connect(gainNode)
          gainNode.connect(audioContextRef.current.destination)

          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime)
          
          gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime)
          gainNode.gain.linearRampToValueAtTime(isMuted ? 0 : volume * 0.1, audioContextRef.current.currentTime + 0.1)

          oscillator.start()
          oscillatorRef.current = oscillator
          gainNodeRef.current = gainNode
        }
      }
    } catch (error) {
      console.log('音乐播放失败:', error)
    }
  }

  // 暂停音乐
  const pauseMusic = () => {
    try {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.1)
      }
    } catch (error) {
      console.log('音乐暂停失败:', error)
    }
  }

  // 切换播放状态
  const togglePlay = () => {
    soundManager.playClick()
    
    if (isPlaying) {
      pauseMusic()
    } else {
      playMusic()
    }
    setIsPlaying(!isPlaying)
  }

  // 切换静音
  const toggleMute = () => {
    soundManager.playClick()
    setIsMuted(!isMuted)
    
    if (gainNodeRef.current && audioContextRef.current) {
      const targetVolume = isMuted ? volume * 0.1 : 0
      gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, audioContextRef.current.currentTime + 0.1)
    }
  }

  // 调整音量
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    
    if (gainNodeRef.current && audioContextRef.current && !isMuted) {
      gainNodeRef.current.gain.linearRampToValueAtTime(newVolume * 0.1, audioContextRef.current.currentTime + 0.1)
    }
  }

  // 切换到下一首
  const nextTrack = () => {
    soundManager.playClick()
    setCurrentTrack((prev) => (prev + 1) % tracks.length)
  }

  // 切换到上一首
  const prevTrack = () => {
    soundManager.playClick()
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length)
  }

  // 切换播放器可见性
  const toggleVisibility = () => {
    soundManager.playClick()
    setIsVisible(!isVisible)
  }

  return (
    <div className="music-player">
      {/* 音乐图标按钮 */}
      <Button
        onClick={toggleVisibility}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 mb-2"
      >
        <Music className="h-5 w-5" />
      </Button>

      {/* 音乐控制面板 */}
      {isVisible && (
        <div className="music-controls animate-bounce-in">
          {/* 当前曲目信息 */}
          <div className="text-white/90 text-xs mb-2 text-center min-w-32">
            {tracks[currentTrack].name}
          </div>

          {/* 播放控制按钮 */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={prevTrack}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 p-1"
            >
              <SkipBack className="h-3 w-3" />
            </Button>

            <Button
              onClick={togglePlay}
              size="sm"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-2"
            >
              {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>

            <Button
              onClick={nextTrack}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 p-1"
            >
              <SkipForward className="h-3 w-3" />
            </Button>
          </div>

          {/* 音量控制 */}
          <div className="flex items-center space-x-2 mt-2">
            <Button
              onClick={toggleMute}
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 p-1"
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicPlayer

