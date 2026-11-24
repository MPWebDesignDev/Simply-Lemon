/**
 * Simply Lemon - Agent Execution Service
 * Seamlessly executes both:
 * 1. Client-Side in browser for immediate zero-config GitHub Pages
 * 2. Remote REST calls to the FastAPI backend (main.py) on SSH host 100.109.84.6 or local Docker
 */

import { 
  WeeklyStrategyPlan, 
  DesignerOutputSpecs, 
  DesignJob,
  FinalCopyCaptions, 
  CanvaTemplateAsset, 
  GeneratedPost, 
  OnboardingAnswers,
  FullCampaignResponse,
  UploadedPhoto
} from '../types';
import { REAL_WEEKLY_STRATEGY, REAL_DESIGNER_SPECS, REAL_FINAL_CAPTIONS } from '../data/mockData';

export interface Agent1Inputs extends OnboardingAnswers {
  customPromptRules?: string;
  photos?: UploadedPhoto[];
}

export interface Agent2Inputs {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  canvaApiKey?: string;
  bannerbearApiKey?: string;
  customDesignRules?: string;
}

export interface Agent3Inputs {
  targetLanguage: 'pt-PT' | 'pt-BR' | 'en-US' | 'en-GB' | 'es-ES' | 'fr-FR' | string;
  targetPlatforms?: Array<'instagram' | 'tiktok' | 'x' | 'linkedin'>;
  hashtagCount?: number;
  callToActionOverride?: string;
}

// 1. Agent 1: Strategy Execution (Produces weekly_strategy_plan.json)
export function executeAgent1Local(inputs: Agent1Inputs): WeeklyStrategyPlan {
  const brandName = inputs.businessName || 'Simply Lemon';
  const niche = inputs.industry || 'Craft Lemonade & Refreshment Bar';
  const location = inputs.location || 'Lisboa, Portugal';
  const tone = inputs.brandTone || 'Casual, fresh, enthusiastic with emojis';
  const goal = inputs.primaryGoal || 'Drive foot traffic & weekend counter visits';

  return {
    weekly_summary: {
      media_format_insights: `Visual reels and high-contrast stories consistently drive 2.4x higher engagement for ${brandName} than plain static carousels. Promotional weekend highlights deliver peak reach.`,
      peak_audience_times: "Monday evening (18:00 - 20:00), Wednesday lunch window (12:00 - 14:00), and Saturday afternoon (15:00 - 17:00).",
      reputation_and_review_highlights: `Maintaining a 4.8-star customer sentiment in ${location}. Highlights: artisanal slice-to-cup freshness, friendly counter atmosphere, and craft fruit syrups.`
    },
    editorial_calendar: [
      {
        photo_id: "img_01.jpg",
        day: "Monday",
        scheduled_time: "18:30",
        format: "Feed (1080x1080px)",
        content_pillar: "Product Showcase",
        designer_brief: `1:1 Square layout. Emphasize fresh sliced citrus tones (${inputs.primaryColor || '#FFF066'}), rustic texture, with clean watermark logo in bottom-right.`,
        copywriter_brief: `Energetic week-starter post highlighting pure artisanal freshness. Tone: ${tone}. Call to action: 'Stop by and grab your Monday squeeze! 🍋'`
      },
      {
        photo_id: "img_04.jpg",
        day: "Wednesday",
        scheduled_time: "12:30",
        format: "Story (1080x1920px)",
        content_pillar: "Atmosphere / Behind the Scenes",
        designer_brief: `Vertical 9:16 layout. Center in-house syrup preparation with interactive poll sticker zone in top 15% and bottom 20%.`,
        copywriter_brief: `Short sensory storytelling about craft mint syrup made fresh daily. Include interactive poll: 'Minty or Classic? 🌿🍋'`
      },
      {
        photo_id: "img_02.jpg",
        day: "Friday",
        scheduled_time: "17:00",
        format: "Feed (1080x1080px)",
        content_pillar: "Social Proof",
        designer_brief: `1:1 Square golden hour cafe setting with customer smile and 5-star review badge overlay in dark green (#2D5A27).`,
        copywriter_brief: `Celebrate Friday start with authentic 5-star customer review quotes praising rapid counter service and thirst-quenching taste.`
      },
      {
        photo_id: "img_03.jpg",
        day: "Saturday",
        scheduled_time: "15:00",
        format: "Feed (1080x1080px)",
        content_pillar: "Promotion / Special Offer",
        designer_brief: `High-contrast 1:1 promo poster. Bold typography for weekend offer, high urgency banner with bright coral accent (#FF6B6B).`,
        copywriter_brief: `Urgent, mouth-watering weekend promotion driving direct store footfall for ${goal}. CTA: 'Flash this post at the counter for 20% off! ⚡🍋'`
      }
    ],
    ad_strategy: {
      selected_post: "Saturday Promotion (img_03.jpg)",
      target_audience: `Local foodies, students, and young professionals aged 18-38 within 5km radius of ${location}, interested in craft food, cafes, and indie dining.`,
      recommended_budget: "175 EUR",
      campaign_goal: "Store Visits / Foot Traffic Conversions"
    },
    generatedAt: new Date().toISOString()
  };
}

