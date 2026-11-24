import os
import json
import time
import requests
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ServerError

# 1. Environment & API Client Initialization
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is missing from your .env file.")

client = genai.Client(api_key=api_key)

# 2. System Instruction for Agente 2 — Designer
SYSTEM_INSTRUCTION = """
You are "Agente 2 — Designer", an expert social media graphics and visual design intelligence.

Your responsibilities:
1. Visual Brief Translation: Convert high-level designer briefs from Agente 1 (Strategy) into exact template modification objects for dynamic image generation APIs (e.g., Bannerbear/Placid).
2. Format Adaptation: Ensure design layouts are strictly tailored to target dimensions:
- Instagram Feed: 1080x1080px (Square)
- Instagram Story: 1080x1920px (Vertical)
3. Brand Consistency: Apply client brand guidelines precisely (primary/secondary hex colors, font styles, logo placement, overlay opacity).
4. Output Format: Always return your response strictly as a clean JSON object containing the finalized layout specs for each scheduled post.
"""

# 3. Client Brand Profile & Template Configuration
client_brand_profile = {
    "client_id": "client_8932",
    "brand_name": "Simply Lemon",
    "logo_url": "https://assets.simplylemon.com/logo.png",
    "brand_colors": {
        "primary": "#FFF066",       # Lemon Yellow
        "secondary": "#2D5A27",     # Dark Green
        "accent": "#FF6B6B",        # Coral Accent
        "text_dark": "#1A1A1A"
    },
    "typography": {
        "heading": "Montserrat-Bold",
        "body": "OpenSans-Regular"
    },
    "template_ids": {
        "feed_square": "tmpl_bannerbear_feed_1080x1080_v1",
        "story_vertical": "tmpl_bannerbear_story_1080x1920_v1"
    }
}

# 4. Utility Function to Load Strategy Output from Agente 1
def load_strategy_plan() -> dict:
    filename = "weekly_strategy_plan.json"
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return json.load(f)
    
    return {
        "editorial_calendar": [
            {
                "photo_id": "img_01.jpg",
                "day": "Wednesday",
                "scheduled_time": "12:00",
                "format": "Feed (1080x1080px)",
                "content_pillar": "Product Showcase",
                "designer_brief": "Framed photo of fresh lemons. Add bright yellow banner with dark green headline: '100% Natural Freshness'. Include logo at top right."
            }
        ]
    }


def generate_design_specifications(strategy_plan: dict) -> str:
    prompt = f"""
    Analyze the following brand profile and editorial calendar. Translate each post's brief into exact template modification payloads for design rendering:

    Brand DNA Profile:
    {json.dumps(client_brand_profile, indent=2)}

    Editorial Calendar & Strategy Briefs:
    {json.dumps(strategy_plan.get("editorial_calendar", []), indent=2)}

    Respond with a JSON object containing:
- "design_jobs": Array of design render tasks. Each task must include:
- "photo_id": Source image filename/URL.
- "format": Post format string ("Feed (1080x1080px)" or "Story (1080x1920px)").
- "template_id": Selected template ID matching the format.
- "dimensions": Object with "width" and "height".
- "modifications": Array of layer modifications containing:
- "name": Layer name (e.g., "background_image", "headline_text", "badge_color", "logo_image").
- "text" or "image_url" or "color": Value to inject into the template layer.
    """

    print("🎨 Agente 2 — Designer is translating briefs into visual layout specs...\n")

    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return response.text
        except ServerError as e:
            if "503" in str(e) and attempt < max_retries:
                print(f"⚠️ Service busy (503). Retrying in 5s... (Attempt {attempt}/{max_retries})")
                time.sleep(5)
            else:
                raise e


def trigger_design_api_render(design_jobs: list):
    bannerbear_api_key = os.getenv("BANNERBEAR_API_KEY")

    print("\n🖥️ Sending design render jobs to image generation service...")
    
    for idx, job in enumerate(design_jobs, start=1):
        photo_id = job.get("photo_id")
        template_id = job.get("template_id")
        format_type = job.get("format")

        print(f"\n   Job #{idx}: Rendering [{format_type}] for photo '{photo_id}'...")

        if bannerbear_api_key:
            headers = {
                "Authorization": f"Bearer {bannerbear_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "template": template_id,
                "modifications": job.get("modifications", [])
            }
            try:
                res = requests.post("https://api.bannerbear.com/v2/images", headers=headers, json=payload)
                if res.status_code in [200, 201]:
                    image_url = res.json().get("image_url")
                    print(f"   ✅ Rendered Image URL: {image_url}")
                else:
                    print(f"   ⚠️ API Error ({res.status_code}): {res.text}")
            except Exception as err:
                print(f"   ❌ Render Request Failed: {err}")
        else:
            mock_rendered_url = f"https://cdn.mysaas.com/renders/{client_brand_profile['client_id']}_{idx}_{photo_id}.png"
            print(f"   ✅ Mock Rendered Image URL: {mock_rendered_url}")


# A função agora pode receber a estratégia diretamente
def run_designer_agent(strategy_plan=None):
    if strategy_plan is None:
        strategy_plan = load_strategy_plan()

    design_specs_raw = generate_design_specifications(strategy_plan)

    output_filename = "designer_output_specs.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(design_specs_raw)
    print(f"\n💾 Design specifications saved to: {output_filename}")

    try:
        specs_json = json.loads(design_specs_raw)
        design_jobs = specs_json.get("design_jobs", [])
        trigger_design_api_render(design_jobs)
        
        # Devolvemos a especificação pronta para a aplicação
        return specs_json
    except json.JSONDecodeError:
        print("❌ Error decoding JSON output from Gemini designer model.")
        return {"erro": "Falha na descodificação"}


if __name__ == "__main__":
    run_designer_agent()