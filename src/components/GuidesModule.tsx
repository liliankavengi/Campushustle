'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { 
  BookOpen, 
  Sparkles, 
  Lock, 
  Unlock, 
  Download, 
  CheckCircle2, 
  Star, 
  Copy, 
  Check, 
  ArrowRight,
  Bot,
  ShoppingBag,
  GraduationCap,
  TrendingUp,
  FileCode,
  Zap,
  ExternalLink
} from 'lucide-react';

interface GuidesModuleProps {
  onOpenPaywall: (featureName: string) => void;
}

interface GuideItem {
  id: string;
  title: string;
  category: 'AI & Remote' | 'Campus Arbitrage' | 'Academic Writing' | 'HELB & Wealth';
  icon: any;
  author: string;
  readTime: string;
  rating: number;
  reviewsCount: number;
  summary: string;
  whatYouLearn: string[];
  samplePromptSnippet?: string;
  fullContent: string[];
  isFeatured?: boolean;
}

const GUIDES_DATA: GuideItem[] = [
  {
    id: 'guide-ai-workflows',
    title: 'The Kenyan Student AI Remote Work Blueprint ($15–$25/hr)',
    category: 'AI & Remote',
    icon: Bot,
    author: 'CampusHustle AI Working Group',
    readTime: '12 min read + Prompt Kit',
    rating: 4.9,
    reviewsCount: 312,
    isFeatured: true,
    summary: 'Step-by-step walkthrough to passing qualification benchmarks on Outlier.ai, Alignerr, Remotasks, and DataAnnotation from Kenyan campuses with M-Pesa payouts.',
    whatYouLearn: [
      'Exact qualification test questions & reasoning criteria used by Scale AI & Alignerr',
      'How to format Swahili & Sheng dialect annotations for maximum acceptance',
      'System prompt templates for fast fact-checking and statutory verification',
      'Direct M-Pesa / Airtm / Payoneer withdrawal configuration without PayPal holds'
    ],
    samplePromptSnippet: `System Role: You are an expert Kenyan multilingual evaluator.
Analyze the following student dialogue snippet for authentic Sheng slang nuance, contextual appropriateness, and grammatical consistency:
[INPUT_TEXT_HERE]
Criteria: Score Accuracy (1-5), Sheng Lexicon Density (1-5), and provide a 2-sentence rationale in standard English.`,
    fullContent: [
      '### Chapter 1: Bypassing the Geographic Screening Barrier\nWhen onboarding on Outlier or Alignerr, Kenyan applicants often get disqualified in the initial rubric test due to overly generic responses. High-scoring evaluators use structured rationale frameworks (Claim, Evidence, Counter-analysis, Resolution).',
      '### Chapter 2: Sheng & Local Language Annotation Guidelines\nAI companies currently pay a premium for low-resource language pairs (Swahili, Sheng, Kikuyu, Dholuo). Never use machine translation tools like Google Translate verbatim—reviewers specifically test for colloquial street phrasing like "mbogi", "rada safi", "form ni gani".',
      '### Chapter 3: Earning Optimization\nWork in focused 90-minute blocks during peak batch releases (typically 2:00 PM – 7:00 PM EAT when US teams launch new queues). Average Kenyan students maintain $18/hr by hitting 95%+ accuracy scores.',
      '### Chapter 4: M-Pesa Direct Settlement Workflow\nConnect your Payoneer or Airtm account directly to Outlier payout settings. Payouts process every Tuesday and hit M-Pesa in under 15 minutes at zero international wire fee.'
    ]
  },
  {
    id: 'guide-reselling-arbitrage',
    title: 'Campus Reselling & Gikomba/Eastleigh Thrift Arbitrage',
    category: 'Campus Arbitrage',
    icon: ShoppingBag,
    author: 'Dennis Omondi (JKUAT)',
    readTime: '10 min read + Sourcing Map',
    rating: 4.8,
    reviewsCount: 184,
    summary: 'How to source A-grade thrift wear, shoes, and electronic accessories with KSh 3,000 capital and generate KSh 15,000–30,000 profit monthly through WhatsApp status catalogs.',
    whatYouLearn: [
      'Best wholesale camera & first-bale days in Gikomba (Tuesdays & Fridays 5:00 AM)',
      'Product photography hacks using basic smartphone camera and natural hostel window light',
      'WhatsApp Business catalog setup with pre-order deposits and hostel delivery routes',
      'Campus pricing matrix: 50%–100% markup strategy without losing student buyers'
    ],
    fullContent: [
      '### Chapter 1: Sourcing Secrets in Gikomba & Eastleigh\nArrive at Gikomba "Kwa Maji" section between 5:30 AM and 6:30 AM on Tuesday or Friday when first-selection camera bales are split open. Focus exclusively on vintage windbreakers, cargo trousers, and corduroy shirts.',
      '### Chapter 2: The Hostel Lighting Photo Setup\nPlace garments against plain white bedsheets or hang them against a clean wall with diffuse 9:00 AM window sunlight. Edit with Snapseed: increase Structure (+15) and Ambiance (+10) for crisp fabric texture.',
      '### Chapter 3: WhatsApp Status Funnel\nPost drops in batches of 7 items every Sunday at 8:00 PM when students are in hostels planning their week. Collect 50% M-Pesa deposit to hold items, then deliver door-to-door.'
    ]
  },
  {
    id: 'guide-academic-katex',
    title: 'KaTeX Transcription, Academic Research & SPSS Consulting',
    category: 'Academic Writing',
    icon: GraduationCap,
    author: 'Grace Wangari (MMU Engineering)',
    readTime: '15 min read + KaTeX Cheat Sheet',
    rating: 4.9,
    reviewsCount: 220,
    summary: 'Monetize your technical skills by converting handwritten engineering equations to KaTeX/LaTeX, formatting APA 7th thesis papers, and running SPSS regression models.',
    whatYouLearn: [
      'KaTeX syntax templates for calculus, differential equations, and electrical schematics',
      'SPSS descriptive and multilinear regression analysis workflows for master’s theses',
      'Pricing standards: charging KSh 2,500 – KSh 6,000 per project without underpricing',
      'Drafting student consulting contracts and managing revision milestones safely'
    ],
    samplePromptSnippet: `LaTeX KaTeX Prompt Template:
Convert the following physics/math problem statements into clean LaTeX KaTeX code with standard notation, aligned equal signs, and bold vector symbols:
[INSERT_FORMULAS_HERE]`,
    fullContent: [
      '### Chapter 1: High-Demand Academic Skillsets\nFinal year undergraduate and postgraduate students frequently lack time to format statistical tables and LaTeX mathematics. A single clean SPSS thesis data chapter can earn you KSh 4,000 in 3 hours of work.',
      '### Chapter 2: Standard Pricing Formula\nCharge KSh 150 per page for basic APA formatting, KSh 500 per statistical hypothesis test (T-Test/ANOVA/Regression in SPSS), and KSh 800 per 10 KaTeX transcribed complex equations.',
      '### Chapter 3: Ethical Boundaries & Quality Delivery\nNever write exams or take quizzes. Focus purely on data analysis, mathematical typography, proofreading, and citation structuring.'
    ]
  },
  {
    id: 'guide-helb-wealth',
    title: 'From HELB Survival to First 100k MMF Compound Engine',
    category: 'HELB & Wealth',
    icon: TrendingUp,
    author: 'CampusHustle Wealth Desk',
    readTime: '8 min read + Calculator',
    rating: 5.0,
    reviewsCount: 450,
    isFeatured: true,
    summary: 'The ultimate blueprint to budget HELB semester disbursements, avoid mid-semester broke cycles, and compound freelance gig earnings in high-yield Kenyan MMFs.',
    whatYouLearn: [
      'The 50/30/20 Campus Allocation Rule tailored for Kenyan university living costs',
      'Top CMA-regulated MMFs (Etica 16.85%, Sanlam 15.2%, Kuza 15.0%) with zero withdrawal fees',
      'How to build a KSh 20,000 emergency fund so you never borrow from predatory mobile loan apps',
      'Automated daily compound calculator model for side-hustle profits'
    ],
    fullContent: [
      '### Chapter 1: The HELB Allocation Shock Absorber\nWhen HELB drops (typically KSh 20,000 – KSh 30,000), immediately transfer 30% into a Money Market Fund before paying hostel rent. Keep daily kibanda and bundle expenditure strictly within KSh 300/day.',
      '### Chapter 2: Choosing the Right MMF in Kenya\nCompare Effective Annual Rate (EAR) vs daily net yield. Etica Wealth and Kuza currently yield 15–16.8% EAR with daily interest crediting and 24hr M-Pesa withdrawals.',
      '### Chapter 3: The 100k Graduation Target\nBy reinvesting just KSh 1,500 every week from campus escrow gigs into a 16% EAR MMF, a 2nd year student graduates with over KSh 115,000 in liquid capital.'
    ]
  }
];

