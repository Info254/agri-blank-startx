
import { pipeline } from '@huggingface/transformers';

// Initialize models (cached after first load)
let languageDetector: any = null;
let textGenerator: any = null;
let translator: any = null;

// Initialize language detection model
const initLanguageDetector = async () => {
  if (!languageDetector) {
    try {
      languageDetector = await pipeline(
        'text-classification',
        'papluca/xlm-roberta-base-language-detection',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      languageDetector = await pipeline(
        'text-classification',
        'papluca/xlm-roberta-base-language-detection'
      );
    }
  }
  return languageDetector;
};

// Initialize text generation model
const initTextGenerator = async () => {
  if (!textGenerator) {
    try {
      textGenerator = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-medium',
        { device: 'webgpu' }
      );
    } catch (error) {
      console.warn('WebGPU not available, falling back to CPU');
      textGenerator = await pipeline(
        'text-generation',
        'microsoft/DialoGPT-medium'
      );
    }
  }
  return textGenerator;
};

// Improved language detection
export const detectLanguageAdvanced = async (text: string): Promise<string> => {
  try {
    const detector = await initLanguageDetector();
    const result = await detector(text);
    
    // Map detected languages to our supported ones
    const languageMap: { [key: string]: string } = {
      'en': 'english',
      'sw': 'swahili',
      'ki': 'kikuyu',
      'luo': 'luo',
      'kal': 'kalenjin',
      'kam': 'kamba',
      'mas': 'maasai',
      'mer': 'meru'
    };
    
    const detectedLang = result[0]?.label?.toLowerCase() || 'en';
    return languageMap[detectedLang] || 'english';
  } catch (error) {
    console.error('Language detection failed:', error);
    // Fallback to keyword-based detection
    return detectLanguageFallback(text);
  }
};

// Fallback language detection
const detectLanguageFallback = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Swahili keywords
  if (['habari', 'sawa', 'bei', 'soko', 'mazao', 'mahindi', 'chakula'].some(word => lowerText.includes(word))) {
    return 'swahili';
  }
  
  // Kikuyu keywords
  if (['wĩra', 'mũgũnda', 'irio', 'mbembe'].some(word => lowerText.includes(word))) {
    return 'kikuyu';
  }
  
  // Luo keywords
  if (['chiemo', 'puothe', 'cham', 'oduma'].some(word => lowerText.includes(word))) {
    return 'luo';
  }
  
  return 'english';
};

// Generate AI response in detected language
export const generateMultilingualResponse = async (
  userMessage: string,
  marketData: any,
  detectedLanguage: string
): Promise<string> => {
  try {
    // Create context-aware prompt
    const context = createMarketContext(marketData);
    const prompt = createLocalizedPrompt(userMessage, context, detectedLanguage);
    
    const generator = await initTextGenerator();
    const result = await generator(prompt, {
      max_length: 150,
      temperature: 0.7,
      do_sample: true,
      pad_token_id: 50256
    });
    
    return result[0]?.generated_text || getFallbackResponse(userMessage, detectedLanguage);
  } catch (error) {
    console.error('AI generation failed:', error);
    return getFallbackResponse(userMessage, detectedLanguage);
  }
};

// Create market context from data
const createMarketContext = (marketData: any): string => {
  const { markets = [], forecasts = [], warehouses = [] } = marketData;
  
  let context = 'Agricultural market information: ';
  
  if (markets.length > 0) {
    const sampleMarket = markets[0];
    context += `Current prices in ${sampleMarket.county}: `;
    sampleMarket.producePrices?.slice(0, 3).forEach((price: any) => {
      context += `${price.produceName} KES ${price.price}/${price.unit}, `;
    });
  }
  
  if (forecasts.length > 0) {
    context += `Price trends suggest ${forecasts[0].confidenceLevel} confidence. `;
  }
  
  if (warehouses.length > 0) {
    context += `Storage available in ${warehouses[0].location.county}. `;
  }
  
  return context;
};

// Create localized prompts
const createLocalizedPrompt = (message: string, context: string, language: string): string => {
  const systemPrompts = {
    english: "You are a helpful agricultural market assistant for Kenyan farmers. Provide clear, practical advice about crop prices, markets, and farming. Keep responses under 100 words.",
    swahili: "Wewe ni msaidizi wa masoko ya kilimo kwa wakulima wa Kenya. Toa ushauri wa kimsingi kuhusu bei za mazao, masoko, na kilimo. Weka majibu chini ya maneno 100.",
    kikuyu: "Wee uri muteithia wa masoko ma urimi kuri arimi a Kenya. He uthanyo wa kimenyo iguru ria thogora wa irio, masoko, na urimi.",
    luo: "In jakony mar chiro mag pur ne jopur mag Kenya. Mi puonj maber kuom nengo mag cham, chiro, gi pur.",
  };
  
  const systemPrompt = systemPrompts[language as keyof typeof systemPrompts] || systemPrompts.english;
  
  return `${systemPrompt}\n\nContext: ${context}\n\nUser: ${message}\n\nAssistant:`;
};

// Enhanced fallback responses
const getFallbackResponse = (message: string, language: string): string => {
  const responses = {
    english: {
      greeting: "Hello! I'm your agricultural assistant. I can help with market prices, crop advice, and finding buyers. What would you like to know?",
      prices: "Current maize prices in major markets range from KES 45-65 per kg. Prices vary by location and quality. Which specific area are you interested in?",
      general: "I can help you with market prices, crop advice, storage solutions, and connecting with buyers. What specific information do you need?"
    },
    swahili: {
      greeting: "Habari! Mimi ni msaidizi wako wa kilimo. Ninaweza kukusaidia kupata bei za masoko, ushauri wa mazao, na kupata wanunuzi. Unahitaji msaada gani?",
      prices: "Bei ya mahindi katika masoko makuu ni kati ya KES 45-65 kwa kilo. Bei zinabadilika kulingana na eneo na ubora. Unahitaji taarifa za eneo gani?",
      general: "Ninaweza kukusaidia kupata bei za masoko, ushauri wa mazao, ufumbuzi wa kuhifadhi, na kuunganishwa na wanunuzi. Unahitaji taarifa gani?"
    }
  };
  
  const langResponses = responses[language as keyof typeof responses] || responses.english;
  
  if (message.toLowerCase().includes('bei') || message.toLowerCase().includes('price')) {
    return langResponses.prices;
  }
  
  if (message.toLowerCase().includes('habari') || message.toLowerCase().includes('hello')) {
    return langResponses.greeting;
  }
  
  return langResponses.general;
};
