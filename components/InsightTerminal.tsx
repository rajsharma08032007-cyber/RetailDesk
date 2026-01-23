import React, { useState } from 'react';
import { BusinessProfile, Employee, Transaction, Role, ServiceItem, PaymentMethod } from '../types.ts';
import { Dashboard } from './Dashboard.tsx';
import { Lock, UserPlus, Briefcase, Trash2, X, Search, Calendar, Filter, FileText, User, Eye, Edit3, CheckCircle2, XCircle, MoreVertical, Smartphone, Clock, Award } from 'lucide-react';
import { AIChatOverlay } from './AIChatOverlay.tsx';

export type InsightView = 'Data Analyst' | 'Employment' | 'Transaction';

interface InsightTerminalProps {
  profile: BusinessProfile;
  view: InsightView;
  sharedTransactions: Transaction[];
  sharedEmployees: Employee[];
  sharedRoles: Role[];
  setEmployees: (e: Employee[]) => void;
  setRoles: (r: Role[]) => void;
  services: ServiceItem[];
}

export const InsightTerminal: React.FC<InsightTerminalProps> = ({ profile, view, sharedTransactions, sharedEmployees, sharedRoles, setEmployees, setRoles, services }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  if (!isAuthenticated) return (
    <div className="h-full flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 shadow-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-500 mx-auto mb-6 md:mb-10"><Lock size={32} /></div>
          <h2 className="text-xl md:text-3xl font-black text-white uppercase mb-8 md:mb-12 tracking-tighter">Terminal Locked</h2>
          <input 
            autoFocus 
            type="password" 
            value={password} 
            onChange={e => { if(e.target.value === 'Manager@2026') setIsAuthenticated(true); setPassword(e.target.value); }} 
            className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[2rem] p-4 md:p-6 text-center text-white text-xl md:text-2xl font-black mb-6 md:mb-8 focus:border-emerald-500 outline-none transition-all" 
            placeholder="PIN ACCESS" 
          />
          <p className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] leading-relaxed">Manager Credentials Required</p>
       </div>
    </div>
  );

  return (
    <div className="h-full bg-slate-950 text-slate-200 overflow-hidden relative">
      {view === 'Data Analyst' && (
        <Dashboard 
          profile={profile} 
          transactions={sharedTransactions} 
          employees={sharedEmployees} 
          roles={sharedRoles} 
          services={services} 
        />
      )}
      {view === 'Employment' && <EmploymentView employees={sharedEmployees} setEmployees={setEmployees} roles={sharedRoles} setRoles={setRoles} transactions={sharedTransactions} />}
      {view === 'Transaction' && <TransactionView transactions={sharedTransactions} employees={sharedEmployees} services={services} />}
      <AIChatOverlay contextData={`Sector: ${profile.sector}, Business: ${profile.companyName}`} />
    </div>
  );
};

