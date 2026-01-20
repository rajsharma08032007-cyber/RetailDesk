import { GoogleGenAI } from "@google/genai";
import { BusinessProfile, KPIMetrics, DailySales } from "../types.ts";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an intelligent business report based on current metrics.
 */
export const generateBusinessInsights = async (
  profile: BusinessProfile,
  kpi: KPIMetrics,
  recentData: DailySales[]
): Promise<string> => {
  try {
    const dataSummary = recentData.slice(-7).map(d => 
      `Date: ${d.date}, Rev: ₹${d.revenue}, Profit: ₹${d.profit}`
    ).join('\n');

    const prompt = `
      You are an expert retail business consultant named "RetailDesk AI".
      Analyze the following business performance data for a ${profile.sector} business named "${profile.companyName}".
      
      Business Context:
      - Sector: ${profile.sector}
      - Branches: ${profile.branches.length}
      
      Current KPIs:
      - Total Revenue: ₹${kpi.totalRevenue.toLocaleString()}
      - Total Profit: ₹${kpi.totalProfit.toLocaleString()}
      - Growth Rate: ${kpi.growthRate}%
      - Customer Count: ${kpi.customerCount}
      
      Recent Weekly Trend:
      ${dataSummary}
      
      Please provide:
      1. A brief executive summary of performance.
      2. Identify one key strength and one potential risk based on the data.
      3. Give 2 actionable recommendations to improve profitability or customer retention for this specific sector.
      
      Keep the tone professional, encouraging, and concise (under 200 words).
      Format the output with Markdown. Use ₹ symbol for all currency.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and concise business analytics assistant.",
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Insights are currently unavailable. Please check your network or API configuration.";
  }
};

/**
 * Interactive Chat with Business Context
 */
export const chatWithBusinessAI = async (
  message: string,
  history: { role: 'user' | 'model', text: string }[],
  context: string
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are "RetailDesk AI", a smart assistant for a retail shop owner. 
        Current Business Context: ${context}.
        Keep answers short, data-driven, and helpful. Use Markdown for formatting. Use ₹ symbol for currency.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm having trouble processing that right now.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection error. Please try again.";
  }
};