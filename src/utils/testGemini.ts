/**
 * Gemini API Test Utility
 * Use this to verify the Gemini API is working correctly
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyB3BKpkNo2TuHrrc9XIPVOSl72KQtIrQYI';

export async function testGeminiConnection(): Promise<{
  success: boolean;
  message: string;
  model?: string;
  error?: string;
}> {
  try {
    console.log('🔍 Testing Gemini API connection...');
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Try with gemini-1.5-flash-latest (most stable and available)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    
    const prompt = 'Say "Hello from YourHelpa!" in exactly 5 words.';
    
    console.log('📤 Sending test prompt...');
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Response received:', text);
    
    return {
      success: true,
      message: 'Gemini API is working correctly!',
      model: 'gemini-1.5-flash-latest',
    };
  } catch (error: any) {
    console.error('❌ Gemini API Error:', error);
    
    let errorMessage = 'Unknown error occurred';
    
    if (error?.message) {
      if (error.message.includes('API key')) {
        errorMessage = 'Invalid API key. Please check your Gemini API key.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Model not found. The API might need updating.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded. Please check your usage limits.';
      } else if (error.message.includes('SAFETY')) {
        errorMessage = 'Content blocked by safety filters.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      message: 'Gemini API test failed',
      error: errorMessage,
    };
  }
}

export async function listAvailableModels(): Promise<string[]> {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // Try common model names - updated for 2025 API
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-pro',
      'gemini-pro',
    ];
    
    const availableModels: string[] = [];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Test');
        await result.response;
        availableModels.push(modelName);
        console.log(`✅ ${modelName} - Available`);
      } catch (error: any) {
        console.log(`❌ ${modelName} - Not available`);
      }
    }
    
    return availableModels;
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testGemini = testGeminiConnection;
  (window as any).listGeminiModels = listAvailableModels;
}