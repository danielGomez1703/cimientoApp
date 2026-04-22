import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
         PieChart, Pie, Cell, Legend } from 'recharts';
import { COLORS } from '../constants/colors';
import { MESES }  from '../constants/data';

const fmt = n => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(n);
const PIE_COLORS = ['#1D9E75','#D85A30','#378ADD','#BA7517','#533AB7','#D4537E','#639922'];

function MetricCard({ label, value, color }) {
  return (
    <div style={{ background:'#fff', border:`1px solid rgba(0,0,0,0.07)`, borderRadius:10, padding:'14px 18px', flex:1, minWidth:140 }}>
      <div style={{ fontSize:12, color: COLORS.textSecondary, marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:600, color }}>{value}</div>
    </div>
  );
}

export default function Dashboard({ stats, barData, pieData }) {
  const barFormatted = barData.map(d => ({ ...d, mes: MESES[d.mes] }));

  return (
    <div>
      <p style={{ fontSize:12, color: COLORS.textSecondary, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Cimiento</p>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:20 }}>Control de ventas & gastos</h1>

      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:24 }}>
        <MetricCard label="Total ventas"  value={fmt(stats.ventas)}  color={COLORS.ventas}   />
        <MetricCard label="Total gastos"  value={fmt(stats.gastos)}  color={COLORS.gastos}   />
        <MetricCard label="Utilidad neta" value={fmt(stats.util)}    color={stats.util>=0?COLORS.utilidad:COLORS.gastos} />
        <MetricCard label="Margen"        value={stats.margen.toFixed(1)+'%'} color={COLORS.margen} />
      </div>

      {barFormatted.length > 0 && (
        <div style={{ background:'#fff', border:`1px solid rgba(0,0,0,0.07)`, borderRadius:12, padding:'18px', marginBottom:16 }}>
          <p style={{ fontWeight:500, marginBottom:14 }}>Ventas vs gastos — {new Date().getFullYear()}</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barFormatted}>
              <XAxis dataKey="mes" tick={{ fontSize:11 }} />
              <YAxis tick={{ fontSize:11 }} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v=>fmt(v)} />
              <Bar dataKey="ventas" fill={COLORS.ventas} radius={[4,4,0,0]} name="Ventas" />
              <Bar dataKey="gastos" fill={COLORS.gastos} radius={[4,4,0,0]} name="Gastos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {pieData.length > 0 && (
        <div style={{ background:'#fff', border:`1px solid rgba(0,0,0,0.07)`, borderRadius:12, padding:'18px' }}>
          <p style={{ fontWeight:500, marginBottom:14 }}>Gastos por categoría</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v=>fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {barFormatted.length === 0 && pieData.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', color: COLORS.textSecondary }}>
          Agrega tu primera venta o gasto para ver el dashboard.
        </div>
      )}
    </div>
  );
}
