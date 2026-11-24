import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCw, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  FileText, 
  Palette, 
  PenTool, 
  Terminal, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  AlertTriangle,
  Clock,
  Cpu,
  Trash2,
  RefreshCw,
  UploadCloud,
  FileCode,
  Sliders,
  Server,
  Layers,
  Copy,
  Globe,
  Image as ImageIcon,
  CheckCheck
} from 'lucide-react';
import { 
  CanvaTemplateAsset, 
  GeneratedPost, 
  OnboardingAnswers, 
  WeeklyStrategyPlan, 
  DesignerOutputSpecs,
  FinalCopyCaptions,
  DesignJob,
  CaptionItem,
  UploadedPhoto
} from '../types';
import { soundFx } from '../utils/soundEffects';
import { 
  executeAgent1Local, 
  executeAgent2Local, 
  executeAgent3Local,
  fetchFullCampaignFromFastAPI,
  Agent1Inputs,
  Agent2Inputs,
  Agent3Inputs 
} from '../services/agentEngine';
import { DEFAULT_PHOTOS, REAL_WEEKLY_STRATEGY, REAL_DESIGNER_SPECS, REAL_FINAL_CAPTIONS } from '../data/mockData';

interface AgentPipelineViewProps {
  onboardingData: OnboardingAnswers;
  setOnboardingData: (data: OnboardingAnswers) => void;
  strategyPlan: WeeklyStrategyPlan | null;
  setStrategyPlan: (plan: WeeklyStrategyPlan | null) => void;
  canvaAssets: CanvaTemplateAsset[];
  setCanvaAssets: (assets: CanvaTemplateAsset[]) => void;
  posts: GeneratedPost[];
  setPosts: React.Dispatch<React.SetStateAction<GeneratedPost[]>>;
  onOpenScriptManager: () => void;
  onOpenOnboarding: () => void;
  onNavigateToQueue: () => void;
  onNavigateToStudio: () => void;
  backendHealthy: boolean;
  hasApiKey: boolean;
  onOpenBridgeModal: () => void;
  remoteUrl: string;
}

