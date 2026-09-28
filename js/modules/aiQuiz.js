/**
 * FinSmart AI Quiz Generator Module
 * Powered by Google Gemini AI. Allows learners to create unlimited, custom-tailored
 * financial literacy quizzes on any topic, difficulty, and audience.
 */

import {
  hasGeminiApiKey,
  getMaskedApiKey,
  getGeminiModel,
  generateQuizWithGemini,
  SAMPLE_AI_QUIZZES
} from './geminiService.js';
import { openApiKeyModal } from './apiKeyModal.js';
import { showToast } from './router.js';

// Pre-curated topic presets for quick selection
const POPULAR_TOPICS = [
  { label: 'Tax Planning & 80C', icon: 'file-text' },
  { label: 'Mutual Funds & SIPs', icon: 'trending-up' },
  { label: 'Compound Interest & Rule of 72', icon: 'zap' },
  { label: 'Credit Cards & Debt Traps', icon: 'credit-card' },
  { label: 'Stock Market & Index Funds', icon: 'bar-chart-2' },
  { label: 'Health & Term Insurance', icon: 'shield-check' },
  { label: 'Home Loans & EMI Optimization', icon: 'home' },
  { label: 'Emergency Funds & Savings', icon: 'piggy-bank' },
  { label: 'Inflation & Purchasing Power', icon: 'dollar-sign' },
  { label: 'Retirement & FIRE Movement', icon: 'sun' },
  { label: 'Crypto & High-Yield Risks', icon: 'alert-triangle' },
  { label: 'Personal Budgeting 50/30/20', icon: 'wallet' }
];

let state = {
  view: 'generator', // 'generator' | 'loading' | 'quiz' | 'results'
  topic: 'Mutual Funds & SIPs',
  difficulty: 'Intermediate',
  questionCount: 5,
  audience: 'Salaried Professionals & Young Adults',
  customNotes: '',
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  hasAnsweredCurrent: false,
  isSampleQuiz: false,
  error: null
};

/**
 * Main entry point for the AI Quiz page.
 * @param {HTMLElement} container
 * @param {string} [initialTopic]
 */
export function renderAiQuizPage(container, initialTopic = null) {
  if (!container) return;

  if (initialTopic) {
    state.topic = initialTopic;
  }

  // Check if we were in the middle of a quiz or if this is fresh
  if (state.view === 'loading') {
    state.view = 'generator';
  }

  renderCurrentView(container);
}

function renderCurrentView(container) {
  switch (state.view) {
    case 'generator':
      renderGeneratorView(container);
      break;
    case 'loading':
      renderLoadingView(container);
      break;
    case 'quiz':
      renderQuizView(container);
      break;
    case 'results':
      renderResultsView(container);
      break;
    default:
      renderGeneratorView(container);
      break;
  }

  if (window.lucide) window.lucide.createIcons();
}

// ============================================================================
// 1. GENERATOR CONFIGURATION VIEW
// ============================================================================

