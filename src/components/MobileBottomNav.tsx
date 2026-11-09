import React from 'react';
import { Terminal, Calendar, Palette, Code2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface MobileBottomNavProps {
  currentTab: 'pipeline' | 'queue' | 'canva' | 'scripts';
  setCurrentTab: (tab: 'pipeline' | 'queue' | 'canva' | 'scripts') => void;
  queuedPostsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  setCurrentTab,
  queuedPostsCount,
}) => {
  const handleTabChange = (tab: 'pipeline' | 'queue' | 'canva' | 'scripts') => {
    soundFx.playClick();
    setCurrentTab(tab);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF0] border-t-4 border-[#292524] shadow-[0_-4px_0_rgba(41,37,36,0.15)] pb-safe">
      <div className="grid grid-cols-4 h-15">
        <button
          onClick={() => handleTabChange('pipeline')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            currentTab === 'pipeline'
              ? 'bg-[#FEF08A] text-[#292524] font-bold border-t-2 border-[#292524]'
              : 'text-stone-600 hover:bg-[#FEF9C3]'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span className="font-silk text-[9px]">Pipeline</span>
        </button>

        <button
          onClick={() => handleTabChange('queue')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
            currentTab === 'queue'
              ? 'bg-[#FEF08A] text-[#292524] font-bold border-t-2 border-[#292524]'
              : 'text-stone-600 hover:bg-[#FEF9C3]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="font-silk text-[9px]">Queue</span>
          {queuedPostsCount > 0 && (
            <span className="absolute top-2 right-4 bg-[#292524] text-[#FEF08A] text-[8px] font-pixel px-1 py-0.2">
              {queuedPostsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleTabChange('canva')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            currentTab === 'canva'
              ? 'bg-[#FEF08A] text-[#292524] font-bold border-t-2 border-[#292524]'
              : 'text-stone-600 hover:bg-[#FEF9C3]'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span className="font-silk text-[9px]">Canva</span>
        </button>

        <button
          onClick={() => handleTabChange('scripts')}
          className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            currentTab === 'scripts'
              ? 'bg-[#FEF08A] text-[#292524] font-bold border-t-2 border-[#292524]'
              : 'text-stone-600 hover:bg-[#FEF9C3]'
          }`}
        >
          <Code2 className="w-4 h-4 text-amber-800" />
          <span className="font-silk text-[9px]">Python</span>
        </button>
      </div>
    </nav>
  );
};
