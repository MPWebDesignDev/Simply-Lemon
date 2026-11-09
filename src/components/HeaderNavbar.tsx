import React from 'react';
import { Volume2, VolumeX, Terminal, Calendar, Palette, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GoogleUserProfile } from '../types';
import { soundFx } from '../utils/soundEffects';

interface HeaderNavbarProps {
  currentTab: 'pipeline' | 'queue' | 'canva' | 'scripts';
  setCurrentTab: (tab: 'pipeline' | 'queue' | 'canva' | 'scripts') => void;
  user: GoogleUserProfile;
  brandName: string;
  onOpenOnboarding: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  queuedPostsCount: number;
  templatesCount: number;
  backendHealthy: boolean;
  hasApiKey: boolean;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  brandName,
  onOpenOnboarding,
  isMuted,
  onToggleMute,
  queuedPostsCount,
  templatesCount,
  backendHealthy,
  hasApiKey,
}) => {
  const handleTabClick = (tab: 'pipeline' | 'queue' | 'canva' | 'scripts') => {
    soundFx.playClick();
    setCurrentTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FEF9C3] border-b-4 border-[#292524] shadow-[0_4px_0_rgba(41,37,36,0.15)]">
      {/* Top Retro Health Status Ticker */}
      <div className="bg-[#292524] text-[#FEF08A] px-3 py-1 text-[11px] font-silk flex items-center justify-between tracking-wide overflow-x-auto">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className={`inline-block w-2.5 h-2.5 rounded-none ${backendHealthy ? 'bg-[#86EFAC] animate-pulse' : 'bg-red-500'}`} />
          <span>SIMPLY LEMON // REAL BACKEND MONITOR</span>
          <span className="hidden md:inline text-stone-500">|</span>
          <span className="hidden md:inline text-stone-300">
            {hasApiKey ? (
              <span className="text-[#86EFAC] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 inline" /> GEMINI API KEY DETECTED
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 inline" /> CONFIGURE GEMINI_API_KEY FOR AGENT RUNS
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-stone-300">
            DRAFTS: <strong className="text-white">{queuedPostsCount} REAL POSTS</strong>
          </span>
          <span className="bg-[#422006] text-[#FDE047] px-2 py-0.5 border border-[#FDE047] text-[10px]">
            NODE + UV RUNNER
          </span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Lemmy Mascot */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative group cursor-pointer" onClick={() => soundFx.playSuccess()}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FDE047] border-3 border-[#292524] shadow-[2px_2px_0_#292524] flex items-center justify-center p-1 overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/assets/aistudio/image_0835261b.png"
                alt="Simply Lemon Mascot"
                className="w-full h-full object-contain pixel-art drop-shadow-sm"
              />
            </div>
            <div className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-[#292524] ${backendHealthy ? 'bg-[#86EFAC]' : 'bg-red-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-pixel text-xs sm:text-sm font-bold text-[#292524] tracking-tight">
                SIMPLY LEMON
              </h1>
              <span className="font-silk text-[9px] bg-[#FDE047] text-[#292524] px-1 py-0.2 border border-[#292524]">
                OPS
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-700">
              <span className="truncate max-w-[130px] sm:max-w-[200px] font-semibold text-[#854D0E] font-body text-[11px]">
                {brandName}
              </span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onOpenOnboarding();
                }}
                className="text-[10px] text-amber-900 underline hover:text-black font-silk cursor-pointer shrink-0"
                title="Edit 10 Brand Profile Questions"
              >
                [Edit Profile]
              </button>
            </div>
          </div>
        </div>

        {/* Focused Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-[#FFFBEB] p-1 border-2 border-[#292524] shadow-[2px_2px_0_#292524]">
          <button
            onClick={() => handleTabClick('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-silk text-xs transition-all cursor-pointer ${
              currentTab === 'pipeline'
                ? 'bg-[#FDE047] text-[#292524] font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524]'
                : 'text-stone-700 hover:bg-[#FEF08A]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Pipeline & Diagnostics</span>
          </button>

          <button
            onClick={() => handleTabClick('queue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-silk text-xs transition-all cursor-pointer ${
              currentTab === 'queue'
                ? 'bg-[#FDE047] text-[#292524] font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524]'
                : 'text-stone-700 hover:bg-[#FEF08A]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Real Post Queue</span>
            {queuedPostsCount > 0 && (
              <span className="bg-[#292524] text-[#FEF08A] text-[9px] px-1 py-0.2 font-pixel">
                {queuedPostsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('canva')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-silk text-xs transition-all cursor-pointer ${
              currentTab === 'canva'
                ? 'bg-[#FDE047] text-[#292524] font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524]'
                : 'text-stone-700 hover:bg-[#FEF08A]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Canva Templates</span>
            {templatesCount > 0 && (
              <span className="bg-[#292524] text-[#86EFAC] text-[9px] px-1 py-0.2 font-pixel">
                {templatesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('scripts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-silk text-xs transition-all cursor-pointer ${
              currentTab === 'scripts'
                ? 'bg-[#FDE047] text-[#292524] font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524]'
                : 'text-stone-700 hover:bg-[#FEF08A]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-700" />
            <span>Python Scripts</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Audio FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              if (isMuted) soundFx.playClick();
            }}
            className="p-2 bg-[#FFFBEB] border-2 border-[#292524] shadow-[2px_2px_0_#292524] hover:bg-[#FEF08A] text-[#292524] cursor-pointer"
            title={isMuted ? 'Unmute 8-Bit Audio SFX' : 'Mute 8-Bit Audio SFX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 bg-[#FFFBEB] pl-2 pr-3 py-1 border-2 border-[#292524] shadow-[2px_2px_0_#292524]">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-6 h-6 border border-[#292524] object-cover"
            />
            <div className="text-left hidden sm:block">
              <p className="font-silk text-[10px] font-bold text-[#292524] leading-tight truncate max-w-[85px]">
                {user.name}
              </p>
              <div className="flex items-center gap-1 text-[9px] text-stone-500 font-silk">
                <span className="w-1.5 h-1.5 bg-[#4285F4] rounded-full" />
                <span>Google</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
