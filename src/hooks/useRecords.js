import { useState, useEffect, useMemo } from 'react';
import { loadRecords, addRecord, removeRecord } from '../storage/records';

export default function useRecords() {
 const [records, setRecords] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error,  setError]  = useState(null);

 useEffect(() => {
  (async () => {
   try {
    const data = await loadRecords();
    setRecords(data);
   } catch (e) {
    setError('Error cargando datos.');
   } finally {
    setLoading(false);
   }
  })();
 }, []);

 const add = async (record) => {
  // 1. Actualiza UI inmediatamente con ID temporal
  setRecords(prev => [record, ...prev]);

  try {
   // 2. Guarda en Firestore en segundo plano
   const saved = await addRecord(record);
   // 3. Reemplaza el registro temporal con el ID real de Firestore
   setRecords(prev => prev.map(r => r.id === record.id ? saved : r));
  } catch (e) {
   // 4. Si falla, revierte el cambio
   setRecords(prev => prev.filter(r => r.id !== record.id));
   setError('Error guardando. Intenta de nuevo.');
  }
 };

 const remove = async (id) => {
  // 1. Elimina de UI inmediatamente
  setRecords(prev => prev.filter(r => r.id !== id));

  try {
   // 2. Elimina en Firestore en segundo plano
   await removeRecord(id);
  } catch (e) {
   // 3. Si falla, recarga los datos originales
   const data = await loadRecords();
   setRecords(data);
   setError('Error eliminando. Intenta de nuevo.');
  }
 };

 const stats = useMemo(() => {
  const ventas = records.filter(r => r.tipo === 'venta').reduce((s,r) => s+r.monto, 0);
  const gastos = records.filter(r => r.tipo === 'gasto').reduce((s,r) => s+r.monto, 0);
  const util  = ventas - gastos;
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
  return Object.entries(map)
   .map(([name, value]) => ({ name, value }))
   .sort((a,b) => b.value - a.value);
 }, [records]);

 return { records, add, remove, stats, barData, pieData, loading, error };
}