'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { KENYAN_MMF_FUNDS } from '../lib/mockData';
import { MmfFund } from '../types';
import { TrendingUp, ArrowUpRight, Calculator, ShieldCheck, Zap, Info, Lock, Bell, Smartphone } from 'lucide-react';

interface YieldSparklinesProps {
  onOpenPaywall?: (featureName: string) => void;
}

export const YieldSparklines: React.FC<YieldSparklinesProps> = ({ onOpenPaywall }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const hasPass = store.hasActivePass();

  const [dailySavings, setDailySavings] = useState(100);
  const [selectedFund, setSelectedFund] = useState<MmfFund>(KENYAN_MMF_FUNDS[0]);

  const renderSparkline = (data: number[], color: string = '#059669') => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 120;
    const height = 36;
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 8) - 4;
      return `${x},${y}`;
    });

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(' ')}
        />
      </svg>
    );
  };

  const rateAnnual = selectedFund.effectiveAnnualRatePct / 100;
  const netRate = rateAnnual * (1 - selectedFund.withholdingTaxPct / 100);
  const dailyRate = netRate / 365;

  const semesterDays = 120;
  const totalInvestedSemester = dailySavings * semesterDays;
  const futureValueSemester = dailySavings * (((Math.pow(1 + dailyRate, semesterDays) - 1) / dailyRate) * (1 + dailyRate));
  const interestEarnedSemester = Math.round(futureValueSemester - totalInvestedSemester);

  const yearDays = 365;
  const totalInvestedYear = dailySavings * yearDays;
  const futureValueYear = dailySavings * (((Math.pow(1 + dailyRate, yearDays) - 1) / dailyRate) * (1 + dailyRate));
  const interestEarnedYear = Math.round(futureValueYear - totalInvestedYear);

  const handleAction = (featureName: string) => {
    if (!hasPass && onOpenPaywall) {
      onOpenPaywall(featureName);
      return;
    }
  };

  return (
    <div className="space-y-3">
      {/* Header Strip */}
      <div className={`rounded-xl px-3.5 py-2.5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
            isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-800 text-emerald-400 border-slate-700'
          }`}>
            <TrendingUp className="w-3 h-3" />
            CMA Regulated MMFs
          </span>
          <span className="text-xs font-bold">
            Kenyan Student MMF & Compound Yield Engine
          </span>
        </div>

        <div className={`flex items-center gap-1.5 text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Withholding Tax: <strong>15% (Kenya KRA)</strong></span>
        </div>
      </div>

      {/* MMF Funds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {KENYAN_MMF_FUNDS.map((fund) => {
          const isSelected = selectedFund.id === fund.id;
          return (
            <div
              key={fund.id}
              onClick={() => setSelectedFund(fund)}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                isSelected
                  ? isLight ? 'border-emerald-500 bg-emerald-50/40 shadow-sm' : 'border-emerald-500 bg-slate-900 shadow-sm'
                  : isLight ? 'bg-white border-slate-200 hover:border-slate-300' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold">{fund.name}</h4>
                  <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Min. KSh {fund.minInvestmentKes.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-600 flex items-center gap-0.5 justify-end">
                    {fund.effectiveAnnualRatePct}%
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <span className={`text-[9px] font-mono block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                    Daily EAR
                  </span>
                </div>
              </div>

              {/* Sparkline Visual */}
              <div className="my-2 flex items-center justify-between">
                <span className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  30-Day Trend
                </span>
                {renderSparkline(fund.sparklineData, '#059669')}
              </div>

              <div className={`pt-2 border-t flex items-center justify-between text-[10px] ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
              }`}>
                <span>Fee: {fund.managementFeePct}%</span>
                <span>Risk: {fund.riskProfile}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Compound Calculator Card */}
      <div className={`rounded-xl p-4 sm:p-5 border transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold">
              Compound Interest Growth Simulator: {selectedFund.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction(`Setup Daily Rate SMS Alerts for ${selectedFund.name}`)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
              }`}
            >
              {hasPass ? <Bell className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-emerald-600" />}
              <span>Rate Alerts</span>
            </button>
            <span className="text-xs text-emerald-600 font-bold font-mono">
              {selectedFund.effectiveAnnualRatePct}% EAR
            </span>
          </div>
        </div>

        {/* Slider Input */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between items-center text-xs">
            <span className={`font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Daily Stash Amount (From Gig Earnings)
            </span>
            <span className="text-base font-black text-emerald-600 font-mono">
              KSh {dailySavings.toLocaleString()} / day
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="1000"
            step="10"
            value={dailySavings}
            onChange={(e) => setDailySavings(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
          <div className={`flex justify-between text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            <span>KSh 20 (Chapo price)</span>
            <span>KSh 250 (1 Gig / day)</span>
            <span>KSh 1,000 (Full-time Hustle)</span>
          </div>
        </div>

        {/* 1-Semester vs 1-Year Compound Projection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Semester Result */}
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              1-Semester Projection (120 Days)
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              KSh {Math.round(futureValueSemester).toLocaleString()}
            </div>
            <div className={`text-[11px] pt-1 border-t flex justify-between ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <span>Deposited: KSh {totalInvestedSemester.toLocaleString()}</span>
              <span className="font-bold text-emerald-600">+KSh {interestEarnedSemester.toLocaleString()} Profit</span>
            </div>
          </div>

          {/* 1-Year Result */}
          <div className={`p-3.5 rounded-xl border space-y-1 ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              1-Year Academic Cycle (365 Days)
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600">
              KSh {Math.round(futureValueYear).toLocaleString()}
            </div>
            <div className={`text-[11px] pt-1 border-t flex justify-between ${
              isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
            }`}>
              <span>Deposited: KSh {totalInvestedYear.toLocaleString()}</span>
              <span className="font-bold text-emerald-600">+KSh {interestEarnedYear.toLocaleString()} Profit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
