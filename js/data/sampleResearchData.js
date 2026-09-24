/**
 * FinSmart Sample Research Dataset & Aggregated Analytics Engine
 * Generates and manages 1,420+ realistic anonymous survey responses for research insights.
 * Strictly non-personally identifiable information.
 */

export const AGE_GROUPS = [
  '18-24 years',
  '25-34 years',
  '35-44 years',
  '45-54 years',
  '55+ years'
];

export const EDUCATION_LEVELS = [
  'High School / Secondary',
  'Undergraduate Degree',
  'Postgraduate / Master\'s',
  'Doctorate / Ph.D.',
  'Professional / Other'
];

export const OCCUPATIONS = [
  'Salaried Professional',
  'Self-Employed / Business',
  'College / University Student',
  'Freelancer / Gig Worker',
  'Homemaker / Retired'
];

export const INCOME_RANGES = [
  'Below ₹2,50,000',
  '₹2,50,000 - ₹5,00,000',
  '₹5,00,000 - ₹10,00,000',
  '₹10,00,000 - ₹20,00,000',
  'Above ₹20,00,000'
];

export const STATES_REGIONS = [
  'Maharashtra',
  'Karnataka',
  'Delhi NCR',
  'Tamil Nadu',
  'Telangana',
  'Gujarat',
  'West Bengal',
  'Uttar Pradesh',
  'Kerala',
  'Other States'
];

// Seeded pseudo-random number generator for reproducible realistic baseline data
function createSeededRandom(seed = 42) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

/**
 * Generate 1,420 realistic anonymous respondents reflecting empirical financial literacy distributions
 */
export function generateBaseResearchDataset(count = 1420) {
  const rand = createSeededRandom(108);
  const data = [];

  const ageWeights = [0.28, 0.42, 0.18, 0.08, 0.04];
  const eduWeights = [0.12, 0.52, 0.28, 0.04, 0.04];
  const occWeights = [0.55, 0.16, 0.18, 0.07, 0.04];
  const incWeights = [0.22, 0.32, 0.28, 0.13, 0.05];

  function pickWeighted(items, weights) {
    const r = rand();
    let acc = 0;
    for (let i = 0; i < items.length; i++) {
      acc += weights[i];
      if (r <= acc) return items[i];
    }
    return items[items.length - 1];
  }

  function clampedScore(base, variation) {
    const val = Math.round(base + (rand() * 2 - 1) * variation);
    return Math.max(10, Math.min(100, val));
  }

  for (let i = 1; i <= count; i++) {
    const age = pickWeighted(AGE_GROUPS, ageWeights);
    const edu = pickWeighted(EDUCATION_LEVELS, eduWeights);
    const occ = pickWeighted(OCCUPATIONS, occWeights);
    const inc = pickWeighted(INCOME_RANGES, incWeights);
    const loc = STATES_REGIONS[Math.floor(rand() * STATES_REGIONS.length)];

    // Realistic correlation: higher age/education/income tends slightly higher on literacy
    let base = 56;
    if (age === '25-34 years') base += 6;
    if (age === '35-44 years') base += 10;
    if (age === '45-54 years') base += 8;
    if (edu === 'Postgraduate / Master\'s' || edu === 'Doctorate / Ph.D.') base += 8;
    if (inc === '₹10,00,000 - ₹20,00,000' || inc === 'Above ₹20,00,000') base += 10;
    if (occ === 'College / University Student') base -= 6;

    const knowledge_score = clampedScore(base + 4, 18);
    const saving_score = clampedScore(base + 2, 20);
    const investment_score = clampedScore(base - 10, 24); // generally lower in surveys
    const debt_score = clampedScore(base + 6, 18);
    const insurance_score = clampedScore(base - 8, 22); // generally lower

    const overall_score = Math.round(
      knowledge_score * 0.25 +
      saving_score * 0.20 +
      investment_score * 0.20 +
      debt_score * 0.20 +
      insurance_score * 0.15
    );

    let literacy_level = 'Beginner';
    if (overall_score >= 81) literacy_level = 'Excellent';
    else if (overall_score >= 61) literacy_level = 'Good';
    else if (overall_score >= 41) literacy_level = 'Developing';

    // Financial habits correlation
    const budgetsRegularly = saving_score >= 55;
    const savesRegularly = saving_score >= 50;
    const invests = investment_score >= 50;
    const hasEmergencyFund = saving_score >= 65;
    const hasInsurance = insurance_score >= 60;

    // Date over past 180 days
    const daysAgo = Math.floor(rand() * 180);
    const date = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

    data.push({
      id: `resp_${10000 + i}`,
      age_group: age,
      education: edu,
      occupation: occ,
      income_range: inc,
      location: loc,
      knowledge_score,
      saving_score,
      investment_score,
      debt_score,
      insurance_score,
      overall_score,
      literacy_level,
      budgetsRegularly,
      savesRegularly,
      invests,
      hasEmergencyFund,
      hasInsurance,
      created_at: date
    });
  }

  return data;
}
