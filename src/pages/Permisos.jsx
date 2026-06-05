import { useState, useEffect } from 'react'
import { rpc, SP } from '../api/api'

const COLS = '70px 1fr 2fr 110px'

export default function Permisos() {
  const [lista,   setLista]   = useState([])
  const [loading, setLoading] = useState(true)
  const [msgErr,  setMsgErr]  = useState('')
  const [msgOk,   setMsgOk]   = useState('')
  const [search,  setSearch]  = useState('')

  // Modals
  const [showNew,  setShowNew]  = useState(false)
  const [editPerm, setEditPerm] = useState(null)
  const [delPerm,  setDelPerm]  = useState(null)

  // ── API ──────────────────────────────────────────────────────────────────
  const cargar = async () => {
    setLoading(true); setMsgErr('')
    try {
      const { data } = await rpc(SP.LISTAR_PERMISOS, [])
      setLista(data?.data ?? [])
    } catch (e) {
      const msg =
        e.code === 'ECONNABORTED'        ? 'Tiempo de espera agotado. Verifica que el servidor esté corriendo.' :
        e.response?.data?.error          ? e.response.data.error :
        e.response?.data?.mensaje        ? e.response.data.mensaje :
        e.message                        ? e.message :
                                           'Error al cargar permisos.'
      setMsgErr(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { cargar() }, [])

  const flash = msg => { setMsgOk(msg);  setTimeout(() => setMsgOk(''),  3500) }
  const err   = msg => { setMsgErr(msg); setTimeout(() => setMsgErr(''), 4000) }

  // SP — eliminar: [nombre_permiso]
  const handleEliminar = async () => {
    try {
      await rpc(SP.ELIMINAR_PERMISO, [delPerm.nombre_permiso])
      flash('Permiso eliminado correctamente.')
      cargar()
    } catch (e) { err(e.response?.data?.error ?? 'Error al eliminar permiso.') }
    setDelPerm(null)
  }

  // ── Filtro ────────────────────────────────────────────────────────────────
  const filtrados = lista.filter(p => {
    const q = search.toLowerCase()
    return !q
      || p.nombre_permiso?.toLowerCase().includes(q)
      || p.descripcion_permiso?.toLowerCase().includes(q)
  })

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Encabezado */}
      <div style={s.pageHead}>
        <div>
          <h1 style={s.pageTitle}>Gestión de Permisos</h1>
          <p style={s.pageSub}>Define los permisos disponibles para asignar a roles y usuarios</p>
        </div>
      </div>

      {/* Solo alerta de éxito arriba — los errores se muestran dentro de la tabla */}
      {msgOk && <div style={s.alertOk}>✅&nbsp; {msgOk}</div>}

      {/* Stats */}
      <div style={s.statsGrid}>
        <StatCard icon="🔐" label="Total Permisos"    value={lista.length}                                    color="#7c3aed" />
        <StatCard icon="✅" label="Activos"            value={lista.length}                                    color="#16a34a" />
        <StatCard icon="📋" label="Con descripción"   value={lista.filter(p => p.descripcion_permiso).length} color="#2e75b6" />
        <StatCard icon="⚠️" label="Sin descripción"   value={lista.filter(p => !p.descripcion_permiso).length} color="#d97706" />
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
          <button style={s.btnPri} onClick={() => setShowNew(true)}>🔐＋ Nuevo Permiso</button>
          <span style={s.tblCount}>Mostrando {filtrados.length} de {lista.length} permisos</span>
        </div>

        {/* Head */}
        <div style={{ ...s.row, ...s.rowHead, gridTemplateColumns: COLS }}>
          {['ID', 'NOMBRE PERMISO', 'DESCRIPCIÓN', 'ACCIONES'].map(c => (
            <span key={c} style={s.th}>{c}</span>
          ))}
        </div>

        {/* Filas */}
        {loading ? (
          <div style={s.empty}>
            <div style={s.spinner}>⏳</div>
            <p>Cargando permisos…</p>
          </div>
        ) : msgErr ? (
          <div style={s.emptyErr}>
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <p style={{ color: '#b91c1c', fontWeight: 600, margin: '0.5rem 0 0.25rem' }}>
              Error al cargar permisos
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1rem' }}>{msgErr}</p>
            <button style={s.btnPri} onClick={cargar}>🔄 Reintentar</button>
          </div>
        ) : filtrados.length === 0 ? (
          <div style={s.empty}>📭 No se encontraron permisos.</div>
        ) : (
          filtrados.map((p, i) => (
            <div
              key={p.id_permiso}
              style={{ ...s.row, ...(i % 2 === 1 ? s.rowAlt : {}), gridTemplateColumns: COLS }}
            >
              {/* ID */}
              <span style={s.td}>
                <span style={s.idBadge}>#{String(p.id_permiso).padStart(2, '0')}</span>
              </span>

              {/* Nombre */}
              <span style={{ ...s.td, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{
                  ...s.permAv,
                  background: `hsl(${(p.id_permiso * 83) % 360}, 50%, 40%)`,
                }}>
                  {p.nombre_permiso?.[0]?.toUpperCase() ?? '?'}
                </div>
                <span style={s.permNombre}>{p.nombre_permiso}</span>
              </span>

              {/* Descripción */}
              <span style={{ ...s.td, color: '#6b7280', fontSize: '0.85rem' }}>
                {p.descripcion_permiso || <em style={{ color: '#d1d5db' }}>Sin descripción</em>}
              </span>

              {/* Acciones */}
              <span style={{ ...s.td, display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
                <Btn title="Editar permiso"   onClick={() => setEditPerm(p)}>✏️</Btn>
                <Btn title="Eliminar permiso" onClick={() => setDelPerm(p)} danger>🗑️</Btn>
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
          icon="🔐"
          title="Sobre los Permisos"
          text="Los permisos definen acciones específicas dentro del sistema. Se asignan a roles para controlar qué operaciones puede realizar cada usuario."
        />
        <InfoCard
          icon="⚠️"
          title="Antes de eliminar"
          text="No elimines un permiso que esté en uso por algún rol activo. Primero revisa las asignaciones para evitar restringir accesos no deseados."
        />
      </div>

      {/* Modals */}
      {showNew && (
        <NuevoPermisoModal
          onClose={() => setShowNew(false)}
          onSaved={id => { setShowNew(false); cargar(); flash(`Permiso creado correctamente (ID: ${id}).`) }}
          onError={err}
        />
      )}
      {editPerm && (
        <EditPermisoModal
          permiso={editPerm}
          onClose={() => setEditPerm(null)}
          onSaved={() => { setEditPerm(null); cargar(); flash('Permiso actualizado correctamente.') }}
          onError={err}
        />
      )}
      {delPerm && (
        <ConfirmModal
          msg={`¿Eliminar el permiso "${delPerm.nombre_permiso}"? Esta acción no se puede deshacer.`}
          onConfirm={handleEliminar}
          onCancel={() => setDelPerm(null)}
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
    <button title={title} onClick={onClick}
      style={{ ...s.aBtn, ...(danger ? s.aBtnDanger : {}) }}>
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

// ── Modal: Nuevo Permiso ───────────────────────────────────────────────────
// SP — sp_permiso_crear: [nombre_permiso, descripcion_permiso]
function NuevoPermisoModal({ onClose, onSaved, onError }) {
  const [form, setForm] = useState({ nombre_permiso: '', descripcion_permiso: '' })
  const [busy, setBusy] = useState(false)
  const upd = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      const { data } = await rpc(SP.CREAR_PERMISO, [form.nombre_permiso, form.descripcion_permiso])
      const id = data?.data?.[0]?.id_permiso ?? '?'
      onSaved(id)
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al crear permiso.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="🔐 Nuevo Permiso" onClose={onClose}>
      <form onSubmit={submit} style={s.mForm}>
        <div style={s.fieldGrp}>
          <label style={s.flabel}>Nombre del permiso *</label>
          <input style={s.finput} name="nombre_permiso" value={form.nombre_permiso}
            onChange={upd} required placeholder="Ej: ver_reportes" />
        </div>
        <div style={s.fieldGrp}>
          <label style={s.flabel}>Descripción</label>
          <textarea style={{ ...s.finput, height: '80px', resize: 'vertical' }}
            name="descripcion_permiso" value={form.descripcion_permiso}
            onChange={upd} placeholder="Describe para qué sirve este permiso…" />
        </div>
        <div style={s.mFoot}>
          <button type="button" style={s.btnSec} onClick={onClose}>Cancelar</button>
          <button type="submit" style={s.btnPri} disabled={busy}>
            {busy ? '⏳ Creando…' : '✓ Crear Permiso'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ── Modal: Editar Permiso ──────────────────────────────────────────────────
// SP — sp_permiso_actualizar: [nombre_permiso, descripcion_permiso]
function EditPermisoModal({ permiso, onClose, onSaved, onError }) {
  const [descripcion, setDescripcion] = useState(permiso.descripcion_permiso ?? '')
  const [busy, setBusy] = useState(false)

  const submit = async e => {
    e.preventDefault(); setBusy(true)
    try {
      await rpc(SP.ACTUALIZAR_PERMISO, [permiso.nombre_permiso, descripcion])
      onSaved()
    } catch (err) {
      onError(err.response?.data?.error ?? 'Error al actualizar permiso.')
    } finally { setBusy(false) }
  }

  return (
    <Modal title="✏️ Editar Permiso" onClose={onClose}>
      <form onSubmit={submit} style={s.mForm}>
        <div style={s.fieldGrp}>
          <label style={s.flabel}>Nombre del permiso</label>
          <input style={{ ...s.finput, background: '#f3f4f6', color: '#6b7280' }}
            value={permiso.nombre_permiso} readOnly />
        </div>
        <div style={s.fieldGrp}>
          <label style={s.flabel}>Descripción</label>
          <textarea style={{ ...s.finput, height: '80px', resize: 'vertical' }}
            value={descripcion} onChange={e => setDescripcion(e.target.value)}
            placeholder="Describe para qué sirve este permiso…" />
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
  permAv:    { width:'32px', height:'32px', borderRadius:'8px', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.85rem', flexShrink:0 },
  permNombre:{ fontWeight:600, fontSize:'0.875rem', color:'#111827' },

  aBtn:       { width:'30px', height:'30px', borderRadius:'7px', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', justifyContent:'center', padding:0 },
  aBtnDanger: { border:'1.5px solid #fecaca', background:'#fff5f5' },

  pgBar:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.65rem 1.25rem', borderTop:'1px solid #f3f4f6' },
  pgInfo:  { fontSize:'0.78rem', color:'#9ca3af' },
  pgBtns:  { display:'flex', gap:'0.3rem' },
  pgBtn:   { width:'28px', height:'28px', borderRadius:'6px', border:'1.5px solid #e5e7eb', background:'#fff', cursor:'pointer', fontSize:'0.8rem', color:'#374151', display:'flex', alignItems:'center', justifyContent:'center', padding:0 },
  pgBtnOn: { background:'#1e3a5f', color:'#fff', border:'1.5px solid #1e3a5f' },
  empty:    { padding:'3rem', display:'flex', flexDirection:'column', alignItems:'center', color:'#9ca3af', gap:'0.5rem', fontSize:'0.9rem' },
  emptyErr: { padding:'3rem', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' },
  spinner:  { fontSize:'2rem', animation:'spin 1s linear infinite' },

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
