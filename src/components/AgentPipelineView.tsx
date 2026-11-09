import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { CanvaTemplateAsset, GeneratedPost, OnboardingAnswers, StrategyPlan, BackendLogEntry } from '../types';
import { soundFx } from '../utils/soundEffects';

interface AgentPipelineViewProps {
  onboardingData: OnboardingAnswers;
  strategyPlan: StrategyPlan | null;
  setStrategyPlan: (plan: StrategyPlan | null) => void;
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
}

export const AgentPipelineView: React.FC<AgentPipelineViewProps> = ({
  onboardingData,
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
}) => {
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | null>(null);
  const [activeLogTab, setActiveLogTab] = useState<'terminal' | 'strategyJson' | 'canvaJson' | 'draftsJson'>('terminal');

  // Agent Statuses
  const [agent1Status, setAgent1Status] = useState<'idle' | 'running' | 'completed' | 'error'>(
    strategyPlan ? 'completed' : 'idle'
  );
  const [agent1Error, setAgent1Error] = useState<string | null>(null);
  const [agent1Duration, setAgent1Duration] = useState<number | null>(null);

  const [agent2Status, setAgent2Status] = useState<'idle' | 'running' | 'completed' | 'error'>(
    canvaAssets.length > 0 ? 'completed' : 'idle'
  );
  const [agent2Error, setAgent2Error] = useState<string | null>(null);
  const [agent2Duration, setAgent2Duration] = useState<number | null>(null);

  const [agent3Status, setAgent3Status] = useState<'idle' | 'running' | 'completed' | 'error'>(
    posts.length > 0 ? 'completed' : 'idle'
  );
  const [agent3Error, setAgent3Error] = useState<string | null>(null);
  const [agent3Duration, setAgent3Duration] = useState<number | null>(null);

  // Live Server Logs
  const [serverLogs, setServerLogs] = useState<BackendLogEntry[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchServerLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setServerLogs(data.logs || []);
      }
    } catch {
      // Backend not yet reachable
    }
  };

  useEffect(() => {
    fetchServerLogs();
    const interval = setInterval(fetchServerLogs, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = async () => {
    soundFx.playClick();
    try {
      await fetch('/api/logs/clear', { method: 'POST' });
      setServerLogs([]);
    } catch {
      // ignore
    }
  };

  // Run Real Agent 1: Strategy via Express & Google GenAI API
  const runAgent1 = async (): Promise<StrategyPlan | null> => {
    setAgent1Status('running');
    setAgent1Error(null);
    const start = Date.now();

    try {
      const response = await fetch('/api/agents/agent1-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(onboardingData),
      });

      const data = await response.json();
      const duration = Date.now() - start;
      setAgent1Duration(duration);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `Agent 1 failed with status ${response.status}`);
      }

      setStrategyPlan(data.strategyPlan);
      setAgent1Status('completed');
      soundFx.playStepComplete();
      fetchServerLogs();
      return data.strategyPlan;
    } catch (err: unknown) {
      const error = err as Error;
      setAgent1Status('error');
      setAgent1Error(error.message);
      soundFx.playClick();
      fetchServerLogs();
      return null;
    }
  };

  // Run Real Agent 2: Designer (Canva visual templates from strategyplan.json)
  const runAgent2 = async (planToUse?: StrategyPlan): Promise<CanvaTemplateAsset[] | null> => {
    const activePlan = planToUse || strategyPlan;
    if (!activePlan) {
      const msg = 'Cannot run Agent 2: strategyplan.json is missing. Please run Agent 1 first.';
      setAgent2Status('error');
      setAgent2Error(msg);
      return null;
    }

    setAgent2Status('running');
    setAgent2Error(null);
    const start = Date.now();

    try {
      const response = await fetch('/api/agents/agent2-designer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyPlan: activePlan,
          brandProfile: onboardingData,
        }),
      });

      const data = await response.json();
      const duration = Date.now() - start;
      setAgent2Duration(duration);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `Agent 2 failed with status ${response.status}`);
      }

      setCanvaAssets(data.assets);
      setAgent2Status('completed');
      soundFx.playStepComplete();
      fetchServerLogs();
      return data.assets;
    } catch (err: unknown) {
      const error = err as Error;
      setAgent2Status('error');
      setAgent2Error(error.message);
      soundFx.playClick();
      fetchServerLogs();
      return null;
    }
  };

  // Run Real Agent 3: Copywriter (Real GenAI Caption Engine)
  const runAgent3 = async (planToUse?: StrategyPlan, assetsToUse?: CanvaTemplateAsset[]): Promise<GeneratedPost[] | null> => {
    const activePlan = planToUse || strategyPlan;
    const activeAssets = assetsToUse || canvaAssets;

    if (!activePlan) {
      const msg = 'Cannot run Agent 3: strategyplan.json is missing. Please run Agent 1 first.';
      setAgent3Status('error');
      setAgent3Error(msg);
      return null;
    }

    if (!activeAssets || activeAssets.length === 0) {
      const msg = 'Cannot run Agent 3: visual_assets.json is empty. Please run Agent 2 first.';
      setAgent3Status('error');
      setAgent3Error(msg);
      return null;
    }

    setAgent3Status('running');
    setAgent3Error(null);
    const start = Date.now();

    try {
      const response = await fetch('/api/agents/agent3-copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyPlan: activePlan,
          assets: activeAssets,
          brandProfile: onboardingData,
        }),
      });

      const data = await response.json();
      const duration = Date.now() - start;
      setAgent3Duration(duration);

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || `Agent 3 failed with status ${response.status}`);
      }

      setPosts(data.posts);
      setAgent3Status('completed');
      soundFx.playLevelUp();
      fetchServerLogs();
      return data.posts;
    } catch (err: unknown) {
      const error = err as Error;
      setAgent3Status('error');
      setAgent3Error(error.message);
      soundFx.playClick();
      fetchServerLogs();
      return null;
    }
  };

  // Run Full Pipeline
  const runFullPipeline = async () => {
    soundFx.playSuccess();
    setPipelineRunning(true);

    try {
      setActiveStep(1);
      const plan = await runAgent1();
      if (!plan) return;

      setActiveStep(2);
      const assets = await runAgent2(plan);
      if (!assets || assets.length === 0) return;

      setActiveStep(3);
      await runAgent3(plan, assets);
      setActiveStep(null);
    } finally {
      setPipelineRunning(false);
      setActiveStep(null);
      fetchServerLogs();
    }
  };

  return (
    <div className="space-y-5">
      {/* Real Backend Status Alert Banner */}
      {!hasApiKey && (
        <div className="bg-amber-100 border-3 border-[#292524] p-3 shadow-[3px_3px_0_#292524] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
            <span className="font-body text-[#292524]">
              <strong>GEMINI_API_KEY Missing:</strong> Agent 1 and Agent 3 will fail until a valid Gemini API key is configured in the environment.
            </span>
          </div>
          <span className="bg-[#292524] text-[#FEF08A] px-2 py-0.5 font-silk text-[10px] shrink-0">
            CONFIG REQUIRED
          </span>
        </div>
      )}

      {/* Top Focused Execution Control Bar */}
      <div className="bg-[#FFFDF0] border-4 border-[#292524] shadow-[4px_4px_0_#292524] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#FEF08A] border-3 border-[#292524] shadow-[2px_2px_0_#292524] p-1 shrink-0 flex items-center justify-center">
            <img
              src="/assets/aistudio/image_0835261b.png"
              alt="Lemmy"
              className="w-full h-full object-contain pixel-art"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-xs sm:text-sm text-[#292524]">
                BACKEND AGENT ORCHESTRATOR
              </h2>
              <span className={`text-[9px] font-silk px-1.5 py-0.2 border border-[#292524] font-bold ${
                backendHealthy ? 'bg-[#86EFAC] text-emerald-950' : 'bg-red-200 text-red-950'
              }`}>
                {backendHealthy ? 'EXPRESS ONLINE' : 'DISCONNECTED'}
              </span>
            </div>
            <p className="text-xs text-stone-700 font-body">
              Target: <strong className="font-semibold text-[#854D0E]">{onboardingData.businessName}</strong> ({onboardingData.industry})
            </p>
          </div>
        </div>

        {/* Master Execution Button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={runFullPipeline}
            disabled={pipelineRunning}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
              pipelineRunning
                ? 'bg-amber-200 text-stone-600 cursor-wait'
                : 'bg-[#FDE047] hover:bg-[#FACC15] text-[#292524]'
            }`}
          >
            {pipelineRunning ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-stone-800" />
                <span>EXECUTING STEP {activeStep}/3...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-[#292524] text-[#292524]" />
                <span>EXECUTE 3-AGENT PIPELINE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 Real Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* AGENT 1 CARD */}
        <div className={`bg-[#FFFDF0] border-3 border-[#292524] p-4 flex flex-col justify-between transition-all ${
          activeStep === 1
            ? 'shadow-[5px_5px_0_#292524] bg-[#FEF9C3] ring-2 ring-[#292524]'
            : 'shadow-[3px_3px_0_#292524]'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] bg-[#FEF08A] text-[#292524] px-1.5 py-0.5 border border-[#292524]">
                AGENT 1
              </span>
              <span className={`text-[10px] font-silk px-2 py-0.5 border flex items-center gap-1 ${
                agent1Status === 'running'
                  ? 'bg-amber-100 text-amber-900 border-amber-900 animate-pulse'
                  : agent1Status === 'completed'
                  ? 'bg-[#86EFAC] text-emerald-950 border-emerald-950 font-bold'
                  : agent1Status === 'error'
                  ? 'bg-red-200 text-red-950 border-red-950 font-bold'
                  : 'bg-stone-100 text-stone-700 border-stone-400'
              }`}>
                {agent1Status === 'running' && 'RUNNING...'}
                {agent1Status === 'completed' && '200 OK ✓'}
                {agent1Status === 'error' && 'FAILED ✗'}
                {agent1Status === 'idle' && 'READY'}
              </span>
            </div>

            <div>
              <h3 className="font-pixel text-xs text-[#292524]">STRATEGY ARCHITECT</h3>
              <p className="font-code text-[11px] text-stone-600">agent1_strategy.py</p>
            </div>

            <p className="text-xs text-stone-700 font-body leading-relaxed">
              Synthesizes target audience, brand tone, content pillars, and 4-week roadmap using Google GenAI.
            </p>

            {/* Error Callout if any */}
            {agent1Error && (
              <div className="bg-red-100 border-2 border-red-800 p-2 text-xs font-body text-red-900 leading-snug">
                <strong className="font-silk text-[10px] block text-red-950">ERROR DETAILS:</strong>
                {agent1Error}
              </div>
            )}

            {/* Real Output Info */}
            <div className="bg-white border-2 border-[#292524] p-2 text-xs space-y-1">
              <div className="flex justify-between font-silk text-[11px]">
                <span className="text-stone-500">Output:</span>
                <span className={strategyPlan ? 'text-emerald-800 font-bold' : 'text-stone-400'}>
                  {strategyPlan ? 'strategyplan.json ✓' : 'Not generated'}
                </span>
              </div>
              {agent1Duration && (
                <div className="flex justify-between font-silk text-[10px] text-stone-500">
                  <span>Latency:</span>
                  <span>{agent1Duration} ms</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-stone-200">
            <button
              onClick={() => {
                soundFx.playClick();
                runAgent1();
              }}
              disabled={pipelineRunning}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 text-[#292524] border-2 border-[#292524] shadow-[2px_2px_0_#292524] font-silk text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Run Agent 1</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveLogTab('strategyJson');
              }}
              disabled={!strategyPlan}
              className={`py-1.5 px-2.5 border-2 border-[#292524] font-silk text-xs cursor-pointer ${
                strategyPlan ? 'bg-[#FEF08A] hover:bg-[#FDE047] shadow-[2px_2px_0_#292524]' : 'bg-stone-200 opacity-40 cursor-not-allowed'
              }`}
              title="Inspect strategyplan.json"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AGENT 2 CARD */}
        <div className={`bg-[#FFFDF0] border-3 border-[#292524] p-4 flex flex-col justify-between transition-all ${
          activeStep === 2
            ? 'shadow-[5px_5px_0_#292524] bg-[#FEF9C3] ring-2 ring-[#292524]'
            : 'shadow-[3px_3px_0_#292524]'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] bg-[#FEF08A] text-[#292524] px-1.5 py-0.5 border border-[#292524]">
                AGENT 2
              </span>
              <span className={`text-[10px] font-silk px-2 py-0.5 border flex items-center gap-1 ${
                agent2Status === 'running'
                  ? 'bg-amber-100 text-amber-900 border-amber-900 animate-pulse'
                  : agent2Status === 'completed'
                  ? 'bg-[#86EFAC] text-emerald-950 border-emerald-950 font-bold'
                  : agent2Status === 'error'
                  ? 'bg-red-200 text-red-950 border-red-950 font-bold'
                  : 'bg-stone-100 text-stone-700 border-stone-400'
              }`}>
                {agent2Status === 'running' && 'RUNNING...'}
                {agent2Status === 'completed' && '200 OK ✓'}
                {agent2Status === 'error' && 'FAILED ✗'}
                {agent2Status === 'idle' && 'READY'}
              </span>
            </div>

            <div>
              <h3 className="font-pixel text-xs text-[#292524]">CANVA TEMPLATES</h3>
              <p className="font-code text-[11px] text-stone-600">agent2_designer.py</p>
            </div>

            <p className="text-xs text-stone-700 font-body leading-relaxed">
              Consumes strategyplan.json, computes palettes, formats pixel stickers and Canva layouts.
            </p>

            {/* Error Callout */}
            {agent2Error && (
              <div className="bg-red-100 border-2 border-red-800 p-2 text-xs font-body text-red-900 leading-snug">
                <strong className="font-silk text-[10px] block text-red-950">ERROR DETAILS:</strong>
                {agent2Error}
              </div>
            )}

            {/* Real Output Info */}
            <div className="bg-white border-2 border-[#292524] p-2 text-xs space-y-1">
              <div className="flex justify-between font-silk text-[11px]">
                <span className="text-stone-500">Output:</span>
                <span className={canvaAssets.length > 0 ? 'text-emerald-800 font-bold' : 'text-stone-400'}>
                  {canvaAssets.length > 0 ? `${canvaAssets.length} Canva Templates ✓` : 'Not generated'}
                </span>
              </div>
              {agent2Duration && (
                <div className="flex justify-between font-silk text-[10px] text-stone-500">
                  <span>Latency:</span>
                  <span>{agent2Duration} ms</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-stone-200">
            <button
              onClick={() => {
                soundFx.playClick();
                runAgent2();
              }}
              disabled={pipelineRunning}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 text-[#292524] border-2 border-[#292524] shadow-[2px_2px_0_#292524] font-silk text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Run Agent 2</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigateToStudio();
              }}
              disabled={canvaAssets.length === 0}
              className={`py-1.5 px-2.5 border-2 border-[#292524] font-silk text-xs cursor-pointer ${
                canvaAssets.length > 0 ? 'bg-[#FEF08A] hover:bg-[#FDE047] shadow-[2px_2px_0_#292524]' : 'bg-stone-200 opacity-40 cursor-not-allowed'
              }`}
              title="Open Canva Studio"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* AGENT 3 CARD */}
        <div className={`bg-[#FFFDF0] border-3 border-[#292524] p-4 flex flex-col justify-between transition-all ${
          activeStep === 3
            ? 'shadow-[5px_5px_0_#292524] bg-[#FEF9C3] ring-2 ring-[#292524]'
            : 'shadow-[3px_3px_0_#292524]'
        }`}>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-pixel text-[9px] bg-[#FEF08A] text-[#292524] px-1.5 py-0.5 border border-[#292524]">
                AGENT 3
              </span>
              <span className={`text-[10px] font-silk px-2 py-0.5 border flex items-center gap-1 ${
                agent3Status === 'running'
                  ? 'bg-amber-100 text-amber-900 border-amber-900 animate-pulse'
                  : agent3Status === 'completed'
                  ? 'bg-[#86EFAC] text-emerald-950 border-emerald-950 font-bold'
                  : agent3Status === 'error'
                  ? 'bg-red-200 text-red-950 border-red-950 font-bold'
                  : 'bg-stone-100 text-stone-700 border-stone-400'
              }`}>
                {agent3Status === 'running' && 'RUNNING...'}
                {agent3Status === 'completed' && '200 OK ✓'}
                {agent3Status === 'error' && 'FAILED ✗'}
                {agent3Status === 'idle' && 'READY'}
              </span>
            </div>

            <div>
              <h3 className="font-pixel text-xs text-[#292524]">COPYWRITER ENGINE</h3>
              <p className="font-code text-[11px] text-stone-600">agent3_copywriter.py</p>
            </div>

            <p className="text-xs text-stone-700 font-body leading-relaxed">
              Authors high-converting captions, hooks, and hashtags for generated Canva assets using GenAI.
            </p>

            {/* Error Callout */}
            {agent3Error && (
              <div className="bg-red-100 border-2 border-red-800 p-2 text-xs font-body text-red-900 leading-snug">
                <strong className="font-silk text-[10px] block text-red-950">ERROR DETAILS:</strong>
                {agent3Error}
              </div>
            )}

            {/* Real Output Info */}
            <div className="bg-white border-2 border-[#292524] p-2 text-xs space-y-1">
              <div className="flex justify-between font-silk text-[11px]">
                <span className="text-stone-500">Output:</span>
                <span className={posts.length > 0 ? 'text-emerald-800 font-bold' : 'text-stone-400'}>
                  {posts.length > 0 ? `${posts.length} Real Posts Ready ✓` : 'Not generated'}
                </span>
              </div>
              {agent3Duration && (
                <div className="flex justify-between font-silk text-[10px] text-stone-500">
                  <span>Latency:</span>
                  <span>{agent3Duration} ms</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-stone-200">
            <button
              onClick={() => {
                soundFx.playClick();
                runAgent3();
              }}
              disabled={pipelineRunning}
              className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 text-[#292524] border-2 border-[#292524] shadow-[2px_2px_0_#292524] font-silk text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCw className="w-3 h-3" />
              <span>Run Agent 3</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                onNavigateToQueue();
              }}
              disabled={posts.length === 0}
              className={`py-1.5 px-2.5 border-2 border-[#292524] font-silk text-xs cursor-pointer ${
                posts.length > 0 ? 'bg-[#FEF08A] hover:bg-[#FDE047] shadow-[2px_2px_0_#292524]' : 'bg-stone-200 opacity-40 cursor-not-allowed'
              }`}
              title="Inspect Real Posts in Queue"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Real Diagnostics & Terminal CRT Monitor */}
      <div className="bg-[#1C1917] border-4 border-[#292524] shadow-[5px_5px_0_#292524] overflow-hidden">
        {/* Terminal Header Bar */}
        <div className="bg-[#292524] px-4 py-2 flex flex-wrap items-center justify-between border-b-2 border-stone-700 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#DC2626] inline-block" />
            <span className="w-3 h-3 bg-[#FACC15] inline-block" />
            <span className="w-3 h-3 bg-[#4ADE80] inline-block" />
            <span className="font-pixel text-[10px] text-[#FEF08A] ml-2">
              REAL SERVER DIAGNOSTICS & TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-1 font-silk text-xs">
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveLogTab('terminal');
              }}
              className={`px-2.5 py-1 text-xs cursor-pointer ${
                activeLogTab === 'terminal'
                  ? 'bg-[#FEF08A] text-[#292524] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              Live Logs ({serverLogs.length})
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveLogTab('strategyJson');
              }}
              className={`px-2.5 py-1 text-xs cursor-pointer ${
                activeLogTab === 'strategyJson'
                  ? 'bg-[#FEF08A] text-[#292524] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              strategyplan.json {strategyPlan ? '✓' : ''}
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveLogTab('canvaJson');
              }}
              className={`px-2.5 py-1 text-xs cursor-pointer ${
                activeLogTab === 'canvaJson'
                  ? 'bg-[#FEF08A] text-[#292524] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              visual_assets.json ({canvaAssets.length})
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setActiveLogTab('draftsJson');
              }}
              className={`px-2.5 py-1 text-xs cursor-pointer ${
                activeLogTab === 'draftsJson'
                  ? 'bg-[#FEF08A] text-[#292524] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              scheduled_drafts.json ({posts.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Live Real Server Log Terminal */}
        {activeLogTab === 'terminal' && (
          <div className="p-4 h-64 overflow-y-auto font-code text-xs leading-relaxed retro-screen text-[#86EFAC] space-y-1.5">
            {serverLogs.length === 0 ? (
              <div className="text-stone-500 py-6 text-center">
                [IDLE] No backend execution events yet. Click "RUN AGENT 1" or "EXECUTE 3-AGENT PIPELINE" to trigger real execution.
              </div>
            ) : (
              serverLogs.map(log => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-stone-500 select-none text-[10px]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>
                  <span className={`px-1 py-0.2 text-[9px] uppercase font-bold shrink-0 ${
                    log.level === 'error' ? 'bg-red-800 text-white' :
                    log.level === 'warn' ? 'bg-amber-800 text-yellow-200' :
                    log.level === 'success' ? 'bg-emerald-800 text-emerald-100' :
                    'bg-stone-800 text-stone-300'
                  }`}>
                    {log.agent}
                  </span>
                  <span className={
                    log.level === 'error' ? 'text-red-400 font-bold' :
                    log.level === 'warn' ? 'text-yellow-300 font-bold' :
                    log.level === 'success' ? 'text-[#86EFAC] font-bold' :
                    'text-stone-300'
                  }>
                    {log.message}
                  </span>
                  {log.durationMs !== undefined && (
                    <span className="text-stone-500 text-[10px]">({log.durationMs}ms)</span>
                  )}
                </div>
              ))
            )}
            <div ref={terminalEndRef} />
          </div>
        )}

        {/* Tab 2: strategyplan.json */}
        {activeLogTab === 'strategyJson' && (
          <div className="p-4 h-64 overflow-y-auto font-code text-xs leading-relaxed text-[#FDE047] bg-[#121110]">
            {strategyPlan ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(strategyPlan, null, 2)}
              </pre>
            ) : (
              <div className="text-stone-500 py-8 text-center font-silk">
                strategyplan.json has not been generated yet. Run Agent 1 to execute strategy creation.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: visual_assets.json */}
        {activeLogTab === 'canvaJson' && (
          <div className="p-4 h-64 overflow-y-auto font-code text-xs leading-relaxed text-[#A7F3D0] bg-[#121110]">
            {canvaAssets.length > 0 ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(canvaAssets, null, 2)}
              </pre>
            ) : (
              <div className="text-stone-500 py-8 text-center font-silk">
                visual_assets.json is empty. Run Agent 2 to generate Canva template assets.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: scheduled_drafts.json */}
        {activeLogTab === 'draftsJson' && (
          <div className="p-4 h-64 overflow-y-auto font-code text-xs leading-relaxed text-[#BAE6FD] bg-[#121110]">
            {posts.length > 0 ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(posts, null, 2)}
              </pre>
            ) : (
              <div className="text-stone-500 py-8 text-center font-silk">
                scheduled_drafts.json is empty. Run Agent 3 to generate copy and social captions.
              </div>
            )}
          </div>
        )}

        {/* Terminal Footer Bar */}
        <div className="bg-[#292524] px-4 py-2 border-t border-stone-700 flex items-center justify-between text-[11px] font-silk text-stone-400">
          <div className="flex items-center gap-3">
            <button
              onClick={fetchServerLogs}
              className="hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Logs</span>
            </button>
            <span className="text-stone-600">|</span>
            <button
              onClick={handleClearLogs}
              className="hover:text-red-400 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear Terminal</span>
            </button>
          </div>

          {strategyPlan && (
            <button
              onClick={() => {
                soundFx.playSuccess();
                const blob = new Blob([JSON.stringify(strategyPlan, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'strategyplan.json';
                a.click();
              }}
              className="flex items-center gap-1 text-[#FEF08A] hover:text-white font-silk cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export strategyplan.json</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
