import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useUserData } from '../hooks/useUserData.js'

const GRADE = (m) => {
  if (m >= 90) return { g: 'A+', pts: 10, color: '#10d48e' }
  if (m >= 80) return { g: 'A',  pts: 9,  color: '#10d48e' }
  if (m >= 70) return { g: 'B+', pts: 8,  color: '#7b8bff' }
  if (m >= 60) return { g: 'B',  pts: 7,  color: '#fbbf24' }
  if (m >= 50) return { g: 'C',  pts: 6,  color: '#f97316' }
  return             { g: 'F',  pts: 0,  color: '#f43f5e' }
}

const DEFAULT_SUBJECTS = []

export default function GPACalculator({ user, navigate }) {
  const [subjects, setSubjects] = useUserData(user.email, 'gpa_subjects', DEFAULT_SUBJECTS)

  const add    = () => setSubjects(p => [...p, { name: '', marks: '', credits: '' }])
  const remove = (i) => setSubjects(p => p.filter((_, j) => j !== i))
  const update = useCallback((i, key, val) => {
    setSubjects(p => { const a = [...p]; a[i] = { ...a[i], [key]: val }; return a })
  }, [setSubjects])

  const valid = subjects.filter(s => s.marks !== '' && Number(s.credits) > 0 && !isNaN(s.marks))
  const totalCredits = valid.reduce((a, s) => a + Number(s.credits), 0)
  const totalPoints  = valid.reduce((a, s) => a + GRADE(Number(s.marks)).pts * Number(s.credits), 0)
  const avgMarks     = valid.length ? valid.reduce((a, s) => a + Number(s.marks), 0) / valid.length : 0
  const gpa          = totalCredits ? (totalPoints / totalCredits).toFixed(2) : null

  return (
    <div className="tool-page pt-20">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <button onClick={() => navigate('home')} className="btn-ghost gap-1.5 text-ink-400">
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">🎓 GPA Calculator</h1>
          <p className="text-ink-400 text-sm mt-0.5">Subjects save automatically to your account</p>
        </div>
        <button onClick={() => { if(window.confirm('Clear all subjects?')) setSubjects([]) }} className="ml-auto btn-ghost text-ink-400 text-sm">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* subjects */}
        <div className="glass rounded-2xl p-6">
          <div className="panel-title">Subjects</div>

          {/* column headers */}
          <div className="grid grid-cols-[1fr_90px_90px_36px] gap-2 mb-3">
            {['Subject Name', 'Marks %', 'Credits', ''].map(h => (
              <div key={h} className="text-[10px] font-bold text-ink-500 uppercase tracking-wider">{h}</div>
            ))}
          </div>

          {subjects.length === 0 && (
            <p className="text-ink-500 text-sm py-4 text-center">No subjects yet — click Add Subject below.</p>
          )}

          {subjects.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-[1fr_90px_90px_36px] gap-2 mb-2">
              <input
                className="input-field text-sm"
                placeholder="Subject name"
                value={s.name}
                onChange={e => update(i, 'name', e.target.value)}
              />
              <input
                className="input-field text-sm text-center"
                type="number" min="0" max="100"
                placeholder="75"
                value={s.marks}
                onChange={e => update(i, 'marks', e.target.value)}
              />
              <input
                className="input-field text-sm text-center"
                type="number" min="1" max="6"
                placeholder="3"
                value={s.credits}
                onChange={e => update(i, 'credits', e.target.value)}
              />
              <button onClick={() => remove(i)} className="btn-danger p-0 w-9 h-9 justify-center shrink-0">
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}

          <button onClick={add} className="btn-ghost gap-1.5 text-volt-400 mt-3 text-sm">
            <Plus size={14} /> Add Subject
          </button>
        </div>

        {/* result */}
        <div className="sticky top-20 flex flex-col gap-4">
          <div className="rounded-2xl p-7 text-center" style={{ background: 'linear-gradient(135deg,rgba(91,109,245,0.14),rgba(168,85,247,0.07))', border: '1px solid rgba(91,109,245,0.2)' }}>
            <p className="panel-title mb-2">Current GPA</p>
            <div className="text-6xl font-extrabold mb-1" style={{ background: 'linear-gradient(135deg,#7b8bff,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {gpa || '—'}
            </div>
            <p className="text-ink-400 text-xs mb-6">
              {gpa ? `${GRADE(avgMarks).g} grade · ${valid.length} subject${valid.length !== 1 ? 's' : ''}` : 'Add subjects to calculate'}
            </p>

            {[
              { label: 'Total Credits', val: totalCredits || '0' },
              { label: 'Average Marks', val: valid.length ? avgMarks.toFixed(1) + '%' : '—' },
              { label: 'Subjects Added', val: subjects.length },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-0">
                <span className="text-ink-400 text-xs">{label}</span>
                <span className="text-white text-sm font-bold">{val}</span>
              </div>
            ))}
          </div>

          {/* grade bars */}
          {valid.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <div className="panel-title">Grade Breakdown</div>
              {valid.map((s, i) => {
                const g = GRADE(Number(s.marks))
                const name = s.name || `Subject ${i + 1}`
                return (
                  <div key={i} className="flex items-center gap-2 mb-2.5 text-xs">
                    <span className="text-ink-400 w-20 truncate shrink-0 text-right">{name}</span>
                    <div className="flex-1 h-1.5 bg-ink-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.marks}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: g.color }}
                      />
                    </div>
                    <span className="font-bold w-7 shrink-0 text-center" style={{ color: g.color }}>{g.g}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* grading scale */}
          <div className="glass rounded-2xl p-5">
            <div className="panel-title">Grading Scale</div>
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
              {[['A+','90-100','10.0','#10d48e'],['A','80-89','9.0','#10d48e'],['B+','70-79','8.0','#7b8bff'],['B','60-69','7.0','#fbbf24'],['C','50-59','6.0','#f97316']].map(([g,r,p,c]) => (
                <div key={g} className="bg-ink-900/60 rounded-lg p-2">
                  <div className="font-extrabold" style={{ color: c }}>{g}</div>
                  <div className="text-ink-500 text-[9px]">{r}</div>
                  <div className="text-ink-300 text-[10px] font-semibold">{p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
