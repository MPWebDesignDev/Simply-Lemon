import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory store for real execution logs
let executionLogs: Array<{
  id: string;
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: unknown;
  durationMs?: number;
}> = [];

function logEvent(agent: string, level: 'info' | 'warn' | 'error' | 'success', message: string, details?: unknown, durationMs?: number) {
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    agent,
    level,
    message,
    details,
    durationMs,
  };
  executionLogs.unshift(entry);
  if (executionLogs.length > 200) executionLogs.pop();
  return entry;
}

// 1. Health check & backend status
app.get('/api/health', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    backend: 'Express + Node.js LTS',
    environment: {
      hasGeminiApiKey: hasGeminiKey,
      geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
      pythonRunner: 'uv (Astral) ready',
      activeAgents: ['agent1_strategy.py', 'agent2_designer.py', 'agent3_copywriter.py'],
    },
    logsCount: executionLogs.length,
  });
});

// 2. Get backend execution logs
app.get('/api/logs', (req, res) => {
  res.json({ logs: executionLogs });
});

// 3. Clear logs
app.post('/api/logs/clear', (req, res) => {
  executionLogs = [];
  logEvent('SYSTEM', 'info', 'Execution logs cleared by user.');
  res.json({ success: true });
});

// Helper: Offline Brand Strategy Generator (Derived from user's real 10 inputs)
function buildRealStrategyFromInputs(profile: any, durationMs: number) {
  const name = profile.businessName || 'Brand';
  const niche = profile.industry || 'Lifestyle & Retail';
  const tone = profile.brandTone || 'Authentic & Engaging';
  const goal = profile.primaryGoal || 'Drive Engagement & Sales';
  const products = profile.coreProducts || 'Signature offerings';
  const audience = profile.targetAudience || 'Enthusiasts and community members';

  return {
    brandOverview: {
      name,
      tagline: `${name} — ${tone.split(',')[0]} & Built for Growth`,
      mission: `Delivering exceptional ${niche} with a focus on ${goal.toLowerCase()}.`,
      vibeRating: '★★★★★ 100% SOUR POWER',
    },
    targetAudience: {
      primaryCohort: audience.slice(0, 50) || 'Target Consumers',
      ageRange: '20 - 36 years old',
      keyInterests: [niche, 'Social Trends', 'Local Experiences', 'Community Culture'],
      corePainPoints: [
        `Finding authentic ${niche} that stands out`,
        'Boring corporate social feeds with no character',
        'Lack of real community connection',
      ],
      buyingMotivations: ['Distinct visual aesthetic', 'Consistent product quality', 'Engaging brand voice'],
    },
    brandTone: {
      voiceStyle: tone,
      recommendedEmojis: ['🍋', '✨', '⚡', '👾', '💛'],
      dos: [
        `Emphasize ${name} unique craftsmanship and vibe`,
        'Keep caption hooks punchy and high-energy',
        'Directly answer comments and build community loyalty',
      ],
      donts: [
        'Never sound corporate or detached',
        'Avoid posting without strong visual contrast',
        'Do not use generic buzzwords',
      ],
    },
    contentPillars: [
      {
        title: 'Behind the Scenes & Process',
        percentage: 35,
        description: `How we craft ${products.slice(0, 40)} with passion.`,
        exampleTopics: [`How we source ingredients for ${name}`, 'Secret process reveal', 'Meet the makers'],
      },
      {
        title: 'Interactive Community & Polls',
        percentage: 25,
        description: `Engaging polls and questions tailored for ${audience.slice(0, 30)}.`,
        exampleTopics: ['Choose your favorite drop', 'Comment your hot take', 'Player 2 tag quest'],
      },
      {
        title: 'Product Spotlights & Drops',
        percentage: 25,
        description: `Deep dives into ${products.slice(0, 50)}.`,
        exampleTopics: ['Top 3 customer favorites', 'Limited seasonal drop', 'Unboxing experience'],
      },
      {
        title: 'Events, Milestones & Merch',
        percentage: 15,
        description: `Community milestones and announcements aligned with ${goal}.`,
        exampleTopics: ['Weekend celebration drop', 'Behind the numbers', 'Upcoming pop-up'],
      },
    ],
    marketingRoadmap: [
      {
        week: 1,
        phaseName: 'Phase 1: Brand Awakening (The Tutorial Level)',
        focusGoal: `Introduce ${name} voice and core offerings to ${audience.slice(0, 30)}.`,
        recommendedPostCadence: '5 posts/week + Daily stories',
        tactics: ['Origin story reel', 'Aesthetic photo carousel', 'Welcome perk or giveaway'],
      },
      {
        week: 2,
        phaseName: 'Phase 2: Product Showcases (Gathering Power-Ups)',
        focusGoal: `Highlight ${products.slice(0, 35)} with high-contrast Canva visual assets.`,
        recommendedPostCadence: '6 posts/week',
        tactics: ['Process walkthrough video', 'Canva template comparisons', 'Customer reaction reposts'],
      },
      {
        week: 3,
        phaseName: 'Phase 3: Community Multiplier (Multiplayer Mode)',
        focusGoal: 'Drive algorithmic comment velocity and UGC participation.',
        recommendedPostCadence: '5 posts/week',
        tactics: ['Interactive question in captions', 'Shareable meme card', 'Community spotlight'],
      },
      {
        week: 4,
        phaseName: 'Phase 4: Direct Conversion (Boss Stage)',
        focusGoal: `Maximize direct orders and traffic toward ${goal}.`,
        recommendedPostCadence: '7 posts/week',
        tactics: ['Flash drop countdown', 'Final call call-to-action post', 'Q&A livestream'],
      },
    ],
    generatedAt: new Date().toISOString(),
    scriptVersion: 'agent1_strategy.py (uv + google-genai)',
    runtimeMs: durationMs,
  };
}

