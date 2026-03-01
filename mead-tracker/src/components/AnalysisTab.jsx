import React, { useState, useEffect } from 'react';
import { useBatchContext } from '../context/BatchContext';
import { Save, Calculator, AlertTriangle } from 'lucide-react';

export default function AnalysisTab() {
    const { batches, activeBatchId, updateBatch, setActiveBatchId } = useBatchContext();
    const activeBatch = batches.find(b => b.id === activeBatchId);

    const [formData, setFormData] = useState({
        backsweetenHoneyType: '',
        backsweetenHoneyAmount: '',
        sulfurType: 'Kaliumpyrosulfit',
        sulfurAmount: '',
        freeSO2: '',
        totalSO2: '',
        phFinal: ''
    });

    // Calculator State
    const [calcTargetSO2, setCalcTargetSO2] = useState('50');
    const [calcCurrentSO2, setCalcCurrentSO2] = useState('');
    const [calcFactor, setCalcFactor] = useState('0.667');

    useEffect(() => {
        if (activeBatch) {
            setFormData({
                backsweetenHoneyType: activeBatch.backsweetenHoneyType || '',
                backsweetenHoneyAmount: activeBatch.backsweetenHoneyAmount || '',
                sulfurType: activeBatch.sulfurType || 'Kaliumpyrosulfit',
                sulfurAmount: activeBatch.sulfurAmount || '',
                freeSO2: activeBatch.freeSO2 || '',
                totalSO2: activeBatch.totalSO2 || '',
                phFinal: activeBatch.phFinal || ''
            });
            if (activeBatch.freeSO2) setCalcCurrentSO2(activeBatch.freeSO2);
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

    const volume = activeBatch.volume || 0;

    // Kalfit Calculator Logic
    const neededSO2 = Math.max(0, parseFloat(calcTargetSO2 || 0) - parseFloat(calcCurrentSO2 || 0));
    const neededGrams = (neededSO2 * (volume / 100) * parseFloat(calcFactor || 0.667)).toFixed(2);
    const mlSolution10Percent = (neededGrams * 10).toFixed(1);

    // Recommended SO2 based on pH (rough estimation for white wine / mead)
    const phFinalVal = parseFloat(formData.phFinal || activeBatch.fermentationLogs?.[activeBatch.fermentationLogs.length - 1]?.ph || 3.3);
    let recommendedSO2 = 40;
    if (phFinalVal > 3.5) recommendedSO2 = 50;
    if (phFinalVal > 3.7) recommendedSO2 = 60;

    return (
        <div className="analysis-tab">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div>
                        <h2>Analyse & Abschluss</h2>
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
                    <h3 style={{ marginBottom: '1.5rem' }}>🍯 Nachsüßen & Abschluss</h3>
                    <div className="form-group">
                        <label>Nachgesüßter Honig (Sorte)</label>
                        <input type="text" name="backsweetenHoneyType" value={formData.backsweetenHoneyType} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Menge (kg)</label>
                        <input type="number" step="0.1" name="backsweetenHoneyAmount" value={formData.backsweetenHoneyAmount} onChange={handleChange} />
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Analysedaten</h4>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label>Freie SO₂ (mg/L)</label>
                            <input type="number" step="1" name="freeSO2" value={formData.freeSO2} onChange={(e) => { handleChange(e); setCalcCurrentSO2(e.target.value); }} />
                        </div>
                        <div className="form-group">
                            <label>Gesamte SO₂ (mg/L)</label>
                            <input type="number" step="1" name="totalSO2" value={formData.totalSO2} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label>End-pH-Wert</label>
                            <input type="number" step="0.01" name="phFinal" value={formData.phFinal} onChange={handleChange} placeholder={activeBatch.fermentationLogs?.[activeBatch.fermentationLogs.length - 1]?.ph || 'z.B. 3.4'} />
                        </div>
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Dokumentation der Schwefelung</h4>
                    <div className="form-group">
                        <label>Art der Schwefelung</label>
                        <input type="text" name="sulfurType" value={formData.sulfurType} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bereits Verwendete Menge (g/ml)</label>
                        <input type="number" step="0.1" name="sulfurAmount" value={formData.sulfurAmount} onChange={handleChange} />
                    </div>
                </div>

                <div className="card" style={{ border: '1px solid var(--primary-color)' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <Calculator size={20} /> Kalfit-Rechner
                    </h3>

                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', borderLeft: '4px solid var(--info-color)' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                            <AlertTriangle size={16} color="var(--info-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>Empfohlene Ziel-SO₂ bei pH <strong>{phFinalVal}</strong> liegt bei ca. <strong>{recommendedSO2} mg/L</strong> für ausreichenden Oxidationsschutz.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Ansatzvolumen (L)</label>
                            <input type="number" value={volume} disabled style={{ background: 'var(--surface-highlight)' }} />
                        </div>
                        <div className="form-group">
                            <label>Aktuelle freie SO₂ (mg/L)</label>
                            <input type="number" value={calcCurrentSO2} onChange={e => setCalcCurrentSO2(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Ziel-SO₂ (mg/L)</label>
                            <input type="number" value={calcTargetSO2} onChange={e => setCalcTargetSO2(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Faktor (Anpassbar)</label>
                            <input type="number" step="0.001" value={calcFactor} onChange={e => setCalcFactor(e.target.value)} title="Umrechnungsfaktor für Kaliumpyrosulfit (Standard 0.667)" />
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', background: 'var(--surface-highlight)', borderRadius: 'var(--radius-md)', marginTop: '2rem' }}>
                        <h4 style={{ margin: '0 0 1rem', color: 'var(--text-primary)' }}>Berechnete Zugabe</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Kaliumpyrosulfit-Pulver:</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{neededGrams > 0 ? neededGrams : 0} g</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Alternativ als 10%ige Lösung:</span>
                            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{mlSolution10Percent > 0 ? mlSolution10Percent : 0} ml</span>
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Formel: (Ziel-SO₂ - Aktuelle SO₂) × (Volumen / 100) × {calcFactor} = Gramm Kalfit
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
