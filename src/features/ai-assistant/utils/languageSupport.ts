
// Language detection and support
export const SWAHILI_KEYWORDS = [
  'habari', 'sawa', 'bei', 'soko', 'mazao', 'wakulima', 'chakula', 'kilimo', 'mbegu', 'maji',
  'mahindi', 'pesa', 'ngapi', 'mombasa', 'nairobi', 'viazi', 'nyanya', 'ndizi', 'embe', 'kahawa',
  'jambo', 'hujambo', 'shikamoo', 'uza', 'nunua', 'mlimi', 'shamba', 'wapi', 'ni', 'kwa',
  'asante', 'tafadhali', 'samahani', 'naomba', 'nina', 'niko', 'unahitaji', 'ungependa'
];

export const KIKUYU_KEYWORDS = [
  'wĩra', 'mũgũnda', 'irio', 'mbembe', 'mbeca', 'thoko', 'mũrĩmi', 'niatia', 'wendo',
  'mũtũrĩre', 'thogora', 'kũgũra', 'gũcuura', 'mĩgũnda', 'njahi', 'thigari', 'mĩkũyũ'
];

export const LUO_KEYWORDS = [
  'chiemo', 'puothe', 'cham', 'yath', 'ohala', 'lupo', 'ber', 'japur', 'chiro', 'nengo',
  'loko', 'wuok', 'kel', 'nadi', 'dwaro', 'winjo', 'penjo', 'ayie', 'erokamano'
];

export const KALENJIN_KEYWORDS = [
  'kerichek', 'imbarek', 'chepkwony', 'beek', 'korosio', 'burgeiyot', 'chamgei', 'sukik',
  'oret', 'any', 'muche', 'tany', 'ng', 'ab', 'ko', 'ak', 'nebo', 'che'
];

// Adding support for more tribes in Kenya
export const KAMBA_KEYWORDS = ['muunda', 'liu', 'mbesa', 'soko', 'mbemba', 'museo', 'uu', 'ni', 'wa'];
export const MAASAI_KEYWORDS = ['enkop', 'enkare', 'olkishu', 'olmurrani', 'sopa', 'iltunga'];
export const MERU_KEYWORDS = ['muunda', 'irio', 'mugunda', 'biashara', 'muuga', 'nkuru'];

