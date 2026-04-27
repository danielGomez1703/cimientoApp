import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import Dashboard  from './pages/Dashboard';
import Registros  from './pages/Registros';
import NuevaVenta from './pages/NuevaVenta';
import NuevoGasto from './pages/NuevoGasto';
import useRecords from './hooks/useRecords';
import { COLORS } from './constants/colors';

export default function App() {
  const ctx = useRecords();

  // Pantalla de carga
  if (ctx.loading) return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      alignItems: 'center', height: '100vh',
      fontSize: 14, color: COLORS.textSecondary,
      fontFamily: 'system-ui, sans-serif'
    }}>
      Cargando Cimiento...
    </div>
  );

  // Pantalla de error
  if (ctx.error) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      height: '100vh', gap: 12,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <span style={{ fontSize: 32 }}>⚠️</span>
      <span style={{ fontSize: 14, color: COLORS.gastos }}>{ctx.error}</span>
      <button
        onClick={() => window.location.reload()}
        style={{ padding: '8px 16px', borderRadius: 8, border: 'none',
                 background: COLORS.ventas, color: '#fff', cursor: 'pointer' }}>
        Reintentar
      </button>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background: COLORS.bg, fontFamily:'system-ui,sans-serif' }}>
      {/* Top nav */}
      <nav style={{ background:'#fff', borderBottom:`1px solid ${COLORS.border}`, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:56 }}>
        <span style={{ fontWeight:600, fontSize:16, color: COLORS.textPrimary }}>Cimiento</span>
        <div style={{ display:'flex', gap:8 }}>
          {[['/', 'Dashboard'], ['/registros', 'Registros']].map(([to,label]) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              padding:'6px 14px', borderRadius:8, textDecoration:'none', fontSize:14,
              background: isActive ? '#E1F5EE' : 'transparent',
              color: isActive ? '#0F6E56' : COLORS.textSecondary,
              fontWeight: isActive ? 500 : 400,
            })}>{label}</NavLink>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <NavLink to="/nueva-venta" style={{ padding:'7px 16px', background: COLORS.ventas, color:'#fff', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:500 }}>+ Venta</NavLink>
          <NavLink to="/nuevo-gasto" style={{ padding:'7px 16px', background: COLORS.gastos, color:'#fff', borderRadius:8, textDecoration:'none', fontSize:13, fontWeight:500 }}>+ Gasto</NavLink>
        </div>
      </nav>

      {/* Pages */}
      <main style={{ maxWidth:800, margin:'0 auto', padding:'24px 16px' }}>
        <Routes>
          <Route path="/"            element={<Dashboard  {...ctx} />} />
          <Route path="/registros"   element={<Registros  {...ctx} />} />
          <Route path="/nueva-venta" element={<NuevaVenta add={ctx.add} />} />
          <Route path="/nuevo-gasto" element={<NuevoGasto add={ctx.add} />} />
        </Routes>
      </main>
    </div>
  );
}
