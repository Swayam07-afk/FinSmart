/**
 * FinSmart Google Gemini API Key Management Modal & Controls
 * Provides a dedicated, secure dialog for users to enter, test, switch models,
 * and manage their Gemini API key locally.
 */

import {
  getGeminiApiKey,
  setGeminiApiKey,
  removeGeminiApiKey,
  hasGeminiApiKey,
  getGeminiModel,
  setGeminiModel,
  testGeminiApiKey,
  AVAILABLE_MODELS
} from './geminiService.js';
import { showToast } from './router.js';

let modalElement = null;

/**
 * Initialize navbar buttons and listeners for Gemini API key controls.
 */
export function initApiKeyControls() {
  // Desktop Navbar button
  const desktopBtn = document.getElementById('btn-gemini-key');
  if (desktopBtn) {
    desktopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openApiKeyModal();
    });
  }

  // Mobile drawer button
  const mobileBtn = document.getElementById('btn-mobile-gemini-key');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openApiKeyModal();
    });
  }

  // Listen to key changes to update indicators
  window.addEventListener('finsmart:gemini-key-change', () => {
    updateNavbarApiKeyStatus();
  });

  // Initial indicator render
  updateNavbarApiKeyStatus();
}

/**
 * Updates navbar badges and buttons to reflect active/inactive API key state.
 */
export function updateNavbarApiKeyStatus() {
  const isConfigured = hasGeminiApiKey();

  // Desktop badge dot
  const desktopDot = document.getElementById('gemini-key-dot');
  const desktopLabel = document.getElementById('gemini-key-label');
  if (desktopDot) {
    desktopDot.className = `w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`;
  }
  if (desktopLabel) {
    desktopLabel.textContent = isConfigured ? 'Gemini AI' : 'Set Gemini Key';
  }

  // Mobile badge
  const mobileStatus = document.getElementById('mobile-gemini-status');
  if (mobileStatus) {
    mobileStatus.textContent = isConfigured ? 'Configured' : 'Not Set';
    mobileStatus.className = `text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
      isConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
    }`;
  }
}

/**
 * Opens the Gemini API Key Configuration modal.
 * @param {Object} [options]
 * @param {Function} [options.onSaved] - Callback when key is saved successfully
 * @param {string} [options.message] - Optional contextual prompt message
 */
