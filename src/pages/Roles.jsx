import { useState, useEffect } from 'react'
import { rpc, SP } from '../api/api'

const COLS = '70px 1fr 2fr 110px'

export default function Roles() {
  const [lista,   setLista]   = useState([])
  const [loading, setLoading] = useState(true)
  const [msgErr,  setMsgErr]  = useState('')
  const [msgOk,   setMsgOk]   = useState('')
  const [search,  setSearch]  = useState('')

  // Modals
  const [showNew, setShowNew] = useState(false)
  const [editRol, setEditRol] = useState(null)
  const [delRol,  setDelRol]  = useState(null)

  // ── API ──────────────────────────────────────────────────────────────────
  const cargar = async () => {
    setLoading(true); setMsgErr('')
    try {
      const { data } = await rpc(SP.LISTAR_ROLES, [])
      setLista(data?.data ?? [])
    } catch (e) {
      setMsgErr(e.response?.data?.error ?? 'Error al cargar roles.')
    } finally { setLoading(false) }
  }

  useEffect(() => { cargar() }, [])

  const flash = msg => { setMsgOk(msg);  setTimeout(() => setMsgOk(''),  3500) }
  const err   = msg => { setMsgErr(msg); setTimeout(() => setMsgErr(''), 4000) }

  // SP 12 — eliminar: [nombre_rol]
  const handleEliminar = async () => {
    try {
      await rpc(SP.ELIMINAR_ROL, [delRol.nombre_rol])
      flash('Rol eliminado correctamente.')
      cargar()
    } catch (e) { err(e.response?.data?.error ?? 'Error al eliminar rol.') }
    setDelRol(null)
  }

  // ── Filtro ────────────────────────────────────────────────────────────────
  const filtrados = lista.filter(r => {
    const q = search.toLowerCase()
    return !q
      || r.nombre_rol?.toLowerCase().includes(q)
      || r.descripcion_rol?.toLowerCase().includes(q)
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Encabezado */}
      <div style={s.pageHead}>
        <div>
          <h1 style={s.pageTitle}>Gestión de Roles</h1>
          <p style={s.pageSub}>Define los roles y sus descripciones para asignarlos a los usuarios</p>
        </div>
      </div>

      {/* Alertas */}
      {msgErr && <div style={s.alertErr}>⚠️&nbsp; {msgErr}</div>}
      {msgOk  && <div style={s.alertOk}>✅&nbsp; {msgOk}</div>}

      {/* Stat */}
      <div style={s.statsGrid}>
        <StatCard icon="🎭" label="Total Roles"     value={lista.length} color="#7c3aed" />
        <StatCard icon="✅" label="Roles Activos"    value={lista.length} color="#16a34a" />
        <StatCard icon="👥" label="Roles en uso"     value="—"            color="#2e75b6" />
        <StatCard icon="📋" label="Sin descripción"  value={lista.filter(r => !r.descripcion_rol).length} color="#d97706" />
      </div>

      {/* Tabla */}
      <div style={s.tableCard}>

        {/* Toolbar */}
        <div style={s.toolbar}>
          <div style={s.srchWrap}>
            <span style={s.srchIco}>🔍</span>
            <input
              style={s.srchInput}
              placeholder="Filtrar por nombre o descripción…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button style={s.btnPri} onClick={() => setShowNew(true)}>🎭＋ Nuevo Rol</button>
          <span style={s.tblCount}>Mostrando {filtrados.length} de {lista.length} roles</span>
        </div>

        {/* Head */}
        <div style={{ ...s.row, ...s.rowHead, gridTemplateColumns: COLS }}>
          {['ID', 'NOMBRE ROL', 'DESCRIPCIÓN', 'ACCIONES'].map(c => (
            <span key={c} style={s.th}>{c}</span>
          ))}
        </div>

        {/* Filas */}
        {loading ? (
          <div style={s.empty}>⏳ Cargando roles…</div>
        ) : filtrados.length === 0 ? (
          <div style={s.empty}>📭 No se encontraron roles.</div>
        ) : (
          filtrados.map((r, i) => (
            <div
              key={r.id_rol}
              style={{ ...s.row, ...(i % 2 === 1 ? s.rowAlt : {}), gridTemplateColumns: COLS }}
            >
              {/* ID */}
              <span style={s.td}>
                <span style={s.idBadge}>#{String(r.id_rol).padStart(2, '0')}</span>
              </span>

              {/* Nombre */}
              <span style={{ ...s.td, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  ...s.rolAv,
                  background: `hsl(${(r.id_rol * 67) % 360}, 50%, 40%)`,
                }}>
                  {r.nombre_rol?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span style={s.rolNombre}>{r.nombre_rol}</span>
              </span>

              {/* Descripción */}
              <span style={{ ...s.td, color: '#6b7280', fontSize: '0.85rem' }}>
                {r.descripcion_rol || <em style={{ color: '#d1d5db' }}>Sin descripción</em>}
              </span>

              {/* Acciones */}
              <span style={{ ...s.td, display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                <Btn title="Editar rol"    onClick={() => setEditRol(r)}>✏️</Btn>
                <Btn title="Eliminar rol"  onClick={() => setDelRol(r)} danger>🗑️</Btn>
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
          icon="🎭"
          title="Sobre los Roles"
          text="Los roles definen los permisos y accesos de los usuarios en el sistema. Asigna un rol a cada usuario para controlar qué puede ver y hacer."
        />
        <InfoCard
          icon="⚠️"
          title="Antes de eliminar"
          text="No elimines un rol que esté asignado a usuarios activos. Primero reasigna esos usuarios a otro rol para evitar problemas de acceso."
        />
      </div>

      {/* Modals */}
      {showNew && (
        <NuevoRolModal
          onClose={() => setShowNew(false)}
          onSaved={id => { setShowNew(false); cargar(); flash(`Rol creado correctamente (ID: ${id}).`) }}
          onError={err}
        />
      )}
      {editRol && (
        <EditRolModal
          rol={editRol}
          onClose={() => setEditRol(null)}
          onSaved={() => { setEditRol(null); cargar(); flash('Rol actualizado correctamente.') }}
          onError={err}
        />
      )}
      {delRol && (
        <ConfirmModal
          msg={`¿Eliminar el rol "${delRol.nombre_rol}"? Esta acción no se puede deshacer.`}
          onConfirm={handleEliminar}
          onCancel={() => setDelRol(null)}
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

function Btn({ children, onClick, title, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{ ...s.aBtn, ...(danger ? s.aBtnDanger : {}) }}
    >
      {children}
    </button>
  )
}

function InfoCard({ icon, title, text }) {
  return (
    <div style={s.infoCard}>
      <div style={s.infoHead}><span>{icon}</span><span style={s.infoTitle}>{title}</span></div>
      <p style={s.infoText}>{text}</p>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, required, placeholder, readOnly }) {
  return (
    <div style={s.fieldGrp}>
      <label style={s.flabel}>{label}</label>
      <input
        style={{ ...s.finput, ...(readOnly ? { background: '#f3f4f6', color: '#6b7280' } : {}) }}
        name={name} type={type} value={value} onChange={onChange}
        required={required} placeholder={placeholder} readOnly={readOnly}
      />
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div style={s.overlay}>
      <div style={s.modal}>
        <div style={s.modalHead}>
          <h3 style={s.modalTitle}>{title}</h3>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Modal: Nuevo Rol ───────────────────────────────────────────────────────
// SP 9 — sp_rol_crear: [nombre_rol, descripcion_rol]
// Retorna: id_rol + mensaje
function NuevoRolModal({ onClose, onSaved, onError }) {
  const [form, setForm] = useState({ nombre_rol: '', descripcion_rol: '' })
  const [busy, setBusy] = useState(false)
  const upd = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      const { data } = await rpc(SP.CREAR_ROL, [form.nombre_rol, form.descripcion_rol])
      const id = data?.data?.[0]?.id_rol ?? '?'
      onSaved(id)
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al crear rol.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="🎭 Nuevo Rol" onClose={onClose}>
      <form onSubmit={submit} style={s.mForm}>
        <Field label="Nombre del rol *"  name="nombre_rol"     value={form.nombre_rol}     onChange={upd} required placeholder="Ej: Supervisor" />
        <Field label="Descripción"       name="descripcion_rol" value={form.descripcion_rol} onChange={upd} placeholder="Ej: Gestiona el inventario" />
        <div style={s.mFoot}>
          <button type="button" style={s.btnSec} onClick={onClose}>Cancelar</button>
          <button type="submit" style={s.btnPri} disabled={busy}>
            {busy ? '⏳ Creando…' : '✓ Crear Rol'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Modal: Editar Rol ──────────────────────────────────────────────────────
// SP 11 — sp_rol_actualizar: [nombre_rol, descripcion_rol]
// nombre_rol es el identificador — solo cambia descripcion_rol
function EditRolModal({ rol, onClose, onSaved, onError }) {
  const [descripcion, setDescripcion] = useState(rol.descripcion_rol ?? '')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      await rpc(SP.ACTUALIZAR_ROL, [rol.nombre_rol, descripcion])
      onSaved()
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al actualizar rol.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="✏️ Editar Rol" onClose={onClose}>
      <form onSubmit={submit} style={s.mForm}>
        <Field
          label="Nombre del rol"
          name="nombre_rol"
          value={rol.nombre_rol}
          onChange={() => {}}
          readOnly
        />
        <div style={s.fieldGrp}>
          <label style={s.flabel}>Descripción</label>
          <textarea
            style={{ ...s.finput, height: '80px', resize: 'vertical' }}
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Describe el propósito de este rol…"
          />
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
  pageHead:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' },
  pageTitle: { fontSize:'1.6rem', fontWeight:700, color:'#111827', margin:'0 0 0.2rem' },
  pageSub:   { fontSize:'0.875rem', color:'#6b7280', margin:0 },
  btnSec:    { padding:'0.5rem 1.1rem', background:'#fff', border:'1.5px solid #d1d5db', borderRadius:'8px', fontSize:'0.875rem', fontWeight:500, color:'#374151', cursor:'pointer' },
  btnPri:    { padding:'0.5rem 1.1rem', background:'linear-gradient(135deg,#1e3a5f,#2e75b6)', border:'none', borderRadius:'8px', fontSize:'0.875rem', fontWeight:600, color:'#fff', cursor:'pointer', whiteSpace:'nowrap' },

  alertErr:  { background:'#fef2f2', border:'1px solid #fca5a5', color:'#b91c1c', borderRadius:'8px', padding:'0.7rem 1rem', fontSize:'0.875rem' },
  alertOk:   { background:'#f0fdf4', border:'1px solid #86efac', color:'#166534', borderRadius:'8px', padding:'0.7rem 1rem', fontSize:'0.875rem' },

  statsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'1rem' },
  statCard:  { background:'#fff', borderRadius:'12px', padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  statIcon:  { width:'44px', height:'44px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.25rem', flexShrink:0 },
  statLabel: { fontSize:'0.7rem', color:'#6b7280', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:'0.2rem' },
  statValue: { fontSize:'1.5rem', fontWeight:700, color:'#111827', lineHeight:1 },

  tableCard: { background:'#fff', borderRadius:'12px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden' },
  toolbar:   { display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.9rem 1.25rem', borderBottom:'1px solid #f3f4f6', flexWrap:'wrap' },
  srchWrap:  { position:'relative', flex:1, minWidth:'200px', maxWidth:'320px' },
  srchIco:   { position:'absolute', left:'0.65rem', top:'50%', transform:'translateY(-50%)', fontSize:'0.8rem', pointerEvents:'none' },
  srchInput: { width:'100%', padding:'0.45rem 0.75rem 0.45rem 2rem', border:'1.5px solid #e5e7eb', borderRadius:'7px', fontSize:'0.85rem', outline:'none', boxSizing:'border-box', background:'#f9fafb' },
  tblCount:  { marginLeft:'auto', fontSize:'0.78rem', color:'#9ca3af', whiteSpace:'nowrap' },

  row:       { display:'grid', alignItems:'center', padding:'0 1.25rem', minHeight:'52px', gap:'0.5rem' },
  rowHead:   { background:'#f9fafb', borderBottom:'1px solid #f3f4f6', minHeight:'38px' },
  rowAlt:    { background:'#fafafa' },
  th:        { fontSize:'0.68rem', fontWeight:700, color:'#2e75b6', textTransform:'uppercase', letterSpacing:'0.5px' },
  td:        { fontSize:'0.875rem', color:'#111827', overflow:'hidden' },

  idBadge:   { background:'#f5f3ff', color:'#6d28d9', borderRadius:'6px', padding:'0.2rem 0.5rem', fontSize:'0.78rem', fontWeight:600, whiteSpace:'nowrap' },
  rolAv:     { width:'32px', height:'32px', borderRadius:'8px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.85rem', flexShrink:0 },
  rolNombre: { fontWeight:600, fontSize:'0.875rem', color:'#111827' },

  aBtn:       { width:'30px', height:'30px', borderRadius:'7px', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', padding:0 },
  aBtnDanger: { border:'1.5px solid #fecaca', background:'#fff5f5' },

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

  overlay:   { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' },
  modal:     { background:'#fff', borderRadius:'16px', width:'100%', maxWidth:'440px', boxShadow:'0 20px 60px rgba(0,0,0,0.2)', overflow:'hidden' },
  modalHead: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.1rem 1.5rem', borderBottom:'1px solid #f3f4f6' },
  modalTitle:{ fontSize:'1rem', fontWeight:700, color:'#111827', margin:0 },
  closeBtn:  { background:'none', border:'none', cursor:'pointer', fontSize:'1rem', color:'#9ca3af', padding:'0.2rem', lineHeight:1 },
  mForm:     { padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'1rem' },
  mFoot:     { display:'flex', justifyContent:'flex-end', gap:'0.75rem', marginTop:'0.25rem' },
  fieldGrp:  { display:'flex', flexDirection:'column', gap:'0.3rem' },
  flabel:    { fontSize:'0.75rem', fontWeight:600, color:'#374151', textTransform:'uppercase', letterSpacing:'0.3px' },
  finput:    { padding:'0.55rem 0.85rem', border:'1.5px solid #d1d5db', borderRadius:'7px', fontSize:'0.875rem', outline:'none', background:'#f9fafb', color:'#111827', boxSizing:'border-box', width:'100%' },
}
