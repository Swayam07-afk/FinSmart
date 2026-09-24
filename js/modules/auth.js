/**
 * FinSmart User Authentication Module
 * Provides Sign In & Sign Up flows supporting both Email and Mobile Number identifiers,
 * password authentication, password reset, demo credentials helper, and user profile management.
 */

import { state } from './state.js';
import { showToast } from './router.js';

let currentAuthMode = 'signin'; // 'signin' | 'signup'
let currentMethod = 'email'; // 'email' | 'mobile'

export function renderAuthPage(container, mode = 'signin') {
  if (!container) return;

  // If user is already logged in, redirect to profile view
  if (state.currentUser) {
    renderUserProfile(container);
    return;
  }

  currentAuthMode = mode;

  const html = `
    <div class="max-w-md mx-auto px-4 py-10 sm:py-16">
      <!-- Auth Container Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 relative overflow-hidden">
        <div class="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Header -->
        <div class="text-center mb-6 relative z-10">
          <a href="#home" class="inline-flex items-center gap-2 mb-4 group">
            <div class="w-10 h-10 rounded-xl bg-navy-900 text-emerald-400 flex items-center justify-center shadow-md">
              <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
          </a>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" id="auth-main-title">
            ${currentAuthMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p class="text-slate-600 text-xs sm:text-sm mt-1" id="auth-subtitle">
            ${currentAuthMode === 'signin' 
              ? 'Sign in to access your financial literacy score & personalized plans.' 
              : 'Sign up to track your financial health and save your scores.'}
          </p>
        </div>

        <!-- Mode Toggle Tabs (Sign In / Sign Up) -->
        <div class="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-6">
          <button 
            type="button" 
            id="tab-mode-signin" 
            class="py-2 text-xs sm:text-sm font-bold rounded-lg transition ${currentAuthMode === 'signin' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Sign In
          </button>
          <button 
            type="button" 
            id="tab-mode-signup" 
            class="py-2 text-xs sm:text-sm font-bold rounded-lg transition ${currentAuthMode === 'signup' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}">
            Sign Up
          </button>
        </div>

        <!-- Identifier Type Selector (Email vs Mobile Number) -->
        <div class="flex items-center justify-center gap-4 mb-5 text-xs font-semibold text-slate-600">
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="auth-method" value="email" class="text-emerald-600 focus:ring-emerald-500" ${currentMethod === 'email' ? 'checked' : ''}>
            <span>Continue with Email</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer">
            <input type="radio" name="auth-method" value="mobile" class="text-emerald-600 focus:ring-emerald-500" ${currentMethod === 'mobile' ? 'checked' : ''}>
            <span>Continue with Mobile</span>
          </label>
        </div>

        <!-- Form Body Container -->
        <div id="auth-form-container">
          ${currentAuthMode === 'signin' ? renderSignInForm() : renderSignUpForm()}
        </div>

        <!-- Quick Demo Login Helper -->
        <div class="mt-6 pt-5 border-t border-slate-100 text-center">
          <div class="text-[11px] text-slate-600 mb-2 font-medium">Testing or evaluating FinSmart?</div>
          <button 
            type="button" 
            id="btn-quick-demo-login" 
            class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-bold transition flex items-center justify-center gap-2">
            <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-500"></i> One-Click Demo Sign In (Aarav)
          </button>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  attachAuthListeners(container);
}

function renderSignInForm() {
  return `
    <form id="signin-form" class="space-y-4" onsubmit="return false;">
      ${currentMethod === 'email' ? `
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address <span class="text-rose-500">*</span></label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </div>
            <input 
              type="email" 
              id="signin-email" 
              placeholder="name@example.com" 
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              required>
          </div>
        </div>
      ` : `
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Mobile Number <span class="text-rose-500">*</span></label>
          <div class="flex rounded-xl shadow-2xs">
            <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-semibold">
              🇮🇳 +91
            </span>
            <input 
              type="tel" 
              id="signin-mobile" 
              placeholder="98765 43210" 
              maxlength="10" 
              class="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              required>
          </div>
          <span class="text-[11px] text-slate-600 mt-1 block">Enter 10-digit mobile number</span>
        </div>
      `}

      <!-- Password Field -->
      <div id="password-group">
        <div class="flex items-center justify-between mb-1">
          <label class="block text-xs font-semibold text-slate-700">Password <span class="text-rose-500">*</span></label>
          <button type="button" id="btn-forgot-password" class="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold">
            Forgot password?
          </button>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <i data-lucide="lock" class="w-4 h-4"></i>
          </div>
          <input 
            type="password" 
            id="signin-password" 
            placeholder="••••••••" 
            class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            required>
          <button 
            type="button" 
            id="btn-toggle-password" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </div>
      </div>



      <!-- Remember Me -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" id="signin-remember" checked class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500">
          <span class="text-xs text-slate-600">Remember this device</span>
        </label>
      </div>

      <div id="signin-error" class="text-rose-600 text-xs hidden font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200"></div>

      <button 
        type="submit" 
        id="btn-submit-signin" 
        class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
        <i data-lucide="log-in" class="w-4 h-4"></i> Sign In
      </button>
    </form>
  `;
}

function renderSignUpForm() {
  return `
    <form id="signup-form" class="space-y-4" onsubmit="return false;">
      <!-- Full Name -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name <span class="text-rose-500">*</span></label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <i data-lucide="user" class="w-4 h-4"></i>
          </div>
          <input 
            type="text" 
            id="signup-name" 
            placeholder="e.g. Priya Patel" 
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            required>
        </div>
      </div>

      ${currentMethod === 'email' ? `
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address <span class="text-rose-500">*</span></label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i data-lucide="mail" class="w-4 h-4"></i>
            </div>
            <input 
              type="email" 
              id="signup-email" 
              placeholder="name@example.com" 
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              required>
          </div>
        </div>
      ` : `
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Mobile Number <span class="text-rose-500">*</span></label>
          <div class="flex rounded-xl shadow-2xs">
            <span class="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-semibold">
              🇮🇳 +91
            </span>
            <input 
              type="tel" 
              id="signup-mobile" 
              placeholder="98765 43210" 
              maxlength="10" 
              class="w-full px-3 py-2.5 rounded-r-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              required>
          </div>
          <span class="text-[11px] text-slate-600 mt-1 block">Enter 10-digit mobile number</span>
        </div>
      `}

      <!-- Password -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Create Password <span class="text-rose-500">*</span></label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <i data-lucide="lock" class="w-4 h-4"></i>
          </div>
          <input 
            type="password" 
            id="signup-password" 
            placeholder="At least 6 characters" 
            class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            required>
          <button 
            type="button" 
            id="btn-toggle-password-signup" 
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
            <i data-lucide="eye" class="w-4 h-4"></i>
          </button>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">Confirm Password <span class="text-rose-500">*</span></label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <i data-lucide="lock" class="w-4 h-4"></i>
          </div>
          <input 
            type="password" 
            id="signup-confirm-password" 
            placeholder="Re-enter password" 
            class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            required>
        </div>
      </div>

      <!-- Terms Checkbox -->
      <label class="flex items-start gap-2.5 cursor-pointer">
        <input type="checkbox" id="signup-terms" class="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" required>
        <span class="text-xs text-slate-600 leading-snug">
          I agree to the <a href="#privacy" class="text-emerald-700 font-semibold underline">Privacy Policy</a> and confirm I will use this platform for financial education.
        </span>
      </label>

      <div id="signup-error" class="text-rose-600 text-xs hidden font-medium bg-rose-50 p-2.5 rounded-lg border border-rose-200"></div>

      <button 
        type="submit" 
        id="btn-submit-signup" 
        class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
        <i data-lucide="user-plus" class="w-4 h-4"></i> Create Account
      </button>
    </form>
  `;
}

function attachAuthListeners(container) {
  // Mode Tab Switchers
  const tabSignIn = container.querySelector('#tab-mode-signin');
  const tabSignUp = container.querySelector('#tab-mode-signup');

  tabSignIn?.addEventListener('click', () => {
    currentAuthMode = 'signin';
    renderAuthPage(container, 'signin');
  });

  tabSignUp?.addEventListener('click', () => {
    currentAuthMode = 'signup';
    renderAuthPage(container, 'signup');
  });

  // Identifier Method Switcher (Email vs Mobile)
  container.querySelectorAll('input[name="auth-method"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentMethod = e.target.value;
      const formContainer = container.querySelector('#auth-form-container');
      if (formContainer) {
        formContainer.innerHTML = currentAuthMode === 'signin' ? renderSignInForm() : renderSignUpForm();
        if (window.lucide) window.lucide.createIcons();
        attachFormListeners(container);
      }
    });
  });

  // Quick Demo Login Button
  const demoBtn = container.querySelector('#btn-quick-demo-login');
  demoBtn?.addEventListener('click', () => {
    const demoUser = state.users.find(u => u.email === 'aarav@example.com') || state.users[0];
    if (demoUser) {
      state.setCurrentUser(demoUser);
      showToast(`Welcome back, ${demoUser.name}!`, 'success');
      window.location.hash = '#home';
    }
  });

  attachFormListeners(container);
}

function attachFormListeners(container) {
  // Toggle password visibility
  const btnTogglePass = container.querySelector('#btn-toggle-password');
  const inputPass = container.querySelector('#signin-password');
  if (btnTogglePass && inputPass) {
    btnTogglePass.addEventListener('click', () => {
      const isPassword = inputPass.type === 'password';
      inputPass.type = isPassword ? 'text' : 'password';
      btnTogglePass.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  const btnTogglePassSignup = container.querySelector('#btn-toggle-password-signup');
  const inputPassSignup = container.querySelector('#signup-password');
  if (btnTogglePassSignup && inputPassSignup) {
    btnTogglePassSignup.addEventListener('click', () => {
      const isPassword = inputPassSignup.type === 'password';
      inputPassSignup.type = isPassword ? 'text' : 'password';
      btnTogglePassSignup.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // Forgot password trigger
  const forgotBtn = container.querySelector('#btn-forgot-password');
  forgotBtn?.addEventListener('click', () => {
    openForgotPasswordModal();
  });


  // Handle Sign In submission
  const signinForm = container.querySelector('#signin-form');
  signinForm?.addEventListener('submit', () => {
    const errEl = container.querySelector('#signin-error');
    errEl?.classList.add('hidden');

    let identifier = '';
    if (currentMethod === 'email') {
      identifier = container.querySelector('#signin-email')?.value.trim();
    } else {
      identifier = container.querySelector('#signin-mobile')?.value.replace(/\D/g, '');
      if (identifier.length !== 10) {
        errEl.textContent = 'Please enter a valid 10-digit mobile number.';
        errEl.classList.remove('hidden');
        return;
      }
    }

    const password = container.querySelector('#signin-password')?.value;

    const user = state.findUserByIdentifier(identifier);
    if (!user) {
      errEl.textContent = `No account found with this ${currentMethod === 'email' ? 'email address' : 'mobile number'}. Please check your details or sign up.`;
      errEl.classList.remove('hidden');
      return;
    }

    if (user.password !== password) {
      errEl.textContent = 'Incorrect password. Please try again or use "Forgot password".';
      errEl.classList.remove('hidden');
      return;
    }

    state.setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
    window.location.hash = '#home';
  });

  // Handle Sign Up submission
  const signupForm = container.querySelector('#signup-form');
  signupForm?.addEventListener('submit', () => {
    const errEl = container.querySelector('#signup-error');
    errEl?.classList.add('hidden');

    const name = container.querySelector('#signup-name')?.value.trim();
    let email = null;
    let mobile = null;

    if (currentMethod === 'email') {
      email = container.querySelector('#signup-email')?.value.trim();
      if (!email || !email.includes('@')) {
        errEl.textContent = 'Please enter a valid email address.';
        errEl.classList.remove('hidden');
        return;
      }
    } else {
      mobile = container.querySelector('#signup-mobile')?.value.replace(/\D/g, '');
      if (!mobile || mobile.length !== 10) {
        errEl.textContent = 'Please enter a valid 10-digit Indian mobile number.';
        errEl.classList.remove('hidden');
        return;
      }
    }

    const password = container.querySelector('#signup-password')?.value;
    const confirmPassword = container.querySelector('#signup-confirm-password')?.value;
    const termsChecked = container.querySelector('#signup-terms')?.checked;

    if (!termsChecked) {
      errEl.textContent = 'Please accept the Privacy Policy to create your account.';
      errEl.classList.remove('hidden');
      return;
    }

    if (password.length < 6) {
      errEl.textContent = 'Password must be at least 6 characters long.';
      errEl.classList.remove('hidden');
      return;
    }

    if (password !== confirmPassword) {
      errEl.textContent = 'Passwords do not match. Please verify.';
      errEl.classList.remove('hidden');
      return;
    }

    const result = state.registerUser({ name, email, mobile, password });
    if (!result.success) {
      errEl.textContent = result.message;
      errEl.classList.remove('hidden');
      return;
    }

    showToast(`Account created successfully! Welcome to FinSmart, ${result.user.name}.`, 'success');
    window.location.hash = '#home';
  });
}


/**
 * Forgot Password Reset Modal
 */
function openForgotPasswordModal() {
  let modalEl = document.getElementById('auth-modal-backdrop');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'auth-modal-backdrop';
    document.body.appendChild(modalEl);
  }

  modalEl.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs animate-fade-in';
  modalEl.innerHTML = `
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
      <button id="btn-close-fp-modal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
        <i data-lucide="key-round" class="w-6 h-6"></i>
      </div>

      <h2 class="text-xl font-bold text-slate-900 text-center">Reset Your Password</h2>
      <p class="text-xs text-slate-600 text-center mt-1 mb-5">
        Enter your registered email or 10-digit mobile number to set a new password.
      </p>

      <form id="fp-form" class="space-y-3.5" onsubmit="return false;">
        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">Email or Mobile Number</label>
          <input 
            type="text" 
            id="fp-identifier" 
            placeholder="e.g. name@example.com or 9876543210" 
            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
            required>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
          <input 
            type="password" 
            id="fp-new-password" 
            placeholder="At least 6 characters" 
            class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
            required>
        </div>

        <div id="fp-error" class="text-rose-600 text-xs hidden font-medium"></div>

        <button 
          type="submit" 
          id="btn-fp-submit" 
          class="w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition">
          Update Password & Sign In
        </button>
      </form>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  modalEl.querySelector('#btn-close-fp-modal')?.addEventListener('click', () => modalEl.remove());

  const form = modalEl.querySelector('#fp-form');
  form?.addEventListener('submit', () => {
    const idVal = modalEl.querySelector('#fp-identifier')?.value.trim();
    const newPass = modalEl.querySelector('#fp-new-password')?.value;
    const errEl = modalEl.querySelector('#fp-error');

    if (!idVal || !newPass || newPass.length < 6) {
      errEl.textContent = 'Please provide identifier and password (min 6 chars).';
      errEl.classList.remove('hidden');
      return;
    }

    const user = state.findUserByIdentifier(idVal);
    if (!user) {
      errEl.textContent = 'No matching account found with this email or mobile.';
      errEl.classList.remove('hidden');
      return;
    }

    state.updateUserPassword(idVal, newPass);
    state.setCurrentUser(user);
    modalEl.remove();
    showToast('Password updated! You are now logged in.', 'success');
    window.location.hash = '#home';
  });
}

