import { useState } from "react"
import { supabase } from "../services/supabaseClient"

// se declaran las constantes de los datos del formulario
function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // esta funcion evita que se recargue la pagina al enviarlo
  const handleLogin = async (e) => {
    e.preventDefault()

    // se pone un loading para indicar que se esta cargando y se reinicia un error en caso de que haya
    setLoading(true)
    setError(null)

    // se usa supabase para el inicio de sesion... el await es para que espere respuesta del servidor
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }

    setLoading(false)
  }

  return (

    // se crea el formulario cebtrado con un fondo oscuro y se le da estilo a los inputs y al boton
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-lg w-96 space-y-4"
      >
        <h2 className="text-2xl text-yellow-400 font-bold text-center">
          Iniciar Sesión 🍔
        </h2>

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded"
        >
          {loading ? "Cargando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}

export default Login
