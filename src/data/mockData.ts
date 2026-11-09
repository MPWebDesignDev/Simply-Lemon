import { GoogleUserProfile, OnboardingAnswers, PythonScript } from '../types';

export const INITIAL_USER: GoogleUserProfile = {
  id: 'usr_88291',
  name: 'Alex Morgan',
  email: 'alex.creator@simplylemon.io',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  connectedAt: '2026-11-09T08:30:00Z',
};

export const DEFAULT_ONBOARDING: OnboardingAnswers = {
  businessName: 'Simply Lemon Studio',
  industry: 'Creative Brand & Beverage Lab',
  location: 'Austin, TX & Online Worldwide',
  reachType: 'regional',
  websiteUrl: 'https://simplylemon.io',
  instagramHandle: '@simplylemon.io',
  supportEmail: 'hello@simplylemon.io',
  primaryColor: '#FEF08A',
  secondaryColor: '#86EFAC',
  aestheticStyle: 'Pastel Retro 8-Bit Game HUD',
  brandTone: 'Playful, refreshing, witty, and authentic',
  primaryGoal: 'Drive organic engagement & high-converting social leads',
  coreProducts: 'Cold-pressed citrus sparkling drinks, 8-bit aesthetic merch, and creative community drops',
  targetAudience: 'Digital creators, gamers, and indie consumers (ages 18-35)',
  logoStyle: 'Chubby 8-Bit Pixel Lemon Mascot',
};

