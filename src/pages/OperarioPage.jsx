import { useAuth } from '../context/AuthContext'

export default function OperarioPage() {
  const { usuario, logout } = useAuth()

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <span style={s.logo}>📦</span>
          <span style={s.brand}>InventarioAPI</span>
        </div>
        <div style={s.headerRight}>
          <div style={s.userPill}>
            <div style={s.avatar}>
              {usuario?.nombre_completo?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <div style={s.userName}>{usuario?.nombre_completo}</div>
              <div style={s.userRole}>{usuario?.rol_asignado}</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <main style={s.main}>
        <h1 style={s.title}>Hola Mundo 👋</h1>
        <p style={s.sub}>Bienvenido al panel de operario — página en construcción</p>
      </main>
    </div>
  )
}

const s = {
  page:       { minHeight: '100vh', background: '#f0f4f8', display: 'flex', flexDirection: 'column', fontFamily: "'Segoe UI', sans-serif" },
  header:     { background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  logo:       { fontSize: '1.6rem' },
  brand:      { fontWeight: 700, fontSize: '1.1rem', color: '#1e3a5f' },
  headerRight:{ display: 'flex', alignItems: 'center', gap: '1rem' },
  userPill:   { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  avatar:     { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#16a34a,#15803d)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' },
  userName:   { fontSize: '0.8rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 },
  userRole:   { fontSize: '0.7rem', color: '#6b7280', textTransform: 'capitalize' },
  logoutBtn:  { padding: '0.4rem 0.9rem', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: '7px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' },
  main:       { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' },
  title:      { fontSize: '2.5rem', fontWeight: 700, color: '#1e3a5f', margin: 0 },
  sub:        { fontSize: '1rem', color: '#6b7280', margin: 0 },
}
