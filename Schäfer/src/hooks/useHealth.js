import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'schaefer_health_v1';

export function useHealth() {
    const [treatments, setTreatments] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse treatments', e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(treatments));
    }, [treatments]);

    const addTreatment = (data) => {
        const newTreatment = { ...data, id: uuidv4(), createdAt: new Date().toISOString() };
        setTreatments(prev => [...prev, newTreatment]);
        return newTreatment.id;
    };

    const deleteTreatment = (id) => {
        setTreatments(prev => prev.filter(t => t.id !== id));
    };

    return { treatments, addTreatment, deleteTreatment };
}