export const PYTHON_SCRIPTS: PythonScript[] = [
  {
    filename: 'agent1_strategy.py',
    title: 'Agent 1: Strategy & Marketing Roadmap Architect',
    description: 'Parses the 10 onboarding business inputs using Google GenAI to synthesize target audience personas, brand tone, content pillars, and a 4-week roadmap into strategyplan.json.',
    status: 'synced',
    agentId: 'agent1',
    linesCount: 84,
    fileSize: '3.4 KB',
    lastModified: '2026-11-09 10:12 UTC',
    environment: 'uv + python 3.12 + google-genai + pydantic',
    code: `"""
Simply Lemon - Agent 1: Strategy Architect
Generates strategic brand roadmap & audience intelligence.
Run with: uv run python agent1_strategy.py --input brand_profile.json
"""

import os
import sys
import json
from google import genai
from google.genai import types

def generate_strategy(profile_data: dict) -> dict:
    client = genai.Client()
    
    prompt = f"""
    You are Agent 1 of Simply Lemon, an elite social media brand strategist.
    Given this 10-point brand onboarding profile:
    {json.dumps(profile_data, indent=2)}

    Generate a comprehensive, high-conversion social media marketing plan formatted as strict JSON:
    {{
      "brandOverview": {{
        "name": "{profile_data.get('businessName')}",
        "tagline": "...",
        "mission": "...",
        "vibeRating": "..."
      }},
      "targetAudience": {{
        "primaryCohort": "...",
        "ageRange": "...",
        "keyInterests": ["..."],
        "corePainPoints": ["..."],
        "buyingMotivations": ["..."]
      }},
      "brandTone": {{
        "voiceStyle": "{profile_data.get('brandTone')}",
        "recommendedEmojis": ["..."],
        "dos": ["..."],
        "donts": ["..."]
      }},
      "contentPillars": [
        {{ "title": "...", "percentage": 35, "description": "...", "exampleTopics": ["..."] }},
        {{ "title": "...", "percentage": 25, "description": "...", "exampleTopics": ["..."] }},
        {{ "title": "...", "percentage": 25, "description": "...", "exampleTopics": ["..."] }},
        {{ "title": "...", "percentage": 15, "description": "...", "exampleTopics": ["..."] }}
      ],
      "marketingRoadmap": [
        {{ "week": 1, "phaseName": "Phase 1: ...", "focusGoal": "...", "recommendedPostCadence": "5 posts/week", "tactics": ["..."] }},
        {{ "week": 2, "phaseName": "Phase 2: ...", "focusGoal": "...", "recommendedPostCadence": "6 posts/week", "tactics": ["..."] }},
        {{ "week": 3, "phaseName": "Phase 3: ...", "focusGoal": "...", "recommendedPostCadence": "5 posts/week", "tactics": ["..."] }},
        {{ "week": 4, "phaseName": "Phase 4: ...", "focusGoal": "...", "recommendedPostCadence": "7 posts/week", "tactics": ["..."] }}
      ]
    }}
    Return only valid JSON.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    plan = json.loads(response.text)
    plan["generatedAt"] = "2026-11-09T10:14:00Z"
    plan["scriptVersion"] = "agent1_strategy.py v2.4 (uv)"

    with open("strategyplan.json", "w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2)
        
    print("[Agent 1] Successfully generated strategyplan.json!")
    return plan

if __name__ == "__main__":
    profile_path = sys.argv[1] if len(sys.argv) > 1 else "brand_profile.json"
    with open(profile_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    generate_strategy(data)
`,
  },
  {
    filename: 'agent2_designer.py',
    title: 'Agent 2: Canva API Asset & Template Designer',
    description: 'Reads strategyplan.json, computes color palettes, selects retro 8-bit templates, and interfaces with the Canva REST API to generate social post canvases and pixel banners.',
    status: 'synced',
    agentId: 'agent2',
    linesCount: 92,
    fileSize: '3.8 KB',
    lastModified: '2026-11-09 10:13 UTC',
    environment: 'uv + python 3.12 + httpx + canva-sdk',
    code: `"""
Simply Lemon - Agent 2: Designer (Canva API Integration)
Consumes strategyplan.json and dynamically generates visual templates.
Run with: uv run python agent2_designer.py --strategy strategyplan.json
"""

import os
import sys
import json
import httpx

CANVA_API_KEY = os.getenv("CANVA_API_KEY", "mock_canva_key")

def generate_canva_templates(strategy_file: str = "strategyplan.json"):
    with open(strategy_file, "r", encoding="utf-8") as f:
        strategy = json.load(f)

    brand_name = strategy.get("brandOverview", {}).get("name", "Simply Lemon Brand")
    pillars = strategy.get("contentPillars", [])

    print(f"[Agent 2] Generating visual templates for: {brand_name}")
    
    templates = []
    stickers = ["lemon_cheer", "lemon_wink", "lemon_glasses", "sparkle"]

    for idx, pillar in enumerate(pillars):
        sticker = stickers[idx % len(stickers)]
        template = {
            "id": f"asset_gen_{idx + 1:02d}",
            "title": f"{pillar.get('title')} Graphic",
            "format": "1080x1080" if idx % 2 == 0 else "1080x1920",
            "formatName": "Instagram Square (1:1)" if idx % 2 == 0 else "Story & Reels (9:16)",
            "bgColor": "#FEF08A" if idx % 2 == 0 else "#FEF9C3",
            "accentColor": "#16A34A" if idx == 0 else "#DC2626",
            "badgeText": f"★ {pillar.get('title')[:16].upper()} ★",
            "headline": pillar.get("exampleTopics", ["Level Up Your Brand"])[0].upper(),
            "subheadline": pillar.get("description", "Automated by Simply Lemon"),
            "layoutType": "retro-card",
            "canvaTemplateId": f"cnv_auto_{idx + 100}",
            "canvaEditUrl": f"https://www.canva.com/design/DAF-AUTO-{idx + 1}/edit",
            "tags": [pillar.get("title"), "8-Bit Aesthetic", "Pastel Yellow"],
            "pixelSticker": sticker
        }
        templates.append(template)

    with open("visual_assets.json", "w", encoding="utf-8") as f:
        json.dump(templates, f, indent=2)

    print(f"[Agent 2] Successfully generated {len(templates)} Canva templates into visual_assets.json!")
    return templates

if __name__ == "__main__":
    generate_canva_templates()
`,
  },
  {
    filename: 'agent3_copywriter.py',
    title: 'Agent 3: Copywriter & Viral Caption Engine',
    description: 'Synthesizes visual assets from Agent 2 and strategy roadmap from Agent 1 to author high-converting captions, hooks, hashtags, and schedule suggestions into draft queues.',
    status: 'synced',
    agentId: 'agent3',
    linesCount: 88,
    fileSize: '3.6 KB',
    lastModified: '2026-11-09 10:14 UTC',
    environment: 'uv + python 3.12 + google-genai',
    code: `"""
Simply Lemon - Agent 3: Copywriting Engine
Pairs Canva visual templates with viral captions, hooks, and optimal posting times.
Run with: uv run python agent3_copywriter.py
"""

import os
import sys
import json
from google import genai
from google.genai import types

def generate_social_copies(strategy_file="strategyplan.json", assets_file="visual_assets.json"):
    client = genai.Client()

    with open(strategy_file, "r", encoding="utf-8") as f:
        strategy = json.load(f)

    with open(assets_file, "r", encoding="utf-8") as f:
        assets = json.load(f)

    print(f"[Agent 3] Drafting captions for {len(assets)} visual assets...")

    prompt = f"""
    You are Agent 3: Social Media Copywriter for Simply Lemon.
    Brand Tone: {json.dumps(strategy.get('brandTone'))}
    Target Audience: {json.dumps(strategy.get('targetAudience'))}
    Visual Assets to caption: {json.dumps(assets)}

    Generate a complete scheduled post batch with engaging hooks, body copy, emojis, hashtags, and optimal posting time.
    Format as strict JSON array matching:
    [
      {{
        "id": "post_...",
        "templateAssetId": "asset_gen_01",
        "platform": "instagram",
        "title": "...",
        "hook": "...",
        "caption": "...",
        "hashtags": ["#SimplyLemon", "..."],
        "callToAction": "...",
        "bestTimeToPost": "Today @ 12:30 PM",
        "status": "scheduled",
        "scheduledDate": "2026-11-10T12:30:00Z",
        "engagementPrediction": 92
      }}
    ]
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    posts = json.loads(response.text)
    with open("scheduled_drafts.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, indent=2)

    print(f"[Agent 3] Generated {len(posts)} scheduled drafts into scheduled_drafts.json!")
    return posts

if __name__ == "__main__":
    generate_social_copies()
`,
  },
  {
    filename: 'pyproject.toml',
    title: 'Python UV Package & Project Environment',
    description: 'Ultra-fast Python package declaration for Simply Lemon agent trio with GenAI and Canva integrations.',
    status: 'synced',
    agentId: 'config',
    linesCount: 30,
    fileSize: '1.1 KB',
    lastModified: '2026-11-09 10:10 UTC',
    environment: 'uv package manager',
    code: `[project]
name = "simply-lemon-ai-agents"
version = "0.2.4"
description = "Autonomous 3-Agent Social Media Pipeline for Simply Lemon"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "google-genai>=2.4.0",
    "httpx>=0.28.1",
    "pydantic>=2.10.0",
    "python-dotenv>=1.0.1",
]

[dependency-groups]
dev = [
    "pytest>=8.3.0",
    "ruff>=0.9.0",
]

[tool.uv]
package = true
`,
  },
];
