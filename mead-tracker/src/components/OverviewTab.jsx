import React, { useState } from 'react';
import { useBatchContext } from '../context/BatchContext';
import { Plus, Trash2, Edit, Download, Box, Droplet, Archive, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { exportBatchToExcel, exportBatchToPDF } from '../utils/exportUtils';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OverviewTab({ setActiveTab }) {
    const { batches, updateBatch, setActiveBatchId, deleteBatch, addBatch } = useBatchContext();
    const [isCreating, setIsCreating] = useState(false);
    const [newBatchName, setNewBatchName] = useState('');
    const [newBatchNumber, setNewBatchNumber] = useState('');

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newBatchName.trim()) return;

        const id = await addBatch({
            name: newBatchName,
            number: newBatchNumber.trim() || `CH-${new Date().getFullYear()}-${String(batches.length + 1).padStart(3, '0')}`,
        });

        setNewBatchName('');
        setNewBatchNumber('');
        setIsCreating(false);
        setActiveBatchId(id);
        setTimeout(() => {
            if (setActiveTab) setActiveTab('production');
        }, 50);
    };

    const totalBatches = batches.length;
    const activeBatches = batches.filter(b => b.status === 'active').length;
    const totalVolume = batches.reduce((sum, b) => sum + parseFloat(b.volume || 0), 0);
    const totalHoney = batches.reduce((sum, b) => sum + parseFloat(b.honeyAmount || 0) + parseFloat(b.backsweetenHoneyAmount || 0), 0);

    // For the active/archived donut chart
    const donutData = {
        labels: ['Aktiv', 'Archiviert'],
        datasets: [{
            data: [activeBatches, totalBatches - activeBatches],
            backgroundColor: ['#00b8d9', '#391484'],
            borderWidth: 0,
            cutout: '75%'
        }]
    };

    return (
        <div className="dashboard-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Dashboard & Chargen</h2>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)} style={{ borderRadius: '12px', padding: '0.875rem 1.5rem' }}>
                    <Plus size={18} /> Neue Charge anlegen
                </button>
            </div>

            {isCreating && (
                <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#2b3674' }}>Neue Charge</h3>
                    <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label>Chargennummer (Optional)</label>
                            <input
                                type="text"
                                value={newBatchNumber}
                                onChange={e => setNewBatchNumber(e.target.value)}
                                placeholder="Wird auto-generiert falls leer"
                            />
                        </div>
                        <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
                            <label>Name der Charge</label>
                            <input
                                type="text"
                                value={newBatchName}
                                onChange={e => setNewBatchName(e.target.value)}
                                placeholder="z.B. Honigwein Klassik Herbst 2026"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Anlegen</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsCreating(false)}>Abbrechen</button>
                    </form>
                </div>
            )}

            {/* Top KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card kpi-card">
                    <div className="kpi-info">
                        <h3 style={{ fontSize: '1.75rem', margin: 0, color: '#2b3674' }}>{totalBatches}</h3>
                        <span style={{ color: '#a3aed1', fontSize: '0.875rem' }}>Gesamt Chargen</span>
                    </div>
                    <div className="icon-box" style={{ background: '#ffce20', color: '#fff', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box size={24} />
                    </div>
                </div>

                <div className="card kpi-card">
                    <div className="kpi-info">
                        <h3 style={{ fontSize: '1.75rem', margin: 0, color: '#2b3674' }}>{totalVolume.toFixed(1)} L</h3>
                        <span style={{ color: '#a3aed1', fontSize: '0.875rem' }}>Ansatzvolumen</span>
                    </div>
                    <div className="icon-box" style={{ background: '#00b8d9', color: '#fff', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Droplet size={24} />
                    </div>
                </div>

                <div className="card kpi-card">
                    <div className="kpi-info">
                        <h3 style={{ fontSize: '1.75rem', margin: 0, color: '#2b3674' }}>{totalHoney.toFixed(1)} kg</h3>
                        <span style={{ color: '#a3aed1', fontSize: '0.875rem' }}>Honig Verarbeitet</span>
                    </div>
                    <div className="icon-box" style={{ background: '#05cd99', color: '#fff', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={24} />
                    </div>
                </div>

                <div className="card kpi-card">
                    <div className="kpi-info">
                        <h3 style={{ fontSize: '1.75rem', margin: 0, color: '#2b3674' }}>{activeBatches}</h3>
                        <span style={{ color: '#a3aed1', fontSize: '0.875rem' }}>Aktive Chargen</span>
                    </div>
                    <div className="icon-box" style={{ background: '#ee5d50', color: '#fff', borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Archive size={24} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Main Area: Batches List */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', color: '#2b3674', margin: '0 0 1rem 0' }}>Produktionshistorie</h3>

                    {batches.length === 0 && !isCreating ? (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                            <div style={{ fontSize: '3rem', margin: '0 auto 1rem', background: '#e9edf7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍯</div>
                            <h3>Keine Chargen vorhanden</h3>
                            <p>Legen Sie Ihre erste Met-Charge an, um mit der Dokumentation zu beginnen.</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Charge</th>
                                        <th>Name</th>
                                        <th>Volumen</th>
                                        <th>Datum</th>
                                        <th style={{ textAlign: 'right' }}>Aktionen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {batches.map(batch => (
                                        <tr key={batch.id}>
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
                                            <td style={{ color: '#8f9bba', fontSize: '0.85rem' }}>{batch.number}</td>
                                            <td style={{ fontWeight: 600 }}>{batch.name || 'Unbenannt'}</td>
                                            <td>{batch.volume ? `${batch.volume} L` : '-'}</td>
                                            <td style={{ color: '#8f9bba', fontSize: '0.85rem' }}>{format(new Date(batch.createdAt), 'dd.MM.yy')}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Bearbeiten" onClick={() => { setActiveBatchId(batch.id); if (setActiveTab) setActiveTab('production'); }}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="PDF Export" onClick={() => exportBatchToPDF(batch)}>
                                                        <Download size={16} />
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Excel Export" onClick={() => exportBatchToExcel(batch)}>
                                                        <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>XLS</span>
                                                    </button>
                                                    <button className="btn btn-danger" style={{ padding: '0.5rem' }} title="Löschen" onClick={() => {
                                                        if (confirm('Charge wirklich löschen?')) deleteBatch(batch.id);
                                                    }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Right Sidebar Status Donut */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '280px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#2b3674', margin: 0 }}>Chargen Status</h3>
                        </div>

                        {batches.length > 0 ? (
                            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: '160px', height: '160px' }}>
                                    <Doughnut data={donutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, cutout: '75%' }} />
                                </div>
                                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', inset: 0 }}>
                                    <span style={{ fontSize: '2rem', fontWeight: 700, color: '#2b3674' }}>
                                        {totalBatches > 0 ? Math.round((activeBatches / totalBatches) * 100) : 0}%
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: '#8f9bba' }}>Aktiv</span>
                                </div>

                                <div style={{ position: 'absolute', right: '-10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '0.75rem', color: '#a3aed1' }}>System status</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: '#2b3674' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b8d9' }} /> AKTIV
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: '#2b3674', marginTop: '0.25rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} /> BEENDET
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 700, color: '#2b3674', marginTop: '0.25rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#391484' }} /> ARCHIV
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a3aed1', textAlign: 'center' }}>
                                Keine Daten<br />verfügbar
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .kpi-card { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; }
      `}} />
        </div>
    );
}
