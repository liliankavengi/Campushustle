'use client';

import React, { useState } from 'react';
import { useCampusStore } from '../lib/store';
import { analyzeSkillGaps, matchStudentProfile } from '../lib/aiEngine';
import { 
  Sparkles, 
  BrainCircuit, 
  Check, 
  Plus, 
  X, 
  ArrowRight, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Lightbulb,
  GraduationCap
} from 'lucide-react';
import { CampusName, ExperienceLevel, RemoteType } from '../types';

interface SkillGapAnalyzerProps {
  onOpenGuides: () => void;
}

const COMMON_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'SQL', 'Excel',
  'Swahili / Sheng', 'Logic Reasoning', 'Prompt Evaluation', 'Content Moderation',
  'Research', 'Proofreading', 'Data Entry', 'Audio Validation', 'PowerBI',
  'SPSS', 'Flutter', 'Graphic Design', 'Customer Support', 'Copywriting'
];

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ onOpenGuides }) => {
  const store = useCampusStore();
  const isLight = store.theme === 'light';
  const profile = store.user.profile || {
    skills: ['Swahili / Sheng', 'Logic Reasoning', 'Research'],
    university: store.user.campus || 'MMU',
    careerGoals: ['AI Evaluation & RLHF', 'Global Remote Tech'],
    experienceLevel: 'BEGINNER' as ExperienceLevel,
    preferredRemoteType: 'REMOTE' as RemoteType,
    weeklyHoursAvailable: 15,
  };

  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [expLevel, setExpLevel] = useState<ExperienceLevel>(profile.experienceLevel || 'BEGINNER');
  const [remotePref, setRemotePref] = useState<RemoteType | 'ANY'>(profile.preferredRemoteType || 'REMOTE');
  const [weeklyHours, setWeeklyHours] = useState(profile.weeklyHoursAvailable || 15);
  const [saveToast, setSaveToast] = useState(false);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = () => {
    store.updateUserProfile({
      skills,
      university: store.user.campus,
      experienceLevel: expLevel,
      preferredRemoteType: remotePref,
      weeklyHoursAvailable: weeklyHours,
      careerGoals: profile.careerGoals,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const skillGaps = analyzeSkillGaps(profile, store.gigs);

  // Compute matched jobs count (>70% match)
  const highMatchGigs = store.gigs.filter((g) => matchStudentProfile({ ...profile, skills }, g).matchPercentage >= 70);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold flex items-center gap-2">
              <span>AI Skill-Gap & Career Match Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 font-bold border border-purple-500/20">
                AI Intelligence
              </span>
            </h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Personalize your skill matrix to reveal immediate earning matches and high-paying skill gaps.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Skill Profile</span>
        </button>
      </div>

      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>Student profile updated. Job matching scores recalculated across all {store.gigs.length} live opportunities!</span>
        </div>
      )}

      {/* Grid: Profile Editor & Gap Analyzer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Student Skills Matrix (5 Cols) */}
        <div className={`lg:col-span-5 p-4 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
              1. Your Active Skill Profile
            </span>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select the skills you are ready to evaluate or execute today.
            </p>
          </div>

          {/* Active Skills Badges */}
          <div className="flex flex-wrap gap-1.5 min-h-[40px]">
            {skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center gap-1.5"
              >
                <span>{s}</span>
                <button
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add Custom Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, SEO)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(customSkillInput);
                  setCustomSkillInput('');
                }
              }}
              className={`flex-1 p-2 rounded-xl border text-xs ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
              }`}
            />
            <button
              onClick={() => {
                handleAddSkill(customSkillInput);
                setCustomSkillInput('');
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Quick-Pick Popular Skills */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Suggested Campus Skills:
            </span>
            <div className="flex flex-wrap gap-1">
              {COMMON_SKILLS.filter((s) => !skills.includes(s)).slice(0, 10).map((s) => (
                <button
                  key={s}
                  onClick={() => handleAddSkill(s)}
                  className={`text-[11px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    isLight 
                      ? 'bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 border-slate-200' 
                      : 'bg-slate-950 hover:bg-emerald-950/40 hover:border-emerald-800 text-slate-300 border-slate-800'
                  }`}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Experience</label>
              <select
                value={expLevel}
                onChange={(e) => setExpLevel(e.target.value as ExperienceLevel)}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              >
                <option value="BEGINNER">Beginner / Student</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Weekly Hours</label>
              <input
                type="number"
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className={`w-full p-2 rounded-xl border text-xs ${
                  isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-700'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Skill-Gap Analysis & Market Opportunities (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Quick Fit Callout */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isLight ? 'bg-gradient-to-r from-purple-50 to-emerald-50 border-purple-200' : 'bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 border-purple-800/40'
          }`}>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                Instant Qualification Summary
              </span>
              <div className="text-base font-extrabold mt-0.5">
                {highMatchGigs.length} Gigs Ready For Immediate Application
              </div>
              <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                You have a ≥70% compatibility match with {highMatchGigs.length} remote & Kenyan roles.
              </p>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-purple-600 font-mono">
                {Math.round((highMatchGigs.length / Math.max(1, store.gigs.length)) * 100)}%
              </span>
              <span className="text-[10px] block text-slate-400">Readiness</span>
            </div>
          </div>

          {/* High-Yield Skill Gaps List */}
          <div className={`p-4 rounded-2xl border space-y-3 ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Highest-Demand Skill Gaps</span>
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Skills present in top-paying listings that you can learn to expand your earning potential.
                </p>
              </div>

              <button
                onClick={onOpenGuides}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View AI Guides</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {skillGaps.map((gap) => (
                <div
                  key={gap.skill}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-purple-600 font-mono">
                        {gap.skill}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold">
                        {gap.category}
                      </span>
                    </div>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {gap.marketDescription}
                    </p>
                    <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Learn via: {gap.recommendedPlaybook}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <div className="text-sm font-extrabold text-emerald-600 font-mono">
                      ~${gap.avgRewardUsd}/task
                    </div>
                    <button
                      onClick={() => handleAddSkill(gap.skill)}
                      className="text-[10px] font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                      + I know this
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
