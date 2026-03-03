import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"
import Menu from "./Menu"

function Dashboard({ session }) {

    const [rol, setRol] = useState(null)

    useEffect(() => {
    const fetchRol = async () => {
      const { data, error } = await supabase
        .from("perfiles")
        .select("rol")
        .eq("user_id", session.user.id)
        .single()

      if (error) {
      console.log("Error trayendo rol:", error)
      return
      }

      if (data) {
        setRol(data.rol)
      } else {
      setRol("cliente")
      }
    }

    fetchRol()
  }, [session])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold text-yellow-400">
        Bienvenido 🍔
      </h1>

      <p className="mt-4">
        Usuario autenticado: {session.user.email}
      </p>

      <p className="mt-2">
        Rol: {rol}
      </p>

      <button
        onClick={() => supabase.auth.signOut()}
        className="mt-6 bg-red-500 px-4 py-2 rounded"
      >
        Cerrar sesión
      </button>

      <Menu session={session} rol={rol} />
    </div>
  )
}

export default Dashboard