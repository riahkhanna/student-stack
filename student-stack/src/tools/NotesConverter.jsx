import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Copy, Loader2, Sparkles, RotateCcw } from 'lucide-react'
import { toast } from '../components/Toast.jsx'

const MODES = [
  { id: 'bullets',    label: '• Bullet Points' },
  { id: 'summary',    label: '📋 Summary' },
  { id: 'flashcards', label: '🃏 Flashcards' },
  { id: 'shortnotes', label: '📝 Short Notes' },
]

const PROMPTS = {
  bullets: (text) =>
    `Convert the following notes into well-organized bullet points. Use "•" for main points and "  ◦" for sub-points. Be concise and keep all key information. Output ONLY the bullet points — no preamble, no explanation.\n\nNotes:\n${text}`,
  summary: (text) =>
    `Write a clear and comprehensive summary of the following notes in 3 to 6 sentences. Focus on the most important concepts. Output ONLY the summary — no preamble.\n\nNotes:\n${text}`,
  flashcards: (text) =>
    `Create 6 to 10 study flashcards from the following notes. Format each flashcard EXACTLY like this:\nQ: [question]\nA: [answer]\n\nSeparate each flashcard with a blank line. Output ONLY the flashcards — no preamble, no numbering.\n\nNotes:\n${text}`,
  shortnotes: (text) =>
    `Transform the following notes into concise, exam-ready short notes. Include key terms, definitions, and important points. Keep it tight — use short paragraphs or numbered lists. Output ONLY the short notes.\n\nNotes:\n${text}`,
}

function FlashCard({ q, a }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div
      onClick={() => setFlipped(v => !v)}
      className="cursor-pointer rounded-xl p-4 border transition-all duration-200 select-none"
      style={{ background: flipped ? 'rgba(91,109,245,0.1)' : 'rgba(255,255,255,0.03)', borderColor: flipped ? 'rgba(91,109,245,0.3)' : 'rgba(255,255,255,0.07)' }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: flipped ? '#7b8bff' : '#555878' }}>
        {flipped ? 'Answer' : 'Question'} · click to flip
      </div>
      <p className="text-sm leading-relaxed text-ink-100">{flipped ? a : q}</p>
    </div>
  )
}

export default function NotesConverter({ navigate }) {
  const [mode,    setMode]    = useState('bullets')
  const [input,   setInput]   = useState('')
  const [output,  setOutput]  = useState(null)   // null = empty, 'loading', or { type, content }
  const [loading, setLoading] = useState(false)
  const outputRef = useRef(null)

  const convert = async () => {
    if (!input.trim()) { toast.error('Please paste some notes first'); return }
    setLoading(true)
    setOutput('loading')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1200,
          messages: [{ role: 'user', content: PROMPTS[mode](input.trim()) }],
        }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      const text = data?.content?.[0]?.text || ''
      if (!text) throw new Error('Empty response from AI')
      setOutput({ type: mode, content: text })
      toast.success('Converted!')
    } catch (err) {
      setOutput({ type: 'error', content: err.message })
      toast.error('Conversion failed — see output panel')
    } finally {
      setLoading(false)
    }
  }

  const copyOutput = () => {
    if (!outputRef.current) return
    navigator.clipboard.writeText(outputRef.current.innerText)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Copy failed'))
  }

  const parseFlashcards = (text) => {
    const blocks = text.split(/\n\s*\n/).filter(b => b.includes('Q:') && b.includes('A:'))
    return blocks.map(b => ({
      q: b.match(/Q:\s*(.+?)(?:\nA:|$)/s)?.[1]?.trim() || '',
      a: b.match(/A:\s*(.+)/s)?.[1]?.trim() || '',
    })).filter(c => c.q && c.a)
  }

  const renderOutput = () => {
    if (!output || output === 'loading') return null
    if (output.type === 'error') {
      return (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <strong>Error:</strong> {output.content}
        </div>
      )
    }
    if (output.type === 'flashcards') {
      const cards = parseFlashcards(output.content)
      if (cards.length > 0) {
        return (
          <div className="space-y-2.5">
            <p className="text-xs text-ink-400 mb-3">{cards.length} flashcards · click each to flip</p>
            {cards.map((c, i) => <FlashCard key={i} q={c.q} a={c.a} />)}
          </div>
        )
      }
    }
    return (
      <pre className="whitespace-pre-wrap text-sm text-ink-200 leading-relaxed font-sans">{output.content}</pre>
    )
  }

  return (
    <div className="tool-page pt-20">
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <button onClick={() => navigate('home')} className="btn-ghost gap-1.5 text-ink-400">
          <ArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">✨ Notes Converter</h1>
          <p className="text-ink-400 text-sm mt-0.5">Powered by Claude AI · Paste notes → structured output</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {MODES.map(m => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setOutput(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200
              ${mode === m.id
                ? 'bg-volt-500 text-white border-transparent shadow-volt'
                : 'text-ink-300 border-white/[0.08] hover:text-ink-100 hover:border-white/[0.16]'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="panel-title mb-0">Your Notes</span>
            <button onClick={() => { setInput(''); setOutput(null) }} className="btn-ghost text-xs gap-1 text-ink-400">
              <RotateCcw size={12} /> Clear
            </button>
          </div>
          <textarea
            className="input-field resize-none"
            style={{ minHeight: '380px', lineHeight: 1.75 }}
            placeholder="Paste your lecture notes, textbook content, or any raw text here…

Example:
Photosynthesis is the process by which green plants convert sunlight into food. It occurs inside chloroplasts, using chlorophyll to absorb light. There are two stages: light-dependent reactions (which produce ATP and NADPH) and the Calvin cycle (which produces glucose). The overall equation is 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <div className="flex gap-2.5 mt-3">
            <button
              onClick={convert}
              disabled={loading}
              className="btn-primary gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {loading ? 'Converting…' : 'Convert with AI'}
            </button>
          </div>
        </div>

        {/* Output */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="panel-title mb-0">Output</span>
            {output && output !== 'loading' && output.type !== 'error' && (
              <button onClick={copyOutput} className="btn-ghost text-xs gap-1 text-volt-400">
                <Copy size={12} /> Copy
              </button>
            )}
          </div>
          <div
            className="glass rounded-2xl p-5 overflow-y-auto"
            style={{ minHeight: '380px', maxHeight: '520px' }}
          >
            <AnimatePresence mode="wait">
              {output === 'loading' ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 gap-3 text-ink-400">
                  <Loader2 size={28} className="animate-spin text-volt-400" />
                  <p className="text-sm">Claude is reading your notes…</p>
                </motion.div>
              ) : !output ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 gap-3 text-ink-500 text-center">
                  <div className="text-4xl">✨</div>
                  <p className="text-sm">Your converted notes will appear here</p>
                  <p className="text-xs text-ink-600">Paste text and click Convert with AI</p>
                </motion.div>
              ) : (
                <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div ref={outputRef}>{renderOutput()}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
