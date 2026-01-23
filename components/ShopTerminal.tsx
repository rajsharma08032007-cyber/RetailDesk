import React, { useState, useMemo, useEffect } from 'react';
import { BusinessProfile, Employee, Role, ServiceItem, Customer, PaymentMethod, Transaction, InventoryItem, Unit } from '../types.ts';
import { CheckCircle, Banknote, Smartphone, Split, Plus, Minus, ShoppingCart, Layers, ChevronLeft, ChevronRight, User, Trash2, Box, Edit2, Search, X, Image as ImageIcon, AlertTriangle, Package, History, Clock } from 'lucide-react';

export type ShopView = 'Services' | 'Inventory' | 'Catalog';

interface ShopTerminalProps {
  profile: BusinessProfile;
  view: ShopView;
  services: ServiceItem[];
  employees: Employee[];
  roles: Role[];
  inventory?: InventoryItem[];
  onTransactionComplete: (tx: Transaction) => void;
  onUpdateInventory?: (items: InventoryItem[]) => void;
  onUpdateServices?: (items: ServiceItem[]) => void;
}

export const ShopTerminal: React.FC<ShopTerminalProps> = ({ profile, view, services, employees, roles, inventory = [], onTransactionComplete, onUpdateInventory, onUpdateServices }) => {
  return (
    <div className="h-full bg-slate-950 text-slate-200 overflow-hidden relative">
      {view === 'Services' && <ServicesWizard services={services} employees={employees} roles={roles} onComplete={onTransactionComplete} />}
      {view === 'Catalog' && <CatalogView services={services} onUpdateServices={onUpdateServices!} />}
      {view === 'Inventory' && <InventoryView inventory={inventory} onUpdateInventory={onUpdateInventory!} />}
    </div>
  );
};

