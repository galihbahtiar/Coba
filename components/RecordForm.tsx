
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, MapPin, Tag, Bell, DollarSign, Clock, Home } from 'lucide-react';
import { EnvelopeRecord, RecordType } from '../types';

interface Props {
  type: RecordType;
  initialData?: Partial<EnvelopeRecord>;
  onSave: (record: Omit<EnvelopeRecord, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

const RecordForm: React.FC<Props> = ({ type, initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    name: '',
    contact: '',
    address: '',
    event: '',
    category: '',
    reminder: false,
    reminderTime: '09:00'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        date: initialData.date || prev.date,
        amount: initialData.amount || 0,
        name: initialData.name || '',
        contact: initialData.contact || '',
        address: initialData.address || '',
        event: initialData.event || '',
        category: initialData.category || '',
        reminder: initialData.reminder || false,
        reminderTime: initialData.reminderTime || '09:00'
      }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.event) {
      alert("Mohon lengkapi Nama, Nominal, dan Acara.");
      return;
    }
    onSave({ ...formData, type });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200">
        {/* Header */}
        <div className={`px-6 py-5 flex justify-between items-center text-white ${type === RecordType.INCOME ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          <div>
            <h2 className="text-xl font-bold">Catat {type === RecordType.INCOME ? 'Pemasukan' : 'Pengeluaran'}</h2>
            <p className="text-xs opacity-90 font-medium">Lengkapi detail amplop di bawah ini</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">
          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <DollarSign size={16} className="text-indigo-500" /> Nominal Amplop
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">Rp</span>
              <input 
                type="number" 
                required
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-2xl font-black text-slate-800"
                placeholder="0"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date Field - Custom Interaction */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Calendar size={16} className="text-indigo-500" /> Tanggal Acara
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none block"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>

            {/* Category Field */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Tag size={16} className="text-indigo-500" /> Kategori Acara
              </label>
              <select 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Pilih Kategori</option>
                <option value="Wedding">Pernikahan</option>
                <option value="Khitanan">Khitanan</option>
                <option value="Birthday">Ulang Tahun</option>
                <option value="Funeral">Duka Cita</option>
                <option value="Social">Sosial/Arisan</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-indigo-500" /> {type === RecordType.INCOME ? 'Nama Pemberi' : 'Nama Penerima'}
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Masukkan nama lengkap..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Address Field (NEW) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Home size={16} className="text-indigo-500" /> Alamat Lengkap
            </label>
            <textarea 
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Alamat rumah atau lokasi..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          {/* Event Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Nama Acara
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: Walimatul Ursy Budi & Siska"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
            />
          </div>

          {/* Contact Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Phone size={16} className="text-indigo-500" /> Nomor Kontak
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Nomor HP/WA..."
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          {/* Reminder Toggle & Time Picker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm shadow-indigo-100/50">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl transition-colors ${formData.reminder ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-300'}`}>
                  <Bell size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-indigo-900">Set Pengingat?</p>
                  <p className="text-xs text-indigo-600/70 font-medium">Ingatkan saya di masa depan</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
                />
                <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {/* Pop-up like Time Picker when reminder is active */}
            {formData.reminder && (
              <div className="animate-in slide-in-from-top-4 duration-300 p-4 bg-white border border-indigo-100 rounded-2xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Clock size={18} className="text-indigo-600" />
                  Waktu Pengingat
                </div>
                <input 
                  type="time" 
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                />
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-6 active:scale-[0.97] mb-4"
          >
            SIMPAN CATATAN
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordForm;
