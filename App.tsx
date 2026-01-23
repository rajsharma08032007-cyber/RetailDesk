import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding.tsx';
import { InsightTerminal, InsightView } from './components/InsightTerminal.tsx';
import { ShopTerminal, ShopView } from './components/ShopTerminal.tsx';
import { BusinessProfile, Transaction, Employee, Role, ServiceItem, InventoryItem } from './types.ts';
import { Store, BarChart2, LogOut, User } from 'lucide-react';

const SHOP_TABS: ShopView[] = ['Services', 'Inventory', 'Catalog'];
const INSIGHT_TABS: InsightView[] = ['Data Analyst', 'Employment', 'Transaction'];

const App: React.FC = () => {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [activeMain, setActiveMain] = useState<'SHOP' | 'INSIGHT'>('SHOP');
  const [activeShopTab, setActiveShopTab] = useState<ShopView>('Services');
  const [activeInsightTab, setActiveInsightTab] = useState<InsightView>('Data Analyst');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('retailDesk_db');
    if (saved) {
      try {
        const db = JSON.parse(saved);
        setProfile(db.profile);
        setTransactions(db.transactions || []);
        setEmployees(db.employees || []);
        setRoles(db.roles || []);
        setServices(db.services || []);
        setInventory(db.inventory || []);
      } catch (e) {
        console.error("Critical: Storage Registry Corrupted", e);
      }
    }
    setLoading(false);
  }, []);

  const saveToLocal = (data: any) => {
    localStorage.setItem('retailDesk_db', JSON.stringify(data));
  };

  const handleOnboardingComplete = (data: { profile: BusinessProfile, transactions: Transaction[], employees: Employee[], roles: Role[], services: ServiceItem[], inventory: InventoryItem[] }) => {
    setProfile(data.profile);
    setTransactions(data.transactions);
    setEmployees(data.employees);
    setRoles(data.roles);
    setServices(data.services);
    setInventory(data.inventory);
    saveToLocal(data);
  };

  const handleExit = () => {
    // Protocol: Directly terminate session and return to System Automation (Onboarding)
    localStorage.removeItem('retailDesk_db');
    setProfile(null);
    setTransactions([]);
    setEmployees([]);
    setRoles([]);
    setServices([]);
    setInventory([]);
    setActiveMain('SHOP');
    // Ensure view is completely reset
    setActiveShopTab('Services');
    setActiveInsightTab('Data Analyst');
  };

  const addTransaction = (tx: Transaction) => {
    const updated = [tx, ...transactions];
    setTransactions(updated);
    saveToLocal({ profile, transactions: updated, employees, roles, services, inventory });
  };

  const updateInventory = (items: InventoryItem[]) => {
    setInventory(items);
    saveToLocal({ profile, transactions, employees, roles, services, inventory: items });
  };

  const handleUpdateServices = (items: ServiceItem[]) => {
    setServices(items);
    saveToLocal({ profile, transactions, employees, roles, services: items, inventory });
  };

  if (loading) return <div className="h-[100dvh] bg-slate-950 flex items-center justify-center text-emerald-500 font-black animate-pulse uppercase tracking-[0.5em]">System_Booting...</div>;

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="h-[100dvh] bg-slate-950 flex flex-col overflow-hidden font-sans text-slate-200 supports-[height:100dvh]:h-[100dvh]">
      <header className="bg-slate-900/40 backdrop-blur-xl border-b border-white/5 shrink-0 z-50">
        <div className="flex h-14 md:h-16 items-center px-4 md:px-8 justify-between">
          <div className="flex items-center gap-2 md:gap-10">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center text-slate-950 font-black text-lg md:text-xl shadow-lg shrink-0">R</div>
              <div className="hidden sm:block">
                <h1 className="text-sm md:text-xl font-black tracking-tighter text-white leading-none">RetailDesk</h1>
                <p className="text-[7px] md:text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">Automated Engine</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1 md:space-x-2">
               <button onClick={() => setActiveMain('SHOP')} className={`flex items-center space-x-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold transition-all text-xs md:text-sm ${activeMain === 'SHOP' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                 <Store size={16} />
                 <span className="hidden xs:inline">Terminal</span>
               </button>
               <button onClick={() => setActiveMain('INSIGHT')} className={`flex items-center space-x-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold transition-all text-xs md:text-sm ${activeMain === 'INSIGHT' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                 <BarChart2 size={16} />
                 <span className="hidden xs:inline">Insights</span>
               </button>
            </nav>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
             <div className="bg-white/5 px-2 md:px-4 py-1.5 md:py-2 rounded-xl border border-white/5 flex items-center gap-2 md:gap-3 max-w-[180px] md:max-w-none">
                <div className="text-right hidden md:block overflow-hidden">
                  <p className="text-[7px] text-slate-500 font-black uppercase leading-none mb-1">Authenticated</p>
                  <p className="text-xs font-bold text-white truncate max-w-[100px] lg:max-w-[150px]">{profile.companyName}</p>
                </div>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                   <User size={12} />
                </div>
             </div>
             <button 
                onClick={handleExit} 
                title="Exit System" 
                className="p-2 text-slate-500 hover:text-red-400 transition-colors cursor-pointer group relative active:scale-90">
               <LogOut size={18} />
               <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block uppercase tracking-widest">EXIT_SYSTEM</span>
             </button>
          </div>
        </div>

        <div className="px-4 md:px-8 flex items-center h-10 md:h-12 bg-slate-900/20 border-t border-white/5 overflow-x-auto no-scrollbar">
            <div className="flex space-x-4 md:space-x-8 h-full min-w-max">
               {(activeMain === 'SHOP' ? SHOP_TABS : INSIGHT_TABS).map(tab => (
                 <button
                   key={tab}
                   onClick={() => activeMain === 'SHOP' ? setActiveShopTab(tab as ShopView) : setActiveInsightTab(tab as InsightView)}
                   className={`h-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all px-1 md:px-2 ${ (activeMain === 'SHOP' ? activeShopTab === tab : activeInsightTab === tab) ? (activeMain === 'SHOP' ? 'border-emerald-500 text-emerald-400' : 'border-indigo-500 text-indigo-400') : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                 >
                   {tab}
                 </button>
               ))}
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        {activeMain === 'SHOP' ? (
            <ShopTerminal 
              profile={profile} 
              view={activeShopTab} 
              services={services} 
              employees={employees} 
              roles={roles} 
              inventory={inventory}
              onTransactionComplete={addTransaction}
              onUpdateInventory={updateInventory}
              onUpdateServices={handleUpdateServices}
            />
        ) : (
            <InsightTerminal 
              profile={profile} 
              view={activeInsightTab} 
              sharedTransactions={transactions} 
              sharedEmployees={employees} 
              sharedRoles={roles} 
              setEmployees={setEmployees} 
              setRoles={setRoles} 
              services={services}
            />
        )}
      </main>
    </div>
  );
};

export default App;