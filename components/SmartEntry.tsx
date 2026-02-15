
import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Info } from 'lucide-react';
import { parseAmplopText } from '../services/gemini';

interface Props {
  onParsed: (data: any) => void;
}

const SmartEntry: React.FC<Props> = ({ onParsed }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagic = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const data = await parseAmplopText(input);
      if (data) {
        onParsed(data);
        setInput('');
      } else {
        alert("Gagal memahami input. Coba kata-kata yang lebih jelas.");
      }
    } catch (e) {
      alert("Error saat memproses dengan AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
          <Sparkles size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Smart Entry (AI)</h2>
          <p className="text-sm text-slate-500">Tulis catatanmu, AI akan mengisi formulir untukmu.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <textarea 
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none h-40 resize-none transition-all"
            placeholder="Ketik seperti: 'Terima amplop 200rb dari Budi pas nikahan Kak Siska kemarin kategori pernikahan' atau 'Kasih amplop ke Bu Siti 100rb buat sunatan anaknya'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            disabled={isLoading || !input.trim()}
            onClick={handleMagic}
            className="absolute bottom-4 right-4 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            Proses
          </button>
        </div>

        <div className="p-4 bg-amber-50 rounded-xl flex gap-3 border border-amber-100">
          <Info className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Tips:</strong> AI bekerja paling baik jika kamu menyebutkan minimal <strong>Jumlah</strong>, <strong>Nama Orang</strong>, dan <strong>Acara</strong>. <br/>
            Contoh: "Amplop masuk 500rb dari pak kades buat sumbangan masjid"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartEntry;