function renderGeneratorView(container) {
  const isKeyConfigured = hasGeminiApiKey();
  const maskedKey = getMaskedApiKey();
  const currentModel = getGeminiModel();

  const html = `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      
      <!-- Hero Header -->
      <div class="bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl mb-8 relative overflow-hidden border border-navy-800">
        <!-- Background Ambient Glow -->
        <div class="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative z-10">
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Google Gemini AI Engine
            </div>

            <!-- Header API Key Button -->
            <button 
              type="button" 
              id="btn-ai-header-key" 
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                isKeyConfigured 
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80' 
                  : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/80 animate-pulse'
              }">
              <i data-lucide="key" class="w-3.5 h-3.5"></i>
              <span>${isKeyConfigured ? `API Key Active (${maskedKey})` : 'Enter Gemini API Key'}</span>
            </button>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
            AI Financial Quiz Generator
          </h1>
          <p class="text-slate-300 text-sm sm:text-base max-w-2xl mt-3 leading-relaxed">
            Generate unlimited, interactive financial literacy quizzes on any personal finance topic, difficulty, or life stage — dynamically crafted in real time by <strong>Google Gemini AI</strong>.
          </p>
        </div>
      </div>

      <!-- API Key Status / Action Notice -->
      ${!isKeyConfigured ? `
        <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-3xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3.5">
            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <i data-lucide="key" class="w-5 h-5"></i>
            </div>
            <div>
              <h4 class="text-sm font-bold text-slate-900">Gemini API Key Required for Live AI Generation</h4>
              <p class="text-xs text-slate-600 mt-1">
                To create custom quizzes via Gemini AI, please provide your free API key from Google AI Studio. Stored 100% locally in your browser.
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 w-full sm:w-auto">
            <button 
              type="button" 
              id="btn-open-api-banner" 
              class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition whitespace-nowrap flex items-center justify-center gap-1.5">
              <i data-lucide="key" class="w-3.5 h-3.5"></i> Set Up API Key (Free)
            </button>
          </div>
        </div>
      ` : `
        <div class="bg-white border border-emerald-200/80 rounded-2xl px-5 py-3.5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div class="flex items-center gap-2.5 text-xs text-slate-700">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span><strong>Gemini AI Connected:</strong> Using <code class="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">${currentModel}</code></span>
            <span class="text-slate-400">|</span>
            <span class="text-slate-500 font-mono text-[11px]">${maskedKey}</span>
          </div>
          <button 
            type="button" 
            id="btn-change-api-key" 
            class="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1">
            <i data-lucide="settings" class="w-3.5 h-3.5"></i> Change Key or Model
          </button>
        </div>
      `}

      <!-- Generator Configuration Form -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
        
        <!-- Section 1: Financial Topic -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Choose or Enter Quiz Topic <span class="text-rose-500">*</span>
            </label>
            <span class="text-[11px] text-slate-500">Pick a preset or type your own</span>
          </div>

          <!-- Quick Topic Pills -->
          <div class="flex flex-wrap gap-2 mb-3.5" id="topic-pills-container">
            ${POPULAR_TOPICS.map(t => {
              const isSelected = state.topic === t.label;
              return `
                <button 
                  type="button" 
                  class="topic-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-navy-900 border-navy-900 text-white shadow-sm' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }"
                  data-topic="${t.label}">
                  <i data-lucide="${t.icon}" class="w-3.5 h-3.5 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}"></i>
                  ${t.label}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Custom Topic Input -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </div>
            <input 
              type="text" 
              id="input-custom-topic" 
              value="${state.topic}" 
              placeholder="Or type any custom topic (e.g. Sovereign Gold Bonds, Startup ESOPs, EPF vs PPF, Education Loans)..."
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-medium text-slate-800 transition outline-none"
            />
          </div>
        </div>

        <!-- Section 2: Difficulty & Question Count -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          <!-- Difficulty -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              2. Difficulty Level
            </label>
            <div class="grid grid-cols-3 gap-2" id="difficulty-selector">
              ${[
                { id: 'Beginner', label: 'Beginner', desc: 'Everyday concepts' },
                { id: 'Intermediate', label: 'Intermediate', desc: 'Real-world math' },
                { id: 'Advanced', label: 'Advanced', desc: 'Deep strategies' }
              ].map(d => `
                <button 
                  type="button" 
                  class="diff-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    state.difficulty === d.id 
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }"
                  data-diff="${d.id}">
                  <span class="text-xs sm:text-sm font-bold">${d.label}</span>
                  <span class="text-[10px] text-slate-500 mt-0.5">${d.desc}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Question Count -->
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
              3. Number of Questions
            </label>
            <div class="grid grid-cols-3 gap-2" id="count-selector">
              ${[
                { count: 3, label: '3 Questions', desc: '⚡ 2-Min Sprint' },
                { count: 5, label: '5 Questions', desc: '🎯 Recommended' },
                { count: 10, label: '10 Questions', desc: '🏆 Deep Mastery' }
              ].map(c => `
                <button 
                  type="button" 
                  class="count-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                    state.questionCount === c.count 
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }"
                  data-count="${c.count}">
                  <span class="text-xs sm:text-sm font-bold">${c.label}</span>
                  <span class="text-[10px] text-slate-500 mt-0.5">${c.desc}</span>
                </button>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- Section 3: Target Audience & Custom Focus -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-slate-100">
          
          <!-- Audience Persona -->
          <div>
            <label for="select-audience" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              4. Target Audience / Focus Persona
            </label>
            <select 
              id="select-audience" 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-slate-800 bg-white transition outline-none">
              ${[
                'Salaried Professionals & Young Adults',
                'College & University Students',
                'Small Business Owners & Freelancers',
                'Families & Pre-Retirement Planners',
                'Beginner First-Time Investors'
              ].map(a => `
                <option value="${a}" ${state.audience === a ? 'selected' : ''}>${a}</option>
              `).join('')}
            </select>
          </div>

          <!-- Specific custom instructions / prompt note -->
          <div>
            <label for="input-custom-notes" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              5. Custom Note / Focus (Optional)
            </label>
            <input 
              type="text" 
              id="input-custom-notes" 
              value="${state.customNotes}" 
              placeholder="e.g., Focus on Indian tax slabs, Rupee calculations, or CIBIL score traps..." 
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm text-slate-800 transition outline-none"
            />
          </div>

        </div>

        <!-- Error display if any -->
        ${state.error ? `
          <div class="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3">
            <i data-lucide="alert-circle" class="w-5 h-5 text-rose-600 shrink-0 mt-0.5"></i>
            <div>
              <strong class="block font-bold mb-0.5">Generation Error:</strong>
              <span>${state.error}</span>
            </div>
          </div>
        ` : ''}

        <!-- Generator Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <button 
              type="button" 
              id="btn-generate-ai-quiz" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition transform hover:-translate-y-0.5">
              <i data-lucide="sparkles" class="w-4 h-4"></i> Generate Quiz with Gemini AI
            </button>
          </div>

          <div class="flex items-center gap-2 text-xs text-slate-500 w-full sm:w-auto justify-end">
            <i data-lucide="cpu" class="w-4 h-4 text-emerald-600"></i>
            <span>Creates scenario-based questions in seconds</span>
          </div>
        </div>

      </div>

      <!-- Sample Quizzes Section (Always Available) -->
      <div class="bg-slate-100/80 rounded-3xl p-6 sm:p-8 border border-slate-200/80">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="zap" class="w-4 h-4 text-amber-500"></i> Instant Sample AI Quizzes
            </h3>
            <p class="text-xs text-slate-600 mt-0.5">
              No API key handy? Test our pre-generated Gemini AI quizzes immediately with 1 click.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${SAMPLE_AI_QUIZZES.map(sample => `
            <div class="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                    ${sample.topic}
                  </span>
                  <span class="text-[11px] text-slate-400 font-semibold">
                    ${sample.questions.length} Questions
                  </span>
                </div>
                <h4 class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  ${sample.title}
                </h4>
                <p class="text-xs text-slate-500 mt-1 leading-relaxed">
                  ${sample.description}
                </p>
              </div>
              <button 
                type="button" 
                class="btn-start-sample mt-4 w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold text-xs transition"
                data-sample-id="${sample.id}">
                Take Sample Quiz <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;

  // Bind Listeners
  attachGeneratorListeners(container);
}

function attachGeneratorListeners(container) {
  // Topic input change
  const customTopicInput = container.querySelector('#input-custom-topic');
  customTopicInput?.addEventListener('input', (e) => {
    state.topic = e.target.value;
  });

  // Topic pills click
  container.querySelectorAll('.topic-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      state.topic = topic;
      if (customTopicInput) customTopicInput.value = topic;

      // Update pill classes
      container.querySelectorAll('.topic-pill-btn').forEach(b => {
        b.className = 'topic-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700';
      });
      btn.className = 'topic-pill-btn px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 bg-navy-900 border-navy-900 text-white shadow-sm';
    });
  });

  // Difficulty buttons
  container.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = btn.getAttribute('data-diff');
      container.querySelectorAll('.diff-btn').forEach(b => {
        b.className = 'diff-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center bg-white hover:bg-slate-50 border-slate-200 text-slate-700';
      });
      btn.className = 'diff-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold';
    });
  });

  // Question Count buttons
  container.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.questionCount = parseInt(btn.getAttribute('data-count'), 10);
      container.querySelectorAll('.count-btn').forEach(b => {
        b.className = 'count-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center bg-white hover:bg-slate-50 border-slate-200 text-slate-700';
      });
      btn.className = 'count-btn p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold';
    });
  });

  // Audience selector
  container.querySelector('#select-audience')?.addEventListener('change', (e) => {
    state.audience = e.target.value;
  });

  // Custom notes input
  container.querySelector('#input-custom-notes')?.addEventListener('input', (e) => {
    state.customNotes = e.target.value;
  });

  // Header API Key button & Change Key button
  const openModal = () => {
    openApiKeyModal({
      onSaved: () => {
        renderGeneratorView(container);
        if (window.lucide) window.lucide.createIcons();
      }
    });
  };

  container.querySelector('#btn-ai-header-key')?.addEventListener('click', openModal);
  container.querySelector('#btn-open-api-banner')?.addEventListener('click', openModal);
  container.querySelector('#btn-change-api-key')?.addEventListener('click', openModal);

  // Generate Button Click
  container.querySelector('#btn-generate-ai-quiz')?.addEventListener('click', async () => {
    // If no API key configured, guide user to enter it!
    if (!hasGeminiApiKey()) {
      openApiKeyModal({
        message: 'A Google Gemini API key is needed to generate live AI quizzes. Please paste your key below (it only takes 30 seconds to get one for free).',
        onSaved: () => {
          triggerQuizGeneration(container);
        }
      });
      return;
    }

    triggerQuizGeneration(container);
  });

  // Start Sample Quiz buttons
  container.querySelectorAll('.btn-start-sample').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleId = btn.getAttribute('data-sample-id');
      const sample = SAMPLE_AI_QUIZZES.find(s => s.id === sampleId);
      if (sample) {
        state.questions = JSON.parse(JSON.stringify(sample.questions));
        state.topic = sample.topic;
        state.isSampleQuiz = true;
        state.currentQuestionIndex = 0;
        state.userAnswers = [];
        state.hasAnsweredCurrent = false;
        state.view = 'quiz';
        renderCurrentView(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

/**
 * Triggers the Gemini API quiz generation workflow.
 */
async function triggerQuizGeneration(container) {
  state.error = null;
  state.view = 'loading';
  renderCurrentView(container);

  try {
    const generatedQuestions = await generateQuizWithGemini({
      topic: state.topic || 'Personal Finance Fundamentals',
      difficulty: state.difficulty,
      questionCount: state.questionCount,
      audience: state.audience,
      customNotes: state.customNotes
    });

    state.questions = generatedQuestions;
    state.isSampleQuiz = false;
    state.currentQuestionIndex = 0;
    state.userAnswers = [];
    state.hasAnsweredCurrent = false;
    state.view = 'quiz';
    renderCurrentView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Quiz generation failure:', err);
    state.view = 'generator';

    if (err.message === 'MISSING_API_KEY' || err.message === 'INVALID_API_KEY') {
      state.error = 'Invalid or missing Google Gemini API key. Please check your key in settings.';
      openApiKeyModal({
        message: 'Your Google Gemini API key could not be authenticated. Please verify or update it below.',
        onSaved: () => {
          triggerQuizGeneration(container);
        }
      });
    } else if (err.message === 'QUOTA_EXCEEDED') {
      state.error = 'Google Gemini rate limit / quota exceeded for this API key. You can try one of the Sample AI Quizzes below while you wait.';
    } else {
      state.error = err.message || 'Failed to generate quiz. Please check your internet connection and try again.';
    }

    renderCurrentView(container);
  }
}

// ============================================================================
// 2. LOADING STATE VIEW
// ============================================================================

function renderLoadingView(container) {
  const html = `
    <div class="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
      
      <!-- Animated Sparkles & Spinner -->
      <div class="relative w-24 h-24 mx-auto mb-8">
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 opacity-20 animate-ping"></div>
        <div class="relative w-24 h-24 rounded-3xl bg-navy-900 text-emerald-400 flex items-center justify-center shadow-xl border border-navy-800">
          <i data-lucide="sparkles" class="w-10 h-10 animate-spin" style="animation-duration: 4s;"></i>
        </div>
      </div>

      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Gemini AI Generation in Progress
      </div>

      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-3">
        Creating Your "${state.topic}" Quiz
      </h2>
      <p id="loading-step-text" class="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
        Prompting Google Gemini AI to create real-world scenario questions and educational explanations...
      </p>

      <div class="mt-8 max-w-xs mx-auto bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full animate-pulse w-3/4"></div>
      </div>

      <p class="text-slate-400 text-xs mt-6">
        Target: ${state.difficulty} • ${state.questionCount} Questions • Indian Context (₹)
      </p>
    </div>
  `;

  container.innerHTML = html;
}

// ============================================================================
// 3. INTERACTIVE QUIZ PLAYING VIEW
// ============================================================================

function renderQuizView(container) {
  const total = state.questions.length;

  if (state.currentQuestionIndex >= total) {
    state.view = 'results';
    renderResultsView(container);
    return;
  }

  const q = state.questions[state.currentQuestionIndex];
  const progressPercent = Math.round(((state.currentQuestionIndex) / total) * 100);

  const html = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      
      <!-- Quiz Status Header -->
      <div class="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden border border-navy-800">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> ${state.isSampleQuiz ? 'Sample AI Quiz' : 'Gemini AI Quiz'}
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-navy-800 text-slate-300 text-xs font-semibold">
              ${state.difficulty}
            </span>
          </div>

          <span class="text-xs font-bold text-slate-300">
            Question ${state.currentQuestionIndex + 1} of ${total}
          </span>
        </div>

        <h1 class="text-xl sm:text-2xl font-black tracking-tight text-white">
          ${state.topic}
        </h1>

        <!-- Progress bar -->
        <div class="w-full bg-navy-800 rounded-full h-2 mt-4 overflow-hidden">
          <div 
            class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300 ease-out" 
            style="width: ${Math.max(8, progressPercent)}%">
          </div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        
        <div class="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
          Scenario Assessment
        </div>

        <h2 class="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
          ${q.question}
        </h2>

        <!-- Options List -->
        <div class="space-y-3" id="ai-quiz-options-list">
          ${q.options.map((opt, idx) => `
            <button 
              type="button" 
              class="ai-quiz-option-btn w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/60 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-medium transition flex items-center justify-between gap-3 group"
              data-idx="${idx}">
              <span class="leading-relaxed">${opt}</span>
              <span class="w-7 h-7 rounded-full border border-slate-300 group-hover:border-emerald-500 flex items-center justify-center shrink-0 text-xs font-bold text-slate-500 group-hover:text-emerald-700 transition">
                ${String.fromCharCode(65 + idx)}
              </span>
            </button>
          `).join('')}
        </div>

        <!-- Explanation Feedback Box -->
        <div id="ai-quiz-feedback-box" class="mt-6 p-5 rounded-2xl hidden leading-relaxed text-sm animate-fade-in">
        </div>

        <!-- Next Question / Finish Action -->
        <div class="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500">
            ${state.hasAnsweredCurrent ? 'Read explanation, then continue.' : 'Select an answer above.'}
          </span>

          <button 
            type="button" 
            id="btn-ai-quiz-next" 
            class="hidden inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5">
            <span>${state.currentQuestionIndex === total - 1 ? 'View Final Results' : 'Next Question'}</span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;

  const optionButtons = container.querySelectorAll('.ai-quiz-option-btn');
  const feedbackBox = container.querySelector('#ai-quiz-feedback-box');
  const nextBtn = container.querySelector('#btn-ai-quiz-next');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.hasAnsweredCurrent) return;
      state.hasAnsweredCurrent = true;

      const selectedIdx = parseInt(btn.getAttribute('data-idx'), 10);
      const isCorrect = selectedIdx === q.correctIndex;

      state.userAnswers.push({
        questionId: q.id,
        question: q.question,
        topic: q.topic,
        options: q.options,
        selectedIdx,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      });

      // Disable all option clicks
      optionButtons.forEach(b => {
        b.classList.add('pointer-events-none', 'opacity-60');
      });

      if (isCorrect) {
        btn.classList.remove('opacity-60', 'bg-white', 'border-slate-200');
        btn.classList.add('bg-emerald-50', 'border-emerald-600', 'ring-2', 'ring-emerald-600/30', 'text-emerald-950');
        
        feedbackBox.className = 'mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 leading-relaxed text-sm';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-2 font-black text-emerald-800 mb-1.5 text-base">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-600"></i> Correct!
          </div>
          <p class="text-slate-800 text-xs sm:text-sm leading-relaxed">${q.explanation}</p>
        `;
      } else {
        btn.classList.remove('opacity-60', 'bg-white', 'border-slate-200');
        btn.classList.add('bg-rose-50', 'border-rose-500', 'ring-2', 'ring-rose-500/30', 'text-rose-950');

        // Reveal correct answer
        const correctBtn = container.querySelector(`.ai-quiz-option-btn[data-idx="${q.correctIndex}"]`);
        correctBtn?.classList.remove('opacity-60');
        correctBtn?.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-950');

        feedbackBox.className = 'mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 leading-relaxed text-sm';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-2 font-black text-rose-800 mb-1.5 text-base">
            <i data-lucide="x-circle" class="w-5 h-5 text-rose-600"></i> Not Quite Right
          </div>
          <p class="text-slate-800 text-xs sm:text-sm leading-relaxed">${q.explanation}</p>
        `;
      }

      feedbackBox.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  });

  nextBtn?.addEventListener('click', () => {
    state.currentQuestionIndex++;
    state.hasAnsweredCurrent = false;
    renderQuizView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================================
// 4. SCORECARD & REVIEW VIEW
// ============================================================================

function renderResultsView(container) {
  const total = state.questions.length;
  const correctCount = state.userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / total) * 100);

  let title = 'Good Effort!';
  let color = 'text-amber-500';
  let badgeClass = 'bg-amber-100 text-amber-800';

  if (percentage >= 80) {
    title = 'Outstanding Financial Mastery!';
    color = 'text-emerald-500';
    badgeClass = 'bg-emerald-100 text-emerald-800';
    if (window.confetti) {
      window.confetti({ particleCount: 90, spread: 70 });
    }
  } else if (percentage >= 60) {
    title = 'Solid Financial Foundation!';
    color = 'text-teal-600';
    badgeClass = 'bg-teal-100 text-teal-800';
  }

  const html = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      
      <!-- Scorecard Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 text-center mb-10">
        
        <div class="inline-flex items-center gap-2 px-3 py-1 ${badgeClass} rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <i data-lucide="award" class="w-4 h-4"></i> Gemini AI Quiz Completed
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ${title}
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Topic: <span class="font-bold text-slate-700">${state.topic}</span> • Difficulty: <span class="font-bold text-slate-700">${state.difficulty}</span>
        </p>

        <!-- Big Score Metric -->
        <div class="my-8">
          <div class="text-6xl sm:text-7xl font-black ${color} tracking-tight">
            ${correctCount} <span class="text-3xl sm:text-4xl text-slate-300 font-semibold">/ ${total}</span>
          </div>
          <div class="text-sm font-bold text-slate-600 mt-2">
            Final Accuracy: ${percentage}%
          </div>
        </div>

        <p class="text-slate-600 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          ${percentage >= 80 
            ? 'Remarkable proficiency! You demonstrated a deep understanding of practical money management, compounding math, and financial tradeoffs.' 
            : 'Every mistake is a learning milestone! Review Gemini AI\'s comprehensive explanations below to reinforce your knowledge.'}
        </p>

        <!-- Primary Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            id="btn-generate-another" 
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition transform hover:-translate-y-0.5">
            <i data-lucide="sparkles" class="w-4 h-4"></i> Generate New AI Quiz
          </button>

          <button 
            type="button" 
            id="btn-retake-ai-quiz" 
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Retake This Quiz
          </button>

          <button 
            type="button" 
            id="btn-share-ai-score" 
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
            <i data-lucide="share-2" class="w-4 h-4"></i> Copy Score Summary
          </button>

          <a 
            href="#learn" 
            class="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition">
            <i data-lucide="book-open" class="w-4 h-4 text-emerald-600"></i> Learn Guides
          </a>
        </div>

      </div>

      <!-- Question-by-Question Review Breakdown -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <i data-lucide="file-check-2" class="w-5 h-5 text-emerald-600"></i> Comprehensive Solution Breakdown
        </h3>

        <div class="space-y-6">
          ${state.userAnswers.map((ans, idx) => `
            <div class="p-5 rounded-2xl border ${ans.isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'}">
              <div class="flex items-start justify-between gap-3 mb-2">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Question ${idx + 1}
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  ans.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }">
                  <i data-lucide="${ans.isCorrect ? 'check' : 'x'}" class="w-3.5 h-3.5"></i>
                  ${ans.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
              </div>

              <h4 class="text-sm sm:text-base font-bold text-slate-900 mb-3">
                ${ans.question}
              </h4>

              <!-- Options summary -->
              <div class="space-y-1.5 mb-3 text-xs sm:text-sm">
                ${ans.options.map((opt, optIdx) => {
                  const isUserPick = optIdx === ans.selectedIdx;
                  const isActualCorrect = optIdx === ans.correctIndex;

                  let optClass = 'text-slate-600 border-transparent';
                  let icon = '';

                  if (isActualCorrect) {
                    optClass = 'bg-emerald-100/80 font-bold text-emerald-950 border-emerald-300';
                    icon = '<span class="text-emerald-700 font-bold">✓ (Correct Answer)</span>';
                  } else if (isUserPick && !ans.isCorrect) {
                    optClass = 'bg-rose-100/80 font-semibold text-rose-950 border-rose-300';
                    icon = '<span class="text-rose-700 font-bold">✕ (Your Pick)</span>';
                  }

                  return `
                    <div class="p-2.5 rounded-xl border flex items-center justify-between gap-2 ${optClass}">
                      <span>${opt}</span>
                      ${icon}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Gemini Explanation -->
              <div class="mt-3 pt-3 border-t border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong class="font-bold text-slate-900 block mb-0.5">Gemini AI Explanation:</strong>
                ${ans.explanation}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;

  // Bind actions
  container.querySelector('#btn-generate-another')?.addEventListener('click', () => {
    state.view = 'generator';
    renderCurrentView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  container.querySelector('#btn-retake-ai-quiz')?.addEventListener('click', () => {
    state.currentQuestionIndex = 0;
    state.userAnswers = [];
    state.hasAnsweredCurrent = false;
    state.view = 'quiz';
    renderCurrentView(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  container.querySelector('#btn-share-ai-score')?.addEventListener('click', async () => {
    const summary = `🏆 FinSmart AI Quiz Result: I scored ${correctCount}/${total} (${percentage}%) on "${state.topic}" (${state.difficulty} level)! Test your money skills at FinSmart.`;
    try {
      await navigator.clipboard.writeText(summary);
      showToast('Score summary copied to clipboard!', 'success');
    } catch (e) {
      showToast('Could not access clipboard.', 'error');
    }
  });
}
