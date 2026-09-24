/**
 * FinSmart Google Gemini AI Integration Service
 * Manages user-provided Gemini API keys, model preferences, validation,
 * and prompt generation for interactive financial literacy quizzes.
 */

const STORAGE_KEYS = {
  API_KEY: 'finsmart_gemini_api_key_v1',
  MODEL: 'finsmart_gemini_model_v1',
  QUIZ_CACHE: 'finsmart_gemini_quiz_cache_v1'
};

// Available Gemini models for users
export const AVAILABLE_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    tag: 'Fast & Recommended',
    description: 'Fastest generation with outstanding reasoning capabilities for quizzes.'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    tag: 'Next-Gen',
    description: 'High-speed multimodal generation with advanced instruction following.'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    tag: 'High Quota & Stable',
    description: 'Extremely reliable, high free-tier limits, fast response times.'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    tag: 'Deep Reasoning',
    description: 'Best for intricate multi-step financial logic and tax regulations.'
  }
];

export const DEFAULT_MODEL = 'gemini-2.5-flash';
export const FALLBACK_MODEL = 'gemini-1.5-flash';

// ============================================================================
// API KEY & SETTINGS MANAGEMENT
// ============================================================================

/**
 * Retrieve the saved Gemini API key from localStorage.
 */
export function getGeminiApiKey() {
  try {
    return (localStorage.getItem(STORAGE_KEYS.API_KEY) || '').trim();
  } catch (e) {
    console.warn('Unable to access localStorage for Gemini API key:', e);
    return '';
  }
}

/**
 * Check if a Gemini API key is currently saved.
 */
export function hasGeminiApiKey() {
  const key = getGeminiApiKey();
  return Boolean(key && key.length > 5);
}

/**
 * Save the user's Gemini API key to localStorage.
 */
export function setGeminiApiKey(key) {
  try {
    const trimmed = (key || '').trim();
    if (!trimmed) {
      removeGeminiApiKey();
      return;
    }
    localStorage.setItem(STORAGE_KEYS.API_KEY, trimmed);
    dispatchKeyChangeEvent();
  } catch (e) {
    console.error('Error saving Gemini API key:', e);
  }
}

/**
 * Remove the saved Gemini API key.
 */
export function removeGeminiApiKey() {
  try {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
    dispatchKeyChangeEvent();
  } catch (e) {
    console.error('Error removing Gemini API key:', e);
  }
}

/**
 * Return a masked representation of the API key for display (e.g. "AIzaSy...7x9Q").
 */
export function getMaskedApiKey() {
  const key = getGeminiApiKey();
  if (!key) return '';
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 6)}••••••••${key.slice(-4)}`;
}

/**
 * Get selected Gemini model.
 */
export function getGeminiModel() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.MODEL);
    if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
      return saved;
    }
  } catch (e) {}
  return DEFAULT_MODEL;
}

/**
 * Set selected Gemini model.
 */
export function setGeminiModel(modelId) {
  try {
    if (AVAILABLE_MODELS.some(m => m.id === modelId)) {
      localStorage.setItem(STORAGE_KEYS.MODEL, modelId);
    }
  } catch (e) {}
}

function dispatchKeyChangeEvent() {
  window.dispatchEvent(new CustomEvent('finsmart:gemini-key-change', {
    detail: { hasKey: hasGeminiApiKey() }
  }));
}

// ============================================================================
// API VALIDATION & TESTING
// ============================================================================

/**
 * Tests a Gemini API key by making a lightweight ping call.
 * Returns { success: boolean, message: string, modelUsed?: string }
 */
export async function testGeminiApiKey(apiKeyToTest = null, modelId = null) {
  const key = apiKeyToTest || getGeminiApiKey();
  if (!key) {
    return {
      success: false,
      message: 'Please provide an API key to test.'
    };
  }

  const model = modelId || getGeminiModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: 'Respond with exactly one word: READY.' }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 10,
          temperature: 0.1
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      
      // If 404 and we used 2.5-flash, test fallback to 1.5-flash
      if (response.status === 404 && model !== FALLBACK_MODEL) {
        return testGeminiApiKey(key, FALLBACK_MODEL);
      }

      if (response.status === 400 && errorMsg.toLowerCase().includes('api key not valid')) {
        return {
          success: false,
          message: 'The API key is invalid. Please double check that you copied it correctly from Google AI Studio.'
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          message: 'Rate limit or free quota exceeded on this API key. Please wait a few minutes or generate a new key.'
        };
      }

      return {
        success: false,
        message: `Gemini API error: ${errorMsg}`
      };
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (text) {
      return {
        success: true,
        message: `API Key verified successfully with Google Gemini (${model})!`,
        modelUsed: model
      };
    }

    return {
      success: false,
      message: 'Empty response received from Gemini API.'
    };
  } catch (err) {
    return {
      success: false,
      message: `Network error connecting to Gemini API: ${err.message || 'Please check your internet connection.'}`
    };
  }
}

// ============================================================================
// QUIZ GENERATION VIA GEMINI AI
// ============================================================================

/**
 * Generate a customized personal finance quiz using Google Gemini AI.
 * 
 * @param {Object} options
 * @param {string} options.topic - The financial literacy topic
 * @param {string} options.difficulty - 'Beginner' | 'Intermediate' | 'Advanced'
 * @param {number} options.questionCount - 3, 5, or 10
 * @param {string} options.audience - Target audience description
 * @param {string} options.customNotes - Optional user instructions
 * @returns {Promise<Array>} Array of parsed quiz question objects
 */
export async function generateQuizWithGemini({
  topic = 'Compound Interest & Investing',
  difficulty = 'Intermediate',
  questionCount = 5,
  audience = 'General Adults & Working Professionals',
  customNotes = ''
}) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const model = getGeminiModel();
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Construct structured prompt for Gemini
  const prompt = `You are a world-class financial educator and certified financial planner creating a high-impact, practical financial literacy quiz.

