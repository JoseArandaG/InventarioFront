import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { rpc, SP } from '../api/api'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Completa todos los campos.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await rpc(SP.LOGIN, [form.username, form.password])
      if (data.token) {
        login(data.token, data.usuario)
      } else {
        setError(data.mensaje || 'Credenciales incorrectas.')
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.error || 'Error al conectar con el servidor.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Panel izquierdo decorativo */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>📦</div>
          <h1 style={styles.brand}>InventarioAPI</h1>
          <p style={styles.brandSub}>Sistema de gestión de inventario</p>
          <div style={styles.features}>
            <Feature icon="🔐" text="Acceso seguro con JWT" />
            <Feature icon="📊" text="Control total del inventario" />
            <Feature icon="👥" text="Gestión de usuarios y roles" />
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Bienvenido</h2>
            <p style={styles.subtitle}>Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            {/* Username */}
            <div style={styles.field}>
              <label style={styles.label}>Usuario</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="nombre.apellido1"
                  autoComplete="username"
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.field}>
              <label style={styles.label}>Contraseña</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔑</span>
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...styles.input, paddingRight: '3rem' }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                  tabIndex={-1}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Botón */}
            <button type="submit" style={styles.btn} disabled={loading}>
              {loading ? (
                <span style={styles.spinner}>⏳ Ingresando...</span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, text }) {
  return (
    <div style={styles.feature}>
      <span style={styles.featureIcon}>{icon}</span>
      <span style={styles.featureText}>{text}</span>
    </div>
  )
}

// ── Estilos ────────────────────────────────────────────────────────────────
const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', sans-serif",
  },
  // Panel izquierdo
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1e3a5f 0%, #2e75b6 60%, #3d9bd1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  leftContent: {
    color: '#fff',
    maxWidth: '380px',
  },
  logo: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  brand: {
    fontSize: '2.2rem',
    fontWeight: 700,
    margin: '0 0 0.4rem',
    letterSpacing: '-0.5px',
  },
  brandSub: {
    fontSize: '1rem',
    opacity: 0.85,
    marginBottom: '2.5rem',
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
  },
  featureIcon: { fontSize: '1.3rem' },
  featureText: { fontSize: '0.95rem', opacity: 0.95 },

  // Panel derecho
  right: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f4f8',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
  },
  cardHeader: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1e3a5f',
    margin: '0 0 0.4rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#6b7280',
    margin: 0,
  },

  // Formulario
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '0.85rem',
    fontSize: '1rem',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.6rem',
    border: '1.5px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    color: '#111827',
    background: '#f9fafb',
  },
  eyeBtn: {
    position: 'absolute',
    right: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.2rem',
    lineHeight: 1,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#b91c1c',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    background: 'linear-gradient(135deg, #1e3a5f, #2e75b6)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    letterSpacing: '0.3px',
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
}
