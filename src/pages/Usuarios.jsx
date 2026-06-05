import { useState, useEffect } from 'react'
import { rpc, SP } from '../api/api'
import Roles from './Roles'
import Permisos from './Permisos'

// ── Helpers ────────────────────────────────────────────────────────────────
const ESTADO_STYLE = {
  activo:     { color: '#16a34a' },
  inactivo:   { color: '#dc2626' },
  suspendido: { color: '#d97706' },
}
const getEstadoStyle = e => ESTADO_STYLE[e?.toLowerCase()] ?? { color: '#6b7280' }
const nombreCompleto = u => `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim()
const COLS = '72px 1.2fr 110px 1.1fr 100px 110px'

// ── Componente principal ───────────────────────────────────────────────────
const TABS = ['Usuarios', 'Roles', 'Permisos']

export default function Usuarios() {
  const [lista,   setLista]   = useState([])
  const [loading, setLoading] = useState(true)
  const [msgErr,  setMsgErr]  = useState('')
  const [msgOk,   setMsgOk]   = useState('')
  const [search,  setSearch]  = useState('')
  const [estFil,  setEstFil]  = useState('Todos')
  const [tab,     setTab]     = useState('Usuarios')

  // Modals
  const [showNew, setShowNew] = useState(false)
  const [editUsr, setEditUsr] = useState(null)
  const [delUsr,  setDelUsr]  = useState(null)

  // ── API ──────────────────────────────────────────────────────────────────
  const cargar = async () => {
    setLoading(true); setMsgErr('')
    try {
      const { data } = await rpc(SP.LISTAR_USUARIOS, [])
      setLista(data?.data ?? [])
    } catch (e) {
      setMsgErr(e.response?.data?.error ?? 'Error al cargar usuarios.')
    } finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const flash = msg => { setMsgOk(msg);  setTimeout(() => setMsgOk(''),  3500) }
  const err   = msg => { setMsgErr(msg); setTimeout(() => setMsgErr(''), 4000) }

  // SP 6 — gestionar bloqueo: [username, p_bloquear BOOLEAN]
  const handleBloqueo = async u => {
    const bloquear = !u.bloque_usuario
    try {
      await rpc(SP.BLOQUEO, [u.username, bloquear])
      flash(`Usuario ${bloquear ? 'bloqueado' : 'desbloqueado'} correctamente.`)
      cargar()
    } catch (e) { err(e.response?.data?.error ?? 'Error al cambiar bloqueo.') }
  }

  // SP 5 — eliminar: [username]
  const handleEliminar = async () => {
    try {
      await rpc(SP.ELIMINAR, [delUsr.username])
      flash('Usuario eliminado correctamente.')
      cargar()
    } catch (e) { err(e.response?.data?.error ?? 'Error al eliminar usuario.') }
    setDelUsr(null)
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const total      = lista.length
  const activos    = lista.filter(u => u.estado_usuario === 'activo').length
  const bloqueados = lista.filter(u => u.bloque_usuario === true).length
  const inactivos  = lista.filter(u => u.estado_usuario !== 'activo').length

  // ── Filtros ───────────────────────────────────────────────────────────────
  const ESTADOS = ['Todos', 'activo', 'inactivo', 'suspendido']
  const filtrados = lista.filter(u => {
    const q = search.toLowerCase()
    const matchQ = !q
      || u.nombre?.toLowerCase().includes(q)
      || u.apellido?.toLowerCase().includes(q)
      || u.username?.toLowerCase().includes(q)
      || u.correo?.toLowerCase().includes(q)
    const matchE = estFil === 'Todos' || u.estado_usuario === estFil
    return matchQ && matchE
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Encabezado */}
      <div style={s.pageHead}>
        <div>
          <h1 style={s.pageTitle}>Gestión de Usuarios</h1>
          <p style={s.pageSub}>Administra los permisos y accesos del personal de almacén</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div style={s.tabBar}>
        {TABS.map(t => (
          <button
            key={t}
            style={{ ...s.tabBtn, ...(tab === t ? s.tabBtnOn : {}) }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Alertas */}
      {msgErr && <div style={s.alertErr}>⚠️&nbsp; {msgErr}</div>}
      {msgOk  && <div style={s.alertOk}>✅&nbsp; {msgOk}</div>}

      {/* Contenido según tab */}
      {tab === 'Roles' ? <Roles /> :
       tab === 'Permisos' ? <Permisos /> : (
      <>

      {/* Stats */}
      <div style={s.statsGrid}>
        <StatCard icon="👥" label="Total Usuarios" value={total}      color="#2e75b6" />
        <StatCard icon="✅" label="Activos"         value={activos}    color="#16a34a" />
        <StatCard icon="🔒" label="Bloqueados"      value={bloqueados} color="#d97706" />
        <StatCard icon="🚫" label="Inactivos"       value={inactivos}  color="#dc2626" />
      </div>

      {/* Tabla */}
      <div style={s.tableCard}>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.srchWrap}>
            <span style={s.srchIco}>🔍</span>
            <input
              style={s.srchInput}
              placeholder="Filtrar por nombre, usuario o correo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button style={s.chip} onClick={() => setEstFil('Todos')}>Todos los Estados</button>
          <button style={s.btnPri} onClick={() => setShowNew(true)}>👤＋ Nuevo Usuario</button>
          <span style={s.tblCount}>Mostrando {filtrados.length} de {total} usuarios</span>
        </div>

        {/* Head */}
        <div style={{ ...s.row, ...s.rowHead, gridTemplateColumns: COLS }}>
          {['ID', 'NOMBRE', 'USUARIO', 'CORREO', 'ESTADO', 'ACCIONES'].map(c => (
            <span key={c} style={s.th}>{c}</span>
          ))}
        </div>

        {/* Filas */}
        {loading ? (
          <div style={s.empty}>⏳ Cargando usuarios…</div>
        ) : filtrados.length === 0 ? (
          <div style={s.empty}>📭 No se encontraron usuarios.</div>
        ) : (
          filtrados.map((u, i) => (
            <div
              key={u.id_usuario}
              style={{ ...s.row, ...(i % 2 === 1 ? s.rowAlt : {}), gridTemplateColumns: COLS }}
            >
              {/* ID */}
              <span style={s.td}>
                <span style={s.idBadge}>#{String(u.id_usuario).padStart(3, '0')}</span>
              </span>

              {/* Nombre + apellido */}
              <span style={{ ...s.td, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  ...s.av,
                  background: `hsl(${(u.id_usuario * 53) % 360}, 50%, 40%)`,
                }}>
                  {u.nombre?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                  <div style={s.uName}>{nombreCompleto(u)}</div>
                  <div style={s.uSub}>{u.telefono ?? '—'}</div>
                </div>
              </span>

              {/* Username */}
              <span style={{ ...s.td, color: '#4b5563', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                @{u.username}
              </span>

              {/* Correo */}
              <span style={{ ...s.td, color: '#4b5563', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.correo ?? '—'}
              </span>

              {/* Estado + bloqueo */}
              <span style={{ ...s.td, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ ...s.dot, ...getEstadoStyle(u.estado_usuario) }}>
                  ● {u.estado_usuario ?? '—'}
                </span>
                {u.bloque_usuario && (
                  <span style={{ fontSize: '0.7rem', color: '#b45309', fontWeight: 600 }}>🔒 Bloqueado</span>
                )}
              </span>

              {/* Acciones */}
              <span style={{ ...s.td, display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                <Btn title="Editar usuario"                           onClick={() => setEditUsr(u)}>✏️</Btn>
                <Btn
                  title={u.bloque_usuario ? 'Desbloquear usuario' : 'Bloquear usuario'}
                  warn={!!u.bloque_usuario}
                  onClick={() => handleBloqueo(u)}
                >
                  {u.bloque_usuario ? '🔒' : '🔓'}
                </Btn>
                <Btn title="Eliminar usuario" danger                  onClick={() => setDelUsr(u)}>🗑️</Btn>
              </span>
            </div>
          ))
        )}

        {/* Paginación */}
        <div style={s.pgBar}>
          <span style={s.pgInfo}>Página 1 de 1</span>
          <div style={s.pgBtns}>
            <button style={s.pgBtn} disabled>‹</button>
            <button style={{ ...s.pgBtn, ...s.pgBtnOn }}>1</button>
            <button style={s.pgBtn} disabled>›</button>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div style={s.infoGrid}>
        <InfoCard
          icon="🛡️"
          title="Políticas de Seguridad"
          text="Los usuarios bloqueados no podrán iniciar sesión. Al desbloquear se reinician los intentos fallidos. El estado 'suspendido' indica una revisión pendiente."
          link="Ver manual de permisos"
        />
        <InfoCard
          icon="📋"
          title="Auditoría de Sistemas"
          text="Última revisión general de accesos realizada el 15 de Octubre, 2025. Se recomienda realizar una depuración de usuarios inactivos cada 90 días."
          action="Generar Reporte de Auditoría"
        />
      </div>

      </> // fin tab Usuarios
      )} {/* fin condicional tab */}

      {/* Modals */}
      {showNew && (
        <NuevoModal
          onClose={() => setShowNew(false)}
          onSaved={user => { setShowNew(false); cargar(); flash(`Usuario creado. Username asignado: ${user}`) }}
          onError={err}
        />
      )}
      {editUsr && (
        <EditModal
          usuario={editUsr}
          onClose={() => setEditUsr(null)}
          onSaved={() => { setEditUsr(null); cargar(); flash('Usuario actualizado correctamente.') }}
          onError={err}
        />
      )}
      {delUsr && (
        <ConfirmModal
          msg={`¿Eliminar a "${nombreCompleto(delUsr)}" (@${delUsr.username})? Esta acción no se puede deshacer.`}
          onConfirm={handleEliminar}
          onCancel={() => setDelUsr(null)}
        />
      )}
    </>
  )
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function StatCard({ icon, label, value, color }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIcon, background: color + '18', color }}>{icon}</div>
      <div>
        <div style={s.statLabel}>{label}</div>
        <div style={s.statValue}>{value}</div>
      </div>
    </div>
  )
}

function Btn({ children, onClick, title, danger, warn }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ ...s.aBtn, ...(danger ? s.aBtnDanger : warn ? s.aBtnWarn : {}) }}
    >
      {children}
    </button>
  )
}

function InfoCard({ icon, title, text, link, action }) {
  return (
    <div style={s.infoCard}>
      <div style={s.infoHead}><span>{icon}</span><span style={s.infoTitle}>{title}</span></div>
      <p style={s.infoText}>{text}</p>
      {link   && <a href="#" style={s.infoLink}>{link} ↗</a>}
      {action && <button style={s.infoBtn}>{action}</button>}
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, required, placeholder, children }) {
  return (
    <div style={s.fieldGrp}>
      <label style={s.flabel}>{label}</label>
      {children ?? (
        <input style={s.finput} name={name} type={type} value={value}
          onChange={onChange} required={required} placeholder={placeholder} />
      )}
    </div>
  )
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={s.overlay}>
      <div style={{ ...s.modal, ...(wide ? { maxWidth: '560px' } : {}) }}>
        <div style={s.modalHead}>
          <h3 style={s.modalTitle}>{title}</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Modal: Nuevo usuario ───────────────────────────────────────────────────
// SP 2 — sp_usuario_crear: [nombre, apellido, password, direccion, correo, telefono]
// Retorna: username (auto-generado por la BD)
function NuevoModal({ onClose, onSaved, onError }) {
  const [form, setForm] = useState({ nombre: '', apellido: '', password: '', direccion: '', correo: '', telefono: '' })
  const [busy, setBusy] = useState(false)
  const upd = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      const { data } = await rpc(SP.CREAR_USUARIO, [
        form.nombre, form.apellido, form.password,
        form.direccion, form.correo, form.telefono,
      ])
      // data.data[0].username viene del RETURNING del SP
      const username = data?.data?.[0]?.username ?? ''
      onSaved(username)
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al crear usuario.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="➕ Nuevo Usuario" onClose={onClose} wide>
      <form onSubmit={submit} style={s.mForm}>
        <div style={s.mGrid}>
          <Field label="Nombre *"     name="nombre"    value={form.nombre}    onChange={upd} required />
          <Field label="Apellido *"   name="apellido"  value={form.apellido}  onChange={upd} required />
          <Field label="Correo *"     name="correo"    type="email" value={form.correo} onChange={upd} required />
          <Field label="Teléfono"     name="telefono"  value={form.telefono}  onChange={upd} placeholder="Ej: 987654321" />
          <Field label="Contraseña *" name="password"  type="password" value={form.password} onChange={upd} required />
          <Field label="Dirección"    name="direccion" value={form.direccion} onChange={upd} />
        </div>
        <p style={s.mNote}>📌 El nombre de usuario (username) será generado automáticamente por el sistema.</p>
        <div style={s.mFoot}>
          <button type="button" style={s.btnSec} onClick={onClose}>Cancelar</button>
          <button type="submit" style={s.btnPri} disabled={busy}>
            {busy ? '⏳ Creando…' : '✓ Crear Usuario'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Modal: Editar usuario ──────────────────────────────────────────────────
// SP 4 — sp_usuario_actualizar: [username, nombre, apellido, direccion, correo, telefono]
// SP 7 — sp_usuario_modificarestado: [username, nuevo_estado] (solo si cambió)
function EditModal({ usuario, onClose, onSaved, onError }) {
  const [form, setForm] = useState({
    nombre:         usuario.nombre         ?? '',
    apellido:       usuario.apellido       ?? '',
    correo:         usuario.correo         ?? '',
    telefono:       usuario.telefono       ?? '',
    direccion:      usuario.direccion      ?? '',
    estado_usuario: usuario.estado_usuario ?? 'activo',
  })
  const [busy, setBusy] = useState(false)
  const upd = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      // SP 4: actualizar datos
      await rpc(SP.ACTUALIZAR, [
        usuario.username,
        form.nombre, form.apellido,
        form.direccion, form.correo, form.telefono,
      ])
      // SP 7: cambiar estado solo si fue modificado
      if (form.estado_usuario !== usuario.estado_usuario) {
        await rpc(SP.ESTADO, [usuario.username, form.estado_usuario])
      }
      onSaved()
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al actualizar usuario.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="✏️ Editar Usuario" onClose={onClose} wide>
      {/* Info del usuario */}
      <div style={s.mUserInfo}>
        <div style={{
          ...s.mAvatar,
          background: `hsl(${(usuario.id_usuario * 53) % 360}, 50%, 40%)`,
        }}>
          {usuario.nombre?.[0]?.toUpperCase() ?? '?'}
        </div>
        <div>
          <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>
            {nombreCompleto(usuario)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>@{usuario.username}</div>
        </div>
      </div>

      <form onSubmit={submit} style={s.mForm}>
        <div style={s.mGrid}>
          <Field label="Nombre *"   name="nombre"   value={form.nombre}   onChange={upd} required />
          <Field label="Apellido *" name="apellido" value={form.apellido} onChange={upd} required />
          <Field label="Correo *"   name="correo"   type="email" value={form.correo} onChange={upd} required />
          <Field label="Teléfono"   name="telefono" value={form.telefono} onChange={upd} />
          <Field label="Dirección"  name="direccion" value={form.direccion} onChange={upd} />
          <Field label="Estado">
            <select name="estado_usuario" value={form.estado_usuario} onChange={upd} style={s.fselect}>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </Field>
        </div>
        <div style={s.mFoot}>
          <button type="button" style={s.btnSec} onClick={onClose}>Cancelar</button>
          <button type="submit" style={s.btnPri} disabled={busy}>
            {busy ? '⏳ Guardando…' : '✓ Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Modal: Confirmar eliminación ───────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <Modal title="🗑️ Confirmar eliminación" onClose={onCancel}>
      <p style={{ padding: '1rem 1.5rem 0', color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' }}>
        {msg}
      </p>
      <div style={{ ...s.mFoot, padding: '1.25rem 1.5rem' }}>
        <button style={s.btnSec} onClick={onCancel}>Cancelar</button>
        <button style={{ ...s.btnPri, background: '#dc2626' }} onClick={onConfirm}>
          🗑️ Eliminar
        </button>
      </div>
    </Modal>
  )
}

// ── Estilos ────────────────────────────────────────────────────────────────
const s = {
  pageHead:    { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' },
  pageTitle:   { fontSize:'1.6rem', fontWeight:700, color:'#111827', margin:'0 0 0.2rem' },
  pageSub:     { fontSize:'0.875rem', color:'#6b7280', margin:0 },
  headActions: { display:'flex', gap:'0.75rem', flexShrink:0 },
  btnSec:      { padding:'0.5rem 1.1rem', background:'#fff', border:'1.5px solid #d1d5db', borderRadius:'8px', fontSize:'0.875rem', fontWeight:500, color:'#374151', cursor:'pointer' },
  btnPri:      { padding:'0.5rem 1.1rem', background:'linear-gradient(135deg,#1e3a5f,#2e75b6)', border:'none', borderRadius:'8px', fontSize:'0.875rem', fontWeight:600, color:'#fff', cursor:'pointer', whiteSpace:'nowrap' },

  // Sub-tabs
  tabBar:        { display:'flex', gap:0, borderBottom:'2px solid #e5e7eb', marginBottom:'0.25rem' },
  tabBtn:        { padding:'0.6rem 1.25rem', background:'none', border:'none', borderBottom:'2px solid transparent', marginBottom:'-2px', fontSize:'0.9rem', fontWeight:500, color:'#6b7280', cursor:'pointer' },
  tabBtnOn:      { color:'#1e3a5f', borderBottomColor:'#2e75b6', fontWeight:700 },
  tabPlaceholder:{ background:'#fff', borderRadius:'12px', padding:'4rem 2rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', color:'#9ca3af' },

  alertErr:  { background:'#fef2f2', border:'1px solid #fca5a5', color:'#b91c1c', borderRadius:'8px', padding:'0.7rem 1rem', fontSize:'0.875rem' },
  alertOk:   { background:'#f0fdf4', border:'1px solid #86efac', color:'#166534', borderRadius:'8px', padding:'0.7rem 1rem', fontSize:'0.875rem' },

  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'1rem' },
  statCard:  { background:'#fff', borderRadius:'12px', padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  statIcon:  { width:'44px', height:'44px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', flexShrink:0 },
  statLabel: { fontSize:'0.7rem', color:'#6b7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.2rem' },
  statValue: { fontSize:'1.5rem', fontWeight:700, color:'#111827', lineHeight:1 },

  tableCard: { background:'#fff', borderRadius:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden' },
  toolbar:   { display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.9rem 1.25rem', borderBottom:'1px solid #f3f4f6', flexWrap:'wrap' },
  srchWrap:  { position:'relative', flex:1, minWidth:'200px', maxWidth:'300px' },
  srchIco:   { position:'absolute', left:'0.65rem', top:'50%', transform:'translateY(-50%)', fontSize:'0.8rem', pointerEvents:'none' },
  srchInput: { width:'100%', padding:'0.45rem 0.75rem 0.45rem 2rem', border:'1.5px solid #e5e7eb', borderRadius:'7px', fontSize:'0.85rem', outline:'none', boxSizing:'border-box', background:'#f9fafb' },
  chip:      { padding:'0.35rem 0.85rem', border:'1.5px solid #e5e7eb', borderRadius:'20px', background:'#f9fafb', fontSize:'0.78rem', color:'#374151', cursor:'pointer', fontWeight:500, whiteSpace:'nowrap' },
  chipOn:    { background:'#1e3a5f', color:'#fff', border:'1.5px solid #1e3a5f' },
  tblCount:  { marginLeft:'auto', fontSize:'0.78rem', color:'#9ca3af', whiteSpace:'nowrap' },

  row:       { display:'grid', alignItems:'center', padding:'0 1.25rem', minHeight:'54px', gap:'0.5rem' },
  rowHead:   { background:'#f9fafb', borderBottom:'1px solid #f3f4f6', minHeight:'38px' },
  rowAlt:    { background:'#fafafa' },
  th:        { fontSize:'0.68rem', fontWeight:700, color:'#2e75b6', textTransform:'uppercase', letterSpacing:'0.5px' },
  td:        { fontSize:'0.875rem', color:'#111827', overflow:'hidden' },

  idBadge:   { background:'#eff6ff', color:'#1d4ed8', borderRadius:'6px', padding:'0.2rem 0.5rem', fontSize:'0.78rem', fontWeight:600, whiteSpace:'nowrap' },
  av:        { width:'34px', height:'34px', borderRadius:'50%', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.9rem', flexShrink:0 },
  uName:     { fontWeight:600, fontSize:'0.875rem', color:'#111827', lineHeight:1.3 },
  uSub:      { fontSize:'0.75rem', color:'#9ca3af' },
  dot:       { fontSize:'0.8rem', fontWeight:500 },

  aBtn:       { width:'30px', height:'30px', borderRadius:'7px', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', padding:0 },
  aBtnDanger: { border:'1.5px solid #fecaca', background:'#fff5f5' },
  aBtnWarn:   { border:'1.5px solid #fde68a', background:'#fffbeb' },

  pgBar:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.65rem 1.25rem', borderTop:'1px solid #f3f4f6' },
  pgInfo:  { fontSize:'0.78rem', color:'#9ca3af' },
  pgBtns:  { display:'flex', gap:'0.3rem' },
  pgBtn:   { width:'28px', height:'28px', borderRadius:'6px', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'0.8rem', color:'#374151', display:'flex', alignItems:'center', justifyContent:'center', padding:0 },
  pgBtnOn: { background:'#1e3a5f', color:'#fff', border:'1.5px solid #1e3a5f' },
  empty:   { padding:'3rem', display:'flex', flexDirection:'column', alignItems:'center', color:'#9ca3af', gap:'0.5rem', fontSize:'0.9rem' },

  infoGrid:  { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1rem' },
  infoCard:  { background:'#1e3a5f', borderRadius:'12px', padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'0.6rem' },
  infoHead:  { display:'flex', alignItems:'center', gap:'0.5rem' },
  infoTitle: { color:'#fff', fontWeight:700, fontSize:'0.95rem' },
  infoText:  { color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', lineHeight:1.55, margin:0 },
  infoLink:  { color:'#93c5fd', fontSize:'0.82rem', textDecoration:'none', fontWeight:500 },
  infoBtn:   { padding:'0.5rem 1rem', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'8px', color:'#fff', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', alignSelf:'flex-start' },

  overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
  modal:     { background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'480px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', overflow:'hidden' },
  modalHead: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.1rem 1.5rem', borderBottom:'1px solid #f3f4f6' },
  modalTitle:{ fontSize:'1rem', fontWeight:700, color:'#111827', margin:0 },
  closeBtn:  { background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'#9ca3af', padding:'0.2rem', lineHeight:1 },

  mUserInfo: { display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.9rem 1.5rem', background:'#f9fafb', borderBottom:'1px solid #f3f4f6' },
  mAvatar:   { width:'40px', height:'40px', borderRadius:'50%', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1rem', flexShrink:0 },
  mForm:     { padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  mGrid:     { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' },
  mNote:     { fontSize:'0.78rem', color:'#6b7280', background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'7px', padding:'0.6rem 0.85rem', margin:0 },
  mFoot:     { display:'flex', justifyContent:'flex-end', gap:'0.75rem', marginTop:'0.25rem' },
  fieldGrp:  { display:'flex', flexDirection:'column', gap:'0.3rem' },
  flabel:    { fontSize:'0.75rem', fontWeight:600, color:'#374151', textTransform:'uppercase', letterSpacing:'0.3px' },
  finput:    { padding:'0.55rem 0.85rem', border:'1.5px solid #d1d5db', borderRadius:'7px', fontSize:'0.875rem', outline:'none', background:'#f9fafb', color:'#111827', boxSizing:'border-box', width:'100%' },
  fselect:   { padding:'0.55rem 0.85rem', border:'1.5px solid #d1d5db', borderRadius:'7px', fontSize:'0.875rem', outline:'none', background:'#f9fafb', color:'#111827', width:'100%' },
}
