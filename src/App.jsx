import Login from "./pages/Login"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import { useEffect, useState } from "react"
import { supabase } from "./services/supabaseClient"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    // obtener sesión actual al cargar la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // login y logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )
  return () => {
    listener.subscription.unsubscribe()
    }

  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Cargando sesión...
      </div>
    )
  }

  // si NO hay sesión  mostrar login
  if (!session) {
    return <Home />
  }

  // si hay sesión  mostrar dashboard provisional
  return <Dashboard session={session} />
}

export default App



