import { supabase } from "../services/supabaseClient"

function Dashboard({ session }) {

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

export default Dashboard