'use client';

import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  ShieldCheck, 
  Server, 
  Database, 
  Cpu, 
  Play
} from 'lucide-react';
import { useCampusStore } from '../lib/store';

interface ArchitectureInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DarajaArchitectureInspector: React.FC<ArchitectureInspectorProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const store = useCampusStore();
  const [activeTab, setActiveTab] = useState<'TOPOLOGY' | 'SCHEMA' | 'DARAJA_CODE' | 'WEBHOOK_TESTER'>('DARAJA_CODE');
  
  const [testIp, setTestIp] = useState('196.201.214.200');
  const [testResultCode, setTestResultCode] = useState<0 | 1032>(0);
  const [testCheckoutId, setTestCheckoutId] = useState('ws_CO_TEST_DARAJA_2026');
  const [simulationLog, setSimulationLog] = useState<string[]>([]);
  const [simStatus, setSimStatus] = useState<'IDLE' | 'TESTING' | 'PASS' | 'REJECT'>('IDLE');

  if (!isOpen) return null;

  const handleRunWebhookSimulation = async () => {
    setSimStatus('TESTING');
    setSimulationLog([]);

    const logs: string[] = [];
    logs.push(`[1] Inbound POST /api/mpesa/callback from IP: ${testIp}`);

    const validIps = ['196.201.214.', '196.201.213.'];
    const isWhitelisted = validIps.some((prefix) => testIp.startsWith(prefix));

    if (!isWhitelisted) {
      setTimeout(() => {
        logs.push(`[2] [ERROR] 403 FORBIDDEN: Origin IP ${testIp} does not match Safaricom Daraja perimeter (196.201.214.x / 196.201.213.x).`);
        logs.push(`[3] Transaction rejected. Database lock aborted.`);
        setSimulationLog([...logs]);
        setSimStatus('REJECT');
      }, 600);
      return;
    }

    setTimeout(() => {
      logs.push(`[2] [OK] IP Whitelist Verified: Safaricom Daraja 2.0 Subnet.`);
      logs.push(`[3] Executing with transaction.atomic(): select_for_update() row lock on checkout_request_id="${testCheckoutId}"`);

      if (testResultCode === 0) {
        const receipt = `SLK${Math.floor(10000000 + Math.random() * 90000000)}KE`;
        logs.push(`[4] ResultCode=0 (SUCCESS): M-Pesa Receipt Generated: ${receipt}`);
        logs.push(`[5] Subscription row created: user_id="${store.user.id}", expires_at=NOW() + 120 Days (~1 Semester).`);
        logs.push(`[6] Status 200 OK: {"ResultCode": 0, "ResultDesc": "Success"}`);
        setSimulationLog([...logs]);
        setSimStatus('PASS');
      } else {
        logs.push(`[4] [WARN] ResultCode=1032 (CANCELLED): User entered incorrect PIN or rejected prompt.`);
        logs.push(`[5] Updated mpesa_transactions: status="FAILED", result_code=1032.`);
        logs.push(`[6] Status 200 OK: Handled safely without locking user account.`);
        setSimulationLog([...logs]);
        setSimStatus('REJECT');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-dark-950 p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-daraja-cyan/20 border border-daraja-cyan/40 flex items-center justify-center text-daraja-cyan">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                CampusHustle Architecture & Daraja Engine
              </h3>
              <p className="text-[11px] text-slate-400">
                Low-Latency Micro-Billing, Flaky Network Resilience & Ingestion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 py-2 bg-dark-950/60 border-b border-white/5 overflow-x-auto">
          {[
            { key: 'DARAJA_CODE', label: 'Safe Callback & Row Locks', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
            { key: 'TOPOLOGY', label: 'System Topology', icon: <Server className="w-3.5 h-3.5" /> },
            { key: 'SCHEMA', label: 'PostgreSQL Schema', icon: <Database className="w-3.5 h-3.5" /> },
            { key: 'WEBHOOK_TESTER', label: 'Interactive Webhook Simulator', icon: <Cpu className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-safari-600 text-white shadow-sm glow-safaricom'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="p-5 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'DARAJA_CODE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-dark-950 p-3 rounded-xl border border-white/5 font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-safari-400 animate-ping" />
                  <span className="text-xs font-bold text-white">Safe Daraja Callback Webhook Implementation</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-dark-800 px-2 py-0.5 rounded font-mono">
                  Python / Django REST + select_for_update()
                </span>
              </div>

              <div className="bg-dark-950 rounded-xl p-4 border border-white/10 overflow-x-auto text-slate-200 leading-relaxed">
                <pre>{`from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import MpesaTransaction, Subscription
from datetime import timedelta
from django.utils import timezone

SAFARICOM_IPS = ['196.201.214.', '196.201.213.']

class MpesaCallbackWebhook(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        client_ip = request.META.get('HTTP_X_FORWARDED_FOR', request.META.get('REMOTE_ADDR', ''))
        
        # 1. Network perimeter verification (Reject rogue IP payloads)
        if not any(client_ip.startswith(prefix) for prefix in SAFARICOM_IPS):
            return Response({"error": "Unauthorized origin"}, status=403)

        body = request.data.get("Body", {}).get("stkCallback", {})
        result_code = body.get("ResultCode")
        checkout_id = body.get("CheckoutRequestID")

        with transaction.atomic():
            # 2. Strict row locking to eliminate race conditions & double-spend
            tx = MpesaTransaction.objects.select_for_update().filter(
                checkout_request_id=checkout_id, 
                status="PENDING"
            ).first()

            if not tx:
                return Response({"ResultCode": 0, "ResultDesc": "Ignored / Already Processed"})

            if result_code == 0:
                # 3. Success: Parse Daraja CallbackMetadata Items
                items = {i["Name"]: i.get("Value") for i in body["CallbackMetadata"]["Item"]}
                tx.mpesa_receipt = items.get("MpesaReceiptNumber")
                tx.result_code = 0
                tx.status = "SUCCESS"
                tx.save()

                if tx.purpose == "SUBSCRIPTION_PASS":
                    Subscription.objects.create(
                        user_id=tx.user_id,
                        amount=tx.amount,
                        mpesa_receipt=tx.mpesa_receipt,
                        status="ACTIVE",
                        expires_at=timezone.now() + timedelta(days=120) # 1 Semester
                    )
            else:
                tx.result_code = result_code
                tx.status = "FAILED"
                tx.save()

        return Response({"ResultCode": 0, "ResultDesc": "Success"})`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'TOPOLOGY' && (
            <div className="space-y-4">
              <div className="bg-dark-950 rounded-xl p-4 border border-white/10 overflow-x-auto text-emerald-400 font-mono">
                <pre>{`                   ┌──────────────────────────────────────────────┐
                   │               CLIENT APPS                    │
                   │  • React Native (Expo) - Android APK / PWA   │
                   │  • Next.js Web App (Tailwind CSS, Offline)   │
                   └──────────────────────┬───────────────────────┘
                                          │ HTTPS / WSS
                                          ▼
                   ┌──────────────────────────────────────────────┐
                   │             API GATEWAY / NGINX              │
                   │  • SSL Termination & Rate Limiting           │
                   │  • Safaricom IP Whitelist for Callbacks      │
                   └──────────────────────┬───────────────────────┘
                                          │
       ┌──────────────────────────────────┴──────────────────────────────────┐
       ▼                                                                     ▼
┌──────────────────────────────┐                       ┌─────────────────────────────────┐
│     CORE BACKEND ENGINE      │                       │     ASYNC WORKERS & QUEUES      │
│  (Django REST / FastAPI)     │                       │  (Celery + Redis Broker)        │
├──────────────────────────────┤                       ├─────────────────────────────────┤
│ • Auth & Phone OTP Service   │◄───────Events────────►│ • Daraja STK Push & B2C Engine  │
│ • Subscription & Gatekeeper  │                       │ • Aggregator & Scraper Pipeline │
│ • Pesa Log & Budget Engine   │                       │ • Escrow Settlement Cron        │
│ • Gig & Escrow State Machine │                       │ • SMS Statement Parser Tasks    │
└──────────────┬───────────────┘                       └────────────────┬────────────────┘
               │                                                        │
               ▼                                                        ▼
┌──────────────────────────────┐                       ┌─────────────────────────────────┐
│     DATA PERSISTENCE         │                       │      EXTERNAL SERVICES          │
│ • PostgreSQL (ACID Row Locks)│                       │ • Safaricom Daraja 2.0 (STK/B2C)│
│ • Redis (JWT, Cache, MMKV)   │                       │ • Africa's Talking (SMS OTP)    │
└──────────────────────────────┘                       └─────────────────────────────────┘`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'SCHEMA' && (
            <div className="bg-dark-950 rounded-xl p-4 border border-white/10 overflow-x-auto text-slate-300 font-mono">
              <pre>{`-- 1. Identity & Student Context
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(15) UNIQUE NOT NULL, -- Format: 2547XXXXXXXX
    full_name VARCHAR(100),
    campus VARCHAR(50) NOT NULL,              -- e.g., 'MMU', 'UoN', 'KU', 'JKUAT'
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. $1 Micro-Paywall & Access Pass
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,           -- 130.00 KES
    mpesa_receipt VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',      -- 'PENDING', 'ACTIVE', 'EXPIRED'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Student Finances & Runway Manager
CREATE TABLE financial_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,            -- 'Kibanda', 'Rent', 'Bundles', 'HELB'
    amount NUMERIC(10, 2) NOT NULL,
    transaction_type VARCHAR(10) NOT NULL,    -- 'INCOME', 'EXPENSE'
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Gigs, Tasks & Escrow
CREATE TABLE gigs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poster_id UUID REFERENCES users(id) ON DELETE SET NULL,
    worker_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    reward_kes NUMERIC(10, 2) NOT NULL,
    escrow_status VARCHAR(20) DEFAULT 'UNFUNDED', -- 'HELD', 'RELEASED', 'REFUNDED'
    origin_type VARCHAR(20) DEFAULT 'INTERNAL',
    external_apply_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}</pre>
            </div>
          )}

          {activeTab === 'WEBHOOK_TESTER' && (
            <div className="space-y-4 font-sans">
              <div className="bg-dark-950 p-4 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Simulate Inbound Safaricom Daraja Webhook
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Origin IP Address
                    </label>
                    <select
                      value={testIp}
                      onChange={(e) => setTestIp(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-safari-500"
                    >
                      <option value="196.201.214.200">196.201.214.200 (Valid Safaricom IP)</option>
                      <option value="196.201.213.14">196.201.213.14 (Valid Safaricom IP)</option>
                      <option value="45.33.32.156">45.33.32.156 (Rogue / Spoofed IP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Result Code
                    </label>
                    <select
                      value={testResultCode}
                      onChange={(e) => setTestResultCode(Number(e.target.value) as any)}
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-safari-500"
                    >
                      <option value={0}>0 (Success - M-Pesa PIN Entered)</option>
                      <option value={1032}>1032 (Cancelled by User / Insufficient Funds)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Checkout Request ID
                    </label>
                    <input
                      type="text"
                      value={testCheckoutId}
                      onChange={(e) => setTestCheckoutId(e.target.value)}
                      className="w-full px-3 py-2 bg-dark-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-safari-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunWebhookSimulation}
                  disabled={simStatus === 'TESTING'}
                  className="w-full py-2.5 bg-safari-600 hover:bg-safari-500 text-white font-bold rounded-xl text-xs shadow-md glow-safaricom transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Send Inbound Webhook Payload</span>
                </button>
              </div>

              {/* Execution Console Output */}
              {simulationLog.length > 0 && (
                <div className="bg-black/90 p-4 rounded-xl border border-white/10 font-mono text-xs space-y-1.5">
                  <div className="text-slate-400 text-[10px] pb-1 border-b border-white/10">
                    Console Logs // Safaricom Perimeter & ACID Lock Verification
                  </div>
                  {simulationLog.map((log, index) => (
                    <div
                      key={index}
                      className={
                        log.includes('[OK]')
                          ? 'text-safari-400 font-bold'
                          : log.includes('[ERROR]')
                          ? 'text-red-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-dark-950 px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-sans">
          <span>CampusHustle Engine v2.0</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-dark-800 hover:bg-dark-700 text-white rounded-lg font-semibold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