TASK:
Generate a ${questionCount}-question multiple-choice quiz on the topic: "${topic}".
Difficulty level: ${difficulty}.
Target audience: ${audience}.
${customNotes ? `Specific focus/instructions: ${customNotes}` : ''}

REQUIREMENTS FOR QUESTIONS:
1. Each question must be realistic, scenario-based, and practical (use Indian context and currency ₹ Rupees where relevant).
2. Provide exactly 4 distinct, plausible options for each question.
3. Only ONE option must be the correct answer.
4. "correctIndex" MUST be the 0-based integer index of the correct option (0, 1, 2, or 3).
5. Provide a thorough, educational "explanation" that clearly teaches WHY the correct answer is right and why common misconceptions fail.
6. The questions must test genuine financial capability (e.g. purchasing power, risk vs return, credit traps, emergency reserves, asset diversification, tax efficiency, compounding math).

OUTPUT FORMAT:
You MUST output ONLY a valid JSON array of objects. Do not include markdown codeblocks or any conversational text.
Follow this exact JSON schema:
[
  {
    "id": 1,
    "topic": "${topic}",
    "question": "Scenario or question text here...",
    "options": [
      "Option text A",
      "Option text B",
      "Option text C",
      "Option text D"
    ],
    "correctIndex": 0,
    "explanation": "Clear explanation of the concept and why this choice is correct."
  }
]`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      })
    });
  } catch (networkErr) {
    throw new Error(`Network failure connecting to Gemini: ${networkErr.message}. Check your internet connection.`);
  }

  // Fallback to gemini-1.5-flash if 404 or unsupported
  if (!response.ok && response.status === 404 && model !== FALLBACK_MODEL) {
    console.warn(`Model ${model} returned 404, falling back to ${FALLBACK_MODEL}...`);
    const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${FALLBACK_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
    response = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 3000
        }
      })
    });
  }

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      errorDetails = errJson?.error?.message || '';
    } catch (e) {
      errorDetails = response.statusText;
    }

    if (response.status === 400 && errorDetails.toLowerCase().includes('api key not valid')) {
      throw new Error('INVALID_API_KEY');
    }
    if (response.status === 429) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`Google Gemini Error (${response.status}): ${errorDetails || 'Failed to generate quiz'}`);
  }

  const result = await response.json();
  const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return parseGeminiQuizJson(rawText, topic);
}

/**
 * Cleans and safely parses JSON returned by Gemini, handling markdown code fences.
 */
function parseGeminiQuizJson(rawText, fallbackTopic) {
  let cleaned = rawText.trim();

  // Strip Markdown codeblocks like ```json ... ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex extraction of array if there was leading/trailing text
    const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (err2) {
        throw new Error('Could not parse quiz JSON from Gemini response. Please try generating again.');
      }
    } else {
      throw new Error('Gemini response format was not a valid JSON array. Please try generating again.');
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini returned an empty list of questions. Please try generating again.');
  }

  // Validate and normalize question objects
  const sanitized = parsed.map((q, index) => {
    const id = q.id || index + 1;
    const topic = q.topic || fallbackTopic || 'Financial Literacy';
    const question = (q.question || '').trim();
    
    // Ensure options is an array of strings
    let options = Array.isArray(q.options) ? q.options.map(o => String(o).trim()) : [];
    if (options.length < 2) {
      options = ['Option A', 'Option B', 'Option C', 'Option D'];
    }

    // Ensure valid correctIndex
    let correctIndex = typeof q.correctIndex === 'number' ? q.correctIndex : 0;
    if (correctIndex < 0 || correctIndex >= options.length) {
      correctIndex = 0;
    }

    const explanation = (q.explanation || 'Review financial planning fundamentals to understand this solution.').trim();

    return {
      id,
      topic,
      question,
      options,
      correctIndex,
      explanation
    };
  });

  return sanitized;
}

