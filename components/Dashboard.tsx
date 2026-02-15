
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { EnvelopeRecord, RecordType } from '../types';
import { TrendingUp, TrendingDown, Wallet, Calendar, MapPin, ChevronRight } from 'lucide-react';

interface Props {
  records: EnvelopeRecord[];
  onTypeClick: (type: RecordType) => void;
  onEventClick: (eventName: string) => void;
}

const COLORS = ['#10b981', '#f43f5e'];

const Dashboard: React.FC<Props> = ({ records, onTypeClick, onEventClick }) => {
  const totalIncome = records.filter(r => r.type === RecordType.INCOME).reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === RecordType.EXPENSE).reduce((sum, r) => sum + r.amount, 0);
  
  const chartData = [
    { name: 'Total Masuk', value: totalIncome },
    { name: 'Total Keluar', value: totalExpense },
  ];

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Group by Event
  const eventsMap = records.reduce((acc, r) => {
    if (!acc[r.event]) acc[r.event] = { name: r.event, count: 0, total: 0, type: r.type };
    acc[r.event].count += 1;
    acc[r.event].total += r.amount;
    return acc;
  }, {} as Record<string, { name: string, count: number, total: number, type: RecordType }>);

  const eventList = Object.values(eventsMap).sort((a, b) => b.total - a.total).slice(0, 4);

  const recentRecords = records.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Stats & Per Event History */}
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            onClick={() => onTypeClick(RecordType.INCOME)}
            className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group hover:shadow-xl hover:shadow-emerald-50/50"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                <TrendingUp size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">Pemasukan</span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatIDR(totalIncome)}</h3>
            <p className="text-sm font-bold text-slate-400 mt-2">Uang amplop yang diterima</p>
          </div>

          <div 
            onClick={() => onTypeClick(RecordType.EXPENSE)}
            className="bg-white p-7 rounded-[2rem] shadow-sm border border-slate-100 hover:border-rose-200 transition-all cursor-pointer group hover:shadow-xl hover:shadow-rose-50/50"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all shadow-inner">
                <TrendingDown size={28} />
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">Pengeluaran</span>
            </div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{formatIDR(totalExpense)}</h3>
            <p className="text-sm font-bold text-slate-400 mt-2">Uang amplop yang diberikan</p>
          </div>
        </div>

        {/* History per Event (Riwayat Per Acara) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-black text-slate-800">Riwayat Per Acara</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Grup berdasarkan nama acara</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {eventList.length > 0 ? eventList.map((event, idx) => (
              <button 
                key={idx}
                onClick={() => onEventClick(event.name)}
                className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all group text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-200">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 line-clamp-1">{event.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{event.count} Catatan • {formatIDR(event.total)}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </button>
            )) : (
              <div className="col-span-full py-10 text-center text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-3xl">
                Belum ada acara tercatat
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Comparison & Recent Activity */}
      <div className="space-y-8">
        {/* Chart Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-[380px] flex flex-col">
          <h4 className="text-lg font-black mb-2 text-slate-800">Visualisasi</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Aliran Kas Amplop</p>
          {(totalIncome > 0 || totalExpense > 0) ? (
            <div className="flex-1">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: '800' }}
                    formatter={(value: number) => formatIDR(value)} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <Wallet size={64} className="mb-4 opacity-10" />
              <p className="font-bold text-sm">Tidak ada data</p>
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h4 className="text-lg font-black mb-6 text-slate-800 flex items-center justify-between">
            Aktivitas Terkini
          </h4>
          <div className="space-y-6">
            {recentRecords.length > 0 ? recentRecords.map(record => (
              <div key={record.id} className="flex gap-5 items-start relative pb-6 border-b border-slate-50 last:border-0 last:pb-0 group">
                <div className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 shadow-sm ${record.type === RecordType.INCOME ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-black text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{record.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{record.event}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-sm font-black ${record.type === RecordType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {record.type === RecordType.INCOME ? '+' : '-'}{formatIDR(record.amount)}
                    </span>
                    <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(record.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-300">
                <p className="text-sm font-bold">Belum ada transaksi</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
