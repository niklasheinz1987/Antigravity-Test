import React, { useState, useEffect } from 'react';
import { useBatchContext } from '../context/BatchContext';
import { Save, Plus, Trash2 } from 'lucide-react';

export default function ProductionTab() {
    const { batches, activeBatchId, updateBatch, setActiveBatchId } = useBatchContext();
    const activeBatch = batches.find(b => b.id === activeBatchId);

    const [formData, setFormData] = useState({
        volume: '',
        honeyType: '',
        honeySupplier: '',
        honeyAmount: '',
        waterAmount: '',
        yeastType: '',
        yeastAmount: '',
        additives: [] // { id, name, amount, unit }
    });

    useEffect(() => {
        if (activeBatch) {
            setFormData({
                volume: activeBatch.volume || '',
                honeyType: activeBatch.honeyType || '',
                honeySupplier: activeBatch.honeySupplier || '',
                honeyAmount: activeBatch.honeyAmount || '',
                waterAmount: activeBatch.waterAmount || '',
                yeastType: activeBatch.yeastType || '',
                yeastAmount: activeBatch.yeastAmount || '',
                additives: activeBatch.additives || []
            });
        }
    }, [activeBatchId]);

    if (!activeBatch) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <h3 style={{ color: 'var(--text-muted)' }}>Keine Charge ausgewählt</h3>
                <p>Bitte wählen Sie eine Charge zur Bearbeitung aus.</p>
                <select
                    value={activeBatchId || ""}
                    onChange={e => setActiveBatchId(e.target.value)}
                    style={{ maxWidth: '300px', margin: '1rem auto', padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', display: 'block' }}
                >
                    <option value="" disabled>Charge auswählen...</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.number} - {b.name}</option>)}
                </select>
            </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateBatch(activeBatchId, formData);
        alert('Daten gespeichert!');
    };

    const addAdditive = () => {
        setFormData(prev => ({
            ...prev,
            additives: [...prev.additives, { id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).substring(2), name: '', amount: '', unit: 'g' }]
        }));
    };

    const updateAdditive = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            additives: prev.additives.map(a => a.id === id ? { ...a, [field]: value } : a)
        }));
    };

    const removeAdditive = (id) => {
        setFormData(prev => ({
            ...prev,
            additives: prev.additives.filter(a => a.id !== id)
        }));
    };

    return (
        <div className="production-tab">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                        <h2>Produktion</h2>
                    </div>
                    <select
                        value={activeBatchId || ""}
                        onChange={e => setActiveBatchId(e.target.value)}
                        style={{ maxWidth: '300px', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    >
                        {batches.map(b => <option key={b.id} value={b.id}>{b.number} - {b.name}</option>)}
                    </select>
                </div>
                <button className="btn btn-primary" onClick={handleSave}>
                    <Save size={18} /> Speichern
                </button>
            </div>

            <div className="grid grid-cols-2">
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🍯 Grunddaten
                    </h3>
                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Ansatzvolumen (Liter)</label>
                            <input type="number" step="0.1" name="volume" value={formData.volume} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Wassermenge (Liter)</label>
                            <input type="number" step="0.1" name="waterAmount" value={formData.waterAmount} onChange={handleChange} />
                        </div>
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Honig</h4>
                    <div className="form-group">
                        <label>Sorte / Tracht</label>
                        <input type="text" name="honeyType" value={formData.honeyType} onChange={handleChange} placeholder="z.B. Waldhonig" />
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label>Lieferant / Imker</label>
                            <input type="text" name="honeySupplier" value={formData.honeySupplier} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Honigmenge (kg)</label>
                            <input type="number" step="0.1" name="honeyAmount" value={formData.honeyAmount} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🦠 Hefe & Zusätze
                    </h3>
                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                        <div className="form-group">
                            <label>Hefeart (Sorte)</label>
                            <input type="text" name="yeastType" value={formData.yeastType} onChange={handleChange} placeholder="z.B. Lalvin D47" />
                        </div>
                        <div className="form-group">
                            <label>Hefemenge (g)</label>
                            <input type="number" step="0.1" name="yeastAmount" value={formData.yeastAmount} onChange={handleChange} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1.5rem' }}>
                        <h4 style={{ margin: 0 }}>Weitere Zusätze</h4>
                        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={addAdditive}>
                            <Plus size={14} /> Hinzufügen
                        </button>
                    </div>

                    {formData.additives.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontStyle: 'italic' }}>Keine Zusätze erfasst (z.B. Hefenährsalz, Säure).</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {formData.additives.map(additive => (
                                <div key={additive.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder="Zusatz (z.B. Nährsalz)"
                                        value={additive.name}
                                        onChange={e => updateAdditive(additive.id, 'name', e.target.value)}
                                        style={{ flex: 2, padding: '0.5rem' }}
                                    />
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="Menge"
                                        value={additive.amount}
                                        onChange={e => updateAdditive(additive.id, 'amount', e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    />
                                    <select
                                        value={additive.unit}
                                        onChange={e => updateAdditive(additive.id, 'unit', e.target.value)}
                                        style={{ flex: 1, padding: '0.5rem' }}
                                    >
                                        <option value="g">g</option>
                                        <option value="ml">ml</option>
                                        <option value="TL">TL</option>
                                        <option value="kg">kg</option>
                                    </select>
                                    <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => removeAdditive(additive.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