// ============================================================================
// BUILT-IN SAMPLE AI QUIZZES (Available without API Key for demo)
// ============================================================================

export const SAMPLE_AI_QUIZZES = [
  {
    id: 'sample_tax',
    title: 'Tax Planning & 80C vs New Tax Regime',
    topic: 'Taxation & Savings',
    difficulty: 'Intermediate',
    description: 'Master deductions under Section 80C, 80D, NPS Section 80CCD, and when to pick the New vs Old tax regime.',
    questions: [
      {
        id: 1,
        topic: 'Tax Planning',
        question: 'Under the Old Tax Regime in India, what is the maximum cumulative annual deduction allowed under Section 80C (PPF, ELSS, EPF, Life Insurance)?',
        options: [
          '₹50,000',
          '₹1,50,000',
          '₹2,50,000',
          'Unlimited deduction'
        ],
        correctIndex: 1,
        explanation: 'Section 80C caps total deductions at ₹1,50,000 per financial year across eligible instruments like PPF, ELSS mutual funds, EPF, and tax-saver FDs.'
      },
      {
        id: 2,
        topic: 'Tax Regimes',
        question: 'What is the primary architectural difference between the Old Tax Regime and the New Tax Regime in India?',
        options: [
          'The New Regime eliminates most exemptions and deductions in exchange for lower tax slab rates',
          'The New Regime charges double the surcharge on all capital gains',
          'The Old Regime only applies to government employees',
          'The New Regime does not apply to women taxpayers'
        ],
        correctIndex: 0,
        explanation: 'The New Tax Regime provides simplified, lower tax slab rates but forgoes traditional deductions like Section 80C, 80D, HRA, and home loan interest on self-occupied property.'
      },
      {
        id: 3,
        topic: 'Health Insurance Tax Benefits',
        question: 'Under Section 80D of the Indian Income Tax Act, how much deduction can an individual claim for health insurance premiums paid for senior citizen parents (age 60+)?',
        options: [
          'Up to ₹10,000',
          'Up to ₹25,000',
          'Up to ₹50,000',
          'Health insurance premiums are not tax deductible'
        ],
        correctIndex: 2,
        explanation: 'For senior citizen parents (age 60 and above), an additional deduction of up to ₹50,000 per financial year is permissible for health insurance under Section 80D.'
      },
      {
        id: 4,
        topic: 'NPS Additional Deduction',
        question: 'Which dedicated subsection allows an extra tax deduction of up to ₹50,000 for voluntary contributions to the National Pension System (NPS Tier 1), over and above the ₹1.5 Lakh 80C limit?',
        options: [
          'Section 80CCD(1B)',
          'Section 80E',
          'Section 80TTA',
          'Section 80GG'
        ],
        correctIndex: 0,
        explanation: 'Section 80CCD(1B) offers an exclusive tax deduction of up to ₹50,000 for self-contributions into NPS Tier 1 accounts, independent of the standard ₹1.5L ceiling under 80C.'
      },
      {
        id: 5,
        topic: 'Capital Gains Taxation',
        question: 'What is the tax implication for Long-Term Capital Gains (LTCG) on listed equity shares or equity mutual funds held for more than 12 months?',
        options: [
          'Tax-free up to ₹1,25,000 in a financial year, and taxed at 12.5% on gains exceeding that threshold',
          'Taxed at your marginal slab rate of 30%',
          'Completely 100% tax-free with no upper limit',
          'Subject to a flat 40% penalty tax'
        ],
        correctIndex: 0,
        explanation: 'Under updated tax guidelines, LTCG on listed equities is exempt up to ₹1,25,000 in an annual financial year; gains exceeding this limit are taxed at a preferential 12.5% rate.'
      }
    ]
  },
  {
    id: 'sample_sip',
    title: 'Mutual Funds, SIP & Compounding Power',
    topic: 'Investing & SIPs',
    difficulty: 'Beginner',
    description: 'Discover how Systematic Investment Plans (SIP), Rupee Cost Averaging, and index funds build long-term wealth.',
    questions: [
      {
        id: 1,
        topic: 'SIP Mechanics',
        question: 'What is the primary risk-mitigation benefit of investing through a monthly Systematic Investment Plan (SIP) rather than making a single lump-sum deposit?',
        options: [
          'Rupee Cost Averaging — buying more mutual fund units when markets dip and fewer when markets peak',
          'Guaranteed exemption from stock market losses',
          'Doubles your bank interest rate automatically',
          'Guarantees a fixed 20% annual return'
        ],
        correctIndex: 0,
        explanation: 'SIP implements Rupee Cost Averaging by systematically investing a fixed sum regardless of market conditions, smoothing out volatility and lowering average acquisition costs.'
      },
      {
        id: 2,
        topic: 'Index Funds vs Active Funds',
        question: 'Why do many long-term investors prefer Broad Market Index Funds (like Nifty 50 or S&P 500) over actively managed mutual funds?',
        options: [
          'Index funds have much lower expense ratios and consistently match broad economic growth without manager bias',
          'Index funds provide guaranteed daily dividend checks',
          'Active funds are prohibited from investing in blue-chip equities',
          'Index funds are insured up to ₹10 Crore by RBI'
        ],
        correctIndex: 0,
        explanation: 'Passive index funds simply track a market benchmark. Because they do not require expensive fund manager teams, their lower expense ratios compound into substantial savings over decades.'
      },
      {
        id: 3,
        topic: 'Compounding Horizon',
        question: 'Two friends invest ₹5,000/month at 12% annual return. Rahul starts at age 22 and stops at age 32 (10 years total). Priya starts at age 32 and continues until age 60 (28 years total). Who has more money at age 60?',
        options: [
          'Rahul, because starting 10 years earlier gives his compound interest an extra decade of exponential growth',
          'Priya, because she deposited significantly more total money',
          'Both will have the exact same amount',
          'Neither, inflation cancels out all mutual fund gains'
        ],
        correctIndex: 0,
        explanation: 'Due to the exponential nature of compounding, Rahul investing for just 10 early years and letting it grow for 28 years often rivals or exceeds someone investing continuously later in life.'
      },
      {
        id: 4,
        topic: 'Expense Ratios',
        question: 'How does choosing a "Direct Plan" over a "Regular Plan" in a mutual fund affect your investment returns?',
        options: [
          'Direct plans do not pay third-party distributor commissions, delivering 0.5% - 1.5% higher annual net returns',
          'Regular plans give you free life insurance',
          'There is no difference in return or fees',
          'Direct plans carry higher risk of fund closure'
        ],
        correctIndex: 0,
        explanation: 'Direct plans eliminate intermediary distributor brokerage fees. A 1% difference in annual expense ratio can equate to lakhs or crores of rupees over a 20-30 year investing horizon.'
      },
      {
        id: 5,
        topic: 'Debt Funds vs Equity Funds',
        question: 'When an investor has a financial goal with a horizon of less than 2 years (e.g. paying college fees or buying a vehicle), where should the money ideally be placed?',
        options: [
          'Low-volatility liquid funds, short-duration debt funds, or fixed deposits',
          'High-growth small-cap equity mutual funds',
          'Cryptocurrency futures',
          'Unlisted penny stocks'
        ],
        correctIndex: 0,
        explanation: 'Short-term goals (under 2-3 years) cannot afford market downturns. Capital preservation in safe liquid or short-term debt instruments protects you from equity market crashes right when you need the cash.'
      }
    ]
  }
];
