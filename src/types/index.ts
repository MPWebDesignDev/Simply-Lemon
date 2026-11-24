/**
 * Simply Lemon Type Definitions
 * Exact alignment with Python bot engine:
 * - agent1_strategy.py -> weekly_strategy_plan.json
 * - agent2_designer.py -> designer_output_specs.json
 * - agent3_copywriter.py -> final_copy_captions.json
 * - main.py FastAPI routes & SQLAlchemy models (BrandProfile, PhotoBatch, GeneratedPost, CampaignModel)
 */

export interface GoogleUserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  connectedAt: string;
}

// Ingested Photo Item in PhotoBatch
export interface UploadedPhoto {
  photo_id: string;
  description: string;
  previewUrl?: string;
  aspectRatio?: '1:1' | '9:16' | '16:9';
}

// 1. Agent 1: Strategy Architect Outputs (weekly_strategy_plan.json)
export interface WeeklySummary {
  media_format_insights: string;
  peak_audience_times: string;
  reputation_and_review_highlights: string;
}

export interface EditorialCalendarItem {
  photo_id: string;
  day: string;
  scheduled_time: string;
  format: 'Feed (1080x1080px)' | 'Story (1080x1920px)' | string;
  content_pillar: string;
  designer_brief: string;
  copywriter_brief: string;
}

export interface AdStrategy {
  selected_post: string;
  target_audience: string;
  recommended_budget: string;
  campaign_goal: string;
}

export interface WeeklyStrategyPlan {
  weekly_summary: WeeklySummary;
  editorial_calendar: EditorialCalendarItem[];
  ad_strategy: AdStrategy;
  generatedAt?: string;
}

// Backwards-compatible alias for existing UI hooks
export type StrategyPlan = WeeklyStrategyPlan;

// 2. Agent 2: Designer Engine Outputs (designer_output_specs.json)
export interface LayerModification {
  name: string;
  text?: string;
  image_url?: string;
  color?: string;
}

export interface DesignJob {
  photo_id: string;
  format: 'Feed (1080x1080px)' | 'Story (1080x1920px)' | string;
  template_id: string;
  dimensions: {
    width: number;
    height: number;
  };
  modifications: LayerModification[];
  rendered_image_url?: string;
}

export interface DesignerOutputSpecs {
  design_jobs: DesignJob[];
  generatedAt?: string;
}

// Compatibility helper representing a design preview card
export interface CanvaTemplateAsset {
  id: string;
  title: string;
  format: '1080x1080' | '1080x1920' | '1200x630';
  formatName: string;
  bgColor: string;
  accentColor: string;
  badgeText: string;
  headline: string;
  subheadline: string;
  layoutType: string;
  canvaTemplateId: string;
  canvaEditUrl: string;
  tags: string[];
  pixelSticker?: string;
  photo_id?: string;
  rawJob?: DesignJob;
}

// 3. Agent 3: Copywriting Engine Outputs (final_copy_captions.json)
export interface CaptionItem {
  photo_id: string;
  day: string;
  format: string;
  hook: string;
  caption_body: string;
  call_to_action: string;
  hashtags: string[];
  full_text: string;
  is_approved?: number; // 0 or 1 from models.py
  database_id?: number;
}

export interface FinalCopyCaptions {
  detected_language: 'pt-PT' | 'pt-BR' | 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | string;
  captions: CaptionItem[];
  generatedAt?: string;
}

// Unified post representation for the Scheduler & Queue
export interface GeneratedPost {
  id: string;
  templateAssetId: string;
  photo_id: string;
  platform: 'instagram' | 'tiktok' | 'x' | 'linkedin' | 'pinterest';
  title: string;
  caption: string;
  hashtags: string[];
  hook: string;
  callToAction: string;
  bestTimeToPost: string;
  day: string;
  format: string;
  full_text: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: string;
  engagementPrediction: number; // 0-100 score
  is_approved: number; // 0 = Pending, 1 = Approved
  likesCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  reachCount?: number;
}

// Fast API Full Campaign Response (from /gerar-campanha-completa)
export interface FullCampaignResponse {
  status: 'sucesso' | 'erro';
  database_id?: number;
  campanha_completa: {
    estrategia_geral: WeeklyStrategyPlan;
    especificacoes_visuais: DesignerOutputSpecs;
    textos_publicacoes: FinalCopyCaptions;
  };
}

// Brand DNA and Onboarding
export interface BrandProfileModel {
  id?: number;
  brand_name: string;
  color_palette: string; // Ex: "#FFF066, #2D5A27, #FF6B6B"
  brand_voice: string;   // Ex: "Casual, fresco, entusiasta com emojis"
  target_language?: 'pt-PT' | 'pt-BR' | 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR';
  instagram_token?: string;
  logo_url?: string;
  niche?: string;
  target_location?: string;
}

export interface OnboardingAnswers {
  businessName: string;
  industry: string;
  location: string;
  reachType: 'local' | 'regional' | 'global' | 'online_only';
  websiteUrl: string;
  instagramHandle: string;
  supportEmail: string;
  primaryColor: string;
  secondaryColor: string;
  aestheticStyle: string;
  brandTone: string;
  primaryGoal: string;
  coreProducts: string;
  targetAudience: string;
  logoStyle: string;
  targetLanguage?: 'pt-PT' | 'pt-BR' | 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR';
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
    host?: string;
    databaseConnected?: boolean;
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

export interface PythonScript {
  filename: string;
  title: string;
  description: string;
  status: 'synced' | 'custom_uploaded' | 'missing';
  agentId: 'agent1' | 'agent2' | 'agent3' | 'config' | 'database';
  code: string;
  linesCount: number;
  fileSize: string;
  lastModified: string;
  environment: string;
}
