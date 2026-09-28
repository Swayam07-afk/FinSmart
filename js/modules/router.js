/**
 * FinSmart Hash-Based Client Router & Page View Orchestrator
 * Seamlessly handles navigation across Home, About, Survey, Results, Learn, Calculators, Quiz, Insights, Privacy, and Admin.
 */

import { state } from './state.js';
import { renderSurveyWizard } from './survey.js';
import { renderResultsDashboard } from './results.js';
import { renderLearnPage } from './learn.js';
import { renderCalculators } from './calculators.js';
import { renderQuiz } from './quiz.js';
import { renderAiQuizPage } from './aiQuiz.js';
import { openApiKeyModal } from './apiKeyModal.js';
import { renderInsightsDashboard } from './insights.js';
import { renderAdminDashboard } from './admin.js';

export function initRouter() {
  window.addEventListener('hashchange', handleRouteChange);
  handleRouteChange();
}

export function navigateTo(route) {
  window.location.hash = `#${route}`;
}

function handleRouteChange() {
  const hash = window.location.hash.replace('#', '') || 'home';
  state.currentRoute = hash;

  const appMain = document.getElementById('app-main');
  if (!appMain) return;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update navbar active state
  updateNavbarActive(hash);

  // Close mobile menu if open
  closeMobileMenu();

  // Route dispatch
  switch (hash) {
    case 'home':
      renderHomePage(appMain);
      break;
    case 'about':
      renderAboutPage(appMain);
      break;
    case 'survey':
      renderSurveyWizard(appMain);
      break;
    case 'results':
      renderResultsDashboard(appMain);
      break;
    case 'learn':
      renderLearnPage(appMain);
      break;
    case 'calculators':
      renderCalculators(appMain);
      break;
    case 'quiz':
      renderQuiz(appMain);
      break;
    case 'ai-quiz':
      renderAiQuizPage(appMain);
      break;
    case 'gemini-key':
      openApiKeyModal();
      break;
    case 'insights':
      renderInsightsDashboard(appMain);
      break;
    case 'privacy':
      renderPrivacyPage(appMain);
      break;
    case 'admin':
      renderAdminDashboard(appMain);
      break;
    default:
      renderHomePage(appMain);
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

function updateNavbarActive(activeRoute) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === activeRoute) {
      link.classList.remove('text-slate-600', 'hover:text-slate-900');
      link.classList.add('text-emerald-700', 'font-bold');
    } else {
      link.classList.add('text-slate-600', 'hover:text-slate-900');
      link.classList.remove('text-emerald-700', 'font-bold');
    }
  });

  // Highlight "My Score" button if user has completed survey
  const myScoreBtn = document.getElementById('nav-my-score');
  if (myScoreBtn) {
    if (state.userProfile && state.userProfile.overallScore) {
      myScoreBtn.classList.remove('hidden');
    } else {
      myScoreBtn.classList.add('hidden');
    }
  }
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
}

