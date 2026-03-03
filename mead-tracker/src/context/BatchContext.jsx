import { createContext, useContext, useEffect, useState } from 'react';
import { fetchBatches, saveBatch, removeBatch, updateBatchFields } from '../services/db';

const generateId = () => {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const BatchContext = createContext();

export const useBatchContext = () => {
  return useContext(BatchContext);
};

export const BatchProvider = ({ children }) => {
  const [batches, setBatches] = useState([]);
  const [activeBatchId, setActiveBatchId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load batches from Firebase on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchBatches();
      setBatches(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const addBatch = async (batchData) => {
    const newBatch = {
      ...batchData,
      id: generateId(),
      status: 'active',
      createdAt: new Date().toISOString(),
      fermentationLogs: [],
      storageLogs: [],
      consumptionLogs: []
    };

    // Optimistic UI update
    setBatches(prev => [...prev, newBatch]);

    // Save to Firebase
    const success = await saveBatch(newBatch);
    if (!success) {
      alert("Die Charge konnte nicht in der Cloud (Firebase) gespeichert werden. Sie ist nur lokal verfügbar bis zum nächsten Neuladen. Bitte prüfen Sie Ihre Firebase-Projektkonfiguration.");
    }
    return newBatch.id;
  };

  const updateBatch = async (id, updates) => {
    // Optimistic UI update
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

    // Save to Firebase
    const success = await updateBatchFields(id, updates);
    if (!success) {
      alert("Änderungen konnten nicht in der Cloud gespeichert werden (Firebase Timeout).");
    }
  };

  const deleteBatch = async (id) => {
    // Optimistic UI update
    setBatches(prev => prev.filter(b => b.id !== id));
    if (activeBatchId === id) setActiveBatchId(null);

    // Save to Firebase
    const success = await removeBatch(id);
    if (!success) {
      alert("Löschen in der Cloud fehlgeschlagen (Firebase Timeout).");
    }
  };

  const addFermentationLog = async (batchId, log) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const newLogs = [...(batch.fermentationLogs || []), { ...log, id: generateId() }]
      .sort((x, y) => new Date(x.date) - new Date(y.date));

    // Optimistic UI
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, fermentationLogs: newLogs } : b));

    // Update Firebase
    await updateBatchFields(batchId, { fermentationLogs: newLogs });
  };

  const deleteFermentationLog = async (batchId, logId) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const newLogs = batch.fermentationLogs.filter(l => l.id !== logId);

    // Optimistic UI
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, fermentationLogs: newLogs } : b));

    // Update Firebase
    await updateBatchFields(batchId, { fermentationLogs: newLogs });
  };

  const addStorageLog = async (batchId, log) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const newLogs = [...(batch.storageLogs || []), { ...log, id: generateId() }]
      .sort((x, y) => new Date(x.date) - new Date(y.date));

    // Optimistic UI
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, storageLogs: newLogs } : b));

    // Update Firebase
    const success = await updateBatchFields(batchId, { storageLogs: newLogs });
    if (!success) alert("Speichern in der Cloud fehlgeschlagen (Firebase Timeout).");
  };

  const addConsumptionLog = async (batchId, amount, date, note) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const currentVol = batch.currentVolume !== undefined ? batch.currentVolume : (batch.volume || 0);
    const newVol = Math.max(0, currentVol - amount);
    const newLogs = [...(batch.consumptionLogs || []), {
      id: generateId(),
      amount,
      date,
      note
    }].sort((x, y) => new Date(x.date) - new Date(y.date));

    // Optimistic UI
    setBatches(prev => prev.map(b => b.id === batchId ? {
      ...b,
      currentVolume: newVol,
      consumptionLogs: newLogs
    } : b));

    // Update Firebase
    const success = await updateBatchFields(batchId, {
      currentVolume: newVol,
      consumptionLogs: newLogs
    });
    if (!success) alert("Speichern in der Cloud fehlgeschlagen (Firebase Timeout).");
  };

  return (
    <BatchContext.Provider value={{
      batches,
      activeBatchId,
      setActiveBatchId,
      isLoading,
      addBatch,
      updateBatch,
      deleteBatch,
      addFermentationLog,
      deleteFermentationLog,
      addStorageLog,
      addConsumptionLog,
    }}>
      {children}
    </BatchContext.Provider>
  );
};
