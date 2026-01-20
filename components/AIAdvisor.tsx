import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { generateBusinessInsights } from '../services/geminiService.ts';
import { BusinessProfile, KPIMetrics, DailySales } from '../types.ts';
import ReactMarkdown from 'react-markdown';

interface AIAdvisorProps {
  profile: BusinessProfile;
  kpi: KPIMetrics;
  data: DailySales[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ profile, kpi, data }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await generateBusinessInsights(profile, kpi, data);
      setInsight(result);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Sparkles size={20} />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Intelligent Insights</h3>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${loading 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
            }`}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>{insight ? 'Refresh Analysis' : 'Generate Report'}</span>
            </>
          )}
        </button>
      </div>

      <div className="relative z-10 min-h-[100px]">
        {!insight && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
            <Sparkles size={32} className="mb-3 opacity-20" />
            <p className="text-sm">Click generate to let AI analyze your business performance.</p>
          </div>
        )}

        {loading && (
          <div className="space-y-3 py-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800 rounded w-full"></div>
            <div className="h-4 bg-slate-800 rounded w-5/6"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-400 py-4 bg-red-900/10 rounded-lg px-4 border border-red-900/20">
            <AlertCircle size={20} />
            <span className="text-sm">Failed to generate insights. Please try again.</span>
          </div>
        )}

        {insight && !loading && (
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
             {/* Simple markdown rendering without external lib for simplicity, or just plain text if markdown not parsed */}
             <div className="whitespace-pre-wrap leading-relaxed">
               {insight.split('\n').map((line, i) => {
                 // Basic manual markdown parsing for bold
                 const parts = line.split('**');
                 return (
                   <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-slate-100 mt-4' : ''} ${line.startsWith('-') ? 'ml-4' : ''}`}>
                     {parts.map((part, index) => 
                       index % 2 === 1 ? <strong key={index} className="text-indigo-300">{part}</strong> : part
                     )}
                   </p>
                 );
               })}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};