export function openApiKeyModal(options = {}) {
  // Remove existing modal if present
  if (modalElement) {
    modalElement.remove();
  }

  const currentKey = getGeminiApiKey();
  const currentModel = getGeminiModel();
  const isConfigured = Boolean(currentKey);

  const modal = document.createElement('div');
  modal.id = 'gemini-key-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in';
  
  modal.innerHTML = `
    <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" role="dialog" aria-modal="true">
      
      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white p-6 sm:p-7 relative">
        <button 
          id="btn-close-api-modal" 
          type="button" 
          class="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition"
          aria-label="Close dialog">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>

        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 text-navy-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
            <i data-lucide="key" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-black text-white">Google Gemini AI Settings</h2>
              <span id="modal-key-badge" class="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                isConfigured ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }">
                ${isConfigured ? 'Key Configured' : 'Key Required'}
              </span>
            </div>
            <p class="text-xs text-slate-300 mt-1">
              Provide your own free Google Gemini API key to generate intelligent financial quizzes.
            </p>
          </div>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">

        ${options.message ? `
          <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 flex items-start gap-2.5">
            <i data-lucide="info" class="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"></i>
            <span>${options.message}</span>
          </div>
        ` : ''}

        <!-- API Key Input Section -->
        <div>
          <label for="input-gemini-key" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Google Gemini API Key <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <input 
              type="password" 
              id="input-gemini-key" 
              value="${currentKey}" 
              placeholder="Paste your key here (e.g. AIzaSy...)" 
              class="w-full pl-4 pr-24 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm font-mono text-slate-900 transition outline-none"
              autocomplete="off"
              spellcheck="false"
            />
            <div class="absolute inset-y-0 right-2 flex items-center gap-1">
              <button 
                type="button" 
                id="btn-toggle-key-visibility" 
                class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                title="Show/Hide API Key">
                <i data-lucide="eye" id="eye-icon" class="w-4 h-4"></i>
              </button>
              <button 
                type="button" 
                id="btn-paste-key" 
                class="px-2 py-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition"
                title="Paste from clipboard">
                Paste
              </button>
            </div>
          </div>
          <p class="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
            Stored 100% locally in your browser's private storage. Never transmitted to FinSmart servers.
          </p>
        </div>

        <!-- Model Selection Dropdown -->
        <div>
          <label for="select-gemini-model" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Gemini AI Model
          </label>
          <select 
            id="select-gemini-model" 
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-800 bg-white transition outline-none">
            ${AVAILABLE_MODELS.map(m => `
              <option value="${m.id}" ${m.id === currentModel ? 'selected' : ''}>
                ${m.name} (${m.tag}) — ${m.description}
              </option>
            `).join('')}
          </select>
          <p class="text-[11px] text-slate-500 mt-1.5">
            Default: <strong>Gemini 2.5 Flash</strong> (Fastest with full financial logic).
          </p>
        </div>

        <!-- Live Validation Status Feedback Box -->
        <div id="api-test-status" class="hidden p-4 rounded-2xl text-xs sm:text-sm transition leading-relaxed"></div>

        <!-- How to get a free key card -->
        <div class="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <i data-lucide="sparkles" class="w-4 h-4 text-emerald-600"></i> How to get a Free Google Gemini API Key
            </span>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline">
              Google AI Studio <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
            </a>
          </div>
          <ol class="list-decimal pl-4 space-y-1.5 text-xs text-slate-600">
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-emerald-700 font-medium hover:underline">Google AI Studio (aistudio.google.com)</a>.</li>
            <li>Sign in with your Google account.</li>
            <li>Click the blue <strong>"Create API Key"</strong> button (it is 100% free with generous daily rate limits).</li>
            <li>Copy your key, paste it into the field above, and click <strong>"Test & Save Key"</strong>!</li>
          </ol>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          ${isConfigured ? `
            <button 
              type="button" 
              id="btn-remove-api-key" 
              class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center justify-center gap-1.5">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Remove Key
            </button>
          ` : `
            <span class="text-[11px] text-slate-500">Free tier quota is sufficient for hundreds of quizzes.</span>
          `}
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button 
            type="button" 
            id="btn-cancel-api-modal" 
            class="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition">
            Close
          </button>
          <button 
            type="button" 
            id="btn-save-api-key" 
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/25 transition">
            <span id="btn-save-spinner" class="hidden animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            <i data-lucide="check" id="btn-save-check" class="w-3.5 h-3.5"></i>
            <span id="btn-save-text">Test & Save Key</span>
          </button>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(modal);
  modalElement = modal;

  if (window.lucide) window.lucide.createIcons();

  // Attach interactive listeners
  const inputKey = modal.querySelector('#input-gemini-key');
  const selectModel = modal.querySelector('#select-gemini-model');
  const toggleVisibilityBtn = modal.querySelector('#btn-toggle-key-visibility');
  const pasteBtn = modal.querySelector('#btn-paste-key');
  const testStatusEl = modal.querySelector('#api-test-status');
  const saveBtn = modal.querySelector('#btn-save-api-key');
  const saveSpinner = modal.querySelector('#btn-save-spinner');
  const saveCheck = modal.querySelector('#btn-save-check');
  const saveText = modal.querySelector('#btn-save-text');
  const removeBtn = modal.querySelector('#btn-remove-api-key');
  const closeBtn = modal.querySelector('#btn-close-api-modal');
  const cancelBtn = modal.querySelector('#btn-cancel-api-modal');

  // Close handlers
  const closeModal = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.remove();
      modalElement = null;
    }, 200);
  };

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Toggle Visibility
  toggleVisibilityBtn?.addEventListener('click', () => {
    const isPass = inputKey.type === 'password';
    inputKey.type = isPass ? 'text' : 'password';
    const eyeIcon = modal.querySelector('#eye-icon');
    if (eyeIcon) {
      eyeIcon.setAttribute('data-lucide', isPass ? 'eye-off' : 'eye');
      if (window.lucide) window.lucide.createIcons();
    }
  });

  // Paste from clipboard
  pasteBtn?.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        inputKey.value = text.trim();
        showToast('Pasted API key from clipboard', 'info');
      }
    } catch (err) {
      showToast('Clipboard access was blocked. Please paste manually.', 'error');
    }
  });

  // Remove Key
  removeBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to remove your saved Gemini API key from this browser?')) {
      removeGeminiApiKey();
      inputKey.value = '';
      updateNavbarApiKeyStatus();
      showToast('Gemini API key removed successfully.', 'info');
      closeModal();
    }
  });

  // Save & Test Key
  saveBtn?.addEventListener('click', async () => {
    const keyVal = (inputKey.value || '').trim();
    const modelVal = selectModel.value;

    if (!keyVal) {
      testStatusEl.className = 'p-4 rounded-2xl text-xs sm:text-sm bg-rose-50 border border-rose-200 text-rose-800';
      testStatusEl.innerHTML = `
        <div class="flex items-center gap-2 font-bold mb-1">
          <i data-lucide="alert-circle" class="w-4 h-4"></i> Empty Key
        </div>
        <p>Please enter or paste a valid Google Gemini API key.</p>
      `;
      testStatusEl.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Set UI to loading state
    saveBtn.disabled = true;
    saveSpinner.classList.remove('hidden');
    saveCheck.classList.add('hidden');
    saveText.textContent = 'Testing connection...';
    testStatusEl.className = 'p-4 rounded-2xl text-xs sm:text-sm bg-blue-50 border border-blue-200 text-blue-900';
    testStatusEl.innerHTML = `
      <div class="flex items-center gap-2 font-bold mb-1">
        <span class="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></span>
        Connecting to Google Gemini API...
      </div>
      <p>Validating authentication and testing model response...</p>
    `;
    testStatusEl.classList.remove('hidden');

    // Run connection test
    const testResult = await testGeminiApiKey(keyVal, modelVal);

    saveBtn.disabled = false;
    saveSpinner.classList.add('hidden');
    saveCheck.classList.remove('hidden');
    saveText.textContent = 'Test & Save Key';

    if (testResult.success) {
      // Save valid key and model
      setGeminiApiKey(keyVal);
      setGeminiModel(testResult.modelUsed || modelVal);
      updateNavbarApiKeyStatus();

      testStatusEl.className = 'p-4 rounded-2xl text-xs sm:text-sm bg-emerald-50 border border-emerald-300 text-emerald-900';
      testStatusEl.innerHTML = `
        <div class="flex items-center gap-2 font-bold mb-1 text-emerald-800">
          <i data-lucide="check-circle" class="w-4 h-4"></i> Connection Successful!
        </div>
        <p>${testResult.message}</p>
      `;
      if (window.lucide) window.lucide.createIcons();

      showToast('Google Gemini API Key saved and verified!', 'success');

      if (typeof options.onSaved === 'function') {
        options.onSaved(keyVal, testResult.modelUsed || modelVal);
      }

      setTimeout(() => {
        closeModal();
      }, 1200);
    } else {
      testStatusEl.className = 'p-4 rounded-2xl text-xs sm:text-sm bg-rose-50 border border-rose-300 text-rose-900';
      testStatusEl.innerHTML = `
        <div class="flex items-center gap-2 font-bold mb-1 text-rose-800">
          <i data-lucide="x-circle" class="w-4 h-4"></i> Validation Failed
        </div>
        <p>${testResult.message}</p>
        <p class="mt-2 text-[11px] text-slate-600">
          Make sure your API key has Generative Language API access enabled on Google AI Studio.
        </p>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  });

  inputKey.focus();
}
