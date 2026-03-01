import { createContext, useContext, useEffect, useState } from 'react';

const BatchContext = createContext();

export const useBatchContext = () => {
  return useContext(BatchContext);
};

export const BatchProvider = ({ children }) => {
  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('meadTrackerBatches');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  const [activeBatchId, setActiveBatchId] = useState(null);

  useEffect(() => {
    localStorage.setItem('meadTrackerBatches', JSON.stringify(batches));
  }, [batches]);

  const addBatch = (batchData) => {
    const newBatch = {
      ...batchData,
      id: crypto.randomUUID(),
      status: 'active',
      createdAt: new Date().toISOString(),
      fermentationLogs: [],
      storageLogs: [],
      consumptionLogs: []
    };
    setBatches([...batches, newBatch]);
    return newBatch.id;
  };

  const updateBatch = (id, updates) => {
    setBatches(batches.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteBatch = (id) => {
    setBatches(batches.filter(b => b.id !== id));
    if (activeBatchId === id) setActiveBatchId(null);
  };

  const addFermentationLog = (batchId, log) => {
    setBatches(batches.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          fermentationLogs: [...(b.fermentationLogs || []), { ...log, id: crypto.randomUUID() }].sort((x, y) => new Date(x.date) - new Date(y.date))
        };
      }
      return b;
    }));
  };

  const deleteFermentationLog = (batchId, logId) => {
    setBatches(batches.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          fermentationLogs: b.fermentationLogs.filter(l => l.id !== logId)
        };
      }
      return b;
    }));
  };

  const addStorageLog = (batchId, log) => {
    setBatches(batches.map(b => {
      if (b.id === batchId) {
        return {
          ...b,
          storageLogs: [...(b.storageLogs || []), { ...log, id: crypto.randomUUID() }].sort((x, y) => new Date(x.date) - new Date(y.date))
        };
      }
      return b;
    }));
  };

  const addConsumptionLog = (batchId, amount, date, note) => {
    setBatches(batches.map(b => {
      if (b.id === batchId) {
        const currentVol = b.currentVolume !== undefined ? b.currentVolume : (b.volume || 0);
        return {
          ...b,
          currentVolume: Math.max(0, currentVol - amount),
          consumptionLogs: [...(b.consumptionLogs || []), {
            id: crypto.randomUUID(),
            amount,
            date,
            note
          }].sort((x, y) => new Date(x.date) - new Date(y.date))
        };
      }
      return b;
    }));
  };

  return (
    <BatchContext.Provider value={{
      batches,
      activeBatchId,
      setActiveBatchId,
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
