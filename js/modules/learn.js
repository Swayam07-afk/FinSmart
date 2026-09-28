/**
 * FinSmart Financial Education Learning Hub
 * Displays 10 modular educational guides with real-world Indian Rupee (₹) scenarios,
 * key terms glossary, practical tips, and interactive mini-quizzes.
 */

import { LEARN_TOPICS } from '../data/learnData.js';

let activeCategoryFilter = 'all';

export function renderLearnPage(container) {
  if (!container) return;

  const categories = [
    { id: 'all', label: 'All Modules (10)' },
    { id: 'saving', label: 'Saving & Budgeting' },
    { id: 'investing', label: 'Investing & Goals' },
    { id: 'debt', label: 'Credit & Debt' },
    { id: 'insurance', label: 'Insurance & Risk' },
    { id: 'knowledge', label: 'Economics & Taxes' }
  ];

  const filteredTopics = activeCategoryFilter === 'all'
    ? LEARN_TOPICS
    : LEARN_TOPICS.filter(t => t.category === activeCategoryFilter);

  const html = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Hub Header -->
      <div class="text-center max-w-3xl mx-auto mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <i data-lucide="book-open" class="w-3.5 h-3.5"></i> Financial Literacy Academy
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Master Your Money, Step by Step
        </h1>
        <p class="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
          Clear, jargon-free personal finance fundamentals designed for modern life. Explore practical examples in Indian Rupees (₹), action checklists, and test your comprehension.
        </p>
      </div>

      <!-- Category Filter Pills -->
      <div class="flex items-center justify-center flex-wrap gap-2 mb-10" id="learn-filter-container">
        ${categories.map(c => `
          <button 
            type="button" 
            class="learn-filter-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${activeCategoryFilter === c.id ? 'bg-navy-900 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}"
            data-cat="${c.id}">
            ${c.label}
          </button>
        `).join('')}
      </div>

      <!-- Topics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        ${filteredTopics.map(topic => `
          <div class="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <i data-lucide="${topic.icon}" class="w-6 h-6"></i>
                </div>
                <span class="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <i data-lucide="clock" class="w-3 h-3"></i> ${topic.readTime}
                </span>
              </div>

              <div class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                ${topic.categoryName}
              </div>
              <h3 class="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition">
                ${topic.title}
              </h3>
              <p class="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed line-clamp-3">
                ${topic.summary}
              </p>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs font-medium text-slate-600 flex items-center gap-1">
                <i data-lucide="help-circle" class="w-3.5 h-3.5 text-slate-400"></i> Includes Mini-Quiz
              </span>
              <button 
                type="button" 
                class="btn-open-topic inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-800"
                data-id="${topic.id}">
                Read Guide <i data-lucide="arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Educational Disclaimer Banner -->
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center text-xs text-slate-600">
        <i data-lucide="info" class="w-4 h-4 inline-block text-slate-400 mr-1.5 -mt-0.5"></i>
        <strong>Educational Purpose:</strong> All educational content on FinSmart is created for financial literacy awareness and research. We do not provide personalized financial planning or endorse specific commercial investment products.
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  // Attach filter buttons
  container.querySelectorAll('.learn-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.getAttribute('data-cat');
      renderLearnPage(container);
    });
  });

  // Attach card open buttons
  container.querySelectorAll('.btn-open-topic').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.getAttribute('data-id');
      const topic = LEARN_TOPICS.find(t => t.id === topicId);
      if (topic) openLearnTopicModal(topic);
    });
  });
}

/**
 * Interactive Modal for in-depth educational topic study
 */
export function openLearnTopicModal(topic) {
  let modalContainer = document.getElementById('learn-modal-backdrop');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'learn-modal-backdrop';
    document.body.appendChild(modalContainer);
  }

  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in';

  modalContainer.innerHTML = `
    <div class="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-auto">
      <!-- Modal Header -->
      <div class="sticky top-0 bg-white/95 backdrop-blur-md px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <i data-lucide="${topic.icon}" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">${topic.categoryName}</span>
            <h2 class="text-xl font-extrabold text-slate-900">${topic.title}</h2>
          </div>
        </div>

        <button id="btn-close-modal" type="button" class="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-8 space-y-7">
        <!-- Main Concept Explanation -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2">The Core Concept</h3>
          <p class="text-sm sm:text-base text-slate-700 leading-relaxed">
            ${topic.description}
          </p>
        </div>

        <!-- Real World Indian Rupee Example Card -->
        <div class="bg-gradient-to-br from-emerald-50/70 to-teal-50/50 rounded-2xl p-5 sm:p-6 border border-emerald-200/80">
          <div class="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <i data-lucide="calculator" class="w-4 h-4"></i> Real-World Scenario (₹ INR)
          </div>
          <p class="text-sm font-semibold text-slate-900 mb-4">${topic.example.scenario}</p>
          <div class="space-y-2.5">
            ${topic.example.breakdown.map(b => `
              <div class="bg-white/80 rounded-xl p-3 border border-emerald-100/80 text-xs sm:text-sm">
                <strong class="text-slate-900 block font-semibold mb-0.5">${b.label}</strong>
                <span class="text-slate-600">${b.detail}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Key Financial Terms -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
            <i data-lucide="bookmark" class="w-4 h-4 text-emerald-700"></i> Essential Vocabulary
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${topic.keyTerms.map(t => `
              <div class="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs">
                <strong class="text-slate-900 block font-bold text-xs mb-1 text-emerald-900">${t.term}</strong>
                <span class="text-slate-600 leading-relaxed">${t.definition}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Practical Action Tips -->
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4 text-teal-700"></i> Actionable Next Steps
          </h3>
          <ul class="space-y-2.5 text-xs sm:text-sm text-slate-700">
            ${topic.practicalTips.map(tip => `
              <li class="flex items-start gap-2.5">
                <i data-lucide="arrow-right-circle" class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"></i>
                <span>${tip}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Mini-Quiz Interactive Section -->
        <div class="bg-navy-900 text-white rounded-2xl p-5 sm:p-6">
          <div class="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <i data-lucide="help-circle" class="w-4 h-4"></i> Test Your Understanding
          </div>
          <h4 class="text-sm sm:text-base font-bold text-white mb-4">
            ${topic.miniQuiz.question}
          </h4>

          <div class="space-y-2" id="mini-quiz-options">
            ${topic.miniQuiz.options.map((opt, idx) => `
              <button 
                type="button" 
                class="mini-quiz-opt w-full text-left p-3 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-700 text-xs sm:text-sm text-slate-200 transition"
                data-idx="${idx}">
                ${opt}
              </button>
            `).join('')}
          </div>

          <div id="mini-quiz-feedback" class="mt-4 p-4 rounded-xl text-xs sm:text-sm hidden leading-relaxed"></div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="sticky bottom-0 bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <a href="#calculators" class="btn-goto-calc text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
          <i data-lucide="calculator" class="w-4 h-4"></i> Try Related Calculator
        </a>
        <button id="btn-close-modal-bottom" type="button" class="px-5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold transition">
          Done Reading
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Close handlers
  const closeModal = () => {
    modalContainer.remove();
  };

  modalContainer.querySelector('#btn-close-modal')?.addEventListener('click', closeModal);
  modalContainer.querySelector('#btn-close-modal-bottom')?.addEventListener('click', closeModal);
  modalContainer.querySelector('.btn-goto-calc')?.addEventListener('click', closeModal);
  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeModal();
  });

  // Mini Quiz Handler
  const optButtons = modalContainer.querySelectorAll('.mini-quiz-opt');
  const feedbackEl = modalContainer.querySelector('#mini-quiz-feedback');

  optButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedIndex = parseInt(btn.getAttribute('data-idx'), 10);
      const isCorrect = selectedIndex === topic.miniQuiz.correctIndex;

      optButtons.forEach(b => {
        b.disabled = true;
        b.classList.remove('hover:bg-navy-700');
        b.classList.add('opacity-70');
      });

      if (isCorrect) {
        btn.classList.remove('opacity-70', 'bg-navy-800');
        btn.classList.add('bg-emerald-700', 'border-emerald-500', 'text-white');
        feedbackEl.className = 'mt-4 p-4 rounded-xl text-xs sm:text-sm bg-emerald-900/60 border border-emerald-500/50 text-emerald-200';
        feedbackEl.innerHTML = `
          <strong class="block font-bold mb-1 text-emerald-300">✓ Correct!</strong>
          ${topic.miniQuiz.explanation}
        `;
      } else {
        btn.classList.remove('opacity-70', 'bg-navy-800');
        btn.classList.add('bg-rose-900/80', 'border-rose-500', 'text-white');
        
        // Highlight correct option
        const correctBtn = modalContainer.querySelector(`.mini-quiz-opt[data-idx="${topic.miniQuiz.correctIndex}"]`);
        correctBtn?.classList.remove('opacity-70', 'bg-navy-800');
        correctBtn?.classList.add('bg-emerald-800/80', 'border-emerald-500', 'text-white');

        feedbackEl.className = 'mt-4 p-4 rounded-xl text-xs sm:text-sm bg-rose-950/60 border border-rose-500/50 text-rose-200';
        feedbackEl.innerHTML = `
          <strong class="block font-bold mb-1 text-rose-300">✕ Not quite right</strong>
          ${topic.miniQuiz.explanation}
        `;
      }

      feedbackEl.classList.remove('hidden');
    });
  });
}
