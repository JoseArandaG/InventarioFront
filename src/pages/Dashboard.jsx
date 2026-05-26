import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { usuario, logout } = useAuth()

  return (
    <div style={styles.page}>
      {/* Barra superior */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.headerLogo}>📦</span>
          <span style={styles.headerBrand}>InventarioAPI</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.avatarWrap}>
            <span style={styles.avatar}>
              {usuario?.nombre_completo?.[0]?.toUpperCase() ?? '?'}
            </span>
            <div style={styles.userInfo}>
              <span style={styles.userName}>{usuario?.nombre_completo ?? usuario?.username}</span>
              <span style={styles.userRole}>{usuario?.rol_asignado}</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main style={styles.main}>
        {/* Bienvenida */}
        <div style={styles.welcome}>
          <h1 style={styles.welcomeTitle}>
            Bienvenido, {usuario?.nombre_completo?.split(' ')[0] ?? usuario?.username} 👋
          </h1>
          <p style={styles.welcomeSub}>
            Panel de control · Sistema de gestión de inventario
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div style={styles.cards}>
          <StatCard icon="📦" label="Productos" value="—" color="#2e75b6" />
          <StatCard icon="📋" label="Categorías" value="—" color="#16a34a" />
          <StatCard icon="🔄" label="Movimientos" value="—" color="#d97706" />
          <StatCard icon="👥" label="Usuarios" value="—" color="#7c3aed" />
        </div>

        {/* Sección de accesos rápidos */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Accesos rápidos</h2>
          <div style={styles.shortcuts}>
            <ShortcutCard icon="➕" label="Nuevo producto" />
            <ShortcutCard icon="📊" label="Ver inventario" />
            <ShortcutCard icon="🔍" label="Buscar artículo" />
            <ShortcutCard icon="📥" label="Registrar entrada" />
            <ShortcutCard icon="📤" label="Registrar salida" />
            <ShortcutCard icon="⚙️" label="Configuración" />
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.cardIcon, background: color + '18', color }}>
        {icon}
      </div>
      <div style={styles.cardBody}>
        <span style={styles.cardLabel}>{label}</span>
        <span style={styles.cardValue}>{value}</span>
      </div>
    </div>
  )
}

function ShortcutCard({ icon, label }) {
  return (
    <button style={styles.shortcut}>
      <span style={styles.shortcutIcon}>{icon}</span>
      <span style={styles.shortcutLabel}>{label}</span>
    </button>
  )
}

// ── Estilos ────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: '100vh',
    background: '#f0f4f8',
    display: 'flex',
    flexDirection: 'column',
  },

  // Header
  header: {
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 2rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  headerLogo: { fontSize: '1.6rem' },
  headerBrand: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: '#1e3a5f',
    letterSpacing: '-0.3px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  avatarWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e3a5f, #2e75b6)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.95rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.3,
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#111827',
  },
  userRole: {
    fontSize: '0.75rem',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  logoutBtn: {
    padding: '0.45rem 1rem',
    background: 'none',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
  },

  // Main
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1100px',
    width: '100%',
    margin: '0 auto',
  },

  // Bienvenida
  welcome: {
    marginBottom: '2rem',
  },
  welcomeTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.3rem',
  },
  welcomeSub: {
    fontSize: '0.95rem',
    color: '#6b7280',
  },

  // Tarjetas de estadísticas
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  cardLabel: {
    fontSize: '0.8rem',
    color: '#6b7280',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
  },

  // Accesos rápidos
  section: {},
  sectionTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '1rem',
  },
  shortcuts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '1rem',
  },
  shortcut: {
    background: '#fff',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.25rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  shortcutIcon: { fontSize: '1.6rem' },
  shortcutLabel: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#374151',
    textAlign: 'center',
  },
}
