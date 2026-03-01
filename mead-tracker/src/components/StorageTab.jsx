import React, { useState, useEffect } from 'react';
import { useBatchContext } from '../context/BatchContext';
import { Archive, Save, Clock, Droplets, Droplet, Wine } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

export default function StorageTab() {
    const { batches, updateBatch, addConsumptionLog } = useBatchContext();

    const [consumeModalOpen, setConsumeModalOpen] = useState(false);
    const [consumeBatch, setConsumeBatch] = useState(null);
    const [consumeAmount, setConsumeAmount] = useState('');
    const [consumeNote, setConsumeNote] = useState('');

    const openConsumeModal = (batch) => {
        setConsumeBatch(batch);
        setConsumeAmount('');
        setConsumeNote('');
        setConsumeModalOpen(true);
    };

    const handleConsumeSubmit = (e) => {
        e.preventDefault();

        if (!consumeBatch) return;

        // Convert comma to dot for parsing
        const parsedAmount = parseFloat(consumeAmount.replace(',', '.'));

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Bitte eine gültige Menge größer 0 eingeben.');
            return;
        }

        const currentVol = consumeBatch.currentVolume !== undefined ? parseFloat(consumeBatch.currentVolume) : (parseFloat(consumeBatch.volume) || 0);

        if (parsedAmount > currentVol) {
            alert(`Warnung: Die eingegebene Menge (${parsedAmount} L) ist größer als der aktuelle Bestand (${currentVol} L).`);
        }

        const date = new Date().toISOString().split('T')[0];

        // Call the context function to update root state
        addConsumptionLog(consumeBatch.id, parsedAmount, date, consumeNote || '');

        setConsumeModalOpen(false);
        setConsumeBatch(null);
    };

    // The component just renders all batches from context
    // and saves changes directly to the specific batch onChange.

    // Calculate totals for a small KPI header
    const totalProduced = batches.reduce((sum, b) => sum + (parseFloat(b.volume) || 0), 0);
    const totalConsumed = batches.reduce((sum, b) => {
        if (!b.consumptionLogs || !Array.isArray(b.consumptionLogs)) return sum;
        const batchConsumption = b.consumptionLogs.reduce((cSum, log) => {
            return cSum + (parseFloat(log.amount) || 0);
        }, 0);
        return sum + batchConsumption;
    }, 0);
    const totalCurrentStock = batches.reduce((sum, b) => {
        const currentVol = b.currentVolume !== undefined ? parseFloat(b.currentVolume) : (parseFloat(b.volume) || 0);
        return sum + currentVol;
    }, 0);

    return (
        <div className="storage-tab">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Lagerung & Reifung - Gesamtübersicht</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Globale Verwaltung aller eingelagerten Chargen und Bestand.</p>
                </div>
            </div>

            <div className="grid grid-cols-3" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: 'rgba(57, 20, 132, 0.1)', color: 'var(--text-primary)', padding: '1rem', borderRadius: '12px' }}>
                        <Wine size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalProduced.toFixed(1)} L</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Produziert Gesamt</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: '1rem', borderRadius: '12px' }}>
                        <Droplet size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalConsumed.toFixed(1)} L</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Verbraucht Gesamt</div>
                    </div>
                </div>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ background: 'rgba(0, 184, 217, 0.1)', color: 'var(--primary-color)', padding: '1rem', borderRadius: '12px' }}>
                        <Droplets size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalCurrentStock.toFixed(1)} L</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Aktueller Bestand</div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Lagerbestände</h3>
                {batches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <p>Noch keine Chargen angelegt.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Charge</th>
                                    <th>Status</th>
                                    <th>Lagerort</th>
                                    <th>Gebindeart</th>
                                    <th>Aktuelles Volumen (L)</th>
                                    <th>Abfülldatum</th>
                                    <th>Reifedauer</th>
                                    <th>Aktionen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.map(batch => {
                                    const agingDays = batch.bottlingDate ? differenceInDays(new Date(), new Date(batch.bottlingDate)) : null;

                                    return (
                                        <tr key={batch.id}>
                                            <td>
                                                <strong>{batch.number}</strong><br />
                                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {batch.name || 'Unbenannt'}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    value={batch.status || 'active'}
                                                    onChange={(e) => updateBatch(batch.id, { status: e.target.value })}
                                                    style={{ padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                                                >
                                                    <option value="active">Aktiv</option>
                                                    <option value="finished">Beendet</option>
                                                    <option value="archived">Archiv</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={batch.storageLocation || ''}
                                                    onChange={e => updateBatch(batch.id, { storageLocation: e.target.value })}
                                                    placeholder="z.B. Keller Regal 1"
                                                    style={{ padding: '0.5rem', width: '100%', minWidth: '150px' }}
                                                />
                                            </td>
                                            <td>
                                                <select
                                                    value={batch.storageContainer || 'Glasballon'}
                                                    onChange={e => updateBatch(batch.id, { storageContainer: e.target.value })}
                                                    style={{ padding: '0.5rem', width: '100%' }}
                                                >
                                                    <option value="Glasballon">Glasballon</option>
                                                    <option value="Edelstahltank">Edelstahltank</option>
                                                    <option value="Fass">Fass</option>
                                                    <option value="Holzfass">Holzfass</option>
                                                    <option value="Kanister">Kanister</option>
                                                    <option value="Flasche">Flasche</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        value={batch.currentVolume !== undefined ? batch.currentVolume : (batch.volume || 0)}
                                                        onChange={e => updateBatch(batch.id, { currentVolume: parseFloat(e.target.value) || 0 })}
                                                        style={{ padding: '0.5rem', width: '80px' }}
                                                    /> L
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    value={batch.bottlingDate || ''}
                                                    onChange={e => updateBatch(batch.id, { bottlingDate: e.target.value })}
                                                    style={{ padding: '0.5rem', width: '100%' }}
                                                />
                                            </td>
                                            <td>
                                                {agingDays !== null ? (
                                                    <span style={{ fontWeight: 600, color: agingDays > 90 ? 'var(--success-color)' : 'var(--text-primary)' }}>
                                                        {agingDays} Tage
                                                    </span>
                                                ) : '-'}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => openConsumeModal(batch)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                                                >
                                                    <Wine size={16} /> Verbrauchen
                                                </button>
                                                {batch.consumptionLogs && batch.consumptionLogs.length > 0 && (
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                                                        Gesamt verbraucht: {batch.consumptionLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0).toFixed(1)} L
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Consume Modal */}
            {consumeModalOpen && consumeBatch && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', maxWidth: '90%', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Verbrauch eintragen</h3>
                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Charge: <strong>{consumeBatch.number} ({consumeBatch.name || 'Unbenannt'})</strong>
                        </p>
                        <form onSubmit={handleConsumeSubmit}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Menge (Liter) *</label>
                                <input
                                    type="text"
                                    required
                                    value={consumeAmount}
                                    onChange={(e) => setConsumeAmount(e.target.value)}
                                    placeholder="z.B. 2.5"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Notiz (Optional)</label>
                                <input
                                    type="text"
                                    value={consumeNote}
                                    onChange={(e) => setConsumeNote(e.target.value)}
                                    placeholder="z.B. Verkostung, Verkauf"
                                    style={{ width: '100%', padding: '0.5rem' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setConsumeModalOpen(false)}>Abbrechen</button>
                                <button type="submit" className="btn btn-primary">Speichern</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
