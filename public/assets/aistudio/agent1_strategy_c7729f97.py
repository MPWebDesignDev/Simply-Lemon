import os
import json
import time
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ServerError

# 1. Load environment variables
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable is not set in your .env file.")

# 2. Initialize Gemini Client
client = genai.Client(api_key=api_key)

# 3. System Instruction for Agent 1 (Strategy Agent / Maestro)
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

# 4. Mock Ingested Data (Meta Graph API + Google Reviews + Photo Batch)
weekly_metrics = {
    "client": {
        "name": "Simply Lemon",
        "niche": "Craft Lemonade & Refreshment Bar",
        "brand_voice": "Casual, fresh, enthusiastic with emojis"
    },
    "meta_api": {
        "follower_growth": {"new_followers": 340, "total_followers": 12850},
        "audience_peak_times": [
            "Monday 18:00 - 20:00",
            "Wednesday 12:00 - 14:00",
            "Saturday 15:00 - 17:00"
        ],
        "analyzed_posts": [
            {
                "id": "post_101",
                "format": "Reel",
                "pillar": "Product Showcase",
                "publish_time": "Wednesday 12:00",
                "reach": 9200,
                "engagement_rate": "8.5%",
                "saves": 310,
                "shares": 180
            },
            {
                "id": "post_102",
                "format": "Carousel",
                "pillar": "Atmosphere / Behind the Scenes",
                "publish_time": "Friday 18:00",
                "reach": 4100,
                "engagement_rate": "4.2%",
                "saves": 85,
                "shares": 40
            },
            {
                "id": "post_103",
                "format": "Reel",
                "pillar": "Promotion / Special Offer",
                "publish_time": "Saturday 15:00",
                "reach": 11500,
                "engagement_rate": "10.1%",
                "saves": 450,
                "shares": 320
            }
        ],
        "ad_performance": {
            "tier": "Pro Plan",
            "spent": "150 EUR",
            "roas": 3.6,
            "cpa": "4.10 EUR"
        }
    },
    "google_business_api": {
        "average_rating": 4.8,
        "new_reviews": 12,
        "summary": "Customers highly praise fresh artisanal lemonade flavors and fast service."
    },
    "uploaded_photos": [
        {"photo_id": "img_01.jpg", "description": "Fresh lemons sliced on a wooden counter"},
        {"photo_id": "img_02.jpg", "description": "Customer holding iced signature lemonade in store"},
        {"photo_id": "img_03.jpg", "description": "Special Weekend Promo banner graphic"},
        {"photo_id": "img_04.jpg", "description": "Team member preparing fresh mint syrup"}
    ]
}


def run_strategy_agent():
    prompt = f"""
    Analyze the following performance metrics and photo batch for "Simply Lemon":

    ```json
    {json.dumps(weekly_metrics, indent=2)}
    ```

    Respond with a JSON object containing:
- "weekly_summary": Analytical insights on top media formats, peak audience times, and review highlights.
- "editorial_calendar": Array of scheduled posts containing:
- "photo_id": Selected image from the batch.
- "day": Target day of the week.
- "scheduled_time": Target publication time (HH:MM).
- "format": "Feed (1080x1080px)" or "Story (1080x1920px)".
- "content_pillar": Assigned marketing category.
- "designer_brief": Visual framing guidelines for Agent 2 (Designer).
- "copywriter_brief": Messaging guidelines and call-to-action for Agent 3 (Copywriter).
- "ad_strategy": Selected post to boost, target audience, recommended budget, and campaign goal.
    """

    print("🧠 Agent 1 — Strategy is evaluating metrics with gemini-3.8-flash...\n")

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
            strategy_plan = response.text
            break
        except ServerError as e:
            if "503" in str(e) and attempt < max_retries:
                print(f"⚠️ High demand (503). Retrying in 5s... (Attempt {attempt}/{max_retries})")
                time.sleep(5)
            else:
                raise e

    print("==================================================")
    print("         WEEKLY STRATEGY PLAN GENERATED           ")
    print("==================================================")
    print(strategy_plan)
    print("==================================================")

    output_filename = "weekly_strategy_plan.json"
    with open(output_filename, "w", encoding="utf-8") as f:
        f.write(strategy_plan)
    print(f"\n💾 Strategy plan saved to: {output_filename}")

    # Removido o input humano e adicionado o return para a API
    return json.loads(strategy_plan)


if __name__ == "__main__":
    run_strategy_agent()