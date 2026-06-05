import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OperadorPage from './pages/OperadorPage'

export default function App() {
  const { usuario } = useAuth()

  if (!usuario) return <Login />

  const rol = usuario.rol_asignado?.toLowerCase()

  if (rol === 'operador') return <OperadorPage />

  return <Dashboard />
}
