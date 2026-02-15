
import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Search, TrendingUp, TrendingDown, BookOpen, User, Sparkles, LayoutDashboard, History } from 'lucide-react';
import { EnvelopeRecord, RecordType } from './types';
import { getRecords, saveRecords } from './services/storage';
import Dashboard from './components/Dashboard';
import RecordForm from './components/RecordForm';
import RecordList from './components/RecordList';
import SmartEntry from './components/SmartEntry';
import ExportTools from './components/ExportTools';

const App: React.FC = () => {
  const [records, setRecords] = useState<EnvelopeRecord[]>([]);
  const [view, setView] = useState<'dashboard' | 'list' | 'smart'>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EnvelopeRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formType, setFormType] = useState<RecordType>(RecordType.INCOME);

  // Load initial data
  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleSaveRecord = (record: Omit<EnvelopeRecord, 'id' | 'createdAt'>) => {
    let updatedRecords: EnvelopeRecord[];
    if (editingRecord) {
      updatedRecords = records.map(r => r.id === editingRecord.id ? { ...record, id: r.id, createdAt: r.createdAt } : r);
    } else {
      const newRecord: EnvelopeRecord = {
        ...record,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      updatedRecords = [newRecord, ...records];
    }
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
    setIsFormOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus catatan ini?")) {
      const updatedRecords = records.filter(r => r.id !== id);
      setRecords(updatedRecords);
      saveRecords(updatedRecords);
    }
  };

  const handleEdit = (record: EnvelopeRecord) => {
    setEditingRecord(record);
    setFormType(record.type);
    setIsFormOpen(true);
  };

  const handleOpenForm = (type: RecordType) => {
    setEditingRecord(null);
    setFormType(type);
    setIsFormOpen(true);
  };

  const handleEventFilter = (eventName: string) => {
    setSearchQuery(eventName);
    setView('list');
  };

  const filteredRecords = useMemo(() => {
    return records.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.address && r.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [records, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 pb-28 md:pb-12 text-slate-800">
      {/* Top Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-6 py-5 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 transition-transform hover:rotate-6">
            <BookOpen size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600">
              AmplopKu
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Pencatat Keuangan Acara</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setView('smart')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all text-sm font-black shadow-sm"
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline uppercase tracking-tight">AI Smart Entry</span>
          </button>
          <ExportTools records={records} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-12">
        {/* Nav Tabs (Desktop) */}
        <div className="hidden md:flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-10 border border-slate-200">
          <button 
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${view === 'dashboard' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-300/30'}`}
          >
            <LayoutDashboard size={18} /> RINGKASAN
          </button>
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all ${view === 'list' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-300/30'}`}
          >
            <History size={18} /> SEMUA CATATAN
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {view === 'dashboard' && (
            <Dashboard 
              records={records} 
              onTypeClick={(type) => handleOpenForm(type)} 
              onEventClick={handleEventFilter}
            />
          )}

          {view === 'list' && (
            <div className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">
                <div className="relative w-full lg:max-w-2xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Cari nama, acara, alamat, atau kategori..."
                    className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 outline-none transition-all shadow-sm font-bold text-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 font-bold text-xs bg-slate-100 px-2 py-1 rounded-md"
                    >
                      RESET
                    </button>
                  )}
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                   <button onClick={() => handleOpenForm(RecordType.INCOME)} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-[1.5rem] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 font-black tracking-tight">
                    <PlusCircle size={20} /> PEMASUKAN
                  </button>
                  <button onClick={() => handleOpenForm(RecordType.EXPENSE)} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-[1.5rem] hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 font-black tracking-tight">
                    <PlusCircle size={20} /> PENGELUARAN
                  </button>
                </div>
              </div>
              
              {searchQuery && (
                <div className="bg-indigo-50 p-4 rounded-2xl flex items-center justify-between border border-indigo-100">
                  <p className="text-sm font-bold text-indigo-700">Menampilkan hasil untuk: "<span className="italic">{searchQuery}</span>"</p>
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-indigo-600 shadow-sm">{filteredRecords.length} Ditemukan</span>
                </div>
              )}

              <RecordList records={filteredRecords} onEdit={handleEdit} onDelete={handleDeleteRecord} />
            </div>
          )}

          {view === 'smart' && (
            <SmartEntry onParsed={(data) => {
              setEditingRecord(null);
              setFormType(data.type);
              setEditingRecord({ ...data, id: '', createdAt: 0 } as any);
              setIsFormOpen(true);
            }} />
          )}
        </div>
      </main>

      {/* Mobile Sticky Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-slate-200 flex justify-around items-center h-20 w-[90%] max-w-md px-4 md:hidden z-40 rounded-[2.5rem] shadow-2xl">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${view === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
        >
          <TrendingUp size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase mt-1">Home</span>
        </button>
        <button 
          onClick={() => setView('list')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
        >
          <BookOpen size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase mt-1">Data</span>
        </button>
        <div className="relative -mt-16">
           <button 
            onClick={() => handleOpenForm(RecordType.INCOME)}
            className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-300 active:scale-90 transition-all border-4 border-slate-50"
          >
            <PlusCircle size={36} />
          </button>
        </div>
        <button 
          onClick={() => setView('smart')}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${view === 'smart' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400'}`}
        >
          <Sparkles size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase mt-1">Smart</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl text-slate-400"
        >
          <User size={24} strokeWidth={2.5} />
          <span className="text-[9px] font-black uppercase mt-1">User</span>
        </button>
      </nav>

      {/* Modals */}
      {isFormOpen && (
        <RecordForm 
          type={formType} 
          initialData={editingRecord || undefined}
          onSave={handleSaveRecord} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
