import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportBatchToExcel = (batch) => {
    const wsData = [{
        'Charge Name': batch.name || 'Unbenannt',
        'Chargennummer': batch.number || '',
        'Ansatzvolumen (L)': batch.volume || '',
        'Honig Sorte': batch.honeyType || '',
        'Honig Menge (kg)': batch.honeyAmount || '',
        'Wasser Menge (L)': batch.waterAmount || '',
        'Hefeart': batch.yeastType || '',
        'Hefemenge (g)': batch.yeastAmount || '',
        'Freie SO2': batch.freeSO2 || '',
        'End pH': batch.phFinal || ''
    }];

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produktionsdaten");
    XLSX.writeFile(wb, `${batch.number || 'Met'}_Export.xlsx`);
};

export const exportBatchToPDF = (batch) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Met Dokumentation: ${batch.name || 'Unbenannt'}`, 14, 15);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Chargennummer: ${batch.number || ''}`, 14, 22);

    doc.autoTable({
        startY: 30,
        head: [['Eigenschaft', 'Wert']],
        body: [
            ['Ansatzvolumen', `${batch.volume || '-'} Liter`],
            ['Wasser', `${batch.waterAmount || '-'} Liter`],
            ['Honig Sorte', batch.honeyType || '-'],
            ['Honig Menge', `${batch.honeyAmount || '-'} kg`],
            ['Hefeart', batch.yeastType || '-'],
            ['Hefemenge', `${batch.yeastAmount || '-'} g`],
            ['Nachgesüßt (Honig)', `${batch.backsweetenHoneyAmount || '-'} kg`],
            ['Freie SO2', `${batch.freeSO2 || '-'} mg/L`],
            ['End-pH-Wert', batch.phFinal || '-']
        ],
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11] }
    });

    doc.save(`${batch.number || 'Met'}_Export.pdf`);
};
