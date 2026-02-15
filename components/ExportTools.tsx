
import React from 'react';
import { Download, FileText, Table } from 'lucide-react';
import { EnvelopeRecord, RecordType } from '../types';

// These libraries are widely used in SPAs
// Using dynamic imports or CDN scripts is common for browser environments
// For this environment, we assume we can use these if standard
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Props {
  records: EnvelopeRecord[];
}

const ExportTools: React.FC<Props> = ({ records }) => {
  const exportToExcel = () => {
    if (records.length === 0) return alert("Belum ada data untuk diekspor");
    
    const worksheetData = records.map(r => ({
      'Tipe': r.type === RecordType.INCOME ? 'Pemasukan' : 'Pengeluaran',
      'Tanggal': r.date,
      'Nama': r.name,
      'Nominal': r.amount,
      'Acara': r.event,
      'Kategori': r.category,
      'Kontak': r.contact,
      'Catatan': r.reminder ? 'Ada Pengingat' : '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Records");
    XLSX.writeFile(workbook, `AmplopKu_Ekspor_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToPDF = () => {
    if (records.length === 0) return alert("Belum ada data untuk diekspor");
    
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Laporan AmplopKu", 20, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 20, 30);

    let y = 45;
    doc.setFont("helvetica", "bold");
    doc.text("Nama", 20, y);
    doc.text("Acara", 70, y);
    doc.text("Tipe", 120, y);
    doc.text("Nominal", 160, y);
    doc.line(20, y + 2, 190, y + 2);
    
    y += 10;
    doc.setFont("helvetica", "normal");
    
    records.forEach((r, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(r.name.substring(0, 20), 20, y);
      doc.text(r.event.substring(0, 25), 70, y);
      doc.text(r.type === RecordType.INCOME ? 'Masuk' : 'Keluar', 120, y);
      doc.text(new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(r.amount), 160, y);
      y += 8;
    });

    doc.save(`AmplopKu_Ekspor_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
        <Download size={18} />
        <span className="hidden sm:inline">Ekspor</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100 z-50">
        <div className="p-2 space-y-1">
          <button 
            onClick={exportToPDF}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <FileText size={16} className="text-rose-500" />
            PDF Document
          </button>
          <button 
            onClick={exportToExcel}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Table size={16} className="text-emerald-500" />
            Excel Worksheet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportTools;
