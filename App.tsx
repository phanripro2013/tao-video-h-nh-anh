
import React, { useState, useMemo } from 'react';
import { AppStatus, FileData, Effect, EFFECTS, EFFECT_CATEGORIES } from './types';
import { FilePicker } from './components/FilePicker';
import { fileToBase64, downloadVideo } from './utils/helpers';
import { analyzeMedia, generateVideoWithVeo } from './services/geminiService';

declare global {
  // Use interface AIStudio to avoid conflicting with existing declarations and satisfy the compiler.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Removed readonly and matched the expected AIStudio type to avoid redeclaration conflicts.
    aistudio: AIStudio;
  }
}

// Enhanced Overlay Effects Component
const EffectOverlay: React.FC<{ effectId: string }> = ({ effectId }) => {
  const items = useMemo(() => {
    const count = 25;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${Math.random() * 10 + 5}s`,
      size: `${Math.random() * 1.5 + 0.5}rem`,
      opacity: Math.random() * 0.5 + 0.1
    }));
  }, [effectId]);

  const category = EFFECTS.find(e => e.id === effectId)?.category;

  if (category === 'winter') {
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

  if (effectId === 'bubble') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.map(item => (
          <div key={item.id} className="bubble-item" style={{ 
            left: item.left, 
            width: item.size, 
            height: item.size, 
            animationDuration: item.duration, 
            animationDelay: item.delay, 
            opacity: item.opacity 
          }}></div>
        ))}
      </div>
    );
  }

  if (category === 'space') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.map(item => (
          <div key={item.id} className="glow-particle" style={{ 
            left: item.left, 
            top: item.top, 
            width: '4px', 
            height: '4px', 
            animationDuration: item.duration, 
            animationDelay: item.delay, 
            opacity: item.opacity,
            backgroundColor: '#ffffff'
          }}></div>
        ))}
      </div>
    );
  }

  if (effectId === 'energy_wave' || effectId === 'electric') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {[1, 2, 3].map(i => (
          <div key={i} className="energy-wave-item" style={{ 
            width: '300px', 
            height: '300px', 
            animationDelay: `${i * 1.3}s`,
            borderColor: effectId === 'electric' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(129, 140, 248, 0.3)'
          }}></div>
        ))}
      </div>
    );
  }

  if (category === 'glow') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        {items.slice(0, 10).map(item => (
          <div key={item.id} className="glow-particle" style={{ 
            left: item.left, 
            top: item.top, 
            width: '150px', 
            height: '150px', 
            animationDuration: '10s', 
            animationDelay: item.delay, 
            opacity: 0.05,
            background: 'radial-gradient(circle, rgba(129, 140, 248, 0.8), transparent 70%)'
          }}></div>
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
  const [activeCategory, setActiveCategory] = useState<string>(EFFECT_CATEGORIES[0].id);

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
      setStatusMessage(`AI đang phác thảo vibe "${selectedEffect.name}"...`);

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
      setError(err.message || "Đã xảy ra lỗi.");
      setStatus(AppStatus.ERROR);
      if (err.message?.includes("Requested entity was not found")) {
        window.aistudio.openSelectKey();
      }
    }
  };

  const filteredEffects = EFFECTS.filter(e => e.category === activeCategory);

  return (
    <div className="relative min-h-screen pb-20 px-4 flex flex-col items-center">
      <EffectOverlay effectId={selectedEffect.id} />

      <header className="relative z-10 py-12 text-center max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-2xl">
          <span className="gradient-text">『TW』Vũ•RuBi</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Biến ý tưởng thành video AI triệu view. Chọn phong cách của bạn và bắt đầu ngay.
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
                description="Khung hình khởi đầu cho video"
              />
              <FilePicker 
                label="Nhạc Nền (Soundtrack)" 
                accept="audio/*" 
                icon="fa-music"
                selectedFile={audio}
                onFileSelect={setAudio}
                description="Giai điệu chủ đạo của video"
              />
            </div>

            {/* 2. Effect Selector with Categories */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i className="fas fa-wand-sparkles text-indigo-400"></i>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Kho Hiệu Ứng Trend</h3>
                </div>
                <div className="hidden sm:flex bg-slate-900/60 p-1 rounded-xl border border-slate-800">
                  {EFFECT_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all
                        ${activeCategory === cat.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}
                      `}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Category Dropdown / Simple List */}
              <div className="sm:hidden flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {EFFECT_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase border
                      ${activeCategory === cat.id ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredEffects.map((eff) => (
                  <button
                    key={eff.id}
                    onClick={() => setSelectedEffect(eff)}
                    className={`group relative p-4 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 text-center
                      ${selectedEffect.id === eff.id 
                        ? 'effect-card-selected border-indigo-500 bg-indigo-500/10' 
                        : 'border-slate-800 hover:border-slate-600 bg-slate-900/40'}
                    `}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${selectedEffect.id === eff.id 
                        ? 'bg-indigo-500 text-white rotate-6' 
                        : 'bg-slate-800 text-slate-500 group-hover:scale-110 group-hover:bg-slate-700'}
                    `}>
                      <i className={`fas ${eff.icon} text-xl`}></i>
                    </div>
                    <div>
                      <span className="text-sm font-bold block truncate">{eff.name}</span>
                      <span className="text-[10px] text-slate-500 block mt-1 line-clamp-1 opacity-70 group-hover:opacity-100">{eff.description}</span>
                    </div>
                    {selectedEffect.id === eff.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                        <i className="fas fa-check text-[10px] text-white"></i>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Action */}
            <div className="pt-6">
              <button
                onClick={handleCreateVideo}
                disabled={!image || !audio}
                className={`w-full py-6 rounded-[2rem] text-xl font-black transition-all transform active:scale-[0.97] flex items-center justify-center gap-4 shadow-2xl
                  ${image && audio 
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-indigo-600/30' 
                    : 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-40'}
                `}
              >
                <i className="fas fa-play-circle text-2xl"></i>
                GENERATE "{selectedEffect.name.toUpperCase()}" VIDEO
              </button>
            </div>
          </div>
        )}

        {(status === AppStatus.ANALYZING || status === AppStatus.GENERATING) && (
          <div className="py-24 flex flex-col items-center text-center space-y-10">
            <div className="relative">
              <div className="w-40 h-40 border-[8px] border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin shadow-[0_0_30px_rgba(79,70,229,0.2)]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className={`fas ${selectedEffect.icon} text-indigo-400 text-5xl animate-pulse`}></i>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white tracking-tight">
                {status === AppStatus.ANALYZING ? "AI Đang Lên Ý Tưởng..." : "Đang Sản Xuất Video..."}
              </h3>
              <div className="bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800 max-w-md mx-auto">
                <p className="text-slate-400 text-sm font-medium animate-pulse">"{statusMessage}"</p>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && resultUrl && (
          <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-700">
            <div className="relative group rounded-[2rem] overflow-hidden aspect-video bg-black shadow-2xl border border-white/5 ring-1 ring-white/10">
              <video src={resultUrl} controls autoPlay loop className="w-full h-full object-contain" />
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="bg-indigo-600/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/10">
                  <i className={`fas ${selectedEffect.icon}`}></i> {selectedEffect.name}
                </span>
                <span className="bg-emerald-500/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/10">
                  <i className="fas fa-video"></i> VEO 3.1 FAST
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                onClick={() => downloadVideo(resultUrl, `Vu_RuBi_${selectedEffect.id}_${Date.now()}.mp4`)}
                className="py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
              >
                <i className="fas fa-download text-xl"></i> TẢI XUỐNG NGAY
              </button>
              <button
                onClick={reset}
                className="py-5 bg-slate-800/80 hover:bg-slate-700 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all border border-slate-700 active:scale-95"
              >
                <i className="fas fa-plus-circle text-xl"></i> LÀM VIDEO MỚI
              </button>
            </div>

            <div className="p-6 bg-slate-900/50 rounded-[1.5rem] border border-slate-800">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-quote-left text-indigo-500"></i>
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Kịch Bản AI Gemini</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic font-medium opacity-80">"{aiPrompt}"</p>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="py-20 text-center space-y-8">
            <div className="w-28 h-28 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-5xl mx-auto border border-red-500/20 animate-bounce">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-white">Úi! Có Lỗi Rồi</h3>
              <p className="text-red-400 max-w-md mx-auto font-medium opacity-80">{error}</p>
            </div>
            <button onClick={reset} className="py-4 px-12 bg-slate-800 hover:bg-slate-700 rounded-2xl font-black transition-all transform active:scale-95">Quay Lại Thử Lại</button>
          </div>
        )}
      </main>

      <footer className="relative z-10 text-slate-500 text-[10px] font-bold uppercase tracking-[0.25em] flex flex-col items-center gap-8">
        <div className="flex flex-wrap justify-center items-center gap-8 bg-slate-900/60 backdrop-blur-md px-10 py-4 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2.5"><i className="fas fa-microchip text-indigo-400"></i> Gemini 3 Pro</div>
          <div className="flex items-center gap-2.5"><i className="fas fa-wand-magic-sparkles text-purple-400"></i> Veo Engine</div>
          <div className="flex items-center gap-2.5"><i className="fas fa-shield-halved text-emerald-400"></i> Professional API</div>
        </div>
        <div className="text-center opacity-40">
          <p>TikTok Trend Video Generator Engine</p>
          <p className="mt-1">© 2024 『TW』Vũ•RuBi - Proudly Built with AI</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
