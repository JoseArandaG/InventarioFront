import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { icon: 'dashboard',      label: 'Dashboard',    active: true  },
  { icon: 'swap_horiz',     label: 'Movimientos',  active: false },
  { icon: 'local_shipping', label: 'Envíos',       active: false },
]

const ENVIOS = [
  { id: '#TRK-99281', destino: 'Sucursal Norte - CDMX',    estado: 'En Ruta',     estadoColor: 'bg-green-100 text-green-800', ticket: 'Automático', fecha: 'Hoy, 11:20 AM'    },
  { id: '#TRK-99275', destino: 'Almacén Central - GDL',    estado: 'Preparación', estadoColor: 'bg-blue-100 text-blue-800',  ticket: 'Manual',      fecha: 'Hoy, 10:45 AM'    },
  { id: '#TRK-99260', destino: 'Cliente: Tech Solutions',  estado: 'Retrasado',   estadoColor: 'bg-red-100 text-red-800',    ticket: 'Automático', fecha: 'Ayer, 04:15 PM'   },
]

export default function OperadorPage() {
  const { usuario, logout } = useAuth()
  const [listening, setListening] = useState(false)
  const inicial = usuario?.nombre_completo?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-background text-on-background font-sans">

      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-sidebar-width z-50 bg-tertiary-container hidden md:flex flex-col p-stack-md gap-stack-sm shadow-lg">
        {/* Logo */}
        <div className="mb-stack-lg px-4 pt-4">
          <h1 className="text-headline-lg font-bold text-on-tertiary-container">InventarioAPI</h1>
          <p className="text-label-sm opacity-70 text-on-tertiary-container">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-2">
          {NAV.map(({ icon, label, active }) => (
            <a
              key={label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-label-bold font-bold transition-all cursor-pointer
                ${active
                  ? 'bg-primary-container text-on-primary-container border-l-4 border-primary scale-95'
                  : 'text-on-tertiary-container opacity-80 hover:bg-primary-container/50 hover:opacity-100'
                }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-on-tertiary-container/10">
          <button className="bg-primary text-on-primary text-label-bold font-bold rounded-lg py-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined">add_circle</span>
            Register Entry
          </button>
          {[['settings', 'Settings'], ['help', 'Help']].map(([icon, lbl]) => (
            <a key={lbl} href="#"
              className="flex items-center gap-3 text-on-tertiary-container opacity-80 px-4 py-3 text-label-bold font-bold hover:bg-primary-container/50 hover:opacity-100 transition-all">
              <span className="material-symbols-outlined">{icon}</span>
              {lbl}
            </a>
          ))}
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="md:ml-sidebar-width p-margin-desktop min-h-screen">

        {/* Top App Bar */}
        <header className="flex justify-between items-center h-16 w-full sticky top-0 z-40 bg-surface shadow-sm mb-stack-lg rounded-xl px-6">
          {/* Search */}
          <div className="bg-surface-container rounded-lg px-3 py-1 flex items-center gap-2 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-body-md w-64 outline-none"
              placeholder="Buscar en inventario..."
              type="text"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">notifications</span>
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">settings</span>
            </div>
            <div className="h-8 w-px bg-outline-variant/50" />
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right">
                <p className="text-label-bold font-bold text-on-surface">
                  {usuario?.nombre_completo ?? usuario?.username}
                </p>
                <button
                  onClick={logout}
                  className="text-label-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center border-2 border-primary-container text-on-primary-container font-bold text-sm">
                {inicial}
              </div>
            </div>
          </div>
        </header>

        {/* Bento Grid */}
        <div className="bento-grid">

          {/* ── Voice Control ── */}
          <section className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-stack-lg rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-container flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-surface-tint to-primary" />

            <div className="text-center mb-8">
              <h2 className="text-headline-lg font-bold text-primary mb-2">Comandos de Voz</h2>
              <p className="text-body-lg text-on-surface-variant">
                Diga "Agregar 50 unidades de Tornillos M8" para actualizar
              </p>
            </div>

            {/* Mic button */}
            <div
              className={`relative group cursor-pointer ${listening ? 'voice-pulse' : ''}`}
              onClick={() => setListening(v => !v)}
            >
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-ping opacity-20" />
              <div className="absolute inset-0 bg-primary/5 rounded-full scale-[2] animate-pulse opacity-10" />
              <div className="relative w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center border-8 border-surface-container transition-transform group-hover:scale-105 active:scale-95">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '6rem' }}>mic</span>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-container/10 rounded-full">
                <span className={`w-2 h-2 rounded-full animate-bounce ${listening ? 'bg-primary' : 'bg-gray-400'}`} />
                <span className="text-label-bold font-bold text-primary">
                  {listening ? 'Escuchando...' : 'Click para hablar'}
                </span>
              </div>
            </div>
          </section>

          {/* ── Nueva Hoja de Envío ── */}
          <section className="col-span-12 lg:col-span-5 bg-white p-stack-lg rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-container">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-headline-md font-semibold text-on-surface">Nueva Hoja de Envío</h2>
              <span className="material-symbols-outlined text-primary-container">local_shipping</span>
            </div>

            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              {/* Destino */}
              <div className="space-y-2">
                <label className="text-label-bold font-bold text-on-surface-variant block">Destino / Cliente</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">location_on</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
                    placeholder="Nombre o dirección del cliente"
                    type="text"
                  />
                </div>
              </div>

              {/* Tipo + Prioridad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-label-bold font-bold text-on-surface-variant block">Tipo de Ticket</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md">
                    <option>Ticket Automático</option>
                    <option>Ticket Manual</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-label-bold font-bold text-on-surface-variant block">Prioridad</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md">
                    <option>Estándar</option>
                    <option>Urgente</option>
                  </select>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <label className="text-label-bold font-bold text-on-surface-variant block">Contenido del Envío</label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-bright focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-body-md"
                  placeholder="Describa los artículos..."
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary text-label-bold font-bold py-4 rounded-lg shadow-md hover:bg-surface-tint transition-colors mt-4"
              >
                GENERAR HOJA DE ENVÍO
              </button>
            </form>
          </section>

          {/* ── Estado de Envíos ── */}
          <section className="col-span-12 bg-white p-stack-lg rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-surface-container">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-headline-md font-semibold text-on-surface">Estado de Envíos</h2>
                <p className="text-body-md text-on-surface-variant">Seguimiento en tiempo real de despachos activos</p>
              </div>
              <button className="flex items-center gap-2 text-primary text-label-bold font-bold hover:underline">
                Ver todo el historial
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-outline-variant/30">
                    {['Tracking ID', 'Destino', 'Estado', 'Ticket', 'Fecha'].map(h => (
                      <th key={h} className="pb-4 text-label-bold font-bold text-on-surface-variant uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {ENVIOS.map(({ id, destino, estado, estadoColor, ticket, fecha }) => (
                    <tr key={id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 text-label-bold font-bold text-primary">{id}</td>
                      <td className="py-4 text-body-md text-on-surface">{destino}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-label-bold font-bold ${estadoColor}`}>
                          {estado}
                        </span>
                      </td>
                      <td className="py-4 text-body-md text-on-surface-variant">{ticket}</td>
                      <td className="py-4 text-body-md text-on-surface">{fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