// -------------------------------------------------------------
// HOME PAGE VIEW
// -------------------------------------------------------------
function renderHomePage(container) {
  container.innerHTML = `
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <!-- Background Ambient Glows -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold mb-6 animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          FinSmart Assessment & Education Platform
        </div>

        <!-- Hero Headline -->
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-tight">
          How financially smart <br class="hidden sm:inline">are you?
        </h1>

        <!-- Subtitle -->
        <p class="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
          Take our quick financial literacy survey, discover your financial strengths, and learn how to make smarter money decisions.
        </p>

        <!-- CTA Buttons -->
        <div class="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <a href="#survey" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition transform hover:-translate-y-0.5">
            Take the Survey <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </a>
          <a href="#learn" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/15 backdrop-blur-sm transition">
            <i data-lucide="book-open" class="w-5 h-5 text-emerald-400"></i> Explore Financial Education
          </a>
        </div>

        <!-- Stats Bar Under Hero -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-16 max-w-4xl mx-auto">
          <div class="bg-navy-900/80 border border-navy-800 backdrop-blur-sm p-4 rounded-2xl">
            <div class="text-2xl sm:text-3xl font-black text-emerald-400">5-Min</div>
            <div class="text-xs text-slate-400 font-medium mt-1">Quick Survey</div>
          </div>
          <div class="bg-navy-900/80 border border-navy-800 backdrop-blur-sm p-4 rounded-2xl">
            <div class="text-2xl sm:text-3xl font-black text-teal-400">10</div>
            <div class="text-xs text-slate-400 font-medium mt-1">Diagnostic Questions</div>
          </div>
          <div class="bg-navy-900/80 border border-navy-800 backdrop-blur-sm p-4 rounded-2xl">
            <div class="text-2xl sm:text-3xl font-black text-emerald-400">0 - 100</div>
            <div class="text-xs text-slate-400 font-medium mt-1">Personalized Score</div>
          </div>
          <div class="bg-navy-900/80 border border-navy-800 backdrop-blur-sm p-4 rounded-2xl">
            <div class="text-2xl sm:text-3xl font-black text-teal-400">100% Free</div>
            <div class="text-xs text-slate-400 font-medium mt-1">Financial Resources</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gemini AI Quiz Feature Showcase Card -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-navy-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
            <i data-lucide="sparkles" class="w-7 h-7"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">New</span>
              <span class="text-xs font-semibold text-slate-500">Google Gemini AI Integration</span>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-slate-900 mt-1">
              AI-Powered Financial Quiz Generator
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 mt-0.5">
              Generate custom scenario quizzes on any money topic with your own Google Gemini API key.
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto shrink-0">
          <a href="#ai-quiz" class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5">
            <i data-lucide="zap" class="w-4 h-4"></i> Try AI Quiz Generator
          </a>
        </div>
      </div>
    </div>

    <!-- Why Financial Literacy Matters Section -->
    <section class="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <div class="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">Empowering Decisions</div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Why Financial Literacy Matters</h2>
          <p class="text-slate-600 text-sm sm:text-base mt-3">
            Financial knowledge is not just about math; it is the vital life skill that protects you from predatory debt, builds generational security, and creates freedom of choice.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 1. Manage Money -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <i data-lucide="wallet" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Manage Money Effectively</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gain clarity on daily cash flows, eliminate recurring budget leaks, and allocate your income intentionally using proven frameworks like 50/30/20.
            </p>
          </div>

          <!-- 2. Build Savings -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
              <i data-lucide="piggy-bank" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Build Resilient Savings</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Adopt the habit of "paying yourself first" and establish targeted sinking funds for major upcoming expenditures without taking loans.
            </p>
          </div>

          <!-- 3. Understand Investments -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <i data-lucide="trending-up" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Understand Investments</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Demystify mutual fund SIPs, equity index funds, and asset diversification to grow your wealth faster than inflation.
            </p>
          </div>

          <!-- 4. Avoid Debt -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <i data-lucide="credit-card" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Avoid Excessive Debt</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Understand the true compounding cost of 36%+ credit card interest, loan amortization schedules, and keep your Debt-to-Income ratio healthy.
            </p>
          </div>

          <!-- 5. Prepare Emergencies -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <i data-lucide="shield-alert" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Prepare for Emergencies</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Maintain a dedicated 3 to 6-month liquid emergency fund and comprehensive health insurance so medical or career surprises never wipe you out.
            </p>
          </div>

          <!-- 6. Informed Decisions -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <i data-lucide="check-circle" class="w-6 h-6"></i>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">Make Informed Decisions</h3>
            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Evaluate financial products objectively, recognize unrealistic high-return scams, and confidently align financial choices with personal life goals.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 md:py-24 bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="text-xs font-bold uppercase tracking-widest text-emerald-800 mb-2">The Roadmap</div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">How FinSmart Works</h2>
          <p class="text-slate-600 text-sm sm:text-base mt-3">
            A simple 4-step interactive cycle designed to measure, diagnose, and elevate your financial confidence.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <!-- Step 1 -->
          <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-600/30 mb-5">
              1
            </div>
            <h4 class="text-lg font-bold text-slate-900">Take the Survey</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Answer 10 scenario-based questions across economics, saving, investing, debt, and insurance.
            </p>
          </div>

          <!-- Step 2 -->
          <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 rounded-2xl bg-navy-900 text-emerald-400 font-extrabold text-xl flex items-center justify-center shadow-lg mb-5">
              2
            </div>
            <h4 class="text-lg font-bold text-slate-900">Get Your Score</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Receive an instantaneous 0-100 diagnostic score with a visual gauge and performance tier badge.
            </p>
          </div>

          <!-- Step 3 -->
          <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 rounded-2xl bg-teal-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-teal-600/30 mb-5">
              3
            </div>
            <h4 class="text-lg font-bold text-slate-900">Understand Results</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Review your auto-identified strengths and vulnerability areas across each of the 5 financial pillars.
            </p>
          </div>

          <!-- Step 4 -->
          <div class="flex flex-col items-center text-center relative">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500 text-navy-950 font-extrabold text-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
              4
            </div>
            <h4 class="text-lg font-bold text-slate-900">Improve Knowledge</h4>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Read tailored educational modules, simulate wealth scenarios in calculators, and test yourself with quizzes.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA Banner -->
    <section class="py-16 bg-gradient-to-r from-navy-900 to-navy-950 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          Ready to discover your financial literacy level?
        </h2>
        <p class="text-slate-300 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Join thousands of participants in India's modern financial literacy research and diagnostic assessment.
        </p>
        <div class="mt-8">
          <a href="#survey" class="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-black text-base shadow-xl shadow-emerald-500/25 transition transform hover:-translate-y-0.5">
            Start Survey Now <i data-lucide="arrow-right" class="w-5 h-5"></i>
          </a>
        </div>
      </div>
    </section>
  `;
}

