import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Menu, X, ChevronRight, LogOut } from 'lucide-react'

const TOOLS = [
  { id: 'resume',    label: 'Resume' },
  { id: 'gpa',       label: 'GPA' },
  { id: 'notes',     label: 'Notes' },
  { id: 'timetable', label: 'Timetable' },
]

export default function Navbar({ page, navigate, user, onLogout }) {
  const [open, setOpen] = useState(false)

  const go = (p) => { navigate(p); setOpen(false) }

  const initials = user
    ? (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase()
    : '?'
  const displayName = user ? user.firstName : 'Guest'

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3">
        <div className="max-w-7xl mx-auto glass rounded-2xl flex items-center gap-3 px-5 py-3">
          {/* Logo */}
          <button onClick={() => go('home')} className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-volt-500 flex items-center justify-center shadow-volt group-hover:scale-105 transition-transform">
              <Layers size={15} className="text-white" />
            </div>
            <span className="font-bold text-[15px] text-white hidden sm:block">Student Stack</span>
          </button>

          {/* Nav links desktop */}
          <div className="hidden md:flex items-center gap-1 ml-2">
            {TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`btn-ghost text-[13px] ${page === t.id ? 'text-volt-300 bg-volt-500/10' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-ink-700/60 border border-white/[0.07]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-volt-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                {initials}
              </div>
              <span className="text-[13px] font-semibold text-ink-200">{displayName}</span>
            </div>

            <button
              onClick={onLogout}
              className="hidden sm:flex btn-ghost text-[13px] text-ink-400 gap-1.5"
            >
              <LogOut size={13} /> Sign out
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-ink-300 hover:text-white hover:bg-ink-700/60 transition-all"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-[72px] left-4 right-4 z-50 glass rounded-2xl p-4 flex flex-col gap-1"
          >
            <div className="flex items-center gap-3 px-3 py-2 mb-2 border-b border-white/[0.06]">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-volt-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white">
                {initials}
              </div>
              <span className="text-sm font-semibold text-ink-200">{displayName}</span>
            </div>
            {TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${page === t.id ? 'bg-volt-500/15 text-volt-300' : 'text-ink-200 hover:bg-ink-700/60 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex gap-2">
              <button onClick={() => go('resume')} className="btn-primary flex-1 justify-center text-[13px]">
                Get started <ChevronRight size={13} />
              </button>
              <button onClick={() => { onLogout(); setOpen(false) }} className="btn-ghost text-[13px]">
                <LogOut size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
