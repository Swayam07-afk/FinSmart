/**
 * FinSmart Central State Management
 * Handles persistent storage, in-progress survey cache, user profile, and research dataset.
 */

import { generateBaseResearchDataset } from '../data/sampleResearchData.js';

const STORAGE_KEYS = {
  SURVEY_PROGRESS: 'finsmart_survey_progress_v1',
  USER_PROFILE: 'finsmart_user_profile_v1',
  RESEARCH_DATA: 'finsmart_research_data_v1',
  QUIZ_HISTORY: 'finsmart_quiz_history_v1',
  ADMIN_AUTH: 'finsmart_admin_auth_v1',
  USERS: 'finsmart_users_v1',
  CURRENT_USER: 'finsmart_current_user_v1'
};

class StateManager {
  constructor() {
    this.subscribers = [];
    this.init();
  }

  init() {
    // 0. Registered users & active session
    let storedUsers = this.loadFromStorage(STORAGE_KEYS.USERS, null);
    if (!storedUsers || !Array.isArray(storedUsers) || storedUsers.length === 0) {
      storedUsers = [
        {
          id: 'usr_demo_101',
          name: 'Aarav Sharma',
          email: 'aarav@example.com',
          mobile: '9876543210',
          password: 'Password@123',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveToStorage(STORAGE_KEYS.USERS, storedUsers);
    }
    this.users = storedUsers;
    this.currentUser = this.loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);

    // 1. In-progress survey state
    this.surveyProgress = this.loadFromStorage(STORAGE_KEYS.SURVEY_PROGRESS, {
      demographics: {
        age_group: '',
        education: '',
        occupation: '',
        income_range: '',
        location: '',
        consent: false
      },
      currentStep: 0, // 0: Demographics, 1: Cat A, 2: Cat B, 3: Cat C, 4: Cat D, 5: Cat E
      answers: {}
    });

    // 2. User's saved diagnostic profile
    this.userProfile = this.loadFromStorage(STORAGE_KEYS.USER_PROFILE, null);

    // 3. Research dataset
    let storedResearch = this.loadFromStorage(STORAGE_KEYS.RESEARCH_DATA, null);
    if (!storedResearch || !Array.isArray(storedResearch) || storedResearch.length === 0) {
      storedResearch = generateBaseResearchDataset(1420);
      this.saveToStorage(STORAGE_KEYS.RESEARCH_DATA, storedResearch);
    }
    this.researchData = storedResearch;

    // 4. Quiz state
    this.quizState = {
      currentIndex: 0,
      userAnswers: {}, // { [questionId]: { selectedIndex, isCorrect } }
      score: 0,
      isCompleted: false
    };

    // 5. Active route
    this.currentRoute = window.location.hash ? window.location.hash.replace('#', '') : 'home';
  }

  loadFromStorage(key, defaultValue) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error loading ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error saving ${key} to localStorage:`, e);
    }
  }

  // Survey methods
  updateSurveyDemographics(demographics) {
    this.surveyProgress.demographics = { ...this.surveyProgress.demographics, ...demographics };
    this.persistSurveyProgress();
    this.notify('survey');
  }

  setSurveyStep(step) {
    this.surveyProgress.currentStep = step;
    this.persistSurveyProgress();
    this.notify('survey');
  }

  recordAnswer(questionId, answer) {
    this.surveyProgress.answers[questionId] = answer;
    this.persistSurveyProgress();
    this.notify('survey');
  }

  persistSurveyProgress() {
    this.saveToStorage(STORAGE_KEYS.SURVEY_PROGRESS, this.surveyProgress);
  }

  clearSurveyProgress() {
    this.surveyProgress = {
      demographics: {
        age_group: '',
        education: '',
        occupation: '',
        income_range: '',
        location: '',
        consent: false
      },
      currentStep: 0,
      answers: {}
    };
    try {
      localStorage.removeItem(STORAGE_KEYS.SURVEY_PROGRESS);
    } catch (e) {}
    this.notify('survey');
  }

  // User Profile
  saveUserProfile(profile) {
    this.userProfile = profile;
    this.saveToStorage(STORAGE_KEYS.USER_PROFILE, profile);

    // Also add to anonymized research dataset!
    this.addAnonymizedResearchRecord({
      id: `user_${Date.now()}`,
      age_group: profile.demographics.age_group || '25-34 years',
      education: profile.demographics.education || 'Undergraduate Degree',
      occupation: profile.demographics.occupation || 'Salaried Professional',
      income_range: profile.demographics.income_range || '₹5,00,000 - ₹10,00,000',
      location: profile.demographics.location || 'Maharashtra',
      knowledge_score: profile.categoryScores.knowledge,
      saving_score: profile.categoryScores.saving,
      investment_score: profile.categoryScores.investing,
      debt_score: profile.categoryScores.debt,
      insurance_score: profile.categoryScores.insurance,
      overall_score: profile.overallScore,
      literacy_level: profile.literacyLevel,
      budgetsRegularly: profile.categoryScores.saving >= 50,
      savesRegularly: profile.categoryScores.saving >= 50,
      invests: profile.categoryScores.investing >= 50,
      hasEmergencyFund: profile.categoryScores.saving >= 65,
      hasInsurance: profile.categoryScores.insurance >= 60,
      created_at: new Date().toISOString().split('T')[0]
    });

    // Link to active user account if logged in
    if (this.currentUser) {
      this.currentUser.savedProfile = profile;
      this.saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.updateUserRecord(this.currentUser);
    }

    this.notify('profile');
  }

  addAnonymizedResearchRecord(record) {
    this.researchData.unshift(record);
    this.saveToStorage(STORAGE_KEYS.RESEARCH_DATA, this.researchData);
    this.notify('research');
  }

  resetResearchData() {
    this.researchData = generateBaseResearchDataset(1420);
    this.saveToStorage(STORAGE_KEYS.RESEARCH_DATA, this.researchData);
    this.notify('research');
  }

  // Authentication Methods
  setCurrentUser(user) {
    this.currentUser = user;
    this.saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    
    // If the logged in user has a saved score in their account, restore it
    if (user.savedProfile) {
      this.userProfile = user.savedProfile;
      this.saveToStorage(STORAGE_KEYS.USER_PROFILE, user.savedProfile);
    } else if (this.userProfile) {
      // If a guest completed survey before logging in, link to account!
      user.savedProfile = this.userProfile;
      this.updateUserRecord(user);
    }

    this.notify('auth');
    this.notify('profile');
  }

  logoutUser() {
    this.currentUser = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {}
    this.notify('auth');
    this.notify('profile');
  }

  findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanDigits = cleanId.replace(/\D/g, ''); // strip non-digits for phone

    return this.users.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === cleanId;
      const phoneClean = u.mobile ? String(u.mobile).replace(/\D/g, '') : '';
      const phoneMatch = phoneClean && (phoneClean === cleanDigits || (cleanDigits.length === 10 && phoneClean.endsWith(cleanDigits)));
      return emailMatch || phoneMatch;
    }) || null;
  }

  registerUser({ name, email, mobile, password }) {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanMobile = mobile ? mobile.replace(/\D/g, '') : '';

    if (cleanEmail && this.findUserByIdentifier(cleanEmail)) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    if (cleanMobile && this.findUserByIdentifier(cleanMobile)) {
      return { success: false, message: 'An account with this mobile number already exists.' };
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail || null,
      mobile: cleanMobile || null,
      password: password,
      savedProfile: this.userProfile || null,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.setCurrentUser(newUser);

    return { success: true, user: newUser };
  }

  updateUserRecord(updatedUser) {
    const idx = this.users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      this.users[idx] = updatedUser;
      this.saveToStorage(STORAGE_KEYS.USERS, this.users);
    }
  }

  updateUserPassword(identifier, newPassword) {
    const user = this.findUserByIdentifier(identifier);
    if (!user) return false;
    user.password = newPassword;
    this.updateUserRecord(user);
    if (this.currentUser && this.currentUser.id === user.id) {
      this.currentUser = user;
      this.saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
    }
    return true;
  }

  // Subscriber pattern
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify(event) {
    for (const cb of this.subscribers) {
      try {
        cb(event, this);
      } catch (e) {
        console.error('Error in state subscriber:', e);
      }
    }
  }
}

export const state = new StateManager();
