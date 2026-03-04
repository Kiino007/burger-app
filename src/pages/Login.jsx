import { useState } from "react"
import { supabase } from "../services/supabaseClient"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)

  // --- TRADUCTOR DE ERRORES ---
  const traducirError = (msg) => {
    if (msg.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
    if (msg.includes("User already registered")) return "Este correo ya está registrado.";
    if (msg.includes("Password should be at least 6 characters")) return "La contraseña debe tener al menos 6 caracteres.";
    if (msg.includes("Unable to validate email address: invalid format")) return "El formato del correo no es válido.";
    return "Ocurrió un error inesperado. Inténtalo de nuevo.";
  }

  const toggleView = () => {
    setIsRegistering(!isRegistering)
    setEmail("")
    setPassword("")
    setError(null)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, ingresa tus credenciales");
      return;
    }
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(traducirError(authError.message))
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!email || !password) {
      setError("Debes completar todos los campos");
      return;
    }
    setLoading(true)
    setError(null)

    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    
    if (authError) {
      setError(traducirError(authError.message))
      setLoading(false)
      return
    }

    if (data?.user) {
      // Insertamos el perfil y dejamos que App.jsx detecte la sesión automáticamente
      const { error: dbError } = await supabase
        .from("perfiles")
        .insert([{ user_id: data.user.id, rol: "cliente" }])

      if (dbError) console.error("Error DB:", dbError.message)
      
      // NOTA: No ponemos alert aquí para que entre directo al Dashboard
    }
    setLoading(false)
  }

  return (
    <div className="bg-transparent"> 
    <div className="bg-gray-800/80 p-6 rounded-2xl w-full max-w-sm border border-gray-700 shadow-2xl backdrop-blur-sm">

        {isRegistering ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-green-400 text-center uppercase">Crear Cuenta</h2>
            <p className="text-gray-400 text-center text-sm">Obtén 5% de descuento al registrarte</p>
            
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Nuevo correo electrónico"
                className="w-full p-3 rounded bg-gray-900 text-white border border-green-900 focus:border-green-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Crea tu contraseña"
                className="w-full p-3 rounded bg-gray-900 text-white border border-green-900 focus:border-green-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg uppercase tracking-widest transition-all"
            >
              {loading ? "Procesando..." : "Registrarme ahora"}
            </button>

            <button onClick={toggleView} className="w-full text-center text-gray-500 text-sm hover:text-green-400">
              ¿Ya tienes cuenta? <span className="underline">Inicia sesión</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-yellow-400 text-center uppercase">Ingresar</h2>
            <p className="text-gray-400 text-center text-sm">Bienvenido de nuevo a Burger App</p>

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Tu correo"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Tu contraseña"
                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-500 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg uppercase tracking-widest transition-all"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <button onClick={toggleView} className="w-full text-center text-gray-500 text-sm hover:text-yellow-400">
              ¿No tienes cuenta? <span className="underline">Regístrate aquí</span>
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 p-3 bg-red-900/40 border-l-4 border-red-500 rounded text-red-200 text-xs text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
