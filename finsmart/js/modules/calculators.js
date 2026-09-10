/**
 * FinSmart Financial Calculators Engine
 * Implements 5 interactive calculators formatted in Indian Rupees (₹):
 * 1. Compound Interest / SIP Calculator (with growth projection chart)
 * 2. Savings & Cash Flow Calculator
 * 3. Loan EMI Calculator (with Principal vs Interest donut chart)
 * 4. 50/30/20 Budget Breakdown Calculator (with expense category chart)
 * 5. Emergency Fund Target Calculator
 */

let activeCalcTab = 'compound';
let calcChartInstance = null;

export const formatINR = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val || 0);
};

export function renderCalculators(container) {
  if (!container) return;

  const tabs = [
    { id: 'compound', label: 'Compound Interest', icon: 'trending-up' },
    { id: 'emi', label: 'Loan EMI', icon: 'percent' },
    { id: 'budget', label: 'Budget Planner', icon: 'pie-chart' },
    { id: 'savings', label: 'Savings & Surplus', icon: 'piggy-bank' },
    { id: 'emergency', label: 'Emergency Fund', icon: 'shield-alert' }
  ];

  const html = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Calculators Header -->
      <div class="text-center max-w-3xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <i data-lucide="calculator" class="w-3.5 h-3.5"></i> Interactive Financial Tools
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Financial Simulators in Indian Rupees (₹)
        </h1>
        <p class="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Simulate your wealth growth, optimize debt repayments, and benchmark your budget against recommended financial ratios.
        </p>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 mb-8 gap-2 scrollbar-none" id="calc-tabs">
        ${tabs.map(t => `
          <button 
            type="button" 
            class="calc-tab-btn shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${activeCalcTab === t.id ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
            data-tab="${t.id}">
            <i data-lucide="${t.icon}" class="w-4 h-4"></i> ${t.label}
          </button>
        `).join('')}
      </div>

      <!-- Active Calculator Container -->
      <div id="active-calculator-content" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Tab listeners
  container.querySelectorAll('.calc-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCalcTab = btn.getAttribute('data-tab');
      container.querySelectorAll('.calc-tab-btn').forEach(b => {
        b.className = `calc-tab-btn shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${b.getAttribute('data-tab') === activeCalcTab ? 'bg-navy-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`;
      });
      renderActiveCalculator();
    });
  });

  renderActiveCalculator();
}

