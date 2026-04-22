import { useState, useMemo } from 'react';
import { loadRecords, saveRecords } from '../storage/records';

export default function useRecords() {
  const [records, setRecords] = useState(() => loadRecords());

  const commit = (next) => { setRecords(next); saveRecords(next); };

  const add    = (rec) => commit([rec, ...records]);
  const remove = (id)  => commit(records.filter(r => r.id !== id));

  const stats = useMemo(() => {
    const ventas = records.filter(r => r.tipo === 'venta').reduce((s,r) => s+r.monto, 0);
    const gastos = records.filter(r => r.tipo === 'gasto').reduce((s,r) => s+r.monto, 0);
    const util   = ventas - gastos;
    return { ventas, gastos, util, margen: ventas > 0 ? (util/ventas)*100 : 0 };
  }, [records]);

  const barData = useMemo(() => {
    const year = new Date().getFullYear(), map = {};
    records.forEach(r => {
      const d = new Date(r.fecha+'T00:00:00');
      if (d.getFullYear() !== year) return;
      const m = d.getMonth();
      if (!map[m]) map[m] = { mes: m, ventas: 0, gastos: 0 };
      map[m][r.tipo === 'venta' ? 'ventas' : 'gastos'] += r.monto;
    });
    return Object.values(map).sort((a,b) => a.mes - b.mes);
  }, [records]);

  const pieData = useMemo(() => {
    const map = {};
    records.filter(r => r.tipo === 'gasto')
      .forEach(r => { const k = r.categoria||'Otro'; map[k] = (map[k]||0)+r.monto; });
    return Object.entries(map).map(([name,value]) => ({ name, value }))
      .sort((a,b) => b.value - a.value);
  }, [records]);

  return { records, add, remove, stats, barData, pieData };
}
