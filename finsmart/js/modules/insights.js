/**
 * FinSmart Survey Insights & Research Dashboard
 * Aggregated analytics engine visualizing anonymous survey metrics across demographic segments.
 * Features 6 dynamic Chart.js visualizations and real-time multi-criteria filtering.
 */

import { state } from './state.js';
import { AGE_GROUPS, EDUCATION_LEVELS, OCCUPATIONS, INCOME_RANGES } from '../data/sampleResearchData.js';

let chartInstances = {
  distribution: null,
  categories: null,
  habits: null,
  byAge: null,
  byEducation: null,
  byIncome: null
};

export function renderInsightsDashboard(container) {
  if (!container) return;

  const dataset = state.researchData || [];

  const html = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Insights Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <i data-lucide="bar-chart-2" class="w-3.5 h-3.5"></i> Aggregated Analytics
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Survey Insights & Research Observatory</h1>
          <p class="text-slate-600 text-xs sm:text-sm mt-1">
            Empirical data from respondents across India. Aggregated & 100% anonymized.
          </p>
        </div>

        <!-- Privacy Shield Badge -->
        <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 self-start md:self-auto">
          <i data-lucide="lock" class="w-4 h-4 text-emerald-600"></i>
          <span>Strict Anonymity: Zero PII Collected</span>
        </div>
      </div>

      <!-- Demographic Filter Bar Card -->
      <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 mb-8">
        <div class="flex items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
            <i data-lucide="filter" class="w-4 h-4 text-emerald-600"></i> Demographic Segmentation Filters
          </div>
          <button id="btn-reset-filters" type="button" class="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset All Filters
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Age Group</label>
            <select id="filter-age" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
              <option value="all">All Age Groups</option>
              ${AGE_GROUPS.map(g => `<option value="${g}">${g}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Education Level</label>
            <select id="filter-edu" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
              <option value="all">All Education Levels</option>
              ${EDUCATION_LEVELS.map(e => `<option value="${e}">${e}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Primary Occupation</label>
            <select id="filter-occ" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
              <option value="all">All Occupations</option>
              ${OCCUPATIONS.map(o => `<option value="${o}">${o}</option>`).join('')}
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-700 mb-1">Annual Income Range</label>
            <select id="filter-inc" class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
              <option value="all">All Income Brackets</option>
              ${INCOME_RANGES.map(i => `<option value="${i}">${i}</option>`).join('')}
            </select>
          </div>
        </div>
      </div>

      <!-- Metric Summary KPI Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8" id="insights-kpis">
        <!-- Rendered dynamically -->
      </div>

      <!-- 6 Interactive Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart 1: Overall Score Distribution -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">1. Literacy Score Distribution</h3>
              <p class="text-xs text-slate-600 mt-0.5">Distribution across Beginner to Excellent tiers</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="pie-chart" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-distribution"></canvas>
          </div>
        </div>

        <!-- Chart 2: Performance by Category -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">2. Performance by Pillar</h3>
              <p class="text-xs text-slate-600 mt-0.5">Average score (%) across 5 financial areas</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="activity" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-categories"></canvas>
          </div>
        </div>

        <!-- Chart 3: Financial Habits Adoption -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">3. Practical Financial Habits</h3>
              <p class="text-xs text-slate-600 mt-0.5">% of respondents actively maintaining key habits</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="check-square" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-habits"></canvas>
          </div>
        </div>

        <!-- Chart 4: Literacy by Age Group -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">4. Literacy by Age Group</h3>
              <p class="text-xs text-slate-600 mt-0.5">Mean literacy score progression across age cohorts</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="users" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-age"></canvas>
          </div>
        </div>

        <!-- Chart 5: Literacy by Education Level -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">5. Literacy by Education Level</h3>
              <p class="text-xs text-slate-600 mt-0.5">Mean score relative to academic attainment</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="graduation-cap" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-edu"></canvas>
          </div>
        </div>

        <!-- Chart 6: Literacy by Income Range -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">6. Literacy by Income Range</h3>
              <p class="text-xs text-slate-600 mt-0.5">Financial literacy across income brackets (₹ INR)</p>
            </div>
            <span class="p-2 rounded-xl bg-slate-50 text-slate-600"><i data-lucide="trending-up" class="w-4 h-4"></i></span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-income"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Attach filter events
  const filterAge = container.querySelector('#filter-age');
  const filterEdu = container.querySelector('#filter-edu');
  const filterOcc = container.querySelector('#filter-occ');
  const filterInc = container.querySelector('#filter-inc');
  const btnReset = container.querySelector('#btn-reset-filters');

  const updateCharts = () => {
    const ageVal = filterAge.value;
    const eduVal = filterEdu.value;
    const occVal = filterOcc.value;
    const incVal = filterInc.value;

    let filtered = dataset.filter(row => {
      if (ageVal !== 'all' && row.age_group !== ageVal) return false;
      if (eduVal !== 'all' && row.education !== eduVal) return false;
      if (occVal !== 'all' && row.occupation !== occVal) return false;
      if (incVal !== 'all' && row.income_range !== incVal) return false;
      return true;
    });

    renderMetricsAndCharts(filtered);
  };

  [filterAge, filterEdu, filterOcc, filterInc].forEach(f => f.addEventListener('change', updateCharts));

  btnReset?.addEventListener('click', () => {
    filterAge.value = 'all';
    filterEdu.value = 'all';
    filterOcc.value = 'all';
    filterInc.value = 'all';
    updateCharts();
  });

  updateCharts();
}

function renderMetricsAndCharts(filteredData) {
  const total = filteredData.length;

  if (total === 0) {
    document.getElementById('insights-kpis').innerHTML = `
      <div class="col-span-full bg-amber-50 text-amber-800 p-4 rounded-2xl text-center text-xs font-semibold">
        No respondents match the selected filter combination. Please broaden your demographic filter selection.
      </div>
    `;
    return;
  }

  // Calculate Aggregates
  const avgOverall = Math.round(filteredData.reduce((acc, r) => acc + (r.overall_score || 0), 0) / total);
  const avgKnowledge = Math.round(filteredData.reduce((acc, r) => acc + (r.knowledge_score || 0), 0) / total);
  const pctBudget = Math.round((filteredData.filter(r => r.budgetsRegularly).length / total) * 100);
  const pctInvest = Math.round((filteredData.filter(r => r.invests).length / total) * 100);
  const pctEmergency = Math.round((filteredData.filter(r => r.hasEmergencyFund).length / total) * 100);

  // Render KPI cards
  const kpiEl = document.getElementById('insights-kpis');
  if (kpiEl) {
    kpiEl.innerHTML = `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Total Sample</span>
        <strong class="text-xl font-bold text-slate-900 block mt-1">${total.toLocaleString('en-IN')}</strong>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Avg Score</span>
        <strong class="text-xl font-bold text-emerald-700 block mt-1">${avgOverall} / 100</strong>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Knowledge Avg</span>
        <strong class="text-xl font-bold text-teal-700 block mt-1">${avgKnowledge}%</strong>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Maintain Budget</span>
        <strong class="text-xl font-bold text-slate-900 block mt-1">${pctBudget}%</strong>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Actively Invest</span>
        <strong class="text-xl font-bold text-slate-900 block mt-1">${pctInvest}%</strong>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs text-center">
        <span class="text-[11px] font-semibold text-slate-600 block">Emergency Fund</span>
        <strong class="text-xl font-bold text-slate-900 block mt-1">${pctEmergency}%</strong>
      </div>
    `;
  }

  // Destroy old charts
  Object.keys(chartInstances).forEach(k => {
    if (chartInstances[k]) {
      chartInstances[k].destroy();
      chartInstances[k] = null;
    }
  });

  // 1. Distribution Chart (Doughnut / Bar)
  const distCounts = {
    Beginner: filteredData.filter(r => r.overall_score <= 40).length,
    Developing: filteredData.filter(r => r.overall_score > 40 && r.overall_score <= 60).length,
    Good: filteredData.filter(r => r.overall_score > 60 && r.overall_score <= 80).length,
    Excellent: filteredData.filter(r => r.overall_score > 80).length
  };

  const ctxDist = document.getElementById('chart-distribution')?.getContext('2d');
  if (ctxDist) {
    chartInstances.distribution = new Chart(ctxDist, {
      type: 'doughnut',
      data: {
        labels: ['Beginner (0-40)', 'Developing (41-60)', 'Good (61-80)', 'Excellent (81-100)'],
        datasets: [{
          data: [distCounts.Beginner, distCounts.Developing, distCounts.Good, distCounts.Excellent],
          backgroundColor: ['#EF4444', '#F59E0B', '#0284C7', '#10B981'],
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { size: 10 } } }
        },
        cutout: '65%'
      }
    });
  }

  // 2. Category Performance (Radar or Horizontal Bar)
  const catAvgs = {
    knowledge: Math.round(filteredData.reduce((acc, r) => acc + (r.knowledge_score || 0), 0) / total),
    saving: Math.round(filteredData.reduce((acc, r) => acc + (r.saving_score || 0), 0) / total),
    investing: Math.round(filteredData.reduce((acc, r) => acc + (r.investment_score || 0), 0) / total),
    debt: Math.round(filteredData.reduce((acc, r) => acc + (r.debt_score || 0), 0) / total),
    insurance: Math.round(filteredData.reduce((acc, r) => acc + (r.insurance_score || 0), 0) / total)
  };

  const ctxCat = document.getElementById('chart-categories')?.getContext('2d');
  if (ctxCat) {
    chartInstances.categories = new Chart(ctxCat, {
      type: 'bar',
      data: {
        labels: ['Knowledge', 'Saving', 'Investing', 'Debt', 'Insurance'],
        datasets: [{
          label: 'Average Score (%)',
          data: [catAvgs.knowledge, catAvgs.saving, catAvgs.investing, catAvgs.debt, catAvgs.insurance],
          backgroundColor: ['#0B192C', '#0284C7', '#10B981', '#F59E0B', '#8B5CF6'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, ticks: { callback: v => `${v}%`, font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  // 3. Habits Chart
  const ctxHabits = document.getElementById('chart-habits')?.getContext('2d');
  if (ctxHabits) {
    const pctSaveRegular = Math.round((filteredData.filter(r => r.savesRegularly).length / total) * 100);
    const pctInsured = Math.round((filteredData.filter(r => r.hasInsurance).length / total) * 100);

    chartInstances.habits = new Chart(ctxHabits, {
      type: 'bar',
      data: {
        labels: ['Budget Regularly', 'Save Regularly', 'Invest', 'Emergency Fund', 'Insurance'],
        datasets: [{
          label: 'Adoption Rate (%)',
          data: [pctBudget, pctSaveRegular, pctInvest, pctEmergency, pctInsured],
          backgroundColor: '#10B981',
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { min: 0, max: 100, ticks: { callback: v => `${v}%`, font: { size: 10 } } },
          y: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }

  // 4. By Age Chart
  const ctxAge = document.getElementById('chart-age')?.getContext('2d');
  if (ctxAge) {
    const ageAvgs = AGE_GROUPS.map(grp => {
      const cohort = filteredData.filter(r => r.age_group === grp);
      return cohort.length > 0 
        ? Math.round(cohort.reduce((acc, r) => acc + r.overall_score, 0) / cohort.length) 
        : 0;
    });

    chartInstances.byAge = new Chart(ctxAge, {
      type: 'bar',
      data: {
        labels: AGE_GROUPS,
        datasets: [{
          label: 'Average Score',
          data: ageAvgs,
          backgroundColor: '#1E3E62',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
        }
      }
    });
  }

  // 5. By Education Chart
  const ctxEdu = document.getElementById('chart-edu')?.getContext('2d');
  if (ctxEdu) {
    const eduAvgs = EDUCATION_LEVELS.map(lvl => {
      const cohort = filteredData.filter(r => r.education === lvl);
      return cohort.length > 0 
        ? Math.round(cohort.reduce((acc, r) => acc + r.overall_score, 0) / cohort.length) 
        : 0;
    });

    chartInstances.byEducation = new Chart(ctxEdu, {
      type: 'bar',
      data: {
        labels: ['High School', 'Undergrad', 'Postgrad', 'Ph.D.', 'Other'],
        datasets: [{
          label: 'Average Score',
          data: eduAvgs,
          backgroundColor: '#0284C7',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 9 } } }
        }
      }
    });
  }

  // 6. By Income Range Chart
  const ctxInc = document.getElementById('chart-income')?.getContext('2d');
  if (ctxInc) {
    const incAvgs = INCOME_RANGES.map(rng => {
      const cohort = filteredData.filter(r => r.income_range === rng);
      return cohort.length > 0 
        ? Math.round(cohort.reduce((acc, r) => acc + r.overall_score, 0) / cohort.length) 
        : 0;
    });

    chartInstances.byIncome = new Chart(ctxInc, {
      type: 'line',
      data: {
        labels: ['< ₹2.5L', '₹2.5L-₹5L', '₹5L-₹10L', '₹10L-₹20L', '> ₹20L'],
        datasets: [{
          label: 'Average Score',
          data: incAvgs,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, ticks: { font: { size: 10 } } },
          x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }
}