// 2. Agent 2: Designer Execution (Produces designer_output_specs.json & CanvaTemplateAssets)
export function executeAgent2Local(
  strategy: WeeklyStrategyPlan,
  inputs: Agent2Inputs,
  brandName: string
): { specs: DesignerOutputSpecs; assets: CanvaTemplateAsset[] } {
  const primaryColor = inputs.primaryColor || '#FFF066';
  const secondaryColor = inputs.secondaryColor || '#2D5A27';
  const accentColor = inputs.accentColor || '#FF6B6B';

  const design_jobs: DesignJob[] = strategy.editorial_calendar.map((item, idx) => {
    const isSquare = item.format.includes('1080x1080');
    const width = 1080;
    const height = isSquare ? 1080 : 1920;
    const template_id = isSquare ? 'tmpl_bannerbear_feed_1080x1080_v1' : 'tmpl_bannerbear_story_1080x1920_v1';

    const modifications = [
      { name: 'background_image', image_url: item.photo_id },
      { name: 'warm_overlay_color', color: primaryColor },
      { name: 'headline_text', text: item.content_pillar.toUpperCase() },
      { name: 'headline_font', text: 'Montserrat-Bold' },
      { name: 'headline_color', color: idx % 2 === 0 ? secondaryColor : '#1A1A1A' },
      { name: 'subtext', text: item.designer_brief.slice(0, 70) },
      { name: 'subtext_font', text: 'OpenSans-Regular' },
      { name: 'logo_watermark', image_url: 'https://assets.simplylemon.com/logo.png' },
      { name: 'logo_position', text: isSquare ? 'bottom-right' : 'top-center' }
    ];

    if (item.content_pillar.includes('Promotion')) {
      modifications.push(
        { name: 'promo_banner_bg', color: primaryColor },
        { name: 'cta_badge_bg', color: accentColor },
        { name: 'cta_badge_text', text: 'FLASH AT COUNTER' }
      );
    } else if (item.content_pillar.includes('Social Proof')) {
      modifications.push(
        { name: 'review_badge_visible', text: 'true' },
        { name: 'review_rating_stars', text: '★★★★★' },
        { name: 'review_stars_color', color: primaryColor },
        { name: 'review_badge_bg', color: secondaryColor }
      );
    }

    return {
      photo_id: item.photo_id,
      format: item.format,
      template_id,
      dimensions: { width, height },
      modifications,
      rendered_image_url: `https://cdn.mysaas.com/renders/client_8932_${idx + 1}_${item.photo_id}.png`
    };
  });

  const specs: DesignerOutputSpecs = {
    design_jobs,
    generatedAt: new Date().toISOString()
  };

  // Convert to visual CanvaTemplateAssets for preview studio
  const assets: CanvaTemplateAsset[] = design_jobs.map((job, idx) => {
    const isSquare = job.dimensions.height === 1080;
    const headline = job.modifications.find(m => m.name === 'headline_text')?.text || 'SIMPLY LEMON FRESH';
    const subtext = job.modifications.find(m => m.name === 'subtext')?.text || 'Artisanal Craft Refreshment';

    return {
      id: `asset_job_${idx + 1}`,
      title: `${strategy.editorial_calendar[idx]?.day} — ${headline}`,
      format: isSquare ? '1080x1080' : '1080x1920',
      formatName: isSquare ? 'Instagram Square (1:1)' : 'Story & Reels (9:16)',
      bgColor: idx % 2 === 0 ? primaryColor : '#FFFDF0',
      accentColor: secondaryColor,
      badgeText: `★ ${strategy.editorial_calendar[idx]?.content_pillar.toUpperCase()} ★`,
      headline,
      subheadline: subtext,
      layoutType: isSquare ? 'retro-card' : 'pixel-split',
      canvaTemplateId: job.template_id,
      canvaEditUrl: `https://www.canva.com/design/DAF-LEMON-${idx + 1}/edit`,
      tags: [strategy.editorial_calendar[idx]?.content_pillar || 'Simply Lemon', 'Artisanal', 'Retro 8-Bit'],
      pixelSticker: 'lemon_cheer',
      photo_id: job.photo_id,
      rawJob: job
    };
  });

  return { specs, assets };
}

