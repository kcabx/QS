// 音效管理器
class SoundManager {
  constructor() {
    this.sounds = {}
    this.enabled = true
    this.volume = 0.3
  }

  // 创建音效（使用Web Audio API生成简单音效）
  createClickSound() {
    if (!this.enabled) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // 设置音效参数 - 轻柔的"叮"声
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(this.volume, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.type = 'sine'
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.log('音效播放失败:', error)
    }
  }

  // 创建成功音效
  createSuccessSound() {
    if (!this.enabled) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // 播放三个音符的和弦
      const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime)
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8)

        oscillator.type = 'sine'
        oscillator.start(audioContext.currentTime + index * 0.1)
        oscillator.stop(audioContext.currentTime + 0.8)
      })
    } catch (error) {
      console.log('成功音效播放失败:', error)
    }
  }

  // 创建心跳音效
  createHeartbeatSound() {
    if (!this.enabled) return

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // 创建两个心跳声
      for (let i = 0; i < 2; i++) {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.setValueAtTime(60, audioContext.currentTime + i * 0.15)
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.15)
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, audioContext.currentTime + i * 0.15 + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.1)

        oscillator.type = 'triangle'
        oscillator.start(audioContext.currentTime + i * 0.15)
        oscillator.stop(audioContext.currentTime + i * 0.15 + 0.1)
      }
    } catch (error) {
      console.log('心跳音效播放失败:', error)
    }
  }

  // 播放点击音效
  playClick() {
    this.createClickSound()
  }

  // 播放成功音效
  playSuccess() {
    this.createSuccessSound()
  }

  // 播放心跳音效
  playHeartbeat() {
    this.createHeartbeatSound()
  }

  // 设置音量
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
  }

  // 启用/禁用音效
  setEnabled(enabled) {
    this.enabled = enabled
  }

  // 获取音效状态
  isEnabled() {
    return this.enabled
  }
}

// 创建全局音效管理器实例
const soundManager = new SoundManager()

export default soundManager

