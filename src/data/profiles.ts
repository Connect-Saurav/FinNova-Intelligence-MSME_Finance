import { EnterpriseProfile } from '../types';

export const mockProfiles: EnterpriseProfile[] = [
  {
    id: 'rajesh-garments',
    name: 'Rajesh Garments Private Limited',
    segment: 'Textile Manufacturing & Retail',
    location: 'Surat, Gujarat',
    constitution: 'PVT_LTD',
    vintageYears: 12,
    gst: {
      gstin: '24AAAAC1234F1Z8',
      legalName: 'Rajesh Garments Private Limited',
      tradeName: 'Rajesh Garments',
      registrationDate: '2014-04-12',
      status: 'ACTIVE',
      filingFrequency: 'MONTHLY',
      gstComplianceScore: 95,
      lateFilingsCount3Years: 0,
      unreconciledInvoicesPercent: 4.2,
      monthlyRevenueLast6Months: [34.5, 36.8, 38.2, 41.0, 42.5, 45.1], // INR Lakhs
      gstTaxPaidLast6Months: [1.8, 1.9, 2.0, 2.1, 2.2, 2.4],
      hsnCodes: ['610910', '610510', '620443']
    },
    upi: {
      upiId: 'rajeshgarments@sbi',
      monthlyVolumeLast6Months: [1240, 1310, 1420, 1550, 1620, 1780],
      monthlyValueLast6Months: [18.5, 19.8, 21.0, 22.5, 23.8, 25.4], // INR Lakhs
      bounceRatePercent: 1.1,
      avgTransactionSizeINR: 1450,
      activeQrCodesCount: 8,
      uniqueCustomers6Months: 4850,
      peerToMerchantRatio: 0.98
    },
    aa: {
      consentId: 'aa-cons-rajesh-998',
      institutionName: 'State Bank of India',
      accountType: 'CURRENT',
      averageBalance6Months: 8.4, // INR Lakhs
      minimumBalanceViolations6Months: 0,
      monthlyInflowLast6Months: [32.0, 35.0, 37.5, 39.0, 41.0, 44.0], // INR Lakhs
      monthlyOutflowLast6Months: [29.5, 32.2, 34.0, 36.5, 37.8, 39.5], // INR Lakhs
      cashWithdrawalRatio: 0.12,
      emiOutflows6Months: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2],
      chequeBounces6Months: 0
    },
    epfo: {
      establishmentId: 'GJSRT1234567000',
      activeEmployeesCount: 42,
      monthlyEPFContributionLast6Months: [84.2, 85.0, 85.0, 86.4, 88.0, 91.2], // INR Thousands
      averageTenureMonths: 24,
      paymentDelayDays6Months: 0
    },
    utility: {
      electricityConsumerNo: 'EL-SURAT-99881',
      averageElectricityBillLast6Months: 48.5, // INR Thousands
      electricityLatePayments6Months: 0,
      telecomBillPaidOnTimePercent: 100,
      rentAgreementsMonthsRemaining: 24
    }
  },
  {
    id: 'narmada-agro',
    name: 'Narmada Agro Foods & Processing',
    segment: 'Agricultural Processing',
    location: 'Nashik, Maharashtra',
    constitution: 'PARTNERSHIP',
    vintageYears: 3,
    gst: {
      gstin: '27AABCN8891P1ZX',
      legalName: 'Narmada Agro Foods & Processing',
      tradeName: 'Narmada Agro',
      registrationDate: '2023-01-20',
      status: 'ACTIVE',
      filingFrequency: 'MONTHLY',
      gstComplianceScore: 88,
      lateFilingsCount3Years: 1,
      unreconciledInvoicesPercent: 7.5,
      monthlyRevenueLast6Months: [12.0, 14.5, 13.8, 16.2, 18.4, 21.0], // INR Lakhs
      gstTaxPaidLast6Months: [0.6, 0.7, 0.7, 0.8, 0.9, 1.1],
      hsnCodes: ['080600', '200819']
    },
    upi: {
      upiId: 'narmadaagro@hdfc',
      monthlyVolumeLast6Months: [650, 720, 810, 890, 950, 1100],
      monthlyValueLast6Months: [9.2, 10.5, 11.2, 12.8, 14.0, 16.5],
      bounceRatePercent: 1.8,
      avgTransactionSizeINR: 1500,
      activeQrCodesCount: 4,
      uniqueCustomers6Months: 2200,
      peerToMerchantRatio: 0.94
    },
    aa: {
      consentId: 'aa-cons-narmada-102',
      institutionName: 'HDFC Bank',
      accountType: 'CURRENT',
      averageBalance6Months: 3.2,
      minimumBalanceViolations6Months: 0,
      monthlyInflowLast6Months: [11.5, 13.8, 13.0, 15.5, 17.8, 20.2],
      monthlyOutflowLast6Months: [10.2, 12.5, 12.1, 14.2, 16.0, 18.2],
      cashWithdrawalRatio: 0.18,
      emiOutflows6Months: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0], // Clean leverage - No loan history (NTC/NTB!)
      chequeBounces6Months: 0
    },
    epfo: {
      establishmentId: 'MHNSK7766123000',
      activeEmployeesCount: 12,
      monthlyEPFContributionLast6Months: [24.0, 24.0, 24.0, 24.0, 24.0, 24.0],
      averageTenureMonths: 18,
      paymentDelayDays6Months: 2 // Average 2 days delay (minor)
    },
    utility: {
      electricityConsumerNo: 'EL-NASHIK-44512',
      averageElectricityBillLast6Months: 18.2,
      electricityLatePayments6Months: 0,
      telecomBillPaidOnTimePercent: 96,
      rentAgreementsMonthsRemaining: 14
    }
  },
  {
    id: 'saraswati-it',
    name: 'Saraswati Digital Solutions',
    segment: 'IT Services & Consulting',
    location: 'Bengaluru, Karnataka',
    constitution: 'LLP',
    vintageYears: 6,
    gst: {
      gstin: '29AAECS4512A1ZG',
      legalName: 'Saraswati Digital Solutions LLP',
      tradeName: 'Saraswati Digital',
      registrationDate: '2020-08-15',
      status: 'ACTIVE',
      filingFrequency: 'QUARTERLY',
      gstComplianceScore: 92,
      lateFilingsCount3Years: 0,
      unreconciledInvoicesPercent: 2.1,
      monthlyRevenueLast6Months: [22.4, 23.0, 21.8, 24.5, 25.0, 26.8],
      gstTaxPaidLast6Months: [4.0, 4.1, 3.9, 4.4, 4.5, 4.8], // 18% GST Service Tax
      hsnCodes: ['998313', '998314']
    },
    upi: {
      upiId: 'saraswatidigital@icici',
      monthlyVolumeLast6Months: [140, 160, 155, 180, 195, 210],
      monthlyValueLast6Months: [14.0, 15.2, 14.8, 16.5, 17.2, 18.9],
      bounceRatePercent: 0.5,
      avgTransactionSizeINR: 9000, // Tech invoice sizes are larger
      activeQrCodesCount: 1,
      uniqueCustomers6Months: 45,
      peerToMerchantRatio: 0.99
    },
    aa: {
      consentId: 'aa-cons-saraswati-404',
      institutionName: 'ICICI Bank',
      accountType: 'OVERDRAFT',
      averageBalance6Months: 6.5,
      minimumBalanceViolations6Months: 0,
      monthlyInflowLast6Months: [21.5, 22.0, 21.0, 23.5, 24.2, 25.8],
      monthlyOutflowLast6Months: [18.0, 18.5, 17.8, 19.2, 20.0, 21.2],
      cashWithdrawalRatio: 0.05, // very digital
      emiOutflows6Months: [2.1, 2.1, 2.1, 2.1, 2.1, 2.1], // Active machinery/office space loan
      chequeBounces6Months: 0
    },
    epfo: {
      establishmentId: 'KABGL9988123000',
      activeEmployeesCount: 18,
      monthlyEPFContributionLast6Months: [54.0, 54.0, 54.0, 54.0, 55.5, 55.5],
      averageTenureMonths: 32,
      paymentDelayDays6Months: 0
    },
    utility: {
      electricityConsumerNo: 'EL-BGL-110022',
      averageElectricityBillLast6Months: 14.5,
      electricityLatePayments6Months: 1,
      telecomBillPaidOnTimePercent: 100,
      rentAgreementsMonthsRemaining: 36
    }
  },
  {
    id: 'karan-metal',
    name: 'Karan Metal Works',
    segment: 'Metal Fabrication & Tooling',
    location: 'Coimbatore, Tamil Nadu',
    constitution: 'PROPRIETORSHIP',
    vintageYears: 8,
    gst: {
      gstin: '33AAOPM4451D1ZX',
      legalName: 'Karan Metal Works',
      tradeName: 'Karan Metals',
      registrationDate: '2018-02-14',
      status: 'ACTIVE',
      filingFrequency: 'MONTHLY',
      gstComplianceScore: 65,
      lateFilingsCount3Years: 6, // Delayed compliance
      unreconciledInvoicesPercent: 24.8, // Bad ledger matching
      monthlyRevenueLast6Months: [18.5, 17.0, 19.2, 16.5, 14.8, 13.5], // Declining trend!
      gstTaxPaidLast6Months: [0.9, 0.8, 1.0, 0.8, 0.7, 0.6],
      hsnCodes: ['720800', '730890']
    },
    upi: {
      upiId: 'karanmetals@pnb',
      monthlyVolumeLast6Months: [95, 84, 90, 72, 60, 55],
      monthlyValueLast6Months: [3.2, 2.8, 3.0, 2.4, 2.0, 1.8],
      bounceRatePercent: 6.8, // high failure rates
      avgTransactionSizeINR: 3200,
      activeQrCodesCount: 2,
      uniqueCustomers6Months: 124,
      peerToMerchantRatio: 0.75 // low digital focus, mostly cash and some personal P2P mixed
    },
    aa: {
      consentId: 'aa-cons-karan-809',
      institutionName: 'Punjab National Bank',
      accountType: 'CURRENT',
      averageBalance6Months: 0.8, // Low balance
      minimumBalanceViolations6Months: 3, // Multiple violations
      monthlyInflowLast6Months: [15.2, 14.0, 16.5, 13.8, 12.0, 10.5],
      monthlyOutflowLast6Months: [15.8, 14.8, 16.1, 14.5, 12.4, 11.2], // Outflows exceed inflows (Cash leak)
      cashWithdrawalRatio: 0.45, // High reliance on cash withdrawals
      emiOutflows6Months: [1.8, 1.8, 1.8, 1.8, 1.8, 1.8],
      chequeBounces6Months: 2 // Multiple cheque bounces! Bad credit hygiene
    },
    epfo: {
      establishmentId: 'TNCOB4451123000',
      activeEmployeesCount: 6,
      monthlyEPFContributionLast6Months: [12.0, 12.0, 11.0, 11.0, 9.5, 9.5], // Declining staff
      averageTenureMonths: 11,
      paymentDelayDays6Months: 12 // Severedelay of 12 days on average
    },
    utility: {
      electricityConsumerNo: 'EL-COIMB-55612',
      averageElectricityBillLast6Months: 22.4,
      electricityLatePayments6Months: 3, // multiple utility late payments
      telecomBillPaidOnTimePercent: 82,
      rentAgreementsMonthsRemaining: 2
    }
  }
];
