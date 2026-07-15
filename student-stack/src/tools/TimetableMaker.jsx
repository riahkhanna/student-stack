import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X, Trash2 } from 'lucide-react'
import { useUserData } from '../hooks/useUserData.js'
import { toast } from '../components/Toast.jsx'

const DAYS  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const TIMES = ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00']
const COLORS = ['#5b6df5','#10d48e','#a855f7','#fbbf24','#f43f5e','#06b6d4','#ec4899','#f97316','#84cc16','#ef4444']

function ColorDot({ color, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(color)}
      className="w-7 h-7 rounded-lg transition-all duration-150 shrink-0"
      style={{
        background: color,
        outline: selected ? `2px solid white` : 'none',
        outlineOffset: '2px',
        transform: selected ? 'scale(1.2)' : 'scale(1)',
      }}
    />
  )
}

export default function TimetableMaker({ user, navigate }) {
  const [cells, setCells]       = useUserData(user.email, 'timetable', {})
  const [subject, setSubject]   = useState('')
  const [room,    setRoom]      = useState('')
  const [color,   setColor]     = useState(COLORS[0])
  const [modal,   setModal]     = useState(null)  // { key, cell } | null

  const addCell = useCallback((key) => {
    if (!subject.trim()) { toast.error('Enter a subject name first'); return }
    setCells(p => ({ ...p, [key]: { name: subject.trim(), room: room.trim(), color } }))
    toast.success(`${subject.trim()} added`)
  }, [subject, room, color, setCells])

  const removeCell = useCallback((key) => {
    setCells(p => { const n = { ...p }; delete n[key]; return n })
    setModal(null)
    toast.info('Slot removed')
  }, [setCells])

  const saveModal = () => {
    if (!modal) return
    const name = document.getElementById('modal-name')?.value.trim()
    const rm   = document.getElementById('modal-room')?.value.trim()
    if (!name) { toast.error('Subject name required'); return }
    setCells(p => ({ ...p, [modal.key]: { ...modal.cell, name, room: rm } }))
    setModal(null)
    toast.success('Updated!')
  }

  const clearAll = () => {
    if (Object.keys(cells).length === 0) return
    if (!window.confirm('Clear the entire timetable?')) return
    setCells({})
    toast.info('Timetable cleared')
  }

  // legend: unique subjects
  const legend = {}
  Object.values(cells).forEach(c => { legend[c.name] = c.color })

  return (
    <div className="tool-page pt-20">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <button onClick={() => navigate('home')} className="btn-ghost gap-1.5 text-ink-400">
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">📅 Timetable Maker</h1>
          <p className="text-ink-400 text-sm mt-0.5">Saved to your account · Click any slot to edit</p>
        </div>
        <button onClick={clearAll} className="ml-auto btn-danger gap-1.5">
          <Trash2 size={13} /> Clear all
        </button>
      </div>

      {/* Quick-add bar */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="panel-title">Add a Class</div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[160px]">
            <label className="label">Subject Name</label>
            <input className="input-field" placeholder="e.g. Mathematics" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="w-36">
            <label className="label">Room (optional)</label>
            <input className="input-field" placeholder="Room 101" value={room} onChange={e => setRoom(e.target.value)} />
          </div>
          <div>
            <label className="label">Color</label>
            <div className="flex gap-1.5 flex-wrap mt-0.5">
              {COLORS.map(c => <ColorDot key={c} color={c} selected={color === c} onClick={setColor} />)}
            </div>
          </div>
        </div>
        <p className="text-ink-500 text-xs mt-3">Fill details above, then click any empty slot in the grid.</p>
      </div>

      {/* Grid */}
      <div className="glass rounded-2xl p-5 overflow-x-auto">
        <div style={{ minWidth: '680px' }}>
          {/* Day headers */}
          <div className="grid mb-2" style={{ gridTemplateColumns: '56px repeat(6,1fr)', gap: '4px' }}>
            <div />
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-ink-400 uppercase tracking-wider py-1.5">
                {d.slice(0,3)}
              </div>
            ))}
          </div>

          {/* Rows */}
          {TIMES.map((time, ti) => (
            <div key={time} className="grid mb-1" style={{ gridTemplateColumns: '56px repeat(6,1fr)', gap: '4px' }}>
              <div className="flex items-center justify-end pr-2 text-[10px] text-ink-500 font-mono">
                {time}
              </div>
              {DAYS.map((_, di) => {
                const key = `${di}_${ti}`
                const cell = cells[key]
                return cell ? (
                  <motion.div
                    key={key}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => setModal({ key, cell })}
                    className="rounded-lg px-2 py-1.5 cursor-pointer transition-all duration-150 hover:brightness-110"
                    style={{ background: cell.color + '22', borderLeft: `3px solid ${cell.color}`, minHeight: '48px' }}
                  >
                    <p className="text-[11px] font-bold leading-tight" style={{ color: cell.color }}>{cell.name}</p>
                    {cell.room && <p className="text-[9px] text-ink-400 mt-0.5">{cell.room}</p>}
                  </motion.div>
                ) : (
                  <div
                    key={key}
                    onClick={() => addCell(key)}
                    className="rounded-lg border border-white/[0.05] bg-ink-900/30 min-h-[48px] flex items-center justify-center cursor-pointer transition-all hover:border-volt-500/40 hover:bg-volt-500/5 group"
                  >
                    <span className="text-ink-600 text-lg group-hover:text-volt-500 transition-colors">+</span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        {Object.keys(legend).length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-wrap gap-3">
            {Object.entries(legend).map(([name, c]) => (
              <div key={name} className="flex items-center gap-1.5 text-xs text-ink-300">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: c }} />
                {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            onClick={e => e.target === e.currentTarget && setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="glass-bright rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-base">Edit Slot</h3>
                <button onClick={() => setModal(null)} className="btn-ghost p-1.5"><X size={15} /></button>
              </div>
              <div className="mb-3.5">
                <label className="label">Subject Name</label>
                <input id="modal-name" className="input-field" defaultValue={modal.cell.name} />
              </div>
              <div className="mb-5">
                <label className="label">Room (optional)</label>
                <input id="modal-room" className="input-field" defaultValue={modal.cell.room} />
              </div>
              <div className="flex gap-2.5">
                <button onClick={saveModal} className="btn-primary flex-1 justify-center">Save</button>
                <button onClick={() => removeCell(modal.key)} className="btn-danger gap-1.5">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