// Enhanced language response templates with more conversational patterns
export const languageResponses = {
  swahili: {
    greeting: "Habari! Mimi ni msaidizi wako wa kilimo. Ninaweza kukusaidia kupata masoko, kubashiri bei, kukuunganisha na maghala na wasafirishaji, kupata wanunuzi, na kukupa taarifa kuhusu mazao. Unahitaji msaada gani?",
    cropRequest: "Unakulima zao gani? Au unauliza kuhusu zao gani?",
    marketPrices: (crop: string) => `Bei ya soko ya ${crop} inabadilika kulingana na eneo na msimu. Je, unataka kujua bei katika eneo gani? Pia ninaweza kukupatia utabiri wa bei.`,
    forecast: (crop: string) => `Utabiri wa bei ya ${crop} kwa wiki ijayo unaonesha mabadiliko. Ningependa kujua mahali unapo ili niweze kukupa maelezo sahihi zaidi.`,
    locationRequest: "Uko wapi? Au unahitaji taarifa za eneo gani?",
    warehouseInfo: "Kuna maghala mbalimbali yanayopatikana. Je, ungependa kujua kuhusu maghala karibu na wewe?",
    transporterInfo: "Ninaweza kukusaidia kupata wasafirishaji. Unahitaji kusafirisha mazao kutoka wapi na kwenda wapi?",
    maizePricesResponses: [
      "Bei ya mahindi Mombasa ni kati ya KES 50-65 kwa kilo. Soko kuu la Kongowea lina bei nzuri zaidi.",
      "Kwa sasa, mahindi yanauziwa bei ya KES 4,500 hadi 5,200 kwa gunia la 90kg katika soko la Mombasa.",
      "Mahindi yanauzwa kwa bei ya juu zaidi mwishoni mwa juma huko Mombasa."
    ],
    thanksResponse: "Karibu sana! Uko na swali lingine kuhusu kilimo au masoko?",
    helpResponse: "Ninaweza kukusaidia na: \n• Bei za mazao \n• Utabiri wa soko \n• Kupata wasafirishaji \n• Kupata maghala \n• Masoko ya mazao",
    generalResponse: "Ninakuelewa. Je, ungependa kujua zaidi kuhusu bei za mazao, masoko, au wasafirishaji?",
    noUnderstanding: "Samahani, sikuelewa vizuri ombi lako. Tafadhali jaribu tena kwa maneno tofauti au niambie unahitaji msaada gani kuhusu kilimo."
  },
  kikuyu: {
    greeting: "Niatia! Nĩ niĩ mũteithia waku wa ũrĩmi. No ngũteithi kũona thoko, gũthugumĩra thogora, gũkũnyitithania na makorigiriro na athuti, gũcaria agũri, na gũkũhe ũmenyo kuuma kũrĩ ũrĩmi. Ũbataire ũteithio ũrĩkũ?",
    cropRequest: "Nĩ mũgũnda ũrĩa ũrahanda? Kana ũroria ũhoro wa mũgũnda ũrĩkũ?",
    marketPrices: (crop: string) => `Thogora wa ${crop} ĩraugĩka kuringana na kũrĩa ũrĩ na ihinda. Ũrenda kũmenya thogora kũ? No ndĩrĩ na ũhoro wa ũthugumĩri wa thogora.`,
    forecast: (crop: string) => `Ũthugumĩri wa thogora wa ${crop} kiumia kĩĩ kĩrooka wonanagia atĩ gũkaagĩra na magarũrũko. Nĩngenda kũmenya kũrĩa ũrĩ nĩguo ngũhe ũhoro wa ma.`,
    locationRequest: "Ũrĩ kũ? Kana ũbataire ũhoro wa kũ?",
    thanksResponse: "Ũrĩ mwega! Ũrĩ na kĩũria kĩngĩ gĩa ũrĩmi kana thoko?",
    noUnderstanding: "Nĩndagũthima, no ndiracoka kwĩgua wendi waku. Tafadhali geria rĩngĩ na ciugo ingĩ kana ũnjĩĩre ũteithio ũrĩa ũbataire igũrũ rĩa ũrĩmi.",
    generalResponse: "Nĩngũkũmenya. Ũrenda kũmenya makĩria ũhoro wa thogora wa irio, thoko, kana athuti?"
  },
  luo: {
    greeting: "Ber ahinya! An jakony mari mar pur. Anyalo konyi yudo chiro, koro nengo, riwakonyo gi migepe mag kano kod jooting, yudo jongiewo, gi miyoi puonj mar pur. Idwaro kony mane?",
    cropRequest: "Itimo pur mar ang'o? Kata ipenjo kuom pur mane?",
    marketPrices: (crop: string) => `Nengo mar ${crop} lokore kaluwore gi kama intie kod kinde. Idwaro ngʼeyo nengo kanye? Bende anyalo miyi paro mar nengo mabiro.`,
    forecast: (crop: string) => `Paro mar nengo mar ${crop} mar juma mabiro nyiso ni nitie aloke. Daher ngʼeyo kama intie mondo ami puonj mowinjore.`,
    locationRequest: "In kanye? Kata idwaro ngʼeyo kuom kanye?",
    thanksResponse: "Oriti! In gi penjo machielo kuom pur kata chiro?",
    noUnderstanding: "Akwayo tweyo, ok awinj penjoni maber. Tem kendo gi weche mopogore kata nyisa kony mane idwaro kuom pur.",
    generalResponse: "Awinjo. Idwaro ngʼeyo mangʼeny kuom nengo mag cham, chirni, kata jooot?"
  },
  kalenjin: {
    greeting: "Chamgei! Ani ne bo ngo ya kerichek. Amuche anyiny sukik, astap oret, anai temik ak kobet ab getik ak boisionik, anai bolenjik, ak anyinjin imbarek chebo kerichek. Imache kony ainon?",
    cropRequest: "Imbarek ainon ne imine? Ak itaemwai imbarek ainon?",
    marketPrices: (crop: string) => `Oretab ${crop} kowal koborunet nebo ole imine ak araiet. Imache ngalngalto oret ale? Ak amuche miyi astap ab oret ne inoni.`,
    forecast: (crop: string) => `Astap ab oretab ${crop} wikit ne inoni kolewen konyor ko alokwek. Amache ngalngal ole imine nebo ami imbarek ne kosiche.`,
    locationRequest: "Imine ale? Ak imache ngalngalto ale?",
    thanksResponse: "Kokoryet! In ko taemit alak kobo kerichek ak sukik?",
    noUnderstanding: "Sabarei, matanyu kasotik maber. Saayi kaite ak kasaek alak anan ilenji toretinik ne icham kobo kerichek.",
    generalResponse: "Alngalngal. Imache ngalngalto oret ab imbarek, sukik, ak boisionik?"
  },
  english: {} // Will fall back to default English responses
};

type SupportedLanguage = 'english' | 'swahili' | 'kikuyu' | 'luo' | 'kalenjin' | 'kamba' | 'maasai' | 'meru';

