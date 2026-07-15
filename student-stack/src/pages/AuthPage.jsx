import { useState } from 'react'
import { motion } from 'framer-motion'
import { Layers, Eye, EyeOff } from 'lucide-react'

export default function AuthPage({ onLogin, onSignup }) {
  const [tab, setTab]           = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [err, setErr]           = useState('')
  const [loading, setLoading]   = useState(false)

  // Login state
  const [lEmail, setLEmail] = useState('')
  const [lPass,  setLPass]  = useState('')

  // Signup state
  const [sFirst, setSFirst] = useState('')
  const [sLast,  setSLast]  = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPass,  setSPass]  = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setErr('')
    if (!lEmail || !lPass) return setErr('Please fill in all fields.')
    setLoading(true)
    setTimeout(() => {
      const res = onLogin(lEmail.trim().toLowerCase(), lPass)
      if (!res.ok) setErr(res.error)
      setLoading(false)
    }, 300)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    setErr('')
    if (!sFirst.trim()) return setErr('First name is required.')
    if (!sEmail.includes('@')) return setErr('Enter a valid email address.')
    if (sPass.length < 6) return setErr('Password must be at least 6 characters.')
    setLoading(true)
    setTimeout(() => {
      const res = onSignup(sFirst.trim(), sLast.trim(), sEmail.trim().toLowerCase(), sPass)
      if (!res.ok) setErr(res.error)
      setLoading(false)
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-volt-500/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-volt-500 flex items-center justify-center shadow-volt">
            <Layers size={17} className="text-white" />
          </div>
          <span className="font-bold text-xl text-white">Student Stack</span>
        </div>

        <div className="glass rounded-3xl p-8">
          {/* Tabs */}
          <div className="flex gap-1 bg-ink-900/60 rounded-xl p-1 mb-7">
            {['login', 'signup'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setErr('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize
                  ${tab === t
                    ? 'bg-ink-700 text-white shadow-sm'
                    : 'text-ink-400 hover:text-ink-200'}`}
              >
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {err && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {err}
            </div>
          )}

          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com"
                  value={lEmail} onChange={e => setLEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
                    placeholder="Your password"
                    value={lPass} onChange={e => setLPass(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* SIGNUP */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">First Name</label>
                  <input className="input-field" type="text" placeholder="Riya"
                    value={sFirst} onChange={e => setSFirst(e.target.value)} />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input className="input-field" type="text" placeholder="Khanna"
                    value={sLast} onChange={e => setSLast(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input-field" type="email" placeholder="you@example.com"
                  value={sEmail} onChange={e => setSEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
                    placeholder="Minimum 6 characters"
                    value={sPass} onChange={e => setSPass(e.target.value)} />
                  <button type="button" onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-200 transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-ink-500 text-xs mt-5">
            Your data is stored locally — no server, fully private.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