function renderActiveCalculator() {
  const contentEl = document.getElementById('active-calculator-content');
  if (!contentEl) return;

  if (calcChartInstance) {
    calcChartInstance.destroy();
    calcChartInstance = null;
  }

  switch (activeCalcTab) {
    case 'compound':
      renderCompoundCalculator(contentEl);
      break;
    case 'emi':
      renderEmiCalculator(contentEl);
      break;
    case 'budget':
      renderBudgetCalculator(contentEl);
      break;
    case 'savings':
      renderSavingsCalculator(contentEl);
      break;
    case 'emergency':
      renderEmergencyCalculator(contentEl);
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

// -------------------------------------------------------------
// 1. COMPOUND INTEREST / SIP CALCULATOR
// -------------------------------------------------------------
function renderCompoundCalculator(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Inputs Column -->
      <div class="lg:col-span-6 space-y-5">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Compound Interest & SIP Calculator</h2>
          <p class="text-xs text-slate-600 mt-1">See how regular monthly investments snowball into substantial wealth over time.</p>
        </div>

        <!-- Initial Lumpsum -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Initial Investment (Lumpsum)</span>
            <span id="label-ci-init" class="font-bold text-emerald-800">₹25,000</span>
          </div>
          <input type="range" id="ci-init" min="0" max="1000000" step="5000" value="25000" class="w-full accent-emerald-600">
        </div>

        <!-- Monthly Contribution -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Monthly Contribution (SIP)</span>
            <span id="label-ci-monthly" class="font-bold text-emerald-800">₹10,000</span>
          </div>
          <input type="range" id="ci-monthly" min="500" max="200000" step="500" value="10000" class="w-full accent-emerald-600">
        </div>

        <!-- Annual Return Rate -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Expected Annual Return (%)</span>
            <span id="label-ci-rate" class="font-bold text-emerald-800">12%</span>
          </div>
          <input type="range" id="ci-rate" min="1" max="30" step="0.5" value="12" class="w-full accent-emerald-600">
        </div>

        <!-- Time Horizon -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Time Period (Years)</span>
            <span id="label-ci-years" class="font-bold text-emerald-800">15 Years</span>
          </div>
          <input type="range" id="ci-years" min="1" max="35" step="1" value="15" class="w-full accent-emerald-600">
        </div>
      </div>

      <!-- Results & Chart Column -->
      <div class="lg:col-span-6 flex flex-col justify-between">
        <!-- Output Metric Cards -->
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
            <span class="text-[11px] font-semibold text-slate-600 block">Total Invested</span>
            <strong id="ci-total-invested" class="text-sm sm:text-base font-bold text-slate-900 block mt-1">₹0</strong>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
            <span class="text-[11px] font-semibold text-slate-600 block">Interest Earned</span>
            <strong id="ci-total-interest" class="text-sm sm:text-base font-bold text-emerald-700 block mt-1">₹0</strong>
          </div>
          <div class="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
            <span class="text-[11px] font-semibold text-emerald-800 block">Final Corpus</span>
            <strong id="ci-final-amount" class="text-sm sm:text-base font-extrabold text-emerald-900 block mt-1">₹0</strong>
          </div>
        </div>

        <!-- Chart -->
        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-64 relative">
          <canvas id="ci-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  const inputInit = container.querySelector('#ci-init');
  const inputMonthly = container.querySelector('#ci-monthly');
  const inputRate = container.querySelector('#ci-rate');
  const inputYears = container.querySelector('#ci-years');

  const update = () => {
    const P = parseFloat(inputInit.value);
    const PMT = parseFloat(inputMonthly.value);
    const r = parseFloat(inputRate.value) / 100;
    const years = parseInt(inputYears.value, 10);

    container.querySelector('#label-ci-init').textContent = formatINR(P);
    container.querySelector('#label-ci-monthly').textContent = formatINR(PMT);
    container.querySelector('#label-ci-rate').textContent = `${inputRate.value}%`;
    container.querySelector('#label-ci-years').textContent = `${years} Years`;

    // Monthly compounding calculations
    const n = 12;
    const labels = [];
    const investedData = [];
    const corpusData = [];

    let currentCorpus = P;
    let totalInvested = P;

    labels.push('Yr 0');
    investedData.push(totalInvested);
    corpusData.push(Math.round(currentCorpus));

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= n; m++) {
        currentCorpus = (currentCorpus + PMT) * (1 + r / n);
        totalInvested += PMT;
      }
      labels.push(`Yr ${y}`);
      investedData.push(totalInvested);
      corpusData.push(Math.round(currentCorpus));
    }

    const interestEarned = Math.round(currentCorpus - totalInvested);

    container.querySelector('#ci-total-invested').textContent = formatINR(totalInvested);
    container.querySelector('#ci-total-interest').textContent = formatINR(interestEarned);
    container.querySelector('#ci-final-amount').textContent = formatINR(Math.round(currentCorpus));

    // Update Chart
    const ctx = document.getElementById('ci-chart')?.getContext('2d');
    if (!ctx) return;

    if (calcChartInstance) {
      calcChartInstance.data.labels = labels;
      calcChartInstance.data.datasets[0].data = investedData;
      calcChartInstance.data.datasets[1].data = corpusData;
      calcChartInstance.update();
    } else {
      calcChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Amount Invested',
              data: investedData,
              borderColor: '#94A3B8',
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.3
            },
            {
              label: 'Final Wealth Corpus',
              data: corpusData,
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              borderWidth: 3,
              fill: true,
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { font: { size: 10 } } },
            tooltip: {
              callbacks: {
                label: (context) => `${context.dataset.label}: ${formatINR(context.raw)}`
              }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: {
              ticks: {
                font: { size: 10 },
                callback: (val) => '₹' + (val >= 100000 ? (val / 100000).toFixed(1) + 'L' : val)
              }
            }
          }
        }
      });
    }
  };

  [inputInit, inputMonthly, inputRate, inputYears].forEach(el => el.addEventListener('input', update));
  update();
}

