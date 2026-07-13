import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Resilient fallback structure generator
function getFallbackData(profile: any, calculatedScore: any, notice = "") {
  return {
    executiveSummary: notice + (calculatedScore.riskCategory === 'High Risk' 
      ? "Detailed assessment of the MSME indicates a higher risk profile under the Alternate scoring pipeline."
      : "The MSME profile demonstrates strong creditworthiness supported by clean transaction metrics, solid vintage, and healthy Alternate data scores."),
    riskEvaluation: calculatedScore.riskCategory === 'High Risk' 
      ? "High credit risk detected due to past cheque bounce events, late GST filing returns, and deteriorating cash buffer trends."
      : "Low-to-moderate credit risk profile supported by high-vintage stability, clean transaction compliance, and prompt tax filings.",
    cashFlowStabilityAnalysis: `The enterprise has average monthly inflows of ₹${(profile.aa.monthlyInflowLast6Months.reduce((a:number,b:number)=>a+b, 0)/6).toFixed(1)} Lakhs vs outflows of ₹${(profile.aa.monthlyOutflowLast6Months.reduce((a:number,b:number)=>a+b, 0)/6).toFixed(1)} Lakhs. Cash coverage remains healthy but requires strict management.`,
    repaymentCapacityAnalysis: profile.aa.chequeBounces6Months > 0 
      ? "Repayment capacity is under stress due to bank account liquidity breaches and prior returned cheques. Restructuring or working capital line of credit is recommended." 
      : "Strong repayment capability verified by reliable Account Aggregator (AA) monthly digital flows and excellent average balances.",
    businessStabilityGrade: `${calculatedScore.grade} (${calculatedScore.overallScore}/1000)`,
    eligibilityDecision: {
      isEligible: calculatedScore.overallScore >= 600,
      reason: calculatedScore.overallScore >= 600 
        ? "Eligible for credit line. High transaction density, solid alternative compliance, and robust EPFO employment registration supports a standard MSME Loan."
        : "Ineligible for unsecured business loans at this stage due to multiple cheque bounce occurrences, minimum balance violations, and a score below 600.",
      maxRecommendedLoanAmountLakhs: calculatedScore.overallScore >= 800 ? 15.0 : calculatedScore.overallScore >= 700 ? 10.0 : calculatedScore.overallScore >= 600 ? 5.0 : 0,
      suggestedTenureMonths: 24,
      predictedInterestRatePercent: calculatedScore.overallScore >= 900 ? 9.5 : calculatedScore.overallScore >= 800 ? 11.2 : calculatedScore.overallScore >= 700 ? 13.5 : 15.5,
      bestLenderMatches: [
        { bankName: profile.aa.institutionName || "State Bank of India", reason: "Primary transacting bank; provides optimal rates based on existing current account turnover relationship.", suitabilityScore: 95 },
        { bankName: "SIDBI", reason: "Specialized MSME developmental bank offering micro-enterprise credit assistance schemes.", suitabilityScore: 88 },
        { bankName: "HDFC Bank", reason: "Quick online disbursements for digital UPI merchant-heavy retailers.", suitabilityScore: 82 }
      ]
    },
    improvementSuggestions: [
      { area: "GST Compliance", actionableStep: "Ensure GSTR-3B filings are executed prior to the 20th of each month to eliminate late return penalties.", impactOnScorePoints: 45, timeframe: "30 Days" },
      { area: "Liquidity Buffer", actionableStep: "Maintain a minimum of 2.0x average monthly EMI as a ledger reserve balance within the primary current account.", impactOnScorePoints: 30, timeframe: "60 Days" },
      { area: "EPFO formalization", actionableStep: "Register contract staff under formal EPFO to enhance Operational Strength metrics on bank scoring cards.", impactOnScorePoints: 20, timeframe: "90 Days" }
    ],
    scoreExplanation: `The Credit Score of ${calculatedScore.overallScore} was generated using alternate transaction files. GST compliance stands at ${calculatedScore.gstCompliance.score}%, Cash flows at ${calculatedScore.cashFlowStability.score}%, and Banking discipline has a rating of ${calculatedScore.bankingBehaviour.score}%. This represents a comprehensive multi-layered view.`
  };
}

// Clean and parse JSON markdown block or simple JSON string
function cleanAndParseJSON(text: string) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  }
  return JSON.parse(cleaned);
}

