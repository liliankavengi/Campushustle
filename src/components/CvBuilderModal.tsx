'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { FileText, Copy, Check, X, Download, Sparkles } from 'lucide-react';

interface CvBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CvBuilderModal: React.FC<CvBuilderModalProps> = ({ isOpen, onClose }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const user = store.user;
  const profile = user.profile || {
    skills: ['Swahili / Sheng', 'Logic Reasoning', 'Prompt Evaluation', 'Python', 'Research'],
    university: user.campus || 'MMU',
    experienceLevel: 'BEGINNER',
    preferredRemoteType: 'REMOTE',
    weeklyHoursAvailable: 20,
    careerGoals: ['AI Model Evaluation', 'Remote Tech Assistance']
  };

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cvMarkdown = `# ${user.fullName || 'Student Applicant'}
**Phone:** +${user.phoneNumber || '2547XXXXXXXX'} | **University:** ${user.campus || 'Kenyan University'}
**Target Roles:** AI Dialogue Evaluation, Remote Data Annotation, Junior Tech Tasks

---

## 🎯 Executive Summary
Dedicated, analytical university student with proven capabilities in bilingual logic assessment (Swahili, Sheng & English), STEM reasoning, and asynchronous remote task execution. Available for ${profile.weeklyHoursAvailable || 20} hours/week on flexible global remote batches.

---

## 🛠️ Core Skills & Capabilities
- **Technical & AI:** ${profile.skills.join(', ')}
- **Linguistic Fluency:** Swahili (Native), Sheng (Native Street & Contemporary Dialects), English (Fluent / Professional)
- **Work Environment:** High-speed fiber internet, dedicated laptop with Linux/Windows, zero hardware blockers.

---

## 🎓 Education & Campus Background
**${user.campus} — Kenya**
*Continuing Degree Student*
- Relevant Coursework: Applied Statistics, Computer Science fundamentals, Communication Skills.
- Academic and peer collaboration projects with rigorous fact-checking and unit-level precision.

---

## 💼 Remote Experience & Microtask Projects
- **Bilingual Generative AI Benchmark Rater:** Evaluated multi-turn LLM prompts for nuance, cultural relevance, and factual accuracy.
- **Data Annotation & Code Verification:** Validated code snippets and unit tests for syntactic correctness and logic edge cases.
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cvMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        {/* Header */}
        <div className={`px-5 py-4 border-b flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <span>Student Remote CV & Application Kit</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                  Quick Generator
                </span>
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Formatted for remote AI portals (Alignerr, Outlier, DataAnnotation) and Kenyan job platforms.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CV Preview Text Area */}
        <div className="p-4 flex-1 overflow-y-auto font-mono text-xs leading-relaxed space-y-3">
          <pre className={`p-4 rounded-xl border whitespace-pre-wrap ${
            isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
          }`}>
            {cvMarkdown}
          </pre>
        </div>

        {/* Footer actions */}
        <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <span className="text-[11px] text-slate-500">
            Auto-populated from your verified skill profile
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown CV'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
