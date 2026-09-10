/**
 * FinSmart Protected Admin & Research Data Management Module
 * Provides passcode-protected administrative access, response inspection,
 * RFC-4180 CSV export for researchers, and dataset reset utilities.
 */

import { state } from './state.js';
import { showToast } from './router.js';

let isAdminAuthenticated = false;

export function renderAdminDashboard(container) {
  if (!container) return;

  if (!isAdminAuthenticated) {
    renderAdminLogin(container);
    return;
  }

  const dataset = state.researchData || [];
  const total = dataset.length;

  const avgOverall = Math.round(dataset.reduce((acc, r) => acc + (r.overall_score || 0), 0) / (total || 1));
  const avgKnowledge = Math.round(dataset.reduce((acc, r) => acc + (r.knowledge_score || 0), 0) / (total || 1));
  const avgSaving = Math.round(dataset.reduce((acc, r) => acc + (r.saving_score || 0), 0) / (total || 1));
  const avgInvesting = Math.round(dataset.reduce((acc, r) => acc + (r.investment_score || 0), 0) / (total || 1));
  const avgDebt = Math.round(dataset.reduce((acc, r) => acc + (r.debt_score || 0), 0) / (total || 1));
  const avgInsurance = Math.round(dataset.reduce((acc, r) => acc + (r.insurance_score || 0), 0) / (total || 1));

  const recentRows = dataset.slice(0, 15);

  const html = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Admin Top Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <i data-lucide="shield-alert" class="w-3.5 h-3.5"></i> Admin Control Panel
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Research Data Repository</h1>
          <p class="text-slate-600 text-xs sm:text-sm mt-1">
            Manage respondent datasets, download research CSV exports, and monitor incoming survey submissions.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-export-csv" type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition">
            <i data-lucide="download" class="w-4 h-4"></i> Export Dataset (CSV)
          </button>
          <button id="btn-reset-data" type="button" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 text-xs sm:text-sm transition">
            <i data-lucide="refresh-cw" class="w-4 h-4"></i> Re-seed Base Data
          </button>
          <button id="btn-admin-logout" type="button" class="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition">
            <i data-lucide="log-out" class="w-4 h-4"></i> Logout
          </button>
        </div>
      </div>

      <!-- Overview Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Total Records</span>
          <strong class="text-xl font-bold text-slate-900 block mt-1">${total.toLocaleString('en-IN')}</strong>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Overall Avg</span>
          <strong class="text-xl font-bold text-emerald-700 block mt-1">${avgOverall}%</strong>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Knowledge</span>
          <strong class="text-xl font-bold text-slate-800 block mt-1">${avgKnowledge}%</strong>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Saving</span>
          <strong class="text-xl font-bold text-slate-800 block mt-1">${avgSaving}%</strong>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Investing</span>
          <strong class="text-xl font-bold text-slate-800 block mt-1">${avgInvesting}%</strong>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span class="text-[11px] font-semibold text-slate-600 block">Insurance</span>
          <strong class="text-xl font-bold text-slate-800 block mt-1">${avgInsurance}%</strong>
        </div>
      </div>

      <!-- Recent Records Table -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Recent Anonymous Submissions (Preview)</h2>
            <p class="text-xs text-slate-600 mt-0.5">Showing last 15 recorded submissions. Full dataset available via CSV download.</p>
          </div>
          <span class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Zero PII Stored
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th class="p-3.5">ID</th>
                <th class="p-3.5">Age Cohort</th>
                <th class="p-3.5">Education</th>
                <th class="p-3.5">Occupation</th>
                <th class="p-3.5">Income Bracket</th>
                <th class="p-3.5">Region</th>
                <th class="p-3.5">Overall</th>
                <th class="p-3.5">Level</th>
                <th class="p-3.5">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${recentRows.map(row => `
                <tr class="hover:bg-slate-50/80 transition">
                  <td class="p-3.5 font-mono text-slate-500">${row.id}</td>
                  <td class="p-3.5 font-medium text-slate-800">${row.age_group}</td>
                  <td class="p-3.5 text-slate-600">${row.education}</td>
                  <td class="p-3.5 text-slate-600">${row.occupation}</td>
                  <td class="p-3.5 text-slate-600">${row.income_range}</td>
                  <td class="p-3.5 text-slate-600">${row.location}</td>
                  <td class="p-3.5 font-bold text-slate-900">${row.overall_score}%</td>
                  <td class="p-3.5">
                    <span class="px-2 py-0.5 rounded-md font-semibold ${
                      row.literacy_level === 'Excellent' ? 'bg-emerald-50 text-emerald-700' :
                      row.literacy_level === 'Good' ? 'bg-teal-50 text-teal-700' :
                      row.literacy_level === 'Developing' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                    }">
                      ${row.literacy_level}
                    </span>
                  </td>
                  <td class="p-3.5 text-slate-500 whitespace-nowrap">${row.created_at || 'Recent'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Attach CSV Export
  container.querySelector('#btn-export-csv')?.addEventListener('click', () => {
    exportDatasetAsCSV(dataset);
  });

  // Attach Re-seed
  container.querySelector('#btn-reset-data')?.addEventListener('click', () => {
    if (confirm('Re-seed survey research dataset back to baseline 1,420 records?')) {
      state.resetResearchData();
      renderAdminDashboard(container);
      showToast('Research dataset successfully re-seeded.', 'success');
    }
  });

  // Logout
  container.querySelector('#btn-admin-logout')?.addEventListener('click', () => {
    isAdminAuthenticated = false;
    renderAdminDashboard(container);
    showToast('Logged out of Admin Panel.', 'info');
  });
}

function renderAdminLogin(container) {
  container.innerHTML = `
    <div class="max-w-md mx-auto px-4 py-16">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center">
        <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <i data-lucide="lock" class="w-6 h-6"></i>
        </div>

        <h1 class="text-2xl font-bold text-slate-900">Admin Authentication</h1>
        <p class="text-xs text-slate-600 mt-1">
          Access is restricted to authorized financial researchers and platform administrators.
        </p>

        <form id="admin-login-form" class="mt-6 space-y-4 text-left" onsubmit="return false;">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Administrative Passcode</label>
            <input 
              type="password" 
              id="admin-passcode" 
              placeholder="Enter admin passcode" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500">
          </div>

          <div id="login-error" class="text-rose-600 text-xs hidden font-medium">
            Incorrect passcode. Please try again.
          </div>

          <button 
            type="submit" 
            id="btn-admin-submit" 
            class="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition">
            Unlock Admin Panel
          </button>

          <!-- Convenient Quick Helper for Demo Evaluation -->
          <div class="pt-3 border-t border-slate-100 text-center">
            <button 
              type="button" 
              id="btn-quick-fill-admin" 
              class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline">
              Demo Helper: Fill default passcode ("admin123")
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const form = container.querySelector('#admin-login-form');
  const passInput = container.querySelector('#admin-passcode');
  const errEl = container.querySelector('#login-error');
  const quickBtn = container.querySelector('#btn-quick-fill-admin');

  quickBtn?.addEventListener('click', () => {
    passInput.value = 'admin123';
  });

  form?.addEventListener('submit', () => {
    if (passInput.value.trim() === 'admin123') {
      isAdminAuthenticated = true;
      renderAdminDashboard(container);
      showToast('Welcome to the Admin Management Panel!', 'success');
    } else {
      errEl?.classList.remove('hidden');
    }
  });
}

/**
 * Downloads full research dataset as a standard CSV file
 */
function exportDatasetAsCSV(data) {
  if (!data || data.length === 0) {
    showToast('No records available to export.', 'error');
    return;
  }

  const headers = [
    'Respondent_ID',
    'Age_Group',
    'Education',
    'Occupation',
    'Income_Range',
    'Location',
    'Overall_Score',
    'Knowledge_Score',
    'Saving_Score',
    'Investment_Score',
    'Debt_Score',
    'Insurance_Score',
    'Literacy_Level',
    'Budgets_Regularly',
    'Invests',
    'Has_Emergency_Fund',
    'Has_Insurance',
    'Submission_Date'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = data.map(r => [
    escapeCSV(r.id),
    escapeCSV(r.age_group),
    escapeCSV(r.education),
    escapeCSV(r.occupation),
    escapeCSV(r.income_range),
    escapeCSV(r.location),
    r.overall_score,
    r.knowledge_score,
    r.saving_score,
    r.investment_score,
    r.debt_score,
    r.insurance_score,
    escapeCSV(r.literacy_level),
    r.budgetsRegularly ? 'YES' : 'NO',
    r.invests ? 'YES' : 'NO',
    r.hasEmergencyFund ? 'YES' : 'NO',
    r.hasInsurance ? 'YES' : 'NO',
    escapeCSV(r.created_at || '')
  ].join(','));

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `FinSmart_Survey_Research_Dataset_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast(`Downloaded CSV with ${data.length} anonymous respondent records.`, 'success');
}
