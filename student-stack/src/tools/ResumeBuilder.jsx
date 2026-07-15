import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Download, ArrowLeft } from 'lucide-react'
import { useUserData } from '../hooks/useUserData.js'
import { toast } from '../components/Toast.jsx'

const DEFAULT = {
  name: '', title: '', email: '', phone: '', location: '', website: '',
  summary: '', skills: '', certs: '', langs: '',
  edu: [], exp: [], proj: [],
}

// ─── sub-components ──────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="mb-3.5">
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function SectionBlock({ title, onAdd, children }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-ink-200">{title}</h4>
        {onAdd && (
          <button onClick={onAdd} className="btn-ghost text-xs gap-1 text-volt-400 hover:text-volt-300">
            <Plus size={13} /> Add
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── live resume preview ─────────────────────────────────────────────────────
function ResumePreview({ d }) {
  const skills = (d.skills || '').split(',').map(s => s.trim()).filter(Boolean)
  const certs  = (d.certs  || '').split(',').map(s => s.trim()).filter(Boolean)
  const langs  = (d.langs  || '').split(',').map(s => s.trim()).filter(Boolean)
  const contacts = [d.email, d.phone, d.location, d.website].filter(Boolean)

  return (
    <div id="resume-preview-doc" className="bg-white text-[#1a1a2e] font-sans" style={{ fontFamily: "'DM Sans',sans-serif", padding: '32px 36px', fontSize: '11.5px', lineHeight: 1.55, minHeight: '560px' }}>
      {/* header */}
      {d.name && <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '2px' }}>{d.name}</div>}
      {d.title && <div style={{ fontSize: '12px', color: '#5b6df5', fontWeight: 600, marginBottom: '8px' }}>{d.title}</div>}
      {contacts.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '10px', color: '#555', marginBottom: '14px', paddingBottom: '12px', borderBottom: '2px solid #5b6df5' }}>
          {contacts.map(c => <span key={c}>{c}</span>)}
        </div>
      )}
      {d.summary && (
        <div style={{ fontSize: '11px', color: '#444', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #eee', lineHeight: 1.65 }}>{d.summary}</div>
      )}

      {/* education */}
      {d.edu.some(e => e.inst || e.deg) && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Education</div>
          {d.edu.filter(e => e.inst || e.deg).map((e, i) => (
            <div key={i} style={{ marginBottom: '7px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '11px' }}>{e.inst}</span>
                <span style={{ fontSize: '10px', color: '#999' }}>{e.year}</span>
              </div>
              <div style={{ fontSize: '10px', color: '#444' }}>{[e.deg, e.gpa].filter(Boolean).join(' · ')}</div>
            </div>
          ))}
        </div>
      )}

      {/* experience */}
      {d.exp.some(e => e.company || e.role) && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Experience</div>
          {d.exp.filter(e => e.company || e.role).map((e, i) => (
            <div key={i} style={{ marginBottom: '9px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '11px', color: '#5b6df5' }}>{e.role}</span>
                <span style={{ fontSize: '10px', color: '#999' }}>{e.duration}</span>
              </div>
              <div style={{ fontSize: '10px', color: '#555', marginBottom: '3px' }}>{e.company}</div>
              {e.desc && <div style={{ fontSize: '10.5px', color: '#555', lineHeight: 1.5 }}>{e.desc}</div>}
            </div>
          ))}
        </div>
      )}

      {/* projects */}
      {d.proj.some(p => p.name) && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Projects</div>
          {d.proj.filter(p => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '11px' }}>{p.name}</span>
                {p.link && <span style={{ fontSize: '10px', color: '#5b6df5' }}>{p.link}</span>}
              </div>
              {p.tech && <div style={{ fontSize: '10px', color: '#777', marginBottom: '2px' }}>{p.tech}</div>}
              {p.desc && <div style={{ fontSize: '10.5px', color: '#555', lineHeight: 1.5 }}>{p.desc}</div>}
            </div>
          ))}
        </div>
      )}

      {/* skills */}
      {skills.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {skills.map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: '4px', background: '#eef0ff', color: '#5b6df5', fontSize: '9.5px', fontWeight: 600, border: '1px solid #d4d8ff' }}>{s}</span>)}
          </div>
        </div>
      )}

      {/* certs */}
      {certs.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Certifications</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {certs.map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: '4px', background: '#f0fff4', color: '#059669', fontSize: '9.5px', fontWeight: 600, border: '1px solid #a7f3d0' }}>{s}</span>)}
          </div>
        </div>
      )}

      {/* languages */}
      {langs.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em', color: '#5b6df5', marginBottom: '6px' }}>Languages</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {langs.map(s => <span key={s} style={{ padding: '2px 8px', borderRadius: '4px', background: '#faf5ff', color: '#7c3aed', fontSize: '9.5px', fontWeight: 600, border: '1px solid #ddd6fe' }}>{s}</span>)}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── main component ──────────────────────────────────────────────────────────
export default function ResumeBuilder({ user, navigate }) {
  const [data, setData] = useUserData(user.email, 'resume', DEFAULT)

  const set = useCallback((key, val) => setData(prev => ({ ...prev, [key]: val })), [setData])

  const addEdu  = () => setData(p => ({ ...p, edu:  [...p.edu,  { inst:'', deg:'', year:'', gpa:'' }] }))
  const addExp  = () => setData(p => ({ ...p, exp:  [...p.exp,  { company:'', role:'', duration:'', desc:'' }] }))
  const addProj = () => setData(p => ({ ...p, proj: [...p.proj, { name:'', tech:'', link:'', desc:'' }] }))

  const removeEdu  = (i) => setData(p => ({ ...p, edu:  p.edu.filter((_,j)=>j!==i) }))
  const removeExp  = (i) => setData(p => ({ ...p, exp:  p.exp.filter((_,j)=>j!==i) }))
  const removeProj = (i) => setData(p => ({ ...p, proj: p.proj.filter((_,j)=>j!==i) }))

  const updateEdu  = (i, k, v) => setData(p => { const a=[...p.edu];  a[i]={...a[i],[k]:v}; return {...p,edu:a}  })
  const updateExp  = (i, k, v) => setData(p => { const a=[...p.exp];  a[i]={...a[i],[k]:v}; return {...p,exp:a}  })
  const updateProj = (i, k, v) => setData(p => { const a=[...p.proj]; a[i]={...a[i],[k]:v}; return {...p,proj:a} })

  const downloadPDF = () => {
    const doc = document.getElementById('resume-preview-doc')
    if (!doc) return
    const w = window.open('', '_blank')
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${data.name || 'Resume'}</title>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>body{margin:0;padding:0}*{box-sizing:border-box}@media print{body{-webkit-print-color-adjust:exact}}</style>
    </head><body>${doc.outerHTML}</body></html>`)
    w.document.close()
    setTimeout(() => { w.print(); }, 700)
    toast.success('Opening print dialog — save as PDF')
  }

  return (
    <div className="tool-page pt-20">
      {/* header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <button onClick={() => navigate('home')} className="btn-ghost gap-1.5 text-ink-400">
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">📄 Resume Builder</h1>
          <p className="text-ink-400 text-sm mt-0.5">Live preview · Auto-saves to your account</p>
        </div>
        <button onClick={downloadPDF} className="ml-auto btn-primary gap-2">
          <Download size={14} /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* EDITOR */}
        <div className="flex flex-col gap-4">
          <SectionBlock title="Personal Information">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Full Name">
                <input className="input-field" placeholder="Your full name" value={data.name} onChange={e => set('name', e.target.value)} />
              </Field>
              <Field label="Headline / Role">
                <input className="input-field" placeholder="e.g. Computer Science Student" value={data.title} onChange={e => set('title', e.target.value)} />
              </Field>
              <Field label="Email">
                <input className="input-field" type="email" placeholder="you@example.com" value={data.email} onChange={e => set('email', e.target.value)} />
              </Field>
              <Field label="Phone">
                <input className="input-field" placeholder="+91 98765 43210" value={data.phone} onChange={e => set('phone', e.target.value)} />
              </Field>
              <Field label="Location">
                <input className="input-field" placeholder="City, Country" value={data.location} onChange={e => set('location', e.target.value)} />
              </Field>
              <Field label="Website / LinkedIn">
                <input className="input-field" placeholder="linkedin.com/in/yourname" value={data.website} onChange={e => set('website', e.target.value)} />
              </Field>
            </div>
            <Field label="Professional Summary">
              <textarea className="input-field" rows={3} placeholder="2–3 lines about who you are, what you can do, and what you're looking for…" value={data.summary} onChange={e => set('summary', e.target.value)} />
            </Field>
          </SectionBlock>

          <SectionBlock title="Education" onAdd={addEdu}>
            {data.edu.length === 0 && <p className="text-ink-500 text-sm">No entries yet — click Add.</p>}
            {data.edu.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-ink-900/60 rounded-xl p-4 mb-3 relative">
                <button onClick={() => removeEdu(i)} className="absolute top-3 right-3 btn-danger p-1.5"><Trash2 size={12} /></button>
                <div className="grid grid-cols-2 gap-3 pr-8">
                  <Field label="Institution"><input className="input-field" placeholder="University / College" value={e.inst} onChange={ev => updateEdu(i,'inst',ev.target.value)} /></Field>
                  <Field label="Degree / Field"><input className="input-field" placeholder="B.Tech Computer Science" value={e.deg} onChange={ev => updateEdu(i,'deg',ev.target.value)} /></Field>
                  <Field label="Year"><input className="input-field" placeholder="2021 – 2025" value={e.year} onChange={ev => updateEdu(i,'year',ev.target.value)} /></Field>
                  <Field label="GPA / %"><input className="input-field" placeholder="8.4 / 10" value={e.gpa} onChange={ev => updateEdu(i,'gpa',ev.target.value)} /></Field>
                </div>
              </motion.div>
            ))}
          </SectionBlock>

          <SectionBlock title="Work Experience" onAdd={addExp}>
            {data.exp.length === 0 && <p className="text-ink-500 text-sm">No entries yet — click Add.</p>}
            {data.exp.map((e, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-ink-900/60 rounded-xl p-4 mb-3 relative">
                <button onClick={() => removeExp(i)} className="absolute top-3 right-3 btn-danger p-1.5"><Trash2 size={12} /></button>
                <div className="grid grid-cols-2 gap-3 pr-8">
                  <Field label="Company"><input className="input-field" placeholder="Company name" value={e.company} onChange={ev => updateExp(i,'company',ev.target.value)} /></Field>
                  <Field label="Role / Position"><input className="input-field" placeholder="Software Engineer Intern" value={e.role} onChange={ev => updateExp(i,'role',ev.target.value)} /></Field>
                </div>
                <Field label="Duration"><input className="input-field" placeholder="May 2024 – Aug 2024" value={e.duration} onChange={ev => updateExp(i,'duration',ev.target.value)} /></Field>
                <Field label="Key Achievements">
                  <textarea className="input-field" rows={2} placeholder="What did you build, improve, or accomplish? Use numbers where possible." value={e.desc} onChange={ev => updateExp(i,'desc',ev.target.value)} />
                </Field>
              </motion.div>
            ))}
          </SectionBlock>

          <SectionBlock title="Projects" onAdd={addProj}>
            {data.proj.length === 0 && <p className="text-ink-500 text-sm">No entries yet — click Add.</p>}
            {data.proj.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-ink-900/60 rounded-xl p-4 mb-3 relative">
                <button onClick={() => removeProj(i)} className="absolute top-3 right-3 btn-danger p-1.5"><Trash2 size={12} /></button>
                <div className="grid grid-cols-2 gap-3 pr-8">
                  <Field label="Project Name"><input className="input-field" placeholder="Project title" value={p.name} onChange={ev => updateProj(i,'name',ev.target.value)} /></Field>
                  <Field label="Tech Stack"><input className="input-field" placeholder="React, Node.js, MongoDB" value={p.tech} onChange={ev => updateProj(i,'tech',ev.target.value)} /></Field>
                </div>
                <Field label="Link (optional)"><input className="input-field" placeholder="github.com/you/project" value={p.link} onChange={ev => updateProj(i,'link',ev.target.value)} /></Field>
                <Field label="Description">
                  <textarea className="input-field" rows={2} placeholder="What it does and what impact it had…" value={p.desc} onChange={ev => updateProj(i,'desc',ev.target.value)} />
                </Field>
              </motion.div>
            ))}
          </SectionBlock>

          <SectionBlock title="Skills, Certifications & Languages">
            <Field label="Technical Skills (comma-separated)">
              <input className="input-field" placeholder="Python, React, SQL, Figma, AWS…" value={data.skills} onChange={e => set('skills', e.target.value)} />
            </Field>
            <Field label="Certifications (comma-separated)">
              <input className="input-field" placeholder="AWS Cloud Practitioner, Google Analytics…" value={data.certs} onChange={e => set('certs', e.target.value)} />
            </Field>
            <Field label="Languages">
              <input className="input-field" placeholder="English (Fluent), Hindi (Native)…" value={data.langs} onChange={e => set('langs', e.target.value)} />
            </Field>
          </SectionBlock>
        </div>

        {/* LIVE PREVIEW */}
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <p className="panel-title mb-0">Live Preview</p>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">Auto-saving</span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-card border border-white/[0.06]">
            <ResumePreview d={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
