import { useEffect } from "react"
import { supabase } from "./services/supabaseClient"

function App() {

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.log("Error obteniendo sesión:", error)
      } else {
        console.log("Sesión actual:", data)
      }
    }

    checkSession()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <h1 className="text-4xl text-yellow-400 font-bold">
        Burger App 🍔
      </h1>
    </div>
  )
}

export default App


