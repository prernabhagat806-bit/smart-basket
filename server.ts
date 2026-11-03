import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Smart AI Grocery Shopping Assistant Route
app.post('/api/ai-assistant', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, basket, products, stores, budget } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `You are the SmartBasket AI Grocery & Budget Advisor for India.
You provide concise, high-value, realistic grocery shopping tips, price comparisons, budget advice, and store recommendations.
Current Available Stores: Blinkit (10-min quick delivery, ₹15 delivery), Zepto (10-min, ₹15 delivery), BigBasket (supermarket, lowest bulk prices, ₹30 delivery or free >₹499), JioMart (wholesale/value pricing, ₹25 delivery or free >₹399), Swiggy Instamart (12-min, ₹20 delivery), Sharma Kirana & General Store (Local neighborhood shop, free local delivery/pickup, best loose grain prices).
User budget: ₹${budget || 5000}/month.
Always provide concrete rupee savings, store names, and specific product recommendations. Keep answers structured, friendly, and under 180 words. Use bullet points where appropriate.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `User Question: "${prompt}"\nBasket items: ${JSON.stringify(basket || [])}\nStore database sample: ${JSON.stringify((products || []).slice(0, 6).map((p: any) => ({ name: p.name, prices: p.prices })))}` }]
            }
          ],
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        });

        const reply = response.text || 'I analyzed current store prices and recommend comparing BigBasket for monthly staples and your nearby Kirana for fresh essentials.';
        res.json({ reply, source: 'gemini-2.5-flash' });
        return;
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to smart heuristic:', err.message);
      }
    }

    // Smart heuristic fallback if no API key or network error
    const lower = prompt.toLowerCase();
    let reply = '';

    if (lower.includes('1000') || lower.includes('under 1000') || lower.includes('budget')) {
      reply = `🛒 **Smart Basket Under ₹1,000:**
- 5kg Rozzana Basmati Rice (Sharma Kirana: ₹295)
- 1L Sunflower Cooking Oil (JioMart: ₹138)
- 1kg Toor Dal (BigBasket: ₹165)
- 1kg Sugar (JioMart: ₹42)
- 1L Milk (Amul Taaza) (Sharma Kirana: ₹54)
- 1kg Fresh Onions & 1kg Potatoes (Sharma Kirana: ₹53)
**Total: ~₹747!** You save ₹140+ compared to quick-commerce orders by combining BigBasket/JioMart with your local Kirana.`;
    } else if (lower.includes('rice') || lower.includes('cheapest rice')) {
      reply = `🌾 **Cheapest Rice Comparison:**
- **Lowest Price:** Sharma Kirana & General Store at **₹295** for 5kg Rozzana Basmati.
- **Next Best Online:** JioMart at **₹305** and BigBasket at **₹310**.
- **Quick Commerce:** Blinkit (₹340) & Zepto (₹335).
💡 *Tip: For monthly staples over 10kg, purchasing from your local Kirana or JioMart saves you ₹80-₹120 per sack!*`;
    } else if (lower.includes('save') || lower.includes('cut') || lower.includes('money')) {
      reply = `💡 **Top 3 Money-Saving Rules on Groceries:**
1. **Split Heavy Staples from Daily Fresh:** Order bulk grains (Atta, Rice, Oil, Dal) on BigBasket or JioMart to meet the free delivery threshold.
2. **Buy Milk & Fresh Veggies Locally:** Local Kiranas like Sharma Store sell milk at standard MRP (₹54-₹56) and fresh produce without platform surge fees.
3. **Use the Split Basket Optimizer:** Our smart algorithm shows splitting 10+ items saves an average of ₹185 per weekly grocery run.`;
    } else if (lower.includes('oil') || lower.includes('cooking oil')) {
      reply = `🌻 **Cooking Oil Price Breakdown:**
- **JioMart:** ₹138 / 1L Fortune Sunflower (Cheapest)
- **Sharma Kirana:** ₹140 / 1L
- **BigBasket:** ₹142 / 1L
- **Zepto:** ₹145 / 1L
- **Blinkit:** ₹148 / 1L
- **Swiggy Instamart:** ₹150 / 1L
Savings alert: Buying a 5L jar on JioMart/BigBasket drops the effective rate to ₹132/L!`;
    } else {
      reply = `🛍️ **Smart Shopping Analysis:**
Based on your current PIN code and local inventory:
- **Best for Bulk & Monthly Pantry:** **JioMart** and **BigBasket** offer the lowest MRP discounts on pulses, rice, and edible oils.
- **Best for Instant Delivery:** **Zepto** currently beats Blinkit by ₹5-₹15 on daily staples with ₹15 delivery.
- **Best Offline Value:** **Sharma Kirana & General Store** offers loose grains and dairy without delivery fees.`;
    }

    res.json({ reply, source: 'smart-heuristic' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Setup Vite middlewares in dev mode, or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartBasket server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