// Robust generation helper with auto-retries (exponential backoff) and model fallback
async function generateContentWithRetry(params: any, retries = 3, delayMs = 1000) {
  const modelsToTry = [params.model, 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    if (!model) continue;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[AI-Retry] Attempting model: ${model}, attempt ${attempt}/${retries}`);
        const callParams = {
          ...params,
          model: model
        };
        const response = await ai.models.generateContent(callParams);
        if (response && response.text) {
          return response;
        }
        throw new Error('Empty response text received from Gemini API');
      } catch (err: any) {
        lastError = err;
        console.warn(`[AI-Warning] Failed with ${model} on attempt ${attempt}:`, err.message || err);
        
        const errStr = String(err.message || '').toUpperCase();
        const isTemporary = err.status === 503 || err.status === 429 || 
                            errStr.includes('503') || errStr.includes('429') || 
                            errStr.includes('UNAVAILABLE') || errStr.includes('RESOURCE_EXHAUSTED') ||
                            errStr.includes('HIGH DEMAND') || errStr.includes('OVERLOADED');

        if (attempt < retries && isTemporary) {
          const waitTime = delayMs * Math.pow(2, attempt - 1);
          console.log(`[AI-Retry] Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          break;
        }
      }
    }
  }
  throw lastError || new Error('All model attempts failed');
}

// Endpoint for analyzing MSME profile using Gemini AI
app.post('/api/analyze', async (req, res) => {
  const { profile, calculatedScore } = req.body;
  try {
    if (!profile) {
      return res.status(400).json({ error: 'Enterprise profile is required' });
    }

    if (!apiKey) {
      // Return a structured error so the UI can gracefully show a warning
      return res.status(200).json({
        isMock: true,
        data: getFallbackData(profile, calculatedScore, "Demo Mode (API Key Missing): Let's connect your bank's portal. This is a preview of the MSME credit risk analyzer powered by Gemini. To activate live analysis, configure your GEMINI_API_KEY inside the Secrets panel. ")
      });
    }

    // Prepare dense prompt for Gemini API
    const systemPrompt = `You are a Principal AI Financial Health Officer for an Indian bank.
Analyze MSME financial records (Alternate data: GST, UPI, Account Aggregator, EPFO, Utility invoices) and provide a highly technical, production-ready, professional risk evaluation, loan eligibility assessment, and improvement suggestions.`;

    const userPrompt = `Enterprise Profile Data:
${JSON.stringify(profile, null, 2)}

Calculated Health Score Summary:
- Overall Score: ${calculatedScore.overallScore} / 1000
- Grade: ${calculatedScore.grade}
- Risk Category: ${calculatedScore.riskCategory}

Metrics breakdown:
- Revenue Growth parameters: score=${calculatedScore.revenueGrowth.score}, weaknesses=${JSON.stringify(calculatedScore.revenueGrowth.weaknesses)}
- Cash Flow Stability parameters: score=${calculatedScore.cashFlowStability.score}, weaknesses=${JSON.stringify(calculatedScore.cashFlowStability.weaknesses)}
- Banking Behaviour parameters: score=${calculatedScore.bankingBehaviour.score}, weaknesses=${JSON.stringify(calculatedScore.bankingBehaviour.weaknesses)}
- GST Compliance parameters: score=${calculatedScore.gstCompliance.score}, weaknesses=${JSON.stringify(calculatedScore.gstCompliance.weaknesses)}
- Digital Transactions parameters: score=${calculatedScore.digitalTransactions.score}, weaknesses=${JSON.stringify(calculatedScore.digitalTransactions.weaknesses)}
- Business Stability parameters: score=${calculatedScore.businessStability.score}, weaknesses=${JSON.stringify(calculatedScore.businessStability.weaknesses)}
- Operational Strength parameters: score=${calculatedScore.operationalStrength.score}, weaknesses=${JSON.stringify(calculatedScore.operationalStrength.weaknesses)}
- Financial Discipline parameters: score=${calculatedScore.financialDiscipline.score}, weaknesses=${JSON.stringify(calculatedScore.financialDiscipline.weaknesses)}

Generate a detailed credit assessment in JSON.
Identify specific areas for growth, strategic investment opportunities, explain the score logic, and predict loan eligibility.`;

    // Invoke Gemini model 'gemini-3.5-flash' with our robust retry mechanism
    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: {
              type: Type.STRING,
              description: 'A professional executive synthesis summarizing the MSME enterprise creditworthiness, trade segment trends, and general banking assessment.'
            },
            riskEvaluation: {
              type: Type.STRING,
              description: 'Detailed analysis of alternate risk signals, late filings, and key credit default risk factors.'
            },
            cashFlowStabilityAnalysis: {
              type: Type.STRING,
              description: 'Evaluation of the monthly cash inflows and outflows stability, cash burn rates, and operating leverage margins.'
            },
            repaymentCapacityAnalysis: {
              type: Type.STRING,
              description: 'Critical analysis of average current ledger balances, existing EMI debit ratios, and future debt serviceability capacity.'
            },
            businessStabilityGrade: {
              type: Type.STRING,
              description: 'A qualitative assessment of business vintage, constitution, and market survivability grade.'
            },
            eligibilityDecision: {
              type: Type.OBJECT,
              properties: {
                isEligible: { type: Type.BOOLEAN },
                reason: { type: Type.STRING },
                maxRecommendedLoanAmountLakhs: { type: Type.NUMBER, description: 'Lakhs INR (e.g. 15.5 for 15,50,000 INR)' },
                suggestedTenureMonths: { type: Type.INTEGER, description: 'E.g., 12, 24, 36' },
                predictedInterestRatePercent: { type: Type.NUMBER, description: 'E.g., 10.5 for 10.5% interest rate p.a.' },
                bestLenderMatches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      bankName: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      suitabilityScore: { type: Type.INTEGER }
                    },
                    required: ['bankName', 'reason', 'suitabilityScore']
                  }
                }
              },
              required: ['isEligible', 'reason', 'maxRecommendedLoanAmountLakhs', 'suggestedTenureMonths', 'predictedInterestRatePercent', 'bestLenderMatches']
            },
            improvementSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  area: { type: Type.STRING, description: 'E.g. GST Compliance, Banking discipline, Digital collections' },
                  actionableStep: { type: Type.STRING, description: 'Concrete, practical step for the borrower' },
                  impactOnScorePoints: { type: Type.INTEGER, description: 'Estimated positive point impact, e.g. 25' },
                  timeframe: { type: Type.STRING, description: 'E.g. 30 Days, 90 Days' }
                },
                required: ['area', 'actionableStep', 'impactOnScorePoints', 'timeframe']
              }
            },
            scoreExplanation: {
              type: Type.STRING,
              description: 'Clear, transparent explanation of how alternate data metrics produced this precise health card rating.'
            }
          },
          required: [
            'executiveSummary',
            'riskEvaluation',
            'cashFlowStabilityAnalysis',
            'repaymentCapacityAnalysis',
            'businessStabilityGrade',
            'eligibilityDecision',
            'improvementSuggestions',
            'scoreExplanation'
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('No response from Gemini API');
    }

    const parsedResult = cleanAndParseJSON(resultText);
    return res.json({ isMock: false, data: parsedResult });

  } catch (error: any) {
    console.error('Error analyzing MSME profile:', error);
    // If we have an actual API/Service unavailability error, fallback gracefully to Sandbox fallback rather than breaking
    console.log('[AI-Fallback] Falling back to pre-calculated alternate credit indicators due to model congestion');
    return res.status(200).json({
      isMock: true,
      data: getFallbackData(profile, calculatedScore, "Note: Alternate Credit AI Engine is currently congested. Displaying pre-calculated sandbox indicators: ")
    });
  }
});

