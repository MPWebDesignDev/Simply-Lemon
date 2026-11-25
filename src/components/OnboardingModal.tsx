import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, ArrowLeft, Check, HelpCircle, Palette, Flame, Target, MapPin, Mail, Globe, Layers, Award } from 'lucide-react';
import { OnboardingAnswers } from '../types';
import { soundFx } from '../utils/soundEffects';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: OnboardingAnswers;
  onSaveAndRunAgent1: (answers: OnboardingAnswers) => void;
}

const COLOR_PRESETS = [
  { name: 'Pastel Lemon (Classic)', primary: '#FEF08A', secondary: '#86EFAC', border: '#292524' },
  { name: 'Cyber Mint & Lime', primary: '#A7F3D0', secondary: '#FDE047', border: '#292524' },
  { name: 'Peach & Sakura Pop', primary: '#FED7AA', secondary: '#FBCFE8', border: '#292524' },
  { name: 'Sky Arcade Blue', primary: '#BAE6FD', secondary: '#FEF08A', border: '#292524' },
  { name: 'Lavender Pixel Dream', primary: '#DDD6FE', secondary: '#FEF08A', border: '#292524' },
];

const TONE_OPTIONS = [
  { label: 'Playful & Nostalgic', desc: '8-bit arcade humor, energetic, cheeky, relatable gaming metaphors' },
  { label: 'Cozy & Wholesome', desc: 'Warm, inviting, gentle, supportive, comforting community vibe' },
  { label: 'Bold & High-Energy', desc: 'Punchy, hype, urgent, electric drops and confident hooks' },
  { label: 'Witty & Sarcastic', desc: 'Dry humor, clever internet memes, self-aware and memorable' },
  { label: 'Clean & Informative', desc: 'Knowledge-packed tutorials, clear value props, authoritative yet friendly' },
];

const GOAL_OPTIONS = [
  { label: 'Drive Direct Sales & Orders', icon: Flame, desc: 'Turn scrollers into paying customers with high-conversion CTAs' },
  { label: 'Build Loyal Community', icon: Target, desc: 'Cultivate superfans who comment, share UGC, and attend meetups' },
  { label: 'Go Viral on Reels & TikTok', icon: Sparkles, desc: 'Maximum algorithmic reach and exponential follower expansion' },
  { label: 'Promote IRL Events & Drops', icon: Layers, desc: 'Sell out weekend tournaments, physical storefront visits, and limited merchandise' },
];

