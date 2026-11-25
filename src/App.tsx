import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_ONBOARDING, 
  INITIAL_USER,
  REAL_WEEKLY_STRATEGY,
  REAL_DESIGNER_SPECS,
  REAL_FINAL_CAPTIONS 
} from './data/mockData';
import { CanvaTemplateAsset, GeneratedPost, GoogleUserProfile, OnboardingAnswers, WeeklyStrategyPlan, BackendHealth } from './types';
import { HeaderNavbar } from './components/HeaderNavbar';
import { AgentPipelineView } from './components/AgentPipelineView';
import { PostQueueScheduler } from './components/PostQueueScheduler';
import { CanvaStudioView } from './components/CanvaStudioView';
import { PythonScriptManager } from './components/PythonScriptManager';
import { OnboardingModal } from './components/OnboardingModal';
import { BackendBridgeModal } from './components/BackendBridgeModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { soundFx } from './utils/soundEffects';

// Initial real assets from designer_output_specs.json
const INITIAL_ASSETS: CanvaTemplateAsset[] = REAL_DESIGNER_SPECS.design_jobs.map((job, idx) => {
  const isSquare = job.dimensions.height === 1080;
  const headline = job.modifications.find(m => m.name === 'headline_text')?.text || '100% NATURAL FRESHNESS';
  const subtext = job.modifications.find(m => m.name === 'subtext')?.text || job.modifications.find(m => m.name === 'quote_text')?.text || 'Artisanal Craft Refreshment';
  return {
    id: `asset_job_${idx + 1}`,
    title: `Job #${idx + 1}: ${headline}`,
    format: isSquare ? '1080x1080' : '1080x1920',
    formatName: job.format,
    bgColor: idx % 2 === 0 ? '#FFF066' : '#FFFDF0',
    accentColor: '#2D5A27',
    badgeText: `★ ${job.format.toUpperCase()} ★`,
    headline,
    subheadline: subtext,
    layoutType: isSquare ? 'retro-card' : 'pixel-split',
    canvaTemplateId: job.template_id,
    canvaEditUrl: `https://www.canva.com/design/DAF-LEMON-${idx + 1}/edit`,
    tags: ['Simply Lemon', 'Artisanal', 'Retro 8-Bit'],
    pixelSticker: 'lemon_cheer',
    photo_id: job.photo_id,
    rawJob: job
  };
});

// Initial real posts from final_copy_captions.json
const INITIAL_POSTS: GeneratedPost[] = REAL_FINAL_CAPTIONS.captions.map((cap, idx) => ({
  id: `post_real_${idx + 1}`,
  templateAssetId: `asset_job_${idx + 1}`,
  photo_id: cap.photo_id,
  platform: (['instagram', 'tiktok', 'x', 'linkedin'] as const)[idx % 4],
  title: `${cap.day} — ${idx === 0 ? 'Product Showcase' : idx === 1 ? 'Behind the Scenes' : idx === 2 ? 'Social Proof' : 'Weekend Promo'}`,
  caption: cap.caption_body,
  hook: cap.hook,
  callToAction: cap.call_to_action,
  hashtags: cap.hashtags,
  day: cap.day,
  format: cap.format,
  full_text: cap.full_text,
  bestTimeToPost: `${cap.day} @ 18:00`,
  status: cap.is_approved ? 'scheduled' : 'draft',
  scheduledDate: new Date(Date.now() + (idx + 1) * 86400000).toISOString(),
  engagementPrediction: 94 + (idx % 4),
  is_approved: cap.is_approved || 0
}));

