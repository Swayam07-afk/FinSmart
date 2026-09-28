/**
 * FinSmart Main Application Entrypoint
 * Bootstraps client-side routing, mobile menu, global listeners, and icon renders.
 */

import { initRouter } from './modules/router.js';
import { state } from './modules/state.js';
import { initApiKeyControls, openApiKeyModal } from './modules/apiKeyModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Hamburger Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
      }
    });

    // Close mobile menu when clicking any link inside it
    mobileMenu.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 2. State change subscription to update navbar indicators
  state.subscribe((event) => {
    if (event === 'profile') {
      const myScoreNav = document.getElementById('nav-my-score');
      if (myScoreNav && state.userProfile) {
        myScoreNav.classList.remove('hidden');
      }
    }
  });

  // 3. Initialize Gemini AI Key Navbar & Dialog Controls
  initApiKeyControls();

  // Footer Gemini settings click
  const footerKeyBtn = document.getElementById('footer-btn-gemini-key');
  if (footerKeyBtn) {
    footerKeyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openApiKeyModal();
    });
  }

  // 4. Initialize Router
  initRouter();

  // 5. Lucide icons boot
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