const REACH_OPTIONS = [
  { value: 'local', label: 'Local Storefront', desc: 'Specific neighborhood or brick-and-mortar venue' },
  { value: 'regional', label: 'City & Regional Metro', desc: 'Greater metro area and nearby regions' },
  { value: 'global', label: 'Global / 100% Online', desc: 'Worldwide e-commerce, digital products, or remote audience' },
  { value: 'online_only', label: 'Creator & Digital Brand', desc: 'Streaming, content creation, and digital downloads' },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSaveAndRunAgent1,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingAnswers>(initialData);

  if (!isOpen) return null;

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep < 10) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    soundFx.playLevelUp();
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FEF08A', '#86EFAC', '#FDE047', '#292524'],
    });
    onSaveAndRunAgent1(formData);
  };

  const fillQuickPreset = () => {
    soundFx.playSuccess();
    setFormData({
      businessName: 'Sour & Sweet Arcade Cafe',
      industry: 'Specialty Coffee & Retro Gaming Lounge',
      location: 'Austin, TX & Worldwide Merch',
      reachType: 'regional',
      websiteUrl: 'https://sourandsweet.arcade',
      instagramHandle: '@sourandsweet_arcade',
      supportEmail: 'hello@sourandsweet.arcade',
      primaryColor: '#FEF08A',
      secondaryColor: '#86EFAC',
      aestheticStyle: 'Pastel Retro 8-Bit Game HUD',
      brandTone: 'Playful, nostalgic, caffeinated, and witty',
      primaryGoal: 'Drive foot traffic & viral TikTok/Reels engagement',
      coreProducts: 'Cold-brew citrus fizz, artisan matcha pixel donuts, and 8-bit tournament nights',
      targetAudience: 'Gen Z and Millennial gamers, digital nomads, and specialty beverage enthusiasts (ages 18-35)',
      logoStyle: 'Chubby 8-Bit Pixel Lemon Mascot',
    });
  };

  // Lemmy dialogue advice per step
  const getLemmyTip = (step: number) => {
    switch (step) {
      case 1:
        return "Squeeze that brain juice! Pick a punchy name that sticks in players' heads.";
      case 2:
        return "Are you crafting potions, selling loot, or running an IRL tavern? Let Agent 1 know your niche!";
      case 3:
        return "Where in the world are your players located? Local storefront or worldwide map?";
      case 4:
        return "Drop your quest headquarters link and social handles so fans can find your inventory.";
      case 5:
        return "Pastel lemon is my personal favorite, but pick whatever colors represent your aura!";
      case 6:
        return "Tone defines your NPC dialogue style! Sarcastic? Wholesome? Or hype champion?";
      case 7:
        return "What's the main boss objective? Sales, community XP, or viral reach?";
      case 8:
        return "Describe your best-selling power-ups. What makes customers crave your magic?";
      case 9:
        return "Who is your Player 2? Tell us who we are targeting on Instagram and TikTok.";
      case 10:
        return "Almost done! Choose your visual aesthetic and prepare for Agent 1 transmission!";
      default:
        return "You're doing awesome!";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-[#292524] shadow-[8px_8px_0_#292524] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Retro Header Bar */}
        <div className="bg-[#FEF08A] border-b-4 border-[#292524] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#DC2626] border border-[#292524]" />
            <span className="w-3 h-3 bg-[#FDE047] border border-[#292524]" />
            <span className="w-3 h-3 bg-[#86EFAC] border border-[#292524]" />
            <h2 className="font-pixel text-xs sm:text-sm text-[#292524] ml-2">
              QUEST: 10-Q BRAND ONBOARDING
            </h2>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-7 h-7 bg-[#292524] text-[#FEF08A] font-pixel text-xs flex items-center justify-center hover:bg-stone-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar & Level Indicator */}
        <div className="bg-[#FEF9C3] px-4 py-2 border-b-2 border-[#292524] flex items-center justify-between text-xs font-silk">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#854D0E]">STAGE {currentStep}/10:</span>
            <span className="text-[#292524] font-medium hidden sm:inline">
              {currentStep === 1 && 'Brand Identity'}
              {currentStep === 2 && 'Industry Niche'}
              {currentStep === 3 && 'Location & Reach'}
              {currentStep === 4 && 'Social & Contact'}
              {currentStep === 5 && 'Color Aesthetics'}
              {currentStep === 6 && 'Brand Voice & Tone'}
              {currentStep === 7 && 'Primary Goal'}
              {currentStep === 8 && 'Products & Offerings'}
              {currentStep === 9 && 'Target Demographics'}
              {currentStep === 10 && 'Visual Direction & Logo'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fillQuickPreset}
              className="text-[10px] text-amber-900 underline hover:text-black font-silk cursor-pointer"
              title="Autofill Arcade Cafe preset for quick testing"
            >
              [Autofill Demo Brand]
            </button>
            <span className="bg-[#292524] text-[#86EFAC] px-2 py-0.5 text-[10px] font-pixel">
              {currentStep * 10}% XP
            </span>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full bg-[#E5E5E5] h-2.5 border-b-2 border-[#292524]">
          <div
            className="h-full bg-linear-to-r from-[#FACC15] to-[#86EFAC] transition-all duration-300"
            style={{ width: `${(currentStep / 10) * 100}%` }}
          />
        </div>

        {/* Lemmy Dialogue Box */}
        <div className="bg-[#FFFBEB] p-3 border-b-2 border-[#292524] flex items-start gap-3">
          <div className="w-12 h-12 bg-[#FEF08A] border-2 border-[#292524] shadow-[2px_2px_0_#292524] p-1 shrink-0">
            <img
              src="./assets/aistudio/image_0835261b.png"
              alt="Lemmy Mascot"
              className="w-full h-full object-contain pixel-art animate-bounce"
            />
          </div>
          <div className="flex-1 bg-white p-2 border-2 border-[#292524] shadow-[2px_2px_0_rgba(41,37,36,0.1)] relative text-xs">
            <div className="font-pixel text-[10px] text-[#854D0E] mb-1 flex items-center justify-between">
              <span>LEMMY SAYS:</span>
              <span className="text-[9px] text-stone-400 font-silk">HINT SYSTEM</span>
            </div>
            <p className="font-body text-[#292524] text-xs leading-relaxed">
              "{getLemmyTip(currentStep)}"
            </p>
          </div>
        </div>

        {/* Question Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FFFDF0]">
          {/* STEP 1: Brand Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <label className="block">
                <span className="font-pixel text-xs text-[#292524] block mb-2">
                  1. WHAT IS YOUR BUSINESS OR BRAND NAME?
                </span>
                <span className="text-xs text-stone-600 block mb-3 font-body">
                  This will be the anchor name used by Agent 1 to craft your brand voice and social handles.
                </span>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Neon Lemon Records or Sweet Tooth Bakery"
                  className="w-full bg-white border-3 border-[#292524] p-3 font-silk text-sm focus:outline-none focus:bg-[#FEF9C3] shadow-[3px_3px_0_#292524]"
                />
              </label>
            </div>
          )}

          {/* STEP 2: Industry / Niche */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <label className="block">
                <span className="font-pixel text-xs text-[#292524] block mb-2">
                  2. WHAT INDUSTRY OR NICHE ARE YOU IN?
                </span>
                <span className="text-xs text-stone-600 block mb-3 font-body">
                  Agent 1 uses this to analyze industry trends, competitor cadences, and content benchmarks.
                </span>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  placeholder="e.g. Specialty Coffee, Indie Video Games, Sustainable Apparel, SaaS"
                  className="w-full bg-white border-3 border-[#292524] p-3 font-silk text-sm focus:outline-none focus:bg-[#FEF9C3] shadow-[3px_3px_0_#292524]"
                />
              </label>

              <div className="flex flex-wrap gap-2 pt-2">
                {['Specialty Coffee & Cafe', 'Indie Gaming / Game Dev', 'Vintage & Streetwear', 'Beauty & Skincare', 'Fitness & Wellness', 'Tech / Developer Tool'].map(niche => (
                  <button
                    key={niche}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setFormData({ ...formData, industry: niche });
                    }}
                    className="text-xs px-2.5 py-1 bg-[#FEF9C3] border-2 border-[#292524] hover:bg-[#FDE047] font-silk cursor-pointer"
                  >
                    + {niche}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Location & Reach */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <span className="font-pixel text-xs text-[#292524] block mb-2">
                  3. LOCATION & AUDIENCE REACH
                </span>
                <span className="text-xs text-stone-600 block mb-3 font-body">
                  Where are you physically based, and what is your geographical footprint?
                </span>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Austin, Texas or London, UK or 100% Remote"
                  className="w-full bg-white border-3 border-[#292524] p-3 font-silk text-sm focus:outline-none focus:bg-[#FEF9C3] shadow-[3px_3px_0_#292524] mb-4"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {REACH_OPTIONS.map(opt => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      soundFx.playClick();
                      setFormData({ ...formData, reachType: opt.value as OnboardingAnswers['reachType'] });
                    }}
                    className={`p-3 border-2 border-[#292524] cursor-pointer transition-all ${
                      formData.reachType === opt.value
                        ? 'bg-[#FEF08A] shadow-[3px_3px_0_#292524] font-bold'
                        : 'bg-white hover:bg-[#FFFBEB]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-silk mb-1">
                      <span>{opt.label}</span>
                      {formData.reachType === opt.value && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                    </div>
                    <p className="text-[11px] text-stone-600 font-body">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Contact & Social Handles */}
          {currentStep === 4 && (
            <div className="space-y-3">
              <span className="font-pixel text-xs text-[#292524] block mb-1">
                4. CONTACT & SOCIAL CHANNELS
              </span>
              <span className="text-xs text-stone-600 block mb-3 font-body">
                Agent 3 will insert these links and handles seamlessly into your social copy and CTAs.
              </span>

              <div>
                <label className="text-xs font-silk flex items-center gap-1.5 mb-1 text-stone-800">
                  <Globe className="w-3.5 h-3.5 text-amber-700" /> Website URL
                </label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://yourbrand.com"
                  className="w-full bg-white border-2 border-[#292524] p-2.5 font-silk text-xs focus:outline-none focus:bg-[#FEF9C3]"
                />
              </div>

              <div>
                <label className="text-xs font-silk flex items-center gap-1.5 mb-1 text-stone-800">
                  <span className="font-pixel text-[10px]">@</span> Instagram / TikTok Handle
                </label>
                <input
                  type="text"
                  value={formData.instagramHandle}
                  onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })}
                  placeholder="@yourbrand"
                  className="w-full bg-white border-2 border-[#292524] p-2.5 font-silk text-xs focus:outline-none focus:bg-[#FEF9C3]"
                />
              </div>

              <div>
                <label className="text-xs font-silk flex items-center gap-1.5 mb-1 text-stone-800">
                  <Mail className="w-3.5 h-3.5 text-amber-700" /> Support / Inquiries Email
                </label>
                <input
                  type="email"
                  value={formData.supportEmail}
                  onChange={e => setFormData({ ...formData, supportEmail: e.target.value })}
                  placeholder="hello@yourbrand.com"
                  className="w-full bg-white border-2 border-[#292524] p-2.5 font-silk text-xs focus:outline-none focus:bg-[#FEF9C3]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Brand Colors & Aesthetics */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <span className="font-pixel text-xs text-[#292524] block mb-1">
                5. BRAND COLORS & AESTHETIC PALETTE
              </span>
              <span className="text-xs text-stone-600 block mb-3 font-body">
                Agent 2 (Canva Designer) uses these exact HEX codes to format templates, banners, and stickers.
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {COLOR_PRESETS.map(preset => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      soundFx.playClick();
                      setFormData({
                        ...formData,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        aestheticStyle: preset.name,
                      });
                    }}
                    className={`p-2.5 border-2 border-[#292524] flex items-center justify-between text-left cursor-pointer transition-all ${
                      formData.primaryColor === preset.primary
                        ? 'bg-amber-100 shadow-[3px_3px_0_#292524] font-bold'
                        : 'bg-white hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center -space-x-2">
                        <span className="w-5 h-5 rounded-none border border-[#292524]" style={{ backgroundColor: preset.primary }} />
                        <span className="w-5 h-5 rounded-none border border-[#292524]" style={{ backgroundColor: preset.secondary }} />
                      </div>
                      <span className="font-silk text-xs text-[#292524]">{preset.name}</span>
                    </div>
                    {formData.primaryColor === preset.primary && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#FFFBEB] p-3 border-2 border-[#292524]">
                <div>
                  <label className="text-[11px] font-silk block mb-1">Primary Color (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-8 h-8 border-2 border-[#292524] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={e => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-full bg-white border border-[#292524] p-1 font-silk text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-silk block mb-1">Secondary Accent (Hex)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-8 h-8 border-2 border-[#292524] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={e => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-full bg-white border border-[#292524] p-1 font-silk text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Brand Voice & Tone */}
          {currentStep === 6 && (
            <div className="space-y-3">
              <span className="font-pixel text-xs text-[#292524] block mb-1">
                6. BRAND VOICE & NPC TONE
              </span>
              <span className="text-xs text-stone-600 block mb-3 font-body">
                How should Agent 3 write your post captions, responses, and hooks?
              </span>

              <div className="space-y-2">
                {TONE_OPTIONS.map(tone => (
                  <div
                    key={tone.label}
                    onClick={() => {
                      soundFx.playClick();
                      setFormData({ ...formData, brandTone: tone.label });
                    }}
                    className={`p-3 border-2 border-[#292524] cursor-pointer transition-all ${
                      formData.brandTone === tone.label
                        ? 'bg-[#FEF08A] shadow-[3px_3px_0_#292524] font-bold'
                        : 'bg-white hover:bg-[#FFFBEB]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-silk mb-1">
                      <span>{tone.label}</span>
                      {formData.brandTone === tone.label && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                    </div>
                    <p className="text-[11px] text-stone-600 font-body">{tone.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Primary Business Goal */}
          {currentStep === 7 && (
            <div className="space-y-3">
              <span className="font-pixel text-xs text-[#292524] block mb-1">
                7. PRIMARY SOCIAL MEDIA GOAL
              </span>
              <span className="text-xs text-stone-600 block mb-3 font-body">
                Agent 1 weights content pillars based on this north star objective.
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(goal => {
                  const Icon = goal.icon;
                  return (
                    <div
                      key={goal.label}
                      onClick={() => {
                        soundFx.playClick();
                        setFormData({ ...formData, primaryGoal: goal.label });
                      }}
                      className={`p-3 border-2 border-[#292524] cursor-pointer transition-all ${
                        formData.primaryGoal === goal.label
                          ? 'bg-[#FEF08A] shadow-[3px_3px_0_#292524] font-bold'
                          : 'bg-white hover:bg-[#FFFBEB]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-6 h-6 bg-[#292524] text-[#FEF08A] flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-silk text-xs">{goal.label}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 font-body">{goal.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 8: Core Products & Offerings */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <label className="block">
                <span className="font-pixel text-xs text-[#292524] block mb-2">
                  8. CORE PRODUCTS & VALUE PROPOSITION
                </span>
                <span className="text-xs text-stone-600 block mb-3 font-body">
                  What do you sell, make, or provide? What makes your offering irresistible?
                </span>
                <textarea
                  rows={4}
                  value={formData.coreProducts}
                  onChange={e => setFormData({ ...formData, coreProducts: e.target.value })}
                  placeholder="e.g. Specialty cold-brew coffee infused with real citrus, homemade matcha donuts, and weekly retro multiplayer tournament brackets."
                  className="w-full bg-white border-3 border-[#292524] p-3 font-body text-xs focus:outline-none focus:bg-[#FEF9C3] shadow-[3px_3px_0_#292524]"
                />
              </label>
            </div>
          )}

          {/* STEP 9: Target Audience & Demographics */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <label className="block">
                <span className="font-pixel text-xs text-[#292524] block mb-2">
                  9. TARGET AUDIENCE DEMOGRAPHICS
                </span>
                <span className="text-xs text-stone-600 block mb-3 font-body">
                  Who are your favorite customers? What are their ages, hobbies, and day-to-day desires?
                </span>
                <textarea
                  rows={4}
                  value={formData.targetAudience}
                  onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g. Young adults (18-35), indie video game lovers, creative freelancers who want aesthetic third-places, and specialty soda collectors."
                  className="w-full bg-white border-3 border-[#292524] p-3 font-body text-xs focus:outline-none focus:bg-[#FEF9C3] shadow-[3px_3px_0_#292524]"
                />
              </label>
            </div>
          )}

          {/* STEP 10: Visual Direction & Logo Style */}
          {currentStep === 10 && (
            <div className="space-y-4">
              <span className="font-pixel text-xs text-[#292524] block mb-2">
                10. LOGO & VISUAL BRAND ASSET DIRECTION
              </span>
              <span className="text-xs text-stone-600 block mb-3 font-body">
                How should Agent 2 (Canva API) format the graphic stickers and branding?
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: '8-Bit Pixel Mascot (Lemmy Style)', desc: 'Chubby pixel characters, retro 90s sprite cards, nostalgic game HUDs' },
                  { title: 'Modern Clean Minimalist', desc: 'Sleek typography, high negative space, understated luxury' },
                  { title: 'Bold Retro Pop & Y2K', desc: 'Vibrant neon outlines, chunky bubble fonts, high energy' },
                  { title: 'Hand-drawn Organic & Cozy', desc: 'Earthy textures, botanical accents, warm café vibes' },
                ].map(style => (
                  <div
                    key={style.title}
                    onClick={() => {
                      soundFx.playClick();
                      setFormData({ ...formData, logoStyle: style.title });
                    }}
                    className={`p-3 border-2 border-[#292524] cursor-pointer transition-all ${
                      formData.logoStyle === style.title
                        ? 'bg-[#FEF08A] shadow-[3px_3px_0_#292524] font-bold'
                        : 'bg-white hover:bg-[#FFFBEB]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-silk mb-1">
                      <span>{style.title}</span>
                      {formData.logoStyle === style.title && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                    </div>
                    <p className="text-[11px] text-stone-600 font-body">{style.desc}</p>
                  </div>
                ))}
              </div>

              {/* Ready confirmation banner */}
              <div className="bg-[#86EFAC]/40 border-2 border-[#292524] p-3 flex items-center gap-3 mt-4">
                <Award className="w-6 h-6 text-emerald-800 shrink-0" />
                <div className="text-xs font-silk text-[#292524]">
                  All 10 questions ready! Clicking Finish will package your brand JSON and launch <strong>agent1_strategy.py</strong>!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#FEF08A] border-t-4 border-[#292524] p-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-3 py-2 font-silk text-xs border-2 border-[#292524] shadow-[2px_2px_0_#292524] cursor-pointer ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed bg-stone-200'
                : 'bg-white hover:bg-stone-100 text-[#292524]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="font-pixel text-[11px] text-[#292524]">
            {currentStep} / 10
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 font-silk text-xs font-bold bg-[#86EFAC] hover:bg-[#4ADE80] text-[#292524] border-2 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <span>{currentStep === 10 ? 'Transmit to Agent 1' : 'Next Level'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
