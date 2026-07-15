export const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('ss_users')) || {} }
  catch { return {} }
}
export const saveUsers = (u) => localStorage.setItem('ss_users', JSON.stringify(u))
export const getSession = () => localStorage.getItem('ss_session')
export const setSession = (email) => localStorage.setItem('ss_session', email)
export const clearSession = () => localStorage.removeItem('ss_session')

const userKey = (email, key) => `ss_${email}_${key}`

export const saveUserData = (email, key, val) =>
  localStorage.setItem(userKey(email, key), JSON.stringify(val))

export const loadUserData = (email, key, fallback) => {
  try {
    const v = localStorage.getItem(userKey(email, key))
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}
