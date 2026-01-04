
import React, { useState, useEffect } from 'react';
import { Transaction, UserSettings } from '../types';
import { PlusCircle, Calculator, Calendar, Percent, Info } from 'lucide-react';

interface Props {
  onAdd: (transaction: Transaction) => void;
  settings: UserSettings;
}

export const TransactionForm: React.FC<Props> = ({ onAdd, settings }) => {
  const [description, setDescription] = useState('');
  const [consumptionDate, setConsumptionDate] = useState(new Date().toISOString().split('T')[0]);
  const [currencyCode, setCurrencyCode] = useState(settings.defaultCurrencyCode);
  const [localAmount, setLocalAmount] = useState<string>('');
  const [rateToUSD, setRateToUSD] = useState<string>(settings.defaultLocalToUSDRate.toString());
  const [homeRate, setHomeRate] = useState<string>(settings.defaultUSDToHomeRate.toString());
  
  const [usdAmount, setUsdAmount] = useState(0);
  const [usdBase, setUsdBase] = useState(0);
  const [homeAmount, setHomeAmount] = useState(0);
  const [commissionAmount, setCommissionAmount] = useState(0);

  useEffect(() => {
    setCurrencyCode(settings.defaultCurrencyCode);
    setRateToUSD(settings.defaultLocalToUSDRate.toString());
    setHomeRate(settings.defaultUSDToHomeRate.toString());
  }, [settings]);

  useEffect(() => {
    const lVal = parseFloat(localAmount) || 0;
    const rToUsd = parseFloat(rateToUSD) || 1; 
    const hRate = parseFloat(homeRate) || 0;   
    const commPct = settings.bankCommission || 0;

    const calculatedUsdBase = rToUsd !== 0 ? lVal / rToUsd : 0;
    const commVal = calculatedUsdBase * (commPct / 100);
    const finalUsd = calculatedUsdBase + commVal;
    const finalHome = finalUsd * hRate;

    setUsdBase(calculatedUsdBase);
    setCommissionAmount(commVal);
    setUsdAmount(finalUsd);
    setHomeAmount(finalHome);
  }, [localAmount, rateToUSD, homeRate, settings.bankCommission]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !localAmount || !rateToUSD || !homeRate) return;

    onAdd({
      id: crypto.randomUUID(),
      description,
      date: new Date().toISOString(),
      consumptionDate,
      localAmount: parseFloat(localAmount),
      currencyCode: currencyCode.toUpperCase(),
      exchangeRateToUSD: parseFloat(rateToUSD),
      usdAmount,
      homeExchangeRate: parseFloat(homeRate),
      homeAmount,
      bankCommission: settings.bankCommission
    });

    setDescription('');
    setLocalAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-6 text-indigo-600">
        <Calculator className="w-5 h-5" />
        <h2 className="text-xl font-bold">Nuevo Gasto</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Cena, Hotel, Transporte..."
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> Fecha de Consumo
          </label>
          <input
            type="date"
            value={consumptionDate}
            onChange={(e) => setConsumptionDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Moneda Local</label>
            <input
              type="text"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto Local</label>
            <input
              type="number"
              step="0.01"
              value={localAmount}
              onChange={(e) => setLocalAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">T.C. por 1 USD</label>
            <input
              type="number"
              step="0.01"
              value={rateToUSD}
              onChange={(e) => setRateToUSD(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">USD a Origen</label>
            <input
              type="number"
              step="0.01"
              value={homeRate}
              onChange={(e) => setHomeRate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Base USD</span>
            <span>${usdBase.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-rose-500 font-medium">
            <span className="flex items-center gap-1">
              Comisión Banco ({settings.bankCommission}%) <Percent className="w-2.5 h-2.5" />
            </span>
            <span>+${commissionAmount.toFixed(2)}</span>
          </div>
          
          {/* New line showing Total USD including commission */}
          <div className="flex justify-between items-center pt-2 border-t border-indigo-100/50">
            <span className="text-sm text-slate-600 font-medium">Total USD</span>
            <span className="text-md font-bold text-slate-800">${usdAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-slate-600 font-semibold uppercase tracking-tight">Total {settings.homeCurrencyName}</span>
            <span className="text-xl font-black text-indigo-700">
              {settings.homeCurrencySymbol}{homeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Registrar Gasto
        </button>
      </form>
    </div>
  );
};
