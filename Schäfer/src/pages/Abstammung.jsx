import React, { useState } from 'react';
import { useAnimals } from '../hooks/useAnimals';
import { Search } from 'lucide-react';

const Abstammung = () => {
    const { animals } = useAnimals();
    const [searchTerm, setSearchTerm] = useState('');

    const getTier = (id) => animals.find(a => a.id === id);
    const getNachkommen = (id) => animals.filter(a => a.mutterId === id || a.vaterId === id);

    const filteredAnimals = animals.filter(animal =>
        Object.values(animal).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <h1 style={{ marginBottom: '1.5rem' }}>Abstammung & Nachzucht</h1>

            <div className="card no-print" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--background)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Tier suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {filteredAnimals.map(animal => {
                    const mutter = getTier(animal.mutterId);
                    const vater = getTier(animal.vaterId);
                    const nachkommen = getNachkommen(animal.id);

                    return (
                        <div key={animal.id} className="card" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{animal.ohrmarke} {animal.name ? `(${animal.name})` : ''}</h3>
                                <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '12px', background: 'var(--background)' }}>{animal.geschlecht}</span>
                            </div>

                            <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                                <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>
                                    <strong>Mutter:</strong> {mutter ? `${mutter.ohrmarke} ${mutter.name ? `(${mutter.name})` : ''}` : '-'}
                                </p>
                                <p style={{ margin: '0.25rem 0', color: 'var(--text-muted)' }}>
                                    <strong>Vater:</strong> {vater ? `${vater.ohrmarke} ${vater.name ? `(${vater.name})` : ''}` : '-'}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Nachkommen ({nachkommen.length})</h4>
                                {nachkommen.length > 0 ? (
                                    <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--primary)' }}>
                                        {nachkommen.map(nk => (
                                            <li key={nk.id}>{nk.ohrmarke} {nk.name ? `(${nk.name})` : ''} - {new Date(nk.geburtsdatum).getFullYear()}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{ fontSize: '0.875rem', margin: 0, color: 'var(--text-muted)' }}>Keine verzeichnet.</p>
                                )}
                            </div>
                        </div>
                    );
                })}
                {filteredAnimals.length === 0 && (
                    <p style={{ color: 'var(--text-muted)' }}>Keine Tiere gefunden.</p>
                )}
            </div>
        </div>
    );
};

export default Abstammung;
