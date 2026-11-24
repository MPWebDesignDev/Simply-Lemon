import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ServerError

# 1. Environment Setup
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY missing from environment variables.")

client = genai.Client(api_key=api_key)

# Language Mapping & Vocabulary Guidelines
LANGUAGE_GUIDELINES = {
    "pt-PT": "European Portuguese (PT-PT). Use strict European vocabulary (e.g., 'equipa', 'ecrã', 'contacte-nos', 'reserva'). Avoid Brazilian Portuguese terms.",
    "pt-BR": "Brazilian Portuguese (PT-BR). Use natural Brazilian vocabulary and phrasing (e.g., 'time', 'tela', 'fale conosco').",
    "en-US": "American English (EN-US). Use engaging, natural US English terminology and spelling.",
    "en-GB": "British English (EN-GB). Use natural UK English terminology and spelling.",
    "es-ES": "European Spanish (ES-ES). Use natural Spain Spanish phrasing and vocabulary.",
    "fr-FR": "French (FR-FR). Use natural French vocabulary suited for local businesses."
}

def get_system_instruction(target_language_code: str) -> str:
    lang_rule = LANGUAGE_GUIDELINES.get(
        target_language_code, 
        f"Language code '{target_language_code}'. Write natively in this language."
    )
    
    return f"""
You are "Agente 3 — Copywriting", an expert social media copywriter specialized in localized content for B2B local businesses and SMEs.

Your responsibilities:
1. Target Language Strictness: Write exclusively in {lang_rule}
2. Brand DNA Alignment: Match the client's specific tone of voice (e.g., casual, elegant, enthusiastic, direct).
3. Engagement Structure:
- Hook: Attention-grabbing first line.
- Body: Value-driven description based on the strategy brief.
- CTA (Call-to-Action): Clear action instruction localized to the target language.
- Emojis & Hashtags: Contextually relevant emojis and 5–8 targeted local/niche hashtags.
4. Output Requirement: Return strictly valid JSON containing the finalized captions mapped to each scheduled post.
"""

def load_strategy_plan():
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
                "copywriter_brief": "Highlight the fresh ingredients of our artisan lemonades. Mention slice-to-cup freshness."
            }
        ]
    }

# A função agora recebe a estratégia (strategy_plan) diretamente da linha de montagem
def run_copywriting_agent(user_language: str = "pt-PT", strategy_plan=None):
    
    if strategy_plan is None:
        strategy_plan = load_strategy_plan()

    client_profile = {
        "brand_name": "Simply Lemon",
        "niche": "Craft Lemonade & Refreshment Bar",
        "tone_of_voice": "Casual, fresh, enthusiastic, welcoming",
        "target_language": user_language,
        "target_location": "Lisbon, Portugal"
    }

    prompt = f"""
    Generate social media captions in {user_language} for the following client strategy:

    Client DNA Profile:
    {json.dumps(client_profile, indent=2)}

    Editorial Strategy & Briefs:
    {json.dumps(strategy_plan.get("editorial_calendar", []), indent=2)}

    Respond with a JSON object containing:
- "detected_language": Language code used.
- "captions": Array of posts. Each object must include:
- "photo_id": Original photo reference.
- "day": Scheduled day.
- "format": Post dimension format.
- "hook": Initial headline sentence.
- "caption_body": Main caption text in {user_language}.
- "call_to_action": Specific CTA phrase in {user_language}.
- "hashtags": Array of localized hashtags.
- "full_text": Ready-to-publish combined text (Hook + Body + CTA + Hashtags).
    """

    print(f"✍️ Agente 3 — Copywriting crafting captions in [{user_language}]...\n")

    system_instruction = get_system_instruction(user_language)

    max_retries = 3
    for attempt in range(1, max_retries + 1):
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.3
                )
            )
            copy_output = response.text
            break
        except ServerError as e:
            if "503" in str(e) and attempt < max_retries:
                print(f"⚠️ Service busy (503). Retrying in 5s... (Attempt {attempt}/{max_retries})")
                time.sleep(5)
            else:
                raise e

    output_filename = "final_copy_captions.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(copy_output)
    print(f"\n💾 Captions saved to: {output_filename}")

    try:
        # Devolve os textos estruturados para a linha de montagem
        return json.loads(copy_output)
    except json.JSONDecodeError:
        print("❌ Error decoding JSON output from Gemini copywriter model.")
        return {"erro": "Falha na descodificação"}

if __name__ == "__main__":
    run_copywriting_agent(user_language="pt-PT")