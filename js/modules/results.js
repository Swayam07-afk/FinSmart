/**
 * FinSmart Personalized Results Dashboard
 * Visualizes overall financial literacy score with circular gauge meter,
 * category progress breakdown, benchmark comparisons, strengths, areas to improve,
 * and targeted learning recommendations.
 */

import { state } from './state.js';
import { SURVEY_CATEGORIES } from '../data/questions.js';
import { LEARN_TOPICS } from '../data/learnData.js';
import { openLearnTopicModal } from './learn.js';

let radarChartInstance = null;

export function renderResultsDashboard(container) {
  if (!container) return;

  const profile = state.userProfile;

  // Empty state if user hasn't taken the survey yet
  if (!profile || !profile.overallScore) {
    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-16 text-center">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
          <i data-lucide="clipboard-list" class="w-10 h-10"></i>
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">No Survey Results Yet</h1>
        <p class="text-slate-600 max-w-md mx-auto mt-3 text-base">
          Complete our 5-minute financial literacy assessment to receive your personalized score, strengths diagnostic, and tailored learning pathway.
        </p>
        <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#survey" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5">
            <i data-lucide="sparkles" class="w-5 h-5"></i> Take Financial Literacy Survey
          </a>
          <a href="#learn" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
            Explore Learning Hub
          </a>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const {
    overallScore,
    literacyLevel,
    levelColor,
    levelDescription,
    categoryScores,
    strengths,
    weaknesses,
    recommendations,
    demographics,
    calculatedAt
  } = profile;

  const formattedDate = new Date(calculatedAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Calculate SVG circular gauge stroke-dasharray (circumference = 2 * PI * r = 2 * 3.14159 * 70 ≈ 440)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (circumference * overallScore) / 100;

  // Find recommended learning modules objects
  const recommendedModules = LEARN_TOPICS.filter(t => (recommendations || []).includes(t.id)).slice(0, 3);

  const html = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Top Action Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <i data-lucide="award" class="w-3.5 h-3.5"></i> Assessment Complete
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Your Financial Literacy Profile</h1>
          <p class="text-slate-600 text-sm mt-1">
            Assessed on ${formattedDate} • Anonymous ID: #${Math.floor(1000 + Math.random() * 9000)}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button id="btn-print-report" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm shadow-sm transition">
            <i data-lucide="printer" class="w-4 h-4"></i> Print / Save Report
          </button>
          <a href="#survey" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-medium text-sm shadow-sm transition">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Retake Survey
          </a>
        </div>
      </div>

      <!-- Hero Score Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <!-- Circular Gauge Card -->
        <div class="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div class="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">Overall Financial Literacy Score</div>
          
          <div class="relative w-48 h-48 flex items-center justify-center my-2">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <!-- Background track -->
              <circle
                cx="80"
                cy="80"
                r="${radius}"
                class="text-slate-100"
                stroke-width="12"
                stroke="currentColor"
                fill="transparent"
              />
              <!-- Animated Progress -->
              <circle
                cx="80"
                cy="80"
                r="${radius}"
                stroke="${levelColor}"
                stroke-width="12"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${dashoffset}"
                stroke-linecap="round"
                fill="transparent"
                class="transition-all duration-1000 ease-out"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">${overallScore}</span>
              <span class="text-xs font-medium text-slate-600 uppercase tracking-wider mt-0.5">out of 100</span>
            </div>
          </div>

          <!-- Literacy Level Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mt-3" style="background-color: ${levelColor}15; color: ${levelColor}">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${levelColor}"></span>
            ${literacyLevel} Financial Literacy
          </div>

          <p class="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed max-w-sm">
            ${levelDescription}
          </p>

          <div class="mt-6 pt-5 border-t border-slate-100 w-full flex items-center justify-around text-center text-xs">
            <div>
              <span class="text-slate-600 block">Demographic Tier</span>
              <strong class="text-slate-800 text-sm font-semibold">${demographics?.age_group || '25-34'}</strong>
            </div>
            <div class="h-8 w-px bg-slate-200"></div>
            <div>
              <span class="text-slate-600 block">National Percentile</span>
              <strong class="text-slate-800 text-sm font-semibold">Top ${Math.max(5, 100 - Math.round(overallScore * 0.95))}%</strong>
            </div>
          </div>
        </div>

        <!-- Category Performance Bars -->
        <div class="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-lg font-bold text-slate-900">Pillar-by-Pillar Breakdown</h2>
                <p class="text-xs text-slate-600 mt-0.5">Your proficiency across the 5 foundational pillars</p>
              </div>
              <div class="hidden sm:flex items-center gap-3 text-xs text-slate-600">
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Needs Focus</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Developing</span>
                <span class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Strong</span>
              </div>
            </div>

            <div class="space-y-5">
              ${SURVEY_CATEGORIES.map(cat => {
                const score = categoryScores[cat.id] || 0;
                let barColor = 'bg-rose-500';
                let tagColor = 'text-rose-600 bg-rose-50';
                let label = 'Needs Focus';

                if (score >= 81) {
                  barColor = 'bg-emerald-600';
                  tagColor = 'text-emerald-700 bg-emerald-50';
                  label = 'Strong';
                } else if (score >= 61) {
                  barColor = 'bg-teal-600';
                  tagColor = 'text-teal-700 bg-teal-50';
                  label = 'Good';
                } else if (score >= 41) {
                  barColor = 'bg-amber-500';
                  tagColor = 'text-amber-700 bg-amber-50';
                  label = 'Developing';
                }

                return `
                  <div>
                    <div class="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                      <span class="flex items-center gap-2">
                        <i data-lucide="${cat.icon}" class="w-4 h-4 text-slate-500"></i>
                        ${cat.name}
                      </span>
                      <div class="flex items-center gap-2">
                        <span class="text-xs px-2 py-0.5 rounded font-medium ${tagColor}">${label}</span>
                        <span class="font-bold text-slate-900">${score}%</span>
                      </div>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div class="${barColor} h-3 rounded-full transition-all duration-700 ease-out" style="width: ${Math.max(4, score)}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Scores are evaluated based on conceptual understanding and sound financial habits.</span>
            <a href="#calculators" class="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1">
              Test Calculators <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
            </a>
          </div>
        </div>
      </div>

      <!-- Strengths & Areas to Improve Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Strengths Card -->
        <div class="bg-gradient-to-br from-emerald-50/70 to-teal-50/40 rounded-3xl p-6 sm:p-7 border border-emerald-200/70 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <i data-lucide="sparkles" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Your Core Strengths</h3>
              <p class="text-xs text-emerald-800">Areas where you scored above benchmark</p>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            ${strengths.map(s => `
              <div class="bg-white rounded-xl p-4 border border-emerald-100 shadow-2xs">
                <div class="flex items-center justify-between mb-1">
                  <strong class="text-sm font-bold text-slate-900">${s.title}</strong>
                  <span class="text-xs font-bold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50">${s.score}%</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${s.description}</p>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Areas to Improve Card -->
        <div class="bg-gradient-to-br from-amber-50/70 to-orange-50/40 rounded-3xl p-6 sm:p-7 border border-amber-200/70 shadow-sm">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <i data-lucide="alert-circle" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-900">Areas for Growth</h3>
              <p class="text-xs text-amber-800">Priorities to accelerate your financial freedom</p>
            </div>
          </div>

          <div class="space-y-3 mt-4">
            ${weaknesses.map(w => `
              <div class="bg-white rounded-xl p-4 border border-amber-100 shadow-2xs">
                <div class="flex items-center justify-between mb-1">
                  <strong class="text-sm font-bold text-slate-900">${w.title}</strong>
                  <span class="text-xs font-bold text-amber-700 px-2 py-0.5 rounded-full bg-amber-50">${w.score}%</span>
                </div>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${w.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Personalized Learning Recommendations Section -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div class="text-xs font-bold uppercase tracking-widest text-emerald-700">Customized Curriculum</div>
            <h2 class="text-2xl font-bold text-slate-900">Recommended Learning Modules For You</h2>
            <p class="text-sm text-slate-600 mt-1">Based on your lowest scoring pillars, start with these actionable guides:</p>
          </div>
          <a href="#learn" class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View All 10 Modules <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${recommendedModules.map(mod => `
            <div class="bg-slate-50 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-2xs hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <i data-lucide="${mod.icon}" class="w-5 h-5"></i>
                  </div>
                  <span class="text-xs font-medium text-slate-600">${mod.readTime}</span>
                </div>
                <h4 class="font-bold text-slate-900 group-hover:text-emerald-800 transition">${mod.title}</h4>
                <p class="text-xs text-slate-600 mt-2 leading-relaxed">${mod.summary}</p>
              </div>

              <button 
                type="button" 
                class="btn-open-learn-modal mt-4 w-full py-2.5 px-3 rounded-xl bg-white group-hover:bg-emerald-600 text-slate-700 group-hover:text-white border border-slate-200 group-hover:border-transparent text-xs font-bold transition flex items-center justify-center gap-1.5"
                data-topic="${mod.id}">
                Read Guide & Quiz <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Quick Action Cards (Quiz & Calculators) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div class="relative z-10">
            <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Test Knowledge</span>
            <h3 class="text-xl font-bold mt-1">Take the 10-Question Financial Quiz</h3>
            <p class="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Challenge yourself with quick scenario-based questions and get instant explanations after each answer.
            </p>
          </div>
          <div class="mt-6 relative z-10">
            <a href="#quiz" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-bold text-sm shadow-md transition">
              Start Rapid Quiz <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

        <div class="bg-gradient-to-br from-slate-900 to-navy-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div class="relative z-10">
            <span class="text-xs font-semibold text-teal-400 uppercase tracking-wider">Financial Tools</span>
            <h3 class="text-xl font-bold mt-1">Simulate Your Growth with Calculators</h3>
            <p class="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Explore SIP compounding projections, loan EMI amortization, and 50/30/20 budget allocations in Indian Rupees.
            </p>
          </div>
          <div class="mt-6 relative z-10">
            <a href="#calculators" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-sm shadow-md transition">
              Explore Calculators <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Attach modal listeners for recommended modules
  container.querySelectorAll('.btn-open-learn-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.getAttribute('data-topic');
      const topic = LEARN_TOPICS.find(t => t.id === topicId);
      if (topic) openLearnTopicModal(topic);
    });
  });

  // Attach print button
  const printBtn = container.querySelector('#btn-print-report');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}
