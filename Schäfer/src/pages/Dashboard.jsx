import React from 'react';
import { useAnimals } from '../hooks/useAnimals';

const Dashboard = () => {
    const { animals } = useAnimals();

    const aktiveTiere = animals.filter(a => a.status === 'Aktiv');
    const schafe = aktiveTiere.filter(a => a.art === 'Schaf').length;
    const ziegen = aktiveTiere.filter(a => a.art === 'Ziege').length;

    const currentYear = new Date().getFullYear();
    const laemmerDiesesJahr = animals.filter(a => {
        if (!a.geburtsdatum) return false;
        return new Date(a.geburtsdatum).getFullYear() === currentYear;
    }).length;

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Aktiver Gesamtbestand</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{aktiveTiere.length}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>davon Schafe</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{schafe}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>davon Ziegen</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#e63946' }}>{ziegen}</p>
                </div>
                <div className="card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Geburten (dieses Jahr)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{laemmerDiesesJahr}</p>
                </div>
            </div>

            <div className="card">
                <h2>Aktuelle Meldungen</h2>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Noch keine Einträge vorhanden.</p>
            </div>
        </div>
    );
};

export default Dashboard;
