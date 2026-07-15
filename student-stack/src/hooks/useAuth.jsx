import { useState, useCallback } from 'react'
import { getUsers, saveUsers, getSession, setSession, clearSession } from '../utils/storage.js'

export function useAuth() {
  const [user, setUser] = useState(() => {
    const email = getSession()
    if (!email) return null
    const users = getUsers()
    return users[email] || null
  })

  const signup = useCallback((firstName, lastName, email, password) => {
    const users = getUsers()
    if (users[email]) return { ok: false, error: 'An account with this email already exists.' }
    const newUser = { firstName, lastName, email, password }
    users[email] = newUser
    saveUsers(users)
    setSession(email)
    setUser(newUser)
    return { ok: true }
  }, [])

  const login = useCallback((email, password) => {
    const users = getUsers()
    if (!users[email]) return { ok: false, error: 'No account found with this email.' }
    if (users[email].password !== password) return { ok: false, error: 'Incorrect password.' }
    setSession(email)
    setUser(users[email])
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return { user, signup, login, logout }
}
