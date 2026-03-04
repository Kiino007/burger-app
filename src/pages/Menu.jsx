import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient"

function Menu({ session, rol }) {
  const [hamburguesas, setHamburguesas] = useState([])
  const [loading, setLoading] = useState(true)
  const [editandoId, setEditandoId] = useState(null)
  const [formEdit, setFormEdit] = useState({ nombre: "", descripcion: "", precio: "" })

  useEffect(() => {
    fetchHamburguesas()
  }, [])

  const fetchHamburguesas = async () => {
    const { data, error } = await supabase
      .from("hamburguesas")
      .select("*")
      .order('created_at', { ascending: true })

    if (!error) setHamburguesas(data)
    setLoading(false)
  }

  const prepararEdicion = (burger) => {
    setEditandoId(burger.id)
    setFormEdit({ 
      nombre: burger.nombre, 
      descripcion: burger.descripcion, 
      precio: burger.precio 
    })
  }

  const actualizarHamburguesa = async (e) => {
    e.preventDefault()
    const { error } = await supabase
      .from("hamburguesas")
      .update({ 
        nombre: formEdit.nombre, 
        descripcion: formEdit.descripcion, 
        precio: parseInt(formEdit.precio) 
      })
      .eq("id", editandoId)

    if (error) {
      alert("Error al actualizar: " + error.message)
    } else {
      setHamburguesas(hamburguesas.map(b => b.id === editandoId ? { ...b, ...formEdit, precio: parseInt(formEdit.precio) } : b))
      setEditandoId(null)
      alert("¡Actualizada correctamente!")
    }
  }

  const agregarHamburguesa = async () => {
    const nombre = prompt("Nombre de la hamburguesa:")
    const descripcion = prompt("Descripción:")
    const precio = prompt("Precio (solo números):")

    if (!nombre || !precio) return

    const { data, error } = await supabase
      .from("hamburguesas")
      .insert([{ nombre, descripcion, precio: parseInt(precio) }])
      .select()

    if (error) {
      alert("Error al agregar: " + error.message)
    } else {
      setHamburguesas([...hamburguesas, data[0]])
      alert("¡Añadida con éxito!")
    }
  }

  const eliminarHamburguesa = async (id) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta hamburguesa?")
    if (!confirmar) return

    const { error } = await supabase
      .from("hamburguesas")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar: " + error.message)
    } else {
      setHamburguesas(hamburguesas.filter(h => h.id !== id))
      alert("Hamburguesa eliminada correctamente")
    }
  }

  if (loading) return <div className="text-white text-center mt-10 font-bold">Cargando menú...</div>

  return (
    /* Contenedor sin fondo sólido para que se vea la imagen de App/Home */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8">
      {hamburguesas.map((burger) => {
        const tieneSesion = session !== null
        const precioOriginal = burger.precio
        const precioFinal = tieneSesion ? Math.round(precioOriginal * 0.90) : precioOriginal

        if (editandoId === burger.id) {
          return (
            <form key={burger.id} onSubmit={actualizarHamburguesa} className="bg-gray-900/80 backdrop-blur-md border-2 border-yellow-500 p-6 rounded-3xl text-white space-y-3 shadow-2xl">
              <h3 className="text-yellow-400 font-bold uppercase text-center">Modificar Item</h3>
              <input 
                className="w-full p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-sm outline-none"
                value={formEdit.nombre}
                onChange={(e) => setFormEdit({...formEdit, nombre: e.target.value})}
                required
              />
              <textarea 
                className="w-full p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-sm outline-none"
                value={formEdit.descripcion}
                onChange={(e) => setFormEdit({...formEdit, descripcion: e.target.value})}
              />
              <input 
                type="number"
                className="w-full p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-sm outline-none"
                value={formEdit.precio}
                onChange={(e) => setFormEdit({...formEdit, precio: e.target.value})}
                required
              />
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-xl text-xs font-bold uppercase transition-all">Guardar</button>
                <button type="button" onClick={() => setEditandoId(null)} className="flex-1 bg-gray-500 hover:bg-gray-600 py-2 rounded-xl text-xs font-bold uppercase transition-all">Cancelar</button>
              </div>
            </form>
          )
        }

        return (
          /* ESTILO GLASSMORPhISM: Fondo semitransparente con desenfoque */
          <div key={burger.id} className="group bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white relative flex flex-col justify-between hover:bg-white/20 transition-all duration-300 shadow-xl">
            
            <div>
              {tieneSesion && (
                <span className="absolute -top-3 -right-2 bg-yellow-500 text-black text-[10px] px-3 py-1 rounded-full font-black shadow-lg">
                  10% OFF
                </span>
              )}

              <h2 className="text-xl font-black text-yellow-400 uppercase tracking-tighter">{burger.nombre}</h2>
              <p className="mt-2 text-gray-200 text-xs font-medium leading-relaxed opacity-80">{burger.descripcion}</p>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl font-black">${precioFinal.toLocaleString()}</span>
                {tieneSesion && (
                  <span className="text-white/40 line-through text-sm font-bold">${precioOriginal.toLocaleString()}</span>
                )}
              </div>
            </div>

            {rol === 'admin' && (
              <div className="mt-6 flex gap-2 border-t border-white/10 pt-4">
                <button 
                  className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white text-[10px] py-2 rounded-xl font-black uppercase transition-all"
                  onClick={() => prepararEdicion(burger)}
                >
                  Editar
                </button>
                <button 
                  onClick={() => eliminarHamburguesa(burger.id)}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white text-[10px] py-2 rounded-xl font-black uppercase transition-all"
                >
                  Borrar
                </button>
              </div>
            )}
          </div>
        )
      })}

      {rol === 'admin' && (
        <div 
          onClick={agregarHamburguesa}
          className="border-2 border-dashed border-white/30 rounded-3xl flex items-center justify-center p-6 hover:border-yellow-500 hover:bg-yellow-500/10 cursor-pointer transition-all group"
        >
          <span className="text-white/50 group-hover:text-yellow-500 font-black text-sm uppercase tracking-widest">+ Agregar Nueva</span>
        </div>
      )}
    </div>
  )
}

export default Menu