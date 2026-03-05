import React, { useState } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { useNavigate } from 'react-router-dom';

const GeburtErfassen = () => {
    const { animals, addAnimal } = useAnimals();
    const navigate = useNavigate();

    const weiblicheTiere = animals.filter(a => a.geschlecht === 'Weiblich' && a.status === 'Aktiv');
    const maennlicheTiere = animals.filter(a => a.geschlecht === 'Männlich' && a.status === 'Aktiv');

    const [formData, setFormData] = useState({
        ohrmarke: '',
        name: '',
        art: 'Schaf',
        geschlecht: 'Weiblich',
        rasse: '',
        geburtsdatum: new Date().toISOString().split('T')[0],
        mutterId: '',
        vaterId: '',
        status: 'Aktiv',
        bemerkungen: 'Eigene Nachzucht'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-update Art based on Mutter
        if (name === 'mutterId' && value) {
            const mutter = animals.find(a => a.id === value);
            if (mutter) {
                setFormData(prev => ({ ...prev, [name]: value, art: mutter.art, rasse: mutter.rasse }));
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.ohrmarke) {
            alert("Ohrmarke ist ein Pflichtfeld.");
            return;
        }

        addAnimal(formData);
        navigate('/bestand');
    };

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        background: 'var(--background)',
        fontFamily: 'inherit',
        fontSize: '0.875rem'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '500',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '1.5rem' }}>Geburt erfassen (Nachzucht)</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', padding: '1rem', background: 'var(--secondary)', borderRadius: 'var(--radius)' }}>
                            <div>
                                <label style={{ ...labelStyle, color: 'var(--primary-hover)' }}>Muttertier (Optional)</label>
                                <select name="mutterId" value={formData.mutterId} onChange={handleChange} style={inputStyle}>
                                    <option value="">Unbekannt / Nicht in Liste</option>
                                    {weiblicheTiere.map(t => (
                                        <option key={t.id} value={t.id}>{t.ohrmarke} {t.name ? `(${t.name})` : ''} - {t.art}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={{ ...labelStyle, color: 'var(--primary-hover)' }}>Vatertier (Optional)</label>
                                <select name="vaterId" value={formData.vaterId} onChange={handleChange} style={inputStyle}>
                                    <option value="">Unbekannt / Nicht in Liste</option>
                                    {maennlicheTiere.map(t => (
                                        <option key={t.id} value={t.id}>{t.ohrmarke} {t.name ? `(${t.name})` : ''} - {t.art}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Ohrmarke Lamm *</label>
                            <input type="text" name="ohrmarke" value={formData.ohrmarke} onChange={handleChange} style={inputStyle} required />
                        </div>

                        <div>
                            <label style={labelStyle}>Name (Optional)</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Art</label>
                            <select name="art" value={formData.art} onChange={handleChange} style={inputStyle}>
                                <option value="Schaf">Schaf</option>
                                <option value="Ziege">Ziege</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Geschlecht</label>
                            <select name="geschlecht" value={formData.geschlecht} onChange={handleChange} style={inputStyle}>
                                <option value="Weiblich">Weiblich</option>
                                <option value="Männlich">Männlich</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Rasse</label>
                            <input type="text" name="rasse" value={formData.rasse} onChange={handleChange} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Geburtsdatum</label>
                            <input type="date" name="geburtsdatum" value={formData.geburtsdatum} onChange={handleChange} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Bemerkungen</label>
                        <textarea name="bemerkungen" value={formData.bemerkungen} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Abbrechen</button>
                        <button type="submit" className="btn btn-primary">Geburt speichern</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeburtErfassen;
