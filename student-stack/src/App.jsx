import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from './hooks/useAuth.jsx'
import Navbar from './components/Navbar.jsx'
import ToastProvider from './components/Toast.jsx'
import AuthPage from './pages/AuthPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ResumeBuilder from './tools/ResumeBuilder.jsx'
import GPACalculator from './tools/GPACalculator.jsx'
import NotesConverter from './tools/NotesConverter.jsx'
import TimetableMaker from './tools/TimetableMaker.jsx'
import { useState } from 'react'

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -14 },
}

export default function App() {
  const { user, signup, login, logout } = useAuth()
  const [page, setPage] = useState('home')

  const navigate = (p) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPage(p)
  }

  // Not logged in
  if (!user) {
    return (
      <>
        <AuthPage onLogin={login} onSignup={signup} />
        <ToastProvider />
      </>
    )
  }

  return (
    <>
      <Navbar page={page} navigate={navigate} user={user} onLogout={logout} />
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {page === 'home'      && <LandingPage  navigate={navigate} user={user} />}
          {page === 'resume'    && <ResumeBuilder navigate={navigate} user={user} />}
          {page === 'gpa'       && <GPACalculator navigate={navigate} user={user} />}
          {page === 'notes'     && <NotesConverter navigate={navigate} user={user} />}
          {page === 'timetable' && <TimetableMaker navigate={navigate} user={user} />}
        </motion.div>
      </AnimatePresence>
      <ToastProvider />
    </>
  )
}
