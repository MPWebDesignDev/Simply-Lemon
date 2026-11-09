import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_ONBOARDING, 
  INITIAL_USER 
} from './data/mockData';
import { CanvaTemplateAsset, GeneratedPost, GoogleUserProfile, OnboardingAnswers, StrategyPlan, BackendHealth } from './types';
import { HeaderNavbar } from './components/HeaderNavbar';
import { AgentPipelineView } from './components/AgentPipelineView';
import { PostQueueScheduler } from './components/PostQueueScheduler';
import { CanvaStudioView } from './components/CanvaStudioView';
import { PythonScriptManager } from './components/PythonScriptManager';
import { OnboardingModal } from './components/OnboardingModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const [user, setUser] = useState<GoogleUserProfile>(INITIAL_USER);
  const [currentTab, setCurrentTab] = useState<'pipeline' | 'queue' | 'canva' | 'scripts'>('pipeline');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Real App State - starts with NO mock assets or fake posts!
  const [onboardingData, setOnboardingData] = useState<OnboardingAnswers>(DEFAULT_ONBOARDING);
  const [strategyPlan, setStrategyPlan] = useState<StrategyPlan | null>(null);
  const [canvaAssets, setCanvaAssets] = useState<CanvaTemplateAsset[]>([]);
  const [posts, setPosts] = useState<GeneratedPost[]>([]);

  // Real Backend Health State
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      }
    } catch {
      // Backend starting up
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.setMuted(nextMuted);
  };

  const handleSaveOnboardingAndRun = (answers: OnboardingAnswers) => {
    setOnboardingData(answers);
    setIsOnboardingOpen(false);
    setCurrentTab('pipeline');
  };

  const handleOpenCanvaAsset = (assetId: string) => {
    setCurrentTab('canva');
  };

  const isBackendHealthy = backendHealth?.status === 'ok';
  const hasApiKey = Boolean(backendHealth?.environment?.hasGeminiApiKey);

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex flex-col font-body text-[#2C2213] pb-20 md:pb-8">
      {/* Top Retro HUD Navigation */}
      <HeaderNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        brandName={onboardingData.businessName}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        queuedPostsCount={posts.length}
        templatesCount={canvaAssets.length}
        backendHealthy={isBackendHealthy}
        hasApiKey={hasApiKey}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-5 sm:py-6">
        {currentTab === 'pipeline' && (
          <AgentPipelineView
            onboardingData={onboardingData}
            strategyPlan={strategyPlan}
            setStrategyPlan={setStrategyPlan}
            canvaAssets={canvaAssets}
            setCanvaAssets={setCanvaAssets}
            posts={posts}
            setPosts={setPosts}
            onOpenScriptManager={() => setCurrentTab('scripts')}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onNavigateToQueue={() => setCurrentTab('queue')}
            onNavigateToStudio={() => setCurrentTab('canva')}
            backendHealthy={isBackendHealthy}
            hasApiKey={hasApiKey}
          />
        )}

        {currentTab === 'queue' && (
          <PostQueueScheduler
            posts={posts}
            setPosts={setPosts}
            canvaAssets={canvaAssets}
            onOpenCanvaAsset={handleOpenCanvaAsset}
            brandName={onboardingData.businessName}
          />
        )}

        {currentTab === 'canva' && (
          <CanvaStudioView
            canvaAssets={canvaAssets}
            setCanvaAssets={setCanvaAssets}
            onboardingData={onboardingData}
            onSendToCopywriter={() => setCurrentTab('queue')}
          />
        )}

        {currentTab === 'scripts' && (
          <PythonScriptManager
            onRunPipeline={() => setCurrentTab('pipeline')}
          />
        )}
      </main>

      {/* 10-Question Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialData={onboardingData}
        onSaveAndRunAgent1={handleSaveOnboardingAndRun}
      />

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        queuedPostsCount={posts.length}
      />
    </div>
  );
}
