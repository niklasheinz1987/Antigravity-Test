import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'schaefer_animals_v1';

export function useAnimals() {
    const [animals, setAnimals] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse animals from local storage', e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(animals));
    }, [animals]);

    const addAnimal = (animalData) => {
        const newAnimal = {
            ...animalData,
            id: uuidv4(),
            createdAt: new Date().toISOString()
        };
        setAnimals(prev => [...prev, newAnimal]);
        return newAnimal.id;
    };

    const updateAnimal = (id, updates) => {
        setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    };

    const deleteAnimal = (id) => {
        setAnimals(prev => prev.filter(a => a.id !== id));
    };

    return { animals, addAnimal, updateAnimal, deleteAnimal };
}
