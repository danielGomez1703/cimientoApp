import {
  collection, addDoc, getDocs,
  deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

const COL = 'records';

console.log('firebase config:',{
  projectId : import.meta.env.VITE_FIREBASE_PROJECT_ID,
  apikey  : import.meta.env.VITE_FIREBASE_API_KEY
})

export const loadRecords = async () => {
  const q = query(collection(db, COL), orderBy('fecha', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addRecord = async (record) => {
  const { id, ...data } = record;
  const docRef = await addDoc(collection(db, COL), data);
  return { id: docRef.id, ...data };
};

export const removeRecord = async (id) => {
  await deleteDoc(doc(db, COL, id));
};