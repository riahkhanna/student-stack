import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, FileText, Calculator, BookOpen, Calendar,
  Star, Users, TrendingUp, Clock, CheckCircle, ChevronDown,
  Zap, Shield, Sparkles
} from 'lucide-react'
import FadeIn from '../components/FadeIn.jsx'

// ─── tiny dashboard preview card ────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-3xl mx-auto mt-14">
      <div className="absolute inset-0 -m-8 bg-volt-500/8 rounded-3xl blur-3xl pointer-events-none" />
      <div className="glass rounded-2xl overflow-hidden border border-white/[0.08]">
        {/* window chrome */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-ink-900/40">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-400/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <div className="mx-auto text-xs text-ink-400 bg-ink-900/60 px-4 py-1 rounded-lg border border-white/[0.06] flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            studentstack.app/dashboard
          </div>
        </div>

        <div className="grid grid-cols-12 min-h-[300px]">
          {/* sidebar */}
          <div className="col-span-3 border-r border-white/[0.05] bg-ink-900/30 p-4 flex flex-col gap-1">
            <p className="text-[9px] font-bold text-ink-500 uppercase tracking-widest px-2 mb-2">Tools</p>
            {[
              { icon: FileText,   label: 'Resume',    active: true,  c: 'text-volt-400' },
              { icon: Calculator, label: 'GPA',       active: false, c: 'text-emerald-400' },
              { icon: BookOpen,   label: 'Notes',     active: false, c: 'text-purple-400' },
              { icon: Calendar,   label: 'Timetable', active: false, c: 'text-amber-400' },
            ].map(({ icon: Icon, label, active, c }) => (
              <div key={label} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[11px] font-medium
                ${active ? 'bg-volt-500/15 text-volt-300' : 'text-ink-400'}`}>
                <Icon size={12} className={c} />{label}
              </div>
            ))}
          </div>

          {/* main */}
          <div className="col-span-9 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: 'GPA', v: '3.84', c: 'text-emerald-400' },
                { l: 'Subjects', v: '6', c: 'text-volt-400' },
                { l: 'Notes', v: '24', c: 'text-purple-400' },
              ].map(({ l, v, c }) => (
                <div key={l} className="bg-ink-800/60 rounded-xl p-3 border border-white/[0.05]">
                  <p className="text-[9px] text-ink-400 mb-1">{l}</p>
                  <p className={`text-lg font-bold ${c}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-ink-800/40 rounded-xl p-3 border border-white/[0.05]">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-semibold text-ink-200">Grade Distribution</p>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 inline-block animate-pulse" />Live
                </span>
              </div>
              {[['Mathematics','92%',92,'#10d48e'],['Physics','78%',78,'#7b8bff'],['Chemistry','65%',65,'#fbbf24']].map(([s,p,w,c]) => (
                <div key={s} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] text-ink-400 w-20 shrink-0">{s}</span>
                  <div className="flex-1 h-1.5 bg-ink-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${w}%`, background: c }} />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: c }}>{p}</span>
                </div>
              ))}
            </div>
            <div className="bg-ink-800/40 rounded-xl p-3 border border-white/[0.05]">
              <p className="text-[10px] font-semibold text-ink-200 mb-2">Semester Progress</p>
              <div className="flex items-end gap-1.5 h-10">
                {[55,70,65,82,88,85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-volt-600/80 to-volt-400/50" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Is Student Stack completely free?', a: 'Yes — all four tools are 100% free, no hidden fees or premium tiers.' },
  { q: 'Do I need to create an account?', a: 'Yes, a quick sign-up lets us save all your data per user so nothing is ever lost between sessions.' },
  { q: 'Is my data private?', a: 'Everything is stored in your browser via localStorage. Nothing is sent to any server.' },
  { q: 'Can I export my resume as PDF?', a: 'Absolutely. Hit the Download PDF button and your browser prints a clean, formatted PDF.' },
  { q: 'Does the Notes Converter use real AI?', a: 'Yes — it calls Claude (claude-sonnet-4-6) to generate summaries, bullet points, flashcards, and short notes from your raw text.' },
  { q: 'Will my timetable reset when I reload?', a: 'Never. Everything is saved to localStorage tied to your account, so it\'s always there when you come back.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
      <FadeIn className="text-center mb-12">
        <div className="section-tag mb-4">FAQ</div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Common questions</h2>
      </FadeIn>
      <div className="space-y-2">
        {FAQS.map((f, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="glass rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="font-semibold text-white text-sm pr-4">{f.q}</span>
                <ChevronDown size={15} className={`text-ink-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-ink-300 text-sm leading-relaxed border-t border-white/[0.06] pt-4">
                  {f.a}
                </div>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

// ─── Main landing ────────────────────────────────────────────────────────────
export default function LandingPage({ navigate, user }) {
  const firstName = user?.firstName || 'you'

  const tools = [
    { id: 'resume',    emoji: '📄', label: 'Resume Builder',    desc: 'Build a professional, ATS-ready resume with live preview and one-click PDF export.',          color: 'border-volt-500/20 hover:border-volt-500/40',   tag: 'text-volt-400' },
    { id: 'gpa',       emoji: '🎓', label: 'GPA Calculator',    desc: 'Add subjects, grades, and credits. Get instant semester GPA and CGPA in real time.',           color: 'border-emerald-500/20 hover:border-emerald-500/40', tag: 'text-emerald-400' },
    { id: 'notes',     emoji: '✨', label: 'Notes Converter',   desc: 'Paste raw notes — get back summaries, bullet points, flashcards, and short notes via AI.',     color: 'border-purple-500/20 hover:border-purple-500/40',  tag: 'text-purple-400' },
    { id: 'timetable', emoji: '📅', label: 'Timetable Maker',   desc: 'Build a colour-coded weekly schedule. Saved automatically — never starts from scratch again.', color: 'border-amber-500/20 hover:border-amber-500/40',   tag: 'text-amber-400' },
  ]

  const stats = [
    { icon: Users,      val: '50K+', label: 'Active Students',      c: 'text-volt-400' },
    { icon: Star,       val: '4.9★', label: 'Average Rating',       c: 'text-amber-400' },
    { icon: TrendingUp, val: '0.3+', label: 'Avg GPA Improvement',  c: 'text-emerald-400' },
    { icon: Clock,      val: '2 hrs', label: 'Saved Per Week',      c: 'text-purple-400' },
  ]

  const testimonials = [
    { name: 'Priya S.', role: 'CS, Year 3',    initials: 'PS', grad: 'from-volt-600 to-violet-600',   text: 'The GPA calculator is insanely useful. I used Excel before — this is so much better and faster.' },
    { name: 'James O.', role: 'MBA Student',    initials: 'JO', grad: 'from-emerald-600 to-teal-600', text: 'Got my dream internship using the Resume Builder. The live preview made it so easy to perfect my layout.' },
    { name: 'Mei L.',   role: 'Medicine, Yr 2', initials: 'ML', grad: 'from-purple-600 to-pink-600',  text: 'Notes Converter is unreal. Lecture notes in → clean flashcards out. My exam prep time halved.' },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-volt-500/7 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="section-tag mb-8">
              <Sparkles size={11} /> All-in-one academic platform
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-[4.5rem] font-extrabold tracking-tight text-white leading-[1.07] mb-5">
              The stack <span className="gradient-text">{firstName}</span><br />actually needs
            </h1>
            <p className="text-lg text-ink-300 max-w-xl mx-auto leading-relaxed mb-10">
              Resume builder · GPA calculator · AI notes converter · Timetable — all saved to your account, always where you left it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={() => navigate('resume')} className="btn-primary text-[15px] px-7 py-3.5">
                Start building <ArrowRight size={15} />
              </button>
              <button onClick={() => navigate('gpa')} className="btn-secondary text-[15px] px-7 py-3.5">
                View all tools
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-ink-400">
              {['No credit card', '100% free', 'Data saved to your account', 'Works offline'].map(f => (
                <div key={f} className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-400" /> {f}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }}>
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <div className="section-tag mb-4">Tools</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">Everything you need</h2>
          <p className="text-ink-300 text-lg max-w-md mx-auto">Four powerful tools, all under one roof.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {tools.map((t, i) => (
            <FadeIn key={t.id} delay={i * 0.09}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(t.id)}
                className={`cursor-pointer glass rounded-2xl p-7 border transition-colors duration-200 group ${t.color}`}
              >
                <div className="text-3xl mb-5">{t.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{t.label}</h3>
                <p className="text-ink-300 text-sm leading-relaxed mb-5">{t.desc}</p>
                <div className={`flex items-center gap-1.5 text-sm font-bold ${t.tag} group-hover:gap-3 transition-all`}>
                  Open tool <ArrowRight size={13} />
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-y border-white/[0.05] bg-ink-900/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, val, label, c }, i) => (
              <FadeIn key={label} delay={i * 0.08}>
                <div className="card text-center">
                  <div className={`text-3xl font-extrabold ${c} mb-1`}>{val}</div>
                  <div className="text-ink-400 text-xs">{label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <div className="section-tag mb-4">Why Student Stack</div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Built for real students</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: Zap,      title: 'Fast & Lightweight',  desc: 'No heavy installs, no downloads. Opens instantly in your browser.' },
            { icon: Shield,   title: 'Fully Private',       desc: 'Data never leaves your device. Everything stays in your browser.' },
            { icon: Sparkles, title: 'Beautifully Designed', desc: 'Crafted with care — a tool you actually enjoy using every day.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <FadeIn key={title} delay={i * 0.1}>
              <div className="card">
                <div className="w-10 h-10 rounded-xl bg-volt-500/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-volt-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-ink-300 text-sm leading-relaxed">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-ink-900/30 border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeIn className="text-center mb-14">
            <div className="section-tag mb-4">Testimonials</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">Loved by students</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="card h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-ink-200 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-ink-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <FAQ />

      {/* CTA */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden border border-volt-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-volt-500/10 via-transparent to-purple-500/8 pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
                Start building your <span className="gradient-text">academic future</span>
              </h2>
              <p className="text-ink-300 text-lg mb-8 max-w-md mx-auto">
                Your data is saved to your account and always waiting for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => navigate('resume')} className="btn-primary text-[15px] px-8 py-4">
                  Build your resume <ArrowRight size={15} />
                </button>
                <button onClick={() => navigate('gpa')} className="btn-secondary text-[15px] px-8 py-4">
                  Calculate GPA
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-xl bg-volt-500 flex items-center justify-center shadow-volt">
                  <span className="text-white text-xs font-bold">SS</span>
                </div>
                <span className="font-bold text-lg text-white">Student Stack</span>
              </div>
              <p className="text-ink-400 text-sm max-w-xs leading-relaxed">
                The all-in-one academic productivity platform. Your data, always saved.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-4">Tools</p>
              {['resume','gpa','notes','timetable'].map(t => (
                <button key={t} onClick={() => navigate(t)}
                  className="block text-sm text-ink-400 hover:text-white transition-colors mb-2.5 capitalize">
                  {t === 'gpa' ? 'GPA Calculator' : t.charAt(0).toUpperCase()+t.slice(1)+' '+(t==='resume'?'Builder':t==='notes'?'Converter':'Maker')}
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-4">Legal</p>
              {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
                <span key={l} className="block text-sm text-ink-400 hover:text-white transition-colors mb-2.5 cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-ink-500 text-sm">© 2025 Student Stack. All rights reserved.</p>
            <p className="text-ink-500 text-sm">Made for students, by students ✦</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