/**
 * User Profile Dashboard View (when logged in at #profile)
 */
export function renderUserProfile(container) {
  const user = state.currentUser;
  if (!user) {
    renderAuthPage(container, 'signin');
    return;
  }

  const profile = state.userProfile;
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const html = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <!-- Profile Header Card -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8">
        <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div class="w-20 h-20 rounded-3xl bg-navy-900 text-emerald-400 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              ${initials}
            </div>
            <div>
              <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold mb-2">
                <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Active FinSmart Member
              </div>
              <h1 class="text-2xl sm:text-3xl font-bold text-slate-900">${user.name}</h1>
              <div class="text-xs sm:text-sm text-slate-600 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                ${user.email ? `<span class="flex items-center gap-1"><i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400"></i> ${user.email}</span>` : ''}
                ${user.mobile ? `<span class="flex items-center gap-1"><i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i> +91 ${user.mobile}</span>` : ''}
                <span class="text-slate-400">• Member since ${memberSince}</span>
              </div>
            </div>
          </div>

          <button 
            type="button" 
            id="btn-profile-logout" 
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition">
            <i data-lucide="log-out" class="w-4 h-4"></i> Sign Out
          </button>
        </div>
      </div>

      <!-- Financial Literacy Assessment Link Card -->
      <div class="bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <i data-lucide="award" class="w-3.5 h-3.5"></i> Financial Health Diagnostic
            </div>
            <h2 class="text-xl sm:text-2xl font-bold">Your Financial Literacy Assessment</h2>
            
            ${profile && profile.overallScore ? `
              <p class="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg">
                Your diagnostic assessment is recorded. You scored <strong>${profile.overallScore}/100 (${profile.literacyLevel} tier)</strong>.
              </p>
            ` : `
              <p class="text-slate-300 text-xs sm:text-sm mt-1 max-w-lg">
                You haven't completed your 10-question financial literacy diagnostic survey yet. Take it now to discover your score and strengths!
              </p>
            `}
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            ${profile && profile.overallScore ? `
              <a href="#results" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm shadow-md transition">
                <i data-lucide="eye" class="w-4 h-4"></i> View Score & Report
              </a>
              <a href="#survey" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs sm:text-sm border border-navy-700 transition">
                <i data-lucide="rotate-ccw" class="w-4 h-4"></i> Retake Survey
              </a>
            ` : `
              <a href="#survey" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs sm:text-sm shadow-md transition">
                <i data-lucide="sparkles" class="w-4 h-4"></i> Take 10-Question Survey
              </a>
            `}
          </div>
        </div>
      </div>

      <!-- Quick Shortcuts Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <a href="#learn" class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <i data-lucide="book-open" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition">Learning Hub</h3>
            <p class="text-xs text-slate-600 mt-0.5">10 interactive guides & ₹ examples</p>
          </div>
        </a>

        <a href="#calculators" class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <i data-lucide="calculator" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-teal-800 transition">Financial Calculators</h3>
            <p class="text-xs text-slate-600 mt-0.5">SIP, EMI, 50/30/20 Budget tools</p>
          </div>
        </a>

        <a href="#quiz" class="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition flex items-center gap-4 group">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <i data-lucide="zap" class="w-6 h-6"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900 group-hover:text-amber-800 transition">Rapid Quiz</h3>
            <p class="text-xs text-slate-600 mt-0.5">10 instant-feedback questions</p>
          </div>
        </a>
      </div>
    </div>
  `;

  container.innerHTML = html;
  if (window.lucide) window.lucide.createIcons();

  container.querySelector('#btn-profile-logout')?.addEventListener('click', () => {
    state.logoutUser();
    showToast('You have been signed out successfully.', 'info');
    window.location.hash = '#home';
  });
}
