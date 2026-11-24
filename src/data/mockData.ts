import { 
  GoogleUserProfile, 
  OnboardingAnswers, 
  PythonScript, 
  WeeklyStrategyPlan, 
  DesignerOutputSpecs, 
  FinalCopyCaptions,
  UploadedPhoto
} from '../types';

export const INITIAL_USER: GoogleUserProfile = {
  id: 'usr_88291',
  name: 'Miguel',
  email: 'mpwebdesign9@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  connectedAt: '2026-11-10T08:30:00Z',
};

export const DEFAULT_PHOTOS: UploadedPhoto[] = [
  { photo_id: 'img_01.jpg', description: 'Fresh lemons sliced on a wooden counter', aspectRatio: '1:1' },
  { photo_id: 'img_02.jpg', description: 'Customer holding iced signature lemonade in store', aspectRatio: '1:1' },
  { photo_id: 'img_03.jpg', description: 'Special Weekend Promo banner graphic', aspectRatio: '1:1' },
  { photo_id: 'img_04.jpg', description: 'Team member preparing fresh mint syrup', aspectRatio: '9:16' },
];

export const DEFAULT_ONBOARDING: OnboardingAnswers = {
  businessName: 'Simply Lemon',
  industry: 'Craft Lemonade & Refreshment Bar',
  location: 'Lisboa, Portugal',
  reachType: 'local',
  websiteUrl: 'https://simplylemon.com',
  instagramHandle: '@simplylemon.lisboa',
  supportEmail: 'mpwebdesign9@gmail.com',
  primaryColor: '#FFF066',
  secondaryColor: '#2D5A27',
  aestheticStyle: 'Artisanal Fresh & 8-Bit Retro HUD',
  brandTone: 'Casual, fresh, enthusiastic with emojis',
  primaryGoal: 'Drive foot traffic & weekend counter visits',
  coreProducts: 'Fresh hand-squeezed citrus drinks, in-house mint syrups, signature iced refreshments',
  targetAudience: 'Local foodies, students, and young professionals aged 18-38 in Lisboa',
  logoStyle: 'Chubby 8-Bit Pixel Lemon Mascot',
  targetLanguage: 'pt-PT',
};

// Real Output from agent1_strategy.py -> weekly_strategy_plan.json
export const REAL_WEEKLY_STRATEGY: WeeklyStrategyPlan = {
  weekly_summary: {
    media_format_insights: "Reels and high-impact visual formats continue to dominate engagement, with promotional and product showcase content delivering superior engagement rates (10.1% and 8.5% respectively) compared to static carousel posts.",
    peak_audience_times: "Highest audience receptivity concentrates around Monday evening (18:00 - 20:00), Wednesday lunch window (12:00 - 14:00), and Saturday afternoon (15:00 - 17:00).",
    reputation_and_review_highlights: "Maintaining an excellent 4.8 rating across 12 new reviews, driven by strong positive customer sentiment regarding fresh artisanal ingredients, unique flavor profiles, and rapid counter service."
  },
  editorial_calendar: [
    {
      photo_id: "img_01.jpg",
      day: "Monday",
      scheduled_time: "18:30",
      format: "Feed (1080x1080px)",
      content_pillar: "Product Showcase",
      designer_brief: "Crop to 1:1 square. Apply a vibrant, high-contrast color grade emphasizing the natural yellow citrus tones and rustic wood grain texture. Add a subtle, clean brand logo watermark in the bottom-right corner.",
      copywriter_brief: "Write an energetic opening post for the week highlighting hand-crafted freshness and pure ingredients. Tone: Casual, upbeat, and refreshing. CTA: 'Stop by and grab your Monday squeeze! 🍋'"
    },
    {
      photo_id: "img_04.jpg",
      day: "Wednesday",
      scheduled_time: "12:30",
      format: "Story (1080x1920px)",
      content_pillar: "Atmosphere / Behind the Scenes",
      designer_brief: "Vertical 9:16 layout. Center the syrup-making action with dynamic framing. Reserve top 15% and bottom 20% for Instagram story stickers, poll overlays, and text containers.",
      copywriter_brief: "Craft quick, punchy story text demonstrating our house-made mint syrup process. Tone: Fresh and sensory. Include an interactive poll suggestion: 'Minty or Classic? 🌿🍋'"
    },
    {
      photo_id: "img_02.jpg",
      day: "Friday",
      scheduled_time: "17:00",
      format: "Feed (1080x1080px)",
      content_pillar: "Social Proof",
      designer_brief: "Square 1:1 framing centered on the iced beverage and genuine customer smile. Enhance lighting to evoke an inviting golden-hour cafe vibe with soft depth of field.",
      copywriter_brief: "Celebrate Friday kickoffs with authentic customer vibes. Quote or reference recent 5-star Google review sentiment regarding fast service and thirst-quenching taste. CTA: 'Tag your Friday refreshment buddy below! 👇'"
    },
    {
      photo_id: "img_03.jpg",
      day: "Saturday",
      scheduled_time: "15:00",
      format: "Feed (1080x1080px)",
      content_pillar: "Promotion / Special Offer",
      designer_brief: "Bold 1:1 promotional graphic. High-contrast typography with clear hierarchy for the weekend offer terms. Ensure core promotional text sits cleanly within the 80% inner safe area.",
      copywriter_brief: "High-urgency, enthusiastic weekend promo announcement capitalizing on peak Saturday footfall. Emphasize limited availability. CTA: 'Flash this post at the counter for 20% off your second cup! ⚡🍋'"
    }
  ],
  ad_strategy: {
    selected_post: "Saturday Promotion (img_03.jpg)",
    target_audience: "Local foodies, students, and young professionals aged 18-38 within a 5-mile radius of the store, interested in craft beverages, local cafes, and casual dining.",
    recommended_budget: "175 EUR",
    campaign_goal: "Store Visits / Foot Traffic Conversions"
  },
  generatedAt: "2026-11-10T08:40:00Z"
};

