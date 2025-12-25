
import React, { useState, useMemo } from 'react';
import { AppStatus, FileData, Effect, EFFECTS, EFFECT_CATEGORIES } from './types';
import { FilePicker } from './components/FilePicker';
import { fileToBase64, downloadVideo } from './utils/helpers';
import { analyzeMedia, generateVideoWithVeo } from './services/geminiService';

declare global {
  interface Window {
    // Fixed: All declarations of 'aistudio' must have identical modifiers.
    // Making it readonly to align with expected environmental global declarations.
    readonly aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Overlay Effects Component based on selection
const EffectOverlay: React.FC<{ effectId: string }> = ({ effectId }) => {
  const items = useMemo(() => {
    const count = 30;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 5}s`,
      size: `${Math.random() * 1.5 + 0.5}rem`,
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, [effectId]);

  if (effectId === 'snow' || effectId === 'chill_blur') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.map(item => (
          <div key={item.id} className="snowflake" style={{ left: item.left, animationDelay: item.delay, fontSize: item.size, opacity: item.opacity }}>❅</div>
        ))}
      </div>
    );
  }

  if (effectId === 'heart') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.map(item => (
          <div key={item.id} className="floating-item" style={{ left: item.left, animationDuration: item.duration, animationDelay: item.delay, fontSize: item.size, opacity: item.opacity, color: '#ef4444' }}>❤</div>
        ))}
      </div>
    );
  }

  if (effectId === 'star_sparkle' || effectId === 'galaxy') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.map(item => (
          <div key={item.id} className="glow-particle" style={{ left: item.left, top: `${Math.random() * 100}%`, width: '4px', height: '4px', animationDuration: item.duration, animationDelay: item.delay, opacity: item.opacity }}></div>
        ))}
      </div>
    );
  }

  return null;
};

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<Effect>(EFFECTS[0]);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Added reset function to clear state and return to initial view
  const reset = () => {
    setStatus(AppStatus.IDLE);
    setImage(null);
    setAudio(null);
    setResultUrl(null);
    setAiPrompt('');
    setError(null);
    setStatusMessage('');
  };

  const handleCreateVideo = async () => {
    if (!image || !audio) return;
    setError(null);

    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) await window.aistudio.openSelectKey();

      setStatus(AppStatus.ANALYZING);
      setStatusMessage(`AI đang phác thảo vibe "${selectedEffect.name}" cho video của bạn...`);

      const imageData: FileData = {
        base64: await fileToBase64(image),
        mimeType: image.type,
        name: image.name
      };

      const audioData: FileData = {
        base64: await fileToBase64(audio),
        mimeType: audio.type,
        name: audio.name
      };

      const prompt = await analyzeMedia(imageData, audioData, selectedEffect);
      setAiPrompt(prompt);
      
      setStatus(AppStatus.GENERATING);
      const videoUrl = await generateVideoWithVeo(prompt, imageData, setStatusMessage);
      
      setResultUrl(videoUrl);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Đã xảy ra lỗi.";
      setError(errorMessage);
      setStatus(AppStatus.ERROR);
      if (errorMessage.includes("Requested entity was not found")) {
        window.aistudio.openSelectKey();
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-20 px-4 flex flex-col items-center">
      <EffectOverlay effectId={selectedEffect.id} />

      <header className="relative z-10 py-12 text-center max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-2xl">
          <span className="gradient-text">『TW』Vũ•RuBi</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Kênh kiến tạo video AI chuyên nghiệp. Chọn Vibe, tải ảnh & nhạc để bắt đầu.
        </p>
      </header>

      <main className="relative z-10 w-full max-w-5xl glass rounded-[2.5rem] p-6 md:p-10 shadow-2xl mb-10 border border-slate-800/50">
        {status === AppStatus.IDLE && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
            {/* 1. File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FilePicker 
                label="Ảnh Gốc (Starting Image)" 
                accept="image/*" 
                icon="fa-image"
                selectedFile={image}
                onFileSelect={setImage}
                description="Hình ảnh làm gốc cho video"
              />
              <FilePicker 
                label="Nhạc Nền (Soundtrack)" 
                accept="audio/*" 
                icon="fa-music"
                selectedFile={audio}
                onFileSelect={setAudio}
                description="Giai điệu quyết định nhịp điệu video"
              />
            </div>

            {/* 2. Effect Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <i className="fas fa-wand-sparkles text-indigo-400"></i>
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Chọn Hiệu Ứng (Effect Vibe)</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {EFFECTS.map((eff) => (
                  <button
                    key={eff.id}
                    onClick={() => setSelectedEffect(eff)}
                    className={`p-3 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 text-center
                      ${selectedEffect.id === eff.id 
                        ? 'effect-card-selected border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'}
                    `}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800
                      ${selectedEffect.id === eff.id ? 'text-indigo-400' : 'text-slate-400'}
                    `}>
                      <i className={`fas ${eff.icon} text-lg`}></i>
                    </div>
                    <div>
                      <span className="text-xs font-bold block truncate">{eff.name}</span>
                      <span className="text-[10px] text-slate-500 block">{eff.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Action */}
            <div className="pt-6">
              <button
                onClick={handleCreateVideo}
                disabled={!image || !audio}
                className={`w-full py-5 rounded-3xl text-xl font-black transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 shadow-2xl
                  ${image && audio 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'}
                `}
              >
                <i className="fas fa-film"></i>
                GENERATE "{selectedEffect.name.toUpperCase()}" VIDEO
              </button>
            </div>
          </div>
        )}

        {(status === AppStatus.ANALYZING || status === AppStatus.GENERATING) && (
          <div className="py-24 flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="w-32 h-32 border-[6px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-inner"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fas ${selectedEffect.icon} text-indigo-400 text-4xl animate-bounce`}></i>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {status === AppStatus.ANALYZING ? "Đang Tư Duy Kịch Bản..." : "Đang Vẽ Từng Khung Hình..."}
              </h3>
              <p className="text-slate-400 max-w-md mx-auto italic font-medium">"{statusMessage}"</p>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && resultUrl && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="relative group rounded-3xl overflow-hidden aspect-video bg-black shadow-2xl border border-white/5">
              <video src={resultUrl} controls autoPlay loop className="w-full h-full object-contain" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-indigo-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <i className={`fas ${selectedEffect.icon}`}></i> {selectedEffect.name}
                </span>
                <span className="bg-green-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <i className="fas fa-check"></i> 720p HD
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => downloadVideo(resultUrl, `Vu_RuBi_${selectedEffect.id}_${Date.now()}.mp4`)}
                className="py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20"
              >
                <i className="fas fa-cloud-arrow-down"></i> TẢI VIDEO XUỐNG
              </button>
              <button
                onClick={reset}
                className="py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all border border-slate-700"
              >
                <i className="fas fa-wand-magic"></i> LÀM VIDEO KHÁC
              </button>
            </div>

            <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
              <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <i className="fas fa-quote-left"></i> AI Director Prompt
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed italic">"{aiPrompt}"</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="py-16 text-center space-y-6">
            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto border border-red-500/20">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <h3 className="text-2xl font-bold text-white">Lỗi Hệ Thống</h3>
            <p className="text-red-400 max-w-md mx-auto font-medium">{error}</p>
            <button onClick={reset} className="py-3 px-10 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition-all">Quay Lại Thử Lại</button>
          </div>
        )}
      </main>

      <footer className="relative z-10 text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center items-center gap-8 bg-slate-900/40 px-8 py-3 rounded-full border border-slate-800">
          <div className="flex items-center gap-2"><i className="fas fa-brain text-indigo-400"></i> Gemini 3 Pro</div>
          <div className="flex items-center gap-2"><i className="fas fa-film text-indigo-400"></i> Veo 3.1 Fast</div>
          <div className="flex items-center gap-2"><i className="fas fa-palette text-indigo-400"></i> Custom Vibes</div>
        </div>
        <p className="opacity-40">Designed for Viral Content - © 2024 『TW』Vũ•RuBi</p>
      </footer>
    </div>
  );
};

export default App;
