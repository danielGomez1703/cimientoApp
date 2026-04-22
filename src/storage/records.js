export const loadRecords = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
};
export const saveRecords = (records) =>
  localStorage.setItem(KEY, JSON.stringify(records));