// Real Output from agent2_designer.py -> designer_output_specs.json
export const REAL_DESIGNER_SPECS: DesignerOutputSpecs = {
  design_jobs: [
    {
      photo_id: "img_01.jpg",
      format: "Feed (1080x1080px)",
      template_id: "tmpl_bannerbear_feed_1080x1080_v1",
      dimensions: {
        width: 1080,
        height: 1080
      },
      modifications: [
        { name: "background_image", image_url: "img_01.jpg" },
        { name: "warm_overlay_color", color: "#FFF066" },
        { name: "warm_overlay_opacity", text: "0.12" },
        { name: "headline_text", text: "100% NATURAL & FRESHLY SQUEEZED" },
        { name: "headline_font", text: "Montserrat-Bold" },
        { name: "headline_color", color: "#2D5A27" },
        { name: "subtext", text: "Pure citrus energy to fuel your week." },
        { name: "subtext_font", text: "OpenSans-Regular" },
        { name: "subtext_color", color: "#1A1A1A" },
        { name: "logo_watermark", image_url: "https://assets.simplylemon.com/logo.png" },
        { name: "logo_position", text: "bottom-right" }
      ]
    },
    {
      photo_id: "img_04.jpg",
      format: "Story (1080x1920px)",
      template_id: "tmpl_bannerbear_story_1080x1920_v1",
      dimensions: {
        width: 1080,
        height: 1920
      },
      modifications: [
        { name: "background_image", image_url: "img_04.jpg" },
        { name: "headline_text", text: "HANDCRAFTED IN-HOUSE DAILY" },
        { name: "headline_font", text: "Montserrat-Bold" },
        { name: "headline_color", color: "#FFF066" },
        { name: "sticker_zone_placeholder", text: "VOTE: Mint or Classic?" },
        { name: "sticker_zone_bg", color: "#2D5A27" },
        { name: "interactive_accent_color", color: "#FF6B6B" },
        { name: "logo_image", image_url: "https://assets.simplylemon.com/logo.png" },
        { name: "logo_position", text: "top-center" }
      ]
    },
    {
      photo_id: "img_02.jpg",
      format: "Feed (1080x1080px)",
      template_id: "tmpl_bannerbear_feed_1080x1080_v1",
      dimensions: {
        width: 1080,
        height: 1080
      },
      modifications: [
        { name: "background_image", image_url: "img_02.jpg" },
        { name: "background_blur", text: "soft" },
        { name: "review_badge_visible", text: "true" },
        { name: "review_rating_stars", text: "★★★★★" },
        { name: "review_stars_color", color: "#FFF066" },
        { name: "review_badge_bg", color: "#2D5A27" },
        { name: "quote_text", text: "“The crispest refreshment and friendliest service in town!”" },
        { name: "quote_font", text: "Montserrat-Bold" },
        { name: "quote_color", color: "#1A1A1A" },
        { name: "logo_image", image_url: "https://assets.simplylemon.com/logo.png" },
        { name: "logo_position", text: "bottom-right" }
      ]
    },
    {
      photo_id: "img_03.jpg",
      format: "Feed (1080x1080px)",
      template_id: "tmpl_bannerbear_feed_1080x1080_v1",
      dimensions: {
        width: 1080,
        height: 1080
      },
      modifications: [
        { name: "background_image", image_url: "img_03.jpg" },
        { name: "promo_banner_bg", color: "#FFF066" },
        { name: "headline_text", text: "WEEKEND EXCLUSIVE OFFER" },
        { name: "headline_font", text: "Montserrat-Bold" },
        { name: "headline_color", color: "#1A1A1A" },
        { name: "cta_badge_bg", color: "#FF6B6B" },
        { name: "cta_badge_text", text: "CLAIM IN BIO" },
        { name: "cta_badge_font", text: "Montserrat-Bold" },
        { name: "cta_badge_text_color", color: "#FFFFFF" },
        { name: "secondary_accent_color", color: "#2D5A27" },
        { name: "logo_image", image_url: "https://assets.simplylemon.com/logo.png" },
        { name: "logo_position", text: "top-right" }
      ]
    }
  ],
  generatedAt: "2026-11-10T08:41:00Z"
};

