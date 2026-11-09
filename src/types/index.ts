/**
 * Simply Lemon Type Definitions
 */

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  connectedAt: string;
}

export interface OnboardingAnswers {
  // 1. Business Name
  businessName: string;
  // 2. Industry / Niche
  industry: string;
  // 3. Location & Reach
  location: string;
  reachType: 'local' | 'regional' | 'global' | 'online_only';
  // 4. Contact & Social Handles
  websiteUrl: string;
  instagramHandle: string;
  supportEmail: string;
  // 5. Brand Colors & Aesthetic
  primaryColor: string;
  secondaryColor: string;
  aestheticStyle: string; // e.g. "Pastel Retro 8-Bit", "Cozy Cottagecore", "Neon Synthwave", "Clean Minimal"
  // 6. Brand Voice & Tone
  brandTone: string; // e.g. "Playful & Cheeky", "Warm & Cozy", "Bold & Hype", "Witty & Sarcastic"
  // 7. Primary Business Goal
  primaryGoal: string; // e.g. "Drive Online Sales", "Build Organic Community", "Go Viral on Reels/TikTok"
  // 8. Core Products & Value Proposition
  coreProducts: string;
  // 9. Target Audience & Demographics
  targetAudience: string;
  // 10. Logo Style / Asset Preference
  logoStyle: string; // e.g. "Pixel Art Sprite", "Retro Badge", "Geometric Modern"
}

export interface ContentPillar {
  title: string;
  percentage: number;
  description: string;
  exampleTopics: string[];
}

export interface StrategyPlan {
  brandOverview: {
    name: string;
    tagline: string;
    mission: string;
    vibeRating: string;
  };
  targetAudience: {
    primaryCohort: string;
    ageRange: string;
    keyInterests: string[];
    corePainPoints: string[];
    buyingMotivations: string[];
  };
  brandTone: {
    voiceStyle: string;
    recommendedEmojis: string[];
    dos: string[];
    donts: string[];
  };
  contentPillars: ContentPillar[];
  marketingRoadmap: {
    week: number;
    phaseName: string;
    focusGoal: string;
    recommendedPostCadence: string;
    tactics: string[];
  }[];
  generatedAt: string;
  scriptVersion: string;
}

export interface CanvaTemplateAsset {
  id: string;
  title: string;
  format: '1080x1080' | '1080x1920' | '1200x630';
  formatName: 'Instagram Square (1:1)' | 'Story & Reels (9:16)' | 'Twitter/LinkedIn Banner (16:9)';
  bgColor: string;
  accentColor: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  layoutType: 'retro-card' | 'pixel-split' | 'quote-badge' | 'product-spotlight';
  canvaTemplateId: string;
  canvaEditUrl: string;
  tags: string[];
  pixelSticker: 'lemon_wink' | 'lemon_cheer' | 'lemon_glasses' | 'sparkle' | 'pixel_heart';
}

export interface GeneratedPost {
  id: string;
  templateAssetId: string;
  platform: 'instagram' | 'tiktok' | 'x' | 'linkedin' | 'pinterest';
  title: string;
  caption: string;
  hashtags: string[];
  hook: string;
  callToAction: string;
  bestTimeToPost: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: string;
  engagementPrediction: number; // 0-100 score
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  reachCount?: number;
}

export interface AgentExecutionState {
  agent1: {
    id: 'agent1_strategy';
    name: 'Agent 1: Strategy Architect';
    file: 'agent1_strategy.py';
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
    logs: string[];
    durationSec: number;
    output: StrategyPlan | null;
  };
  agent2: {
    id: 'agent2_designer';
    name: 'Agent 2: Canva Asset Designer';
    file: 'agent2_designer.py';
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
    logs: string[];
    durationSec: number;
    output: CanvaTemplateAsset[] | null;
  };
  agent3: {
    id: 'agent3_copywriter';
    name: 'Agent 3: Copywriting Engine';
    file: 'agent3_copywriter.py';
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
    logs: string[];
    durationSec: number;
    output: GeneratedPost[] | null;
  };
}

export interface PythonScript {
  filename: string;
  title: string;
  description: string;
  status: 'synced' | 'custom_uploaded' | 'missing';
  agentId: 'agent1' | 'agent2' | 'agent3' | 'config';
  code: string;
  linesCount: number;
  fileSize: string;
  lastModified: string;
  environment: string; // e.g. "uv + python 3.12 + google-genai"
}

export interface BackendHealth {
  status: 'ok' | 'error';
  timestamp: string;
  backend: string;
  environment: {
    hasGeminiApiKey: boolean;
    geminiKeyConfigured: boolean;
    pythonRunner: string;
    activeAgents: string[];
  };
  logsCount: number;
}

export interface BackendLogEntry {
  id: string;
  timestamp: string;
  agent: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: unknown;
  durationMs?: number;
}
