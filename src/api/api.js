import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/rpc',
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// IDs del registry
export const SP = {
  LOGIN:            1,
  CREAR_USUARIO:    2,
  LISTAR_USUARIOS:  3,
  ACTUALIZAR:       4,
  ELIMINAR:         5,
  BLOQUEO:          6,
  ESTADO:           7,
  CAMBIAR_PASSWORD: 8,
}

export const rpc = (id, params = []) =>
  api.post(`/${id}/`, { params })

export default api
