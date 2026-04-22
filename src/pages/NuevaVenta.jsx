import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { PRODUCTOS, CANALES } from '../constants/data';

const fmt = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const today = () => new Date().toISOString().split('T')[0];
const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(0,0,0,0.12)', fontSize:14, boxSizing:'border-box' };

export default function NuevaVenta({ add }) {
  const nav = useNavigate();
  const [f, setF] = useState({ fecha:today(), producto:PRODUCTOS[0], canal:CANALES[0], cantidad:'1', precio:'', nota:'' });
  const [errors, setErrors] = useState({});
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const total = (parseInt(f.cantidad)||0) * (parseFloat(f.precio)||0);

  const submit = () => {
    const e = {};
    if (!f.precio || parseFloat(f.precio) <= 0) e.precio = 'Ingresa un precio válido';
    if (!f.cantidad || parseInt(f.cantidad) <= 0) e.cantidad = 'Mínimo 1';
    setErrors(e);
    if (Object.keys(e).length) return;
    add({ id:Date.now(), tipo:'venta', fecha:f.fecha, monto:total,
          producto:f.producto, canal:f.canal, cantidad:parseInt(f.cantidad), nota:f.nota });
    nav('/');
  };

  return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <div style={{ background: COLORS.ventas, borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:22 }}>↑</span>
        <span style={{ color:'#fff', fontWeight:600, fontSize:18 }}>Nueva venta</span>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:8 }}>Producto</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {PRODUCTOS.map(p => (
            <button key={p} onClick={()=>setF(v=>({...v,producto:p}))} style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${f.producto===p?COLORS.ventas:'rgba(0,0,0,0.12)'}`, background:f.producto===p?'#E1F5EE':'#fff', color:f.producto===p?'#0F6E56': COLORS.textSecondary, fontSize:13, cursor:'pointer', fontWeight:f.producto===p?500:400 }}>{p}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:8 }}>Canal de venta</label>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {CANALES.map(c => (
            <button key={c} onClick={()=>setF(v=>({...v,canal:c}))} style={{ padding:'7px 14px', borderRadius:20, border:`1px solid ${f.canal===c?COLORS.ventas:'rgba(0,0,0,0.12)'}`, background:f.canal===c?'#E1F5EE':'#fff', color:f.canal===c?'#0F6E56': COLORS.textSecondary, fontSize:13, cursor:'pointer', fontWeight:f.canal===c?500:400 }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Precio unitario (COP)</label>
          <input type="number" min="0" placeholder="ej. 60000" style={inp} value={f.precio} onChange={set('precio')} />
          {errors.precio && <p style={{ fontSize:11, color: COLORS.gastos, marginTop:3 }}>{errors.precio}</p>}
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Cantidad</label>
          <input type="number" min="1" style={inp} value={f.cantidad} onChange={set('cantidad')} />
          {errors.cantidad && <p style={{ fontSize:11, color: COLORS.gastos, marginTop:3 }}>{errors.cantidad}</p>}
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Fecha</label>
          <input type="date" style={inp} value={f.fecha} onChange={set('fecha')} />
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Nota (opcional)</label>
          <input type="text" placeholder="ej. Cliente frecuente" style={inp} value={f.nota} onChange={set('nota')} />
        </div>
      </div>

      <div style={{ background:'#E1F5EE', borderRadius:10, padding:'14px 18px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:13, color:'#0F6E56' }}>Total a registrar</span>
        <span style={{ fontSize:22, fontWeight:600, color:'#085041' }}>{fmt(total)}</span>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={()=>nav(-1)} style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid rgba(0,0,0,0.12)', background:'#fff', cursor:'pointer', fontSize:14 }}>Cancelar</button>
        <button onClick={submit} style={{ flex:2, padding:'11px', background: COLORS.ventas, color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:14 }}>Registrar venta</button>
      </div>
    </div>
  );
}