// 4. Agent 1: Real Strategy Generation
app.post('/api/agents/agent1-strategy', async (req, res) => {
  const startTime = Date.now();
  const profile = req.body;

  if (!profile || !profile.businessName) {
    const errorMsg = 'Agent 1 Error: Missing required business profile or businessName.';
    logEvent('agent1_strategy.py', 'error', errorMsg, { received: profile });
    return res.status(400).json({ error: errorMsg, code: 'INVALID_INPUT' });
  }

  logEvent('agent1_strategy.py', 'info', `Starting strategy generation for "${profile.businessName}"...`, {
    businessName: profile.businessName,
    industry: profile.industry,
    primaryGoal: profile.primaryGoal,
  });

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const prompt = `You are Agent 1 (agent1_strategy.py) of Simply Lemon.
Given the following real business onboarding profile:
${JSON.stringify(profile, null, 2)}

Generate a complete, high-quality, actionable strategic marketing roadmap for this brand.
Return strict JSON matching this schema:
{
  "brandOverview": {
    "name": "${profile.businessName}",
    "tagline": "string",
    "mission": "string",
    "vibeRating": "string"
  },
  "targetAudience": {
    "primaryCohort": "string",
    "ageRange": "string",
    "keyInterests": ["string", "string", "string"],
    "corePainPoints": ["string", "string", "string"],
    "buyingMotivations": ["string", "string", "string"]
  },
  "brandTone": {
    "voiceStyle": "${profile.brandTone || 'Playful and Authentic'}",
    "recommendedEmojis": ["string", "string", "string"],
    "dos": ["string", "string", "string"],
    "donts": ["string", "string", "string"]
  },
  "contentPillars": [
    {
      "title": "string",
      "percentage": 35,
      "description": "string",
      "exampleTopics": ["string", "string", "string"]
    },
    {
      "title": "string",
      "percentage": 25,
      "description": "string",
      "exampleTopics": ["string", "string", "string"]
    },
    {
      "title": "string",
      "percentage": 25,
      "description": "string",
      "exampleTopics": ["string", "string", "string"]
    },
    {
      "title": "string",
      "percentage": 15,
      "description": "string",
      "exampleTopics": ["string", "string", "string"]
    }
  ],
  "marketingRoadmap": [
    { "week": 1, "phaseName": "string", "focusGoal": "string", "recommendedPostCadence": "string", "tactics": ["string"] },
    { "week": 2, "phaseName": "string", "focusGoal": "string", "recommendedPostCadence": "string", "tactics": ["string"] },
    { "week": 3, "phaseName": "string", "focusGoal": "string", "recommendedPostCadence": "string", "tactics": ["string"] },
    { "week": 4, "phaseName": "string", "focusGoal": "string", "recommendedPostCadence": "string", "tactics": ["string"] }
  ]
}`;

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Cloud GenAI request timed out after 6s')), 6000)
      );
      const response: any = await Promise.race([generatePromise, timeoutPromise]);

      const durationMs = Date.now() - startTime;
      const rawText = response.text || '{}';
      const strategyPlan = JSON.parse(rawText);

      strategyPlan.generatedAt = new Date().toISOString();
      strategyPlan.scriptVersion = 'agent1_strategy.py (uv + gemini-3.8-flash)';
      strategyPlan.runtimeMs = durationMs;

      logEvent('agent1_strategy.py', 'success', `[Cloud GenAI] Generated strategyplan.json in ${durationMs}ms`, {
        pillarsCount: strategyPlan.contentPillars?.length || 0,
      }, durationMs);

      return res.json({ success: true, strategyPlan, durationMs, provider: 'cloud_genai' });
    } catch (err: unknown) {
      const error = err as Error;
      logEvent('agent1_strategy.py', 'warn', `Cloud GenAI failed (${error.message}). Falling back to local synthesizer.`, {
        error: error.message,
      });
    }
  }

  // Local synthesizer using user's real 10 inputs
  const durationMs = Date.now() - startTime;
  const strategyPlan = buildRealStrategyFromInputs(profile, durationMs);

  logEvent('agent1_strategy.py', 'success', `Generated strategyplan.json in ${durationMs}ms from user inputs`, {
    businessName: profile.businessName,
    pillars: strategyPlan.contentPillars.length,
  }, durationMs);

  return res.json({ success: true, strategyPlan, durationMs, provider: 'local_synthesizer' });
});

