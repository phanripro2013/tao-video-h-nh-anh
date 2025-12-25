
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
  { id: 'viral', name: 'Viral/Social', icon: 'fa-heart' }
];

export const EFFECTS: Effect[] = [
  // Winter
  { id: 'snow', name: 'Tuyết Rơi', icon: 'fa-snowflake', category: 'winter', description: 'Hạt tuyết bay chậm, lãng mạn', promptKeyword: 'soft cinematic snowfall, winter chill, bokeh lighting', color: 'blue' },
  { id: 'chill_blur', name: 'Chill Blur', icon: 'fa-wind', category: 'winter', description: 'Tuyết + Blur nền điện ảnh', promptKeyword: 'heavy snowflakes, depth of field blur, cinematic winter atmosphere', color: 'cyan' },
  // Glow
  { id: 'neon', name: 'Neon Glow', icon: 'fa-lightbulb', category: 'glow', description: 'Chữ & viền phát sáng neon', promptKeyword: 'vibrant neon glowing outlines, pink and blue aesthetics, light trails', color: 'pink' },
  { id: 'light_sweep', name: 'Light Sweep', icon: 'fa-magic', category: 'glow', description: 'Ánh sáng quét ngang cực sang', promptKeyword: 'cinematic light sweeps, lens flare, bright light particles', color: 'yellow' },
  // Space
  { id: 'galaxy', name: 'Galaxy Space', icon: 'fa-stars', category: 'space', description: 'Vũ trụ huyền ảo', promptKeyword: 'starry galaxy background, aurora borealis, cosmic nebula dust', color: 'purple' },
  { id: 'star_sparkle', name: 'Star Sparkle', icon: 'fa-star', category: 'space', description: 'Sao nhấp nháy lung linh', promptKeyword: 'twinkling star sparkles, magical cosmic particles, deep space vibe', color: 'indigo' },
  // Energy
  { id: 'electric', name: 'Electric', icon: 'fa-bolt-lightning', category: 'energy', description: 'Tia điện mạnh mẽ', promptKeyword: 'electric lightning sparks, energy waves, blue plasma motion', color: 'blue' },
  { id: 'fire', name: 'Fire Outline', icon: 'fa-fire', category: 'energy', description: 'Viền lửa rực cháy', promptKeyword: 'intense fire outlines, burning embers, high energy smoke motion', color: 'orange' },
  // Viral
  { id: 'heart', name: 'Heart Floating', icon: 'fa-heart', category: 'viral', description: 'Tim bay lãng mạn', promptKeyword: 'floating 3D hearts, romantic bubble pop, social media viral aesthetic', color: 'red' },
  { id: 'bubble', name: 'Bubble Pop', icon: 'fa-bubbles', category: 'viral', description: 'Bong bóng dễ thương', promptKeyword: 'magical floating bubbles, iridescent reflections, playful atmosphere', color: 'teal' }
];
