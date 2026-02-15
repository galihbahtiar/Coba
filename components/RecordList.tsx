
import React from 'react';
import { EnvelopeRecord, RecordType } from '../types';
import { Trash2, Edit3, Phone, MapPin, Calendar, Tag, Home, Clock, Bell } from 'lucide-react';

interface Props {
  records: EnvelopeRecord[];
  onEdit: (record: EnvelopeRecord) => void;
  onDelete: (id: string) => void;
}

const RecordList: React.FC<Props> = ({ records, onEdit, onDelete }) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 shadow-inner">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Calendar size={48} className="opacity-10" />
        </div>
        <p className="font-bold text-lg text-slate-500 text-center">Belum ada catatan amplop</p>
        <p className="text-sm text-center mt-1">Mulai dengan menambah catatan pemasukan atau pengeluaran baru</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {records.map((record) => (
        <div 
          key={record.id} 
          className="bg-white group rounded-[2rem] p-6 border border-slate-100 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 relative overflow-hidden"
        >
          {/* Type Badge */}
          <div className={`absolute top-0 right-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white rounded-bl-[1.5rem] shadow-sm ${record.type === RecordType.INCOME ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {record.type === RecordType.INCOME ? 'Masuk' : 'Keluar'}
          </div>

          <div className="flex flex-col h-full">
            <div className="mb-5">
              <h3 className="text-xl font-black text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{record.name}</h3>
              <div className="flex items-center gap-2 mt-1.5">
                 <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wider">{record.category || 'Lainnya'}</span>
                 <p className="text-sm text-slate-500 font-bold flex items-center gap-1">
                   <MapPin size={14} className="text-indigo-400" /> {record.event}
                 </p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-4 text-slate-600">
                <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Tanggal Acara</p>
                  <span className="text-sm font-bold">{new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              {record.address && (
                <div className="flex items-start gap-4 text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <Home size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Alamat</p>
                    <span className="text-sm font-bold line-clamp-2">{record.address}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                 {record.contact && (
                  <div className="flex items-start gap-4 text-slate-600">
                    <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Kontak</p>
                      <span className="text-sm font-bold">{record.contact}</span>
                    </div>
                  </div>
                )}

                {record.reminder && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                    <Bell size={12} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{record.reminderTime}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Jumlah Amplop</span>
                <span className={`text-2xl font-black ${record.type === RecordType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatIDR(record.amount)}
                </span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(record)}
                  className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all shadow-sm hover:shadow-md bg-white border border-slate-100"
                  title="Edit"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => onDelete(record.id)}
                  className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all shadow-sm hover:shadow-md bg-white border border-slate-100"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordList;