// Real Output from agent3_copywriter.py -> final_copy_captions.json
export const REAL_FINAL_CAPTIONS: FinalCopyCaptions = {
  detected_language: "pt-PT",
  captions: [
    {
      photo_id: "img_01.jpg",
      day: "Monday",
      format: "Feed (1080x1080px)",
      hook: "Começar a semana com a energia no máximo? Temos a fórmula perfeita! 🍋✨",
      caption_body: "Nada supera o sabor autêntico de citrinos 100% naturais, espremidos no momento para renovar todas as energias. Na Simply Lemon, cada copo traz aquela frescura genuína e vibrante que transforma qualquer início de semana num momento revigorante.",
      call_to_action: "E por aí, como fazes o teu reset para a semana? Partilha connosco nos comentários! 👇🍋",
      hashtags: [
        "#SimplyLemonLisboa",
        "#LimonadaArtesanal",
        "#SumosNaturais",
        "#LisboaFresco",
        "#EnergiaNatural",
        "#CitrinosFrescos"
      ],
      full_text: "Começar a semana com a energia no máximo? Temos a fórmula perfeita! 🍋✨\n\nNada supera o sabor autêntico de citrinos 100% naturais, espremidos no momento para renovar todas as energias. Na Simply Lemon, cada copo traz aquela frescura genuína e vibrante que transforma qualquer início de semana num momento revigorante.\n\nE por aí, como fazes o teu reset para a semana? Partilha connosco nos comentários! 👇🍋\n\n#SimplyLemonLisboa #LimonadaArtesanal #SumosNaturais #LisboaFresco #EnergiaNatural #CitrinosFrescos",
      is_approved: 1
    },
    {
      photo_id: "img_04.jpg",
      day: "Wednesday",
      format: "Story (1080x1920px)",
      hook: "A pausa de quarta-feira pede um toque artesanal irresistível! 🌿🍋",
      caption_body: "Todos os dias preparamos os nossos xaropes artesanais em pequenos lotes aqui na loja. Ingredientes frescos, paciência e a dose certa de hortelã acabada de colher para elevar o teu dia.",
      call_to_action: "Vota no teu twist favorito: Hortelã ou Clássica? 🗳️👇",
      hashtags: [
        "#SimplyLemon",
        "#XaropeArtesanal",
        "#HortelaFresca",
        "#PausaDeAlmoço",
        "#LisboaCool",
        "#BebidasArtesanais"
      ],
      full_text: "A pausa de quarta-feira pede um toque artesanal irresistível! 🌿🍋\n\nTodos os dias preparamos os nossos xaropes artesanais em pequenos lotes aqui na loja. Ingredientes frescos, paciência e a dose certa de hortelã acabada de colher para elevar o teu dia.\n\nVota no teu twist favorito: Hortelã ou Clássica? 🗳️👇\n\n#SimplyLemon #XaropeArtesanal #HortelaFresca #PausaDeAlmoço #LisboaCool #BebidasArtesanais",
      is_approved: 0
    },
    {
      photo_id: "img_02.jpg",
      day: "Friday",
      format: "Feed (1080x1080px)",
      hook: "Sexta-feira chegou e a sede de fim de semana combate-se com qualidade de 5 estrelas! ⭐⭐⭐⭐⭐",
      caption_body: "«A melhor limonada de Lisboa e um atendimento super simpático que nos faz sempre querer voltar!» — obrigado pelas vossas palavras no Google. Com 4.8 estrelas de classificação média, a nossa equipa não esconde o orgulho em servir-te a frescura mais crocante da cidade.",
      call_to_action: "Identifica nos comentários a tua companhia de eleição para o refresco de hoje! 💛👇",
      hashtags: [
        "#SimplyLemonLisboa",
        "#SextaFeiraLisboa",
        "#LimonadaPerfeita",
        "#AtendimentoComSorriso",
        "#LisboaFoodies",
        "#FimDeSemanaALembrar"
      ],
      full_text: "Sexta-feira chegou e a sede de fim de semana combate-se com qualidade de 5 estrelas! ⭐⭐⭐⭐⭐\n\n«A melhor limonada de Lisboa e um atendimento super simpático que nos faz sempre querer voltar!» — obrigado pelas vossas palavras no Google. Com 4.8 estrelas de classificação média, a nossa equipa não esconde o orgulho em servir-te a frescura mais crocante da cidade.\n\nIdentifica nos comentários a tua companhia de eleição para o refresco de hoje! 💛👇\n\n#SimplyLemonLisboa #SextaFeiraLisboa #LimonadaPerfeita #AtendimentoComSorriso #LisboaFoodies #FimDeSemanaALembrar",
      is_approved: 1
    },
    {
      photo_id: "img_03.jpg",
      day: "Saturday",
      format: "Feed (1080x1080px)",
      hook: "Sábado de sol combina com oferta exclusiva a transbordar de sabor! ☀️🍋🎉",
      caption_body: "O fim de semana merece celebração à altura. Só até domingo podes aproveitar a nossa oferta exclusiva de fim de semana em todas as opções de assinatura. É fresca, cítrica e feita a pensar no teu descanso!",
      call_to_action: "Passa já pela nossa loja ou clica no link da bio para garantir o teu voucher exclusivo! 🏃💨🍋",
      hashtags: [
        "#SimplyLemon",
        "#SabadoLisboa",
        "#OfertaFimDeSemana",
        "#LisboaDrinks",
        "#DescontoExclusivo",
        "#VeraoOAnoTodo"
      ],
      full_text: "Sábado de sol combina com oferta exclusiva a transbordar de sabor! ☀️🍋🎉\n\nO fim de semana merece celebração à altura. Só até domingo podes aproveitar a nossa oferta exclusiva de fim de semana em todas as opções de assinatura. É fresca, cítrica e feita a pensar no teu descanso!\n\nPassa já pela nossa loja ou clica no link da bio para garantir o teu voucher exclusivo! 🏃💨🍋\n\n#SimplyLemon #SabadoLisboa #OfertaFimDeSemana #LisboaDrinks #DescontoExclusivo #VeraoOAnoTodo",
      is_approved: 0
    }
  ],
  generatedAt: "2026-11-10T08:42:00Z"
};

