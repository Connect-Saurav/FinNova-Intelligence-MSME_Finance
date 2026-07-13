export interface GSTData {
  gstin: string;
  legalName: string;
  tradeName: string;
  registrationDate: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  filingFrequency: 'MONTHLY' | 'QUARTERLY';
  gstComplianceScore: number; // 0 - 100
  lateFilingsCount3Years: number;
  unreconciledInvoicesPercent: number;
  monthlyRevenueLast6Months: number[]; // in INR Lakhs
  gstTaxPaidLast6Months: number[]; // in INR Lakhs
  hsnCodes: string[];
}

export interface UPITransactions {
  upiId: string;
  monthlyVolumeLast6Months: number[]; // count of transactions
  monthlyValueLast6Months: number[]; // in INR Lakhs
  bounceRatePercent: number;
  avgTransactionSizeINR: number;
  activeQrCodesCount: number;
  uniqueCustomers6Months: number;
  peerToMerchantRatio: number; // e.g. 0.95 (95% merchant txns)
}

export interface AAAccountData {
  consentId: string;
  institutionName: string;
  accountType: 'CURRENT' | 'SAVINGS' | 'OVERDRAFT';
  averageBalance6Months: number; // in INR Lakhs
  minimumBalanceViolations6Months: number;
  monthlyInflowLast6Months: number[]; // in INR Lakhs
  monthlyOutflowLast6Months: number[]; // in INR Lakhs
  cashWithdrawalRatio: number; // cash withdrawals as % of total outflows
  emiOutflows6Months: number[]; // EMI amounts debited monthly in INR Lakhs
  chequeBounces6Months: number;
}

export interface EPFOData {
  establishmentId: string;
  activeEmployeesCount: number;
  monthlyEPFContributionLast6Months: number[]; // in INR Thousands
  averageTenureMonths: number;
  paymentDelayDays6Months: number; // average delay in paying EPF
}

export interface UtilityData {
  electricityConsumerNo: string;
  averageElectricityBillLast6Months: number; // in INR Thousands
  electricityLatePayments6Months: number;
  telecomBillPaidOnTimePercent: number;
  rentAgreementsMonthsRemaining: number;
}

export interface EnterpriseProfile {
  id: string;
  name: string;
  segment: string; // e.g. "Textile Retail", "Metal Fabrication", "Agro-processing", "IT Services"
  location: string; // e.g. "Surat, Gujarat", "Coimbatore, Tamil Nadu", "Nashik, Maharashtra"
  constitution: 'PROPRIETORSHIP' | 'PARTNERSHIP' | 'PVT_LTD' | 'LLP';
  vintageYears: number;
  gst: GSTData;
  upi: UPITransactions;
  aa: AAAccountData;
  epfo: EPFOData;
  utility: UtilityData;
}

export interface ScoreMetricBreakdown {
  score: number; // 0 - 100 or specific range
  weight: number; // weight in percentage
  weightedContribution: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskStatus: 'Low Risk' | 'Moderate Risk' | 'Elevated Risk' | 'High Risk';
  strengths: string[];
  weaknesses: string[];
}

export interface CreditScoreResult {
  overallScore: number; // 0 - 1000
  grade: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'High Risk';
  riskCategory: 'Minimal Risk' | 'Low Risk' | 'Medium Risk' | 'High Risk';
  
  // 8 Parameters Breakdown
  revenueGrowth: ScoreMetricBreakdown;
  cashFlowStability: ScoreMetricBreakdown;
  bankingBehaviour: ScoreMetricBreakdown;
  gstCompliance: ScoreMetricBreakdown;
  digitalTransactions: ScoreMetricBreakdown;
  businessStability: ScoreMetricBreakdown;
  operationalStrength: ScoreMetricBreakdown;
  financialDiscipline: ScoreMetricBreakdown;
}

export interface AIAnalysisResult {
  executiveSummary: string;
  riskEvaluation: string;
  cashFlowStabilityAnalysis: string;
  repaymentCapacityAnalysis: string;
  businessStabilityGrade: string;
  eligibilityDecision: {
    isEligible: boolean;
    reason: string;
    maxRecommendedLoanAmountLakhs: number;
    suggestedTenureMonths: number;
    predictedInterestRatePercent: number;
    bestLenderMatches: Array<{
      bankName: string;
      reason: string;
      suitabilityScore: number; // 1-100
    }>;
  };
  improvementSuggestions: Array<{
    area: string;
    actionableStep: string;
    impactOnScorePoints: number;
    timeframe: string; // e.g. "30 Days", "90 Days"
  }>;
  scoreExplanation: string;
}
