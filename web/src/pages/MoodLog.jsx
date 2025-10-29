import React, { useState } from 'react'
import EmojiGrid from '../components/EmojiGrid'
import MoodSlider from '../components/MoodSlider'
import TipCard from '../components/TipCard'
import NotificationToggle from '../components/NotificationToggle'
import { useAppStore } from '../store/useAppStore'
import { logMood } from '../api/client'

export default function MoodLog() {
  const { userId, moodLog, setEmoji, setScale, setLastResponse } = useAppStore()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await logMood({ userId, emoji: moodLog.emoji, scale: moodLog.scale })
      setLastResponse(res)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="card space-y-3">
          <div>
            <div className="text-sm text-gray-600 mb-1">How do you feel?</div>
            <EmojiGrid value={moodLog.emoji} onChange={setEmoji} />
          </div>
          <MoodSlider value={moodLog.scale} onChange={setScale} />
          <button type="submit" className="btn w-full" disabled={loading}>{loading ? 'Saving…' : 'Save mood'}</button>
        </div>
      </form>

      <TipCard tip={useAppStore.getState().lastResponse?.tip} />

      <NotificationToggle />
    </div>
  )
}