export const PYTHON_SCRIPTS: PythonScript[] = [
  {
    filename: 'agent1_strategy.py',
    title: 'Agent 1: Strategy (Maestro Agent)',
    description: 'Evaluates Meta Graph API metrics, Google Business Reviews (4.8 stars), photo batches, and generates weekly_strategy_plan.json using gemini-3.8-flash.',
    status: 'synced',
    agentId: 'agent1',
    linesCount: 156,
    fileSize: '4.8 KB',
    lastModified: '2026-11-10 08:30 UTC',
    environment: 'uv + python 3.14 + google-genai + gemini-3.8-flash',
    code: `import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ServerError

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

SYSTEM_INSTRUCTION = """
You are "Agent 1 — Strategy" (Maestro Agent), the central decision-making intelligence for a B2B Micro-SaaS social media management platform.

Your primary responsibilities:
1. Analytics Processing: Evaluate performance metrics from Meta Graph API (reach, engagement, peak audience times) and Google Business API (ratings, reviews).
2. Photo Batch Categorization: Organize uploaded photo batches into content pillars (Product Showcase, Atmosphere, Promotions, Social Proof).
3. Strategic Decisions:
- Determine optimal weekly post volume, publishing days, and time slots.
- Assign content dimensions: Feed (1080x1080px) vs Story (1080x1920px).
- Select high-performing organic posts to boost with paid ads and allocate weekly budgets.
4. Downstream Handoff: Provide precise visual guidelines for Agent 2 (Designer) and messaging briefs for Agent 3 (Copywriter).

You MUST return your response strictly as a clean JSON object following the requested format.
"""

def run_strategy_agent():
    # Evaluates weekly_metrics and returns weekly_strategy_plan.json
    ...
`
  },
  {
    filename: 'agent2_designer.py',
    title: 'Agent 2: Designer (Visual Layout Engine)',
    description: 'Translates editorial calendar briefs into precise template modification payloads for Bannerbear/Placid image rendering APIs, outputting designer_output_specs.json.',
    status: 'synced',
    agentId: 'agent2',
    linesCount: 172,
    fileSize: '5.2 KB',
    lastModified: '2026-11-10 08:32 UTC',
    environment: 'uv + python 3.14 + bannerbear/requests',
    code: `import os
import json
import requests
from dotenv import load_dotenv
from google import genai

SYSTEM_INSTRUCTION = """
You are "Agente 2 — Designer", an expert social media graphics and visual design intelligence.
Translate high-level designer briefs from Agente 1 (Strategy) into exact template modification objects.
"""

client_brand_profile = {
    "client_id": "client_8932",
    "brand_name": "Simply Lemon",
    "logo_url": "https://assets.simplylemon.com/logo.png",
    "brand_colors": {
        "primary": "#FFF066",
        "secondary": "#2D5A27",
        "accent": "#FF6B6B",
        "text_dark": "#1A1A1A"
    }
}
`
  },
  {
    filename: 'agent3_copywriter.py',
    title: 'Agent 3: Copywriting Engine',
    description: 'Drafts localized social media captions in Portuguese (pt-PT / pt-BR), English, Spanish, or French with hooks, CTAs, and hashtags, outputting final_copy_captions.json.',
    status: 'synced',
    agentId: 'agent3',
    linesCount: 148,
    fileSize: '4.6 KB',
    lastModified: '2026-11-10 08:34 UTC',
    environment: 'uv + python 3.14 + localized prompts',
    code: `LANGUAGE_GUIDELINES = {
    "pt-PT": "European Portuguese (PT-PT). Use strict European vocabulary (e.g., 'equipa', 'ecrã', 'contacte-nos').",
    "pt-BR": "Brazilian Portuguese (PT-BR).",
    "en-US": "American English (EN-US).",
    "es-ES": "European Spanish (ES-ES).",
    "fr-FR": "French (FR-FR)."
}

def run_copywriting_agent(user_language="pt-PT", strategy_plan=None):
    ...
`
  },
  {
    filename: 'main.py',
    title: 'FastAPI Backend & Pipeline Assembly Line',
    description: 'Runs the full pipeline /gerar-campanha-completa (Agent 1 -> Agent 2 -> Agent 3) and persists campaigns and photo batches into PostgreSQL.',
    status: 'synced',
    agentId: 'config',
    linesCount: 110,
    fileSize: '3.9 KB',
    lastModified: '2026-11-10 08:35 UTC',
    environment: 'FastAPI + Uvicorn + SQLAlchemy',
    code: `from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
import models

app = FastAPI(title="Simply Lemon API")

@app.get("/gerar-campanha-completa")
def gerar_campanha_completa(db: Session = Depends(get_db)):
    # 1. Agente 1 (Strategy)
    # 2. Agente 2 (Designer)
    # 3. Agente 3 (Copywriter)
    # 4. Save to PostgreSQL
    ...
`
  },
  {
    filename: 'models.py',
    title: 'SQLAlchemy Database Models',
    description: 'PostgreSQL relational schemas: BrandProfile, PhotoBatch, GeneratedPost, CampaignModel.',
    status: 'synced',
    agentId: 'database',
    linesCount: 45,
    fileSize: '1.8 KB',
    lastModified: '2026-11-10 08:28 UTC',
    environment: 'SQLAlchemy 2.0',
    code: `from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from database import Base

class BrandProfile(Base):
    __tablename__ = "brand_profiles"
    id = Column(Integer, primary_key=True)
    brand_name = Column(String)
    color_palette = Column(String)
    brand_voice = Column(String)

class PhotoBatch(Base):
    __tablename__ = "photo_batches"
    id = Column(Integer, primary_key=True)
    images_paths = Column(Text)

class GeneratedPost(Base):
    __tablename__ = "generated_posts"
    caption = Column(Text)
    is_approved = Column(Integer, default=0)
`
  }
];