// -------------------------------------------------------------
// 2. LOAN EMI CALCULATOR
// -------------------------------------------------------------
function renderEmiCalculator(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Inputs Column -->
      <div class="lg:col-span-6 space-y-5">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Loan EMI & Amortization Calculator</h2>
          <p class="text-xs text-slate-600 mt-1">Calculate your monthly equated installment and total interest payable on loans.</p>
        </div>

        <!-- Loan Amount -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Loan Principal Amount</span>
            <span id="label-emi-amount" class="font-bold text-emerald-800">₹25,00,000</span>
          </div>
          <input type="range" id="emi-amount" min="50000" max="10000000" step="50000" value="2500000" class="w-full accent-emerald-600">
        </div>

        <!-- Interest Rate -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Interest Rate (% per annum)</span>
            <span id="label-emi-rate" class="font-bold text-emerald-800">8.5%</span>
          </div>
          <input type="range" id="emi-rate" min="5" max="25" step="0.25" value="8.5" class="w-full accent-emerald-600">
        </div>

        <!-- Loan Tenure -->
        <div>
          <div class="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Loan Tenure (Years)</span>
            <span id="label-emi-years" class="font-bold text-emerald-800">20 Years</span>
          </div>
          <input type="range" id="emi-years" min="1" max="30" step="1" value="20" class="w-full accent-emerald-600">
        </div>
      </div>

      <!-- Results & Donut Column -->
      <div class="lg:col-span-6 flex flex-col justify-between">
        <div class="grid grid-cols-3 gap-3 mb-5">
          <div class="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
            <span class="text-[11px] font-semibold text-emerald-800 block">Monthly EMI</span>
            <strong id="emi-monthly" class="text-sm sm:text-base font-extrabold text-emerald-900 block mt-1">₹0</strong>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
            <span class="text-[11px] font-semibold text-slate-600 block">Total Interest</span>
            <strong id="emi-total-interest" class="text-sm sm:text-base font-bold text-amber-700 block mt-1">₹0</strong>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
            <span class="text-[11px] font-semibold text-slate-600 block">Total Repayment</span>
            <strong id="emi-total-payment" class="text-sm sm:text-base font-bold text-slate-900 block mt-1">₹0</strong>
          </div>
        </div>

        <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-64 relative flex items-center justify-center">
          <canvas id="emi-chart"></canvas>
        </div>
      </div>
    </div>
  `;

  const inputAmount = container.querySelector('#emi-amount');
  const inputRate = container.querySelector('#emi-rate');
  const inputYears = container.querySelector('#emi-years');

  const update = () => {
    const P = parseFloat(inputAmount.value);
    const annualRate = parseFloat(inputRate.value);
    const years = parseInt(inputYears.value, 10);

    container.querySelector('#label-emi-amount').textContent = formatINR(P);
    container.querySelector('#label-emi-rate').textContent = `${annualRate}%`;
    container.querySelector('#label-emi-years').textContent = `${years} Years`;

    const r = (annualRate / 12) / 100;
    const n = years * 12;

    // EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    container.querySelector('#emi-monthly').textContent = formatINR(Math.round(emi));
    container.querySelector('#emi-total-interest').textContent = formatINR(Math.round(totalInterest));
    container.querySelector('#emi-total-payment').textContent = formatINR(Math.round(totalPayment));

    const ctx = document.getElementById('emi-chart')?.getContext('2d');
    if (!ctx) return;

    if (calcChartInstance) {
      calcChartInstance.data.datasets[0].data = [Math.round(P), Math.round(totalInterest)];
      calcChartInstance.update();
    } else {
      calcChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal Amount', 'Total Interest'],
          datasets: [
            {
              data: [Math.round(P), Math.round(totalInterest)],
              backgroundColor: ['#0B192C', '#F59E0B'],
              borderWidth: 2,
              borderColor: '#FFFFFF'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 11 } } },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.label}: ${formatINR(context.raw)}`
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  };

  [inputAmount, inputRate, inputYears].forEach(el => el.addEventListener('input', update));
  update();
}

