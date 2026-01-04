
import React from 'react';
import { Transaction, UserSettings } from '../types';
import { format } from 'date-fns';
import { CreditCard, ArrowRightLeft, Percent, Calendar, DollarSign, Trash2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  settings: UserSettings;
  onDelete: (id: string) => void;
}

export const TransactionDetailView: React.FC<Props> = ({ transactions, settings, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <CreditCard className="w-16 h-16 mb-4 opacity-20" />
        <p className="text-lg font-medium">No hay gastos para mostrar detalles.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {transactions.map((t) => {
        const usdBase = t.usdAmount / (1 + (t.bankCommission / 100));
        const commissionVal = t.usdAmount - usdBase;

        return (
          <div key={t.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">
                  {t.currencyCode}
                </span>
                <button 
                  onClick={() => onDelete(t.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{t.description}</h3>
              <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{format(new Date(t.consumptionDate + 'T12:00:00'), 'dd MMMM, yyyy')}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              {/* Local Section */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">Monto Original</span>
                  <span className="font-bold text-slate-700">{t.localAmount.toLocaleString()} {t.currencyCode}</span>
                </div>
                <div className="p-2 bg-slate-100 rounded-full">
                  <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 font-bold uppercase">T.C. Aplicado</span>
                  <span className="font-bold text-slate-700">1 USD = {t.exchangeRateToUSD}</span>
                </div>
              </div>

              {/* Conversion Breakdown */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Monto Base USD</span>
                  <span className="font-medium text-slate-700">${usdBase.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    Comisión Banco ({t.bankCommission}%) <Percent className="w-3 h-3" />
                  </span>
                  <span className="font-medium text-rose-500">+${commissionVal.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                  <span className="text-slate-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" /> Total USD
                  </span>
                  <span className="text-slate-900">${t.usdAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Final Result */}
              <div className="pt-2">
                <div className="flex flex-col items-center bg-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-100">
                  <span className="text-xs text-indigo-100 font-bold uppercase tracking-widest mb-1">Monto en {settings.homeCurrencyName}</span>
                  <span className="text-2xl font-black">
                    {settings.homeCurrencySymbol}{t.homeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">ID: {t.id.substring(0,8)}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Registrado: {format(new Date(t.date), 'HH:mm')}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
