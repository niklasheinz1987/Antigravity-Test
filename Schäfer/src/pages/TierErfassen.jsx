import React, { useState } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { useNavigate } from 'react-router-dom';

const TierErfassen = () => {
    const { addAnimal } = useAnimals();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ohrmarke: '',
        name: '',
        art: 'Schaf',
        geschlecht: 'Weiblich',
        rasse: '',
        geburtsdatum: '',
        status: 'Aktiv',
        bemerkungen: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
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
            <h1 style={{ marginBottom: '1.5rem' }}>Neues Tier erfassen</h1>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                        <div>
                            <label style={labelStyle}>Ohrmarke *</label>
                            <input
                                type="text"
                                name="ohrmarke"
                                value={formData.ohrmarke}
                                onChange={handleChange}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Name (Optional)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={inputStyle}
                            />
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
                            <input
                                type="text"
                                name="rasse"
                                value={formData.rasse}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Geburtsdatum</label>
                            <input
                                type="date"
                                name="geburtsdatum"
                                value={formData.geburtsdatum}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} style={inputStyle}>
                                <option value="Aktiv">Aktiv</option>
                                <option value="Verkauft">Verkauft</option>
                                <option value="Verstorben">Verstorben</option>
                            </select>
                        </div>

                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={labelStyle}>Bemerkungen</label>
                        <textarea
                            name="bemerkungen"
                            value={formData.bemerkungen}
                            onChange={handleChange}
                            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
                            Abbrechen
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Tier speichern
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TierErfassen;
