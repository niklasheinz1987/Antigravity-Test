import { createContext, useContext, useEffect, useState } from 'react';
import { fetchBatches, saveBatch, removeBatch, updateBatchFields } from '../services/db';

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
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date().toISOString(),
      fermentationLogs: [],
      storageLogs: [],
      consumptionLogs: []
    };

    // Optimistic UI update
    setBatches(prev => [...prev, newBatch]);

    // Save to Firebase
    await saveBatch(newBatch);
    return newBatch.id;
  };

  const updateBatch = async (id, updates) => {
    // Optimistic UI update
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

    // Save to Firebase
    await updateBatchFields(id, updates);
  };

  const deleteBatch = async (id) => {
    // Optimistic UI update
    setBatches(prev => prev.filter(b => b.id !== id));
    if (activeBatchId === id) setActiveBatchId(null);

    // Save to Firebase
    await removeBatch(id);
  };

  const addFermentationLog = async (batchId, log) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const newLogs = [...(batch.fermentationLogs || []), { ...log, id: crypto.randomUUID() }]
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

    const newLogs = [...(batch.storageLogs || []), { ...log, id: crypto.randomUUID() }]
      .sort((x, y) => new Date(x.date) - new Date(y.date));

    // Optimistic UI
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, storageLogs: newLogs } : b));

    // Update Firebase
    await updateBatchFields(batchId, { storageLogs: newLogs });
  };

  const addConsumptionLog = async (batchId, amount, date, note) => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch) return;

    const currentVol = batch.currentVolume !== undefined ? batch.currentVolume : (batch.volume || 0);
    const newVol = Math.max(0, currentVol - amount);
    const newLogs = [...(batch.consumptionLogs || []), {
      id: crypto.randomUUID(),
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
    await updateBatchFields(batchId, {
      currentVolume: newVol,
      consumptionLogs: newLogs
    });
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