// -------------------------------------------------------------
// 3. BUDGET CALCULATOR (50/30/20)
// -------------------------------------------------------------
function renderBudgetCalculator(container) {
  container.innerHTML = `
    <div class="space-y-6">
      <div>
        <h2 class="text-xl font-bold text-slate-900">50/30/20 Budget Breakdown & Expense Analyzer</h2>
        <p class="text-xs text-slate-600 mt-1">Audit your spending categories against standard financial health benchmarks.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Inputs -->
        <div class="lg:col-span-7 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Monthly Net Take-Home Income (₹)</label>
            <input type="number" id="b-income" value="75000" step="1000" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Housing / Rent / Maintenance (₹)</label>
              <input type="number" id="b-housing" value="22000" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Groceries & Food (₹)</label>
              <input type="number" id="b-food" value="12000" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Transit / Petrol / Cab (₹)</label>
              <input type="number" id="b-transport" value="4500" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Education / Utilities / Bills (₹)</label>
              <input type="number" id="b-bills" value="5000" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Dining Out & Entertainment (₹)</label>
              <input type="number" id="b-entertainment" value="8000" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Other Miscellaneous (₹)</label>
              <input type="number" id="b-other" value="3500" step="500" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm">
            </div>
          </div>
        </div>

        <!-- Output & Donut -->
        <div class="lg:col-span-5 flex flex-col justify-between">
          <div class="space-y-3 mb-4">
            <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-600">Total Monthly Expenses</span>
              <strong id="b-total-exp" class="text-base font-bold text-rose-600">₹0</strong>
            </div>
            <div class="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <span class="text-xs font-semibold text-emerald-800">Remaining Savings Potential</span>
              <strong id="b-remaining" class="text-base font-extrabold text-emerald-900">₹0</strong>
            </div>
            <div class="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-600">Estimated Savings Rate</span>
              <strong id="b-savings-rate" class="text-base font-bold text-slate-900">0%</strong>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-56 relative flex items-center justify-center">
            <canvas id="budget-chart"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  const inputs = ['b-income', 'b-housing', 'b-food', 'b-transport', 'b-bills', 'b-entertainment', 'b-other']
    .map(id => container.querySelector(`#${id}`));

  const update = () => {
    const income = parseFloat(inputs[0].value) || 0;
    const housing = parseFloat(inputs[1].value) || 0;
    const food = parseFloat(inputs[2].value) || 0;
    const transport = parseFloat(inputs[3].value) || 0;
    const bills = parseFloat(inputs[4].value) || 0;
    const entertainment = parseFloat(inputs[5].value) || 0;
    const other = parseFloat(inputs[6].value) || 0;

    const totalExp = housing + food + transport + bills + entertainment + other;
    const remaining = income - totalExp;
    const savingsRate = income > 0 ? Math.max(0, Math.round((remaining / income) * 100)) : 0;

    container.querySelector('#b-total-exp').textContent = formatINR(totalExp);
    container.querySelector('#b-remaining').textContent = formatINR(remaining);
    container.querySelector('#b-savings-rate').textContent = `${savingsRate}% of income`;

    const ctx = document.getElementById('budget-chart')?.getContext('2d');
    if (!ctx) return;

    const dataVals = [housing, food, transport, bills, entertainment, other, Math.max(0, remaining)];
    const labels = ['Housing', 'Food', 'Transit', 'Bills', 'Leisure', 'Other', 'Savings'];

    if (calcChartInstance) {
      calcChartInstance.data.datasets[0].data = dataVals;
      calcChartInstance.update();
    } else {
      calcChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [
            {
              data: dataVals,
              backgroundColor: ['#1E3E62', '#0284C7', '#64748B', '#94A3B8', '#F59E0B', '#F43F5E', '#10B981'],
              borderWidth: 2,
              borderColor: '#FFFFFF'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right', labels: { font: { size: 9 }, boxWidth: 10 } },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.label}: ${formatINR(context.raw)}`
              }
            }
          },
          cutout: '65%'
        }
      });
    }
  };

  inputs.forEach(el => el.addEventListener('input', update));
  update();
}

