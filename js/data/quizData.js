/**
 * FinSmart 10-Question Financial Literacy Quiz
 * Rapid interactive test covering fundamental personal finance principles.
 */

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    topic: 'Inflation',
    question: 'If the annual inflation rate is 7% and your savings account yields 3% interest per year, how much can you buy with the money in this account after 1 year?',
    options: [
      'More than today',
      'The exact same as today',
      'Less than today',
      'It depends on whether you hold credit cards'
    ],
    correctIndex: 2,
    explanation: 'Because inflation (7%) is higher than the interest rate (3%), your money loses real purchasing power, meaning it buys less than it did a year ago.'
  },
  {
    id: 2,
    topic: 'Compound Interest',
    question: 'If you invest ₹1,00,000 at a compound annual interest rate of 12%, approximately how many years will it take to double to ₹2,00,000 using the Rule of 72?',
    options: [
      'Around 12 years',
      'Around 6 years (72 ÷ 12)',
      'Around 8.5 years',
      'Around 24 years'
    ],
    correctIndex: 1,
    explanation: 'Under the Rule of 72, dividing 72 by the annual return rate (72 ÷ 12 = 6) gives approximately 6 years for your money to double.'
  },
  {
    id: 3,
    topic: 'Emergency Funds',
    question: 'What is the generally recommended size of an emergency fund for an individual or family?',
    options: [
      '1 to 2 weeks of discretionary spending',
      '3 to 6 months of non-negotiable essential living expenses',
      'Equivalent to 10 years of your total gross salary',
      'No emergency fund is necessary if you have credit cards'
    ],
    correctIndex: 1,
    explanation: 'Financial advisors recommend keeping 3 to 6 months of basic non-negotiable living expenses (rent, food, medicine, EMIs) in liquid, safe accounts.'
  },
  {
    id: 4,
    topic: 'Investment Diversification',
    question: 'Why is investing across multiple asset classes (such as stocks, debt funds, and gold) safer than holding all your wealth in a single stock?',
    options: [
      'It completely guarantees you will never lose money on any single trading day',
      'It reduces portfolio risk because if one company or asset underperforms, others can cushion the drop',
      'It allows you to avoid all government income taxes',
      'It automatically pays your monthly credit card bills'
    ],
    correctIndex: 1,
    explanation: 'Diversification spreads risk. Holding diverse assets prevents a sudden collapse in one company or sector from wiping out your entire life savings.'
  },
  {
    id: 5,
    topic: 'Credit Health & Scores',
    question: 'Which action has the most significant positive effect on building and maintaining a 750+ CIBIL credit score?',
    options: [
      'Paying all loan EMIs and credit card statement balances in full before the due date',
      'Opening 5 new credit cards in a single afternoon',
      'Utilizing 100% of your credit card limit each month',
      'Closing your oldest bank account'
    ],
    correctIndex: 0,
    explanation: 'On-time payment history makes up roughly 35% of your credit score. Consistently paying on time proves to lenders that you are reliable.'
  },
  {
    id: 6,
    topic: 'Credit Card Traps',
    question: 'What happens if you only pay the "Minimum Due" (typically 5%) on your credit card bill every month?',
    options: [
      'The bank waives all interest as a reward for prompt payment',
      'The unpaid 95% balance compounds at steep annual interest rates (36% to 45% APR), creating a debt trap',
      'Your credit limit automatically quadruples',
      'No interest is charged for the next 12 months'
    ],
    correctIndex: 1,
    explanation: 'Paying only the minimum due triggers astronomical compounding interest on the unpaid balance and immediately cancels your interest-free grace period.'
  },
  {
    id: 7,
    topic: 'Loan Mechanics',
    question: 'In standard amortized loans (like home or car loans), when is the interest portion of your monthly EMI payment the highest?',
    options: [
      'During the early years of the loan repayment period',
      'During the final few months before loan completion',
      'The interest and principal split is mathematically equal on every payment',
      'Interest is only applied if you miss an installment'
    ],
    correctIndex: 0,
    explanation: 'Because the remaining principal loan balance is largest in the initial years, the interest portion of each EMI is highest at the beginning.'
  },
  {
    id: 8,
    topic: 'Insurance & Protection',
    question: 'Which type of life insurance gives the highest death benefit protection for your family at the lowest annual premium cost?',
    options: [
      'Pure Term Life Insurance',
      'Traditional Endowment / Money-Back Plan',
      'Unit Linked Insurance Plan (ULIP) with high management fees',
      'Life insurance is not needed if you have a bank savings account'
    ],
    correctIndex: 0,
    explanation: 'Pure term insurance offers high sum assured (e.g. ₹1 Crore) for minimal annual premiums by focusing purely on life risk coverage without expensive investment add-ons.'
  },
  {
    id: '9',
    topic: 'Budgeting Habits',
    question: 'Under the popular 50/30/20 budgeting rule, how should your net take-home monthly income ideally be split?',
    options: [
      '50% Wants, 30% Needs, 20% Savings',
      '50% Needs, 30% Wants, 20% Savings & Debt Repayment',
      '50% Savings, 30% Entertainment, 20% Rent',
      '70% Dining out, 20% Shopping, 10% Bills'
    ],
    correctIndex: 1,
    explanation: 'The 50/30/20 rule allocates 50% for essential needs (housing, food, bills), 30% for lifestyle wants, and 20% toward savings, investments, or extra debt clearance.'
  },
  {
    id: 10,
    topic: 'Risk vs Return',
    question: 'If an online investment scheme promises a "Guaranteed 30% monthly return with zero risk", what does standard financial literacy teach you?',
    options: [
      'It is an exceptional opportunity and you should invest all your savings immediately',
      'It is almost certainly a fraudulent scam or Ponzi scheme; high returns always require higher risk, and no legitimate market asset guarantees risk-free 30% monthly returns',
      'It is backed by the Reserve Bank of India',
      'It is as safe as a government treasury bill'
    ],
    correctIndex: 1,
    explanation: 'One of the golden rules of financial literacy: extraordinary guaranteed returns with zero risk do not exist. Any scheme promising such returns is almost certainly fraudulent.'
  }
];