// 3. Agent 3: Copywriter Execution (Produces final_copy_captions.json & GeneratedPosts)
export function executeAgent3Local(
  strategy: WeeklyStrategyPlan,
  inputs: Agent3Inputs,
  brandName: string
): { captionsOutput: FinalCopyCaptions; posts: GeneratedPost[] } {
  const lang = inputs.targetLanguage || 'pt-PT';
  const cleanTag = brandName.replace(/[^a-zA-Z0-9]/g, '');

  const isPT = lang.startsWith('pt');
  const isES = lang.startsWith('es');
  const isFR = lang.startsWith('fr');

  const captions = strategy.editorial_calendar.map((item, idx) => {
    let hook = '';
    let body = '';
    let cta = '';
    let hashtags: string[] = [];

    if (isPT) {
      if (item.content_pillar.includes('Product')) {
        hook = `Começar a semana com a energia no máximo? Temos a fórmula perfeita! 🍋✨`;
        body = `Nada supera o sabor autêntico de citrinos 100% naturais, espremidos no momento para renovar todas as energias. Na ${brandName}, cada copo traz aquela frescura genuína e vibrante.`;
        cta = `E por aí, como fazes o teu reset para a semana? Partilha connosco nos comentários! 👇🍋`;
      } else if (item.content_pillar.includes('Atmosphere')) {
        hook = `A pausa de quarta-feira pede um toque artesanal irresistível! 🌿🍋`;
        body = `Todos os dias preparamos os nossos xaropes artesanais em pequenos lotes aqui na loja. Ingredientes frescos, paciência e a dose certa de hortelã acabada de colher.`;
        cta = `Vota no teu twist favorito: Hortelã ou Clássica? 🗳️👇`;
      } else if (item.content_pillar.includes('Social Proof')) {
        hook = `Sexta-feira chegou e a sede de fim de semana combate-se com qualidade de 5 estrelas! ⭐⭐⭐⭐⭐`;
        body = `«A melhor limonada da cidade e um atendimento super simpático que nos faz sempre querer voltar!» — obrigado pela vossa preferência. Classificação média de 4.8 estrelas!`;
        cta = `Identifica nos comentários a tua companhia de eleição para o refresco de hoje! 💛👇`;
      } else {
        hook = `Sábado de sol combina com oferta exclusiva a transbordar de sabor! ☀️🍋🎉`;
        body = `O fim de semana merece celebração à altura. Só até domingo podes aproveitar a nossa oferta exclusiva de fim de semana em todas as opções artesanais.`;
        cta = `Passa já pela nossa loja ou clica no link da bio para garantir o teu desconto! 🏃💨🍋`;
      }
      hashtags = [`#${cleanTag}`, '#LimonadaArtesanal', '#SumosNaturais', '#LisboaFoodies', '#EnergiaNatural', '#SaborFresco'];
    } else if (isES) {
      hook = `¿Empezar la semana con energía al máximo? ¡Tenemos la fórmula perfecta! 🍋✨`;
      body = `Nada supera el sabor auténtico de cítricos 100% naturales exprimidos al momento en ${brandName}.`;
      cta = `¡Pásate por nuestra tienda y disfruta de tu zumo recién exprimido! 👇🍋`;
      hashtags = [`#${cleanTag}`, '#LimonadaArtesanal', '#ZumosNaturales', '#SaborFresco', '#EnergiaNatural'];
    } else if (isFR) {
      hook = `Faites le plein d'énergie naturelle pour bien commencer la semaine ! 🍋✨`;
      body = `Rien ne vaut la fraîcheur authentique de nos citrons pressés minute chez ${brandName}.`;
      cta = `Venez goûter notre recette artisanale dès aujourd'hui ! 👇🍋`;
      hashtags = [`#${cleanTag}`, '#LimonadeArtisanale', '#JusFrais', '#FaitMaison'];
    } else {
      // English default
      hook = `Kick off the week with pure citrus power! 🍋✨`;
      body = `Nothing beats 100% all-natural craft lemonades made fresh to order right here at ${brandName}.`;
      cta = `Stop by our counter today and grab your fresh squeeze! 👇🍋`;
      hashtags = [`#${cleanTag}`, '#CraftLemonade', '#FreshSqueezed', '#ArtisanalDrinks', '#LocalCafe'];
    }

    if (inputs.callToActionOverride) {
      cta = inputs.callToActionOverride;
    }

    const full_text = `${hook}\n\n${body}\n\n${cta}\n\n${hashtags.join(' ')}`;

    return {
      photo_id: item.photo_id,
      day: item.day,
      format: item.format,
      hook,
      caption_body: body,
      call_to_action: cta,
      hashtags,
      full_text,
      is_approved: idx % 2 === 0 ? 1 : 0
    };
  });

  const captionsOutput: FinalCopyCaptions = {
    detected_language: lang,
    captions,
    generatedAt: new Date().toISOString()
  };

  const platforms: GeneratedPost['platform'][] = inputs.targetPlatforms?.length ? inputs.targetPlatforms : ['instagram', 'tiktok', 'x', 'linkedin'];

  const posts: GeneratedPost[] = captions.map((cap, idx) => {
    const platform = platforms[idx % platforms.length] || 'instagram';
    return {
      id: `post_real_${Date.now()}_${idx + 1}`,
      templateAssetId: `asset_job_${idx + 1}`,
      photo_id: cap.photo_id,
      platform,
      title: `${cap.day} — ${strategy.editorial_calendar[idx]?.content_pillar}`,
      caption: cap.caption_body,
      hook: cap.hook,
      callToAction: cap.call_to_action,
      hashtags: cap.hashtags,
      day: cap.day,
      format: cap.format,
      full_text: cap.full_text,
      bestTimeToPost: `${cap.day} @ ${strategy.editorial_calendar[idx]?.scheduled_time || '18:00'}`,
      status: cap.is_approved ? 'scheduled' : 'draft',
      scheduledDate: new Date(Date.now() + (idx + 1) * 86400000).toISOString(),
      engagementPrediction: 94 + (idx % 5),
      is_approved: cap.is_approved || 0
    };
  });

  return { captionsOutput, posts };
}

