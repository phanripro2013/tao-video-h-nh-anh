
export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface Effect {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  promptKeyword: string;
  color: string;
}

export const EFFECT_CATEGORIES = [
  { id: 'winter', name: 'Winter/Chill', icon: 'fa-snowflake' },
  { id: 'glow', name: 'Glow/Light', icon: 'fa-sun' },
  { id: 'space', name: 'Space/Cosmic', icon: 'fa-user-astronaut' },
  { id: 'energy', name: 'Energy/Motion', icon: 'fa-bolt' },
  { id: 'viral', name: 'Viral/Social', icon: 'fa-heart' },
  { id: 'pro', name: 'Chuyên Nghiệp', icon: 'fa-video' }
];

export const EFFECTS: Effect[] = [
  // Winter / Chill
  { id: 'snow', name: 'Tuyết Rơi', icon: 'fa-snowflake', category: 'winter', description: 'Hạt tuyết bay chậm, lãng mạn', promptKeyword: 'soft cinematic snowfall, winter chill, slow motion flakes', color: 'blue' },
  { id: 'chill_blur', name: 'Tuyết + Blur', icon: 'fa-wind', category: 'winter', description: 'Tuyết + blur nền điện ảnh', promptKeyword: 'snowflakes with heavy cinematic depth of field blur, soft focus background', color: 'cyan' },
  { id: 'snow_bokeh', name: 'Tuyết + Bokeh', icon: 'fa-lightbulb', category: 'winter', description: 'Tuyết + ánh đèn bokeh', promptKeyword: 'snowfall mixed with warm glowing bokeh lights, magical winter night', color: 'indigo' },
  { id: 'snow_neon', name: 'Tuyết + Neon', icon: 'fa-paints-chalic', category: 'winter', description: 'Tuyết + chữ phát sáng neon', promptKeyword: 'winter scene with vibrant glowing neon text and falling snow, synthwave winter', color: 'purple' },

  // Glow / Light
  { id: 'glow_neon', name: 'Neon Glow', icon: 'fa-bolt-lightning', category: 'glow', description: 'Hào quang neon rực rỡ', promptKeyword: 'vibrant neon glowing lines, pink and blue electric glow, high contrast', color: 'pink' },
  { id: 'light_sweep', name: 'Light Sweep', icon: 'fa-magic', category: 'glow', description: 'Ánh sáng quét ngang', promptKeyword: 'cinematic horizontal light sweep, lens flare, professional lighting', color: 'yellow' },
  { id: 'light_particle', name: 'Hạt Sáng', icon: 'fa-ellipsis-h', category: 'glow', description: 'Hạt sáng bay quanh', promptKeyword: 'floating magical light particles, golden dust, ethereal glow', color: 'orange' },
  { id: 'lens_flare', name: 'Lens Flare', icon: 'fa-camera', category: 'glow', description: 'Lóe sáng máy ảnh', promptKeyword: 'anamorphic lens flares, bright light leaks, professional cinematography', color: 'amber' },

  // Space / Cosmic
  { id: 'galaxy', name: 'Vũ Trụ', icon: 'fa-stars', category: 'space', description: 'Thiên hà di chuyển', promptKeyword: 'moving galaxy nebula background, cosmic space travel, stars swirling', color: 'purple' },
  { id: 'star_sparkle', name: 'Sao Lấp Lánh', icon: 'fa-star', category: 'space', description: 'Sao nhấp nháy lung linh', promptKeyword: 'twinkling star field, diamond sparkles, magical night sky', color: 'blue' },
  { id: 'aurora', name: 'Cực Quang', icon: 'fa-wave-square', category: 'space', description: 'Ánh sáng cực quang', promptKeyword: 'aurora borealis northern lights, green and purple cosmic waves', color: 'emerald' },
  { id: 'cosmic_dust', name: 'Bụi Vũ Trụ', icon: 'fa-spray-can', category: 'space', description: 'Bụi không gian', promptKeyword: 'cosmic space dust, nebula clouds, deep space atmosphere', color: 'violet' },

  // Energy / Motion
  { id: 'energy_wave', name: 'Sóng Năng Lượng', icon: 'fa-water', category: 'energy', description: 'Sóng năng lượng động', promptKeyword: 'pulsating energy waves, visual ripples, force field effect', color: 'cyan' },
  { id: 'electric', name: 'Tia Điện', icon: 'fa-bolt', category: 'energy', description: 'Tia chớp mạnh mẽ', promptKeyword: 'crackling electric lightning bolts, plasma energy, blue sparks', color: 'blue' },
  { id: 'fire_outline', name: 'Viền Lửa', icon: 'fa-fire', category: 'energy', description: 'Viền lửa rực cháy', promptKeyword: 'intense burning fire outlines, flame particles, hot embers', color: 'orange' },
  { id: 'smoke_motion', name: 'Khói Động', icon: 'fa-smog', category: 'energy', description: 'Khói chuyển động lượn', promptKeyword: 'flowing cinematic smoke, mystical fog, swirling mist', color: 'slate' },

  // Viral / Social
  { id: 'heart', name: 'Tim Bay', icon: 'fa-heart', category: 'viral', description: 'Hiệu ứng tim bay bổng', promptKeyword: 'floating 3D hearts, romantic aesthetic, love theme particles', color: 'red' },
  { id: 'bubble', name: 'Bong Bóng', icon: 'fa-circle-dot', category: 'viral', description: 'Bong bóng dễ thương', promptKeyword: 'magical floating bubbles, iridescent reflections, playful vibe', color: 'sky' },
  { id: 'emoji_rain', name: 'Mưa Emoji', icon: 'fa-face-smile', category: 'viral', description: 'Emoji rơi từ trên cao', promptKeyword: 'falling expressive emojis, viral social media style, colorful fun', color: 'yellow' },
  { id: 'social_float', name: 'Like/Comment', icon: 'fa-thumbs-up', category: 'viral', description: 'Tương tác bay lên', promptKeyword: 'floating social media like and heart icons, interactive overlay style', color: 'blue' },

  // Professional / Transitions
  { id: 'zoom_motion', name: 'Zoom In/Out', icon: 'fa-expand-arrows-alt', category: 'pro', description: 'Phóng to thu nhỏ mượt', promptKeyword: 'dynamic zoom in and out camera movements, smooth cinematic transition', color: 'zinc' },
  { id: 'motion_blur', name: 'Motion Blur', icon: 'fa-italic', category: 'pro', description: 'Làm mờ chuyển động', promptKeyword: 'professional motion blur effects, fast paced visual streaking', color: 'gray' },
  { id: 'glitch', name: 'Glitch', icon: 'fa-random', category: 'pro', description: 'Hiệu ứng nhiễu sóng', promptKeyword: 'digital glitch transitions, chromatic aberration, technological interference', color: 'fuchsia' },
  { id: 'flash_white', name: 'Flash Trắng', icon: 'fa-sun', category: 'pro', description: 'Lóe sáng chuyển cảnh', promptKeyword: 'bright white flash transitions, high energy scene cuts, exposure burst', color: 'white' }
];