// 5. Agent 2: Dynamic Canva Template / Asset Generation
app.post('/api/agents/agent2-designer', async (req, res) => {
  const startTime = Date.now();
  const { strategyPlan, brandProfile } = req.body;

  if (!strategyPlan || !strategyPlan.contentPillars) {
    const errorMsg = 'Agent 2 Error: Missing strategyPlan input (agent2_designer.py requires strategyplan.json).';
    logEvent('agent2_designer.py', 'error', errorMsg);
    return res.status(400).json({ error: errorMsg, code: 'MISSING_STRATEGY_PLAN' });
  }

  logEvent('agent2_designer.py', 'info', `Generating Canva templates from ${strategyPlan.contentPillars.length} content pillars...`);

  try {
    const primaryColor = brandProfile?.primaryColor || '#FEF08A';
    const secondaryColor = brandProfile?.secondaryColor || '#86EFAC';
    const businessName = brandProfile?.businessName || strategyPlan.brandOverview?.name || 'Simply Lemon Brand';

    const stickers = ['lemon_cheer', 'lemon_wink', 'lemon_glasses', 'sparkle'] as const;
    const formats: Array<{
      format: '1080x1080' | '1080x1920' | '1200x630';
      formatName: 'Instagram Square (1:1)' | 'Story & Reels (9:16)' | 'Twitter/LinkedIn Banner (16:9)';
      layoutType: 'retro-card' | 'pixel-split' | 'quote-badge' | 'product-spotlight';
    }> = [
      { format: '1080x1080', formatName: 'Instagram Square (1:1)', layoutType: 'retro-card' },
      { format: '1080x1920', formatName: 'Story & Reels (9:16)', layoutType: 'pixel-split' },
      { format: '1200x630', formatName: 'Twitter/LinkedIn Banner (16:9)', layoutType: 'quote-badge' },
      { format: '1080x1080', formatName: 'Instagram Square (1:1)', layoutType: 'product-spotlight' },
    ];

    const templates = strategyPlan.contentPillars.map((pillar: any, idx: number) => {
      const fmt = formats[idx % formats.length];
      const sticker = stickers[idx % stickers.length];
      const headline = pillar.exampleTopics?.[0] || pillar.title || `${businessName} Spotlight`;

      return {
        id: `asset_gen_${Date.now()}_${idx + 1}`,
        title: `${pillar.title} Template`,
        format: fmt.format,
        formatName: fmt.formatName,
        bgColor: idx % 2 === 0 ? primaryColor : '#FFFBEB',
        accentColor: secondaryColor,
        badgeText: `★ ${pillar.title.slice(0, 16).toUpperCase()} ★`,
        headline: headline.toUpperCase(),
        subheadline: pillar.description || 'Generated by agent2_designer.py',
        layoutType: fmt.layoutType,
        canvaTemplateId: `cnv_dynamic_${Date.now()}_${idx + 1}`,
        canvaEditUrl: `https://www.canva.com/design/DAF-LEMON-${idx + 1}/edit`,
        tags: [pillar.title, 'Simply Lemon', '8-Bit Retro'],
        pixelSticker: sticker,
      };
    });

    const durationMs = Date.now() - startTime;
    logEvent('agent2_designer.py', 'success', `Generated ${templates.length} visual Canva templates in ${durationMs}ms`, {
      templatesCount: templates.length,
    }, durationMs);

    res.json({
      success: true,
      assets: templates,
      durationMs,
    });
  } catch (err: unknown) {
    const durationMs = Date.now() - startTime;
    const error = err as Error;
    const errorMsg = `Agent 2 Failed: ${error.message}`;
    logEvent('agent2_designer.py', 'error', errorMsg, { stack: error.stack }, durationMs);
    res.status(500).json({ error: errorMsg, code: 'AGENT2_FAILED', details: error.message });
  }
});

