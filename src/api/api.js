import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/rpc',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 segundos — evita quedar cargando para siempre
})

// Adjunta el token JWT automáticamente en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// IDs del registry
export const SP = {
  // Usuarios
  LOGIN:            1,
  CREAR_USUARIO:    2,
  LISTAR_USUARIOS:  3,
  ACTUALIZAR:       4,
  ELIMINAR:         5,
  BLOQUEO:          6,
  ESTADO:           7,
  CAMBIAR_PASSWORD: 8,
  // Roles
  CREAR_ROL:        12,
  LISTAR_ROLES:     13,
  ACTUALIZAR_ROL:   14,
  ELIMINAR_ROL:     15,
  // Permisos — actualizar IDs tras el INSERT
  CREAR_PERMISO:    16,
  LISTAR_PERMISOS:  17,
  ACTUALIZAR_PERMISO: 18,
  ELIMINAR_PERMISO: 19,
}

export const rpc = (id, params = []) =>
  api.post(`/${id}/`, { params })

export default api