const ServicesWizard: React.FC<{ services: ServiceItem[], employees: Employee[], roles: Role[], onComplete: (tx: Transaction) => void }> = ({ services, employees, roles, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({}); 
  const [cart, setCart] = useState<(ServiceItem & {qty: number})[]>([]);
  const [customer, setCustomer] = useState<Customer>({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isManualItemOpen, setIsManualItemOpen] = useState(false);
  
  // Split Payment State
  const [splitCash, setSplitCash] = useState(0);

  const totalAmount = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]);
  
  // Ensure split values are valid relative to current total
  const validSplitCash = Math.min(Math.max(0, splitCash), totalAmount);
  const validSplitUPI = totalAmount - validSplitCash;

  // Initialize split when entering step 4 or changing total
  useEffect(() => {
    if (step === 4 && splitCash === 0 && totalAmount > 0) {
      setSplitCash(Math.floor(totalAmount / 2));
    }
  }, [step, totalAmount]);
  
  const serviceRoles = roles.filter(r => r.isServiceProvider);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 5));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const addToCart = (item: ServiceItem) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.id !== id));
  };

  const addManualItem = (name: string, price: number) => {
    const newItem: ServiceItem = {
      id: `custom-${Date.now()}`,
      name,
      price,
      category: 'Manual',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    };
    addToCart(newItem);
    setIsManualItemOpen(false);
  };

  const finalize = () => {
    const finalSplitDetails = paymentMethod === 'SPLIT' 
      ? { cash: validSplitCash, upi: validSplitUPI } 
      : undefined;

    onComplete({
      id: `TX-${Date.now().toString().slice(-6)}`,
      employeeIds: Object.values(selectedStaff).filter(Boolean),
      serviceIds: cart.flatMap(i => Array(i.qty).fill(i.id)),
      customer, 
      paymentMethod, 
      splitDetails: finalSplitDetails,
      totalAmount, 
      date: new Date().toISOString()
    });
    setStep(1); setSelectedStaff({}); setCart([]); setCustomer({name:'', phone:''}); setSplitCash(0);
    alert("Protocol Dispatched: Transaction Registered.");
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 relative">
      <div className="bg-slate-900/40 border-b border-white/5 py-4 md:py-8 shrink-0 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex justify-between px-4 md:px-16">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex flex-col items-center flex-1 relative">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-[1.25rem] flex items-center justify-center text-[10px] md:text-sm font-black border-2 transition-all duration-500 ${step === s ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : step > s ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg' : 'border-slate-800 text-slate-700 bg-slate-950'}`}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              <p className={`mt-1.5 md:mt-3 text-[6px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.3em] ${step === s ? 'text-emerald-400' : 'text-slate-700'}`}>
                {s === 1 ? 'Staff' : s === 2 ? 'Cart' : s === 3 ? 'Client' : s === 4 ? 'Pay' : 'Audit'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
        <div className="max-w-6xl mx-auto min-h-full">
          {step === 1 && (
            <div className="space-y-6 md:space-y-12 animate-in fade-in slide-in-from-bottom-4">
               <div className="text-center"><h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Assign Specialists</h2></div>
               {serviceRoles.map(role => {
                 const activeExperts = employees.filter(e => e.role === role.name && e.status === 'Active');
                 return (
                  <div key={role.id} className="space-y-4 md:space-y-6">
                      <div className="flex items-center gap-4 md:gap-6"><h3 className="text-[8px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{role.name} Domain</h3><div className="h-px bg-white/5 flex-1"></div></div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                        {activeExperts.map(emp => (
                          <button key={emp.id} onClick={() => setSelectedStaff({...selectedStaff, [role.id]: emp.id})} className={`p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 md:gap-4 ${selectedStaff[role.id] === emp.id ? 'border-emerald-500 bg-emerald-500/10 shadow-xl scale-105' : 'border-slate-800 bg-slate-900/30 hover:border-slate-600 active:scale-95'}`}>
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shadow-lg transition-all ${selectedStaff[role.id] === emp.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{emp.name[0]}</div>
                            <span className={`font-black text-xs md:text-sm transition-colors text-center truncate w-full ${selectedStaff[role.id] === emp.id ? 'text-emerald-400' : 'text-slate-300'}`}>{emp.name}</span>
                          </button>
                        ))}
                      </div>
                  </div>
                 )
               })}
            </div>
          )}
          
          {step === 2 && (
             <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 animate-in fade-in min-h-full pb-20 lg:pb-0">
                <div className="flex-1 flex flex-col gap-4 md:gap-6">
                   <button onClick={() => setIsManualItemOpen(true)} className="w-full py-3 md:py-4 border-2 border-dashed border-slate-700 rounded-xl md:rounded-[2rem] text-slate-500 font-black uppercase text-[10px] md:text-xs hover:border-emerald-500 hover:text-emerald-500 transition-all">+ Add Manual / Custom Item</button>
                   <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                      {services.map(s => {
                         const count = cart.find(i => i.id === s.id)?.qty || 0;
                         return (
                           <div key={s.id} onClick={() => addToCart(s)} className={`relative bg-slate-900/40 border-2 ${count > 0 ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-800'} p-3 md:p-4 rounded-2xl md:rounded-[2.5rem] flex items-center gap-3 md:gap-4 cursor-pointer hover:border-emerald-500 transition-all group shadow-xl active:scale-95`}>
                              <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden bg-slate-950 shrink-0"><img src={s.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" /></div>
                              <div className="flex-1 min-w-0"><h4 className="font-black text-white text-xs md:text-sm tracking-tight mb-1 truncate">{s.name}</h4><p className="text-emerald-400 font-black text-sm md:text-lg tracking-tighter">₹{s.price}</p></div>
                              {count > 0 && <div className="absolute -top-1 -right-1 md:top-2 md:right-2 bg-emerald-500 text-slate-950 font-black text-[8px] md:text-xs px-2 py-1 rounded-lg shadow-lg">x{count}</div>}
                           </div>
                         );
                      })}
                   </div>
                </div>
                <div className="w-full lg:w-[380px] xl:w-[420px] bg-slate-900 border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 flex flex-col shadow-3xl lg:sticky lg:top-0 lg:h-[calc(100vh-200px)]">
                   <h3 className="font-black text-white text-base md:text-xl mb-4 md:mb-8 flex items-center gap-2 md:gap-3"><ShoppingCart size={20} className="text-emerald-400" /> Cart Registry</h3>
                   <div className="flex-1 overflow-y-auto space-y-2 md:space-y-4 pr-1 md:pr-2 custom-scrollbar min-h-[150px]">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 text-slate-500 py-10"><Layers size={48} /><p className="font-black uppercase tracking-widest mt-4 text-xs">Empty</p></div>
                      ) : cart.map((i, idx) => (
                        <div key={idx} className="bg-slate-950 p-4 rounded-xl md:rounded-2xl border border-white/5 flex justify-between items-center group animate-in slide-in-from-right-4">
                           <div className="flex flex-col min-w-0 mr-2"><span className="text-xs font-black text-slate-300 truncate">{i.name}</span><span className="text-[10px] text-slate-500 font-bold">x{i.qty} @ ₹{i.price}</span></div>
                           <div className="flex items-center gap-2 md:gap-4 shrink-0"><span className="font-black text-white text-sm md:text-base">₹{i.price * i.qty}</span><button onClick={(e) => { e.stopPropagation(); removeFromCart(i.id); }} className="text-slate-600 hover:text-red-500"><Trash2 size={14} /></button></div>
                        </div>
                      ))}
                   </div>
                   <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t-2 md:border-t-4 border-double border-white/5 flex justify-between items-end"><span className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-1">Audit Sum</span><span className="text-2xl md:text-4xl font-black text-white tracking-tighter">₹{totalAmount}</span></div>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="max-w-xl mx-auto py-4 md:py-16 animate-in fade-in slide-in-from-bottom-4">
               <div className="bg-slate-900 border-2 border-slate-800 p-6 md:p-16 rounded-[2rem] md:rounded-[4rem] shadow-3xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                  <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter mb-8 md:mb-12 flex items-center gap-3 md:gap-4"><User size={24} className="text-emerald-400" /> Client Entry</h3>
                  <div className="space-y-6 md:space-y-10">
                    <div className="space-y-2 md:space-y-4"><label className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 block">Customer Name</label><input autoFocus value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-base md:text-xl font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="Name" /></div>
                    <div className="space-y-2 md:space-y-4"><label className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 block">Phone Number</label><input type="tel" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl text-white text-base md:text-xl font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" placeholder="00000-00000" /></div>
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-4xl mx-auto py-4 md:py-10 animate-in fade-in">
              <div className="text-center mb-8 md:mb-16"><h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">Settlement Protocol</h2></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8 mb-10">
                 {(['CASH', 'UPI', 'SPLIT'] as PaymentMethod[]).map(m => (
                   <button key={m} onClick={() => setPaymentMethod(m)} className={`p-6 md:p-16 rounded-2xl md:rounded-[4rem] border-2 flex flex-col items-center gap-4 md:gap-6 transition-all shadow-2xl ${paymentMethod === m ? 'border-emerald-500 bg-emerald-500/10 scale-105 shadow-emerald-500/10' : 'border-slate-800 text-slate-600 hover:border-slate-700 active:scale-95'}`}>
                      {m === 'CASH' && <Banknote size={32} className={`md:size-12 ${paymentMethod === m ? 'text-emerald-400' : ''}`} />}
                      {m === 'UPI' && <Smartphone size={32} className={`md:size-12 ${paymentMethod === m ? 'text-emerald-400' : ''}`} />}
                      {m === 'SPLIT' && <Split size={32} className={`md:size-12 ${paymentMethod === m ? 'text-emerald-400' : ''}`} />}
                      <span className="font-black uppercase text-[10px] md:text-sm tracking-widest">{m} Channel</span>
                   </button>
                 ))}
              </div>

              {paymentMethod === 'SPLIT' && (
                <div className="bg-slate-900/50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-dashed border-slate-700 animate-in slide-in-from-top-4 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Split size={16} /> Split Configuration</h3>
                      <div className="text-left md:text-right bg-slate-950/50 px-4 py-2 rounded-xl border border-white/5">
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Payable</p>
                         <p className="text-xl md:text-2xl font-black text-white tracking-tighter">₹{totalAmount}</p>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-3 block">Cash Portion</label>
                         <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold group-focus-within:text-emerald-500 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={validSplitCash} 
                              onChange={(e) => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val)) setSplitCash(val);
                                 else setSplitCash(0);
                              }}
                              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-10 md:pl-12 pr-6 text-white font-black text-lg md:text-2xl outline-none focus:border-emerald-500 transition-all shadow-inner"
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-3 block">UPI Portion</label>
                         <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold group-focus-within:text-indigo-400 transition-colors">₹</span>
                            <input 
                              type="number" 
                              value={validSplitUPI} 
                              onChange={(e) => {
                                 const val = parseFloat(e.target.value);
                                 if (!isNaN(val)) setSplitCash(totalAmount - val);
                                 else setSplitCash(totalAmount);
                              }}
                              className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-10 md:pl-12 pr-6 text-white font-black text-lg md:text-2xl outline-none focus:border-indigo-500 transition-all shadow-inner"
                            />
                         </div>
                      </div>
                   </div>

                   <div className="mt-8 md:mt-10">
                      <div className="h-3 md:h-4 bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                         <div style={{ width: `${totalAmount > 0 ? (validSplitCash / totalAmount) * 100 : 0}%` }} className="bg-emerald-500 h-full transition-all duration-500 relative"><div className="absolute inset-0 bg-white/20 animate-pulse"></div></div>
                         <div style={{ width: `${totalAmount > 0 ? (validSplitUPI / totalAmount) * 100 : 0}%` }} className="bg-indigo-500 h-full transition-all duration-500 relative"><div className="absolute inset-0 bg-black/10"></div></div>
                      </div>
                      <div className="flex justify-between mt-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                         <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {totalAmount > 0 ? (validSplitCash / totalAmount * 100).toFixed(0) : 0}% Cash</span>
                         <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> {totalAmount > 0 ? (validSplitUPI / totalAmount * 100).toFixed(0) : 0}% UPI</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="max-w-4xl mx-auto bg-white text-slate-950 p-6 md:p-20 rounded-[2rem] md:rounded-[4rem] shadow-3xl animate-in slide-in-from-bottom-8 flex flex-col md:flex-row min-h-auto overflow-hidden">
               <div className="md:w-1/2 bg-slate-950 text-white p-6 md:p-12 md:-m-20 md:mr-0 rounded-2xl md:rounded-none flex flex-col justify-between mb-6 md:mb-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl text-slate-950 mb-6 md:mb-0">R</div>
                  <div className="space-y-2 md:space-y-4 mb-6 md:mb-0">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">Master<br/>Audit</h2>
                    <p className="text-slate-600 font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.4em]">Protocol Cycle v.3</p>
                  </div>
                  <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-700">Stamp: {new Date().toLocaleDateString()}</div>
               </div>
               <div className="flex-1 md:p-12 flex flex-col justify-between">
                  <div className="space-y-6 md:space-y-8">
                     <div className="flex justify-between items-start border-b-2 md:border-b-4 border-slate-100 pb-6 md:pb-10">
                        <div className="min-w-0"><p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">Billing Record</p><h4 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight truncate">{customer.name || 'Anonymous Client'}</h4></div>
                        <div className="text-right shrink-0 ml-4">
                           <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase mb-1">Protocol</p>
                           {paymentMethod === 'SPLIT' ? (
                              <div className="flex flex-col items-end gap-1">
                                 <span className="inline-block bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">Cash: ₹{validSplitCash}</span>
                                 <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[8px] font-black uppercase">UPI: ₹{validSplitUPI}</span>
                              </div>
                           ) : (
                              <span className="inline-block bg-slate-950 text-white px-3 py-1 md:px-4 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase">{paymentMethod}</span>
                           )}
                        </div>
                     </div>
                     <div className="space-y-3 md:space-y-4">
                        {cart.map((i, idx) => (
                          <div key={idx} className="flex justify-between items-center font-bold text-slate-700 text-xs md:text-base">
                             <div className="flex items-center gap-2 md:gap-3 min-w-0"><span className="w-5 h-5 md:w-6 md:h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[8px] md:text-[10px] text-slate-500 shrink-0">x{i.qty}</span><span className="truncate">{i.name}</span></div>
                             <span className="text-slate-950 shrink-0 ml-2">₹{i.price * i.qty}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  <div className="pt-6 md:pt-10 border-t-4 md:border-t-8 border-double border-slate-100 flex justify-between items-end"><span className="text-[10px] md:text-lg font-black text-slate-400 uppercase tracking-widest mb-1">Net Balance</span><span className="text-3xl md:text-6xl font-black text-emerald-600 tracking-tighter">₹{totalAmount}</span></div>
               </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900/60 p-4 md:p-10 border-t border-white/5 flex justify-between items-center px-4 md:px-16 backdrop-blur-xl shrink-0">
         <button onClick={handleBack} disabled={step===1} className={`flex items-center gap-2 px-4 md:px-10 py-3 md:py-5 bg-slate-800 text-white rounded-xl md:rounded-[2rem] font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-slate-700 transition-all ${step===1 ? 'opacity-0 pointer-events-none' : ''}`}><ChevronLeft size={16} /> Back</button>
         {step < 5 ? (
           <button onClick={handleNext} disabled={(step===1 && Object.keys(selectedStaff).length === 0) || (step===2 && cart.length === 0) || (step===3 && !customer.name)} className="flex items-center gap-2 px-6 md:px-16 py-3 md:py-5 bg-emerald-500 text-slate-950 rounded-xl md:rounded-[2rem] font-black uppercase text-[10px] md:text-xs hover:bg-emerald-400 shadow-xl transition-all active:scale-95">Next <ChevronRight size={16} /></button>
         ) : (
           <button onClick={finalize} className="px-8 md:px-24 py-4 md:py-6 bg-indigo-600 text-white rounded-xl md:rounded-[2.5rem] font-black uppercase text-xs md:text-xl shadow-2xl animate-pulse hover:scale-105 transition-all">Finalize Dispatch</button>
         )}
      </div>

      {isManualItemOpen && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl md:rounded-[3rem] p-6 md:p-8">
              <h3 className="text-xl font-black text-white mb-6 text-center uppercase tracking-tighter">Manual Entry</h3>
              <input id="mName" placeholder="Item Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold mb-3 outline-none focus:border-emerald-500 placeholder:text-slate-800" />
              <input id="mPrice" type="number" placeholder="Price (₹)" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white font-bold mb-6 outline-none focus:border-emerald-500 placeholder:text-slate-800" />
              <div className="flex gap-3">
                 <button onClick={() => setIsManualItemOpen(false)} className="flex-1 py-3 bg-slate-800 rounded-lg font-bold uppercase text-[10px]">Cancel</button>
                 <button onClick={() => {
                    const name = (document.getElementById('mName') as HTMLInputElement).value;
                    const price = parseFloat((document.getElementById('mPrice') as HTMLInputElement).value);
                    if(name && price) addManualItem(name, price);
                 }} className="flex-1 py-3 bg-emerald-500 text-slate-900 rounded-lg font-bold uppercase text-[10px]">Add Item</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const InventoryView: React.FC<{ inventory: InventoryItem[], onUpdateInventory: (items: InventoryItem[]) => void }> = ({ inventory, onUpdateInventory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleUpdateLevel = (id: string, delta: number, isWastage: boolean = false) => {
    onUpdateInventory(inventory.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        const currentWastage = item.wastage || 0;
        return { 
          ...item, 
          quantity: newQty, 
          wastage: isWastage ? currentWastage + Math.abs(delta) : currentWastage 
        };
      }
      return item;
    }));
  };

  const handleDelete = (id: string) => {
    if(confirm("Confirm: Permanently erase this material from records?")) onUpdateInventory(inventory.filter(i => i.id !== id));
  };

  const handleSaveMetadata = (item: InventoryItem) => {
    onUpdateInventory(inventory.map(i => i.id === item.id ? item : i));
    setEditingItem(null);
  };

  const handleAddNew = (name: string, quantity: number, unit: Unit, category: string, minLevel: number) => {
    onUpdateInventory([...inventory, { id: `inv-${Date.now()}`, name, quantity, unit, category, wastage: 0, minLevel }]);
    setIsAdding(false);
  };

  const filteredItems = inventory.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-4 md:p-10 relative overflow-hidden">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4 md:gap-6 shrink-0">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3"><Package className="size-6 md:size-8 text-indigo-400" /> Stock Grid</h2>
            <p className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-1 md:mt-2">Real-time Material Surveillance</p>
          </div>
          <div className="flex gap-2 md:gap-4 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  value={searchTerm} 
                  onChange={e=>setSearchTerm(e.target.value)} 
                  placeholder="Scan Ledger..." 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-xs text-white font-bold focus:border-indigo-500 outline-none transition-all shadow-xl" 
                />
             </div>
             <button onClick={() => setIsAdding(true)} className="px-6 md:px-10 py-3 md:py-4 bg-emerald-500 text-slate-950 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-400 active:scale-95 transition-all">+ Register</button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredItems.map(item => (
              <MaterialCard 
                key={item.id} 
                item={item} 
                onDispatch={(amt: number) => handleUpdateLevel(item.id, -amt)}
                onRestock={(amt: number) => handleUpdateLevel(item.id, amt)}
                onWaste={(amt: number) => handleUpdateLevel(item.id, -amt, true)}
                onEdit={() => setEditingItem(item)}
              />
            ))}
          </div>
       </div>

       {(editingItem || isAdding) && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-3xl overflow-hidden">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                   <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{isAdding ? 'Registry Entry' : 'Update Metadata'}</h3>
                   <button onClick={() => { setEditingItem(null); setIsAdding(false); }} className="p-2 md:p-3 bg-slate-800 rounded-xl md:rounded-2xl text-slate-600 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                   <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Material Identity</label><input id="invName" defaultValue={editingItem?.name} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold outline-none" placeholder="e.g. Arabica Beans" /></div>
                   <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Category</label><input id="invCat" defaultValue={editingItem?.category} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold outline-none" placeholder="Supplies" /></div>
                      <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Unit</label><select id="invUnit" defaultValue={editingItem?.unit} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold appearance-none outline-none"><option value="kg">kg</option><option value="pcs">pcs</option><option value="ltr">ltr</option><option value="box">box</option></select></div>
                   </div>
                   <div className="grid grid-cols-2 gap-3 md:gap-4">
                     <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Qty</label><input id="invQty" type="number" defaultValue={editingItem?.quantity} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white font-black text-sm md:text-xl outline-none" placeholder="0" /></div>
                     <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4">Threshold</label><input id="invMin" type="number" defaultValue={editingItem?.minLevel} className="w-full bg-slate-950 border border-amber-500/30 rounded-xl md:rounded-3xl p-4 md:p-6 text-amber-400 font-black text-sm md:text-xl outline-none" placeholder="Min level" /></div>
                   </div>
                </div>

                <div className="mt-8 pt-6 md:pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                   {!isAdding && <button onClick={() => handleDelete(editingItem!.id)} className="w-full sm:w-auto p-4 md:p-5 bg-slate-800 text-slate-600 rounded-xl md:rounded-2xl hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>}
                   <button 
                    onClick={() => {
                      const name = (document.getElementById('invName') as HTMLInputElement).value;
                      const cat = (document.getElementById('invCat') as HTMLInputElement).value;
                      const unit = (document.getElementById('invUnit') as HTMLSelectElement).value as Unit;
                      const qty = parseFloat((document.getElementById('invQty') as HTMLInputElement).value) || 0;
                      const min = parseFloat((document.getElementById('invMin') as HTMLInputElement).value) || 0;
                      if(isAdding) {
                        handleAddNew(name, qty, unit, cat, min);
                      } else if(editingItem) {
                        handleSaveMetadata({ ...editingItem, name, category: cat, unit, quantity: qty, minLevel: min });
                      }
                    }} 
                    className="flex-1 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-transform"
                   >
                     Commit Protocol
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

const MaterialCard = ({ item, onDispatch, onRestock, onWaste, onEdit }: any) => {
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const isLowStock = item.quantity <= (item.minLevel || 0);

  return (
    <div className={`bg-slate-900/40 border-2 rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-8 flex flex-col gap-4 md:gap-6 relative overflow-hidden group transition-all shadow-xl ${isLowStock ? 'border-amber-500/40 bg-amber-500/5 shadow-amber-500/5' : 'border-white/5 hover:border-indigo-500/30'}`}>
       {isLowStock && (
         <div className="absolute top-0 left-0 w-full py-1.5 md:py-2 bg-amber-500 text-slate-950 flex items-center justify-center gap-2 animate-pulse z-10">
            <AlertTriangle size={12} className="fill-slate-950" />
            <span className="text-[7px] md:text-[10px] font-black uppercase tracking-widest">Low Stock Alert</span>
         </div>
       )}

       <div className={`flex justify-between items-start shrink-0 ${isLowStock ? 'mt-4 md:mt-6' : ''}`}>
          <div className="flex-1 overflow-hidden">
             <span className="inline-block px-2 py-0.5 bg-slate-800 rounded-md text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{item.category || 'General'}</span>
             <h3 className="text-white font-black text-sm md:text-xl tracking-tight leading-tight truncate pr-2">{item.name}</h3>
          </div>
          <button onClick={onEdit} className="p-2 md:p-3 bg-slate-950 rounded-xl md:rounded-2xl text-slate-600 hover:text-white transition-all border border-white/5"><Edit2 className="size-4 md:size-5" /></button>
       </div>

       <div className="grid grid-cols-2 gap-2 md:gap-3 shrink-0">
          <div className={`bg-slate-950/80 p-3 md:p-5 rounded-2xl md:rounded-[2rem] border relative overflow-hidden ${isLowStock ? 'border-amber-500/30' : 'border-white/5'}`}>
             <p className="text-[7px] md:text-[9px] font-black uppercase text-slate-600 tracking-widest mb-0.5">Stock</p>
             <div className={`text-xl md:text-3xl font-black tracking-tighter ${isLowStock ? 'text-amber-500' : 'text-emerald-400'}`}>{item.quantity}<span className="text-[8px] text-slate-700 ml-0.5 font-bold uppercase">{item.unit}</span></div>
          </div>
          <div className="bg-slate-950/80 p-3 md:p-5 rounded-2xl md:rounded-[2rem] border border-white/5">
             <p className="text-[7px] md:text-[9px] font-black uppercase text-slate-600 tracking-widest mb-0.5">Loss</p>
             <div className="text-xl md:text-2xl font-black text-rose-500 tracking-tighter">{item.wastage || 0}<span className="text-[8px] text-slate-700 ml-0.5 font-bold uppercase">{item.unit}</span></div>
          </div>
       </div>

       <div className="space-y-3 md:space-y-4 pt-1 shrink-0">
          <div className="flex items-center gap-2 md:gap-4 bg-slate-950 p-1 md:p-2 rounded-xl md:rounded-[2rem] border border-slate-800 transition-all shadow-inner">
             <button onClick={() => setAdjustmentValue(v => Math.max(0, v - 1))} className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 rounded-full flex items-center justify-center text-slate-400"><Minus size={14} /></button>
             <input 
              type="number" 
              value={adjustmentValue} 
              onChange={e => setAdjustmentValue(parseFloat(e.target.value) || 0)}
              className="flex-1 bg-transparent text-center text-sm md:text-xl font-black text-white outline-none"
             />
             <button onClick={() => setAdjustmentValue(v => v + 1)} className="w-8 h-8 md:w-12 md:h-12 bg-slate-900 rounded-full flex items-center justify-center text-slate-400"><Plus size={14} /></button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
               <button 
                onClick={() => { onRestock(adjustmentValue); setAdjustmentValue(0); }} 
                className="py-3 md:py-4 bg-emerald-600/10 border border-emerald-600/20 rounded-xl md:rounded-2xl text-emerald-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest flex items-center justify-center gap-1.5 active:scale-95"
               >
                 <Plus size={10} /> Stock
               </button>
               <button 
                onClick={() => { onDispatch(adjustmentValue); setAdjustmentValue(0); }} 
                className="py-3 md:py-4 bg-slate-800/50 border border-white/5 rounded-xl md:rounded-2xl text-slate-400 font-black uppercase text-[8px] md:text-[10px] tracking-widest flex items-center justify-center gap-1.5 active:scale-95"
               >
                 <ChevronRight size={10} /> Use
               </button>
            </div>
            <button 
              onClick={() => { onWaste(adjustmentValue); setAdjustmentValue(0); }} 
              className="w-full py-3 md:py-4 bg-rose-500/10 border border-rose-500/20 rounded-xl md:rounded-2xl text-rose-500 font-black uppercase text-[8px] md:text-[10px] tracking-widest flex items-center justify-center gap-1.5 active:scale-95"
            >
              <AlertTriangle size={10} /> Mark Loss
            </button>
          </div>
       </div>
    </div>
  );
};

const CatalogView: React.FC<{ services: ServiceItem[], onUpdateServices: (items: ServiceItem[]) => void }> = ({ services, onUpdateServices }) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (item: ServiceItem) => {
    const exists = services.find(s => s.id === item.id);
    if(exists) {
       onUpdateServices(services.map(s => s.id === item.id ? item : s));
    } else {
       onUpdateServices([...services, item]);
    }
    setEditingService(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if(confirm("Delete this service from catalog?")) onUpdateServices(services.filter(s => s.id !== id));
    setEditingService(null);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-12 relative overflow-hidden">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Service Catalog</h2>
          <button onClick={() => { setIsAdding(true); setEditingService({ id: `srv-${Date.now()}`, name: '', price: 0, category: '', image: '' }); }} className="w-full sm:w-auto px-6 md:px-8 py-3 bg-emerald-500 text-slate-900 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-lg active:scale-95 transition-transform">+ Add Service</button>
       </div>
       
       <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 md:pr-2">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-8 pb-10">
            {services.map(s => (
              <div key={s.id} onClick={() => setEditingService(s)} className="bg-slate-900 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden group hover:border-indigo-500 transition-all shadow-xl cursor-pointer relative active:scale-95">
                <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-slate-900/80 p-1.5 md:p-2 rounded-lg md:rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg"><Edit2 className="size-4 md:size-5" /></div>
                <div className="h-28 md:h-44 overflow-hidden relative border-b border-white/5 bg-slate-800">
                  <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-4 md:p-8">
                   <h4 className="text-white font-black text-xs md:text-xl tracking-tight leading-none mb-1 md:mb-2 truncate">{s.name}</h4>
                   <p className="text-[7px] md:text-[10px] text-slate-600 font-bold uppercase tracking-widest truncate">{s.category}</p>
                   <p className="text-lg md:text-3xl font-black text-emerald-400 mt-2 md:mt-6 tracking-tighter">₹{s.price}</p>
                </div>
              </div>
            ))}
          </div>
       </div>

       {(editingService || isAdding) && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
             <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl md:rounded-[3rem] p-6 md:p-10 shadow-3xl overflow-hidden">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                   <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{isAdding ? 'New Record' : 'Edit Record'}</h3>
                   <button onClick={() => { setEditingService(null); setIsAdding(false); }} className="p-2 md:p-3 bg-slate-800 rounded-xl md:rounded-2xl text-slate-500 hover:text-white transition-colors"><X className="size-6" /></button>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                   <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase block ml-4">Service Name</label><input id="sName" defaultValue={editingService?.name} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-white text-sm md:text-base font-bold outline-none" placeholder="e.g. Haircut" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase block ml-4">Category</label><input id="sCat" defaultValue={editingService?.category} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-white text-sm md:text-base font-bold outline-none" placeholder="e.g. Grooming" /></div>
                      <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase block ml-4">Price (₹)</label><input id="sPrice" type="number" defaultValue={editingService?.price} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-white text-sm md:text-base font-bold outline-none" placeholder="0" /></div>
                   </div>
                   <div className="space-y-1.5 md:space-y-2"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase block ml-4">Image Resource (URL)</label><div className="flex gap-2"><div className="bg-slate-950 border border-slate-800 p-3 md:p-4 rounded-xl md:rounded-2xl text-slate-600 shrink-0"><ImageIcon className="size-5" /></div><input id="sImg" defaultValue={editingService?.image} className="flex-1 bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-white text-[9px] md:text-xs font-mono outline-none" placeholder="https://..." /></div></div>
                </div>

                <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                   {!isAdding && <button onClick={() => handleDelete(editingService!.id)} className="w-full sm:w-auto p-4 md:p-5 bg-slate-800 text-slate-500 rounded-xl md:rounded-[2rem] hover:text-rose-500 transition-all border border-white/5 active:scale-90"><Trash2 className="size-5" /></button>}
                   <button onClick={() => {
                      const name = (document.getElementById('sName') as HTMLInputElement).value;
                      const cat = (document.getElementById('sCat') as HTMLInputElement).value;
                      const price = parseFloat((document.getElementById('sPrice') as HTMLInputElement).value);
                      const img = (document.getElementById('sImg') as HTMLInputElement).value;
                      if(name && price) handleSave({ id: editingService?.id || '', name, category: cat, price, image: img || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600' });
                   }} className="flex-1 py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-[2rem] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">Commit Record</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};