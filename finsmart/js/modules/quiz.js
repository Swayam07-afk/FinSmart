/**
 * FinSmart Interactive Financial Literacy Quiz
 * Step-by-step 10-question rapid quiz with instant feedback, explanations,
 * scoring tiers, and direct navigation to learning modules.
 */

import { QUIZ_QUESTIONS } from '../data/quizData.js';

let currentQuizIndex = 0;
let userAnswers = []; // array of { questionId, selectedIndex, isCorrect }
let hasAnsweredCurrent = false;

export function renderQuiz(container) {
  if (!container) return;

  currentQuizIndex = 0;
  userAnswers = [];
  hasAnsweredCurrent = false;

  renderQuizStep(container);
}

function renderQuizStep(container) {
  const total = QUIZ_QUESTIONS.length;

  // Final Summary Screen
  if (currentQuizIndex >= total) {
    renderQuizResults(container);
    return;
  }

  const q = QUIZ_QUESTIONS[currentQuizIndex];
  const progressPercent = Math.round(((currentQuizIndex) / total) * 100);

  const html = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Quiz Header -->
      <div class="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="flex items-center justify-between gap-4 mb-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <i data-lucide="zap" class="w-3.5 h-3.5"></i> Rapid Knowledge Quiz
          </div>
          <span class="text-xs font-semibold text-slate-300">
            Question ${currentQuizIndex + 1} of ${total}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight">Test Your Money Smarts</h1>
        <p class="text-slate-300 text-xs sm:text-sm mt-1">
          Topic: <span class="text-emerald-400 font-semibold">${q.topic}</span>
        </p>

        <!-- Progress Bar -->
        <div class="w-full bg-navy-800 rounded-full h-2 mt-5 overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-300 ease-out" style="width: ${Math.max(5, progressPercent)}%"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <h2 class="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-6">
          ${q.question}
        </h2>

        <!-- Options -->
        <div class="space-y-3" id="quiz-options-list">
          ${q.options.map((opt, idx) => `
            <button 
              type="button" 
              class="quiz-option-btn w-full text-left p-4 rounded-2xl border border-slate-200 hover:border-emerald-500/60 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-medium transition flex items-center justify-between gap-3 group"
              data-idx="${idx}">
              <span>${opt}</span>
              <span class="w-6 h-6 rounded-full border border-slate-300 group-hover:border-emerald-500 flex items-center justify-center shrink-0 text-xs text-slate-400">
                ${String.fromCharCode(65 + idx)}
              </span>
            </button>
          `).join('')}
        </div>

        <!-- Explanation Feedback Box (Hidden initially) -->
        <div id="quiz-feedback-box" class="mt-6 p-5 rounded-2xl hidden leading-relaxed text-sm">
        </div>

        <!-- Next / Continue Action -->
        <div class="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-600">
            Select an answer to see the detailed breakdown.
          </span>
          <button 
            type="button" 
            id="btn-quiz-next" 
            class="hidden inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition">
            ${currentQuizIndex === total - 1 ? 'Finish Quiz' : 'Next Question'} <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  const optionButtons = container.querySelectorAll('.quiz-option-btn');
  const feedbackBox = container.querySelector('#quiz-feedback-box');
  const nextBtn = container.querySelector('#btn-quiz-next');

  optionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (hasAnsweredCurrent) return;
      hasAnsweredCurrent = true;

      const selectedIdx = parseInt(btn.getAttribute('data-idx'), 10);
      const isCorrect = selectedIdx === q.correctIndex;

      userAnswers.push({
        questionId: q.id,
        topic: q.topic,
        selectedIdx,
        isCorrect
      });

      // Disable all options
      optionButtons.forEach(b => {
        b.classList.add('pointer-events-none', 'opacity-60');
      });

      if (isCorrect) {
        btn.classList.remove('opacity-60', 'bg-white', 'border-slate-200');
        btn.classList.add('bg-emerald-50', 'border-emerald-600', 'ring-2', 'ring-emerald-600/30', 'text-emerald-950');
        feedbackBox.className = 'mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 leading-relaxed text-sm';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-2 font-bold text-emerald-800 mb-1">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Correct!
          </div>
          <p class="text-slate-700 text-xs sm:text-sm">${q.explanation}</p>
        `;
      } else {
        btn.classList.remove('opacity-60', 'bg-white', 'border-slate-200');
        btn.classList.add('bg-rose-50', 'border-rose-500', 'ring-2', 'ring-rose-500/30', 'text-rose-950');
        
        // Highlight correct option
        const correctBtn = container.querySelector(`.quiz-option-btn[data-idx="${q.correctIndex}"]`);
        correctBtn?.classList.remove('opacity-60');
        correctBtn?.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-900');

        feedbackBox.className = 'mt-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 leading-relaxed text-sm';
        feedbackBox.innerHTML = `
          <div class="flex items-center gap-2 font-bold text-rose-800 mb-1">
            <i data-lucide="x-circle" class="w-4 h-4"></i> Not quite right.
          </div>
          <p class="text-slate-700 text-xs sm:text-sm">${q.explanation}</p>
        `;
      }

      feedbackBox.classList.remove('hidden');
      nextBtn.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  });

  nextBtn?.addEventListener('click', () => {
    currentQuizIndex++;
    hasAnsweredCurrent = false;
    renderQuizStep(container);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function renderQuizResults(container) {
  const total = QUIZ_QUESTIONS.length;
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / total) * 100);

  let title = 'Great Effort!';
  let color = 'text-amber-500';
  let badgeClass = 'bg-amber-100 text-amber-800';

  if (percentage >= 80) {
    title = 'Financial Master!';
    color = 'text-emerald-500';
    badgeClass = 'bg-emerald-100 text-emerald-800';
    if (window.confetti) {
      window.confetti({ particleCount: 80, spread: 60 });
    }
  } else if (percentage >= 60) {
    title = 'Good Knowledge!';
    color = 'text-teal-600';
    badgeClass = 'bg-teal-100 text-teal-800';
  }

  const html = `
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 ${badgeClass} rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
          <i data-lucide="award" class="w-4 h-4"></i> Quiz Completed
        </div>

        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">${title}</h1>
        
        <div class="my-6">
          <div class="text-6xl font-black ${color} tracking-tight">
            ${correctCount} <span class="text-3xl text-slate-400 font-semibold">/ ${total}</span>
          </div>
          <div class="text-sm font-semibold text-slate-600 mt-2">
            Quiz Score: ${percentage}% Correct
          </div>
        </div>

        <p class="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-8">
          ${percentage >= 80 
            ? 'Excellent! You clearly understand essential concepts like compounding, inflation, loan mechanics, and financial defenses.' 
            : 'Keep building your financial knowledge! Review our curated guides to master compound interest, credit card health, and debt minimization.'}
        </p>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-100">
          <a href="#learn" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition">
            <i data-lucide="book-open" class="w-4 h-4"></i> Improve Your Knowledge
          </a>
          <button 
            type="button" 
            id="btn-retake-quiz" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition">
            <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Retake Quiz
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-retake-quiz')?.addEventListener('click', () => {
    renderQuiz(container);
  });
}
