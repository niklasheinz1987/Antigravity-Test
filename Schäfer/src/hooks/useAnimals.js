import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useAnimals() {
    const [animals, setAnimals] = useState([]);

    useEffect(() => {
        const q = collection(db, 'animals');
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const animalsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnimals(animalsData);
        }, (error) => {
            console.error("Firestore onSnapshot Error:", error);
            alert("Fehler beim Laden der Tierdaten. Prüfe die Firestore-Sicherheitsregeln: " + error.message);
        });

        return unsubscribe;
    }, []);
    const updateAnimal = (id, updates) => {
        setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    };

    const deleteAnimal = (id) => {
        setAnimals(prev => prev.filter(a => a.id !== id));
    };

    return { animals, addAnimal, updateAnimal, deleteAnimal };
}
