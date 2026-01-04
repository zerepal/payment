
import './App.css'

import  { useState, useEffect, useMemo } from 'react';
import { Transaction, UserSettings } from '../types';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionList } from '../components/TransactionList';
import { SettingsView } from '../components/SettingsView';
import { TransactionDetailView } from '../components/TransactionDetailView';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from 'recharts';
import { 
  Wallet, 
  Globe, 
  BarChart3, 
  Sparkles, 
  TrendingUp,
  RefreshCw,
  Settings as SettingsIcon,
  LayoutDashboard,
  DollarSign,
  ReceiptText
} from 'lucide-react';

const DEFAULT_SETTINGS: UserSettings = {
  defaultCurrencyCode: 'CLP',
  defaultLocalToUSDRate: 900,
  homeCurrencyName: 'SOL',
  homeCurrencySymbol: '$',
  defaultUSDToHomeRate: 3.38,
  bankCommission: 1.5
};

type AppTab = 'dashboard' | 'details' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('global_pay_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('global_pay_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [insights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    localStorage.setItem('global_pay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('global_pay_settings', JSON.stringify(settings));
  }, [settings]);

  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleGetInsights = async () => {
    setLoadingInsights(true);
   // const result = await getSpendingInsights(transactions);
    //setInsights(result);
    setLoadingInsights(false);
  };

  const summary = useMemo(() => {
    return transactions.reduce((acc, curr) => ({
      usd: acc.usd + curr.usdAmount,
      home: acc.home + curr.homeAmount,
    }), { usd: 0, home: 0 });
  }, [transactions]);

  const chartData = useMemo(() => {
    return [...transactions].reverse().slice(-10).map(t => ({
      name: t.description.length > 8 ? t.description.substring(0, 8) + '...' : t.description,
      amount: t.homeAmount,
      usd: t.usdAmount
    }));
  }, [transactions]);

  

  return (
    <>
     <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Globe className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">GlobalPay <span className="text-indigo-600">Manager</span></h1>
          </div>
          
          <nav className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden xs:inline">Gastos</span>
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'details' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ReceiptText className="w-4 h-4" />
              <span className="hidden xs:inline">Detalles</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <SettingsIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Ajustes</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'settings' && (
          <SettingsView settings={settings} onSave={setSettings} />
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-slate-800">Desglose Individual de Gastos</h2>
              <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl font-bold text-sm">
                {transactions.length} Registros
              </div>
            </div>
            <TransactionDetailView 
              transactions={transactions} 
              settings={settings} 
              onDelete={deleteTransaction} 
            />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Totals Section */}
              <div className="space-y-4">
                <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <Wallet className="w-32 h-32" />
                  </div>
                  <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Total en {settings.homeCurrencyName}</span>
                  <div className="mt-2 flex flex-col">
                    <span className="text-3xl font-black">
                      {settings.homeCurrencySymbol}{summary.home.toFixed(2)}
                    </span>
                    <div className="mt-4 flex items-center gap-2 bg-indigo-500/30 w-fit px-3 py-1 rounded-full text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>Inc. Comisión {settings.bankCommission}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Acumulado USD</span>
                    <p className="text-xl font-bold text-slate-800">${summary.usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-slate-100" />
                </div>
              </div>

              {/* Form */}
              <TransactionForm onAdd={addTransaction} settings={settings} />

              {/* AI Insights */}
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden border-l-4 border-l-indigo-600">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-700">
                      <Sparkles className="w-5 h-5" />
                      <h3 className="font-bold">Análisis Inteligente</h3>
                    </div>
                    <button 
                      onClick={handleGetInsights}
                      disabled={loadingInsights || transactions.length === 0}
                      className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed min-h-[80px]">
                    {loadingInsights ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 animate-pulse rounded w-full" />
                        <div className="h-3 bg-slate-100 animate-pulse rounded w-4/5" />
                      </div>
                    ) : insights ? (
                      <div className="prose prose-sm text-slate-600 italic">
                        {insights}
                      </div>
                    ) : (
                      <p className="text-slate-400">Pulsa el botón para analizar tus gastos con AI.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-8 space-y-8">
              {transactions.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-lg font-bold text-slate-900">Últimos Gastos ({settings.homeCurrencyName})</h2>
                    </div>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                          cursor={{fill: '#f8fafc'}}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <TransactionList transactions={transactions} onDelete={deleteTransaction} />
            </div>
          </div>
        )}
      </main>
    </div>
    </>
  )
}

export default App
