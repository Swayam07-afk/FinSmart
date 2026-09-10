# FinSmart — Financial Literacy Survey & Awareness Platform

> **Tagline:** *“Understand your money. Build your future.”*

FinSmart is a modern, responsive, fintech-grade web application built to assess, educate, and empower individuals with practical financial literacy while supporting anonymous empirical research on financial awareness.

---

## 🌟 Key Features & Architecture

### 1. Multi-Step Diagnostic Survey
- **10 Core Diagnostic Questions** organized across 5 foundational financial pillars (2 questions per pillar):
  - **Category A:** Basic Financial Knowledge (Inflation, purchasing power, compound interest mechanics)
  - **Category B:** Saving & Budgeting (Monthly budget discipline, emergency fund sufficiency)
  - **Category C:** Investment Awareness (Mutual funds, SIPs, asset diversification)
  - **Category D:** Credit & Debt (CIBIL credit score factors, credit card minimum due trap)
  - **Category E:** Insurance & Financial Security (Standalone health insurance, pure term life coverage)
- **Diverse Question Types:** Multiple choice, True/False, rating scales, and multi-select.
- **Anonymous Research Demographics & Consent:** Collects non-sensitive research cohorts (Age group, Education level, Occupation, Income range in ₹ INR, State/Region) with mandatory privacy consent. Zero personally identifiable information (no names, phone numbers, bank details, or passwords).
- **Progress Persistence:** Automatic caching to browser `localStorage` with "Save Progress" and "Reset" controls.

### 2. Diagnostic Scoring Engine & Profile
- **0–100 Overall Score** with circular progress gauge meter.
- **5 Pillar Category Scores (0–100%):** Knowledge, Saving, Investing, Debt, and Insurance.
- **4 Performance Tiers:** Beginner (0–40), Developing (41–60), Good (61–80), and Excellent (81–100).
- **Diagnostic Feedback:** Automatically diagnoses top strengths and weakest areas requiring improvement.
- **Customized Curriculum Recommendations:** Dynamically suggests targeted learning guides based on lowest scoring pillars.
- **Print / Save PDF Report:** Clean print styling for generating assessment certificates.

### 3. Financial Education / Learn Hub
- **10 In-Depth Beginner-Friendly Modules:**
  1. 💰 Budgeting & Expense Tracking (50/30/20 rule, cash flow, audit)
  2. 🏦 Smart Saving & Cash Reserves (Sinking funds, liquidity, inflation impact)
  3. 📈 Investment Basics & Asset Classes (Mutual funds, index funds, rupee-cost averaging)
  4. 💳 Credit Cards & Credit Health (750+ CIBIL score, utilization ratio, grace periods)
  5. 🧾 Loans, EMIs & Debt Management (Amortization, reducing balance, prepayments)
  6. 🛡️ Insurance & Risk Protection (Pure term insurance, health insurance, deductibles)
  7. 📊 Tax Planning & Deductions (Old vs New regime, 80C, 80D, ELSS)
  8. 🚨 Building an Emergency Fund (3-6 months essentials, liquid funds)
  9. 📈 The Magic of Compound Interest (Rule of 72, time value of money, formula)
  10. 🎯 Setting & Achieving Financial Goals (SMART goals, time horizons)
- **Interactive Modals:** Each module features a simple explanation, a real-world scenario in Indian Rupees (₹), an essential terms glossary, practical action tips, and a **"Test Your Knowledge"** mini-quiz with instant feedback.

### 4. Interactive Financial Calculators (with Charts in ₹ INR)
1. **Compound Interest / SIP Calculator:** Simulates initial lumpsum + monthly SIP investments, projecting total invested vs wealth gained with an interactive growth curve.
2. **Loan EMI Calculator:** Amortizes loan principal and interest with an interactive donut chart.
3. **50/30/20 Budget Planner:** Visualizes essential needs, discretionary spending, and savings potential with an expense distribution chart.
4. **Savings & Cashflow Forecaster:** Calculates monthly cash surplus and forecasts savings accumulation over 1, 3, 5, and 10 years.
5. **Emergency Fund Target Calculator:** Determines recommended emergency buffer in months and evaluates coverage shortfall or surplus.