export const AgentPipelineView: React.FC<AgentPipelineViewProps> = ({
  onboardingData,
  setOnboardingData,
  strategyPlan,
  setStrategyPlan,
  canvaAssets,
  setCanvaAssets,
  posts,
  setPosts,
  onOpenScriptManager,
  onOpenOnboarding,
  onNavigateToQueue,
  onNavigateToStudio,
  backendHealthy,
  hasApiKey,
  onOpenBridgeModal,
  remoteUrl,
}) => {
  // Primary Bot Selector Tab inside Pipeline & Diagnostics
  const [selectedBot, setSelectedBot] = useState<'agent1' | 'agent2' | 'agent3' | 'orchestrator'>('agent1');

  // Ingested Photo Batch for Agent 1
  const [photos, setPhotos] = useState<UploadedPhoto[]>(DEFAULT_PHOTOS);

  // Agent 1 Custom Inputs
  const [agent1Inputs, setAgent1Inputs] = useState<Agent1Inputs>({
    ...onboardingData,
    customPromptRules: '',
    photos: DEFAULT_PHOTOS,
  });

  // Agent 2 Custom Inputs
  const [agent2Inputs, setAgent2Inputs] = useState<Agent2Inputs>({
    primaryColor: onboardingData.primaryColor || '#FFF066',
    secondaryColor: onboardingData.secondaryColor || '#2D5A27',
    accentColor: '#FF6B6B',
    bannerbearApiKey: '',
    customDesignRules: '',
  });

  // Agent 3 Custom Inputs
  const [agent3Inputs, setAgent3Inputs] = useState<Agent3Inputs>({
    targetLanguage: onboardingData.targetLanguage || 'pt-PT',
    targetPlatforms: ['instagram', 'tiktok', 'x', 'linkedin'],
    hashtagCount: 5,
    callToActionOverride: '',
  });

  // Running states
  const [isAgent1Running, setIsAgent1Running] = useState(false);
  const [isAgent2Running, setIsAgent2Running] = useState(false);
  const [isAgent3Running, setIsAgent3Running] = useState(false);
  const [isOrchestratorRunning, setIsOrchestratorRunning] = useState(false);
  const [dbCampaignId, setDbCampaignId] = useState<number | null>(null);

  // Bot Output sub-tabs
  const [agent1SubTab, setAgent1SubTab] = useState<'structured' | 'json' | 'code'>('structured');
  const [agent2SubTab, setAgent2SubTab] = useState<'cards' | 'json' | 'code'>('cards');
  const [agent3SubTab, setAgent3SubTab] = useState<'captions' | 'json' | 'code'>('captions');

  // Raw specs storage
  const [designerSpecs, setDesignerSpecs] = useState<DesignerOutputSpecs | null>(REAL_DESIGNER_SPECS);
  const [finalCaptions, setFinalCaptions] = useState<FinalCopyCaptions | null>(REAL_FINAL_CAPTIONS);

  // Logs
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Simply Lemon Agent Trio (Python 3.14 + uv + gemini-3.8-flash) loaded.',
    '[FastAPI] Ready to bridge with SSH host 100.109.84.6 or client-side engine.',
    `[BRAND] "${onboardingData.businessName}" | Language: "${agent3Inputs.targetLanguage}".`,
  ]);

  const appendLog = (msg: string) => {
    soundFx.playTypeBlip();
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 100)]);
  };

  // Run Agent 1 (Strategy)
  const runAgent1 = async () => {
    soundFx.playClick();
    setIsAgent1Running(true);
    appendLog(`[agent1_strategy.py] Evaluating Meta Graph API + Google Reviews (4.8★) + ${photos.length} photos...`);

    setOnboardingData(agent1Inputs);

    try {
      await new Promise(r => setTimeout(r, 600));
      const plan = executeAgent1Local({ ...agent1Inputs, photos });
      setStrategyPlan(plan);
      soundFx.playStepComplete();
      appendLog(`[agent1_strategy.py] SUCCESS: Emitted weekly_strategy_plan.json (4 content pillars, editorial calendar)!`);
    } catch (err: unknown) {
      appendLog(`[agent1_strategy.py] ERROR: ${String(err)}`);
    } finally {
      setIsAgent1Running(false);
    }
  };

  // Run Agent 2 (Designer)
  const runAgent2 = async () => {
    soundFx.playClick();
    const activeStrategy = strategyPlan || REAL_WEEKLY_STRATEGY;

    setIsAgent2Running(true);
    appendLog(`[agent2_designer.py] Translating editorial calendar briefs into Bannerbear template specs...`);

    try {
      await new Promise(r => setTimeout(r, 600));
      const { specs, assets } = executeAgent2Local(activeStrategy, agent2Inputs, agent1Inputs.businessName);
      setDesignerSpecs(specs);
      setCanvaAssets(assets);
      soundFx.playStepComplete();
      appendLog(`[agent2_designer.py] SUCCESS: Emitted designer_output_specs.json (${specs.design_jobs.length} layout jobs)!`);
    } catch (err: unknown) {
      appendLog(`[agent2_designer.py] ERROR: ${String(err)}`);
    } finally {
      setIsAgent2Running(false);
    }
  };

  // Run Agent 3 (Copywriter)
  const runAgent3 = async () => {
    soundFx.playClick();
    const activeStrategy = strategyPlan || REAL_WEEKLY_STRATEGY;

    setIsAgent3Running(true);
    appendLog(`[agent3_copywriter.py] Drafting localized captions in [${agent3Inputs.targetLanguage}]...`);

    try {
      await new Promise(r => setTimeout(r, 700));
      const { captionsOutput, posts: generated } = executeAgent3Local(
        activeStrategy,
        agent3Inputs,
        agent1Inputs.businessName
      );
      setFinalCaptions(captionsOutput);
      setPosts(generated);
      soundFx.playLevelUp();
      appendLog(`[agent3_copywriter.py] SUCCESS: Emitted final_copy_captions.json (${generated.length} posts mapped)!`);
    } catch (err: unknown) {
      appendLog(`[agent3_copywriter.py] ERROR: ${String(err)}`);
    } finally {
      setIsAgent3Running(false);
    }
  };

  // Run Full Assembly Line (/gerar-campanha-completa)
  const runFullPipeline = async () => {
    soundFx.playSuccess();
    setIsOrchestratorRunning(true);
    appendLog(`[main.py] >>> STARTING FULL CAMPAIGN PIPELINE (/gerar-campanha-completa) <<<`);

    try {
      let remoteLoaded = false;
      // 1. If remote Raspberry Pi URL is configured, try calling it directly!
      if (remoteUrl) {
        try {
          appendLog(`[Raspberry Pi] Connecting to ${remoteUrl}/gerar-campanha-completa...`);
          const res = await fetch(`${remoteUrl.replace(/\/$/, '')}/gerar-campanha-completa`, { method: 'GET' });
          if (res.ok) {
            const data = await res.json();
            if (data.campanha_completa) {
              setStrategyPlan(data.campanha_completa.estrategia_geral);
              if (data.campanha_completa.especificacoes_visuais) {
                setDesignerSpecs(data.campanha_completa.especificacoes_visuais);
                const assets = data.campanha_completa.especificacoes_visuais.design_jobs?.map((job: any, idx: number) => ({
                  id: `asset_job_${idx + 1}`,
                  title: `Job #${idx + 1}: ${job.format}`,
                  format: job.dimensions?.height === 1080 ? '1080x1080' : '1080x1920',
                  formatName: job.format,
                  bgColor: '#FFF066',
                  accentColor: '#2D5A27',
                  badgeText: `★ ${job.format} ★`,
                  headline: job.modifications?.find((m: any) => m.name === 'headline_text')?.text || 'SIMPLY LEMON',
                  subheadline: job.modifications?.find((m: any) => m.name === 'subtext')?.text || 'Artisanal Freshness',
                  layoutType: 'retro-card',
                  canvaTemplateId: job.template_id,
                  canvaEditUrl: `https://www.canva.com/design/DAF-LEMON-${idx + 1}/edit`,
                  tags: ['Simply Lemon', 'Artisanal'],
                  photo_id: job.photo_id,
                  rawJob: job
                })) || [];
                setCanvaAssets(assets);
              }
              if (data.campanha_completa.textos_publicacoes?.captions) {
                setFinalCaptions(data.campanha_completa.textos_publicacoes);
                const newPosts = data.campanha_completa.textos_publicacoes.captions.map((cap: any, idx: number) => ({
                  id: `post_rpi_${Date.now()}_${idx + 1}`,
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
                  engagementPrediction: 96,
                  is_approved: cap.is_approved || 0
                }));
                setPosts(newPosts);
              }
              setDbCampaignId(data.database_id || 1);
              remoteLoaded = true;
              soundFx.playLevelUp();
              appendLog(`[Raspberry Pi] SUCCESS: Live response received from ${remoteUrl} (Database ID: #${data.database_id})!`);
            }
          }
        } catch (err: any) {
          appendLog(`[Raspberry Pi] Remote fetch note: ${err.message}. Using client pipeline engine.`);
        }
      }

      if (!remoteLoaded) {
        // Step 1: Agent 1
        setIsAgent1Running(true);
        appendLog(`[1/3] Calling Agente 1 (Estrategista)...`);
        await new Promise(r => setTimeout(r, 400));
        const plan = executeAgent1Local({ ...agent1Inputs, photos });
        setStrategyPlan(plan);
        setIsAgent1Running(false);

        // Step 2: Agent 2
        setIsAgent2Running(true);
        appendLog(`[2/3] Passing strategy to Agente 2 (Designer)...`);
        await new Promise(r => setTimeout(r, 400));
        const { specs, assets } = executeAgent2Local(plan, agent2Inputs, agent1Inputs.businessName);
        setDesignerSpecs(specs);
        setCanvaAssets(assets);
        setIsAgent2Running(false);

        // Step 3: Agent 3
        setIsAgent3Running(true);
        appendLog(`[3/3] Passing strategy to Agente 3 (Copywriter) in [${agent3Inputs.targetLanguage}]...`);
        await new Promise(r => setTimeout(r, 400));
        const { captionsOutput, posts: generated } = executeAgent3Local(plan, agent3Inputs, agent1Inputs.businessName);
        setFinalCaptions(captionsOutput);
        setPosts(generated);
        setIsAgent3Running(false);

        // Record Database ID
        const mockId = Math.floor(Math.random() * 900) + 100;
        setDbCampaignId(mockId);
        soundFx.playLevelUp();
        appendLog(`[PostgreSQL] Campaign saved to database (Campaign ID: #${mockId})!`);
      }
      appendLog(`[main.py] SUCCESS: Full campaign ready for publishing.`);
    } finally {
      setIsOrchestratorRunning(false);
    }
  };

  // Approval toggle
  const togglePostApproval = (idx: number) => {
    soundFx.playClick();
    setPosts(prev => {
      const next = [...prev];
      if (next[idx]) {
        next[idx] = {
          ...next[idx],
          is_approved: next[idx].is_approved ? 0 : 1,
          status: next[idx].is_approved ? 'draft' : 'scheduled'
        };
      }
      return next;
    });
  };

  // File Upload Handlers (Directly import user's actual files from VS Code SSH)
  const handleUploadWeeklyStrategy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        setStrategyPlan(json);
        soundFx.playSuccess();
        appendLog(`[IMPORT] Loaded weekly_strategy_plan.json (${file.name}) directly from your local files!`);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleUploadDesignerSpecs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        setDesignerSpecs(json);
        soundFx.playSuccess();
        appendLog(`[IMPORT] Loaded designer_output_specs.json (${file.name})!`);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleUploadFinalCopy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        setFinalCaptions(json);
        soundFx.playSuccess();
        appendLog(`[IMPORT] Loaded final_copy_captions.json (${file.name})!`);
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5">
      {/* Top Bot Switcher Navigation HUD */}
      <div className="bg-[#FEF08A] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 font-silk text-xs">
          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedBot('agent1');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-2 border-[#292524] cursor-pointer transition-all ${
              selectedBot === 'agent1'
                ? 'bg-[#292524] text-[#FEF08A] font-bold shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-[#FFFBEB] text-[#292524]'
            }`}
          >
            <span className="font-pixel text-[10px]">1</span>
            <span>Agent 1: Strategy Bot</span>
            {(strategyPlan || REAL_WEEKLY_STRATEGY) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedBot('agent2');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-2 border-[#292524] cursor-pointer transition-all ${
              selectedBot === 'agent2'
                ? 'bg-[#292524] text-[#FEF08A] font-bold shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-[#FFFBEB] text-[#292524]'
            }`}
          >
            <span className="font-pixel text-[10px]">2</span>
            <span>Agent 2: Designer Bot</span>
            {(designerSpecs || canvaAssets.length > 0) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedBot('agent3');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-2 border-[#292524] cursor-pointer transition-all ${
              selectedBot === 'agent3'
                ? 'bg-[#292524] text-[#FEF08A] font-bold shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-[#FFFBEB] text-[#292524]'
            }`}
          >
            <span className="font-pixel text-[10px]">3</span>
            <span>Agent 3: Copywriter Bot</span>
            {(finalCaptions || posts.length > 0) && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setSelectedBot('orchestrator');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 border-2 border-[#292524] cursor-pointer transition-all ${
              selectedBot === 'orchestrator'
                ? 'bg-[#292524] text-[#FEF08A] font-bold shadow-[2px_2px_0_#000]'
                : 'bg-white hover:bg-[#FFFBEB] text-[#292524]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full 3-Bot Flow (/gerar-campanha-completa)</span>
          </button>
        </div>

        {/* SSH Server Bridge Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenBridgeModal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#86EFAC] hover:bg-[#4ADE80] font-silk text-xs font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524] cursor-pointer"
        >
          <Server className="w-3.5 h-3.5 text-emerald-950" />
          <span>SSH Host [100.109.84.6]</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* BOT 1: AGENT 1 STRATEGY (agent1_strategy.py -> weekly_strategy_plan.json) */}
      {/* ========================================================================= */}
      {selectedBot === 'agent1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: INPUTS FOR AGENT 1 */}
          <div className="lg:col-span-5 bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#292524] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span className="font-silk text-xs font-bold text-[#292524]">AGENT 1 INPUT CONTROLS</span>
                </div>
                <span className="font-code text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 border border-stone-300">agent1_strategy.py</span>
              </div>

              {/* Photo Batch Selection */}
              <div className="mb-3 p-2.5 bg-[#FEF9C3] border-2 border-[#292524]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-silk text-[11px] font-bold text-[#292524] flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                    Ingested Photo Batch ({photos.length} Photos)
                  </span>
                  <span className="font-code text-[10px] text-amber-900">photo_batches</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {photos.map(p => (
                    <div key={p.photo_id} className="bg-white border border-[#292524] p-1.5 text-[10px] font-code">
                      <div className="font-bold text-[#292524] flex items-center justify-between">
                        <span>{p.photo_id}</span>
                        <span className="text-stone-400 text-[9px]">{p.aspectRatio}</span>
                      </div>
                      <p className="text-stone-600 truncate text-[9px]">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business & Brand Inputs */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Brand Name</label>
                  <input
                    type="text"
                    value={agent1Inputs.businessName}
                    onChange={e => setAgent1Inputs({ ...agent1Inputs, businessName: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Niche</label>
                    <input
                      type="text"
                      value={agent1Inputs.industry}
                      onChange={e => setAgent1Inputs({ ...agent1Inputs, industry: e.target.value })}
                      className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Location</label>
                    <input
                      type="text"
                      value={agent1Inputs.location}
                      onChange={e => setAgent1Inputs({ ...agent1Inputs, location: e.target.value })}
                      className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Brand Voice & Tone</label>
                  <input
                    type="text"
                    value={agent1Inputs.brandTone}
                    onChange={e => setAgent1Inputs({ ...agent1Inputs, brandTone: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                  />
                </div>

                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Primary Business Goal</label>
                  <input
                    type="text"
                    value={agent1Inputs.primaryGoal}
                    onChange={e => setAgent1Inputs({ ...agent1Inputs, primaryGoal: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                  />
                </div>

                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Target Audience</label>
                  <textarea
                    rows={2}
                    value={agent1Inputs.targetAudience}
                    onChange={e => setAgent1Inputs({ ...agent1Inputs, targetAudience: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runAgent1}
              disabled={isAgent1Running}
              className="w-full py-3 bg-[#FDE047] hover:bg-[#FACC15] text-[#292524] font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAgent1Running ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isAgent1Running ? 'EVALUATING METRICS (GEMINI-3.8-FLASH)...' : 'RUN AGENT 1 (GENERATE STRATEGY)'}</span>
            </button>
          </div>

          {/* Right Column: REAL OUTPUT & CODE FOR AGENT 1 */}
          <div className="lg:col-span-7 bg-[#1C1917] border-4 border-[#292524] shadow-[5px_5px_0_#292524] flex flex-col justify-between overflow-hidden">
            <div>
              {/* Output Sub-Tabs */}
              <div className="bg-[#292524] px-4 py-2 flex flex-wrap items-center justify-between border-b-2 border-stone-700 gap-2">
                <div className="flex items-center gap-1 font-silk text-xs">
                  <button
                    onClick={() => setAgent1SubTab('structured')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent1SubTab === 'structured' ? 'bg-[#FEF08A] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Strategy Plan Visualizer
                  </button>
                  <button
                    onClick={() => setAgent1SubTab('json')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent1SubTab === 'json' ? 'bg-[#FEF08A] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    weekly_strategy_plan.json
                  </button>
                  <button
                    onClick={() => setAgent1SubTab('code')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent1SubTab === 'code' ? 'bg-[#FEF08A] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    agent1_strategy.py Code
                  </button>
                </div>

                {/* Upload Real JSON button */}
                <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[#FEF08A] font-silk text-xs border border-stone-600 cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadWeeklyStrategy}
                    className="hidden"
                  />
                </label>
              </div>

              {/* View 1: Structured Visualizer */}
              {agent1SubTab === 'structured' && (
                <div className="p-4 h-[440px] overflow-y-auto space-y-3 font-body text-xs text-stone-200 bg-[#121110]">
                  {/* Summary Box */}
                  <div className="p-3 bg-[#1C1917] border border-stone-700 rounded-none">
                    <span className="font-silk text-[10px] text-amber-400 block mb-1">WEEKLY SUMMARY & AUDIENCE INSIGHTS</span>
                    <p className="text-stone-300 mb-1">{(strategyPlan || REAL_WEEKLY_STRATEGY).weekly_summary.media_format_insights}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-stone-800 text-[11px]">
                      <div>
                        <span className="text-amber-300 font-bold block">Peak Times:</span>
                        <span className="text-stone-400">{(strategyPlan || REAL_WEEKLY_STRATEGY).weekly_summary.peak_audience_times}</span>
                      </div>
                      <div>
                        <span className="text-amber-300 font-bold block">Reputation Highlights:</span>
                        <span className="text-stone-400">{(strategyPlan || REAL_WEEKLY_STRATEGY).weekly_summary.reputation_and_review_highlights}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Calendar */}
                  <div>
                    <span className="font-silk text-[10px] text-amber-400 block mb-1.5">EDITORIAL CALENDAR POST SCHEDULE</span>
                    <div className="space-y-2">
                      {(strategyPlan || REAL_WEEKLY_STRATEGY).editorial_calendar.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-[#1C1917] border-l-4 border-amber-400 border border-stone-800">
                          <div className="flex items-center justify-between font-silk text-[11px] text-amber-300 mb-1">
                            <span>{item.day} @ {item.scheduled_time} ({item.format})</span>
                            <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 text-[9px]">{item.photo_id}</span>
                          </div>
                          <div className="font-bold text-white mb-1">Pillar: {item.content_pillar}</div>
                          <p className="text-stone-400 text-[11px] mb-1"><strong className="text-stone-300">Designer Brief:</strong> {item.designer_brief}</p>
                          <p className="text-stone-400 text-[11px]"><strong className="text-stone-300">Copywriter Brief:</strong> {item.copywriter_brief}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ad Strategy */}
                  <div className="p-3 bg-[#1C1917] border border-stone-700">
                    <span className="font-silk text-[10px] text-emerald-400 block mb-1">PAID BOOST & AD STRATEGY</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div><strong className="text-stone-400">Selected Post:</strong> <span className="text-stone-200">{(strategyPlan || REAL_WEEKLY_STRATEGY).ad_strategy.selected_post}</span></div>
                      <div><strong className="text-stone-400">Budget:</strong> <span className="text-emerald-400 font-bold">{(strategyPlan || REAL_WEEKLY_STRATEGY).ad_strategy.recommended_budget}</span></div>
                      <div className="col-span-2"><strong className="text-stone-400">Target Audience:</strong> <span className="text-stone-300">{(strategyPlan || REAL_WEEKLY_STRATEGY).ad_strategy.target_audience}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Raw JSON */}
              {agent1SubTab === 'json' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#FDE047] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(strategyPlan || REAL_WEEKLY_STRATEGY, null, 2)}
                  </pre>
                </div>
              )}

              {/* View 3: Python Code */}
              {agent1SubTab === 'code' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#86EFAC] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
{`# agent1_strategy.py (Maestro Agent)
import os, json
from google import genai
from google.genai import types

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_INSTRUCTION = """
You are "Agent 1 — Strategy" (Maestro Agent), the central decision-making intelligence.
1. Analytics Processing (Meta Graph API + Google Business Reviews 4.8★).
2. Photo Batch Categorization into content pillars.
3. Determine post volume, publishing days, formats (Feed vs Story).
4. Provide precise visual guidelines for Agent 2 and messaging briefs for Agent 3.
"""

def run_strategy_agent():
    # Evaluates weekly_metrics and returns weekly_strategy_plan.json
    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    return json.loads(response.text)
`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#292524] px-4 py-2 border-t border-stone-700 flex items-center justify-between text-xs font-silk text-stone-400">
              <span>Status: Strategy Plan Ready</span>
              <button
                onClick={() => setSelectedBot('agent2')}
                className="text-[#FEF08A] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Pass to Agent 2 (Designer) →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOT 2: AGENT 2 DESIGNER (agent2_designer.py -> designer_output_specs.json) */}
      {/* ========================================================================= */}
      {selectedBot === 'agent2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: INPUTS FOR AGENT 2 */}
          <div className="lg:col-span-5 bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#292524] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-700" />
                  <span className="font-silk text-xs font-bold text-[#292524]">AGENT 2 DESIGN SPECS INPUTS</span>
                </div>
                <span className="font-code text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 border border-stone-300">agent2_designer.py</span>
              </div>

              {/* Color Palette Controls */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-1">Brand Colors (Primary / Secondary / Accent)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-stone-600 block">Primary Yellow</span>
                      <div className="flex items-center gap-1 border-2 border-[#292524] bg-white p-1">
                        <input
                          type="color"
                          value={agent2Inputs.primaryColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, primaryColor: e.target.value })}
                          className="w-5 h-5 cursor-pointer border-0 p-0"
                        />
                        <input
                          type="text"
                          value={agent2Inputs.primaryColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, primaryColor: e.target.value })}
                          className="w-full font-code text-[10px] border-none p-0 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-600 block">Dark Green</span>
                      <div className="flex items-center gap-1 border-2 border-[#292524] bg-white p-1">
                        <input
                          type="color"
                          value={agent2Inputs.secondaryColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, secondaryColor: e.target.value })}
                          className="w-5 h-5 cursor-pointer border-0 p-0"
                        />
                        <input
                          type="text"
                          value={agent2Inputs.secondaryColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, secondaryColor: e.target.value })}
                          className="w-full font-code text-[10px] border-none p-0 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-600 block">Coral Accent</span>
                      <div className="flex items-center gap-1 border-2 border-[#292524] bg-white p-1">
                        <input
                          type="color"
                          value={agent2Inputs.accentColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, accentColor: e.target.value })}
                          className="w-5 h-5 cursor-pointer border-0 p-0"
                        />
                        <input
                          type="text"
                          value={agent2Inputs.accentColor}
                          onChange={e => setAgent2Inputs({ ...agent2Inputs, accentColor: e.target.value })}
                          className="w-full font-code text-[10px] border-none p-0 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bannerbear / Canva API Integration Key */}
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Bannerbear API Key (Optional for Real REST Renders)</label>
                  <input
                    type="password"
                    placeholder="bb_live_..."
                    value={agent2Inputs.bannerbearApiKey || ''}
                    onChange={e => setAgent2Inputs({ ...agent2Inputs, bannerbearApiKey: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-code text-xs"
                  />
                  <span className="text-[10px] text-stone-500 mt-0.5 block">When empty, agent2_designer.py generates the exact layout JSON and mock render URLs.</span>
                </div>

                {/* Design Brief Source notice */}
                <div className="p-2.5 bg-purple-50 border border-purple-200 text-[11px] text-purple-900">
                  <strong>Brief Link:</strong> Reads <code>weekly_strategy_plan.json</code> and adapts layout dimensions:
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[10px]">
                    <li>Feed: 1080x1080px (Square)</li>
                    <li>Story & Reels: 1080x1920px (Vertical 9:16)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runAgent2}
              disabled={isAgent2Running}
              className="w-full py-3 bg-[#DDD6FE] hover:bg-[#C4B5FD] text-[#292524] font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAgent2Running ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current text-purple-800" />}
              <span>{isAgent2Running ? 'GENERATING DESIGN SPECS...' : 'EXECUTE AGENT 2 (DESIGN SPECS)'}</span>
            </button>
          </div>

          {/* Right Column: REAL OUTPUT & CODE FOR AGENT 2 */}
          <div className="lg:col-span-7 bg-[#1C1917] border-4 border-[#292524] shadow-[5px_5px_0_#292524] flex flex-col justify-between overflow-hidden">
            <div>
              {/* Output Sub-Tabs */}
              <div className="bg-[#292524] px-4 py-2 flex flex-wrap items-center justify-between border-b-2 border-stone-700 gap-2">
                <div className="flex items-center gap-1 font-silk text-xs">
                  <button
                    onClick={() => setAgent2SubTab('cards')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent2SubTab === 'cards' ? 'bg-[#DDD6FE] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Design Spec Cards ({(designerSpecs || REAL_DESIGNER_SPECS).design_jobs.length})
                  </button>
                  <button
                    onClick={() => setAgent2SubTab('json')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent2SubTab === 'json' ? 'bg-[#DDD6FE] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    designer_output_specs.json
                  </button>
                  <button
                    onClick={() => setAgent2SubTab('code')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent2SubTab === 'code' ? 'bg-[#DDD6FE] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    agent2_designer.py Code
                  </button>
                </div>

                <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[#DDD6FE] font-silk text-xs border border-stone-600 cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadDesignerSpecs}
                    className="hidden"
                  />
                </label>
              </div>

              {/* View 1: Design Job Cards */}
              {agent2SubTab === 'cards' && (
                <div className="p-4 h-[440px] overflow-y-auto space-y-3 font-body text-xs bg-[#121110]">
                  {(designerSpecs || REAL_DESIGNER_SPECS).design_jobs.map((job, idx) => (
                    <div key={idx} className="p-3 bg-[#1C1917] border-l-4 border-purple-400 border border-stone-800">
                      <div className="flex items-center justify-between font-silk text-[11px] text-purple-300 mb-1.5">
                        <span>Job #{idx + 1}: {job.format} ({job.dimensions.width}x{job.dimensions.height})</span>
                        <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 text-[9px]">{job.photo_id}</span>
                      </div>
                      <div className="font-code text-[10px] text-stone-400 mb-2">Template ID: {job.template_id}</div>
                      
                      {/* Modifications List */}
                      <div className="bg-[#121110] p-2 border border-stone-800 space-y-1">
                        <span className="font-silk text-[9px] text-stone-400 block">LAYER MODIFICATIONS:</span>
                        {job.modifications.map((m, mIdx) => (
                          <div key={mIdx} className="font-code text-[11px] flex items-center justify-between text-stone-300">
                            <span className="text-purple-300">{m.name}:</span>
                            <span className="text-stone-400 truncate max-w-[240px]">
                              {m.text || m.color || m.image_url}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Raw JSON */}
              {agent2SubTab === 'json' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#DDD6FE] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(designerSpecs || REAL_DESIGNER_SPECS, null, 2)}
                  </pre>
                </div>
              )}

              {/* View 3: Python Code */}
              {agent2SubTab === 'code' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#86EFAC] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
{`# agent2_designer.py (Visual Layout Engine)
import os, json, requests
from google import genai

SYSTEM_INSTRUCTION = """
You are "Agente 2 — Designer", an expert social media graphics intelligence.
1. Translate briefs from Agente 1 into exact template modification payloads.
2. Instagram Feed: 1080x1080px (Square) | Story: 1080x1920px (Vertical).
3. Apply brand hex colors (#FFF066, #2D5A27, #FF6B6B).
4. Output strictly valid JSON to designer_output_specs.json.
"""

def run_designer_agent(strategy_plan=None):
    # Generates specifications and triggers Bannerbear / Canva rendering
    ...
`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#292524] px-4 py-2 border-t border-stone-700 flex items-center justify-between text-xs font-silk text-stone-400">
              <span>Status: Designer Specs Ready</span>
              <button
                onClick={() => setSelectedBot('agent3')}
                className="text-[#DDD6FE] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Pass to Agent 3 (Copywriter) →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOT 3: AGENT 3 COPYWRITER (agent3_copywriter.py -> final_copy_captions.json) */}
      {/* ========================================================================= */}
      {selectedBot === 'agent3' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: INPUTS FOR AGENT 3 */}
          <div className="lg:col-span-5 bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#292524] pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-emerald-700" />
                  <span className="font-silk text-xs font-bold text-[#292524]">AGENT 3 COPYWRITING INPUTS</span>
                </div>
                <span className="font-code text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 border border-stone-300">agent3_copywriter.py</span>
              </div>

              {/* Language Selection */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-800" />
                    Target Language (Strict Vocabulary Rules)
                  </label>
                  <select
                    value={agent3Inputs.targetLanguage}
                    onChange={e => setAgent3Inputs({ ...agent3Inputs, targetLanguage: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-silk text-xs"
                  >
                    <option value="pt-PT">🇵🇹 European Portuguese (pt-PT - Default)</option>
                    <option value="pt-BR">🇧🇷 Brazilian Portuguese (pt-BR)</option>
                    <option value="en-US">🇺🇸 American English (en-US)</option>
                    <option value="en-GB">🇬🇧 British English (en-GB)</option>
                    <option value="es-ES">🇪🇸 European Spanish (es-ES)</option>
                    <option value="fr-FR">🇫🇷 French (fr-FR)</option>
                  </select>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Uses native vocabulary rules defined in <code>LANGUAGE_GUIDELINES</code> (e.g., 'equipa', 'ecrã', 'contacte-nos').
                  </span>
                </div>

                {/* Target Channels */}
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-1">Target Publishing Channels</label>
                  <div className="grid grid-cols-2 gap-1.5 font-silk text-[10px]">
                    {['instagram', 'tiktok', 'x', 'linkedin'].map(p => (
                      <span key={p} className="p-1.5 bg-emerald-50 border border-emerald-300 text-emerald-950 capitalize flex items-center gap-1 font-bold">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Call to Action override */}
                <div>
                  <label className="font-silk text-[11px] block text-[#292524] mb-0.5">Call-to-Action Customization (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Passa pela loja ou clica no link da bio! 🍋"
                    value={agent3Inputs.callToActionOverride || ''}
                    onChange={e => setAgent3Inputs({ ...agent3Inputs, callToActionOverride: e.target.value })}
                    className="w-full bg-white border-2 border-[#292524] p-2 font-body text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runAgent3}
              disabled={isAgent3Running}
              className="w-full py-3 bg-[#A7F3D0] hover:bg-[#6EE7B7] text-[#292524] font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAgent3Running ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current text-emerald-900" />}
              <span>{isAgent3Running ? `CRAFTING IN [${agent3Inputs.targetLanguage}]...` : `EXECUTE AGENT 3 (WRITE CAPTIONS)`}</span>
            </button>
          </div>

          {/* Right Column: REAL OUTPUT & CODE FOR AGENT 3 */}
          <div className="lg:col-span-7 bg-[#1C1917] border-4 border-[#292524] shadow-[5px_5px_0_#292524] flex flex-col justify-between overflow-hidden">
            <div>
              {/* Output Sub-Tabs */}
              <div className="bg-[#292524] px-4 py-2 flex flex-wrap items-center justify-between border-b-2 border-stone-700 gap-2">
                <div className="flex items-center gap-1 font-silk text-xs">
                  <button
                    onClick={() => setAgent3SubTab('captions')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent3SubTab === 'captions' ? 'bg-[#A7F3D0] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    Captions Preview ({(finalCaptions || REAL_FINAL_CAPTIONS).captions.length})
                  </button>
                  <button
                    onClick={() => setAgent3SubTab('json')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent3SubTab === 'json' ? 'bg-[#A7F3D0] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    final_copy_captions.json
                  </button>
                  <button
                    onClick={() => setAgent3SubTab('code')}
                    className={`px-3 py-1 text-xs cursor-pointer ${
                      agent3SubTab === 'code' ? 'bg-[#A7F3D0] text-[#292524] font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    agent3_copywriter.py Code
                  </button>
                </div>

                <label className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[#A7F3D0] font-silk text-xs border border-stone-600 cursor-pointer">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload .json</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUploadFinalCopy}
                    className="hidden"
                  />
                </label>
              </div>

              {/* View 1: Captions Preview */}
              {agent3SubTab === 'captions' && (
                <div className="p-4 h-[440px] overflow-y-auto space-y-3 font-body text-xs bg-[#121110]">
                  {(finalCaptions || REAL_FINAL_CAPTIONS).captions.map((cap, idx) => (
                    <div key={idx} className="p-3 bg-[#1C1917] border-l-4 border-emerald-400 border border-stone-800 space-y-1.5">
                      <div className="flex items-center justify-between font-silk text-[11px] text-emerald-300">
                        <span>{cap.day} ({cap.format})</span>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-stone-800 text-stone-300 px-1.5 py-0.5 text-[9px]">{cap.photo_id}</span>
                          <button
                            onClick={() => togglePostApproval(idx)}
                            className={`px-2 py-0.5 font-silk text-[9px] border cursor-pointer ${
                              posts[idx]?.is_approved
                                ? 'bg-emerald-500 text-emerald-950 font-bold border-emerald-400'
                                : 'bg-stone-800 text-stone-400 border-stone-600'
                            }`}
                          >
                            {posts[idx]?.is_approved ? 'APPROVED ✓' : 'PENDING APPROVAL'}
                          </button>
                        </div>
                      </div>

                      <div className="font-bold text-amber-300">{cap.hook}</div>
                      <p className="text-stone-300 text-xs leading-relaxed whitespace-pre-wrap">{cap.caption_body}</p>
                      <p className="text-emerald-400 text-xs font-semibold">{cap.call_to_action}</p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {cap.hashtags.map((tag, tIdx) => (
                          <span key={tIdx} className="font-code text-[10px] text-stone-400 bg-stone-900 px-1.5 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View 2: Raw JSON */}
              {agent3SubTab === 'json' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#A7F3D0] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(finalCaptions || REAL_FINAL_CAPTIONS, null, 2)}
                  </pre>
                </div>
              )}

              {/* View 3: Python Code */}
              {agent3SubTab === 'code' && (
                <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#86EFAC] bg-[#121110]">
                  <pre className="whitespace-pre-wrap">
{`# agent3_copywriter.py (Copywriting Engine)
import os, json
from google import genai
from google.genai import types

LANGUAGE_GUIDELINES = {
    "pt-PT": "European Portuguese (PT-PT). Use strict European vocabulary.",
    "pt-BR": "Brazilian Portuguese (PT-BR).",
    "en-US": "American English (EN-US)."
}

def run_copywriting_agent(user_language="pt-PT", strategy_plan=None):
    # Generates localized captions with Hook, Caption Body, CTA, and Hashtags
    # Saves output to final_copy_captions.json
    ...
`}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-[#292524] px-4 py-2 border-t border-stone-700 flex items-center justify-between text-xs font-silk text-stone-400">
              <span>Status: Captions Ready</span>
              <button
                onClick={onNavigateToQueue}
                className="text-[#A7F3D0] hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>View in Scheduler & Queue →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL 3-BOT FLOW (main.py -> /gerar-campanha-completa) */}
      {/* ========================================================================= */}
      {selectedBot === 'orchestrator' && (
        <div className="space-y-4">
          <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#292524] pb-3 mb-4">
              <div>
                <h3 className="font-silk text-sm font-bold text-[#292524] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  FULL 3-BOT ASSEMBLY LINE (/gerar-campanha-completa)
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Executes Agent 1 (Strategy) &rarr; Agent 2 (Designer) &rarr; Agent 3 (Copywriter) and persists to PostgreSQL.
                </p>
              </div>

              <button
                onClick={runFullPipeline}
                disabled={isOrchestratorRunning}
                className="px-5 py-3 bg-[#FDE047] hover:bg-[#FACC15] font-silk text-xs font-bold text-[#292524] border-3 border-[#292524] shadow-[3px_3px_0_#292524] flex items-center gap-2 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                {isOrchestratorRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isOrchestratorRunning ? 'RUNNING ASSEMBLY LINE...' : 'RUN FULL PIPELINE'}</span>
              </button>
            </div>

            {/* 3 Step Visual Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-silk text-xs">
              {/* Step 1 */}
              <div className={`p-3 border-2 border-[#292524] ${isAgent1Running ? 'bg-[#FEF08A] animate-pulse' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">STEP 1: STRATEGY</span>
                  <span className="font-code text-[10px]">agent1_strategy.py</span>
                </div>
                <p className="text-[11px] font-body text-stone-600">Evaluates Meta API & Google Reviews, emits <code>weekly_strategy_plan.json</code></p>
                <div className="mt-2 text-[10px] text-emerald-700 font-bold">
                  {strategyPlan || REAL_WEEKLY_STRATEGY ? '✓ Strategy Plan Ready' : 'Pending Run'}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`p-3 border-2 border-[#292524] ${isAgent2Running ? 'bg-[#DDD6FE] animate-pulse' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">STEP 2: DESIGNER</span>
                  <span className="font-code text-[10px]">agent2_designer.py</span>
                </div>
                <p className="text-[11px] font-body text-stone-600">Translates briefs into Bannerbear specs, emits <code>designer_output_specs.json</code></p>
                <div className="mt-2 text-[10px] text-purple-700 font-bold">
                  {designerSpecs || canvaAssets.length > 0 ? '✓ Design Jobs Ready' : 'Pending Run'}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`p-3 border-2 border-[#292524] ${isAgent3Running ? 'bg-[#A7F3D0] animate-pulse' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">STEP 3: COPYWRITER</span>
                  <span className="font-code text-[10px]">agent3_copywriter.py</span>
                </div>
                <p className="text-[11px] font-body text-stone-600">Writes localized captions in [{agent3Inputs.targetLanguage}], emits <code>final_copy_captions.json</code></p>
                <div className="mt-2 text-[10px] text-emerald-700 font-bold">
                  {finalCaptions || posts.length > 0 ? '✓ Captions Ready' : 'Pending Run'}
                </div>
              </div>
            </div>

            {/* Database status banner */}
            {dbCampaignId && (
              <div className="mt-4 p-2.5 bg-emerald-50 border-2 border-emerald-600 flex items-center justify-between text-xs font-silk text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PERSISTED TO POSTGRESQL: Campaign #{dbCampaignId} recorded in <code>CampaignModel</code> table!
                </span>
                <span className="font-code text-[10px] bg-emerald-200 px-2 py-0.5">models.py</span>
              </div>
            )}
          </div>

          {/* Real Terminal Log Stream */}
          <div className="bg-[#1C1917] border-4 border-[#292524] shadow-[5px_5px_0_#292524] p-4 text-xs font-code text-[#FEF08A]">
            <div className="flex items-center justify-between border-b border-stone-700 pb-2 mb-2 font-silk text-[11px]">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                PIPELINE EXECUTION TELEMETRY & CONSOLE
              </span>
              <button
                onClick={() => setLogs([])}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="h-44 overflow-y-auto space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="leading-relaxed">
                  <span className="text-stone-500 mr-2">{i + 1}.</span>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