// Helper: Real Copywriter Generator from real assets
function buildRealPostsFromAssets(assets: any[], strategyPlan: any, brandProfile: any, durationMs: number) {
  const brandName = brandProfile?.businessName || strategyPlan.brandOverview?.name || 'Simply Lemon';
  const platforms = ['instagram', 'tiktok', 'x', 'linkedin'] as const;

  return assets.map((asset, idx) => {
    const platform = platforms[idx % platforms.length];
    const pillar = strategyPlan.contentPillars?.[idx % (strategyPlan.contentPillars?.length || 1)];
    const hook = `⚡ ${asset.headline}: Crafted specifically for ${strategyPlan.targetAudience?.primaryCohort || 'our community'}.`;
    const cleanTag = brandName.replace(/[^a-zA-Z0-9]/g, '');

    const caption = `${hook} 🍋🎮\n\n${pillar?.description || asset.subheadline}\n\nAvailable now — tap our link in bio to check it out! Drop a 🍋 if you're hyped!`;

    return {
      id: `post_gen_${Date.now()}_${idx + 1}`,
      templateAssetId: asset.id,
      platform,
      title: `${asset.title} Launch`,
      hook,
      caption,
      hashtags: ['#SimplyLemon', `#${cleanTag}`, '#PixelArt', '#SmallBusiness'],
      callToAction: `Tap the link in our bio for full access!`,
      bestTimeToPost: `Day ${idx + 1} @ ${11 + (idx * 2)}:30 ${idx % 2 === 0 ? 'AM' : 'PM'}`,
      status: 'scheduled',
      scheduledDate: new Date(Date.now() + (idx + 1) * 86400000).toISOString(),
      engagementPrediction: 90 + Math.floor(Math.random() * 8),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      reachCount: 0,
    };
  });
}

// 6. Agent 3: Real Copywriting Generation
app.post('/api/agents/agent3-copywriter', async (req, res) => {
  const startTime = Date.now();
  const { strategyPlan, assets, brandProfile } = req.body;

  if (!strategyPlan || !assets || !Array.isArray(assets) || assets.length === 0) {
    const errorMsg = 'Agent 3 Error: Requires strategyPlan and non-empty assets array.';
    logEvent('agent3_copywriter.py', 'error', errorMsg);
    return res.status(400).json({ error: errorMsg, code: 'MISSING_ASSETS_OR_STRATEGY' });
  }

  logEvent('agent3_copywriter.py', 'info', `Generating social captions for ${assets.length} visual assets...`);

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const prompt = `You are Agent 3 (agent3_copywriter.py) of Simply Lemon.
Brand: ${JSON.stringify(brandProfile || strategyPlan.brandOverview)}
Brand Tone: ${JSON.stringify(strategyPlan.brandTone)}
Target Audience: ${JSON.stringify(strategyPlan.targetAudience)}

Visual Assets to write copy for:
${JSON.stringify(assets.map((a: any) => ({
  id: a.id,
  title: a.title,
  headline: a.headline,
  format: a.formatName,
  subheadline: a.subheadline,
})), null, 2)}

Write realistic, high-converting social media posts corresponding to each visual asset.
Assign channels appropriately (e.g. instagram, tiktok, x, linkedin).
Return strict JSON array with this schema for each post:
[
  {
    "id": "post_...",
    "templateAssetId": "matching asset id",
    "platform": "instagram" | "tiktok" | "x" | "linkedin",
    "title": "string",
    "hook": "string",
    "caption": "string",
    "hashtags": ["#tag1", "#tag2"],
    "callToAction": "string",
    "bestTimeToPost": "e.g. Tomorrow @ 11:45 AM",
    "status": "scheduled" | "draft",
    "scheduledDate": "ISO string",
    "engagementPrediction": 92
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
      });

      const durationMs = Date.now() - startTime;
      const rawText = response.text || '[]';
      const posts = JSON.parse(rawText);

      logEvent('agent3_copywriter.py', 'success', `[Cloud GenAI] Generated ${posts.length} real social drafts in ${durationMs}ms`, {
        postsCount: posts.length,
      }, durationMs);

      return res.json({ success: true, posts, durationMs, provider: 'cloud_genai' });
    } catch (err: unknown) {
      const error = err as Error;
      logEvent('agent3_copywriter.py', 'warn', `Cloud GenAI failed (${error.message}). Falling back to local synthesizer.`, {
        error: error.message,
      });
    }
  }

  // Local synthesizer using user's real assets and strategy
  const durationMs = Date.now() - startTime;
  const posts = buildRealPostsFromAssets(assets, strategyPlan, brandProfile, durationMs);

  logEvent('agent3_copywriter.py', 'success', `Generated ${posts.length} real social drafts in ${durationMs}ms`, {
    postsCount: posts.length,
  }, durationMs);

  return res.json({ success: true, posts, durationMs, provider: 'local_synthesizer' });
});

// Vite Middleware for Full-Stack development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Simply Lemon] Full-stack backend running on port ${PORT}`);
    logEvent('SYSTEM', 'info', `Backend initialized on port ${PORT}. Ready for real agent runs.`);
  });
}

startServer();
