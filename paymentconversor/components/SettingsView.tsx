
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Settings, Save, Globe2, CreditCard, RefreshCw, Percent, Coins } from 'lucide-react';

interface Props {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsView: React.FC<Props> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    alert('Configuración guardada correctamente.');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8 text-indigo-600">
          <Settings className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Configuración de Divisas</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> País de Destino (Viaje)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Moneda Local Predeterminada</label>
                <input
                  type="text"
                  value={formData.defaultCurrencyCode}
                  onChange={(e) => setFormData({...formData, defaultCurrencyCode: e.target.value.toUpperCase()})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: CLP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">T.C. Unidades por 1 USD</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultLocalToUSDRate}
                  onChange={(e) => setFormData({...formData, defaultLocalToUSDRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 900"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> País de Origen (Tu Banco)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Moneda Origen</label>
                <input
                  type="text"
                  value={formData.homeCurrencyName}
                  onChange={(e) => setFormData({...formData, homeCurrencyName: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: Pesos Chilenos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Símbolo ($, £, etc)</label>
                <input
                  type="text"
                  value={formData.homeCurrencySymbol}
                  onChange={(e) => setFormData({...formData, homeCurrencySymbol: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: $"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">T.C. 1 USD a Origen</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.defaultUSDToHomeRate}
                  onChange={(e) => setFormData({...formData, defaultUSDToHomeRate: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                  Comisión Bancaria (%) <Percent className="w-3 h-3 text-slate-400" />
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.bankCommission}
                  onChange={(e) => setFormData({...formData, bankCommission: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: 3.5"
                />
              </div>
            </div>
          </section>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 text-blue-800 text-sm">
            <Coins className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>La comisión bancaria se sumará al monto final en USD y moneda de origen, simulando el cobro real que realiza el banco por transacciones internacionales.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Guardar Preferencias
          </button>
        </form>
      </div>
    </div>
  );
};