// 4. Remote FastAPI Integration Helpers (Connects to SSH 100.109.84.6 / main.py)
export async function checkFastAPIHealth(baseUrl: string): Promise<{ ok: boolean; data?: any; error?: string }> {
  try {
    const cleanUrl = baseUrl.replace(/\/$/, '');
    const res = await fetch(`${cleanUrl}/`, { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, data };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Cannot reach FastAPI backend' };
  }
}

export async function fetchStrategyFromFastAPI(baseUrl: string): Promise<WeeklyStrategyPlan> {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const res = await fetch(`${cleanUrl}/gerar-estrategia`, { method: 'GET' });
  if (!res.ok) throw new Error(`FastAPI Error: HTTP ${res.status}`);
  const json = await res.json();
  return json.dados as WeeklyStrategyPlan;
}

export async function fetchFullCampaignFromFastAPI(baseUrl: string): Promise<FullCampaignResponse> {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const res = await fetch(`${cleanUrl}/gerar-campanha-completa`, { method: 'GET' });
  if (!res.ok) throw new Error(`FastAPI Pipeline Error: HTTP ${res.status}`);
  return await res.json();
}

export async function createPhotoBatchFastAPI(baseUrl: string, brandId: number, imagesPaths: string[]) {
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const res = await fetch(`${cleanUrl}/photo-batches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_id: brandId, images_paths: imagesPaths })
  });
  if (!res.ok) throw new Error(`FastAPI PhotoBatch Error: HTTP ${res.status}`);
  return await res.json();
}