### 5. Financial Literacy Quiz
- 10 rapid-fire scenario questions covering compounding, inflation, diversification, credit cards, loans, and emergency reserves.
- One question at a time with instant correct/incorrect visual feedback and educational explanations.
- Final performance summary with direct links to learning resources.

### 6. Survey Insights & Research Observatory
- Aggregated research statistics module pre-populated with **1,420+ realistic anonymous survey responses**.
- Any new survey completed on FinSmart automatically merges into the research dataset in real time!
- **6 Dynamic Chart.js Visualizations:**
  1. Score Distribution (Beginner, Developing, Good, Excellent)
  2. Category Averages (Radar / Pillar bars)
  3. Practical Financial Habits Adoption (% budget, save, invest, emergency fund, insurance)
  4. Financial Literacy by Age Group
  5. Financial Literacy by Education Level
  6. Financial Literacy by Annual Income Range
- **Dynamic Demographic Filters:** Filter by Age Group, Education, Occupation, and Income Range to update all charts and KPI metrics on the fly.

### 7. Protected Admin Portal & CSV Export
- Passcode-protected administrative view (`admin123`, with quick demo fill helper).
- Real-time submission logs (anonymized demographic cohort, category scores, date).
- **RFC-4180 CSV Export:** Download the full anonymous research dataset for statistical analysis in Excel, Python, or R.
- Ability to re-seed or restore baseline research data.

### 8. UX, Accessibility & Design
- Clean fintech aesthetic: Dark Navy (`#0B192C`, `#07101C`), White, Emerald Green (`#10B981`), and Amber accents.
- Fully responsive on Desktop, Tablet, and Mobile with collapsible navigation drawer.
- Accessible color contrast, touch-friendly targets, and toast feedback notifications.

---

## 🚀 How to Run FinSmart

Because FinSmart is engineered with modern ES6 standards, Tailwind CSS, Lucide Icons, and Chart.js, you can run it immediately without complex build tooling:

### Method 1: Using Python Built-in Web Server (Recommended)
Open PowerShell or Command Prompt in the `finsmart` folder and run:
```bash
python -m http.server 8000
```
Then open your browser to:
```
http://localhost:8000
```

### Method 2: Using Node / npx
```bash
npx serve .
```

### Method 3: Direct Browser Launch
Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 📂 File Hierarchy

```
finsmart/
├── index.html                  # Single-page application shell
├── README.md                   # Documentation and quick start guide
├── css/
│   └── styles.css              # Custom styling, print sheets, and animations
└── js/
    ├── app.js                  # Main orchestrator & lifecycle events
    ├── data/
    │   ├── questions.js        # 25 survey questions across 5 pillars
    │   ├── learnData.js        # 10 comprehensive educational topics
    │   ├── quizData.js         # 10 interactive quiz questions
    │   └── sampleResearchData.js # 1,420+ synthetic research respondents
    └── modules/
        ├── state.js            # Central state & localStorage manager
        ├── router.js           # Client-side hash routing & static views
        ├── survey.js           # Multi-step survey wizard controller
        ├── scoring.js          # Diagnostic scoring & recommendation engine
        ├── results.js          # Personalized score dashboard & gauge
        ├── learn.js            # Learning hub & topic modal dialogs
        ├── calculators.js      # 5 financial calculators with Chart.js
        ├── quiz.js             # 10-question quiz controller
        ├── insights.js         # Research dashboard with 6 dynamic charts
        └── admin.js            # Passcode-protected admin & CSV exporter
```

---

*FinSmart — For educational and research purposes only. Does not constitute personal financial advice.*
