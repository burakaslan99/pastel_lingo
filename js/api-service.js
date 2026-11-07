/**
 * api-service.js
 * LLM API Entegrasyon Servisi (Gemini & OpenAI Desteği + Yerleşik Çevrimdışı Akıllı Motor)
 * 
 * Kullanıcı API anahtarı girdiğinde doğrudan canlı yapay zeka ile konuşur ve derin analiz alır.
 * API anahtarı olmadığında veya çevrimdışıyken yerleşik akıllı motora (grammar-engine & scenarios)
 * kesintisiz geri döner; böylece uygulama her koşulda kusursuz çalışır!
 */

class AIService {
  constructor() {
    this.storageKey = 'ingilizce_pratik_ai_config';
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Config load error", e);
    }
    return {
      provider: 'offline', // 'gemini' | 'openai' | 'offline'
      geminiKey: '',
      geminiModel: 'gemini-1.5-flash',
      openaiKey: '',
      openaiModel: 'gpt-4o-mini'
    };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.config));
    } catch (e) {
      console.warn("Config save error", e);
    }
  }

  isLiveApiActive() {
    if (this.config.provider === 'gemini' && this.config.geminiKey) return true;
    if (this.config.provider === 'openai' && this.config.openaiKey) return true;
    return false;
  }

  getActiveProviderName() {
    if (this.config.provider === 'gemini' && this.config.geminiKey) return 'Google Gemini API';
    if (this.config.provider === 'openai' && this.config.openaiKey) return 'OpenAI API';
    return 'Yerleşik Akıllı Motor (Ücretsiz / Çevrimdışı)';
  }

  /**
   * Senaryo veya Serbest Sohbet için bir sonraki cevabı üretir
   */
  async generateReply({ messages, scenario, userLevel, mode = 'scenario', persona = null }) {
    if (this.isLiveApiActive()) {
      try {
        if (this.config.provider === 'gemini') {
          return await this._generateGeminiReply({ messages, scenario, userLevel, mode, persona });
        } else if (this.config.provider === 'openai') {
          return await this._generateOpenAIReply({ messages, scenario, userLevel, mode, persona });
        }
      } catch (error) {
        console.error("Live AI call failed, falling back to smart local simulation:", error);
        // Fallback to local
      }
    }

    // Yerleşik Çevrimdışı Simülasyon
    return this._generateLocalSimulatedReply({ messages, scenario, userLevel, mode, persona });
  }

  /**
   * Gemini API ile Cevap Üretme
   */
  async _generateGeminiReply({ messages, scenario, userLevel, mode, persona }) {
    const apiKey = this.config.geminiKey;
    const model = this.config.geminiModel || 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let systemInstruction = "";
    if (mode === 'scenario' && scenario) {
      systemInstruction = `You are roleplaying as "${scenario.character.name}" (${scenario.character.role}) in this real-life scenario: "${scenario.title}".
Context: ${scenario.context}.
Target user English level: ${userLevel} (Turkish preparatory / hazırlık university student).
Goal: Provide brief, natural, realistic conversational English responses (1 to 2 short sentences).
Keep your language strictly suited to CEFR ${userLevel}. Do not write long paragraphs. Speak directly to the user in-character. Do not break character.`;
    } else {
      const pName = persona ? persona.name : "Charlie";
      const pDesc = persona ? persona.description : "English practice buddy";
      systemInstruction = `You are "${pName}", a friendly English practice companion for a Turkish university prep student.
Your persona: ${pDesc}.
User's English level: ${userLevel}.
Respond in friendly, natural, supportive English (1-3 sentences). Ask engaging follow-up questions to keep the conversation flowing.`;
    }

    // Gemini formatına dönüştür
    const contents = [];
    messages.forEach(msg => {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    });

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Hatası (${response.status}): ${errData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I see! Could you tell me more?";
    return {
      text: replyText.trim(),
      source: 'gemini'
    };
  }

  /**
   * OpenAI API ile Cevap Üretme
   */
  async _generateOpenAIReply({ messages, scenario, userLevel, mode, persona }) {
    const apiKey = this.config.openaiKey;
    const model = this.config.openaiModel || 'gpt-4o-mini';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    let systemPrompt = "";
    if (mode === 'scenario' && scenario) {
      systemPrompt = `You are roleplaying as "${scenario.character.name}" (${scenario.character.role}) in scenario: "${scenario.title}".
Target CEFR Level: ${userLevel} (Turkish prep student).
Rules: Reply strictly in character in 1-2 natural, simple English sentences suited to ${userLevel}.`;
    } else {
      systemPrompt = `You are an English conversation buddy for a Turkish prep student with level ${userLevel}. Keep responses 1-2 friendly sentences.`;
    }

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI Hatası (${response.status}): ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const replyText = data.choices?.[0]?.message?.content || "Understood! What else would you like to say?";
    return {
      text: replyText.trim(),
      source: 'openai'
    };
  }

  /**
   * Yerleşik Çevrimdışı / Simüle Edilmiş Cevap Üretimi (Hiçbir anahtar gerektirmez)
   */
  _generateLocalSimulatedReply({ messages, scenario, userLevel, mode, persona }) {
    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    const userText = (lastUserMessage ? lastUserMessage.text : '').toLowerCase();

    // 1. Senaryo İçi Simülasyon
    if (mode === 'scenario' && scenario && scenario.simulatedResponses) {
      for (const sim of scenario.simulatedResponses) {
        const matches = sim.trigger.some(trig => userText.includes(trig));
        if (matches) {
          return {
            text: sim.response,
            translation: sim.tr,
            source: 'offline_rule'
          };
        }
      }

      // Genel akış yanıtları
      const turnCount = messages.filter(m => m.sender === 'user').length;
      const genericScenarioReplies = [
        `That sounds good! Could you specify a little more detail for me?`,
        `I understand clearly. Is there anything else you would like to add?`,
        `Got it! Thank you for explaining that. Let's wrap this up, have a great day!`
      ];
      const index = Math.min(turnCount - 1, genericScenarioReplies.length - 1);
      return {
        text: genericScenarioReplies[Math.max(0, index)],
        translation: "Anladım! Başka eklemek istediğin bir şey var mı?",
        source: 'offline_fallback'
      };
    }

    // 2. Serbest Sohbet Simülasyonu
    const freeChatReplies = [
      "That is really interesting! What do you enjoy most about it?",
      "I see your point! How often do you usually do that during the week?",
      "That sounds exciting! How does that help with your English studies?",
      "Awesome! Many students feel the same way. What are your plans for tomorrow?",
      "I completely agree with you. Tell me more about your thoughts on this!"
    ];
    const randomReply = freeChatReplies[Math.floor(Math.random() * freeChatReplies.length)];

    return {
      text: randomReply,
      source: 'offline_free_chat'
    };
  }

  /**
   * Türkçe Gramer ve Hata Analizi
   * Canlı API bağlıysa LLM'e derin Türkçe analiz yaptırır; değilse grammarEngine'e yönlendirir.
   */
  async analyzeConversationWithAI(userMessages, scenarioContext = '', userLevel = 'A1') {
    if (this.isLiveApiActive()) {
      try {
        if (this.config.provider === 'gemini') {
          return await this._analyzeWithGemini(userMessages, scenarioContext, userLevel);
        } else if (this.config.provider === 'openai') {
          return await this._analyzeWithOpenAI(userMessages, scenarioContext, userLevel);
        }
      } catch (err) {
        console.warn("Live AI analysis failed, switching to local grammar engine:", err);
      }
    }

    // Yerleşik Kural Motoru Analizi (Kusursuz Türkçe Pedagojik Rapor)
    return window.grammarEngine.analyzeConversation(userMessages, scenarioContext, userLevel);
  }

  async _analyzeWithGemini(userMessages, scenarioContext, userLevel) {
    const apiKey = this.config.geminiKey;
    const model = this.config.geminiModel || 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Sen Türkiye'deki bir üniversite hazırlık okulunda görev yapan uzman ve çok cana yakın bir İngilizce hocasısın.
Aşağıda ${userLevel} seviyesindeki bir Türk öğrencinin senaryo diyalogunda yazdığı İngilizce cümleler listelenmiştir:

Öğrenci Cümleleri:
${userMessages.map((m, idx) => `[Cümle ${idx + 1}]: "${m}"`).join('\n')}

Senaryo: ${scenarioContext || 'Genel Pratik'}

GÖREVİN:
Öğrencinin cümlelerindeki gramer, edat (preposition), kelime seçimi, zaman uyumu (tenses) ve yazım hatalarını tespit et.
TÜM AÇIKLAMALARI VE GERİ BİLDİRİMLERİ TERTEMİZ, ÇOK AÇIK VE BASİT BİR TÜRKÇE İLE AÇIKLA.
Yeni başlayan bir hazırlık öğrencisinin "neden yanlış olduğunu" ve "doğrusunun nasıl olduğunu" kolayca anlamasını sağla.

Aşağıdaki JSON şablonunda çıktı ver (Başka hiçbir metin veya markdown olmadan sadece geçerli JSON döndür):
{
  "score": 85,
  "levelAppraisal": {
    "badge": "Başarılı ve Akıcı 👍",
    "message": "Seviyen için gayet güzel bir diyalog kurdun..."
  },
  "positiveFeedback": [
    "Cümle kurmaktan ve kendini ifade etmekten çekinmedin."
  ],
  "studyTips": [
    "Edatları kalıp olarak çalışmanı öneririm."
  ],
  "errors": [
    {
      "originalSentence": "Öğrencinin yazdığı orijinal cümle",
      "faultyPart": "Hatalı kısım",
      "category": "Gramer / Edat / Kelime / Zaman Uyumu",
      "title": "Hatanın Kısa Adı",
      "severity": "medium",
      "explanation": "Türkçe çok net ve basit açıklama: Neden yanlış olduğu...",
      "suggestedCorrection": "Doğru İngilizce cümle",
      "exampleCorrect": "Doğru örnek",
      "alternative": "Daha doğal alternatif bir kalıp"
    }
  ]
}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Analysis Error ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    // Kural motorunun kelime & mesaj istatistikleriyle birleştir
    const localReport = window.grammarEngine.analyzeConversation(userMessages, scenarioContext, userLevel);
    parsed.totalMessages = userMessages.length;
    parsed.totalWords = localReport.totalWords;
    parsed.errorsCount = (parsed.errors || []).length;
    return parsed;
  }

  async _analyzeWithOpenAI(userMessages, scenarioContext, userLevel) {
    const apiKey = this.config.openaiKey;
    const model = this.config.openaiModel || 'gpt-4o-mini';
    const endpoint = 'https://api.openai.com/v1/chat/completions';

    const prompt = `Sen Türkiye'deki bir üniversite hazırlık sınıfında İngilizce öğretmenisin.
Öğrencinin seviyesi: ${userLevel}.
Öğrencinin cümleleri:
${userMessages.map((m, idx) => `[Cümle ${idx + 1}]: "${m}"`).join('\n')}

Gramer, zaman uyumu ve edat hatalarını tespit et.
Açıklamaları yeni başlayan bir hazırlık öğrencisinin hemen anlayacağı samimi ve net bir Türkçe ile yap.
Sadece geçerli bir JSON objesi döndür:
{
  "score": 85,
  "levelAppraisal": { "badge": "Tebrikler", "message": "Harika çaba" },
  "positiveFeedback": ["Cümle akıcılığın iyi"],
  "studyTips": ["Geniş zaman -s takısına dikkat et"],
  "errors": [
    {
      "originalSentence": "Orijinal cümle",
      "faultyPart": "Hatalı kelime/kalıp",
      "category": "Gramer",
      "title": "Hata adı",
      "severity": "medium",
      "explanation": "Türkçe basit ve öğretici açıklama",
      "suggestedCorrection": "Doğru cümle",
      "exampleCorrect": "Örnek",
      "alternative": "Alternatif"
    }
  ]
}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        response_format: { type: "json_object" },
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI Analysis Error ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    const localReport = window.grammarEngine.analyzeConversation(userMessages, scenarioContext, userLevel);
    parsed.totalMessages = userMessages.length;
    parsed.totalWords = localReport.totalWords;
    parsed.errorsCount = (parsed.errors || []).length;
    return parsed;
  }

  /**
   * API Anahtarını Test Eder
   */
  async testConnection(provider, apiKey, model) {
    if (provider === 'gemini') {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: "Hello! Say only 'OK' if you can read this." }] }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Bağlantı hatası: ${res.status}`);
      }
      return true;
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (!res.ok) {
        throw new Error(`OpenAI API Hatası: ${res.status}`);
      }
      return true;
    }
    return true;
  }
}

// Global instance
window.aiService = new AIService();
