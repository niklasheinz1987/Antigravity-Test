import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-react';

export default function EconomicsTab() {
    // Economics tab is now entirely standalone and state is saved to localStorage directly.
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('meadTrackerEconomicsGloabl');
        if (saved) return JSON.parse(saved);
        return {
            honeyKg: '10',
            honeyPricePerKg: '8',
            otherCosts: '15',
            bottleCost: '0.80',
            labelCost: '0.30',
            actualBottles: '40',
            salePricePerBottle: '12'
        };
    });

    useEffect(() => {
        localStorage.setItem('meadTrackerEconomicsGloabl', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = () => {
        if (confirm('Möchten Sie den Rechner wirklich zurücksetzen?')) {
            setFormData({
                honeyKg: '',
                honeyPricePerKg: '',
                otherCosts: '',
                bottleCost: '',
                labelCost: '',
                actualBottles: '',
                salePricePerBottle: ''
            });
        }
    };

    // Calculations
    const honeyKg = parseFloat(formData.honeyKg || 0);
    const totalHoneyCost = honeyKg * parseFloat(formData.honeyPricePerKg || 0);

    const bottles = parseInt(formData.actualBottles || 0, 10);
    const totalPackagingCost = bottles * (parseFloat(formData.bottleCost || 0) + parseFloat(formData.labelCost || 0));

    const totalProductionCost = totalHoneyCost + totalPackagingCost + parseFloat(formData.otherCosts || 0);
    const costPerBottle = bottles > 0 ? (totalProductionCost / bottles).toFixed(2) : 0;

    const totalRevenue = bottles * parseFloat(formData.salePricePerBottle || 0);
    const totalProfit = totalRevenue - totalProductionCost;
    const profitPerBottle = bottles > 0 ? (totalProfit / bottles).toFixed(2) : 0;
    const profitMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0;

    const formatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

    return (
        <div className="economics-tab">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Wirtschaftlichkeits-Rechner</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Freier Rechner zur Modellierung von Kosten und Margen. Unabhängig von spezifischen Chargen.</p>
                </div>
                <button className="btn btn-secondary" onClick={handleReset}>
                    <RefreshCw size={18} /> Zurücksetzen
                </button>
            </div>

            <div className="grid grid-cols-2">
                {/* Left Column - Form */}
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DollarSign size={18} /> Eingaben
                    </h3>

                    <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Honigmenge (kg)</label>
                            <input type="number" step="0.1" name="honeyKg" value={formData.honeyKg} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Honigpreis (pro kg) in €</label>
                            <input type="number" step="0.01" name="honeyPricePerKg" value={formData.honeyPricePerKg} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Sonstige Kosten (Hefe, Deckel, Korken) in €</label>
                        <input type="number" step="0.01" name="otherCosts" value={formData.otherCosts} onChange={handleChange} />
                    </div>

                    <h4 style={{ margin: '1.5rem 0 1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Verpackung & Verkauf</h4>
                    <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
                        <div className="form-group">
                            <label>Flaschen (Stückzahl)</label>
                            <input type="number" step="1" name="actualBottles" value={formData.actualBottles} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Verkaufspreis pro Flasche (€)</label>
                            <input type="number" step="0.01" name="salePricePerBottle" value={formData.salePricePerBottle} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Kosten pro Flasche (leer) in €</label>
                            <input type="number" step="0.01" name="bottleCost" value={formData.bottleCost} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Kosten pro Etikett in €</label>
                            <input type="number" step="0.01" name="labelCost" value={formData.labelCost} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                {/* Right Column - Results Dashboard */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ background: 'var(--surface-highlight)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Kostenanalyse</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Verbrauchter Honig ({honeyKg.toFixed(1)} kg)</span>
                            <span>{formatter.format(totalHoneyCost)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Verpackung ({bottles} Flaschen)</span>
                            <span>{formatter.format(totalPackagingCost)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Sonstige Kosten</span>
                            <span>{formatter.format(parseFloat(formData.otherCosts || 0))}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                            <span>Gesamtkosten Charge</span>
                            <span>{formatter.format(totalProductionCost)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            <span>Kosten pro Flasche</span>
                            <span>{formatter.format(costPerBottle)} / Flasche</span>
                        </div>
                    </div>

                    <div className="card" style={{ border: '1px solid var(--primary-color)' }}>
                        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <TrendingUp size={20} /> Ertrag & Gewinn
                        </h3>

                        <div className="grid grid-cols-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Gesamtumsatz</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatter.format(totalRevenue)}</div>
                            </div>
                            <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Gewinnmarge</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: totalProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                    {profitMargin} %
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: totalProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)' }}>
                            <div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Gesamtgewinn</div>
                                <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: totalProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                    {totalProfit >= 0 ? '+' : ''}{formatter.format(totalProfit)}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Gewinn pro Flasche</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: totalProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                                    {totalProfit >= 0 ? '+' : ''}{formatter.format(profitPerBottle)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
