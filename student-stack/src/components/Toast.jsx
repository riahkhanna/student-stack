import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

let _showToast = () => {}
export const toast = {
  success: (msg) => _showToast(msg, 'success'),
  error:   (msg) => _showToast(msg, 'error'),
  info:    (msg) => _showToast(msg, 'info'),
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _showToast = (msg, type = 'info') => {
      const id = Date.now()
      setToasts(p => [...p, { id, msg, type }])
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
    }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl
            glass-bright text-sm font-medium animate-[fadeUp_0.3s_ease]"
          style={{ animation: 'fadeUp 0.3s ease' }}
        >
          {t.type === 'success' && <CheckCircle size={15} className="text-emerald-400 shrink-0" />}
          {t.type === 'error'   && <XCircle     size={15} className="text-rose-400 shrink-0" />}
          <span className={
            t.type === 'success' ? 'text-emerald-300' :
            t.type === 'error'   ? 'text-rose-300'    : 'text-ink-100'
          }>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}
