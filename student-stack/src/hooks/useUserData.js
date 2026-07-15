import { useState, useCallback } from 'react'
import { saveUserData, loadUserData } from '../utils/storage.js'

export function useUserData(email, key, fallback) {
  const [data, setData] = useState(() => loadUserData(email, key, fallback))

  const update = useCallback((valOrFn) => {
    setData(prev => {
      const next = typeof valOrFn === 'function' ? valOrFn(prev) : valOrFn
      saveUserData(email, key, next)
      return next
    })
  }, [email, key])

  return [data, update]
}
