import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Usuarios from './Usuarios'

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard'    },
  { icon: '📦', label: 'Productos'    },
  { icon: '🏷️', label: 'Categorías'  },
  { icon: '🔄', label: 'Movimientos' },
  { icon: '👥', label: 'Usuarios'    },
]

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const [activeNav, setActiveNav] = useState('Dashboard')
  const [search, setSearch] = useState('')

  const initial = usuario?.nombre_completo?.[0]?.toUpperCase() ?? '?'
  const nombre  = usuario?.nombre_completo ?? usuario?.username ?? ''
  const rol     = usuario?.rol_asignado ?? ''

  return (
    <div style={s.page}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        {/* Logo */}
        <div style={s.sidebarLogo}>
          <span style={s.sidebarLogoIcon}>📦</span>
          <div>
            <div style={s.sidebarBrand}>InventarioAPI</div>
            <div style={s.sidebarSub}>Admin Console</div>
          </div>
        </div>

        {/* Botón primario */}
        <button style={s.registerBtn}>＋ Register Entry</button>

        {/* Nav */}
        <nav style={s.nav}>
          {NAV_ITEMS.map(({ icon, label }) => (
            <button
              key={label}
              style={{ ...s.navItem, ...(activeNav === label ? s.navItemActive : {}) }}
              onClick={() => setActiveNav(label)}
            >
              <span style={s.navIcon}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Área principal ── */}
      <div style={s.main}>

        {/* Top bar */}
        <header style={s.topBar}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>🔍</span>
            <input
              style={s.searchInput}
              placeholder="Search inventory, users or logs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={s.topRight}>
            <button style={s.iconBtn} title="Notificaciones">🔔</button>
            <button style={s.iconBtn} title="Configuración">⚙️</button>
            <div style={s.userPill}>
              <div style={s.avatar}>{initial}</div>
              <div style={s.userMeta}>
                <span style={s.userName}>{nombre}</span>
                <span style={s.userRole}>{rol}</span>
              </div>
            </div>
            <button style={s.logoutBtn} onClick={logout}>Logout</button>
          </div>
        </header>

        {/* Contenido — cambia según la sección activa */}
        <div style={s.content}>
          {activeNav === 'Usuarios' ? <Usuarios /> : <HomeContent usuario={usuario} />}
        </div>
      </div>
    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function HomeContent({ usuario }) {
  const nombre = usuario?.nombre_completo?.split(' ')[0] ?? usuario?.username
  return (
    <>
      <div style={s.pageHead}>
        <div>
          <h1 style={s.pageTitle}>Bienvenido, {nombre} 👋</h1>
          <p style={s.pageSub}>Panel de control · Sistema de gestión de inventario</p>
        </div>
        <div style={s.pageActions}>
          <button style={s.btnSecondary}>⬇ Exportar CSV</button>
          <button style={s.btnPrimary}>＋ Nuevo Registro</button>
        </div>
      </div>

      <div style={s.statsGrid}>
        <StatCard icon="📦" label="Total Productos"  value="—" color="#2e75b6" />
        <StatCard icon="✅" label="En Stock"          value="—" color="#16a34a" />
        <StatCard icon="🔄" label="Movimientos Hoy"  value="—" color="#d97706" />
        <StatCard icon="👥" label="Usuarios Activos"  value="—" color="#7c3aed" />
      </div>

      <div style={s.tableCard}>
        <div style={s.tableToolbar}>
          <div style={s.tableSearchWrap}>
            <span style={s.tableSearchIcon}>🔍</span>
            <input style={s.tableSearch} placeholder="Buscar…" />
          </div>
          <button style={s.filterChip}>Todos los módulos</button>
          <span style={s.tableCount}>Mostrando 0 registros</span>
        </div>
        <div style={s.tableHead}>
          {['ID', 'NOMBRE', 'CATEGORÍA', 'STOCK', 'ESTADO', 'ACCIONES'].map(c => (
            <span key={c} style={s.th}>{c}</span>
          ))}
        </div>
        <div style={s.tableEmpty}>
          <span style={{ fontSize: '2rem' }}>📭</span>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>No hay datos disponibles aún</p>
        </div>
        <div style={s.pagination}>
          <span style={s.pageInfo}>Página 1 de 1</span>
          <div style={s.pageButtons}>
            <button style={s.pageBtn} disabled>‹</button>
            <button style={{ ...s.pageBtn, ...s.pageBtnActive }}>1</button>
            <button style={s.pageBtn} disabled>›</button>
          </div>
        </div>
      </div>

      <div style={s.infoGrid}>
        <InfoCard icon="🛡️" title="Políticas de Seguridad"
          text="Los usuarios deben tener activada la autenticación de dos pasos (2FA). Los roles de Operador tienen restringido el acceso al historial de movimientos."
          link="Ver manual de permisos" />
        <InfoCard icon="📋" title="Auditoría de Sistemas"
          text="Última revisión general de accesos realizada el 15 de Octubre, 2025. Se recomienda realizar una depuración de usuarios inactivos cada 90 días."
          action="Generar Reporte de Auditoría" />
      </div>
    </>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIcon, background: color + '18', color }}>
        {icon}
      </div>
      <div>
        <div style={s.statLabel}>{label}</div>
        <div style={s.statValue}>{value}</div>
      </div>
    </div>
  )
}

function InfoCard({ icon, title, text, link, action }) {
  return (
    <div style={s.infoCard}>
      <div style={s.infoCardHead}>
        <span style={s.infoIcon}>{icon}</span>
        <span style={s.infoTitle}>{title}</span>
      </div>
      <p style={s.infoText}>{text}</p>
      {link   && <a href="#" style={s.infoLink}>{link} ↗</a>}
      {action && <button style={s.infoBtn}>{action}</button>}
    </div>
  )
}

// ── Estilos ────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
    background: '#f0f4f8',
  },

  /* Sidebar */
  sidebar: {
    width: '220px',
    flexShrink: 0,
    background: 'linear-gradient(180deg, #1e3a5f 0%, #15294a 100%)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem 1rem',
    gap: '0.5rem',
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '1.5rem',
  },
  sidebarLogoIcon: { fontSize: '1.8rem' },
  sidebarBrand: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    letterSpacing: '-0.2px',
  },
  sidebarSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.72rem',
  },
  registerBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: '#fff',
    padding: '0.6rem 0.75rem',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '1rem',
    letterSpacing: '0.2px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.6rem 0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    color: 'rgba(255,255,255,0.65)',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontWeight: 600,
  },
  navIcon: { fontSize: '1rem', width: '20px', textAlign: 'center' },

  /* Main area */
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  /* Top bar */
  topBar: {
    height: '60px',
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.75rem',
    gap: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  searchWrap: {
    position: 'relative',
    flex: 1,
    maxWidth: '380px',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.9rem',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem 1rem 0.5rem 2.25rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    background: '#f9fafb',
    color: '#374151',
    boxSizing: 'border-box',
  },
  topRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.3rem',
    borderRadius: '6px',
    lineHeight: 1,
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a5f, #2e75b6)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.85rem',
    flexShrink: 0,
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.3,
  },
  userName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#111827',
  },
  userRole: {
    fontSize: '0.7rem',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    padding: '0.4rem 0.9rem',
    background: '#1e3a5f',
    color: '#fff',
    border: 'none',
    borderRadius: '7px',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },

  /* Contenido */
  content: {
    flex: 1,
    padding: '2rem 1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  pageHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  pageTitle: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 0.2rem',
  },
  pageSub: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  pageActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  btnSecondary: {
    padding: '0.5rem 1.1rem',
    background: '#fff',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
  },
  btnPrimary: {
    padding: '0.5rem 1.1rem',
    background: 'linear-gradient(135deg, #1e3a5f, #2e75b6)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
  },

  /* Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.1rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  statIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    flexShrink: 0,
  },
  statLabel: {
    fontSize: '0.72rem',
    color: '#6b7280',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.2rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    lineHeight: 1,
  },

  /* Tabla */
  tableCard: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  tableToolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f3f4f6',
    flexWrap: 'wrap',
  },
  tableSearchWrap: {
    position: 'relative',
    flex: 1,
    minWidth: '180px',
    maxWidth: '280px',
  },
  tableSearchIcon: {
    position: 'absolute',
    left: '0.65rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.8rem',
    pointerEvents: 'none',
    color: '#9ca3af',
  },
  tableSearch: {
    width: '100%',
    padding: '0.45rem 0.75rem 0.45rem 2rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '7px',
    fontSize: '0.85rem',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f9fafb',
  },
  filterChip: {
    padding: '0.4rem 0.85rem',
    border: '1.5px solid #e5e7eb',
    borderRadius: '20px',
    background: '#f9fafb',
    fontSize: '0.8rem',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: 500,
  },
  tableCount: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: '#9ca3af',
  },
  tableHead: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 1fr 80px 90px 90px',
    padding: '0.6rem 1.25rem',
    background: '#f9fafb',
    borderBottom: '1px solid #f3f4f6',
  },
  th: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#2e75b6',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableEmpty: {
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.25rem',
    borderTop: '1px solid #f3f4f6',
  },
  pageInfo: { fontSize: '0.8rem', color: '#9ca3af' },
  pageButtons: { display: 'flex', gap: '0.3rem' },
  pageBtn: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '1.5px solid #e5e7eb',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnActive: {
    background: '#1e3a5f',
    color: '#fff',
    border: '1.5px solid #1e3a5f',
  },

  /* Info cards */
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    background: '#1e3a5f',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  infoCardHead: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  infoIcon: { fontSize: '1.1rem' },
  infoTitle: {
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  infoText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.82rem',
    lineHeight: 1.55,
    margin: 0,
  },
  infoLink: {
    color: '#93c5fd',
    fontSize: '0.82rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
  infoBtn: {
    marginTop: '0.25rem',
    padding: '0.55rem 1rem',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.83rem',
    fontWeight: 600,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
}
