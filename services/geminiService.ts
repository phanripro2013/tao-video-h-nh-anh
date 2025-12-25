
import { GoogleGenAI } from "@google/genai";
import { FileData, Effect } from "../types";

export const analyzeMedia = async (image: FileData, audio: FileData, selectedEffect: Effect): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analyze this starting image and this audio clip. 
    The audio clip is the soundtrack for a video that should start from this image.
    
    CRITICAL STYLE REQUIREMENT: The user has selected the style/effect: "${selectedEffect.name}".
    Incorporate the following keywords into your video description to ensure this vibe: ${selectedEffect.promptKeyword}.
    
    Describe a cinematic, high-quality video sequence (720p style) that matches the mood, rhythm, and style of the audio.
    Focus on dynamic movement, lighting changes, and visual evolution starting from the initial frame.
    Output ONLY a descriptive prompt for a video generation model (max 200 words).
    Make it visually stunning and ethereal.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
        { inlineData: { data: audio.base64, mimeType: audio.mimeType } }
      ]
    },
    config: {
      temperature: 0.8,
    }
  });

  return response.text || `Cinematic transformation with ${selectedEffect.name} style and fluid motion.`;
};

export const generateVideoWithVeo = async (
  prompt: string, 
  startingImage: FileData,
  onProgress: (status: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  onProgress("Đang khởi tạo máy chủ video...");

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: startingImage.base64,
      mimeType: startingImage.mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  onProgress("Đang kết xuất hiệu ứng AI... (1-3 phút)");

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Tạo video thất bại - không nhận được liên kết");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!response.ok) throw new Error("Không thể tải video từ máy chủ.");
  
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
