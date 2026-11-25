import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Code2, 
  Upload, 
  FileCode, 
  Check, 
  Download, 
  Copy, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  Cpu,
  Layers
} from 'lucide-react';
import { PYTHON_SCRIPTS } from '../data/mockData';
import { PythonScript } from '../types';
import { soundFx } from '../utils/soundEffects';

interface PythonScriptManagerProps {
  onRunPipeline: () => void;
}

export const PythonScriptManager: React.FC<PythonScriptManagerProps> = ({ onRunPipeline }) => {
  const [scripts, setScripts] = useState<PythonScript[]>(PYTHON_SCRIPTS);
  const [selectedFilename, setSelectedFilename] = useState<string>('agent1_strategy.py');
  const [copiedCode, setCopiedCode] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const activeScript = scripts.find(s => s.filename === selectedFilename) || scripts[0];

  const handleCopyCode = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(activeScript.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadScript = () => {
    soundFx.playSuccess();
    const blob = new Blob([activeScript.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeScript.filename;
    a.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    soundFx.playLevelUp();
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FEF08A', '#86EFAC', '#292524'],
    });

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = event => {
        const content = event.target?.result as string;
        if (!content) return;

        setScripts(prev => {
          const existingIdx = prev.findIndex(s => s.filename.toLowerCase() === file.name.toLowerCase());
          const newScript: PythonScript = {
            filename: file.name,
            title: `Custom Uploaded: ${file.name}`,
            description: `User-uploaded Python agent script linked to Simply Lemon pipeline.`,
            status: 'custom_uploaded',
            agentId: file.name.includes('strategy') ? 'agent1' : file.name.includes('designer') ? 'agent2' : 'agent3',
            code: content,
            linesCount: content.split('\n').length,
            fileSize: `${(file.size / 1024).toFixed(1)} KB`,
            lastModified: 'Uploaded just now',
            environment: 'uv + python 3.12 (User File)',
          };

          if (existingIdx >= 0) {
            const copy = [...prev];
            copy[existingIdx] = newScript;
            return copy;
          } else {
            return [newScript, ...prev];
          }
        });

        setSelectedFilename(file.name);
      };
      reader.readAsText(file);
    });

    setUploadSuccessMessage(`Successfully uploaded ${files.length} file(s)! Pipeline ready.`);
    setTimeout(() => setUploadSuccessMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Script Upload Prompt Callout */}
      <div className="bg-[#FEF08A] border-4 border-[#292524] shadow-[6px_6px_0_#292524] p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white border-3 border-[#292524] shadow-[2px_2px_0_#292524] p-1 shrink-0 flex items-center justify-center">
              <img
                src="./assets/aistudio/image_0835261b.png"
                alt="Lemmy Mascot"
                className="w-full h-full object-contain pixel-art animate-pulse"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-xs sm:text-sm text-[#292524]">
                  UPLOAD YOUR 3 PYTHON AGENT SCRIPTS
                </h3>
                <span className="bg-[#292524] text-[#FEF08A] text-[10px] font-silk px-2 py-0.5">
                  UV RUNTIME
                </span>
              </div>
              <p className="text-xs text-stone-800 font-body mt-1 leading-relaxed">
                Have your existing <strong className="font-code text-amber-950">agent1_strategy.py</strong>, <strong className="font-code text-amber-950">agent2_designer.py</strong>, and <strong className="font-code text-amber-950">agent3_copywriter.py</strong> ready? Upload them here or replace the code to customize your agent prompts!
              </p>
            </div>
          </div>

          {/* Upload Button */}
          <label className="flex items-center gap-2 px-4 py-3 bg-[#86EFAC] hover:bg-[#4ADE80] text-[#292524] font-silk text-xs font-bold border-3 border-[#292524] shadow-[3px_3px_0_#292524] cursor-pointer shrink-0 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
            <Upload className="w-4 h-4" />
            <span>Upload .py Files</span>
            <input
              type="file"
              accept=".py,.json,.toml,.txt"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadSuccessMessage && (
          <div className="mt-3 bg-white border-2 border-[#292524] p-2.5 font-silk text-xs text-emerald-800 flex items-center gap-2 shadow-[2px_2px_0_#292524]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uploadSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Main Code Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Script Files List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-[#FFFDF0] border-3 border-[#292524] p-3 shadow-[3px_3px_0_#292524]">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#292524] mb-3">
              <FolderOpen className="w-4 h-4 text-amber-800" />
              <span>AGENT SCRIPTS</span>
            </div>

            <div className="space-y-2">
              {scripts.map(s => {
                const isSelected = s.filename === selectedFilename;
                return (
                  <div
                    key={s.filename}
                    onClick={() => {
                      soundFx.playClick();
                      setSelectedFilename(s.filename);
                    }}
                    className={`p-3 border-2 border-[#292524] cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FEF08A] shadow-[4px_4px_0_#292524] font-bold'
                        : 'bg-white hover:bg-stone-50 shadow-[1px_1px_0_#292524]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-silk mb-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <FileCode className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                        <span className="truncate">{s.filename}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 border border-[#292524] ${
                        s.status === 'custom_uploaded' ? 'bg-[#86EFAC] text-emerald-950 font-bold' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {s.status === 'custom_uploaded' ? 'UPLOADED' : 'SYNCED'}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-600 font-body line-clamp-2">
                      {s.description}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-200 text-[10px] font-silk text-stone-500">
                      <span>{s.linesCount} lines</span>
                      <span>{s.fileSize}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Environment Specs */}
          <div className="bg-[#FFFBEB] border-3 border-[#292524] p-4 shadow-[3px_3px_0_#292524] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#292524]">
              <Cpu className="w-4 h-4 text-emerald-800" />
              <span>RUNTIME STACK</span>
            </div>
            <ul className="space-y-1.5 font-silk text-[11px] text-stone-700">
              <li className="flex items-center justify-between">
                <span>Manager:</span>
                <strong className="text-black">uv (Astral)</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Python:</span>
                <strong className="text-black">3.12 LTS</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>LLM Engine:</span>
                <strong className="text-black">Google GenAI (2.4.0)</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Canva Engine:</span>
                <strong className="text-black">Canva REST v1</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Col: Code Viewer & Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#1C1917] border-4 border-[#292524] shadow-[6px_6px_0_#292524] overflow-hidden">
            {/* Code Bar Header */}
            <div className="bg-[#292524] px-4 py-2.5 flex flex-wrap items-center justify-between border-b-2 border-stone-700 gap-2">
              <div className="flex items-center gap-2 font-pixel text-xs text-[#FEF08A]">
                <FileCode className="w-4 h-4 text-[#86EFAC]" />
                <span>{activeScript.filename}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[#FEF08A] font-silk text-xs border border-stone-600 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadScript}
                  className="flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[#FEF08A] font-silk text-xs border border-stone-600 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .py</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 h-[440px] overflow-y-auto font-code text-xs leading-relaxed text-[#86EFAC] bg-[#121110]">
              <pre className="whitespace-pre-wrap">
                {activeScript.code}
              </pre>
            </div>

            {/* Code Footer */}
            <div className="bg-[#292524] px-4 py-2 border-t border-stone-700 flex items-center justify-between text-[11px] font-silk text-stone-400">
              <span>{activeScript.environment}</span>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onRunPipeline();
                }}
                className="text-[#FDE047] hover:underline font-silk cursor-pointer flex items-center gap-1"
              >
                <span>Trigger Pipeline with this Script</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
