import Login from "./pages/Login"
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
    return <Login />
  }

  // si hay sesión  mostrar dashboard provisional
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-400">
        Bienvenido 🍔
      </h1>

      <p className="mt-4">
        Usuario autenticado: {session.user.email}
      </p>

      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 bg-red-500 px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  )
}

export default App