// -------------------------------------------------------------
// 4. SAVINGS & CASHFLOW CALCULATOR
// -------------------------------------------------------------
function renderSavingsCalculator(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-6 space-y-5">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Savings & Surplus Forecaster</h2>
          <p class="text-xs text-slate-600 mt-1">Estimate cash reserves accumulated over 1, 3, 5, and 10-year milestones.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Monthly In-Hand Salary / Income (₹)</label>
          <input type="number" id="sav-income" value="80000" step="1000" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Monthly Total Expenses (₹)</label>
          <input type="number" id="sav-expenses" value="55000" step="1000" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Conservative Savings Return Rate (% p.a.)</label>
          <input type="range" id="sav-rate" min="3" max="10" step="0.5" value="6.5" class="w-full accent-emerald-600">
          <div class="flex justify-between text-xs text-slate-600 mt-1">
            <span>Bank FD / Debt (~6.5%)</span>
            <span id="label-sav-rate" class="font-bold text-emerald-800">6.5%</span>
          </div>
        </div>
      </div>

      <div class="lg:col-span-6 space-y-4">
        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
          <div class="text-xs font-semibold text-emerald-800 uppercase tracking-wide">Net Monthly Surplus</div>
          <div id="sav-surplus" class="text-2xl font-extrabold text-emerald-950 mt-1">₹25,000 / month</div>
          <div id="sav-annual" class="text-xs text-emerald-700 mt-1 font-medium">₹3,00,000 saved per year</div>
        </div>

        <h3 class="text-sm font-bold text-slate-800">Projected Accumulation Milestones:</h3>
        <div class="grid grid-cols-2 gap-3">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-xs text-slate-600 block">After 1 Year</span>
            <strong id="sav-1yr" class="text-base font-bold text-slate-900 block mt-0.5">₹0</strong>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-xs text-slate-600 block">After 3 Years</span>
            <strong id="sav-3yr" class="text-base font-bold text-slate-900 block mt-0.5">₹0</strong>
          </div>
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span class="text-xs text-slate-600 block">After 5 Years</span>
            <strong id="sav-5yr" class="text-base font-bold text-slate-900 block mt-0.5">₹0</strong>
          </div>
          <div class="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
            <span class="text-xs text-emerald-800 block">After 10 Years</span>
            <strong id="sav-10yr" class="text-base font-extrabold text-emerald-900 block mt-0.5">₹0</strong>
          </div>
        </div>
      </div>
    </div>
  `;

  const inputInc = container.querySelector('#sav-income');
  const inputExp = container.querySelector('#sav-expenses');
  const inputRate = container.querySelector('#sav-rate');

  const update = () => {
    const inc = parseFloat(inputInc.value) || 0;
    const exp = parseFloat(inputExp.value) || 0;
    const rate = parseFloat(inputRate.value) / 100;
    container.querySelector('#label-sav-rate').textContent = `${inputRate.value}%`;

    const monthlySurplus = Math.max(0, inc - exp);
    const annualSavings = monthlySurplus * 12;

    container.querySelector('#sav-surplus').textContent = `${formatINR(monthlySurplus)} / month`;
    container.querySelector('#sav-annual').textContent = `${formatINR(annualSavings)} saved per year`;

    function calcFv(years) {
      const r = rate / 12;
      const n = years * 12;
      return monthlySurplus * ((Math.pow(1 + r, n) - 1) / r);
    }

    container.querySelector('#sav-1yr').textContent = formatINR(Math.round(calcFv(1)));
    container.querySelector('#sav-3yr').textContent = formatINR(Math.round(calcFv(3)));
    container.querySelector('#sav-5yr').textContent = formatINR(Math.round(calcFv(5)));
    container.querySelector('#sav-10yr').textContent = formatINR(Math.round(calcFv(10)));
  };

  [inputInc, inputExp, inputRate].forEach(el => el.addEventListener('input', update));
  update();
}

// -------------------------------------------------------------
// 5. EMERGENCY FUND TARGET CALCULATOR
// -------------------------------------------------------------
function renderEmergencyCalculator(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-6 space-y-5">
        <div>
          <h2 class="text-xl font-bold text-slate-900">Emergency Fund Target Calculator</h2>
          <p class="text-xs text-slate-600 mt-1">Determine how much cash buffer you need to survive sudden income loss or crises.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Monthly Non-Negotiable Essential Expenses (₹)</label>
          <input type="number" id="ef-expenses" value="45000" step="1000" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
          <span class="text-[11px] text-slate-600 mt-1 block">Includes rent, groceries, medicines, loan EMIs, and utility bills.</span>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Desired Protection Window</label>
          <select id="ef-months" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white">
            <option value="3">3 Months (Minimum for dual-income salaried households)</option>
            <option value="6" selected>6 Months (Recommended for single-earners & corporate workers)</option>
            <option value="9">9 Months (Conservative / high-stability cushion)</option>
            <option value="12">12 Months (Ideal for freelancers & self-employed business owners)</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Current Emergency Cash Already Saved (₹)</label>
          <input type="number" id="ef-saved" value="80000" step="5000" class="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">
        </div>
      </div>

      <div class="lg:col-span-6 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
            <div class="text-xs font-bold uppercase tracking-wider text-emerald-800">Target Emergency Fund</div>
            <div id="ef-target" class="text-3xl font-extrabold text-emerald-950 mt-1">₹0</div>
            <div id="ef-status" class="text-xs text-emerald-700 mt-2 font-medium">Status</div>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-600">Emergency Buffer Coverage:</span>
              <strong id="ef-coverage-months" class="text-slate-900 font-bold">0.0 Months</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600">Shortfall to Reach Goal:</span>
              <strong id="ef-shortfall" class="text-rose-600 font-bold">₹0</strong>
            </div>
          </div>

          <div class="text-xs text-slate-600 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong>Where to park:</strong> Split this fund into 50% in a sweep-in high-yield savings account and 50% in an ultra-short duration or liquid mutual fund for same-day access.
          </div>
        </div>
      </div>
    </div>
  `;

  const inputExp = container.querySelector('#ef-expenses');
  const selectMonths = container.querySelector('#ef-months');
  const inputSaved = container.querySelector('#ef-saved');

  const update = () => {
    const monthlyExp = parseFloat(inputExp.value) || 0;
    const months = parseInt(selectMonths.value, 10) || 6;
    const saved = parseFloat(inputSaved.value) || 0;

    const target = monthlyExp * months;
    const shortfall = Math.max(0, target - saved);
    const coverageMonths = monthlyExp > 0 ? (saved / monthlyExp).toFixed(1) : 0;

    container.querySelector('#ef-target').textContent = formatINR(target);
    container.querySelector('#ef-coverage-months').textContent = `${coverageMonths} Months of safety`;
    container.querySelector('#ef-shortfall').textContent = shortfall === 0 ? 'Goal Achieved! 🎉' : formatINR(shortfall);

    const statusEl = container.querySelector('#ef-status');
    if (saved >= target) {
      statusEl.className = 'text-xs text-emerald-700 mt-2 font-bold';
      statusEl.textContent = '✓ Excellent! Your emergency fortress is 100% funded.';
    } else {
      statusEl.className = 'text-xs text-amber-700 mt-2 font-semibold';
      statusEl.textContent = `You currently have ${Math.round((saved / target) * 100)}% of your target saved.`;
    }
  };

  [inputExp, selectMonths, inputSaved].forEach(el => el.addEventListener('input', update));
  update();
}