const EmploymentView = ({ employees, setEmployees, roles, setRoles, transactions }: any) => {
  const [isHireOpen, setIsHireOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getServedCount = (empId: string) => {
    return transactions.filter((tx: Transaction) => tx.employeeIds.includes(empId)).length;
  };

  const addRole = (name: string, isServiceProvider: boolean) => {
    setRoles([...roles, { id: Date.now().toString(), name, isServiceProvider }]);
  };

  const deleteRole = (id: string) => {
    if(confirm("Deleting this post will remove system logic for this domain. Proceed?")) 
      setRoles(roles.filter((r:any) => r.id !== id));
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map((e: Employee) => e.id === id ? { ...e, ...updates } : e));
    setEditingEmp(null);
  };

  const deleteEmployee = (id: string) => {
    if(confirm("Permanently erase this employee record?")) {
      setEmployees(employees.filter((e: Employee) => e.id !== id));
    }
  };

  const ResourceCategory = ({ title, subTitle, accent, rolesList }: { title: string, subTitle: string, accent: string, rolesList: Role[] }) => {
    const isSpecialist = subTitle === 'Wizard Active';

    return (
      <div className="bg-slate-900/30 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] p-4 md:p-10 shadow-2xl relative overflow-hidden mb-6 md:mb-12">
        <div className={`absolute top-0 left-0 w-1 md:w-2 h-full ${accent}`}></div>
        <div className="mb-4 md:mb-8 pl-2 md:pl-4">
           <h3 className="text-sm md:text-xl font-black text-white uppercase flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
             {title} 
             <span className={`text-[7px] md:text-[9px] w-max px-2 md:px-3 py-1 rounded-lg uppercase tracking-widest border ${isSpecialist ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-white/5'}`}>
               {subTitle}
             </span>
           </h3>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[500px] md:min-w-[700px]">
            <thead className="border-b border-white/5">
              <tr className="text-[7px] md:text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                <th className="px-3 md:px-6 py-3 md:py-4 text-center">ID</th>
                <th className="px-3 md:px-6 py-3 md:py-4">Identity</th>
                <th className="px-3 md:px-6 py-3 md:py-4">Salary</th>
                {isSpecialist && <th className="px-3 md:px-6 py-3 md:py-4">Orders</th>}
                <th className="px-3 md:px-6 py-3 md:py-4">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rolesList.map(role => {
                const roleEmps = employees.filter((e: Employee) => e.role === role.name);
                if (roleEmps.length === 0) return null;

                return (
                  <React.Fragment key={role.id}>
                    <tr className="bg-slate-950/40">
                      <td colSpan={isSpecialist ? 5 : 4} className="px-3 md:px-6 py-2 md:py-3">
                         <h4 className="text-[7px] md:text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{role.name} Domain</h4>
                      </td>
                    </tr>
                    {roleEmps.map((e: Employee) => (
                      <tr key={e.id} className="hover:bg-indigo-500/5 transition-all group">
                        <td className="px-3 md:px-6 py-3 md:py-5">
                          <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-500 text-[9px] md:text-xs mx-auto">
                            {getInitials(e.name)}
                          </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-5">
                           <div>
                             <p className="font-bold text-slate-200 text-xs md:text-sm leading-none mb-1">{e.name}</p>
                             <p className="text-[7px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest">{role.name}</p>
                           </div>
                        </td>
                        <td className="px-3 md:px-6 py-3 md:py-5">
                          <span className="font-mono text-emerald-500 font-black text-[11px] md:text-lg">₹{e.salary.toLocaleString()}</span>
                        </td>
                        {isSpecialist && (
                          <td className="px-3 md:px-6 py-3 md:py-5">
                            <div className="flex items-center gap-1 md:gap-2">
                               <span className="font-black text-white text-xs md:text-lg tracking-tighter">{getServedCount(e.id)}</span>
                               <span className="text-[6px] md:text-[8px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Units</span>
                            </div>
                          </td>
                        )}
                        <td className="px-3 md:px-6 py-3 md:py-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {e.status === 'Active' ? 
                                <span className="flex items-center gap-1.5 text-[7px] md:text-[9px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 md:px-3 py-1 rounded-full"><div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Active</span> :
                                <span className="flex items-center gap-1.5 text-[7px] md:text-[9px] font-black text-slate-600 uppercase bg-slate-800 px-2 md:px-3 py-1 rounded-full"><div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-slate-600"></div> Leave</span>
                              }
                            </div>
                            <div className="flex items-center gap-1 md:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => setEditingEmp(e)} className="p-1.5 md:p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"><Edit3 size={14} /></button>
                               <button onClick={() => deleteEmployee(e.id)} className="p-1.5 md:p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-12 h-full flex flex-col overflow-y-auto custom-scrollbar">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12 shrink-0 gap-4">
          <div>
            <h2 className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">Resource Core</h2>
            <p className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-2 md:mt-3">Staffing Hierarchy & Performance Ledger</p>
          </div>
          <div className="flex gap-2 md:gap-4 w-full md:w-auto">
             <button onClick={() => setIsRoleOpen(true)} className="flex-1 md:flex-none px-4 md:px-8 py-3 md:py-4 bg-slate-800 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 hover:bg-slate-700 transition-all border border-white/5"><Briefcase className="size-4 md:size-5" /> Posts</button>
             <button onClick={() => setIsHireOpen(true)} className="flex-1 md:flex-none px-4 md:px-10 py-3 md:py-4 bg-indigo-600 rounded-xl md:rounded-2xl font-black uppercase text-[8px] md:text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 md:gap-3 hover:bg-indigo-500 shadow-xl transition-all"><UserPlus className="size-4 md:size-5" /> Recruit</button>
          </div>
       </div>

       <div className="flex-1 pb-20">
          <ResourceCategory 
            title="Front-End Specialists" 
            subTitle="Wizard Active" 
            accent="bg-emerald-500/40" 
            rolesList={roles.filter((r: Role) => r.isServiceProvider)} 
          />
          <ResourceCategory 
            title="Administrative / Support" 
            subTitle="Back-Office" 
            accent="bg-slate-700/40" 
            rolesList={roles.filter((r: Role) => !r.isServiceProvider)} 
          />
       </div>

       {/* Edit Employee Modal */}
       {editingEmp && (
         <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-3xl overflow-hidden relative">
               <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><User className="size-[150px] md:size-[200px]" /></div>
               <div className="flex justify-between items-center mb-6 md:mb-10 relative z-10">
                  <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter">Edit Record</h3>
                  <button onClick={() => setEditingEmp(null)} className="p-2 md:p-3 bg-slate-800 rounded-xl md:rounded-2xl text-slate-600 hover:text-white transition-colors"><X size={18} /></button>
               </div>
               <div className="space-y-4 md:space-y-6 relative z-10">
                  <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block">Full Name</label><input id="ename" defaultValue={editingEmp.name} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold outline-none focus:border-indigo-500" /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block">Designation</label><select id="erole" defaultValue={editingEmp.role} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold appearance-none outline-none">{roles.map((r:any)=><option key={r.id} value={r.name}>{r.name}</option>)}</select></div>
                     <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block">Salary (₹)</label><input id="esal" type="number" defaultValue={editingEmp.salary} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white font-black text-base md:text-xl outline-none focus:border-indigo-500" /></div>
                  </div>
                  <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 block">Deployment Status</label><select id="estatus" defaultValue={editingEmp.status} className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-3xl p-4 md:p-6 text-white text-sm md:text-base font-bold appearance-none outline-none"><option value="Active">Active Duty</option><option value="Inactive">On Leave</option></select></div>
               </div>
               <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 md:gap-4 relative z-10">
                  <button onClick={() => setEditingEmp(null)} className="flex-1 py-4 bg-slate-800 rounded-xl md:rounded-3xl font-black uppercase text-[8px] md:text-[10px] tracking-widest text-slate-400">Abort</button>
                  <button onClick={() => {
                    const name = (document.getElementById('ename') as HTMLInputElement).value;
                    const role = (document.getElementById('erole') as HTMLSelectElement).value;
                    const salary = parseInt((document.getElementById('esal') as HTMLInputElement).value);
                    const status = (document.getElementById('estatus') as HTMLSelectElement).value as any;
                    updateEmployee(editingEmp.id, { name, role, salary, status });
                  }} className="flex-1 py-4 bg-indigo-600 rounded-xl md:rounded-3xl font-black uppercase text-[8px] md:text-[10px] tracking-widest text-white shadow-2xl shadow-indigo-500/20">Commit Protocol</button>
               </div>
            </div>
         </div>
       )}

       {/* Post Manager Modal */}
       {isRoleOpen && (
          <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 flex flex-col max-h-[90vh] shadow-3xl overflow-hidden">
                <div className="flex justify-between items-center mb-6 md:mb-10 shrink-0">
                   <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">Post Manager</h3>
                   <button onClick={() => setIsRoleOpen(false)} className="p-2 md:p-3 bg-slate-800 rounded-xl md:rounded-2xl text-slate-600 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                   {roles.map((r:any) => (
                     <div key={r.id} className="bg-slate-950 p-4 md:p-5 rounded-2xl md:rounded-[2.5rem] flex justify-between items-center border border-white/5 group transition-all hover:border-indigo-500/30">
                        <div className="min-w-0 pr-2">
                          <p className="font-black text-white text-sm md:text-lg tracking-tight leading-none truncate">{r.name}</p>
                          <p className="text-[7px] md:text-[9px] font-black uppercase mt-1.5 tracking-widest">{r.isServiceProvider ? <span className="text-emerald-500">Wizard Visible</span> : <span className="text-slate-600">Administrative</span>}</p>
                        </div>
                        <button onClick={() => deleteRole(r.id)} className="p-2 md:p-3 text-slate-800 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0"><Trash2 size={16} /></button>
                     </div>
                   ))}
                </div>
                <div className="mt-6 md:mt-8 pt-6 border-t border-slate-800 shrink-0">
                   <h4 className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Create Designation</h4>
                   <div className="flex flex-col gap-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input id="newRoleName" type="text" placeholder="e.g. Lead Tech" className="flex-1 bg-slate-950 border border-slate-800 rounded-xl md:rounded-2xl p-4 text-white font-black text-sm outline-none focus:border-indigo-500 placeholder:text-slate-800" />
                        <div className="flex items-center justify-between px-5 bg-slate-950 rounded-xl md:rounded-2xl border border-slate-800 h-14 sm:w-48 shrink-0">
                           <span className="text-[8px] md:text-[10px] font-black uppercase text-slate-600 tracking-widest">Wizard?</span>
                           <input id="newRoleService" type="checkbox" className="w-5 h-5 rounded-lg accent-emerald-500" />
                        </div>
                      </div>
                      <button onClick={() => {
                        const nameEl = document.getElementById('newRoleName') as HTMLInputElement;
                        const serviceEl = document.getElementById('newRoleService') as HTMLInputElement;
                        if(nameEl.value) {
                          addRole(nameEl.value, serviceEl.checked);
                          nameEl.value = '';
                          serviceEl.checked = false;
                        }
                      }} className="w-full py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform">Commit Post</button>
                   </div>
                </div>
             </div>
          </div>
       )}

       {/* Recruitment Modal */}
       {isHireOpen && (
          <div className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in">
             <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 shadow-3xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <h3 className="text-xl md:text-2xl font-black text-white mb-6 md:mb-10 uppercase tracking-tighter text-center">Staff Recruitment</h3>
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                   <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 block">Legal Full Name</label><input id="hname" className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[2rem] p-4 md:p-5 text-white text-sm md:text-base font-bold outline-none focus:border-indigo-500 placeholder:text-slate-800" placeholder="e.g. Sarah Miller" /></div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                      <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 block">Designation</label><select id="hrole" className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[2rem] p-4 md:p-5 text-white text-sm font-bold appearance-none outline-none">{roles.map((r:any)=><option key={r.id} value={r.name}>{r.name}</option>)}</select></div>
                      <div className="space-y-1.5"><label className="text-[8px] md:text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 block">Salary (₹)</label><input id="hsal" type="number" className="w-full bg-slate-950 border border-slate-800 rounded-xl md:rounded-[2rem] p-4 md:p-5 text-white font-black text-sm outline-none focus:border-indigo-500" placeholder="15000" /></div>
                   </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                   <button onClick={()=>setIsHireOpen(false)} className="order-2 sm:order-1 flex-1 py-4 bg-slate-800 text-slate-500 rounded-xl md:rounded-2xl font-black uppercase tracking-widest">Cancel</button>
                   <button onClick={()=>{
                     const name = (document.getElementById('hname') as HTMLInputElement).value;
                     const role = (document.getElementById('hrole') as HTMLSelectElement).value;
                     const salary = (document.getElementById('hsal') as HTMLInputElement).value;
                     if(name && role && salary) {
                       setEmployees([...employees, {id: Date.now().toString(), name, role, salary: parseInt(salary), status: 'Active', joinedDate: new Date().toISOString()}]);
                       setIsHireOpen(false);
                     }
                   }} className="order-1 sm:order-2 flex-1 py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform">Register</button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

const TransactionView = ({ transactions, employees, services }: { transactions: Transaction[], employees: Employee[], services: ServiceItem[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterPayment, setFilterPayment] = useState<PaymentMethod | 'ALL'>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => {
     const matchesSearch = t.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
     const matchesPayment = filterPayment === 'ALL' || t.paymentMethod === filterPayment;
     const matchesDate = !filterDate || t.date.startsWith(filterDate);
     return matchesSearch && matchesPayment && matchesDate;
  });

  return (
    <div className="p-3 md:p-8 h-full flex flex-col relative">
       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-5 md:mb-10 shrink-0 gap-4">
          <div>
            <h2 className="text-xl md:text-4xl font-black text-white tracking-tighter uppercase leading-none">Finance Ledger</h2>
            <p className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] mt-1 md:mt-3">Immutable Audit History</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full lg:w-auto items-stretch sm:items-center">
             <div className="relative group flex-1 sm:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input 
                  value={searchTerm} 
                  onChange={e=>setSearchTerm(e.target.value)} 
                  placeholder="Search..." 
                  className="w-full sm:w-[200px] lg:w-[280px] bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs text-white font-bold focus:border-indigo-500 outline-none shadow-lg transition-all" 
                />
             </div>

             <div className="flex gap-2 flex-1 sm:flex-none">
               <div className="relative group flex-1">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <select 
                    value={filterPayment}
                    onChange={(e) => setFilterPayment(e.target.value as PaymentMethod | 'ALL')}
                    className="w-full sm:w-32 bg-slate-900 border border-slate-800 rounded-xl py-3 pl-9 pr-2 text-[9px] font-bold text-white uppercase tracking-wide focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="ALL">All</option>
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="SPLIT">Split</option>
                  </select>
               </div>

               <div className="relative group flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-9 pr-2 text-[9px] font-bold text-white uppercase tracking-wide focus:border-indigo-500 outline-none"
                  />
               </div>
             </div>
          </div>
       </div>

       <div className="flex-1 bg-slate-900/50 border border-white/5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden flex flex-col shadow-3xl relative">
          <div className="overflow-auto custom-scrollbar flex-1">
             <table className="w-full text-left text-xs md:text-sm min-w-[700px] md:min-w-[900px]">
                <thead className="bg-slate-950/80 text-slate-600 uppercase font-black sticky top-0 z-10 backdrop-blur-xl border-b border-white/5">
                   <tr>
                     <th className="px-6 md:px-12 py-4 md:py-6">Customer</th>
                     <th className="px-6 md:px-12 py-4 md:py-6">Audit ID</th>
                     <th className="px-6 md:px-12 py-4 md:py-6">Protocol</th>
                     <th className="px-6 md:px-12 py-4 md:py-6">Settled</th>
                     <th className="px-6 md:px-12 py-4 md:py-6 text-right">Timestamp</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                   {filteredTransactions.map((tx:any) => (
                     <tr 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="hover:bg-indigo-500/5 transition-all group cursor-pointer active:bg-indigo-500/10"
                     >
                        <td className="px-6 md:px-12 py-4 md:py-6 group-hover:text-indigo-400 transition-colors">
                           <div className="flex flex-col">
                              <span className="font-black text-white text-sm md:text-lg">{tx.customer.name}</span>
                              <span className="text-[7px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest">{tx.customer.phone}</span>
                           </div>
                        </td>
                        <td className="px-6 md:px-12 py-4 md:py-6 font-mono text-slate-600 text-[9px] md:text-xs tracking-widest uppercase">{tx.id}</td>
                        <td className="px-6 md:px-12 py-4 md:py-6"><span className="px-2.5 md:px-3 py-1 rounded-md text-[7px] md:text-[9px] font-black uppercase tracking-widest border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">{tx.paymentMethod}</span></td>
                        <td className="px-6 md:px-12 py-4 md:py-6 font-black text-xl md:text-2xl text-emerald-500 tracking-tighter">₹{tx.totalAmount}</td>
                        <td className="px-6 md:px-12 py-4 md:py-6 text-right text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest leading-relaxed">
                          <div>{new Date(tx.date).toLocaleDateString()}</div>
                          <div>{new Date(tx.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {selectedTx && (
         <div 
            className="fixed inset-0 z-[500] flex items-center justify-center p-3 md:p-12 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelectedTx(null)}
         >
            <div 
              className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[1.5rem] md:rounded-[3rem] shadow-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-4"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="bg-slate-950 p-5 md:p-8 flex justify-between items-start border-b border-slate-800 shrink-0">
                  <div>
                    <h3 className="text-lg md:text-3xl font-black text-white tracking-tighter uppercase mb-1 md:mb-2">Audit Inspector</h3>
                    <div className="flex flex-wrap gap-2 md:gap-4 text-[7px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">
                       <span className="font-mono text-indigo-400">ID: {selectedTx.id}</span>
                       <span className="hidden xs:inline text-slate-800">|</span>
                       <span className="flex items-center gap-1"><Clock size={10} /> {new Date(selectedTx.date).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTx(null)} className="p-2 bg-slate-900 rounded-xl text-slate-500 hover:text-white transition-all border border-slate-800"><X size={16} /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 space-y-6 md:space-y-8 bg-slate-900">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 bg-slate-950 rounded-2xl border border-white/5">
                     <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0"><User size={20} /></div>
                     <div className="flex-1 min-w-0">
                        <div className="text-[7px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Client Identity</div>
                        <div className="text-base md:text-xl font-black text-white truncate">{selectedTx.customer.name}</div>
                        <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-600 mt-0.5"><Smartphone size={10} /> {selectedTx.customer.phone}</div>
                     </div>
                     <div className="sm:text-right border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                        <div className="text-[7px] md:text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Settlement</div>
                        <div className="inline-block px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[8px] md:text-[10px] uppercase tracking-widest">{selectedTx.paymentMethod}</div>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[7px] md:text-[9px] font-black uppercase text-slate-600 tracking-[0.3em] mb-3 ml-2">Staff Allocation</h4>
                     <div className="flex flex-wrap gap-2">
                        {selectedTx.employeeIds.map(eid => {
                           const emp = employees.find(e => e.id === eid);
                           return (
                              <div key={eid} className="px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center gap-2">
                                 <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[7px] font-black uppercase">{emp?.name[0]}</div>
                                 <div className="flex flex-col">
                                    <span className="text-[10px] md:text-xs font-bold text-slate-300 leading-none">{emp?.name}</span>
                                    <span className="text-[6px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{emp?.role}</span>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>

                  <div>
                     <h4 className="text-[7px] md:text-[9px] font-black uppercase text-slate-600 tracking-[0.3em] mb-3 ml-2">Protocol Audit</h4>
                     <div className="bg-slate-950 rounded-2xl border border-white/5 overflow-hidden">
                        {selectedTx.serviceIds.map((sid, idx) => {
                           const srv = services.find(s => s.id === sid);
                           return (
                              <div key={idx} className="p-4 border-b border-white/5 last:border-0 flex justify-between items-center group transition-colors hover:bg-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-slate-900 rounded-lg text-slate-600"><FileText size={12} /></div>
                                    <div className="flex flex-col">
                                       <span className="font-bold text-slate-200 text-xs md:text-sm">{srv?.name}</span>
                                       <span className="text-[7px] md:text-[9px] text-slate-600 font-black uppercase tracking-widest">{srv?.category}</span>
                                    </div>
                                 </div>
                                 <span className="font-mono text-emerald-500 font-bold text-xs md:text-base">₹{srv?.price}</span>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>

               <div className="p-5 md:p-8 bg-slate-950 border-t border-slate-800 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0">
                     <div className="order-2 sm:order-1">
                        <div className="text-[7px] md:text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Protocol Registry</div>
                        <div className="text-[8px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Encrypted Ledger v.4.2</div>
                     </div>
                     <div className="sm:text-right order-1 sm:order-2">
                        <div className="text-[8px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest mb-0.5 md:mb-1">Settled Net Sum</div>
                        <div className="text-3xl md:text-5xl font-black text-emerald-500 tracking-tighter">₹{selectedTx.totalAmount}</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};