export const GuidesModule: React.FC<GuidesModuleProps> = ({ onOpenPaywall }) => {
  const store = useCampusStore();
  const hasPass = store.hasActivePass();
  const isLight = store.theme === 'light';

  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredGuides = GUIDES_DATA.filter((guide) => {
    if (activeCategory === 'ALL') return true;
    return guide.category === activeCategory;
  });

  const handleCopyPrompt = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasPass) {
      onOpenPaywall('Unlock AI Prompt Kits & Playbook Templates');
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleReadGuide = (guide: GuideItem) => {
    if (!hasPass) {
      onOpenPaywall(`Unlock Complete Guide: "${guide.title}"`);
      return;
    }
    setSelectedGuide(guide);
  };

  return (
    <div className="space-y-4">
      {/* Banner / Value Prop */}
      <div className={`rounded-2xl p-4 sm:p-5 border relative overflow-hidden transition-colors ${
        isLight 
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-emerald-200' 
          : 'bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Premium Hustle Playbooks</span>
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {GUIDES_DATA.length} Verified Action Kits
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black tracking-tight">
              Actionable Campus Earning & AI Guides
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Battle-tested roadmaps written by top student earners across Kenyan campuses. Includes copy-paste AI qualification prompts, supplier maps, and MMF strategies.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {hasPass ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold">
                <Unlock className="w-3.5 h-3.5" />
                <span>All Playbooks Unlocked</span>
              </div>
            ) : (
              <button
                onClick={() => onOpenPaywall('Unlock All AI Guides & Hustle Playbooks')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock All Guides ($1 / KSh 130)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {['ALL', 'AI & Remote', 'Campus Arbitrage', 'Academic Writing', 'HELB & Wealth'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : isLight 
                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200' 
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Guides' : cat}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredGuides.map((guide) => {
          const IconComponent = guide.icon;
          return (
            <div
              key={guide.id}
              onClick={() => handleReadGuide(guide)}
              className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all cursor-pointer relative group hover:border-emerald-500/70 ${
                guide.isFeatured
                  ? isLight 
                    ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-500/20' 
                    : 'bg-slate-900 border-emerald-800/80 shadow-sm ring-1 ring-emerald-500/20'
                  : isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isLight ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        {guide.category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">
                        {guide.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-lg border border-amber-500/20 text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{guide.rating}</span>
                    <span className={`text-[10px] font-normal ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      ({guide.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold leading-snug group-hover:text-emerald-600 transition-colors">
                  {guide.title}
                </h3>

                {/* Summary */}
                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                  {guide.summary}
                </p>

                {/* Key Takeaways Preview */}
                <div className="space-y-1.5 pt-1">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    What is Included:
                  </span>
                  <ul className="space-y-1">
                    {guide.whatYouLearn.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className={`line-clamp-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Prompt Snippet Preview */}
                {guide.samplePromptSnippet && (
                  <div className={`p-2.5 rounded-xl border font-mono text-[11px] space-y-1.5 relative ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-sans font-bold text-emerald-600">
                      <span className="flex items-center gap-1">
                        <FileCode className="w-3 h-3" />
                        <span>Included AI Prompt Template</span>
                      </span>
                      <button
                        onClick={(e) => handleCopyPrompt(guide.id, guide.samplePromptSnippet!, e)}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                          copiedSnippetId === guide.id
                            ? 'bg-emerald-600 text-white'
                            : isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {copiedSnippetId === guide.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSnippetId === guide.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="line-clamp-2 text-[10px] leading-relaxed opacity-90">
                      {guide.samplePromptSnippet}
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer CTA */}
              <div className={`mt-4 pt-3 border-t flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}>
                <span className={`text-[11px] font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  By {guide.author}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadGuide(guide);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    hasPass
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : isLight ? 'bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 border border-slate-300' : 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-700'
                  }`}
                >
                  {hasPass ? (
                    <>
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Playbook</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Unlock Guide</span>
                    </>
                  )}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reading Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
          }`}>
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {selectedGuide.title}
                  </h3>
                  <p className="text-[11px] text-emerald-100">
                    {selectedGuide.category} • {selectedGuide.readTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                isLight ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
              }`}>
                <strong>Summary:</strong> {selectedGuide.summary}
              </div>

              {selectedGuide.samplePromptSnippet && (
                <div className={`p-3 rounded-xl border font-mono text-xs space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-100'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-sans font-bold text-emerald-600">
                    <span>📋 Ready-to-use Prompt Template</span>
                    <button
                      onClick={(e) => handleCopyPrompt(selectedGuide.id, selectedGuide.samplePromptSnippet!, e)}
                      className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] cursor-pointer"
                    >
                      {copiedSnippetId === selectedGuide.id ? 'Copied to Clipboard!' : 'Copy Prompt'}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                    {selectedGuide.samplePromptSnippet}
                  </pre>
                </div>
              )}

              {/* Full Chapters */}
              <div className="space-y-4 pt-2">
                {selectedGuide.fullContent.map((chapter, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border space-y-1.5 ${
                    isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {chapter}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-between flex-shrink-0 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
            }`}>
              <span className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Reviewed and verified by CampusHustle Community
              </span>
              <button
                onClick={() => setSelectedGuide(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