// -------------------------------------------------------------
// ABOUT FINANCIAL LITERACY VIEW
// -------------------------------------------------------------
function renderAboutPage(container) {
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <!-- About Header -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <i data-lucide="info" class="w-3.5 h-3.5"></i> Foundations
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What is Financial Literacy?
        </h1>
        <p class="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
          Financial literacy is the cognitive ability to understand and effectively manage personal financial resources across your lifespan — from your first paycheck to peaceful retirement.
        </p>
      </div>

      <!-- Core Elements 8-Card Grid -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 mb-14">
        <h2 class="text-xl font-bold text-slate-900 mb-2">The 8 Pillars of Financial Capability</h2>
        <p class="text-xs sm:text-sm text-slate-600 mb-8">Financial literacy empowers you to master each of these interrelated domains:</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">1</div>
            <strong class="text-sm font-bold text-slate-900 block">Income</strong>
            <p class="text-xs text-slate-600 mt-1">Understanding gross vs net take-home salary, deductions, bonuses, and diversified income streams.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">2</div>
            <strong class="text-sm font-bold text-slate-900 block">Expenses</strong>
            <p class="text-xs text-slate-600 mt-1">Distinguishing non-negotiable needs from discretionary lifestyle wants to prevent lifestyle creep.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">3</div>
            <strong class="text-sm font-bold text-slate-900 block">Saving</strong>
            <p class="text-xs text-slate-600 mt-1">Establishing liquid emergency reserves and dedicated sinking funds in high-yield vehicles.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">4</div>
            <strong class="text-sm font-bold text-slate-900 block">Investing</strong>
            <p class="text-xs text-slate-600 mt-1">Harnessing compound interest through mutual funds, equities, and index funds to beat inflation.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">5</div>
            <strong class="text-sm font-bold text-slate-900 block">Credit</strong>
            <p class="text-xs text-slate-600 mt-1">Maintaining a 750+ CIBIL score, low utilization (<30%), and paying full credit card balances.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">6</div>
            <strong class="text-sm font-bold text-slate-900 block">Loans</strong>
            <p class="text-xs text-slate-600 mt-1">Understanding EMI mechanics, reducing-balance interest, and smart prepayment strategies.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">7</div>
            <strong class="text-sm font-bold text-slate-900 block">Insurance</strong>
            <p class="text-xs text-slate-600 mt-1">Protecting family assets with adequate standalone health insurance and pure term life coverage.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-3">8</div>
            <strong class="text-sm font-bold text-slate-900 block">Financial Risk</strong>
            <p class="text-xs text-slate-600 mt-1">Recognizing the risk-return spectrum, avoiding fraudulent get-rich-quick scams, and cyber safety.</p>
          </div>
        </div>
      </div>

      <!-- Interactive Infographic Roadmap -->
      <div class="bg-navy-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-14">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <div class="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">Interactive Framework</div>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">The Wealth Creation Hierarchy</h2>
          <p class="text-slate-300 text-xs sm:text-sm mt-2">
            Click on any milestone below to understand how money flows from earning to true financial independence:
          </p>
        </div>

        <!-- Infographic Stages Grid -->
        <div class="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4 mb-8" id="infographic-tabs">
          <button type="button" class="info-step-btn active p-3.5 rounded-2xl bg-emerald-500 text-navy-950 font-bold text-xs text-center transition" data-step="0">
            1. Income
          </button>
          <button type="button" class="info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition" data-step="1">
            2. Budget
          </button>
          <button type="button" class="info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition" data-step="2">
            3. Save
          </button>
          <button type="button" class="info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition" data-step="3">
            4. Invest
          </button>
          <button type="button" class="info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition" data-step="4">
            5. Protect
          </button>
          <button type="button" class="info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition" data-step="5">
            6. Goals
          </button>
        </div>

        <!-- Infographic Content Box -->
        <div id="infographic-detail-box" class="bg-navy-800/80 rounded-2xl p-6 sm:p-8 border border-navy-700 text-slate-200 text-sm">
          <!-- Populated dynamically -->
        </div>
      </div>

      <!-- Why is it Important? 6 Icon Cards -->
      <div>
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why is Financial Literacy Essential?</h2>
          <p class="text-slate-600 text-sm mt-2">The life-changing benefits of building money confidence</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <i data-lucide="pie-chart" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Better Budgeting</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Conscious spending control replaces monthly anxiety with confidence and structure.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <i data-lucide="shield" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Smart Saving</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">High-yield parking and sinking funds protect against emergency debt spikes.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <i data-lucide="credit-card" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Responsible Borrowing</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Avoiding predatory loan sharks, BNPL traps, and revolving credit card interest charges.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <i data-lucide="trending-up" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Investment Awareness</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Harnessing compound interest through low-cost diversified funds over 10-20 year horizons.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <i data-lucide="lock" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Financial Security</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Pure term life and comprehensive health coverage safeguard your loved ones from crises.</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <i data-lucide="target" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-base">Future Planning</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">Clearly mapping timeline, asset classes, and corpus requirements for dream life milestones.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Infographic interactive switcher
  const stages = [
    {
      title: 'Phase 1: Income (Earning & Inflow)',
      summary: 'Your primary active cash engine.',
      content: 'Mastering income means optimizing your career earnings, negotiating salary, exploring secondary skill-based freelance income, and understanding your net in-hand take-home after statutory tax deductions (TDS, EPF, Professional Tax).'
    },
    {
      title: 'Phase 2: Budget (The Allocator)',
      summary: 'Assigning a purpose to every rupee before spending.',
      content: 'Using the 50/30/20 guideline: 50% for survival needs (housing, food, utility bills), 30% for lifestyle desires (dining, hobbies, OTT), and 20% dedicated to building wealth.'
    },
    {
      title: 'Phase 3: Save (The Foundation)',
      summary: 'Capital preservation and liquidity.',
      content: 'Building a 3 to 6-month non-negotiable emergency fund in high-yield liquid instruments. Saving also establishes sinking funds for planned short-term expenses like insurance renewals or holiday travel.'
    },
    {
      title: 'Phase 4: Invest (The Multiplier)',
      summary: 'Beating inflation through productive assets.',
      content: 'Committing capital to diversified equity index funds, mutual fund SIPs, PPF, and real estate. Investing puts money to work so that compound interest compounds exponentially over 10+ years.'
    },
    {
      title: 'Phase 5: Protect (The Armor)',
      summary: 'Shielding against catastrophic shocks.',
      content: 'Risk mitigation through standalone pure health insurance, pure term life insurance, cyber hygiene, and verified nominee designations on all accounts to prevent family crises.'
    },
    {
      title: 'Phase 6: Financial Goals (Freedom & Fulfillment)',
      summary: 'Achieving what truly matters to you.',
      content: 'Funding children\'s education, debt-free home ownership, entrepreneurship sabbaticals, and eventual retirement freedom without financial stress.'
    }
  ];

  const detailBox = container.querySelector('#infographic-detail-box');
  const buttons = container.querySelectorAll('.info-step-btn');

  const updateStage = (idx) => {
    buttons.forEach((b, i) => {
      if (i === idx) {
        b.className = 'info-step-btn p-3.5 rounded-2xl bg-emerald-500 text-navy-950 font-bold text-xs text-center transition shadow-md';
      } else {
        b.className = 'info-step-btn p-3.5 rounded-2xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs text-center border border-navy-700 transition';
      }
    });

    const s = stages[idx];
    detailBox.innerHTML = `
      <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
        <i data-lucide="check-circle" class="w-4 h-4"></i> ${s.summary}
      </div>
      <h3 class="text-xl font-bold text-white mb-3">${s.title}</h3>
      <p class="text-slate-300 text-sm leading-relaxed">${s.content}</p>
    `;
    if (window.lucide) window.lucide.createIcons();
  };

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => updateStage(idx));
  });

  updateStage(0);
}

