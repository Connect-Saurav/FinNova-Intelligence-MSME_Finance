import { EnterpriseProfile, CreditScoreResult, ScoreMetricBreakdown } from '../types';

export function calculateFinancialHealthScore(profile: EnterpriseProfile): CreditScoreResult {
  // 1. REVENUE GROWTH (20%)
  const rev = profile.gst.monthlyRevenueLast6Months;
  const firstHalfAvg = (rev[0] + rev[1] + rev[2]) / 3;
  const secondHalfAvg = (rev[3] + rev[4] + rev[5]) / 3;
  const growthRate = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

  let revenueScoreVal = 70; // baseline
  const strengthsRev: string[] = [];
  const weaknessesRev: string[] = [];

  if (growthRate >= 15) {
    revenueScoreVal = 95;
    strengthsRev.push(`Exceptional half-yearly revenue growth of ${growthRate.toFixed(1)}%`);
  } else if (growthRate >= 5) {
    revenueScoreVal = 85;
    strengthsRev.push(`Steady revenue growth of ${growthRate.toFixed(1)}% over the last 6 months`);
  } else if (growthRate >= 0) {
    revenueScoreVal = 75;
    strengthsRev.push('Stable revenue stream with positive trajectory');
  } else {
    revenueScoreVal = Math.max(30, 70 + growthRate * 1.5); // penalty for negative growth
    weaknessesRev.push(`Declining revenue trend: contraction of ${Math.abs(growthRate).toFixed(1)}%`);
  }

  // Factor in absolute revenue volume
  const avgRev = rev.reduce((a, b) => a + b, 0) / 6;
  if (avgRev > 15) {
    revenueScoreVal = Math.min(100, revenueScoreVal + 5);
    strengthsRev.push(`Strong operating scale with average monthly revenue of ₹${avgRev.toFixed(1)} Lakhs`);
  } else if (avgRev < 3) {
    revenueScoreVal = Math.max(20, revenueScoreVal - 10);
    weaknessesRev.push(`Micro-enterprise scale (avg. monthly revenue ₹${avgRev.toFixed(1)} Lakhs) elevates credit risk`);
  }

  const revenueGrowthBreakdown = createMetricBreakdown(revenueScoreVal, 20, strengthsRev, weaknessesRev);


  // 2. CASH FLOW STABILITY (20%)
  const inflows = profile.aa.monthlyInflowLast6Months;
  const outflows = profile.aa.monthlyOutflowLast6Months;
  const avgInflow = inflows.reduce((a, b) => a + b, 0) / 6;
  const avgOutflow = outflows.reduce((a, b) => a + b, 0) / 6;
  const netInflowRatio = avgOutflow > 0 ? avgInflow / avgOutflow : 1;

  let cashFlowScoreVal = 75;
  const strengthsCF: string[] = [];
  const weaknessesCF: string[] = [];

  if (netInflowRatio >= 1.10) {
    cashFlowScoreVal = 95;
    strengthsCF.push('High cash surplus; operational inflows comfortably cover outflows');
  } else if (netInflowRatio >= 1.02) {
    cashFlowScoreVal = 85;
    strengthsCF.push('Balanced cash flow with healthy reserve buffer');
  } else if (netInflowRatio >= 0.98) {
    cashFlowScoreVal = 70;
    weaknessesCF.push('Tight cash flow; slim operating margins with minimal reserves');
  } else {
    cashFlowScoreVal = Math.max(25, 60 - (1 - netInflowRatio) * 300);
    weaknessesCF.push('Negative cash flow (Outflows exceed Inflows), relying on external leverage');
  }

  // Deduct for violations
  const violations = profile.aa.minimumBalanceViolations6Months;
  if (violations > 0) {
    cashFlowScoreVal = Math.max(15, cashFlowScoreVal - violations * 12);
    weaknessesCF.push(`${violations} minimum balance violation(s) indicate severe liquidity strain`);
  } else {
    strengthsCF.push('Flawless record of maintaining required average daily balances');
  }

  const cashFlowStabilityBreakdown = createMetricBreakdown(cashFlowScoreVal, 20, strengthsCF, weaknessesCF);


  // 3. BANKING BEHAVIOUR (15%)
  let bankingScoreVal = 80;
  const strengthsBank: string[] = [];
  const weaknessesBank: string[] = [];

  const bounces = profile.aa.chequeBounces6Months;
  if (bounces === 0) {
    bankingScoreVal += 10;
    strengthsBank.push('Zero cheque bounces or return charges in the past 6 months');
  } else if (bounces === 1) {
    bankingScoreVal -= 15;
    weaknessesBank.push('1 cheque bounce incident recorded, indicating occasional liquidity tightness');
  } else {
    bankingScoreVal -= (bounces * 20);
    weaknessesBank.push(`${bounces} cheque bounces represent severe credit and banking indiscipline`);
  }

  // Average balance vs EMI obligation
  const avgEMI = profile.aa.emiOutflows6Months.reduce((a, b) => a + b, 0) / 6;
  const avgBal = profile.aa.averageBalance6Months;
  
  if (avgEMI > 0) {
    const emiCoverage = avgBal / avgEMI;
    if (emiCoverage >= 3) {
      bankingScoreVal += 10;
      strengthsBank.push(`Robust EMI coverage (Average balance is ${emiCoverage.toFixed(1)}x monthly EMI commitments)`);
    } else if (emiCoverage < 1) {
      bankingScoreVal -= 15;
      weaknessesBank.push('Aggressive leverage: monthly EMI exceeds average bank account balances');
    }
  } else {
    bankingScoreVal += 5;
    strengthsBank.push('Zero active debt/EMI debits on account, representing clean leverage state');
  }

  // Cash withdrawal ratio penalty (Higher cash transactions in banking indicates potential unorganized cash leakage)
  const cashRatio = profile.aa.cashWithdrawalRatio;
  if (cashRatio > 0.40) {
    bankingScoreVal -= 10;
    weaknessesBank.push(`High cash withdrawal ratio (${(cashRatio * 100).toFixed(0)}%) suggests high unmonitored cash-based supply chain`);
  } else {
    strengthsBank.push('Low cash dependency; bank transactions predominantly digital and trackable');
  }

  bankingScoreVal = Math.max(10, Math.min(100, bankingScoreVal));
  const bankingBehaviourBreakdown = createMetricBreakdown(bankingScoreVal, 15, strengthsBank, weaknessesBank);


  // 4. GST COMPLIANCE (15%)
  let gstScoreVal = profile.gst.gstComplianceScore;
  const strengthsGST: string[] = [];
  const weaknessesGST: string[] = [];

  const lateGst = profile.gst.lateFilingsCount3Years;
  if (lateGst === 0) {
    gstScoreVal = Math.min(100, gstScoreVal + 5);
    strengthsGST.push('Perfect GSTR-1/3B filing punctuality across all quarters');
  } else if (lateGst > 0) {
    gstScoreVal = Math.max(20, gstScoreVal - lateGst * 6);
    weaknessesGST.push(`${lateGst} late GST filing incidents recorded over the past 3 years`);
  }

  const unreconciled = profile.gst.unreconciledInvoicesPercent;
  if (unreconciled > 15) {
    gstScoreVal = Math.max(20, gstScoreVal - (unreconciled - 15) * 1.5);
    weaknessesGST.push(`Significant unreconciled input tax credit (ITC) at ${unreconciled.toFixed(1)}%`);
  } else {
    strengthsGST.push(`Low invoice reconciliation gaps (${unreconciled.toFixed(1)}% matching leakage)`);
  }

  if (profile.gst.status !== 'ACTIVE') {
    gstScoreVal = 10;
    weaknessesGST.push(`CRITICAL: GST Registration status is currently ${profile.gst.status}`);
  }

  gstScoreVal = Math.max(10, Math.min(100, gstScoreVal));
  const gstComplianceBreakdown = createMetricBreakdown(gstScoreVal, 15, strengthsGST, weaknessesGST);


  // 5. DIGITAL TRANSACTIONS (10%)
  let digitalScoreVal = 70;
  const strengthsDig: string[] = [];
  const weaknessesDig: string[] = [];

  const upiVol = profile.upi.monthlyVolumeLast6Months.reduce((a, b) => a + b, 0) / 6;
  const upiVal = profile.upi.monthlyValueLast6Months.reduce((a, b) => a + b, 0) / 6;

  if (upiVol > 500) {
    digitalScoreVal += 15;
    strengthsDig.push(`High transaction density with average of ${(upiVol).toFixed(0)} digital UPI receipts monthly`);
  } else if (upiVol < 50) {
    digitalScoreVal -= 10;
    weaknessesDig.push('Low digital checkout adoption; transaction density below 50 payments per month');
  }

  const ratio = profile.upi.peerToMerchantRatio;
  if (ratio >= 0.85) {
    digitalScoreVal += 10;
    strengthsDig.push('High proportion of direct merchant invoices/sales vs personal P2P transactions');
  } else {
    digitalScoreVal -= 5;
    weaknessesDig.push('High mixed personal-commercial usage on digital handles');
  }

  const upiBounce = profile.upi.bounceRatePercent;
  if (upiBounce > 5) {
    digitalScoreVal -= 15;
    weaknessesDig.push(`UPI payment failure/bounce rate is elevated at ${upiBounce}%`);
  } else {
    strengthsDig.push('Seamless UPI merchant flow with less than 2% transaction failure rate');
  }

  digitalScoreVal = Math.max(10, Math.min(100, digitalScoreVal));
  const digitalTransactionsBreakdown = createMetricBreakdown(digitalScoreVal, 10, strengthsDig, weaknessesDig);


  // 6. BUSINESS STABILITY (10%)
  let stabilityScoreVal = 50;
  const strengthsStab: string[] = [];
  const weaknessesStab: string[] = [];

  // Vintage
  const vintage = profile.vintageYears;
  if (vintage >= 10) {
    stabilityScoreVal += 35;
    strengthsStab.push(`Proven vintage of ${vintage} years representing high operational resilience`);
  } else if (vintage >= 5) {
    stabilityScoreVal += 25;
    strengthsStab.push(`Establised enterprise with ${vintage} years of market survival`);
  } else if (vintage >= 2) {
    stabilityScoreVal += 15;
    strengthsStab.push(`Operating survival of ${vintage} years past the infant stage`);
  } else {
    stabilityScoreVal += 5;
    weaknessesStab.push(`New enterprise with less than 2 years of business vintage`);
  }

  // Constitution
  const consti = profile.constitution;
  if (consti === 'PVT_LTD') {
    stabilityScoreVal += 15;
    strengthsStab.push('Private Limited constitution ensures high legal compliance and governance structural separation');
  } else if (consti === 'LLP' || consti === 'PARTNERSHIP') {
    stabilityScoreVal += 10;
    strengthsStab.push(`Partnership/LLP setup with shared liability and registered deed structure`);
  } else {
    stabilityScoreVal += 5;
    weaknessesStab.push('Sole proprietorship structure with higher direct key-man risk');
  }

  stabilityScoreVal = Math.max(10, Math.min(100, stabilityScoreVal));
  const businessStabilityBreakdown = createMetricBreakdown(stabilityScoreVal, 10, strengthsStab, weaknessesStab);


  // 7. OPERATIONAL STRENGTH (5%)
  let opScoreVal = 60;
  const strengthsOp: string[] = [];
  const weaknessesOp: string[] = [];

  const empCount = profile.epfo.activeEmployeesCount;
  if (empCount >= 40) {
    opScoreVal += 25;
    strengthsOp.push(`Substantial formal employment payroll with ${empCount} registered employees under EPFO`);
  } else if (empCount >= 10) {
    opScoreVal += 15;
    strengthsOp.push(`Steady formal workforce of ${empCount} employees on active payroll`);
  } else if (empCount > 0) {
    opScoreVal += 5;
    strengthsOp.push(`Formal micro-workforce with ${empCount} registered employees`);
  } else {
    opScoreVal -= 15;
    weaknessesOp.push('Zero active EPFO registrations; relies completely on informal or contract labour');
  }

  const epfDelay = profile.epfo.paymentDelayDays6Months;
  if (epfDelay === 0 && empCount > 0) {
    opScoreVal += 15;
    strengthsOp.push('Excellent labor compliance: Zero delays in monthly EPF contributions');
  } else if (epfDelay > 5) {
    opScoreVal -= 15;
    weaknessesOp.push(`Average EPFO payment delay of ${epfDelay} days indicates treasury stress`);
  }

  opScoreVal = Math.max(10, Math.min(100, opScoreVal));
  const operationalStrengthBreakdown = createMetricBreakdown(opScoreVal, 5, strengthsOp, weaknessesOp);


  // 8. FINANCIAL DISCIPLINE (5%)
  let discScoreVal = 70;
  const strengthsDisc: string[] = [];
  const weaknessesDisc: string[] = [];

  const utilLate = profile.utility.electricityLatePayments6Months;
  if (utilLate === 0) {
    discScoreVal += 20;
    strengthsDisc.push('Electricity and critical utility bill payments made on-time flawlessly');
  } else if (utilLate === 1) {
    discScoreVal -= 10;
    weaknessesDisc.push('Occasional (1) delay in settlement of electricity charges');
  } else {
    discScoreVal -= (utilLate * 15);
    weaknessesDisc.push(`${utilLate} electricity late payment incidents point to cash allocation challenges`);
  }

  const telecomOnTime = profile.utility.telecomBillPaidOnTimePercent;
  if (telecomOnTime >= 95) {
    discScoreVal += 10;
    strengthsDisc.push('Near-perfect telecom and internet subscription compliance');
  } else {
    discScoreVal -= 10;
    weaknessesDisc.push(`Telecom dues settled late occasionally (On-time compliance: ${telecomOnTime}%)`);
  }

  discScoreVal = Math.max(10, Math.min(100, discScoreVal));
  const financialDisciplineBreakdown = createMetricBreakdown(discScoreVal, 5, strengthsDisc, weaknessesDisc);


  // COMBINE AND WEIGHT (Weighted average)
  // Weights:
  // Revenue Growth (20%), Cash Flow Stability (20%), Banking Behaviour (15%), GST Compliance (15%)
  // Digital Transactions (10%), Business Stability (10%), Operational Strength (5%), Financial Discipline (5%)
  const overallScorePercent = 
    (revenueGrowthBreakdown.weightedContribution +
     cashFlowStabilityBreakdown.weightedContribution +
     bankingBehaviourBreakdown.weightedContribution +
     gstComplianceBreakdown.weightedContribution +
     digitalTransactionsBreakdown.weightedContribution +
     businessStabilityBreakdown.weightedContribution +
     operationalStrengthBreakdown.weightedContribution +
     financialDisciplineBreakdown.weightedContribution);

  // Convert 0-100 percentage to a 0-1000 score
  const overallScore = Math.round(overallScorePercent * 10);

  let grade: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'High Risk' = 'High Risk';
  let riskCategory: 'Minimal Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk' = 'High Risk';

  if (overallScore >= 900) {
    grade = 'Excellent';
    riskCategory = 'Minimal Risk';
  } else if (overallScore >= 800) {
    grade = 'Very Good';
    riskCategory = 'Low Risk';
  } else if (overallScore >= 700) {
    grade = 'Good';
    riskCategory = 'Medium Risk';
  } else if (overallScore >= 600) {
    grade = 'Fair';
    riskCategory = 'Medium Risk';
  } else {
    grade = 'High Risk';
    riskCategory = 'High Risk';
  }

  return {
    overallScore,
    grade,
    riskCategory,
    revenueGrowth: revenueGrowthBreakdown,
    cashFlowStability: cashFlowStabilityBreakdown,
    bankingBehaviour: bankingBehaviourBreakdown,
    gstCompliance: gstComplianceBreakdown,
    digitalTransactions: digitalTransactionsBreakdown,
    businessStability: businessStabilityBreakdown,
    operationalStrength: operationalStrengthBreakdown,
    financialDiscipline: financialDisciplineBreakdown,
  };
}

function createMetricBreakdown(
  score100: number, 
  weightPercent: number, 
  strengths: string[], 
  weaknesses: string[]
): ScoreMetricBreakdown {
  const weightedContribution = score100 * (weightPercent / 100);
  
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let riskStatus: 'Low Risk' | 'Moderate Risk' | 'Elevated Risk' | 'High Risk' = 'High Risk';

  if (score100 >= 90) {
    grade = 'A+';
    riskStatus = 'Low Risk';
  } else if (score100 >= 80) {
    grade = 'A';
    riskStatus = 'Low Risk';
  } else if (score100 >= 70) {
    grade = 'B';
    riskStatus = 'Moderate Risk';
  } else if (score100 >= 60) {
    grade = 'C';
    riskStatus = 'Elevated Risk';
  } else if (score100 >= 40) {
    grade = 'D';
    riskStatus = 'High Risk';
  } else {
    grade = 'F';
    riskStatus = 'High Risk';
  }

  return {
    score: score100,
    weight: weightPercent,
    weightedContribution,
    grade,
    riskStatus,
    strengths,
    weaknesses
  };
}
