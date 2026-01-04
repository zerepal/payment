
import React from 'react';
import { Transaction, UserSettings } from '../types';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Historial de Pagos</h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
          {transactions.length} Gastos
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">Consumo</th>
              <th className="px-6 py-4 font-semibold">Descripción</th>
              <th className="px-6 py-4 font-semibold">Monto Local</th>
              <th className="px-6 py-4 font-semibold">USD</th>
              <th className="px-6 py-4 font-semibold text-indigo-600">Origen</th>
              <th className="px-6 py-4 font-semibold text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                  No hay transacciones registradas.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">
                      {format(new Date(t.consumptionDate + 'T12:00:00'), 'dd/MM/yy')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">{t.description}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-700">{t.localAmount.toLocaleString()}</span>
                      <span className="text-xs text-slate-400 font-bold">{t.currencyCode}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    ${t.usdAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-indigo-600 font-bold">
                  S/{t.homeAmount.toFixed(2)}
                     
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(t.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
