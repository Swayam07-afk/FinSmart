/**
 * FinSmart Survey Questions Dataset
 * 10 high-impact diagnostic questions across 5 core financial categories (2 questions per pillar).
 * Formats include scenario-based multiple choice and self-assessment options.
 */

export const SURVEY_CATEGORIES = [
  {
    id: 'knowledge',
    name: 'Basic Financial Knowledge',
    shortName: 'Knowledge',
    description: 'Core economic principles: inflation, interest, compounding, and purchasing power.',
    icon: 'brain'
  },
  {
    id: 'saving',
    name: 'Saving & Budgeting',
    shortName: 'Saving',
    description: 'Day-to-day money management, budgeting discipline, and emergency cushions.',
    icon: 'wallet'
  },
  {
    id: 'investing',
    name: 'Investment Awareness',
    shortName: 'Investing',
    description: 'Understanding asset classes, mutual funds, diversification, and risk-return.',
    icon: 'trending-up'
  },
  {
    id: 'debt',
    name: 'Credit & Debt',
    shortName: 'Credit & Debt',
    description: 'Managing borrowing, credit scores, loan amortization, and interest costs.',
    icon: 'credit-card'
  },
  {
    id: 'insurance',
    name: 'Insurance & Security',
    shortName: 'Insurance',
    description: 'Financial resilience, risk protection, health/life coverage, and contingency plans.',
    icon: 'shield-check'
  }
];

