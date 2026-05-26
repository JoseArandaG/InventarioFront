import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { usuario } = useAuth()
  return usuario ? <Dashboard /> : <Login />
}