// Enhanced language detection with more patterns
export const detectLanguage = (message: string): SupportedLanguage => {
  const lowerMessage = message.toLowerCase();
  
  // Enhanced detection with common phrases and patterns
  
  // Swahili detection - check for common words and patterns
  if (SWAHILI_KEYWORDS.some(keyword => lowerMessage.includes(keyword)) ||
      lowerMessage.match(/\b(ni|na|wa|ya|za|la|cha|ka|pa|ku|mu|m|u|i|a)\b/) ||
      lowerMessage.includes('hali') || lowerMessage.includes('nini')) {
    return 'swahili';
  }
  
  // Kikuyu detection
  if (KIKUYU_KEYWORDS.some(keyword => lowerMessage.includes(keyword)) ||
      lowerMessage.includes('ũ') || lowerMessage.includes('ĩ') || lowerMessage.includes('mũ')) {
    return 'kikuyu';
  }
  
  // Luo detection
  if (LUO_KEYWORDS.some(keyword => lowerMessage.includes(keyword)) ||
      lowerMessage.includes('nyathi') || lowerMessage.includes('japur')) {
    return 'luo';
  }
  
  // Kalenjin detection
  if (KALENJIN_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'kalenjin';
  }
  
  // Kamba detection
  if (KAMBA_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'kamba';
  }
  
  // Maasai detection
  if (MAASAI_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'maasai';
  }
  
  // Meru detection
  if (MERU_KEYWORDS.some(keyword => lowerMessage.includes(keyword))) {
    return 'meru';
  }
  
  // Default to English
  return 'english';
};

// Enhanced response handler with conversation context
export const handleLanguageResponse = (
  message: string, 
  detectedLanguage: SupportedLanguage
): string | null => {
  if (detectedLanguage === 'english') {
    return null; // Let the English flow handle it
  }

  const responses = languageResponses[detectedLanguage];
  if (!responses) return null;
  
  const lowerMessage = message.toLowerCase();
  
  // Extract key information from the message
  const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot|nyanya|viazi|mahindi|embe|kahawa|chai|maharagwe|ngano|mchele|ndizi|kitunguu|kabichi|karoti|mbembe|mũkenia|oduma|cham/gi);
  const crop = cropMatches ? cropMatches[0] : '';
  
  // Location detection
  const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|thika|machakos|meru|nyeri|embu|garissa|malindi|kitale|kakamega|bungoma|kericho|bomet|migori|homa bay|siaya|vihiga|trans nzoia|uasin gishu|nandi|baringo|laikipia|muranga|kirinyaga|tharaka nithi|isiolo/gi);
  const location = locationMatches ? locationMatches[0] : '';
  
  // Check for specific conversation patterns
  
  // Greetings
  if (lowerMessage.match(/^(habari|jambo|hujambo|shikamoo|niatia|ber|chamgei|museo|sopa|muuga)/i)) {
    return responses.greeting;
  }
  
  // Thanks responses
  if (lowerMessage.match(/(asante|erokamano|ngũkenia|kokoryet)/i)) {
    return responses.thanksResponse || responses.generalResponse;
  }
  
  // Help requests
  if (lowerMessage.match(/(msaada|ũteithio|kony|utatizi)/i)) {
    return responses.helpResponse || responses.generalResponse;
  }
  
  // Location questions
  if (lowerMessage.match(/(wapi|kũ|kanye|ale)/i) && !crop) {
    return responses.locationRequest || responses.generalResponse;
  }
  
  // Price questions
  if (lowerMessage.match(/(bei|pesa|ngapi|thogora|nengo|oret)/i)) {
    if (crop) {
      return responses.marketPrices ? responses.marketPrices(crop) : responses.generalResponse;
    }
    // Special case for "mahindi mombasa pesa ngapi"
    if (detectedLanguage === 'swahili' && 
        lowerMessage.includes('mahindi') && 
        lowerMessage.includes('mombasa')) {
      const randomIndex = Math.floor(Math.random() * (responses.maizePricesResponses?.length || 1));
      return responses.maizePricesResponses?.[randomIndex] || responses.generalResponse;
    }
    return responses.cropRequest;
  }
  
  // Warehouse/storage questions
  if (lowerMessage.match(/(maghala|kuhifadhi|makorigiriro|migepe)/i)) {
    return responses.warehouseInfo || responses.generalResponse;
  }
  
  // Transport questions  
  if (lowerMessage.match(/(wasafirishaji|gũtwara|jooot|boisionik)/i)) {
    return responses.transporterInfo || responses.generalResponse;
  }
  
  // Crop-specific questions
  if (crop) {
    if (lowerMessage.match(/(utabiri|ũthugumĩri|paro|astap)/i)) {
      return responses.forecast ? responses.forecast(crop) : responses.generalResponse;
    }
    return responses.marketPrices ? responses.marketPrices(crop) : responses.cropRequest;
  }
  
  // If asking about crops but no specific crop detected
  if (lowerMessage.match(/(mazao|irio|cham|imbarek|liu)/i)) {
    return responses.cropRequest;
  }
  
  // Default no understanding response
  return responses.noUnderstanding || responses.generalResponse;
};
