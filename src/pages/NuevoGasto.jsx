import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants/colors';
import { CAT_GASTOS, CAT_ICONS } from '../constants/data';

const fmt = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const today = () => new Date().toISOString().split('T')[0];
const inp = { width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(0,0,0,0.12)', fontSize:14, boxSizing:'border-box' };

export default function NuevoGasto({ add }) {
  const nav = useNavigate();
  const [f, setF] = useState({ fecha:today(), categoria:CAT_GASTOS[0], monto:'', descripcion:'', recurrente:false });
  const [errors, setErrors] = useState({});
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    const e = {};
    if (!f.monto || parseFloat(f.monto) <= 0) e.monto = 'Ingresa un monto válido';
    setErrors(e);
    if (Object.keys(e).length) return;
    add({ id:Date.now(), tipo:'gasto', fecha:f.fecha, monto:parseFloat(f.monto),
          categoria:f.categoria, descripcion:f.descripcion, recurrente:f.recurrente });
    nav('/');
  };

  return (
    <div style={{ maxWidth:480, margin:'0 auto' }}>
      <div style={{ background: COLORS.gastos, borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ fontSize:22 }}>↓</span>
        <span style={{ color:'#fff', fontWeight:600, fontSize:18 }}>Nuevo gasto</span>
      </div>

      <div style={{ marginBottom:16 }}>
        <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:8 }}>Categoría</label>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
          {CAT_GASTOS.map(c => (
            <button key={c} onClick={()=>setF(v=>({...v,categoria:c}))} style={{ padding:'10px 6px', borderRadius:8, border:`1px solid ${f.categoria===c?COLORS.gastos:'rgba(0,0,0,0.12)'}`, background:f.categoria===c?'#FAECE7':'#fff', color:f.categoria===c?'#993C1D': COLORS.textSecondary, fontSize:11, cursor:'pointer', fontWeight:f.categoria===c?500:400, display:'flex', flexDirection:'column', alignItems:'center', gap:4, lineHeight:1.2 }}>
              <span style={{ fontSize:18 }}>{CAT_ICONS[c]}</span>{c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Monto (COP)</label>
          <input type="number" min="0" placeholder="ej. 25000" style={inp} value={f.monto} onChange={set('monto')} />
          {errors.monto && <p style={{ fontSize:11, color: COLORS.gastos, marginTop:3 }}>{errors.monto}</p>}
        </div>
        <div>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Fecha</label>
          <input type="date" style={inp} value={f.fecha} onChange={set('fecha')} />
        </div>
        <div style={{ gridColumn:'1/-1' }}>
          <label style={{ fontSize:12, fontWeight:500, color: COLORS.textSecondary, display:'block', marginBottom:6 }}>Descripción (opcional)</label>
          <input type="text" placeholder="ej. Bolsas kraft x100" style={inp} value={f.descripcion} onChange={set('descripcion')} />
        </div>
      </div>

      <label style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color: COLORS.textSecondary, cursor:'pointer', marginBottom:16 }}>
        <input type="checkbox" checked={f.recurrente} onChange={e=>setF(p=>({...p,recurrente:e.target.checked}))} style={{ width:16, height:16 }} />
        Gasto recurrente mensual
      </label>

      <div style={{ background:'#FAECE7', borderRadius:10, padding:'14px 18px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:'#993C1D' }}>{f.categoria}</div>
          <div style={{ fontSize:13, color:'#712B13', marginTop:2 }}>{f.descripcion||'Sin descripción'}</div>
        </div>
        <span style={{ fontSize:22, fontWeight:600, color:'#712B13' }}>{f.monto?fmt(parseFloat(f.monto)):'$0'}</span>
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <button onClick={()=>nav(-1)} style={{ flex:1, padding:'11px', borderRadius:10, border:'1px solid rgba(0,0,0,0.12)', background:'#fff', cursor:'pointer', fontSize:14 }}>Cancelar</button>
        <button onClick={submit} style={{ flex:2, padding:'11px', background: COLORS.gastos, color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontWeight:600, fontSize:14 }}>Registrar gasto</button>
      </div>
    </div>
  );
}