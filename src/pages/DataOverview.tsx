import React, { useState } from 'react';
import { BarChart3Icon, CalendarIcon, CheckCircle2Icon, FilterIcon, GlobeIcon, LightbulbIcon, MessageSquareIcon, RefreshCwIcon, ShieldCheckIcon, SparklesIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { HardwareStatusPanel } from '../components/status/HardwareStatusPanel';
import { useApp, useT } from '../contexts/AppContext';

export function DataOverview() {
  const t = useT();
  const { usedLanguagesCount, topicQueryCounts } = useApp();

  const [selectedPeriod, setSelectedPeriod] = useState<string>('today');
  const [customDateMode, setCustomDateMode] = useState<'day' | 'month' | 'year'>('day');
  const [selectedCustomDate, setSelectedCustomDate] = useState<string>('2026-09-27');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-09');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const totalQueries = Object.values(topicQueryCounts).reduce((a, b) => a + b, 0);

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today':
        return 'Today (27 Sep 2026)';
      case 'yesterday':
        return 'Yesterday (26 Sep 2026)';
      case 'week':
        return 'Last 7 Days (21–27 Sep 2026)';
      case 'month':
        return 'This Month (September 2026)';
      case 'lastMonth':
        return 'Last Month (August 2026)';
      case 'year':
        return `Year ${selectedYear}`;
      case 'customDay':
        return `Specific Date (${selectedCustomDate})`;
      case 'customMonth':
        return `Specific Month (${selectedMonth})`;
      default:
        return 'Today';
    }
  };

  const categoryStats = [
    { name: 'Schemes (PM-KISAN, PMFBY)', percentage: Math.round((topicQueryCounts.schemes / totalQueries) * 100), count: topicQueryCounts.schemes, color: 'bg-brand' },
    { name: 'Cooperative & PACS Membership', percentage: Math.round((topicQueryCounts.cooperative / totalQueries) * 100), count: topicQueryCounts.cooperative, color: 'bg-navy' },
    { name: 'Finance & KCC Loans', percentage: Math.round((topicQueryCounts.finance / totalQueries) * 100), count: topicQueryCounts.finance, color: 'bg-saffron' },
    { name: 'Grievance & Redressal', percentage: Math.round((topicQueryCounts.grievance / totalQueries) * 100), count: topicQueryCounts.grievance, color: 'bg-rose-500' },
    { name: 'Cooperative Law & Bylaws', percentage: Math.round((topicQueryCounts.law / totalQueries) * 100), count: topicQueryCounts.law, color: 'bg-emerald-600' },
  ];

  const languageStats = [
    { name: 'Hindi (हिंदी)', count: '6,224 (42%)' },
    { name: 'Tamil (தமிழ்)', count: '4,150 (28%)' },
    { name: 'English', count: '2,668 (18%)' },
    { name: 'Telugu (తెలుగు)', count: '889 (6%)' },
  ];

  return (
    <div className="page-container max-w-4xl py-6 pb-24">
      <ScreenHeader title={t('navDataOverview')} subtext="Interactive analytics, calendar date range filters & AI insights" />

      {/* User-Friendly Calendar & Period Filter Bar */}
      <section className="mt-4 rounded-card bg-paper p-5 border border-line shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-brand" />
            <h2 className="text-body font-bold text-ink">Select Period / Date:</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'lastMonth', label: 'Last Month' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSelectedPeriod(btn.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedPeriod === btn.id
                    ? 'bg-brand text-white shadow-sm'
                    : 'bg-slate-100 text-ink hover:bg-slate-200 border border-line'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Calendar Search Mode Selector */}
        <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <FilterIcon className="h-4 w-4 text-navy" />
            <span>Custom Calendar Range:</span>
            <div className="flex rounded-lg border border-line bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setCustomDateMode('day')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  customDateMode === 'day' ? 'bg-paper text-ink shadow-xs' : 'text-muted'
                }`}
              >
                By Day
              </button>
              <button
                type="button"
                onClick={() => setCustomDateMode('month')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  customDateMode === 'month' ? 'bg-paper text-ink shadow-xs' : 'text-muted'
                }`}
              >
                By Month
              </button>
              <button
                type="button"
                onClick={() => setCustomDateMode('year')}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                  customDateMode === 'year' ? 'bg-paper text-ink shadow-xs' : 'text-muted'
                }`}
              >
                By Year
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {customDateMode === 'day' && (
              <input
                type="date"
                value={selectedCustomDate}
                onChange={(e) => {
                  setSelectedCustomDate(e.target.value);
                  setSelectedPeriod('customDay');
                }}
                className="rounded-2xl border border-line bg-slate-50 px-3 py-1.5 text-xs font-bold text-ink focus:border-brand focus:outline-none"
              />
            )}

            {customDateMode === 'month' && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedPeriod('customMonth');
                }}
                className="rounded-2xl border border-line bg-slate-50 px-3 py-1.5 text-xs font-bold text-ink focus:border-brand focus:outline-none"
              />
            )}

            {customDateMode === 'year' && (
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setSelectedPeriod('year');
                }}
                className="rounded-2xl border border-line bg-slate-50 px-3 py-1.5 text-xs font-bold text-ink focus:border-brand focus:outline-none"
              >
                <option value="2026">Year 2026</option>
                <option value="2025">Year 2025</option>
                <option value="2024">Year 2024</option>
              </select>
            )}

            <button
              type="button"
              onClick={() => setSelectedPeriod('today')}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-muted hover:text-ink hover:bg-slate-200 border border-line"
              title="Reset to today"
            >
              <RefreshCwIcon className="h-3 w-3" /> Reset
            </button>
          </div>
        </div>

        {/* Active Filter Summary Badge */}
        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-muted">
          <span>Active Data Period:</span>
          <span className="rounded-md bg-brand-tint px-2.5 py-1 font-bold text-brand-dark flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
            {getPeriodLabel()}
          </span>
        </div>
      </section>

      {/* 4 KPI Strip */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-card bg-paper p-4 border border-line shadow-card">
          <div className="flex items-center justify-between">
            <UsersIcon className="h-5 w-5 text-brand" />
            <span className="text-xs font-bold text-saffron bg-saffron-tint px-2 py-0.5 rounded-full flex items-center">
              <TrendingUpIcon className="h-3 w-3 mr-0.5 text-saffron" /> +12%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-ink">1,284</div>
            <p className="text-xs font-medium text-muted mt-0.5">Active Users</p>
          </div>
        </div>

        <div className="rounded-card bg-paper p-4 border border-line shadow-card">
          <div className="flex items-center justify-between">
            <MessageSquareIcon className="h-5 w-5 text-brand" />
            <span className="text-xs font-semibold text-muted bg-line px-2 py-0.5 rounded-full">Period</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-ink">{totalQueries.toLocaleString()}</div>
            <p className="text-xs font-medium text-muted mt-0.5">Queries Answered</p>
          </div>
        </div>

        <div className="rounded-card bg-paper p-4 border border-line shadow-card">
          <div className="flex items-center justify-between">
            <CheckCircle2Icon className="h-5 w-5 text-brand" />
            <span className="text-xs font-semibold text-brand-dark bg-brand-tint px-2 py-0.5 rounded-full">Verified</span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-ink">92%</div>
            <p className="text-xs font-medium text-muted mt-0.5">Resolution Rate</p>
          </div>
        </div>

        <div className="rounded-card bg-paper p-4 border border-line shadow-card">
          <div className="flex items-center justify-between">
            <GlobeIcon className="h-5 w-5 text-brand" />
            <span className="text-xs font-semibold text-ink bg-saffron-tint px-2 py-0.5 rounded-full">
              {usedLanguagesCount} used
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-ink">{usedLanguagesCount}</div>
            <p className="text-xs font-medium text-muted mt-0.5">Languages Used</p>
          </div>
        </div>
      </div>

      {/* Sahayak AI Hardware Device Status Panel */}
      <section className="mt-8">
        <HardwareStatusPanel />
      </section>

      {/* Topic Breakdown & Language Usage */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Topic Queries */}
        <section className="rounded-card bg-paper p-5 border border-line shadow-card">
          <h2 className="text-title text-ink font-bold flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5 text-brand" />
            Topic Queries ({totalQueries.toLocaleString()})
          </h2>
          <div className="mt-4 space-y-4">
            {categoryStats.map((stat) => (
              <div key={stat.name}>
                <div className="flex justify-between text-xs font-semibold text-ink mb-1">
                  <span>{stat.name}</span>
                  <span>{stat.count.toLocaleString()} ({isNaN(stat.percentage) ? 0 : stat.percentage}%)</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-line overflow-hidden">
                  <div className={`h-full ${stat.color} rounded-full transition-all duration-300`} style={{ width: `${isNaN(stat.percentage) ? 0 : stat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Language Usage */}
        <section className="rounded-card bg-paper p-5 border border-line shadow-card">
          <h2 className="text-title text-ink font-bold flex items-center gap-2">
            <GlobeIcon className="h-5 w-5 text-brand" />
            Used Languages Breakdown
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {languageStats.map((lang) => (
              <li key={lang.name} className="py-2.5 flex justify-between items-center text-small">
                <span className="font-semibold text-ink">{lang.name}</span>
                <span className="text-muted font-medium">{lang.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Accuracy & Verification Source Metrics */}
      <section className="mt-8 rounded-card bg-paper p-5 border border-line shadow-card">
        <h2 className="text-title text-ink font-bold flex items-center gap-2">
          <ShieldCheckIcon className="h-5 w-5 text-brand" />
          Government Verification Status
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-brand-tint border border-brand/20">
            <p className="text-2xl font-bold text-brand-dark">92%</p>
            <p className="text-xs font-medium text-ink mt-1">Verified Official Sources</p>
          </div>
          <div className="p-4 rounded-2xl bg-saffron-tint border border-saffron/20">
            <p className="text-2xl font-bold text-ink">6%</p>
            <p className="text-xs font-medium text-ink mt-1">Partial / Society Specific</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 border border-line">
            <p className="text-2xl font-bold text-muted">2%</p>
            <p className="text-xs font-medium text-muted mt-1">Operator Escalated</p>
          </div>
        </div>
      </section>

      {/* AI Predictive Analytics & Insights (Placed at the bottom) */}
      <section className="mt-8 rounded-card bg-gradient-to-br from-paper to-slate-50 p-5 border-2 border-brand/30 shadow-card">
        <h2 className="text-title text-ink font-bold flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-saffron fill-saffron" />
          AI Predictive Insights & Smart Recommendations
        </h2>
        <p className="text-xs text-muted mt-0.5">
          Automated demand forecasting based on {getPeriodLabel()} query activity.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Prediction 1 */}
          <div className="rounded-2xl border border-saffron/30 bg-saffron-tint/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-ink mb-1">
              <LightbulbIcon className="h-4 w-4 text-saffron" />
              Rabi Season Spike Forecast
            </div>
            <p className="text-xs text-ink leading-relaxed">
              PM-KISAN & PMFBY queries are predicted to surge by <strong>+45%</strong> before Dec 31.
            </p>
            <div className="mt-3 rounded-xl bg-paper p-2 text-[11px] font-semibold text-brand-dark border border-line">
              💡 Recommendation: Deploy 2 additional CSC operators on Monday mornings.
            </div>
          </div>

          {/* Prediction 2 */}
          <div className="rounded-2xl border border-brand/30 bg-brand-tint/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-dark mb-1">
              <GlobeIcon className="h-4 w-4 text-brand" />
              Voice Language Demand
            </div>
            <p className="text-xs text-ink leading-relaxed">
              Hindi & Tamil spoken queries represent <strong>70%</strong> of total kiosk interactions.
            </p>
            <div className="mt-3 rounded-xl bg-paper p-2 text-[11px] font-semibold text-brand-dark border border-line">
              💡 Recommendation: Ensure offline voice packs for Tamil/Hindi are synced.
            </div>
          </div>

          {/* Prediction 3 */}
          <div className="rounded-2xl border border-navy/30 bg-navy-tint/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-navy mb-1">
              <TrendingUpIcon className="h-4 w-4 text-navy" />
              PACS Membership Demand
            </div>
            <p className="text-xs text-ink leading-relaxed">
              PACS membership & dividend inquiries jumped <strong>+26%</strong> post-AGM notice.
            </p>
            <div className="mt-3 rounded-xl bg-paper p-2 text-[11px] font-semibold text-navy border border-line">
              💡 Recommendation: Keep 50+ printed PACS membership forms ready.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
