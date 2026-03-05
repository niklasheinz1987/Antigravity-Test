import React, { useState } from 'react';
import { useHealth } from '../hooks/useHealth';
import { useAnimals } from '../hooks/useAnimals';
import { Trash2 } from 'lucide-react';

const Gesundheit = () => {
    const { treatments, addTreatment, deleteTreatment } = useHealth();
    const { animals } = useAnimals();

    const [formData, setFormData] = useState({
        datum: new Date().toISOString().split('T')[0],
        typ: 'Entwurmung',
        medikament: '',
        dosierung: '',
        zieltier: 'Alle' // "Alle" or animal ID
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.medikament) {
            alert("Medikamentenname ist erforderlich.");
            return;
        }

        addTreatment(formData);
        setFormData(prev => ({ ...prev, medikament: '', dosierung: '' }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Eintrag wirklich löschen?')) {
            deleteTreatment(id);
        }
    };

    const getTierName = (id) => {
        if (id === 'Alle') return 'Gesamter Bestand';
        const tier = animals.find(a => a.id === id);
        return tier ? `${tier.ohrmarke} ${tier.name ? `(${tier.name})` : ''}` : 'Unbekanntes Tier';
    };

    const sortedTreatments = [...treatments].sort((a, b) => new Date(b.datum) - new Date(a.datum));

    const inputStyle = {
        width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)',
        border: '1px solid var(--border)', background: 'var(--background)',
        fontFamily: 'inherit', fontSize: '0.875rem'
    };

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Gesundheitsbuch & Medikamente</h1>

            <div className="card no-print" style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Neue Behandlung eintragen</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Datum</label>
                        <input type="date" name="datum" value={formData.datum} onChange={handleChange} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Behandlungsart</label>
                        <select name="typ" value={formData.typ} onChange={handleChange} style={inputStyle}>
                            <option value="Entwurmung">Entwurmung</option>
                            <option value="Impfung">Impfung</option>
                            <option value="Medikament">Medikament</option>
                            <option value="Sonstiges">Sonstiges</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Betroffene Tiere</label>
                        <select name="zieltier" value={formData.zieltier} onChange={handleChange} style={inputStyle}>
                            <option value="Alle">Gesamter Bestand</option>
                            {animals.filter(a => a.status === 'Aktiv').map(a => (
                                <option key={a.id} value={a.id}>{a.ohrmarke} {a.name ? `(${a.name})` : ''}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Präparat / Medikament *</label>
                            <input type="text" name="medikament" value={formData.medikament} onChange={handleChange} style={inputStyle} required placeholder="z.B. Cydectin" />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Dosierung / Bemerkung</label>
                            <input type="text" name="dosierung" value={formData.dosierung} onChange={handleChange} style={inputStyle} placeholder="z.B. 2ml" />
                        </div>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary">Eintrag speichern</button>
                    </div>
                </form>
            </div>

            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--background)' }}>
                            <th style={{ padding: '1rem' }}>Datum</th>
                            <th style={{ padding: '1rem' }}>Art</th>
                            <th style={{ padding: '1rem' }}>Tier(e)</th>
                            <th style={{ padding: '1rem' }}>Präparat</th>
                            <th style={{ padding: '1rem' }}>Dosierung / Info</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }} className="no-print">Aktionen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTreatments.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Keine Einträge vorhanden.</td>
                            </tr>
                        ) : (
                            sortedTreatments.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }}>{new Date(t.datum).toLocaleDateString('de-DE')}</td>
                                    <td style={{ padding: '1rem' }}>{t.typ}</td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{getTierName(t.zieltier)}</td>
                                    <td style={{ padding: '1rem' }}>{t.medikament}</td>
                                    <td style={{ padding: '1rem' }}>{t.dosierung || '-'}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} className="no-print">
                                        <button onClick={() => handleDelete(t.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
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

export default Gesundheit;
