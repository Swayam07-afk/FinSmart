/**
 * FinSmart Multi-Step Survey Controller
 * Handles demographic capture, consent verification, 5-stage category questionnaire,
 * question validation, progress caching, and score submission.
 */

import { state } from './state.js';
import { SURVEY_CATEGORIES, SURVEY_QUESTIONS } from '../data/questions.js';
import { AGE_GROUPS, EDUCATION_LEVELS, OCCUPATIONS, INCOME_RANGES, STATES_REGIONS } from '../data/sampleResearchData.js';
import { calculateSurveyScores } from './scoring.js';
import { showToast } from './router.js';

export function renderSurveyWizard(container) {
  if (!container) return;

  const currentStep = state.surveyProgress.currentStep || 0;
  const demographics = state.surveyProgress.demographics || {};
  const answers = state.surveyProgress.answers || {};

  // Total 6 steps: 0 = Demographics, 1 = Cat A, 2 = Cat B, 3 = Cat C, 4 = Cat D, 5 = Cat E
  const totalSteps = 6;
  const progressPercent = Math.round((currentStep / (totalSteps - 1)) * 100);

  let html = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Survey Header Card -->
      <div class="bg-navy-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold tracking-wide uppercase mb-3">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> Anonymous Research Survey
            </div>
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Financial Literacy Assessment</h1>
            <p class="text-slate-300 text-sm sm:text-base mt-1">
              ${currentStep === 0 
                ? 'Step 1 of 6: Anonymous Research Demographics' 
                : `Step ${currentStep + 1} of 6: ${SURVEY_CATEGORIES[currentStep - 1].name}`}
            </p>
          </div>
          
          <div class="flex items-center gap-2 sm:self-start">
            <button id="btn-save-progress" type="button" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs text-slate-200 border border-navy-700 transition">
              <i data-lucide="save" class="w-3.5 h-3.5"></i> Save Progress
            </button>
            <button id="btn-reset-survey" type="button" class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-800 hover:bg-rose-950/40 text-xs text-slate-300 hover:text-rose-300 border border-navy-700 transition">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> Reset
            </button>
          </div>
        </div>

        <!-- Progress Tracker Bar -->
        <div class="mt-6 pt-5 border-t border-navy-800">
          <div class="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Overall Completion: <strong>${progressPercent}%</strong></span>
            <span>
              ${currentStep === 0 ? 'Demographics' : `Questions ${(currentStep - 1) * 2 + 1} to ${currentStep * 2} of 10`}
            </span>
          </div>
          <div class="w-full bg-navy-800 rounded-full h-2.5 overflow-hidden">
            <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500 ease-out" style="width: ${Math.max(5, progressPercent)}%"></div>
          </div>

          <!-- Step Indicators -->
          <div class="grid grid-cols-6 gap-1 sm:gap-2 mt-4 text-[10px] sm:text-xs text-center">
            <div class="py-1 px-0.5 rounded ${currentStep === 0 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 0 ? 'text-emerald-400' : 'text-slate-500'}">
              1. Profile
            </div>
            <div class="py-1 px-0.5 rounded ${currentStep === 1 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 1 ? 'text-emerald-400' : 'text-slate-500'}">
              2. Knowledge
            </div>
            <div class="py-1 px-0.5 rounded ${currentStep === 2 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 2 ? 'text-emerald-400' : 'text-slate-500'}">
              3. Saving
            </div>
            <div class="py-1 px-0.5 rounded ${currentStep === 3 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 3 ? 'text-emerald-400' : 'text-slate-500'}">
              4. Investing
            </div>
            <div class="py-1 px-0.5 rounded ${currentStep === 4 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 4 ? 'text-emerald-400' : 'text-slate-500'}">
              5. Debt
            </div>
            <div class="py-1 px-0.5 rounded ${currentStep === 5 ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : currentStep > 5 ? 'text-emerald-400' : 'text-slate-500'}">
              6. Security
            </div>
          </div>
        </div>
      </div>

      <!-- Step Content Container -->
      <form id="survey-form" class="space-y-6" onsubmit="return false;">
        <div id="survey-step-container">
  `;

  if (currentStep === 0) {
    html += renderDemographicsStep(demographics);
  } else {
    const categoryIndex = currentStep - 1;
    const category = SURVEY_CATEGORIES[categoryIndex];
    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.category === category.id);
    html += renderCategoryStep(category, categoryQuestions, answers);
  }

  html += `
        </div>

        <!-- Wizard Navigation Action Bar -->
        <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <button 
            type="button" 
            id="btn-survey-prev" 
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition ${currentStep === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}">
            <i data-lucide="arrow-left" class="w-4 h-4"></i> Previous Step
          </button>

          <div class="text-xs text-slate-500 order-last sm:order-none">
            All fields marked with <span class="text-rose-500 font-bold">*</span> are required
          </div>

          ${currentStep < totalSteps - 1 ? `
            <button 
              type="button" 
              id="btn-survey-next" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition">
              Next Step <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          ` : `
            <button 
              type="button" 
              id="btn-survey-submit" 
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition transform hover:-translate-y-0.5">
              <i data-lucide="check-circle-2" class="w-5 h-5"></i> Submit Survey & View Score
            </button>
          `}
        </div>
      </form>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  attachSurveyListeners(container, currentStep);
}

