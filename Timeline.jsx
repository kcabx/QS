import { useState } from 'react'
import { Heart, Calendar, Image, Video, Music, MessageCircle, ArrowLeft, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import soundManager from '../utils/soundManager'

const Timeline = ({ onBack }) => {
  const [selectedMemory, setSelectedMemory] = useState(null)

  // 示例回忆数据
  const memories = [
    {
      id: 1,
      date: '2023-02-14',
      title: '第一次相遇',
      type: 'text',
      location: '咖啡厅',
      content: '那是一个阳光明媚的下午，我们在那家小咖啡厅第一次相遇。你点了一杯拿铁，我点了美式咖啡。从那一刻起，我就知道你会是我生命中最重要的人。',
      mood: '💕',
      weather: '☀️'
    },
    {
      id: 2,
      date: '2023-03-20',
      title: '第一次约会',
      type: 'image',
      location: '公园',
      content: '我们一起在公园里散步，看着樱花飘落。你说这是你见过最美的春天，而我觉得最美的是你的笑容。',
      mood: '🌸',
      weather: '🌤️',
      media: '/api/placeholder/400/300'
    },
    {
      id: 3,
      date: '2023-05-01',
      title: '第一次旅行',
      type: 'video',
      location: '海边',
      content: '我们第一次一起旅行，去了那个美丽的海边小镇。海风轻抚，夕阳西下，你说这是你最难忘的五一假期。',
      mood: '🌊',
      weather: '🌅',
      media: '/api/placeholder/video'
    },
    {
      id: 4,
      date: '2023-07-15',
      title: '生日惊喜',
      type: 'audio',
      location: '家里',
      content: '你的生日那天，我为你准备了一个小惊喜。虽然不是什么贵重的礼物，但看到你开心的样子，我觉得一切都值得了。',
      mood: '🎂',
      weather: '🌟',
      media: '/api/placeholder/audio'
    },
    {
      id: 5,
      date: '2023-09-10',
      title: '一起学习的日子',
      type: 'text',
      location: '图书馆',
      content: '我们一起在图书馆学习，虽然有时候会偷偷看你专注的样子。那些安静的午后时光，是我们最珍贵的回忆之一。',
      mood: '📚',
      weather: '🍂'
    },
    {
      id: 6,
      date: '2023-12-25',
      title: '第一个圣诞节',
      type: 'image',
      location: '家里',
      content: '我们一起度过的第一个圣诞节，装饰圣诞树，交换礼物，一起看电影。那种温馨的感觉，让我觉得家就是有你的地方。',
      mood: '🎄',
      weather: '❄️',
      media: '/api/placeholder/400/300'
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      case 'audio': return <Music className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'from-green-500 to-emerald-500'
      case 'video': return 'from-red-500 to-pink-500'
      case 'audio': return 'from-purple-500 to-violet-500'
      default: return 'from-blue-500 to-cyan-500'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      monthName: date.toLocaleDateString('zh-CN', { month: 'long' })
    }
  }

  // 处理回忆卡片点击
  const handleMemoryClick = (memoryId) => {
    soundManager.playClick()
    setSelectedMemory(memoryId)
  }

  // 处理返回点击
  const handleBackClick = () => {
    soundManager.playClick()
    if (selectedMemory) {
      setSelectedMemory(null)
    } else {
      onBack()
    }
  }

  if (selectedMemory) {
    const memory = memories.find(m => m.id === selectedMemory)
    const dateInfo = formatDate(memory.date)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* 星空背景 */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }, (_, i) => (
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

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* 返回按钮 */}
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="mb-6 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回时间线
          </Button>

          {/* 回忆详情 */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8">
                {/* 头部信息 */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 bg-gradient-to-r ${getTypeColor(memory.type)} rounded-full`}>
                      {getTypeIcon(memory.type)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-1">{memory.title}</h1>
                      <div className="flex items-center space-x-4 text-white/70 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{dateInfo.year}年{dateInfo.month}月{dateInfo.day}日</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{memory.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl mb-2">{memory.mood}</div>
                    <div className="text-2xl">{memory.weather}</div>
                  </div>
                </div>

                {/* 媒体内容 */}
                {memory.media && (
                  <div className="mb-6">
                    {memory.type === 'image' && (
                      <div className="rounded-lg overflow-hidden bg-white/5 p-4">
                        <div className="aspect-video bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white/60">
                            <Image className="h-12 w-12 mx-auto mb-2" />
                            <p>照片预览区域</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {memory.type === 'video' && (
                      <div className="rounded-lg overflow-hidden bg-white/5 p-4">
                        <div className="aspect-video bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white/60">
                            <Video className="h-12 w-12 mx-auto mb-2" />
                            <p>视频预览区域</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {memory.type === 'audio' && (
                      <div className="rounded-lg overflow-hidden bg-white/5 p-4">
                        <div className="h-24 bg-gradient-to-br from-purple-400/20 to-violet-400/20 rounded-lg flex items-center justify-center">
                          <div className="text-center text-white/60">
                            <Music className="h-8 w-8 mx-auto mb-2" />
                            <p>音频播放器</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 文字内容 */}
                <div className="bg-white/5 rounded-lg p-6">
                  <p className="text-white/90 leading-relaxed text-lg">
                    {memory.content}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">我们的时间线</h1>
              <p className="text-white/70">记录每一个美好的瞬间</p>
            </div>
          </div>
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回首页
          </Button>
        </div>

        {/* 时间线 */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* 时间线主轴 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400"></div>

            {/* 回忆节点 */}
            <div className="space-y-8">
              {memories.map((memory, index) => {
                const dateInfo = formatDate(memory.date)
                const isLeft = index % 2 === 0

                return (
                  <div key={memory.id} className={`relative flex items-center ${isLeft ? 'justify-start' : 'justify-end'}`}>
                    {/* 时间线节点 */}
                    <div className="absolute left-8 transform -translate-x-1/2 z-10">
                      <div className={`w-4 h-4 bg-gradient-to-r ${getTypeColor(memory.type)} rounded-full border-2 border-white shadow-lg`}></div>
                    </div>

                    {/* 回忆卡片 */}
                    <div className={`w-full max-w-md ${isLeft ? 'ml-16' : 'mr-16'}`}>
                      <Card 
                        className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                        onClick={() => handleMemoryClick(memory.id)}
                      >
                        <CardContent className="p-6">
                          {/* 日期标签 */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-white/60 text-sm">
                              {dateInfo.year}年{dateInfo.monthName}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{memory.mood}</span>
                              <span className="text-lg">{memory.weather}</span>
                            </div>
                          </div>

                          {/* 标题和类型 */}
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 bg-gradient-to-r ${getTypeColor(memory.type)} rounded-lg text-white group-hover:scale-110 transition-transform`}>
                              {getTypeIcon(memory.type)}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white group-hover:text-pink-200 transition-colors">
                                {memory.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-white/60 text-sm">
                                <MapPin className="h-3 w-3" />
                                <span>{memory.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* 内容预览 */}
                          <p className="text-white/80 text-sm line-clamp-2">
                            {memory.content}
                          </p>

                          {/* 查看更多提示 */}
                          <div className="mt-3 text-pink-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            点击查看详情 →
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 底部装饰 */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-white/60 text-sm">
            <Heart className="h-4 w-4 text-pink-400" />
            <span>每一个回忆都是我们爱情故事的一页</span>
            <Heart className="h-4 w-4 text-pink-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline

