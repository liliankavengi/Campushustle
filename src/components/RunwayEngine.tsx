'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { ExpenseCategory, TransactionType } from '../types';
import { 
  Flame, 
  Plus, 
  TrendingUp, 
  Utensils, 
  Wifi, 
  Home, 
  FileText, 
  Lock, 
  ShieldAlert,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface RunwayEngineProps {
  onOpenPaywall: (featureName: string) => void;
}

export const RunwayEngine: React.FC<RunwayEngineProps> = ({ onOpenPaywall }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const hasPass = store.hasActivePass();

  const [category, setCategory] = useState<ExpenseCategory>('Kibanda');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');

  // Compute Balances
  const totalIncome = store.finances
    .filter((f) => f.transactionType === 'INCOME')
    .reduce((acc, f) => acc + f.amount, 0);

  const totalExpense = store.finances
    .filter((f) => f.transactionType === 'EXPENSE')
    .reduce((acc, f) => acc + f.amount, 0);

  const netBalance = Math.max(0, totalIncome - totalExpense);

  const estimatedDailyBurn = 350; // KSh ~350/day standard campus survival
  const daysOfRunway = Math.floor(netBalance / estimatedDailyBurn);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    store.addFinancialLog({
      category,
      amount: Number(amount),
      transactionType: type,
      description: description || `${type === 'EXPENSE' ? 'Expense on' : 'Income from'} ${category}`,
    });

    setAmount('');
    setDescription('');
  };

  const categoryIcons: Record<ExpenseCategory, React.ReactNode> = {
    Kibanda: <Utensils className="w-3.5 h-3.5 text-emerald-600" />,
    Bundles: <Wifi className="w-3.5 h-3.5 text-emerald-600" />,
    Rent: <Home className="w-3.5 h-3.5 text-slate-500" />,
    HELB: <Wallet className="w-3.5 h-3.5 text-emerald-600" />,
    Printing: <FileText className="w-3.5 h-3.5 text-slate-500" />,
    Transport: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />,
    SideHustle: <Flame className="w-3.5 h-3.5 text-emerald-600" />,
    Other: <FileText className="w-3.5 h-3.5 text-slate-400" />,
  };

  return (
    <div className="space-y-3">
      {/* Top Strip: Compact Runway Survival Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Days of Runway Gauge */}
        <div className={`rounded-xl p-4 border flex flex-col justify-between transition-colors ${
          isLight 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              HELB & Cash Runway
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              daysOfRunway > 30 
                ? isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-950/40 text-emerald-400 border-emerald-800' 
                : daysOfRunway > 10 
                ? isLight ? 'bg-slate-100 text-slate-800 border-slate-300' : 'bg-slate-800 text-slate-300 border-slate-700' 
                : isLight ? 'bg-slate-200 text-slate-900 border-slate-400 font-extrabold' : 'bg-slate-800 text-white border-slate-700 animate-pulse'
            }`}>
              {daysOfRunway > 30 ? 'Safe Zone' : daysOfRunway > 10 ? 'Caution' : 'Critical Fuel'}
            </span>
          </div>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black">
                {daysOfRunway}
              </span>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                days of campus survival
              </span>
            </div>
            <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Based on standard KSh {estimatedDailyBurn}/day kibanda and bundles burn.
            </p>
          </div>
        </div>

        {/* Net Available Balance */}
        <div className={`rounded-xl p-4 border flex flex-col justify-between transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Net Semester Liquidity
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600">
              KSh {netBalance.toLocaleString()}
            </span>
            <div className={`flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t ${
              isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
            }`}>
              <span>Income: KSh {totalIncome.toLocaleString()}</span>
              <span>Expenses: KSh {totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Daily Recommended Kibanda Cap */}
        <div className={`rounded-xl p-4 border flex flex-col justify-between transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Daily Spending Ceiling
          </span>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black">
              KSh {daysOfRunway > 0 ? Math.floor(netBalance / Math.max(1, daysOfRunway)) : 0}
            </span>
            <span className={`text-xs block mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Daily kibanda budget to survive semester
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Transaction Form + Financial Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Form: Add Income/Expense Log */}
        <div className={`lg:col-span-5 rounded-xl p-4 border transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Log Campus Expense or Gig Income</span>
            </h3>
          </div>

          <form onSubmit={handleAddLog} className="space-y-3">
            {/* Type Toggle: Expense / Income */}
            <div className={`grid grid-cols-2 gap-1 p-1 rounded-xl border text-xs ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  type === 'EXPENSE'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Expense Log
              </button>
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`py-2 rounded-lg font-bold transition-all ${
                  type === 'INCOME'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isLight ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                Gig Income
              </button>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              >
                <option value="Kibanda">Kibanda Food & Meals</option>
                <option value="Bundles">Safaricom Bundles & Wi-Fi</option>
                <option value="Rent">Bedsitter / Hostel Rent</option>
                <option value="HELB">HELB / Upkeep Allocation</option>
                <option value="Printing">Printing & Cyber Copies</option>
                <option value="SideHustle">Campus Gig Bounty Earned</option>
                <option value="Transport">Matatu / Campus Fare</option>
                <option value="Other">Miscellaneous</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Amount (KSh)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 150"
                required
                className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block text-[10px] uppercase font-bold tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Chapo smokie pass"
                className={`w-full px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                }`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              Add Log to Runway Engine
            </button>
          </form>
        </div>

        {/* Right: Recent Financial Logs */}
        <div className={`lg:col-span-7 rounded-xl p-4 border transition-colors flex flex-col justify-between ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold">
                Campus Financial Logs
              </h3>
              <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {store.finances.length} Entries
              </span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {store.finances.map((f) => (
                <div
                  key={f.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                    isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      f.transactionType === 'INCOME' 
                        ? isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/60 text-emerald-400' 
                        : isLight ? 'bg-slate-100 text-slate-700' : 'bg-slate-900 text-slate-300'
                    }`}>
                      {categoryIcons[f.category] || <FileText className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate">
                        {f.description || f.category}
                      </span>
                      <span className={`text-[10px] block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {new Date(f.loggedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs font-extrabold block ${
                      f.transactionType === 'INCOME' ? 'text-emerald-600' : isLight ? 'text-slate-900' : 'text-slate-200'
                    }`}>
                      {f.transactionType === 'INCOME' ? '+' : '-'} KSh {f.amount.toLocaleString()}
                    </span>
                    <span className={`text-[9px] uppercase font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {f.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t text-[10px] text-center ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800 text-slate-400'
          }`}>
            CampusHustle Runway Engine • Live Kibanda Burn Forecasting
          </div>
        </div>
      </div>
    </div>
  );
};
