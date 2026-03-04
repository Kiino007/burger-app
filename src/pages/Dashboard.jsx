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
    <div className="min-h-screen bg-burger text-white">
      
      {/* Contenedor para centrar el contenido y que no pegue a los bordes */}
      <div className="max-w-7xl mx-auto p-6">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 uppercase tracking-tighter">
              Panel de {rol === 'admin' ? 'Administrador' : 'Cliente'}
            </h1>
            <p className="text-green-400 text-sm italic font-bold">
              ¡10% de descuento aplicado automáticamente!
            </p>
          </div>
          
          <button 
            onClick={() => supabase.auth.signOut()}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-xs font-black uppercase transition-all shadow-lg"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* El Menú ya tiene el estilo Glassmorphism que configuramos antes */}
        <Menu session={session} rol={rol} />
      </div>
    </div>
  )
}

export default Dashboard