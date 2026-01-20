import React, { useMemo, useState } from 'react';
import { BusinessProfile, Sector, Transaction, Employee, Role, ServiceItem } from '../types.ts';
import { TrendingUp, UserCheck, Clock, Award, Activity, ShoppingBag, CreditCard } from 'lucide-react';
import { 
  PeakHoursChart, 
  EmployeePerformanceChart, 
  PaymentMethodChart, 
  TopItemsChart 
} from './Charts.tsx';

interface DashboardProps {
  profile: BusinessProfile;
  transactions: Transaction[];
  employees: Employee[];
  roles: Role[];
  services: ServiceItem[];
}

type TimeFilter = 'Day' | 'Week' | 'Month';

export const Dashboard: React.FC<DashboardProps> = ({ profile, transactions, employees, roles, services }) => {
  const [filter, setFilter] = useState<TimeFilter>('Day');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const labels = useMemo(() => {
    switch(profile.sector) {
      case Sector.CAFE: return { items: 'Menu Items', performance: 'Orders Handled', peak: 'Rush Hours' };
      case Sector.SALON: return { items: 'Services', performance: 'Stylist Load', peak: 'Booking Peak' };
      case Sector.AUTO: return { items: 'Repairs', performance: 'Work Orders', peak: 'Bay Usage' };
      case Sector.MEDICAL: return { items: 'Consults', performance: 'Patient Load', peak: 'Wait Times' };
      default: return { items: 'Sales', performance: 'Activity', peak: 'Peak Time' };
    }
  }, [profile.sector]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      if (filter === 'Day') {
        return txDate.toDateString() === now.toDateString();
      } else if (filter === 'Week') {
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return txDate >= lastWeek;
      } else if (filter === 'Month') {
        return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
      }
      return false;
    });
  }, [filter, transactions, selectedMonth, selectedYear]);

  const analysis = useMemo(() => {
    const totalRevenue = filteredTransactions.reduce((sum, tx) => sum + tx.totalAmount, 0);
    const totalOrders = filteredTransactions.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    const timeLabels = filter === 'Day' 
      ? Array.from({ length: 24 }).map((_, i) => `${i.toString().padStart(2, '0')}:00`)
      : filter === 'Week' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }).map((_, i) => (i + 1).toString());

    const peakDataMap: Record<string, number> = {};
    timeLabels.forEach(l => peakDataMap[l] = 0);

    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date);
      let key = '';
      if (filter === 'Day') key = `${date.getHours().toString().padStart(2, '0')}:00`;
      else if (filter === 'Week') key = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      else key = date.getDate().toString();
      
      if (peakDataMap[key] !== undefined) peakDataMap[key] += 1;
    });

    const peakHours = Object.entries(peakDataMap).map(([time, sales]) => ({ time, sales }));

    const serviceCounts: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      tx.serviceIds.forEach(sid => {
        const srv = services.find(s => s.id === sid);
        if (srv) serviceCounts[srv.name] = (serviceCounts[srv.name] || 0) + 1;
      });
    });
    const preferredServices = Object.entries(serviceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const serviceProviderRoles = roles.filter(r => r.isServiceProvider).map(r => r.name);
    const empCounts: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      tx.employeeIds.forEach(eid => {
        const emp = employees.find(e => e.id === eid);
        if (emp && serviceProviderRoles.includes(emp.role)) {
          empCounts[emp.name] = (empCounts[emp.name] || 0) + 1;
        }
      });
    });
    const hardworkingEmployees = Object.entries(empCounts)
      .map(([name, services]) => ({ name, services }))
      .sort((a, b) => b.services - a.services)
      .slice(0, 5);

    const protocolCounts: Record<string, number> = { 'CASH': 0, 'UPI': 0, 'SPLIT': 0 };
    filteredTransactions.forEach(tx => {
      protocolCounts[tx.paymentMethod] = (protocolCounts[tx.paymentMethod] || 0) + 1;
    });
    const preferredProtocol = Object.entries(protocolCounts).map(([name, value]) => ({ name, value }));

    const topExpertName = hardworkingEmployees.length > 0 ? hardworkingEmployees[0].name : 'N/A';

    return {
      kpi: { revenue: totalRevenue, orders: totalOrders, avgValue: avgOrderValue, topExpert: topExpertName },
      peakHours,
      preferredServices,
      hardworkingEmployees,
      preferredProtocol
    };
  }, [filteredTransactions, services, roles, employees, filter, selectedMonth, selectedYear]);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tighter uppercase"><Activity className="text-emerald-400" /> Analyst Core</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Operational Surveillance: {profile.companyName}</p>
        </div>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 flex gap-1">
            {(['Day', 'Week', 'Month'] as TimeFilter[]).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard label="Net Revenue" value={`₹${analysis.kpi.revenue.toLocaleString()}`} sub="Current Settled Audit" icon={TrendingUp} color="emerald" />
        <SummaryCard label="Total Orders" value={analysis.kpi.orders} sub="Cumulative Volume" icon={ShoppingBag} color="blue" />
        <SummaryCard label="Avg Ticket" value={`₹${analysis.kpi.avgValue}`} sub="Ticket Benchmark" icon={CreditCard} color="amber" />
        <SummaryCard label="Lead Expert" value={analysis.kpi.topExpert} sub="Peak Productivity" icon={Award} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><Clock size={18} className="text-amber-400" /> {labels.peak} Volume</h3>
          <div className="flex-1"><PeakHoursChart data={analysis.peakHours} /></div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><ShoppingBag size={18} className="text-indigo-400" /> Most Preferred {labels.items}</h3>
          <div className="flex-1"><TopItemsChart data={analysis.preferredServices} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><UserCheck size={18} className="text-emerald-400" /> Hardworking Expert Efficiency</h3>
          <div className="flex-1"><EmployeePerformanceChart data={analysis.hardworkingEmployees} /></div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col min-h-[450px]">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3"><CreditCard size={18} className="text-purple-400" /> Preferred Protocol Mix</h3>
          <div className="flex-1"><PaymentMethodChart data={analysis.preferredProtocol} /></div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, sub, icon: Icon, color }: any) => {
  const c: any = { emerald: 'text-emerald-400 border-emerald-500/10 bg-emerald-500/5', blue: 'text-blue-400 border-blue-500/10 bg-blue-500/5', amber: 'text-amber-400 border-amber-500/10 bg-amber-500/5', purple: 'text-purple-400 border-purple-500/10 bg-purple-500/5' };
  return (
    <div className={`p-8 rounded-[3rem] border-2 ${c[color]} relative group transition-all duration-500 shadow-3xl bg-slate-950/40 overflow-hidden`}>
       <div className={`absolute -top-4 -right-4 p-8 rounded-full ${c[color]} opacity-20 blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
       <div className="relative z-10 flex justify-between items-start mb-6">
          <div className={`p-3 rounded-2xl ${c[color]} border shadow-lg`}><Icon size={24} /></div>
          <span className="text-[10px] font-black uppercase text-slate-700 tracking-[0.2em]">Verified</span>
       </div>
       <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-slate-500">{label}</p>
          <h3 className="text-4xl font-black text-white tracking-tighter mb-2 leading-none">{value}</h3>
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span> {sub}
          </p>
       </div>
    </div>
  );
};