// -------------------------------------------------------------
// PRIVACY POLICY VIEW
// -------------------------------------------------------------
function renderPrivacyPage(container) {
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <i data-lucide="shield-check" class="w-6 h-6"></i>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Privacy & Research Data Policy</h1>
            <p class="text-xs text-slate-500 mt-0.5">FinSmart Financial Literacy Platform • Effective 2026</p>
          </div>
        </div>

        <div class="space-y-6 text-sm text-slate-700 leading-relaxed pt-6 border-t border-slate-100">
          <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm">
            <strong>Core Privacy Commitment:</strong> FinSmart operates strictly for public education and academic research. 
            <strong>We NEVER collect, store, or request your full name, phone number, physical address, bank account credentials, credit card numbers, or passwords.</strong>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 mb-2">1. What Information We Collect</h2>
            <p>During the optional diagnostic survey, we collect only non-sensitive, broad demographic categories for research segmentation:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>Age cohort (e.g. 25-34 years)</li>
              <li>Highest education attained (e.g. Undergraduate Degree)</li>
              <li>Broad occupation status (e.g. Salaried Professional)</li>
              <li>Annual income bracket (e.g. ₹5,00,000 - ₹10,00,000)</li>
              <li>State / geographical region in India</li>
              <li>Answers to the 10 diagnostic survey questions</li>
            </ul>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 mb-2">2. Why We Collect This Data</h2>
            <p>Data is utilized exclusively for:</p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-xs sm:text-sm text-slate-600">
              <li>Calculating your instantaneous personalized financial literacy score and tailored recommendations.</li>
              <li>Aggregating anonymized benchmarks in our public Research Observatory to study financial literacy trends across demographics.</li>
              <li>Improving open educational content and calculators.</li>
            </ul>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 mb-2">3. Aggregation & Anonymity Guarantee</h2>
            <p>
              Individual records are mathematically decoupled from any network or device identity. Research outputs, downloadable CSVs, and dashboard charts are displayed strictly in aggregated, statistical formats (averages, distributions, percentages).
            </p>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 mb-2">4. User Security Advisory</h2>
            <p class="text-rose-600 font-semibold">
              Warning: Never share or enter your net banking passwords, UPI PINs, OTPs, or debit/credit card CVVs on any survey or third-party educational website. FinSmart will never contact you requesting money or account access.
            </p>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 mb-2">5. Data Storage & Local Control</h2>
            <p>
              Your survey responses and personal profile score are stored locally on your device in your browser's <code class="bg-slate-100 px-1.5 py-0.5 rounded text-xs">localStorage</code>. You can reset or clear your progress at any time using the Reset button on the survey wizard.
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          <a href="#survey" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Back to Survey
          </a>
          <span class="text-xs text-slate-500">FinSmart Research Initiative</span>
        </div>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS
// -------------------------------------------------------------
export function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold text-white transform transition-all duration-300 translate-y-4 opacity-0 ${
    type === 'success' ? 'bg-emerald-700 border-emerald-500' :
    type === 'error' ? 'bg-rose-700 border-rose-500' :
    'bg-navy-900 border-navy-700'
  }`;

  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'alert-circle' : 'info';
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-4 h-4 shrink-0"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
