import { useCallback, useEffect, useState } from 'react'
import client from '../api/client'

const DEFAULT_STATS = {
  farmers: 0,
  labourers: 0,
  jobsPosted: 0,
  successfulHirings: 0,
  successRate: 0,
}

export function usePlatformStats({ refreshKey = 0 } = {}) {
  const [stats, setStats] = useState(DEFAULT_STATS)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await client.get('/public/stats')
      setStats({ ...DEFAULT_STATS, ...res.data.payload })
    } catch {
      setStats(DEFAULT_STATS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load, refreshKey])

  useEffect(() => {
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [load])

  useEffect(() => {
    const interval = setInterval(load, 20000)
    return () => clearInterval(interval)
  }, [load])

  return { stats, loading, refresh: load }
}
