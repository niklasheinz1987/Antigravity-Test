import React, { useState } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { Search, Filter, Trash2, Edit } from 'lucide-react';

const Bestand = () => {
    const { animals, deleteAnimal, updateAnimal } = useAnimals();
    const [filterArt, setFilterArt] = useState('Alle');
    const [filterStatus, setFilterStatus] = useState('Aktiv');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAnimals = animals.filter(animal => {
        const matchArt = filterArt === 'Alle' || animal.art === filterArt;
        const matchStatus = filterStatus === 'Alle' || animal.status === filterStatus;
        const matchSearch = Object.values(animal).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchArt && matchStatus && matchSearch;
    });

    const handleDelete = (id) => {
        if (window.confirm('Tier wirklich löschen?')) {
            deleteAnimal(id);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1>Tierbestand</h1>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', background: 'var(--background)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Suchen (Ohrmarke, Name...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                    />
                </div>

                <select
                    value={filterArt}
                    onChange={(e) => setFilterArt(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                    <option value="Alle">Alle Arten</option>
                    <option value="Schaf">Schafe</option>
                    <option value="Ziege">Ziegen</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' }}
                >
                    <option value="Alle">Alle Status</option>
                    <option value="Aktiv">Aktiv</option>
                    <option value="Verkauft">Verkauft</option>
                    <option value="Verstorben">Verstorben</option>
                </select>
            </div>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                            <th style={{ padding: '1rem' }}>Ohrmarke</th>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Art</th>
                            <th style={{ padding: '1rem' }}>Geschlecht</th>
                            <th style={{ padding: '1rem' }}>Rasse</th>
                            <th style={{ padding: '1rem' }}>Geburtsdatum</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }} className="no-print">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAnimals.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Keine Tiere gefunden.
                                </td>
                            </tr>
                        ) : (
                            filteredAnimals.map((animal) => (
                                <tr key={animal.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{animal.ohrmarke}</td>
                                    <td style={{ padding: '1rem' }}>{animal.name || '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            background: animal.art === 'Schaf' ? 'var(--secondary)' : '#ffe3e6',
                                            color: animal.art === 'Schaf' ? 'var(--primary-hover)' : 'var(--danger)'
                                        }}>
                                            {animal.art}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{animal.geschlecht}</td>
                                    <td style={{ padding: '1rem' }}>{animal.rasse || '-'}</td>
                                    <td style={{ padding: '1rem' }}>{animal.geburtsdatum ? new Date(animal.geburtsdatum).toLocaleDateString('de-DE') : '-'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={animal.status}
                                            onChange={(e) => updateAnimal(animal.id, { status: e.target.value })}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: 'var(--radius)',
                                                border: '1px solid var(--border)',
                                                background: 'var(--surface)',
                                                fontSize: '0.875rem',
                                                fontFamily: 'inherit'
                                            }}
                                        >
                                            <option value="Aktiv">Aktiv</option>
                                            <option value="Verkauft">Verkauft</option>
                                            <option value="Verstorben">Verstorben</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} className="no-print">
                                        <button onClick={() => handleDelete(animal.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Bestand;
