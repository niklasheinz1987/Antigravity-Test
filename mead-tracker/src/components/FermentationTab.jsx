import React, { useState } from 'react';
import { useBatchContext } from '../context/BatchContext';
import { Plus, Trash2, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function FermentationTab() {
    const { batches, activeBatchId, addFermentationLog, deleteFermentationLog, setActiveBatchId } = useBatchContext();
    const activeBatch = batches.find(b => b.id === activeBatchId);

    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [density, setDensity] = useState('');
    const [unit, setUnit] = useState('SG');
    const [temperature, setTemperature] = useState('');
    const [ph, setPh] = useState('');
    const [notes, setNotes] = useState('');

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

    const handleAddLog = (e) => {
        e.preventDefault();
        if (!density) return;

        addFermentationLog(activeBatchId, {
            date,
            density: parseFloat(density),
            unit,
            temperature: temperature ? parseFloat(temperature) : null,
            ph: ph ? parseFloat(ph) : null,
            notes
        });

        setDensity('');
        setTemperature('');
        setPh('');
        setNotes('');
    };

    const logs = activeBatch.fermentationLogs || [];

    // Calculate standard SG for all logs for charting & math
    const getSG = (value, u) => u === 'Oe' ? 1 + (value / 1000) : value;

    const chartData = {
        labels: logs.map(l => format(new Date(l.date), 'dd.MM.')),
        datasets: [
            {
                label: 'Dichte (SG)',
                data: logs.map(l => getSG(l.density, l.unit)),
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.5)',
                tension: 0.3,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Gärkurve', color: '#f8fafc' }
        },
        scales: {
            y: {
                reverse: true, // Density drops over time
                grid: { color: '#2e3440' },
                ticks: { color: '#94a3b8' }
            },
            x: {
                grid: { color: '#2e3440' },
                ticks: { color: '#94a3b8' }
            }
        }
    };

    let abv = 0;
    if (logs.length >= 2) {
        const firstSG = getSG(logs[0].density, logs[0].unit);
        const lastSG = getSG(logs[logs.length - 1].density, logs[logs.length - 1].unit);
        abv = ((firstSG - lastSG) * 131.25).toFixed(1);
        if (abv < 0) abv = 0;
    }

    return (
        <div className="fermentation-tab">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                        <h2>Gärung</h2>
                    </div>
                    <select
                        value={activeBatchId || ""}
                        onChange={e => setActiveBatchId(e.target.value)}
                        style={{ maxWidth: '300px', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    >
                        {batches.map(b => <option key={b.id} value={b.id}>{b.number} - {b.name}</option>)}
                    </select>
                </div>
                {logs.length >= 2 && (
                    <div className="card" style={{ padding: '0.75rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'var(--primary-color)' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Alkoholgehalt (geschätzt)</span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{abv} % vol</div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-3">
                {/* Left Column - Form */}
                <div className="card" style={{ gridColumn: 'span 1' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Neue Messung
                    </h3>
                    <form onSubmit={handleAddLog}>
                        <div className="form-group">
                            <label>Datum</label>
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                        </div>

                        <div className="grid grid-cols-2" style={{ gap: '0.5rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 1' }}>
                                <label>Dichte</label>
                                <input type="number" step="0.001" value={density} onChange={e => setDensity(e.target.value)} required />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 1' }}>
                                <label>Einheit</label>
                                <select value={unit} onChange={e => setUnit(e.target.value)}>
                                    <option value="SG">SG (z.B. 1.100)</option>
                                    <option value="Oe">°Oe (z.B. 100)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2" style={{ gap: '0.5rem' }}>
                            <div className="form-group">
                                <label>Temp. (°C)</label>
                                <input type="number" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>pH-Wert</label>
                                <input type="number" step="0.01" value={ph} onChange={e => setPh(e.target.value)} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Notizen</label>
                            <textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Z.B. Gärung gestartet, blubbert stark..." />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Speichern</button>
                    </form>
                </div>

                {/* Right Column - Logs & Chart */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={18} /> Verlauf
                        </h3>
                        {logs.length > 0 ? (
                            <Line data={chartData} options={chartOptions} />
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                Noch keine Daten für die Gärkurve erfasst.
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: '1rem' }}>Messprotokolle</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Datum</th>
                                        <th>Dichte</th>
                                        <th>Temp.</th>
                                        <th>pH</th>
                                        <th>Notiz</th>
                                        <th style={{ width: '50px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.slice().reverse().map(log => (
                                        <tr key={log.id}>
                                            <td>{format(new Date(log.date), 'dd.MM.yyyy')}</td>
                                            <td>{log.density} {log.unit}</td>
                                            <td>{log.temperature ? `${log.temperature}°C` : '-'}</td>
                                            <td>{log.ph || '-'}</td>
                                            <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={log.notes}>
                                                {log.notes || '-'}
                                            </td>
                                            <td>
                                                <button className="btn btn-danger" style={{ padding: '0.4rem', background: 'transparent', border: 'none' }} onClick={() => deleteFermentationLog(activeBatchId, log.id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>Keine Protokolle vorhanden</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