// Endpoint for conversational follow-ups with the AI Financial Health Officer
app.post('/api/chat', async (req, res) => {
  const { message, history, profile, calculatedScore } = req.body;
  try {
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!apiKey) {
      return res.json({
        isMock: true,
        text: `(Demo Mode - API Key Missing) I am your AI Financial Officer. You asked: "${message}". In a live connection, I will query the Gemini model to provide specialized suggestions. Based on ${profile?.name || 'the enterprise'}'s score of ${calculatedScore?.overallScore || 'N/A'}, keeping your average balances higher and avoiding min balance fees will increase your rating by up to 35 points.`
      });
    }

    const systemPrompt = `You are a Principal AI Financial Health Officer for an Indian bank co-branded MSME portal.
Your job is to answer questions from the borrower or the relationship manager regarding their Financial Health Card, scoring parameters, and loan options.
Sourced data Context:
Company Name: ${profile?.name}
Segment: ${profile?.segment}
Location: ${profile?.location}
Vintage: ${profile?.vintageYears} years

Calculated Score: ${calculatedScore?.overallScore}/1000 (${calculatedScore?.grade}, ${calculatedScore?.riskCategory})
GST Compliance Score: ${calculatedScore?.gstCompliance?.score}
Cash Flow Stability Score: ${calculatedScore?.cashFlowStability?.score}
Banking Behaviour Score: ${calculatedScore?.bankingBehaviour?.score}

Provide practical, highly professional answers. Include actionable advice and explain banking logic clearly. Keep answers readable and concise.`;

    const chatContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        chatContents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    }
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await generateContentWithRetry({
      model: 'gemini-3.5-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return res.json({ isMock: false, text: response.text });
  } catch (error: any) {
    console.error('Error in chat route:', error);
    return res.json({
      isMock: true,
      text: `(Resilient Fallback Mode - Model Congested) I am your AI Financial Officer. You asked: "${message}". The AI Engine is currently under high load, so I'm providing a pre-compiled response: For ${profile?.name || 'the enterprise'} to enhance their score, maintaining GSTR-3B filing timelines and reducing average cheque bounces will significantly boost eligibility metrics.`
    });
  }
});

// Serve frontend build static files in production or delegate to Vite in dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
