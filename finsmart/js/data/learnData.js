/**
 * FinSmart Financial Education Learning Modules
 * 10 comprehensive topics with beginner-friendly explanations, Indian Rupee (₹) examples,
 * key financial terms, practical actionable tips, and mini-quizzes.
 */

export const LEARN_TOPICS = [
  {
    id: 'budgeting',
    title: 'Budgeting & Expense Tracking',
    icon: 'wallet',
    category: 'saving',
    categoryName: 'Saving & Budgeting',
    readTime: '4 min read',
    summary: 'Master your monthly cash flow, eliminate money leaks, and build savings with the 50/30/20 framework.',
    description: `Budgeting isn't about restricting your life; it's about giving every single rupee a specific purpose before you spend it. When you track your income and expenses, you regain complete control over your money instead of wondering where it went at the end of the month.`,
    example: {
      scenario: 'Applying the 50/30/20 Rule on a ₹60,000 monthly take-home salary:',
      breakdown: [
        { label: '50% Needs (₹30,000)', detail: 'House rent (₹18,000), groceries (₹7,000), electricity & broadband (₹3,000), transit (₹2,000).' },
        { label: '30% Wants (₹18,000)', detail: 'Weekend dining, weekend movies, OTT subscriptions, shopping, hobbies.' },
        { label: '20% Savings & Debt Repayment (₹12,000)', detail: '₹8,000 automated SIP in mutual funds + ₹4,000 into emergency savings.' }
      ]
    },
    keyTerms: [
      { term: 'Cash Flow', definition: 'The net balance of money flowing into your bank account versus flowing out each month.' },
      { term: 'Fixed vs Variable Expenses', definition: 'Fixed expenses (like rent or insurance) remain identical every month, while variable expenses (like dining or leisure) fluctuate based on daily choices.' },
      { term: 'Zero-Based Budgeting', definition: 'A method where every rupee of income minus all allocated expenses and savings equals exactly zero at the end of the month.' }
    ],
    practicalTips: [
      'Automate your savings: Set up an auto-debit on the 2nd day after your salary credit.',
      'Conduct a 3-month bank statement audit to identify unused gym memberships or recurring OTT app charges.',
      'Use the "24-Hour Rule" before making any impulse purchase over ₹2,000 to see if you still truly want it.'
    ],
    miniQuiz: {
      question: 'Under the 50/30/20 budgeting rule, what percentage of your net monthly income should ideally be directed toward savings, debt prepayments, or investments?',
      options: [
        'At least 20%',
        'Exactly 50%',
        'Whatever small amount remains on the 30th of the month',
        '0% until you turn 40'
      ],
      correctIndex: 0,
      explanation: 'The 50/30/20 rule recommends setting aside at least 20% of net take-home pay for savings, emergency buffers, and long-term investments.'
    }
  },
  {
    id: 'saving',
    title: 'Smart Saving & Cash Reserves',
    icon: 'piggy-bank',
    category: 'saving',
    categoryName: 'Saving & Budgeting',
    readTime: '4 min read',
    summary: 'Discover high-yield savings habits, sinking funds for planned goals, and how inflation affects idle cash.',
    description: `Saving money is the foundation of all financial security. However, keeping large piles of cash completely idle in a 2.5% basic savings account actually causes your wealth to lose purchasing power due to inflation. Smart saving involves separating short-term liquid cash from long-term productive investments.`,
    example: {
      scenario: 'Saving for an annual vehicle insurance & holiday expense using Sinking Funds:',
      breakdown: [
        { label: 'The Goal', detail: 'You need ₹24,000 next December for car insurance renewal and a family holiday.' },
        { label: 'The Sinking Fund Habit', detail: 'Instead of scrambling for ₹24,000 in December, you auto-transfer ₹2,000 each month into a dedicated Recurring Deposit (RD) earning 6.5% interest.' },
        { label: 'The Outcome', detail: 'Zero financial panic when the annual premium arrives, plus earned interest.' }
      ]
    },
    keyTerms: [
      { term: 'Sinking Fund', definition: 'A strategic savings bucket where you set aside small monthly amounts specifically for an anticipated future lump-sum expense.' },
      { term: 'Liquidity', definition: 'The ease and speed with which an asset or account can be converted into ready cash without losing its market value.' },
      { term: 'Real Rate of Return', definition: 'The nominal interest rate earned on savings minus the prevailing rate of inflation.' }
    ],
    practicalTips: [
      'Maintain separate bank accounts: one primary account for receiving salary and paying bills, and a second account strictly for savings reserves.',
      'Look into sweep-in Fixed Deposits (Flexi FDs) which automatically earn higher interest on idle savings above a threshold.',
      'Celebrate milestone savings (e.g. hitting your first ₹50,000 or ₹1 Lakh) to keep financial motivation high.'
    ],
    miniQuiz: {
      question: 'What is a "Sinking Fund" primarily used for in personal finance?',
      options: [
        'To gamble on day-trading penny stocks',
        'To save incrementally for a known upcoming expense like car insurance or festive gifts',
        'To hide debt from credit bureaus',
        'To pay off bank fees automatically'
      ],
      correctIndex: 1,
      explanation: 'A sinking fund is designed to save small amounts systematically toward a known, expected future expense, preventing budget shocks.'
    }
  },
  {
    id: 'investing',
    title: 'Investment Basics & Asset Classes',
    icon: 'trending-up',
    category: 'investing',
    categoryName: 'Investment Awareness',
    readTime: '5 min read',
    summary: 'Understand how equity, debt, gold, and mutual funds work together to generate inflation-beating wealth.',
    description: `While saving preserves capital, investing puts your money to work by owning productive assets. Over long periods, equity markets have historically outpaced inflation, enabling everyday individuals to participate in the growth of leading domestic and global corporations.`,
    example: {
      scenario: 'The power of Systematic Investment Plans (SIP):',
      breakdown: [
        { label: 'Monthly SIP', detail: 'A 25-year-old invests ₹5,000 per month in a diversified equity index fund.' },
        { label: 'Tenure & Growth', detail: 'Over 20 years at a historical average compound annual growth rate of 12%:' },
        { label: 'Total Invested vs Final Corpus', detail: 'Total invested: ₹12,00,000 (₹12 Lakhs). Final Maturity Value: ~₹49,95,000 (Nearly ₹50 Lakhs!). Over ₹37.9 Lakhs came purely from compounding returns.' }
      ]
    },
    keyTerms: [
      { term: 'Asset Allocation', definition: 'The strategy of dividing your investments across different asset categories like Equities (stocks), Debt (fixed income/bonds), and Commodities (gold).' },
      { term: 'Equity Index Fund', definition: 'A low-cost mutual fund that mirrors a benchmark market index (such as Nifty 50 or Sensex) to match overall economic growth.' },
      { term: 'Rupee Cost Averaging', definition: 'Investing a fixed amount on a set date every month so you buy more fund units when prices drop and fewer units when prices rise.' }
    ],
    practicalTips: [
      'Never invest money you will need within the next 3 years into the stock market; short-term money belongs in fixed-income or liquid funds.',
      'Start with broad, low-cost index funds rather than trying to hand-pick individual speculative stocks.',
      'Ignore daily market headlines and noise. Successful investing is boring, patient, and consistent.'
    ],
    miniQuiz: {
      question: 'Why is asset diversification widely considered essential for long-term investors?',
      options: [
        'It guarantees that you will never experience a single day of market drop',
        'It spreads your risk so a downturn in one sector or asset is cushioned by others',
        'It allows you to avoid paying all taxes forever',
        'It eliminates the need to maintain an emergency fund'
      ],
      correctIndex: 1,
      explanation: 'Diversification balances risk. When equity markets dip, fixed income or gold assets often hold value, stabilizing your overall net worth.'
    }
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards & Credit Health',
    icon: 'credit-card',
    category: 'debt',
    categoryName: 'Credit & Debt',
    readTime: '4 min read',
    summary: 'Unlock interest-free rewards and build a 750+ CIBIL credit score while dodging high-interest pitfalls.',
    description: `A credit card is a powerful financial tool when used as a payment mechanism rather than a borrowing mechanism. You receive 30 to 45 days of interest-free credit and reward points. But if you fail to pay the full balance on the due date, credit cards charge among the highest interest rates in modern commerce (36% to 45% APR).`,
    example: {
      scenario: 'The "Minimum Amount Due" Nightmare:',
      breakdown: [
        { label: 'Outstanding Balance', detail: '₹50,000 bill on your credit card at 42% annual interest.' },
        { label: 'Paying Only Minimum Due (5%)', detail: 'You pay ₹2,500 each month thinking you are in the clear.' },
        { label: 'The Trap', detail: 'It will take over 8 years to pay off that ₹50,000, and you will pay over ₹45,000 just in interest charges!' }
      ]
    },
    keyTerms: [
      { term: 'Credit Utilization Ratio (CUR)', definition: 'The percentage of your total available credit limit you use. Keeping CUR below 30% boosts your credit score.' },
      { term: 'Grace Period', definition: 'The interest-free window between the date of a transaction and the bill payment due date.' },
      { term: 'CIBIL / Credit Score', definition: 'A 3-digit score between 300 and 900 reflecting your credit repayment discipline. A score above 750 qualifies you for prime loan interest rates.' }
    ],
    practicalTips: [
      'Always activate "Auto-Pay: Total Amount Due" rather than Minimum Amount Due in your banking app.',
      'Treat your credit card like a debit card: never swipe for an amount you do not already possess in your checking account.',
      'Keep older credit cards active even if rarely used; credit age contributes significantly to a healthy score.'
    ],
    miniQuiz: {
      question: 'What is the recommended maximum Credit Utilization Ratio (CUR) to help build and maintain a strong credit score?',
      options: [
        'Under 30% of your total credit limit',
        'Exactly 95% to 100% of your limit',
        'Credit utilization has zero effect on CIBIL scores',
        'More than 150% by requesting emergency overdrafts'
      ],
      correctIndex: 0,
      explanation: 'Using under 30% of your available credit shows lenders you are not credit-hungry or overleveraged, which positively supports your credit score.'
    }
  },
  {
    id: 'loans',
    title: 'Loans, EMIs & Debt Management',
    icon: 'file-text',
    category: 'debt',
    categoryName: 'Credit & Debt',
    readTime: '5 min read',
    summary: 'Understand loan amortization, flat vs reducing interest rates, and accelerated prepayment strategies.',
    description: `Borrowing money for appreciating assets (like education or a home) can be constructive, but high-interest consumer debt (personal loans, BNPL, credit cards) drains your future wealth. Understanding loan math empowers you to shave years and lakhs of interest off your borrowings.`,
    example: {
      scenario: 'Prepaying just 1 extra EMI per year on a Home Loan:',
      breakdown: [
        { label: 'Loan Details', detail: '₹30,00,000 (₹30 Lakhs) home loan for 20 years at 8.5% interest. Monthly EMI: ₹26,035.' },
        { label: 'Normal Repayment', detail: 'Total interest paid over 20 years: ~₹32,48,000 (more than the principal borrowed!).' },
        { label: 'Smart Strategy', detail: 'Pay just ONE extra EMI of ₹26,035 once a year. Result: Loan closes 4 years earlier and saves over ₹6.5 Lakhs in interest!' }
      ]
    },
    keyTerms: [
      { term: 'Equated Monthly Installment (EMI)', definition: 'A fixed payment made by a borrower to a lender on a specified date each calendar month, combining principal and interest.' },
      { term: 'Reducing Balance Interest', definition: 'Interest calculated only on the remaining unpaid loan balance rather than the original borrowed amount.' },
      { term: 'Debt-to-Income (DTI) Ratio', definition: 'The percentage of your gross monthly income committed to paying all existing debts and loan EMIs combined.' }
    ],
    practicalTips: [
      'Prioritize paying off loans using either the "Avalanche method" (highest interest rate first) or the "Snowball method" (smallest balance first for psychological momentum).',
      'Never take a personal loan or swipe a credit card to fund speculative stock market trades or luxury vacations.',
      'Check for loan prepayment penalty terms before signing any loan agreement; retail floating-rate home loans generally carry zero prepayment penalties in India.'
    ],
    miniQuiz: {
      question: 'In standard amortized loan repayment, during which portion of the loan tenure is the interest component of your EMI the highest?',
      options: [
        'In the very first few years of the loan',
        'In the final year right before the loan closes',
        'The interest amount is mathematically identical on every single installment',
        'Interest is only billed if you miss a payment'
      ],
      correctIndex: 0,
      explanation: 'Because the outstanding principal balance is largest at the beginning, the early years of an EMI schedule consist predominantly of interest charges.'
    }
  },
  {
    id: 'insurance',
    title: 'Insurance & Risk Protection',
    icon: 'shield-check',
    category: 'insurance',
    categoryName: 'Insurance & Security',
    readTime: '5 min read',
    summary: 'Shield your family and wealth against life and medical emergencies with the right protection policies.',
    description: `Insurance is not an investment; it is a financial seatbelt. The true goal of insurance is risk transfer — moving the catastrophic financial risk of illness, disability, or premature death away from your family to an insurance company in exchange for a reasonable premium.`,
    example: {
      scenario: 'The high cost of mixing Insurance with Investment (ULIPs / Endowment):',
      breakdown: [
        { label: 'Option A (Mixed Policy)', detail: 'Paying ₹1,00,000/year for an endowment policy that gives only ₹10 Lakhs life cover and a sub-par 5% return.' },
        { label: 'Option B (Term Insurance + Mutual Fund SIP)', detail: 'Buy a ₹1 Crore Pure Term plan for ~₹12,000/year, and invest the remaining ₹88,000/year in an equity mutual fund.' },
        { label: 'Result', detail: 'Option B provides 10X more life protection and builds a significantly larger corpus over 20 years.' }
      ]
    },
    keyTerms: [
      { term: 'Sum Assured', definition: 'The guaranteed financial compensation amount the insurer commits to pay the nominee upon a covered event.' },
      { term: 'Deductible', definition: 'The amount of medical expenses an insured person must pay out-of-pocket before their health insurance policy begins covering costs.' },
      { term: 'Pure Term Insurance', definition: 'A life insurance policy that provides pure death benefit coverage with no maturity return, delivering maximum cover for minimal premium.' }
    ],
    practicalTips: [
      'Purchase standalone family health insurance early in your 20s or 30s before lifestyle conditions (like diabetes or hypertension) emerge with waiting periods.',
      'Rule of thumb for Life Insurance: Aim for a term cover equal to at least 10 to 15 times your annual income if you have financial dependents.',
      'Ensure that nominee details on all insurance policies, bank accounts, and investments are verified and up to date.'
    ],
    miniQuiz: {
      question: 'Which type of life insurance provides the highest life protection coverage for your dependents at the lowest annual premium cost?',
      options: [
        'Pure Term Life Insurance',
        'Traditional Endowment Policy',
        'Unit Linked Insurance Plan (ULIP)',
        'Money-Back Guarantee Scheme'
      ],
      correctIndex: 0,
      explanation: 'Pure term insurance strips away investment charges and marketing kickbacks, delivering maximum financial protection for your loved ones at minimal cost.'
    }
  },
  {
    id: 'taxes',
    title: 'Tax Planning & Deductions',
    icon: 'receipt',
    category: 'knowledge',
    categoryName: 'Basic Financial Knowledge',
    readTime: '4 min read',
    summary: 'Understand tax slabs, key exemptions, and how legitimate tax-efficient investing saves your wealth.',
    description: `Tax planning is the legal, legitimate process of structuring your finances, deductions, and investments to optimize your tax liability. By taking advantage of statutory provisions (such as Sections 80C, 80D, and NPS 80CCD in India), you can legally reduce your taxable income while building long-term assets.`,
    example: {
      scenario: 'Tax savings through Section 80C & 80D under the Old Tax Regime:',
      breakdown: [
        { label: 'Section 80C (up to ₹1.5 Lakhs)', detail: 'Contributions to EPF, PPF, ELSS mutual funds, and principal repayment on home loans.' },
        { label: 'Section 80D (up to ₹25,000 - ₹50,000)', detail: 'Deductions on health insurance premiums for self, spouse, children, and senior citizen parents.' },
        { label: 'NPS Section 80CCD(1B)', detail: 'Additional deduction of up to ₹50,000 for National Pension System contributions.' }
      ]
    },
    keyTerms: [
      { term: 'Old vs New Tax Regime', definition: 'The Old Regime offers numerous itemized deductions (80C, 80D, HRA); the New Regime features lower slab rates with simplified filing and minimal exemptions.' },
      { term: 'TDS (Tax Deducted at Source)', definition: 'Tax deducted directly by employers or banks before releasing salary or interest income.' },
      { term: 'Long-Term Capital Gains (LTCG)', definition: 'Taxes levied on profits from selling investments held longer than a specified holding period (e.g. 1 year for equities, 2 years for real estate).' }
    ],
    practicalTips: [
      'Evaluate both the Old and New Tax Regimes every financial year using an online tax calculator to see which yields lower total tax for your specific salary structure.',
      'ELSS (Equity Linked Savings Schemes) have the shortest lock-in period (3 years) among all Section 80C tax-saving instruments.',
      'Always file your annual Income Tax Return (ITR) well before the July 31 deadline to avoid penalties and carry forward any capital losses.'
    ],
    miniQuiz: {
      question: 'Which of the following Section 80C tax-saving investment instruments has the shortest mandatory lock-in period?',
      options: [
        'ELSS (Equity Linked Savings Scheme Mutual Funds) — 3 years',
        'PPF (Public Provident Fund) — 15 years',
        'Tax-saving 5-year Bank Fixed Deposit — 5 years',
        'National Savings Certificate (NSC) — 5 years'
      ],
      correctIndex: 0,
      explanation: 'ELSS mutual funds have a 3-year lock-in, which is the shortest among all Section 80C instruments, while offering exposure to equity growth.'
    }
  },
  {
    id: 'emergency-funds',
    title: 'Building an Emergency Fund',
    icon: 'shield-alert',
    category: 'saving',
    categoryName: 'Saving & Budgeting',
    readTime: '4 min read',
    summary: 'Calculate your safety buffer, understand liquidity, and learn where to park emergency cash safely.',
    description: `An emergency fund is your financial fortress. It is a dedicated pool of liquid cash kept specifically for unforeseen crises — such as sudden job loss, vehicle breakdowns, urgent dental surgery, or urgent home repairs. Without an emergency fund, unexpected life events force people into high-interest debt.`,
    example: {
      scenario: 'Calculating your 6-Month Emergency Target:',
      breakdown: [
        { label: 'Essential Expenses', detail: 'Rent: ₹15,000 | Groceries: ₹8,000 | Utilities & Bills: ₹4,000 | Loan EMIs: ₹10,000 | Medicine: ₹3,000. Total Monthly Essentials = ₹40,000.' },
        { label: '3-Month Baseline', detail: '₹40,000 × 3 = ₹1,20,000 (minimum safety buffer).' },
        { label: '6-Month Comprehensive Target', detail: '₹40,000 × 6 = ₹2,40,000 (recommended target for freelancers, single-income families, or private sector workers).' }
      ]
    },
    keyTerms: [
      { term: 'Essential Living Expenses', definition: 'Non-negotiable costs required for survival: shelter, nutrition, basic utilities, minimum debt payments, and healthcare.' },
      { term: 'Liquid Mutual Funds', definition: 'Low-risk mutual funds that invest in short-term government and corporate debt securities, redeemable within 24 hours without stock market risk.' },
      { term: 'Opportunity Cost', definition: 'The potential returns foregone on cash parked in low-interest liquid reserves instead of volatile growth assets.' }
    ],
    practicalTips: [
      'Do not keep your emergency fund in volatile stocks, cryptocurrency, or locked real estate where money cannot be pulled instantly.',
      'Split your emergency fund: 50% in a high-yield savings account or sweep-in FD, and 50% in a reputable overnight or liquid mutual fund.',
      'Replenish your emergency fund immediately as soon as you draw down from it for a genuine emergency.'
    ],
    miniQuiz: {
      question: 'Where should your emergency fund ideally be parked for safety and immediate access?',
      options: [
        'In liquid, accessible accounts like high-yield savings, sweep-in FDs, or liquid debt funds',
        'In high-volatility speculative microcap stocks',
        'Locked in physical real estate land',
        'Underneath your mattress in paper cash only'
      ],
      correctIndex: 0,
      explanation: 'Emergency money must prioritize absolute capital preservation and same-day liquidity over speculative returns.'
    }
  },
  {
    id: 'compound-interest',
    title: 'The Magic of Compound Interest',
    icon: 'zap',
    category: 'knowledge',
    categoryName: 'Basic Financial Knowledge',
    readTime: '4 min read',
    summary: 'Discover how time, patience, and the Rule of 72 turn modest monthly savings into substantial wealth.',
    description: `Albert Einstein is often reputed to have called compound interest the "eighth wonder of the world". With simple interest, you only earn returns on your initial principal. With compound interest, you earn returns on your principal PLUS on the accumulated interest from previous periods. Over decades, this exponential snowball transforms modest sums into generational wealth.`,
    example: {
      scenario: 'Early Starter vs Late Starter comparison:',
      breakdown: [
        { label: 'Aarav (Starts at Age 22)', detail: 'Invests ₹5,000/month for 10 years (until age 32), then stops investing new money. Total invested: ₹6 Lakhs.' },
        { label: 'Vikram (Starts at Age 32)', detail: 'Invests ₹5,000/month for 28 years (until age 60). Total invested: ₹16.8 Lakhs.' },
        { label: 'At Age 60 (at 12% annual return)', detail: 'Aarav has over ₹2.8 Crore despite investing for only 10 years! Vikram has ~₹1.4 Crore despite investing nearly 3 times more capital. Time in the market beats timing the market.' }
      ]
    },
    keyTerms: [
      { term: 'Compounding Frequency', definition: 'How often interest is added back to principal (daily, monthly, quarterly, or annually). More frequent compounding yields higher final returns.' },
      { term: 'The Rule of 72', definition: 'A rapid mathematical approximation: 72 divided by the interest rate equals the number of years required to double your money.' },
      { term: 'CAGR (Compound Annual Growth Rate)', definition: 'The mean annual growth rate of an investment over a specified period longer than one year.' }
    ],
    practicalTips: [
      'Start early: Even ₹1,000 a month started in college outpaces ₹10,000 a month delayed until your mid-30s.',
      'Reinvest dividends and capital gains rather than withdrawing them so the compounding snowball remains uninterrupted.',
      'Avoid high-interest debt: Remember that compounding works in reverse when you borrow on credit cards!'
    ],
    miniQuiz: {
      question: 'If you invest ₹50,000 in an instrument that delivers an average 9% annual compound return, approximately how many years will it take to double to ₹1,00,000?',
      options: [
        'Approximately 8 years (72 ÷ 9)',
        'Approximately 25 years',
        'Exactly 1 year',
        'Money cannot double without active day trading'
      ],
      correctIndex: 0,
      explanation: 'Using the Rule of 72: 72 divided by 9 equals 8 years. Your investment doubles to ₹1 Lakh in roughly 8 years.'
    }
  },
  {
    id: 'financial-goals',
    title: 'Setting & Achieving Financial Goals',
    icon: 'target',
    category: 'investing',
    categoryName: 'Investment Awareness',
    readTime: '4 min read',
    summary: 'Turn vague wishes into achievable financial milestones using the SMART financial framework.',
    description: `Saying "I want to be rich" is a wish, not a plan. A true financial goal is Specific, Measurable, Achievable, Relevant, and Time-bound (SMART). When your goals are mapped to specific time horizons, choosing the right financial instrument becomes crystal clear.`,
    example: {
      scenario: 'Classifying Goals by Time Horizons:',
      breakdown: [
        { label: 'Short-Term (0 to 3 years)', detail: 'Buying a two-wheeler, domestic vacation, emergency fund. Preferred vehicles: FDs, RDs, Liquid Mutual Funds (Zero equity risk).' },
        { label: 'Medium-Term (3 to 7 years)', detail: 'Down payment for a home, higher education. Preferred vehicles: Hybrid funds, multi-asset allocation, conservative index funds.' },
        { label: 'Long-Term (7+ years)', detail: 'Retirement corpus, child\'s future, financial independence. Preferred vehicles: Broad equity mutual funds, PPF, NPS.' }
      ]
    },
    keyTerms: [
      { term: 'SMART Financial Goals', definition: 'Goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.' },
      { term: 'Time Horizon', definition: 'The total expected duration an investor plans to hold an investment before needing the capital.' },
      { term: 'Inflation-Adjusted Target', definition: 'Calculating what a future goal (like education in 15 years) will actually cost in future rupees rather than today\'s prices.' }
    ],
    practicalTips: [
      'Write down your top 3 financial goals and assign each an exact rupee target and target year.',
      'Always adjust future long-term goals for inflation (e.g. college fees doubling every 7-8 years).',
      'Review your financial goals annually and rebalance your portfolio as you get closer to your target date.'
    ],
    miniQuiz: {
      question: 'Which investment instrument is best suited for a short-term financial goal you must achieve within 12 months (e.g. paying annual college fees)?',
      options: [
        'A high-volatility cryptocurrency or single tech stock',
        'A capital-safe, liquid Fixed Deposit or Bank Savings account',
        'Buying long-term agricultural land',
        'A 10-year lock-in retirement scheme'
      ],
      correctIndex: 1,
      explanation: 'Short-term goals (under 1-2 years) must prioritize safety and capital preservation, avoiding short-term stock market volatility.'
    }
  }
];
