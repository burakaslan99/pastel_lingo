/**
 * app.js
 * İngilizce Pratik ve Gelişim Uygulaması Ana Mantık ve UI Yönetimi
 */

document.addEventListener('DOMContentLoaded', () => {
  // Uygulama Durumu (State)
  const state = {
    currentLevel: localStorage.getItem('ingilizce_pratik_level') || null,
    currentTab: 'scenarios', // 'scenarios' | 'free-chat'
    activeScenario: null,
    messages: [], // { sender: 'ai' | 'user', text, translation, timestamp }
    freeChatMessages: [],
    selectedPersona: FREE_CHAT_PERSONAS[0],
    isProcessing: false,
    recognition: null,
    isRecording: false
  };

  // DOM Elemanları
  const elements = {
    // Navigasyon & Başlık
    navLevelSelector: document.getElementById('nav-level-selector'),
    currentLevelBadge: document.getElementById('current-level-badge'),
    tabScenariosBtn: document.getElementById('tab-scenarios-btn'),
    tabFreeChatBtn: document.getElementById('tab-free-chat-btn'),
    openSettingsBtn: document.getElementById('open-settings-btn'),
    aiStatusIndicator: document.getElementById('ai-status-indicator'),

    // Görünümler (Views)
    levelSelectView: document.getElementById('level-select-view'),
    scenariosView: document.getElementById('scenarios-view'),
    chatView: document.getElementById('chat-view'),
    freeChatView: document.getElementById('free-chat-view'),
    analysisModal: document.getElementById('analysis-modal'),
    settingsModal: document.getElementById('settings-modal'),

    // Seviye Seçim Kartları
    levelCardsContainer: document.getElementById('level-cards-container'),

    // Senaryo Listesi
    scenarioCardsGrid: document.getElementById('scenario-cards-grid'),
    scenarioLevelTitle: document.getElementById('scenario-level-title'),
    changeLevelFromScenarioBtn: document.getElementById('change-level-from-scenario-btn'),

    // Senaryo Sohbet Ekranı
    chatScenarioTitle: document.getElementById('chat-scenario-title'),
    chatCharacterName: document.getElementById('chat-character-name'),
    chatCharacterRole: document.getElementById('chat-character-role'),
    chatCharacterAvatar: document.getElementById('chat-character-avatar'),
    chatGoalDesc: document.getElementById('chat-goal-desc'),
    chatPhrasesContainer: document.getElementById('chat-phrases-container'),
    chatMessagesList: document.getElementById('chat-messages-list'),
    chatInput: document.getElementById('chat-input'),
    chatSendBtn: document.getElementById('chat-send-btn'),
    chatMicBtn: document.getElementById('chat-mic-btn'),
    finishAndAnalyzeBtn: document.getElementById('finish-and-analyze-btn'),
    backToScenariosBtn: document.getElementById('back-to-scenarios-btn'),
    turnProgressFill: document.getElementById('turn-progress-fill'),
    turnProgressText: document.getElementById('turn-progress-text'),

    // Serbest Sohbet Ekranı
    freeChatPersonasContainer: document.getElementById('free-chat-personas-container'),
    freeChatTopicsContainer: document.getElementById('free-chat-topics-container'),
    freeChatMessagesList: document.getElementById('free-chat-messages-list'),
    freeChatInput: document.getElementById('free-chat-input'),
    freeChatSendBtn: document.getElementById('free-chat-send-btn'),
    freeChatMicBtn: document.getElementById('free-chat-mic-btn'),
    freeChatAnalyzeBtn: document.getElementById('free-chat-analyze-btn'),
    clearFreeChatBtn: document.getElementById('clear-free-chat-btn'),

    // Analiz Modalı Elemanları
    analysisScoreCircle: document.getElementById('analysis-score-circle'),
    analysisScoreValue: document.getElementById('analysis-score-value'),
    analysisBadge: document.getElementById('analysis-badge'),
    analysisMessage: document.getElementById('analysis-message'),
    analysisStatsMessages: document.getElementById('analysis-stats-messages'),
    analysisStatsWords: document.getElementById('analysis-stats-words'),
    analysisStatsErrors: document.getElementById('analysis-stats-errors'),
    analysisErrorsList: document.getElementById('analysis-errors-list'),
    analysisPositiveList: document.getElementById('analysis-positive-list'),
    analysisTipsList: document.getElementById('analysis-tips-list'),
    closeAnalysisBtn: document.getElementById('close-analysis-btn'),
    analysisRetryBtn: document.getElementById('analysis-retry-btn'),
    analysisNewScenarioBtn: document.getElementById('analysis-new-scenario-btn'),
    analysisCopyBtn: document.getElementById('analysis-copy-btn'),

    // Ayarlar Modalı Elemanları
    settingProviderSelect: document.getElementById('setting-provider-select'),
    geminiSettingsGroup: document.getElementById('gemini-settings-group'),
    openaiSettingsGroup: document.getElementById('openai-settings-group'),
    geminiKeyInput: document.getElementById('gemini-key-input'),
    geminiModelSelect: document.getElementById('gemini-model-select'),
    openaiKeyInput: document.getElementById('openai-key-input'),
    openaiModelSelect: document.getElementById('openai-model-select'),
    saveSettingsBtn: document.getElementById('save-settings-btn'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    testApiBtn: document.getElementById('test-api-btn'),
    apiTestResult: document.getElementById('api-test-result')
  };

  // --- BAŞLATMA (INIT) ---
  function init() {
    setupSpeechRecognition();
    setupEventListeners();
    updateAIStatusBadge();
    populateSettingsInputs();

    // Seviye varsa doğrudan senaryoları göster, yoksa seviye seçimini aç
    if (state.currentLevel && LEVELS_DATA[state.currentLevel]) {
      setLevel(state.currentLevel, false);
      renderScenarioCards();
      showView('scenarios');
    } else {
      renderLevelSelectionCards();
      showView('level-select');
    }

    renderFreeChatPersonas();
    renderFreeChatTopics();
  }

  // --- SES TANIMA & TELAFFUZ (Web Speech API) ---
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      state.recognition = new SpeechRecognition();
      state.recognition.continuous = false;
      state.recognition.lang = 'en-US';
      state.recognition.interimResults = false;

      state.recognition.onstart = () => {
        state.isRecording = true;
        updateMicButtons(true);
      };

      state.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (state.currentTab === 'scenarios') {
          elements.chatInput.value = transcript;
          elements.chatInput.focus();
        } else {
          elements.freeChatInput.value = transcript;
          elements.freeChatInput.focus();
        }
      };

      state.recognition.onerror = (e) => {
        console.warn("Speech recognition error", e);
        stopVoiceRecognition();
      };

      state.recognition.onend = () => {
        stopVoiceRecognition();
      };
    } else {
      if (elements.chatMicBtn) elements.chatMicBtn.title = "Tarayıcınız ses tanımayı desteklemiyor";
      if (elements.freeChatMicBtn) elements.freeChatMicBtn.title = "Tarayıcınız ses tanımayı desteklemiyor";
    }
  }

  function toggleVoiceRecognition() {
    if (!state.recognition) {
      alert("Tarayıcınız ses tanımayı desteklemiyor. Google Chrome veya Edge kullanmanız önerilir.");
      return;
    }
    if (state.isRecording) {
      state.recognition.stop();
      stopVoiceRecognition();
    } else {
      try {
        state.recognition.start();
      } catch (err) {
        console.warn("Recognition start failed", err);
      }
    }
  }

  function stopVoiceRecognition() {
    state.isRecording = false;
    updateMicButtons(false);
  }

  function updateMicButtons(recording) {
    const btns = [elements.chatMicBtn, elements.freeChatMicBtn];
    btns.forEach(btn => {
      if (!btn) return;
      if (recording) {
        btn.classList.add('mic-active');
        btn.innerHTML = `<span class="pulse-dot"></span> Dinliyor...`;
      } else {
        btn.classList.remove('mic-active');
        btn.innerHTML = `🎤 Konuş`;
      }
    });
  }

  // İngilizce Metni Seslendirme (Text-to-Speech)
  function speakEnglishText(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Varsa önceki sesi kes

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Hazırlık öğrencileri için hafif sakin tempo

    // Uygun bir İngilizce ses seçmeye çalış
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // --- SEVİYE YÖNETİMİ ---
  function renderLevelSelectionCards() {
    elements.levelCardsContainer.innerHTML = '';
    Object.values(LEVELS_DATA).forEach(level => {
      const card = document.createElement('div');
      card.className = `level-card ${level.colorClass}`;
      card.innerHTML = `
        <div class="level-card-header">
          <span class="level-code">${level.code}</span>
          <span class="level-badge">${level.badge}</span>
        </div>
        <h3 class="level-title">${level.name}</h3>
        <p class="level-desc">${level.description}</p>
        <div class="level-topics">
          ${level.targetTopics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
        </div>
        <button class="btn btn-primary select-level-action-btn" data-level="${level.code}">
          Bu Seviyeyi Seç ve Başla →
        </button>
      `;

      card.querySelector('.select-level-action-btn').addEventListener('click', () => {
        setLevel(level.code, true);
      });

      elements.levelCardsContainer.appendChild(card);
    });
  }

  function setLevel(levelCode, navigateToScenarios = true) {
    state.currentLevel = levelCode;
    localStorage.setItem('ingilizce_pratik_level', levelCode);

    // Navbar göstergesini güncelle
    elements.navLevelSelector.value = levelCode;
    elements.currentLevelBadge.textContent = levelCode;
    elements.currentLevelBadge.className = `badge level-pill pill-${levelCode.toLowerCase().replace('+', 'plus')}`;

    if (navigateToScenarios) {
      renderScenarioCards();
      showView('scenarios');
    }
  }

  // --- SENARYO LİSTELEME ---
  function renderScenarioCards() {
    if (!state.currentLevel || !LEVELS_DATA[state.currentLevel]) {
      state.currentLevel = 'A1';
    }
    const levelInfo = LEVELS_DATA[state.currentLevel];
    if (elements.scenarioLevelTitle) {
      elements.scenarioLevelTitle.textContent = `${levelInfo.name} - Günlük Yaşam Senaryoları`;
    }

    // Filtreleme: Önce mevcut seviyenin senaryoları, sonra diğer seviyeler
    elements.scenarioCardsGrid.innerHTML = '';

    const currentLevelScenarios = SCENARIOS_DATA.filter(s => s.level === state.currentLevel);
    const otherScenarios = SCENARIOS_DATA.filter(s => s.level !== state.currentLevel);

    const allToShow = [...currentLevelScenarios, ...otherScenarios];

    allToShow.forEach(scenario => {
      const isCurrent = scenario.level === state.currentLevel;
      const card = document.createElement('div');
      card.className = `scenario-card ${isCurrent ? 'scenario-recommended' : 'scenario-other'}`;
      card.style.cursor = 'pointer';

      card.innerHTML = `
        <div class="scenario-card-top">
          <span class="scenario-icon">${scenario.icon}</span>
          <div class="scenario-badges">
            <span class="badge badge-subtle">${scenario.category}</span>
            <span class="badge badge-level ${isCurrent ? 'badge-active' : ''}">${scenario.level}</span>
          </div>
        </div>
        <h3 class="scenario-card-title">${scenario.title}</h3>
        <p class="scenario-card-desc">${scenario.shortDesc}</p>
        <div class="scenario-character-preview">
          <span class="char-avatar">${scenario.character.avatar}</span>
          <div class="char-details">
            <strong>${scenario.character.name}</strong>
            <small>${scenario.character.role}</small>
          </div>
        </div>
        <div class="scenario-goal-box">
          <span class="goal-label">🎯 Senaryo Hedefi:</span>
          <p>${scenario.targetGoal}</p>
        </div>
        <button class="btn btn-outline scenario-start-btn" data-id="${scenario.id}">
          Diyaloğa Başla 💬
        </button>
      `;

      // Hem karta hem butona tıklama desteği
      card.addEventListener('click', () => {
        startScenario(scenario);
      });

      const startBtn = card.querySelector('.scenario-start-btn');
      if (startBtn) {
        startBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          startScenario(scenario);
        });
      }

      elements.scenarioCardsGrid.appendChild(card);
    });
  }

  // --- SENARYO SOHBETİNİ BAŞLATMA & YÖNETME ---
  function startScenario(scenario) {
    if (!scenario) return;
    state.activeScenario = scenario;
    state.messages = [];

    // Başlık ve karakter bilgilerini doldur (güvenli null kontrolü ile)
    if (elements.chatScenarioTitle) elements.chatScenarioTitle.textContent = scenario.title || 'Senaryo';
    if (elements.chatCharacterName) elements.chatCharacterName.textContent = scenario.character ? scenario.character.name : 'Asistan';
    if (elements.chatCharacterRole) elements.chatCharacterRole.textContent = scenario.character ? scenario.character.role : '';
    if (elements.chatCharacterAvatar) elements.chatCharacterAvatar.textContent = scenario.character ? scenario.character.avatar : '🧑‍🍳';
    if (elements.chatGoalDesc) elements.chatGoalDesc.textContent = scenario.targetGoal || '';

    // Önerilen kalıpları hazırla
    if (elements.chatPhrasesContainer) {
      elements.chatPhrasesContainer.innerHTML = '';
      if (scenario.suggestedPhrases && Array.isArray(scenario.suggestedPhrases)) {
        scenario.suggestedPhrases.forEach(item => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'phrase-pill';
          pill.innerHTML = `<strong>${item.en}</strong> <span class="phrase-tr">(${item.tr})</span>`;
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            if (elements.chatInput) {
              elements.chatInput.value = item.en;
              elements.chatInput.focus();
            }
          });
          elements.chatPhrasesContainer.appendChild(pill);
        });
      }
    }

    // Mesaj listesini temizle
    if (elements.chatMessagesList) {
      elements.chatMessagesList.innerHTML = '';
    }

    // Karakterin açılış mesajını ekle
    if (scenario.initialMessage && elements.chatMessagesList) {
      addMessageToChat({
        sender: 'ai',
        text: scenario.initialMessage,
        translation: scenario.initialMessageTr,
        character: scenario.character,
        timestamp: Date.now()
      }, elements.chatMessagesList);
    }

    // İlerleme çubuğunu sıfırla
    updateTurnProgress(0, scenario.maxTurns || 5);

    // Görünümü aç ve inputa odaklan
    showView('chat');
    if (elements.chatInput) {
      setTimeout(() => elements.chatInput.focus(), 100);
    }
  }

  function updateTurnProgress(current, max) {
    const percent = Math.min(100, Math.round((current / max) * 100));
    elements.turnProgressFill.style.width = `${percent}%`;
    elements.turnProgressText.textContent = `İlerleme: ${current} / ${max} Tur`;

    // Kullanıcı 3+ tur yaptığında analiz butonunu parlat
    if (current >= 3) {
      elements.finishAndAnalyzeBtn.classList.add('btn-highlight-pulse');
    } else {
      elements.finishAndAnalyzeBtn.classList.remove('btn-highlight-pulse');
    }
  }

  // --- MESAJ GÖNDERME VE ALMA ---
  async function handleSendMessage(mode = 'scenario') {
    if (state.isProcessing) return;

    const inputEl = mode === 'scenario' ? elements.chatInput : elements.freeChatInput;
    const listEl = mode === 'scenario' ? elements.chatMessagesList : elements.freeChatMessagesList;
    const text = inputEl.value.trim();

    if (!text) return;

    // 1. Kullanıcı mesajını ekle
    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: Date.now()
    };

    if (mode === 'scenario') {
      state.messages.push(userMsg);
    } else {
      state.freeChatMessages.push(userMsg);
    }

    addMessageToChat(userMsg, listEl);
    inputEl.value = '';

    // İlerlemeyi güncelle
    if (mode === 'scenario') {
      const userTurns = state.messages.filter(m => m.sender === 'user').length;
      updateTurnProgress(userTurns, state.activeScenario.maxTurns);
    }

    // 2. Yapay zeka yazıyor animasyonu göster
    state.isProcessing = true;
    const typingIndicator = showTypingIndicator(listEl);

    try {
      const activeMessages = mode === 'scenario' ? state.messages : state.freeChatMessages;
      const response = await window.aiService.generateReply({
        messages: activeMessages,
        scenario: state.activeScenario,
        userLevel: state.currentLevel,
        mode: mode,
        persona: state.selectedPersona
      });

      // Yazıyor animasyonunu kaldır
      typingIndicator.remove();

      const aiMsg = {
        sender: 'ai',
        text: response.text,
        translation: response.translation || null,
        character: mode === 'scenario' ? state.activeScenario.character : state.selectedPersona,
        timestamp: Date.now()
      };

      if (mode === 'scenario') {
        state.messages.push(aiMsg);
      } else {
        state.freeChatMessages.push(aiMsg);
      }

      addMessageToChat(aiMsg, listEl);
    } catch (err) {
      console.error("Message processing error:", err);
      typingIndicator.remove();

      const errorMsg = {
        sender: 'ai',
        text: "I heard you, that's interesting! Let's continue practicing.",
        translation: "Seni duydum, çok ilginç! Pratik yapmaya devam edelim.",
        character: mode === 'scenario' ? state.activeScenario.character : state.selectedPersona,
        timestamp: Date.now()
      };
      addMessageToChat(errorMsg, listEl);
    } finally {
      state.isProcessing = false;
      inputEl.focus();
    }
  }

  function addMessageToChat(msg, container) {
    const isUser = msg.sender === 'user';
    const messageEl = document.createElement('div');
    messageEl.className = `chat-bubble-wrapper ${isUser ? 'user-wrapper' : 'ai-wrapper'}`;

    const avatar = isUser ? '🧑‍🎓' : (msg.character ? msg.character.avatar : '🤖');
    const senderName = isUser ? 'Sen (Öğrenci)' : (msg.character ? msg.character.name : 'Asistan');

    let actionsHtml = '';
    if (!isUser) {
      actionsHtml = `
        <div class="bubble-actions">
          <button class="bubble-action-btn tts-btn" title="Telaffuzu Dinle (Listen)">
            🔊 Dinle
          </button>
          ${msg.translation ? `
            <button class="bubble-action-btn translate-btn" title="Türkçe Çevirisini Göster">
              🇹🇷 Çevir
            </button>
          ` : ''}
        </div>
      `;
    }

    messageEl.innerHTML = `
      <div class="bubble-avatar">${avatar}</div>
      <div class="bubble-content">
        <div class="bubble-sender">${senderName}</div>
        <div class="bubble-text">${escapeHtml(msg.text)}</div>
        ${msg.translation ? `<div class="bubble-translation hidden">${escapeHtml(msg.translation)}</div>` : ''}
        ${actionsHtml}
      </div>
    `;

    // Buton dinleyicileri
    if (!isUser) {
      const ttsBtn = messageEl.querySelector('.tts-btn');
      if (ttsBtn) {
        ttsBtn.addEventListener('click', () => speakEnglishText(msg.text));
      }

      const transBtn = messageEl.querySelector('.translate-btn');
      if (transBtn) {
        transBtn.addEventListener('click', () => {
          const transDiv = messageEl.querySelector('.bubble-translation');
          transDiv.classList.toggle('hidden');
          transBtn.classList.toggle('active');
        });
      }
    }

    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
  }

  function showTypingIndicator(container) {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-bubble-wrapper ai-wrapper typing-wrapper';
    typingEl.innerHTML = `
      <div class="bubble-avatar">💭</div>
      <div class="bubble-content typing-content">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;
    return typingEl;
  }

  // --- TÜRKÇE GRAMER VE HATA ANALİZİ ---
  async function triggerAnalysis(mode = 'scenario') {
    const messageSource = mode === 'scenario' ? state.messages : state.freeChatMessages;
    const userMessages = messageSource.filter(m => m.sender === 'user').map(m => m.text);

    if (userMessages.length === 0) {
      alert("Henüz herhangi bir İngilizce mesaj yazmadın. Analiz yapabilmek için lütfen karşındaki karaktere en az 1-2 cümle cevap ver.");
      return;
    }

    // Yükleniyor durumunu göster
    elements.analysisModal.classList.remove('hidden');
    renderAnalysisLoading();

    const scenarioTitle = mode === 'scenario' && state.activeScenario ? state.activeScenario.title : 'Serbest Sohbet Modu';

    try {
      const report = await window.aiService.analyzeConversationWithAI(
        userMessages,
        scenarioTitle,
        state.currentLevel
      );
      renderAnalysisReport(report, mode);
    } catch (err) {
      console.error("Analysis failed:", err);
      // Hata durumunda yerleşik analiz motoruna geri dön
      const fallbackReport = window.grammarEngine.analyzeConversation(
        userMessages,
        scenarioTitle,
        state.currentLevel
      );
      renderAnalysisReport(fallbackReport, mode);
    }
  }

  function renderAnalysisLoading() {
    elements.analysisScoreValue.textContent = '...';
    elements.analysisBadge.textContent = 'Analiz Yapılıyor...';
    elements.analysisMessage.textContent = 'Cümlelerinizdeki gramer kuralları, edatlar ve zaman uyumları Türkçe pedagojik açıklamalarla taranıyor...';
    elements.analysisErrorsList.innerHTML = `<div class="analysis-loading-box"><span class="spinner"></span> Cümleleriniz inceleniyor, lütfen bekleyin...</div>`;
    elements.analysisPositiveList.innerHTML = '';
    elements.analysisTipsList.innerHTML = '';
  }

  function renderAnalysisReport(report, mode) {
    // 1. Skor ve Rozet
    elements.analysisScoreValue.textContent = report.score || 85;
    elements.analysisScoreCircle.style.background = `conic-gradient(#58A987 ${report.score || 85}%, #E2F4EB 0)`;

    const appraisal = report.levelAppraisal || { badge: 'Başarılı!', message: 'Çok güzel bir çalışma sergiledin.' };
    elements.analysisBadge.textContent = appraisal.badge;
    elements.analysisMessage.textContent = appraisal.message;

    // 2. İstatistikler
    elements.analysisStatsMessages.textContent = report.totalMessages || 0;
    elements.analysisStatsWords.textContent = report.totalWords || 0;
    elements.analysisStatsErrors.textContent = report.errorsCount || (report.errors ? report.errors.length : 0);

    // 3. Hata Listesi (ÖNEMLİ KISIM)
    elements.analysisErrorsList.innerHTML = '';

    if (!report.errors || report.errors.length === 0) {
      elements.analysisErrorsList.innerHTML = `
        <div class="analysis-empty-errors">
          <div class="empty-icon">🎉</div>
          <h4>Harika İş! Ciddi Bir Gramer Hatası Bulunamadı</h4>
          <p>Yazdığın tüm cümleler ${state.currentLevel} seviyesinde anlaşılır ve kurallara uygundu. Kendini ifade etmeye bu şekilde devam et!</p>
        </div>
      `;
    } else {
      report.errors.forEach((err, idx) => {
        const errorCard = document.createElement('div');
        errorCard.className = `error-report-card ${err.severity === 'critical' ? 'error-critical' : 'error-normal'}`;

        errorCard.innerHTML = `
          <div class="error-card-header">
            <span class="error-category-tag">${err.category || 'Gramer'}</span>
            <h4 class="error-card-title">${idx + 1}. ${err.title || 'Hata Tespiti'}</h4>
          </div>

          <div class="error-comparison-grid">
            <div class="sentence-box user-faulty">
              <span class="box-label">❌ Yazdığınız Cümle:</span>
              <p class="sentence-text">"${escapeHtml(err.originalSentence)}"</p>
            </div>

            <div class="sentence-box ai-corrected">
              <span class="box-label">✅ Olması Gereken Doğru Hali:</span>
              <p class="sentence-text">"${escapeHtml(err.suggestedCorrection || err.exampleCorrect)}"</p>
            </div>
          </div>

          <div class="error-explanation-box">
            <div class="explanation-title">💡 Neden Yanlış? (Türkçe Açıklama):</div>
            <p class="explanation-text">${escapeHtml(err.explanation)}</p>
          </div>

          ${err.alternative ? `
            <div class="error-alternative-box">
              <span class="alt-label">✨ Daha Doğal Konuşma Alternatifi:</span>
              <span class="alt-text">"${escapeHtml(err.alternative)}"</span>
            </div>
          ` : ''}
        `;

        elements.analysisErrorsList.appendChild(errorCard);
      });
    }

    // 4. Olumlu Geri Bildirimler
    elements.analysisPositiveList.innerHTML = '';
    (report.positiveFeedback || []).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `🌟 ${escapeHtml(item)}`;
      elements.analysisPositiveList.appendChild(li);
    });

    // 5. Hazırlık Çalışma Tavsiyeleri
    elements.analysisTipsList.innerHTML = '';
    (report.studyTips || []).forEach(tip => {
      const li = document.createElement('li');
      li.innerHTML = escapeHtml(tip);
      elements.analysisTipsList.appendChild(li);
    });

    // Buton davranışlarını ayarla
    elements.analysisRetryBtn.onclick = () => {
      elements.analysisModal.classList.add('hidden');
      if (mode === 'scenario' && state.activeScenario) {
        startScenario(state.activeScenario);
      } else {
        clearFreeChat();
      }
    };

    elements.analysisNewScenarioBtn.onclick = () => {
      elements.analysisModal.classList.add('hidden');
      renderScenarioCards();
      showView('scenarios');
    };

    elements.analysisCopyBtn.onclick = () => {
      copyReportToClipboard(report, mode);
    };
  }

  function copyReportToClipboard(report, mode) {
    let text = `--- İNGİLİZCE GELİŞİM VE HATA ANALİZ RAPORU ---\n`;
    text += `Seviye: ${state.currentLevel}\n`;
    text += `Genel Skor: ${report.score}/100\n`;
    text += `Değerlendirme: ${report.levelAppraisal?.badge} - ${report.levelAppraisal?.message}\n\n`;

    if (report.errors && report.errors.length > 0) {
      text += `TESPİT EDİLEN HATALAR:\n`;
      report.errors.forEach((e, i) => {
        text += `\n[${i + 1}] ${e.title} (${e.category})\n`;
        text += `Yazdığınız: "${e.originalSentence}"\n`;
        text += `Doğrusu: "${e.suggestedCorrection || e.exampleCorrect}"\n`;
        text += `Açıklama: ${e.explanation}\n`;
      });
    } else {
      text += `Harika! Belirgin hiçbir gramer hatası tespit edilmedi.\n`;
    }

    navigator.clipboard.writeText(text).then(() => {
      const originalText = elements.analysisCopyBtn.innerHTML;
      elements.analysisCopyBtn.innerHTML = `✓ Rapor Kopyalandı!`;
      setTimeout(() => {
        elements.analysisCopyBtn.innerHTML = originalText;
      }, 2500);
    }).catch(err => {
      alert("Rapor panoya kopyalanamadı.");
    });
  }

  // --- SERBEST SOHBET (FREE CHAT) ---
  function renderFreeChatPersonas() {
    elements.freeChatPersonasContainer.innerHTML = '';
    FREE_CHAT_PERSONAS.forEach((persona, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `persona-btn ${idx === 0 ? 'persona-active' : ''}`;
      btn.innerHTML = `
        <span class="persona-avatar">${persona.avatar}</span>
        <div class="persona-info">
          <strong>${persona.name}</strong>
          <small>${persona.description.substring(0, 48)}...</small>
        </div>
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('persona-active'));
        btn.classList.add('persona-active');
        state.selectedPersona = persona;
        startFreeChatWithPersona(persona);
      });
      elements.freeChatPersonasContainer.appendChild(btn);
    });

    startFreeChatWithPersona(FREE_CHAT_PERSONAS[0]);
  }

  function startFreeChatWithPersona(persona) {
    state.freeChatMessages = [];
    elements.freeChatMessagesList.innerHTML = '';

    const welcomeMsg = {
      sender: 'ai',
      text: persona.welcomeMessage,
      translation: persona.welcomeMessageTr,
      character: persona,
      timestamp: Date.now()
    };
    state.freeChatMessages.push(welcomeMsg);
    addMessageToChat(welcomeMsg, elements.freeChatMessagesList);
  }

  function renderFreeChatTopics() {
    elements.freeChatTopicsContainer.innerHTML = '';
    FREE_CHAT_TOPIC_STARTERS.forEach(topic => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'topic-chip';
      chip.textContent = topic.title;
      chip.addEventListener('click', () => {
        elements.freeChatInput.value = topic.prompt;
        elements.freeChatInput.focus();
      });
      elements.freeChatTopicsContainer.appendChild(chip);
    });
  }

  function clearFreeChat() {
    startFreeChatWithPersona(state.selectedPersona);
  }

  // --- AYARLAR VE API MODALI ---
  function populateSettingsInputs() {
    const config = window.aiService.config;
    elements.settingProviderSelect.value = config.provider || 'offline';
    elements.geminiKeyInput.value = config.geminiKey || '';
    elements.geminiModelSelect.value = config.geminiModel || 'gemini-1.5-flash';
    elements.openaiKeyInput.value = config.openaiKey || '';
    elements.openaiModelSelect.value = config.openaiModel || 'gpt-4o-mini';

    toggleSettingsProviderFields(config.provider || 'offline');
  }

  function toggleSettingsProviderFields(provider) {
    if (provider === 'gemini') {
      elements.geminiSettingsGroup.classList.remove('hidden');
      elements.openaiSettingsGroup.classList.add('hidden');
    } else if (provider === 'openai') {
      elements.geminiSettingsGroup.classList.add('hidden');
      elements.openaiSettingsGroup.classList.remove('hidden');
    } else {
      elements.geminiSettingsGroup.classList.add('hidden');
      elements.openaiSettingsGroup.classList.add('hidden');
    }
  }

  function saveSettings() {
    const provider = elements.settingProviderSelect.value;
    const newConfig = {
      provider: provider,
      geminiKey: elements.geminiKeyInput.value.trim(),
      geminiModel: elements.geminiModelSelect.value,
      openaiKey: elements.openaiKeyInput.value.trim(),
      openaiModel: elements.openaiModelSelect.value
    };

    window.aiService.saveConfig(newConfig);
    updateAIStatusBadge();
    elements.settingsModal.classList.add('hidden');
  }

  function updateAIStatusBadge() {
    const isLive = window.aiService.isLiveApiActive();
    const providerName = window.aiService.getActiveProviderName();

    elements.aiStatusIndicator.innerHTML = `
      <span class="status-dot ${isLive ? 'status-live' : 'status-offline'}"></span>
      <span class="status-text">${providerName}</span>
    `;
  }

  async function testApiConnection() {
    const provider = elements.settingProviderSelect.value;
    const key = provider === 'gemini' ? elements.geminiKeyInput.value.trim() : elements.openaiKeyInput.value.trim();
    const model = provider === 'gemini' ? elements.geminiModelSelect.value : elements.openaiModelSelect.value;

    elements.apiTestResult.className = 'api-test-result';
    if (provider === 'offline') {
      elements.apiTestResult.textContent = "Yerleşik akıllı motor aktif; API anahtarı gerektirmez ve doğrudan çalışır!";
      elements.apiTestResult.classList.add('test-success');
      return;
    }

    if (!key) {
      elements.apiTestResult.textContent = "Lütfen önce geçerli bir API anahtarı girin.";
      elements.apiTestResult.classList.add('test-error');
      return;
    }

    elements.apiTestResult.textContent = "Bağlantı test ediliyor...";
    try {
      await window.aiService.testConnection(provider, key, model);
      elements.apiTestResult.textContent = "✅ Bağlantı başarılı! Yapay zeka ile canlı pratik yapmaya hazırsınız.";
      elements.apiTestResult.classList.add('test-success');
    } catch (err) {
      elements.apiTestResult.textContent = `❌ Test başarısız: ${err.message}`;
      elements.apiTestResult.classList.add('test-error');
    }
  }

  // --- GÖRÜNÜM GEÇİŞLERİ (VIEW SWITCHER) ---
  function showView(viewName) {
    elements.levelSelectView.classList.add('hidden');
    elements.scenariosView.classList.add('hidden');
    elements.chatView.classList.add('hidden');
    elements.freeChatView.classList.add('hidden');

    if (viewName === 'level-select') {
      elements.levelSelectView.classList.remove('hidden');
    } else if (viewName === 'scenarios') {
      elements.scenariosView.classList.remove('hidden');
      state.currentTab = 'scenarios';
      updateTabButtons();
    } else if (viewName === 'chat') {
      elements.chatView.classList.remove('hidden');
      state.currentTab = 'scenarios';
      updateTabButtons();
    } else if (viewName === 'free-chat') {
      elements.freeChatView.classList.remove('hidden');
      state.currentTab = 'free-chat';
      updateTabButtons();
    }
  }

  function updateTabButtons() {
    if (state.currentTab === 'scenarios') {
      elements.tabScenariosBtn.classList.add('nav-tab-active');
      elements.tabFreeChatBtn.classList.remove('nav-tab-active');
    } else {
      elements.tabScenariosBtn.classList.remove('nav-tab-active');
      elements.tabFreeChatBtn.classList.add('nav-tab-active');
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Navigasyon Seviye Seçici
    elements.navLevelSelector.addEventListener('change', (e) => {
      setLevel(e.target.value, true);
    });

    elements.changeLevelFromScenarioBtn.addEventListener('click', () => {
      renderLevelSelectionCards();
      showView('level-select');
    });

    // Sekme Değişimi
    elements.tabScenariosBtn.addEventListener('click', () => {
      if (state.activeScenario && !elements.chatView.classList.contains('hidden')) {
        showView('chat');
      } else {
        renderScenarioCards();
        showView('scenarios');
      }
    });

    elements.tabFreeChatBtn.addEventListener('click', () => {
      showView('free-chat');
    });

    // Senaryo Sohbeti Kontrolleri
    elements.backToScenariosBtn.addEventListener('click', () => {
      renderScenarioCards();
      showView('scenarios');
    });

    elements.chatSendBtn.addEventListener('click', () => handleSendMessage('scenario'));
    elements.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage('scenario');
      }
    });

    elements.chatMicBtn.addEventListener('click', toggleVoiceRecognition);
    elements.finishAndAnalyzeBtn.addEventListener('click', () => triggerAnalysis('scenario'));

    // Serbest Sohbet Kontrolleri
    elements.freeChatSendBtn.addEventListener('click', () => handleSendMessage('free-chat'));
    elements.freeChatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage('free-chat');
      }
    });

    elements.freeChatMicBtn.addEventListener('click', toggleVoiceRecognition);
    elements.freeChatAnalyzeBtn.addEventListener('click', () => triggerAnalysis('free-chat'));
    elements.clearFreeChatBtn.addEventListener('click', clearFreeChat);

    // Analiz Modalı Kapatma
    elements.closeAnalysisBtn.addEventListener('click', () => {
      elements.analysisModal.classList.add('hidden');
    });

    // Ayarlar Modalı
    elements.openSettingsBtn.addEventListener('click', () => {
      populateSettingsInputs();
      elements.apiTestResult.textContent = '';
      elements.apiTestResult.className = 'api-test-result';
      elements.settingsModal.classList.remove('hidden');
    });

    elements.closeSettingsBtn.addEventListener('click', () => {
      elements.settingsModal.classList.add('hidden');
    });

    elements.settingProviderSelect.addEventListener('change', (e) => {
      toggleSettingsProviderFields(e.target.value);
    });

    elements.saveSettingsBtn.addEventListener('click', saveSettings);
    elements.testApiBtn.addEventListener('click', testApiConnection);

    // Modal Dışı Tıklama ile Kapatma
    window.addEventListener('click', (e) => {
      if (e.target === elements.analysisModal) {
        elements.analysisModal.classList.add('hidden');
      }
      if (e.target === elements.settingsModal) {
        elements.settingsModal.classList.add('hidden');
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Uygulamayı başlat
  init();
});