export default function App() {
  const [user, setUser] = useState<GoogleUserProfile>(INITIAL_USER);
  const [currentTab, setCurrentTab] = useState<'pipeline' | 'queue' | 'canva' | 'scripts'>('pipeline');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);
  const [remoteUrl, setRemoteUrl] = useState('http://100.109.84.6:8000');
  const [isMuted, setIsMuted] = useState(false);

  // Real App State - initialized with user's real bot outputs!
  const [onboardingData, setOnboardingData] = useState<OnboardingAnswers>(DEFAULT_ONBOARDING);
  const [strategyPlan, setStrategyPlan] = useState<WeeklyStrategyPlan | null>(REAL_WEEKLY_STRATEGY);
  const [canvaAssets, setCanvaAssets] = useState<CanvaTemplateAsset[]>(INITIAL_ASSETS);
  const [posts, setPosts] = useState<GeneratedPost[]>(INITIAL_POSTS);

  // Real Backend Health State
  const [backendHealth, setBackendHealth] = useState<BackendHealth | null>(null);

  const isStaticGitHubPages =
    typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

  const checkHealth = async () => {
    if (isStaticGitHubPages) return;
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data);
      }
    } catch {
      // Backend starting up or static deployment
    }
  };

  useEffect(() => {
    if (isStaticGitHubPages) return;
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [isStaticGitHubPages]);

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

  const handleFilesUploaded = (files: { [filename: string]: string }) => {
    // If user dropped weekly_strategy_plan.json
    if (files['weekly_strategy_plan.json']) {
      try {
        const plan = JSON.parse(files['weekly_strategy_plan.json']);
        setStrategyPlan(plan);
      } catch (e) {
        console.error('Invalid weekly_strategy_plan.json', e);
      }
    }
    // If user dropped designer_output_specs.json
    if (files['designer_output_specs.json']) {
      try {
        const specs = JSON.parse(files['designer_output_specs.json']);
        if (specs && specs.design_jobs && Array.isArray(specs.design_jobs)) {
          const assets: CanvaTemplateAsset[] = specs.design_jobs.map((job: any, idx: number) => ({
            id: `asset_drop_${idx + 1}`,
            title: `Job #${idx + 1}: ${job.format}`,
            format: job.dimensions?.height === 1080 ? '1080x1080' : '1080x1920',
            formatName: job.format,
            bgColor: '#FFF066',
            accentColor: '#2D5A27',
            badgeText: `★ JOB ${idx + 1} ★`,
            headline: job.modifications?.find((m: any) => m.name === 'headline_text')?.text || 'SIMPLY LEMON',
            subheadline: job.modifications?.find((m: any) => m.name === 'subtext')?.text || 'Artisanal Craft Freshness',
            layoutType: 'retro-card',
            canvaTemplateId: job.template_id,
            canvaEditUrl: `https://www.canva.com/design/DAF-LEMON-${idx + 1}/edit`,
            tags: ['Simply Lemon', 'Artisanal'],
            photo_id: job.photo_id,
            rawJob: job
          }));
          setCanvaAssets(assets);
        } else if (Array.isArray(specs)) {
          setCanvaAssets(specs);
        }
      } catch (e) {
        console.error('Invalid designer_output_specs.json', e);
      }
    }
    // If user dropped final_copy_captions.json
    if (files['final_copy_captions.json']) {
      try {
        const copy = JSON.parse(files['final_copy_captions.json']);
        if (copy && copy.captions && Array.isArray(copy.captions)) {
          const newPosts: GeneratedPost[] = copy.captions.map((cap: any, idx: number) => ({
            id: `post_drop_${Date.now()}_${idx + 1}`,
            templateAssetId: `asset_job_${idx + 1}`,
            photo_id: cap.photo_id,
            platform: (['instagram', 'tiktok', 'x', 'linkedin'] as const)[idx % 4],
            title: `${cap.day} Launch`,
            caption: cap.caption_body,
            hook: cap.hook,
            callToAction: cap.call_to_action,
            hashtags: cap.hashtags || [],
            day: cap.day,
            format: cap.format,
            full_text: cap.full_text,
            bestTimeToPost: `${cap.day} @ 18:00`,
            status: cap.is_approved ? 'scheduled' : 'draft',
            scheduledDate: new Date(Date.now() + (idx + 1) * 86400000).toISOString(),
            engagementPrediction: 95,
            is_approved: cap.is_approved || 0
          }));
          setPosts(newPosts);
        } else if (Array.isArray(copy)) {
          setPosts(copy);
        }
      } catch (e) {
        console.error('Invalid final_copy_captions.json', e);
      }
    }
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
            setOnboardingData={setOnboardingData}
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
            onOpenBridgeModal={() => setIsBridgeModalOpen(true)}
            remoteUrl={remoteUrl}
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

      {/* SSH Host & Python Backend Bridge Modal */}
      <BackendBridgeModal
        isOpen={isBridgeModalOpen}
        onClose={() => setIsBridgeModalOpen(false)}
        remoteUrl={remoteUrl}
        setRemoteUrl={setRemoteUrl}
        onFilesUploaded={handleFilesUploaded}
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