export const SURVEY_QUESTIONS = [
  // ==========================================
  // CATEGORY A: BASIC FINANCIAL KNOWLEDGE (Q1 - Q2)
  // ==========================================
  {
    id: 'q1',
    category: 'knowledge',
    number: 1,
    text: 'What happens to the purchasing power of your money during periods of sustained inflation?',
    hint: 'Think about how much a basket of groceries costs today compared to 5 years ago.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q1_a', text: 'It increases because prices are higher', score: 0 },
      { id: 'q1_b', text: 'It decreases, meaning each rupee buys fewer goods and services', score: 100, isCorrect: true },
      { id: 'q1_c', text: 'It stays exactly the same as long as currency is not damaged', score: 0 },
      { id: 'q1_d', text: 'Inflation only affects corporate businesses, not individuals', score: 0 }
    ],
    explanation: 'Inflation erodes purchasing power over time. If inflation is 6% per year, an item costing ₹100 today will cost ₹106 next year.'
  },
  {
    id: 'q2',
    category: 'knowledge',
    number: 2,
    text: 'Suppose you put ₹10,000 into a savings account with an annual interest rate of 10% compounded annually. How much will you have in the account after 2 years if you do not withdraw any money?',
    hint: 'Remember: Compound interest earns interest on previously earned interest.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q2_a', text: 'More than ₹12,100', score: 0 },
      { id: 'q2_b', text: 'Exactly ₹12,100', score: 100, isCorrect: true },
      { id: 'q2_c', text: 'Exactly ₹12,000', score: 25 },
      { id: 'q2_d', text: 'Less than ₹12,000', score: 0 }
    ],
    explanation: 'Year 1: ₹10,000 + 10% (₹1,000) = ₹11,000. Year 2: ₹11,000 + 10% (₹1,100) = ₹12,100.'
  },

  // ==========================================
  // CATEGORY B: SAVING & BUDGETING (Q3 - Q4)
  // ==========================================
  {
    id: 'q3',
    category: 'saving',
    number: 3,
    text: 'Do you maintain a monthly budget that plans income, essential expenses, and savings?',
    hint: 'Budgeting involves intentionally planning your spending before the month begins.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q3_a', text: 'Yes, consistently every single month using an app, spreadsheet, or notebook', score: 100 },
      { id: 'q3_b', text: 'Yes, but informally in my head or intermittently', score: 50 },
      { id: 'q3_c', text: 'Rarely, I only check my bank balance when funds run low', score: 25 },
      { id: 'q3_d', text: 'No, I have never created a monthly budget', score: 0 }
    ],
    explanation: 'Maintaining a structured budget is the cornerstone of personal finance, giving clarity over cash flow and preventing unnecessary debt.'
  },
  {
    id: 'q4',
    category: 'saving',
    number: 4,
    text: 'If you suddenly lost your primary source of income today, for how many months could you cover your basic living expenses using your emergency savings?',
    hint: 'Essential expenses include food, rent, utility bills, EMIs, and medicine.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q4_a', text: '6 months or more of essential expenses', score: 100 },
      { id: 'q4_b', text: '3 to 5 months of essential expenses', score: 75 },
      { id: 'q4_c', text: '1 to 2 months of essential expenses', score: 40 },
      { id: 'q4_d', text: 'Less than 1 month / No dedicated emergency fund', score: 0 }
    ],
    explanation: 'A healthy emergency fund should hold 3 to 6 months of non-negotiable living expenses in liquid, accessible instruments.'
  },

  // ==========================================
  // CATEGORY C: INVESTMENT AWARENESS (Q5 - Q6)
  // ==========================================
  {
    id: 'q5',
    category: 'investing',
    number: 5,
    text: 'What is a Mutual Fund, and how does a Systematic Investment Plan (SIP) typically work?',
    hint: 'Think about collective investment and disciplined monthly installments.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q5_a', text: 'A pool of funds from multiple investors managed by a professional fund manager; a SIP allows investing a fixed amount at regular intervals', score: 100, isCorrect: true },
      { id: 'q5_b', text: 'A government scheme that guarantees 20% risk-free return every month', score: 0 },
      { id: 'q5_c', text: 'A short-term lottery mechanism for high-frequency day traders', score: 0 },
      { id: 'q5_d', text: 'I am not sure what mutual funds or SIPs are', score: 0 }
    ],
    explanation: 'Mutual funds pool money across securities to provide diversification. SIP enables rupee-cost averaging by investing fixed sums periodically.'
  },
  {
    id: 'q6',
    category: 'investing',
    number: 6,
    text: 'True or False: "Buying shares in a single well-known company generally offers a safer and more diversified return than buying an index fund that holds 50 leading companies."',
    hint: 'Consider what happens if that single company encounters an unexpected crisis or scandal.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q6_a', text: 'True', score: 0 },
      { id: 'q6_b', text: 'False — Index funds spread risk across multiple industries, providing diversification', score: 100, isCorrect: true },
      { id: 'q6_c', text: 'Not sure / Need more information', score: 20 }
    ],
    explanation: 'False! Concentrated exposure to a single stock entails specific company risk. Broad index funds eliminate idiosyncratic business risk.'
  },

  // ==========================================
  // CATEGORY D: CREDIT & DEBT (Q7 - Q8)
  // ==========================================
  {
    id: 'q7',
    category: 'debt',
    number: 7,
    text: 'What is a credit score (such as CIBIL in India), and which factor has the single largest positive impact on building a high score (750+)?',
    hint: 'What tells a lender you are reliable with money borrowed?',
    type: 'radio',
    required: true,
    options: [
      { id: 'q7_a', text: 'A 3-digit score reflecting creditworthiness; maintaining a consistent record of 100% on-time debt and credit card payments', score: 100, isCorrect: true },
      { id: 'q7_b', text: 'A government tax rating based on total annual gold jewelry owned', score: 0 },
      { id: 'q7_c', text: 'A score determined solely by how much cash is kept in your checking account', score: 0 },
      { id: 'q7_d', text: 'Applying for 10 new credit cards in the same week to demonstrate borrowing capacity', score: 0 }
    ],
    explanation: 'Payment history is the largest component of credit scores. Paying credit card bills and loan EMIs on time before the due date builds a 750+ score.'
  },
  {
    id: 'q8',
    category: 'debt',
    number: 8,
    text: 'If you only pay the "Minimum Amount Due" on a credit card statement each month rather than the "Total Amount Due", what happens to your balance?',
    hint: 'Credit cards charge annual percentage rates (APR) often between 36% and 45%.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q8_a', text: 'The remaining balance incurs hefty interest (often 36%-45% APR), and new purchases lose their interest-free grace period', score: 100, isCorrect: true },
      { id: 'q8_b', text: 'The remaining balance is forgiven by the bank as a courtesy bonus', score: 0 },
      { id: 'q8_c', text: 'No interest is charged as long as the minimum payment was met', score: 0 },
      { id: 'q8_d', text: 'Your credit score instantly increases by 100 points', score: 0 }
    ],
    explanation: 'The "Minimum Due" trap is devastating: paying only 5% leaves 95% compounding at steep 36%-45% APR, taking decades to clear small debts.'
  },

  // ==========================================
  // CATEGORY E: INSURANCE & FINANCIAL SECURITY (Q9 - Q10)
  // ==========================================
  {
    id: 'q9',
    category: 'insurance',
    number: 9,
    text: 'Why is having a comprehensive standalone Health Insurance policy critical, even if you currently consider yourself young and healthy?',
    hint: 'Consider medical inflation and hospitalization bills.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q9_a', text: 'Medical emergencies are unpredictable, and a single hospital stay can wipe out years of accumulated savings and investments', score: 100, isCorrect: true },
      { id: 'q9_b', text: 'Health insurance allows you to trade prescription drugs on the stock market', score: 0 },
      { id: 'q9_c', text: 'It is only useful after retirement at age 60', score: 0 },
      { id: 'q9_d', text: 'Government hospitals cover 100% of all private treatments for everyone with zero waiting period', score: 0 }
    ],
    explanation: 'A major medical emergency can cost lakhs of rupees. Health insurance protects your hard-earned wealth from being depleted by healthcare shocks.'
  },
  {
    id: 'q10',
    category: 'insurance',
    number: 10,
    text: 'Which type of life insurance provides pure, high-coverage financial protection for your dependents at the lowest annual premium?',
    hint: 'It does not mix investment returns with risk coverage.',
    type: 'radio',
    required: true,
    options: [
      { id: 'q10_a', text: 'Pure Term Life Insurance', score: 100, isCorrect: true },
      { id: 'q10_b', text: 'Endowment or Money-Back Insurance Policy', score: 25 },
      { id: 'q10_c', text: 'Unit Linked Insurance Plan (ULIP) with high commission charges', score: 25 },
      { id: 'q10_d', text: 'No life insurance is ever needed if you have a credit card', score: 0 }
    ],
    explanation: 'Pure term insurance offers maximum life cover (e.g. ₹1 Crore) for minimal premium. Financial advisors advise separating insurance from investment.'
  }
];
