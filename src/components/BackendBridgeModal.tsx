import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  Globe, 
  UploadCloud, 
  Wifi, 
  CheckCircle2, 
  AlertCircle,
  FileCode,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface BackendBridgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  remoteUrl: string;
  setRemoteUrl: (url: string) => void;
  onFilesUploaded: (files: { [filename: string]: string }) => void;
}

export const BackendBridgeModal: React.FC<BackendBridgeModalProps> = ({
  isOpen,
  onClose,
  remoteUrl,
  setRemoteUrl,
  onFilesUploaded,
}) => {
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'failed'>('idle');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const testConnection = async () => {
    soundFx.playClick();
    setTestingConnection(true);
    setConnectionStatus('idle');
    setErrorMessage(null);

    try {
      const target = remoteUrl.replace(/\/$/, '');
      // Try root / (from main.py read_root) or /health
      let res = await fetch(`${target}/`, { method: 'GET' });
      if (!res.ok) {
        res = await fetch(`${target}/health`, { method: 'GET' });
      }
      if (res.ok) {
        soundFx.playSuccess();
        setConnectionStatus('connected');
      } else {
        throw new Error(`Server returned HTTP ${res.status}`);
      }
    } catch (err: unknown) {
      soundFx.playClick();
      setConnectionStatus('failed');
      const error = err as Error;
      setErrorMessage(error.message || 'Could not connect. Ensure CORS middleware is enabled in main.py and uvicorn is running on 0.0.0.0:8000.');
    } finally {
      setTestingConnection(false);
    }
  };

  const bridgeSnippet = `# In Simply-Lemon/main.py, add CORS so the frontend can connect:
from fastapi.middleware.cors import CORSMiddleware

# Right after: app = FastAPI(title="Simply Lemon API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Start your server on host 100.109.84.6:
# uv run uvicorn main:app --host 0.0.0.0 --port 8000
`;

  const copyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(bridgeSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleDropFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    soundFx.playSuccess();
    const result: { [filename: string]: string } = {};
    let loaded = 0;

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        result[file.name] = (ev.target?.result as string) || '';
        loaded++;
        if (loaded === fileList.length) {
          onFilesUploaded(result);
          onClose();
        }
      };
      reader.readAsText(file);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FFFDF0] border-4 border-[#292524] shadow-[8px_8px_0_#292524] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#FEF08A] border-b-4 border-[#292524] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-900" />
            <h2 className="font-pixel text-xs sm:text-sm text-[#292524]">
              CONNECT REMOTE SSH SERVER [100.109.84.6]
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

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs font-body">
          {/* Method 1: Live API endpoint */}
          <div className="bg-[#FFFBEB] border-2 border-[#292524] p-4 shadow-[2px_2px_0_#292524] space-y-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-700" />
              <h3 className="font-pixel text-xs text-[#292524]">
                METHOD 1: LIVE FASTAPI REST BRIDGE
              </h3>
            </div>
            <p className="text-stone-700 text-xs">
              Connect directly to your server running on <strong className="font-code text-amber-950">100.109.84.6</strong> via port 8000, Tailscale, or VS Code Port Forwarding.
            </p>

            {/* Quick URL Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-silk text-stone-500">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setRemoteUrl('http://100.109.84.6:8000')}
                className="px-2 py-0.5 bg-white border border-[#292524] text-[10px] font-code hover:bg-amber-100 cursor-pointer"
              >
                http://100.109.84.6:8000 (Tailscale)
              </button>
              <button
                type="button"
                onClick={() => setRemoteUrl('http://localhost:8000')}
                className="px-2 py-0.5 bg-white border border-[#292524] text-[10px] font-code hover:bg-amber-100 cursor-pointer"
              >
                http://localhost:8000 (Forwarded)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={remoteUrl}
                onChange={e => setRemoteUrl(e.target.value)}
                placeholder="http://100.109.84.6:8000 or http://localhost:8000"
                className="flex-1 bg-white border-2 border-[#292524] p-2.5 font-code text-xs focus:outline-none focus:bg-[#FEF9C3]"
              />
              <button
                onClick={testConnection}
                disabled={testingConnection}
                className="px-3.5 py-2.5 bg-[#86EFAC] hover:bg-[#4ADE80] font-silk text-xs font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524] cursor-pointer shrink-0"
              >
                {testingConnection ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {connectionStatus === 'connected' && (
              <div className="p-2.5 bg-emerald-100 border-2 border-emerald-800 text-emerald-950 font-silk text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Connected to remote server successfully!</span>
                </div>
                <span className="text-[10px] bg-emerald-200 px-2 py-0.5 font-pixel text-emerald-900 border border-emerald-700">ONLINE</span>
              </div>
            )}

            {connectionStatus === 'failed' && (
              <div className="p-3 bg-red-50 border-2 border-red-800 text-red-950 font-body text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-silk font-bold text-red-900">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>Connection test failed: {errorMessage}</span>
                </div>
                <div className="text-[11px] text-stone-700 pl-6 space-y-1">
                  <p>Check the 3 essential steps below: <strong>1. CORS added</strong>, <strong>2. Listening on 0.0.0.0:8000</strong>, and <strong>3. VS Code port forwarded or Tailscale connected</strong>.</p>
                </div>
              </div>
            )}
          </div>

          {/* 3 Step Visual Checklist */}
          <div className="bg-stone-50 border-2 border-[#292524] p-3.5 space-y-3">
            <h3 className="font-pixel text-[11px] text-[#292524] flex items-center gap-2">
              <span className="w-4 h-4 bg-[#292524] text-[#FEF08A] flex items-center justify-center text-[10px]">!</span>
              3 EASY STEPS ON YOUR RASPBERRY PI (VS CODE SSH)
            </h3>

            {/* Step 1 */}
            <div className="bg-white border border-stone-300 p-2.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-silk text-xs font-bold text-amber-950">
                  STEP 1: Add CORS in <code className="bg-amber-100 px-1 py-0.5 text-stone-900 font-code">main.py</code>
                </span>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-silk text-[10px] border border-amber-400 cursor-pointer"
                >
                  {copiedSnippet ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSnippet ? 'Copied!' : 'Copy Snippet'}</span>
                </button>
              </div>
              <p className="text-[11px] text-stone-600">
                In your open VS Code editor for <strong className="font-code">main.py</strong>, paste the snippet below right after <code className="font-code bg-stone-100 px-1">app = FastAPI(...)</code>:
              </p>
              <pre className="p-2 bg-[#1C1917] font-code text-[11px] text-[#86EFAC] overflow-x-auto leading-relaxed border border-stone-700">
{bridgeSnippet}
              </pre>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-stone-300 p-2.5 space-y-1.5">
              <span className="font-silk text-xs font-bold text-amber-950 block">
                STEP 2: Run uvicorn in your VS Code Terminal
              </span>
              <p className="text-[11px] text-stone-600">
                Since your virtual environment <code className="font-code bg-emerald-100 px-1 text-emerald-950 font-bold">(aiagent)</code> is already active, run:
              </p>
              <div className="p-2 bg-[#1C1917] font-code text-[11px] text-[#FEF08A] flex items-center justify-between border border-stone-700">
                <span className="truncate mr-2">python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload</span>
                <button
                  onClick={() => {
                    soundFx.playClick();
                    navigator.clipboard.writeText('python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload');
                  }}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-white text-[10px] font-silk border border-stone-600 cursor-pointer shrink-0"
                >
                  Copy
                </button>
              </div>
              <p className="text-[10px] text-stone-500">
                If uvicorn isn't installed yet: <code className="bg-stone-100 px-1 font-code">pip install uvicorn</code> or install uv via <code className="bg-stone-100 px-1 font-code">curl -LsSf https://astral.sh/uv/install.sh | sh</code>
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-stone-300 p-2.5 space-y-1.5">
              <span className="font-silk text-xs font-bold text-amber-950 block">
                STEP 3: Forward Port in VS Code (or Tailscale Serve)
              </span>
              <p className="text-[11px] text-stone-600">
                In VS Code at the bottom panel next to <em>Terminal</em>, click the <strong>PORTS</strong> tab &rarr; click <strong>Forward a Port</strong> &rarr; type <code className="font-code bg-stone-100 px-1">8000</code>. Now <code className="font-code text-amber-900">http://localhost:8000</code> or your Tailscale IP <code className="font-code text-amber-900">http://100.109.84.6:8000</code> is accessible directly!
              </p>
            </div>
          </div>

          {/* Method 3: Direct File Dropzone */}
          <div className="bg-[#FFFDF0] border-2 border-dashed border-[#292524] p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 font-pixel text-xs text-[#292524]">
              <UploadCloud className="w-4 h-4 text-amber-800" />
              <span>OR: DRAG & DROP BOT OUTPUT FILES</span>
            </div>
            <p className="text-stone-600 text-xs max-w-md mx-auto">
              Want zero network configuration? Drag & drop <strong className="font-code">weekly_strategy_plan.json</strong>, <strong className="font-code">designer_output_specs.json</strong>, or <strong className="font-code">final_copy_captions.json</strong> from VS Code directly into this window.
            </p>
            <label className="inline-block px-4 py-2 bg-[#FEF08A] hover:bg-[#FDE047] text-[#292524] font-silk text-xs font-bold border-2 border-[#292524] shadow-[2px_2px_0_#292524] cursor-pointer">
              <span>Select Files to Sync</span>
              <input
                type="file"
                multiple
                accept=".json,.py,.txt"
                onChange={handleDropFiles}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#FEF08A] border-t-4 border-[#292524] p-3 flex justify-end">
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-white border-2 border-[#292524] font-silk text-xs font-bold shadow-[2px_2px_0_#292524] cursor-pointer"
          >
            Close Bridge Panel
          </button>
        </div>
      </div>
    </div>
  );
};
