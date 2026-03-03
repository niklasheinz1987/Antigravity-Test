import { db } from '../firebase';
import {
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';

const BATCHES_COLLECTION = 'batches';

// Get all batches
export const fetchBatches = async () => {
    try {
        const batchesCol = collection(db, BATCHES_COLLECTION);
        const q = query(batchesCol, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
        }));
    } catch (error) {
        console.error("Error fetching batches:", error);
        return [];
    }
};

// Helper for promise timeout
const withTimeout = (promise, ms = 8000) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Firebase antwortet nicht.")), ms))
    ]);
};

// Save a new batch or update an existing one completely
export const saveBatch = async (batch) => {
    try {
        const batchRef = doc(db, BATCHES_COLLECTION, batch.id);
        await withTimeout(setDoc(batchRef, batch));
        return true;
    } catch (error) {
        console.error("Error saving batch:", error);
        return false;
    }
};

// Update specific fields of a batch
export const updateBatchFields = async (batchId, updates) => {
    try {
        const batchRef = doc(db, BATCHES_COLLECTION, batchId);
        await withTimeout(updateDoc(batchRef, updates));
        return true;
    } catch (error) {
        console.error("Error updating batch fields:", error);
        return false;
    }
};

// Delete a batch
export const removeBatch = async (batchId) => {
    try {
        const batchRef = doc(db, BATCHES_COLLECTION, batchId);
        await withTimeout(deleteDoc(batchRef));
        return true;
    } catch (error) {
        console.error("Error deleting batch:", error);
        return false;
    }
};
