import { useState } from 'react';
import { COLORS } from '../constants/colors';
import { MESES }  from '../constants/data';

const fmt = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const year = new Date().getFullYear();

export default function Registros({ records, remove }) {
  const [tipo, setTipo] = useState('todos');
  const [mes,  setMes]  = useState('todos');

  const filtered = records.filter(r => {
    if (tipo !== 'todos' && r.tipo !== tipo) return false;
    if (mes  !== 'todos') {
      const d = new Date(r.fecha+'T00:00:00');
      if (d.getMonth() !== parseInt(mes) || d.getFullYear() !== year) return false;
    }
    return true;
  });

  return (
    <div>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:20 }}>Registros</h1>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <select value={tipo} onChange={e=>setTipo(e.target.value)} style={{ flex:1, padding:'8px 10px', borderRadius:8, border:`1px solid ${COLORS.border}` }}>
          <option value="todos">Todos los tipos</option>
          <option value="venta">Ventas</option>
          <option value="gasto">Gastos</option>
        </select>
        <select value={mes} onChange={e=>setMes(e.target.value)} style={{ flex:1, padding:'8px 10px', borderRadius:8, border:`1px solid ${COLORS.border}` }}>
          <option value="todos">Todos los meses</option>
          {MESES.map((m,i) => <option key={i} value={i}>{m} {year}</option>)}
        </select>
      </div>

      {filtered.length === 0
        ? <div style={{ textAlign:'center', padding:'3rem', color: COLORS.textSecondary }}>Sin registros con estos filtros.</div>
        : filtered.map(r => (
          <div key={r.id} style={{ background:'#fff', border:`1px solid rgba(0,0,0,0.07)`, borderRadius:10, padding:'12px 16px', marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:11, padding:'2px 10px', borderRadius:20, background:r.tipo==='venta'?'#E1F5EE':'#FAECE7', color:r.tipo==='venta'?'#0F6E56':'#993C1D', fontWeight:500 }}>
                  {r.tipo==='venta'?'Venta':'Gasto'}
                </span>
                <span style={{ fontSize:12, color: COLORS.textSecondary }}>{r.fecha}</span>
              </div>
              <div style={{ fontSize:13, color: COLORS.textSecondary }}>
                {r.tipo==='venta'
                  ? `${r.producto} · ${r.canal} · ×${r.cantidad}${r.nota?' — '+r.nota:''}`
                  : `${r.categoria}${r.descripcion?' — '+r.descripcion:''}${r.recurrente?' · Recurrente':''}`}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontWeight:600, fontSize:15, color:r.tipo==='venta'?COLORS.ventas:COLORS.gastos }}>{fmt(r.monto)}</span>
              <button onClick={()=>remove(r.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color: COLORS.textSecondary }}>×</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}
