/**
 * FinSmart Financial Literacy Scoring & Diagnostic Engine
 * Evaluates responses across 5 core categories, determines overall score (0-100),
 * classifies performance tier, identifies strengths and areas for improvement,
 * and compiles customized learning recommendations.
 */

import { SURVEY_QUESTIONS, SURVEY_CATEGORIES } from '../data/questions.js';

export function calculateSurveyScores(answers) {
  const categoryScores = {
    knowledge: 0,
    saving: 0,
    investing: 0,
    debt: 0,
    insurance: 0
  };

  const categoryTotals = {
    knowledge: 0,
    saving: 0,
    investing: 0,
    debt: 0,
    insurance: 0
  };

  // Score each question
  for (const q of SURVEY_QUESTIONS) {
    const userAns = answers[q.id];
    let qScore = 0;

    if (userAns !== undefined && userAns !== null) {
      if (q.type === 'select-multi') {
        // userAns is an array of selected option IDs
        if (Array.isArray(userAns)) {
          for (const optId of userAns) {
            const opt = q.options.find(o => o.id === optId);
            if (opt) {
              qScore += (opt.score || 0);
            }
          }
          qScore = Math.min(100, qScore);
        }
      } else {
        // Single select (radio / likert / boolean)
        const opt = q.options.find(o => o.id === userAns);
        if (opt) {
          qScore = opt.score || 0;
        }
      }
    }

    categoryScores[q.category] += qScore;
    categoryTotals[q.category] += 1;
  }

  // Calculate percentage per category
  const normalizedCategoryScores = {};
  for (const cat of SURVEY_CATEGORIES) {
    const count = categoryTotals[cat.id] || 1;
    normalizedCategoryScores[cat.id] = Math.round(categoryScores[cat.id] / count);
  }

  // Calculate weighted overall score (equal or weighted across 5 core pillars)
  const overallScore = Math.round(
    normalizedCategoryScores.knowledge * 0.20 +
    normalizedCategoryScores.saving * 0.20 +
    normalizedCategoryScores.investing * 0.20 +
    normalizedCategoryScores.debt * 0.20 +
    normalizedCategoryScores.insurance * 0.20
  );

  // Determine Literacy Level
  let literacyLevel = 'Beginner';
  let levelColor = '#EF4444'; // Red
  let levelDescription = 'You are at the start of your financial literacy journey. Developing structured budgeting, debt caution, and basic compounding knowledge will unlock major improvements.';

  if (overallScore >= 81) {
    literacyLevel = 'Excellent';
    levelColor = '#10B981'; // Green
    levelDescription = 'Outstanding financial acumen! You possess strong command over core economics, disciplined savings habits, diverse investments, and sound risk mitigation.';
  } else if (overallScore >= 61) {
    literacyLevel = 'Good';
    levelColor = '#0284C7'; // Blue
    levelDescription = 'Solid financial understanding! You maintain good day-to-day money habits and basic investment awareness, with great opportunities to optimize risk and compounding.';
  } else if (overallScore >= 41) {
    literacyLevel = 'Developing';
    levelColor = '#F59E0B'; // Amber
    levelDescription = 'You understand key foundational principles, but certain areas such as long-term investing, debt reduction, or insurance coverage need reinforcement.';
  }

  // Generate Strengths & Areas to Improve
  const { strengths, weaknesses, recommendations } = generateInsights(normalizedCategoryScores);

  return {
    overallScore,
    literacyLevel,
    levelColor,
    levelDescription,
    categoryScores: normalizedCategoryScores,
    strengths,
    weaknesses,
    recommendations,
    calculatedAt: new Date().toISOString()
  };
}

function generateInsights(categoryScores) {
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  const categoryMetadata = {
    knowledge: {
      name: 'Basic Financial Knowledge',
      highFeedback: 'You have a firm conceptual grasp of inflation, compound interest, and the time value of money.',
      lowFeedback: 'Basic concepts like purchasing power erosion and the Rule of 72 require conceptual reinforcement.',
      recommendedTopics: ['compound-interest', 'taxes']
    },
    saving: {
      name: 'Saving & Budgeting',
      highFeedback: 'You demonstrate disciplined cash flow control, regular automated savings, and emergency reserve awareness.',
      lowFeedback: 'Inconsistent monthly budgeting or low emergency reserves leave your finances susceptible to unexpected expenses.',
      recommendedTopics: ['budgeting', 'saving', 'emergency-funds']
    },
    investing: {
      name: 'Investment Awareness',
      highFeedback: 'You understand asset allocation, mutual fund SIPs, and the long-term wealth compounding potential of equities.',
      lowFeedback: 'Limited familiarity with mutual funds, diversification, and the risk-return spectrum may cause idle cash to trail inflation.',
      recommendedTopics: ['investing', 'financial-goals']
    },
    debt: {
      name: 'Credit & Debt Management',
      highFeedback: 'You recognize loan amortization, the importance of a 750+ CIBIL score, and the dangers of revolving credit card debt.',
      lowFeedback: 'Vulnerability to high-interest debt traps, revolving minimum dues, or lack of loan repayment optimization.',
      recommendedTopics: ['credit-cards', 'loans']
    },
    insurance: {
      name: 'Insurance & Security',
      highFeedback: 'You value financial defense through pure term life coverage, adequate health insurance, and verified nominee records.',
      lowFeedback: 'Inadequate health or life insurance coverage poses a significant risk of depleting hard-earned family savings during a crisis.',
      recommendedTopics: ['insurance', 'emergency-funds']
    }
  };

  // Sort categories by score descending
  const sortedCategories = Object.keys(categoryScores).map(catId => ({
    id: catId,
    score: categoryScores[catId],
    ...categoryMetadata[catId]
  })).sort((a, b) => b.score - a.score);

  // Top 2 are strengths if >= 50
  for (let i = 0; i < 2; i++) {
    const item = sortedCategories[i];
    if (item.score >= 50) {
      strengths.push({
        title: item.name,
        score: item.score,
        description: item.highFeedback
      });
    }
  }

  // If no category was >= 50, provide encouraging fallback
  if (strengths.length === 0) {
    strengths.push({
      title: sortedCategories[0].name,
      score: sortedCategories[0].score,
      description: 'You are taking the proactive initiative to learn and build financial awareness from the ground up.'
    });
  }

  // Bottom 2 are areas to improve
  const bottomCategories = sortedCategories.slice(-2).reverse();
  for (const item of bottomCategories) {
    weaknesses.push({
      title: item.name,
      score: item.score,
      description: item.lowFeedback
    });

    // Add unique recommended topics
    for (const topicId of item.recommendedTopics) {
      if (!recommendations.includes(topicId)) {
        recommendations.push(topicId);
      }
    }
  }

  return { strengths, weaknesses, recommendations };
}