function renderDemographicsStep(demographics) {
  return `
    <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
      <div class="border-b border-slate-100 pb-5 mb-6">
        <h2 class="text-xl font-bold text-slate-900">Demographic & Research Profile</h2>
        <p class="text-sm text-slate-600 mt-1">
          To help analyze financial literacy benchmarks across populations, please provide anonymous background info.
          <strong>We never ask for your name, phone number, bank details, or passwords.</strong>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Age Group -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2">
            Age Group <span class="text-rose-500">*</span>
          </label>
          <select id="demog-age" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white">
            <option value="">Select your age group</option>
            ${AGE_GROUPS.map(g => `
              <option value="${g}" ${demographics.age_group === g ? 'selected' : ''}>${g}</option>
            `).join('')}
          </select>
        </div>

        <!-- Education Level -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2">
            Highest Education Level <span class="text-rose-500">*</span>
          </label>
          <select id="demog-edu" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white">
            <option value="">Select education level</option>
            ${EDUCATION_LEVELS.map(e => `
              <option value="${e}" ${demographics.education === e ? 'selected' : ''}>${e}</option>
            `).join('')}
          </select>
        </div>

        <!-- Occupation -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2">
            Current Primary Occupation <span class="text-rose-500">*</span>
          </label>
          <select id="demog-occ" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white">
            <option value="">Select current occupation</option>
            ${OCCUPATIONS.map(o => `
              <option value="${o}" ${demographics.occupation === o ? 'selected' : ''}>${o}</option>
            `).join('')}
          </select>
        </div>

        <!-- Income Range -->
        <div>
          <label class="block text-sm font-semibold text-slate-800 mb-2">
            Annual Income Range (₹ INR) <span class="text-rose-500">*</span>
          </label>
          <select id="demog-inc" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white">
            <option value="">Select annual income range</option>
            ${INCOME_RANGES.map(i => `
              <option value="${i}" ${demographics.income_range === i ? 'selected' : ''}>${i}</option>
            `).join('')}
          </select>
        </div>

        <!-- State / Region -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-slate-800 mb-2">
            State / Region in India <span class="text-rose-500">*</span>
          </label>
          <select id="demog-loc" class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white">
            <option value="">Select state or region</option>
            ${STATES_REGIONS.map(s => `
              <option value="${s}" ${demographics.location === s ? 'selected' : ''}>${s}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Informed Consent Agreement -->
      <div class="mt-8 pt-6 border-t border-slate-200">
        <label class="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200/60 cursor-pointer hover:bg-emerald-100/50 transition">
          <input 
            type="checkbox" 
            id="demog-consent" 
            class="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
            ${demographics.consent ? 'checked' : ''}>
          <span class="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <strong class="text-slate-900 block font-semibold mb-0.5">Research Participation & Privacy Consent</strong>
            I understand that my anonymous responses may be used for financial literacy research, aggregate statistical analysis, and community education insights. No personally identifiable or sensitive financial data is collected or shared.
          </span>
        </label>
        <div id="consent-error" class="text-rose-600 text-xs mt-1.5 hidden font-medium">
          Please confirm your research consent to begin the survey.
        </div>
      </div>
    </div>
  `;
}

function renderCategoryStep(category, questions, answers) {
  return `
    <div class="space-y-6">
      <!-- Category Banner Card -->
      <div class="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <i data-lucide="${category.icon}" class="w-6 h-6"></i>
        </div>
        <div>
          <div class="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Pillar Evaluation</div>
          <h2 class="text-xl font-bold text-slate-900">${category.name}</h2>
          <p class="text-sm text-slate-600 mt-1">${category.description}</p>
        </div>
      </div>

      <!-- Questions List -->
      ${questions.map(q => renderQuestionCard(q, answers[q.id])).join('')}
    </div>
  `;
}

function renderQuestionCard(q, selectedVal) {
  return `
    <div class="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200 question-card" data-qid="${q.id}">
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
          Question ${q.number} of 10
        </div>
        ${q.type === 'select-multi' ? `
          <span class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Multi-select (check all that apply)
          </span>
        ` : ''}
      </div>

      <h3 class="text-base sm:text-lg font-semibold text-slate-900 leading-snug">
        ${q.text}
      </h3>

      ${q.hint ? `
        <div class="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-2.5 border border-slate-100">
          <i data-lucide="info" class="w-4 h-4 text-slate-400 shrink-0 mt-0.5"></i>
          <span>${q.hint}</span>
        </div>
      ` : ''}

      <!-- Options -->
      <div class="mt-4 space-y-2.5">
        ${renderQuestionOptions(q, selectedVal)}
      </div>

      <div class="q-error text-rose-600 text-xs mt-2 font-medium hidden">
        Please answer this question before continuing.
      </div>
    </div>
  `;
}

function renderQuestionOptions(q, selectedVal) {
  if (q.type === 'select-multi') {
    const selectedArr = Array.isArray(selectedVal) ? selectedVal : [];
    return q.options.map(opt => {
      const isChecked = selectedArr.includes(opt.id);
      return `
        <label class="flex items-start gap-3 p-3.5 rounded-xl border ${isChecked ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'} cursor-pointer transition">
          <input 
            type="checkbox" 
            name="${q.id}" 
            value="${opt.id}" 
            class="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" 
            ${isChecked ? 'checked' : ''}>
          <span class="text-sm text-slate-800 leading-relaxed font-normal">${opt.text}</span>
        </label>
      `;
    }).join('');
  }

  // Radio / Single-select
  return q.options.map(opt => {
    const isSelected = selectedVal === opt.id;
    return `
      <label class="flex items-start gap-3 p-3.5 rounded-xl border ${isSelected ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600' : 'border-slate-200 hover:border-slate-300 bg-white'} cursor-pointer transition">
        <input 
          type="radio" 
          name="${q.id}" 
          value="${opt.id}" 
          class="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500" 
          ${isSelected ? 'checked' : ''}>
        <span class="text-sm text-slate-800 leading-relaxed font-normal">${opt.text}</span>
      </label>
    `;
  }).join('');
}

function attachSurveyListeners(container, currentStep) {
  // Save Progress button
  const btnSave = container.querySelector('#btn-save-progress');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      saveCurrentStepInputs(currentStep);
      showToast('Survey progress saved to browser storage!', 'success');
    });
  }

  // Reset button
  const btnReset = container.querySelector('#btn-reset-survey');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset your survey progress and start over?')) {
        state.clearSurveyProgress();
        renderSurveyWizard(container);
        showToast('Survey has been reset.', 'info');
      }
    });
  }

  // Prev Step button
  const btnPrev = container.querySelector('#btn-survey-prev');
  if (btnPrev && currentStep > 0) {
    btnPrev.addEventListener('click', () => {
      saveCurrentStepInputs(currentStep);
      state.setSurveyStep(currentStep - 1);
      renderSurveyWizard(container);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Next Step button
  const btnNext = container.querySelector('#btn-survey-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        saveCurrentStepInputs(currentStep);
        state.setSurveyStep(currentStep + 1);
        renderSurveyWizard(container);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Submit button
  const btnSubmit = container.querySelector('#btn-survey-submit');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      if (validateCurrentStep(currentStep)) {
        saveCurrentStepInputs(currentStep);
        submitSurvey();
      }
    });
  }

  // Real-time radio change highlighting
  const form = container.querySelector('#survey-form');
  if (form) {
    form.addEventListener('change', (e) => {
      if (e.target.type === 'radio') {
        const card = e.target.closest('.question-card');
        if (card) {
          card.querySelectorAll('label').forEach(lbl => {
            lbl.classList.remove('border-emerald-600', 'bg-emerald-50/60', 'ring-1', 'ring-emerald-600');
            lbl.classList.add('border-slate-200');
          });
          const activeLabel = e.target.closest('label');
          if (activeLabel) {
            activeLabel.classList.remove('border-slate-200');
            activeLabel.classList.add('border-emerald-600', 'bg-emerald-50/60', 'ring-1', 'ring-emerald-600');
          }
          const err = card.querySelector('.q-error');
          if (err) err.classList.add('hidden');
        }
      } else if (e.target.type === 'checkbox' && e.target.name) {
        const activeLabel = e.target.closest('label');
        if (activeLabel) {
          if (e.target.checked) {
            activeLabel.classList.remove('border-slate-200');
            activeLabel.classList.add('border-emerald-600', 'bg-emerald-50/60');
          } else {
            activeLabel.classList.remove('border-emerald-600', 'bg-emerald-50/60');
            activeLabel.classList.add('border-slate-200');
          }
        }
      }
    });
  }
}

function saveCurrentStepInputs(step) {
  if (step === 0) {
    const age = document.getElementById('demog-age')?.value || '';
    const edu = document.getElementById('demog-edu')?.value || '';
    const occ = document.getElementById('demog-occ')?.value || '';
    const inc = document.getElementById('demog-inc')?.value || '';
    const loc = document.getElementById('demog-loc')?.value || '';
    const consent = document.getElementById('demog-consent')?.checked || false;

    state.updateSurveyDemographics({
      age_group: age,
      education: edu,
      occupation: occ,
      income_range: inc,
      location: loc,
      consent
    });
  } else {
    const categoryIndex = step - 1;
    const category = SURVEY_CATEGORIES[categoryIndex];
    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.category === category.id);

    for (const q of categoryQuestions) {
      if (q.type === 'select-multi') {
        const checkedInputs = Array.from(document.querySelectorAll(`input[name="${q.id}"]:checked`));
        state.recordAnswer(q.id, checkedInputs.map(i => i.value));
      } else {
        const checkedInput = document.querySelector(`input[name="${q.id}"]:checked`);
        if (checkedInput) {
          state.recordAnswer(q.id, checkedInput.value);
        }
      }
    }
  }
}

function validateCurrentStep(step) {
  let isValid = true;

  if (step === 0) {
    const age = document.getElementById('demog-age');
    const edu = document.getElementById('demog-edu');
    const occ = document.getElementById('demog-occ');
    const inc = document.getElementById('demog-inc');
    const loc = document.getElementById('demog-loc');
    const consent = document.getElementById('demog-consent');
    const consentError = document.getElementById('consent-error');

    const fields = [age, edu, occ, inc, loc];
    for (const field of fields) {
      if (!field.value) {
        field.classList.add('border-rose-500', 'bg-rose-50');
        isValid = false;
      } else {
        field.classList.remove('border-rose-500', 'bg-rose-50');
      }
    }

    if (!consent.checked) {
      consentError?.classList.remove('hidden');
      isValid = false;
    } else {
      consentError?.classList.add('hidden');
    }

    if (!isValid) {
      showToast('Please fill all demographic fields and agree to the consent terms.', 'error');
    }
  } else {
    const categoryIndex = step - 1;
    const category = SURVEY_CATEGORIES[categoryIndex];
    const categoryQuestions = SURVEY_QUESTIONS.filter(q => q.category === category.id);

    for (const q of categoryQuestions) {
      if (q.required) {
        const card = document.querySelector(`.question-card[data-qid="${q.id}"]`);
        const err = card?.querySelector('.q-error');
        const checkedInput = document.querySelector(`input[name="${q.id}"]:checked`);

        if (!checkedInput) {
          err?.classList.remove('hidden');
          card?.classList.add('border-rose-300', 'ring-1', 'ring-rose-200');
          isValid = false;
        } else {
          err?.classList.add('hidden');
          card?.classList.remove('border-rose-300', 'ring-1', 'ring-rose-200');
        }
      }
    }

    if (!isValid) {
      showToast('Please answer all required questions in this section.', 'error');
    }
  }

  return isValid;
}

function submitSurvey() {
  const answers = state.surveyProgress.answers;
  const demographics = state.surveyProgress.demographics;

  const scoreResults = calculateSurveyScores(answers);
  const profile = {
    demographics,
    ...scoreResults
  };

  state.saveUserProfile(profile);

  // Trigger celebration
  if (window.confetti && scoreResults.overallScore >= 60) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  showToast('Your responses have been recorded successfully!', 'success');

  // Navigate to results
  window.location.hash = '#results';
}
