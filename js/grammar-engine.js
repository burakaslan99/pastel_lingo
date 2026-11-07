/**
 * grammar-engine.js
 * İngilizce Hazırlık Öğrencileri İçin Akıllı Çevrimdışı Gramer ve Hata Analiz Motoru
 * Türk hazırlık öğrencilerinin en sık yaptığı 30+ kritik hatayı Türkçe pedagojik açıklamalarla tespit eder.
 */

const TURKISH_LEARNER_RULES = [
  {
    id: 'agree_verb',
    category: 'Gramer & Fiil Kullanımı',
    level: 'A1 - A2',
    severity: 'critical',
    regex: /\b(i|we|they|you)\s+am\s+(agree|disagree)\b/i,
    title: "'I am agree' Kalıbı Yanlışlığı",
    explain: "İngilizcede 'agree' (katılmak) bir fiildir, sıfat değildir. Dolayısıyla 'am / is / are' yardımcı fiili ile BİRLİKTE KULLANILMAZ. Doğrudan özne ve fiil olarak kurulmalıdır.",
    fix: (m) => `${m[1]} ${m[2]}`,
    exampleCorrect: "I agree with you (Sana katılıyorum).",
    alternative: "I completely agree with you."
  },
  {
    id: 'age_have',
    category: 'Gramer & Kalıp',
    level: 'A1',
    severity: 'critical',
    regex: /\b(i|he|she|they|we|you)\s+(have|has)\s+(\d{1,2})\s*(years?\s*old)?\b/i,
    title: "Yaş Belirtirken 'Have' Fiili Kullanımı",
    explain: "Türkçede '20 yaşındayım' veya '20 yaşa sahibim' mantığı olsa da, İngilizcede yaş söylerken 'have/has' (sahip olmak) DEĞİL, daima 'to be' (am / is / are) fiili kullanılır.",
    fix: (m) => {
      const subj = m[1].toLowerCase();
      const be = (subj === 'i') ? 'am' : (subj === 'he' || subj === 'she') ? 'is' : 'are';
      return `${m[1]} ${be} ${m[3]} years old`;
    },
    exampleCorrect: "I am 20 years old veya I'm 20.",
    alternative: "I'm in my early twenties."
  },
  {
    id: 'listen_music_prep',
    category: 'Edat (Preposition) Hatası',
    level: 'A1 - A2',
    regex: /\b(listen|listened|listening)\s+(the\s+)?(music|radio|song|podcast|teacher)\b/i,
    title: "'Listen' Fiilinden Sonra 'To' Edatı Eksikliği",
    explain: "İngilizcede 'listen' fiili bir şeyi dinlerken MUTLAKA 'to' edatıyla birlikte kullanılır ('listen to...'). Nesne hemen arkasından edatsız bağlanamaz.",
    fix: (m) => `${m[1]} to ${m[2] ? m[2] : ''}${m[3]}`,
    exampleCorrect: "I like listening to music in my room.",
    alternative: "I'm fond of listening to music."
  },
  {
    id: 'go_to_home',
    category: 'Edat & Yer Bildirimi',
    level: 'A1',
    regex: /\b(go|goes|went|going|come|came|coming)\s+to\s+home\b/i,
    title: "'Home' Öncesinde 'To' Edatı Kullanımı",
    explain: "İngilizcede 'home' kelimesi yön bildiren bir zarf (adverb) işlevi gördüğü için önüne yönelme edatı olan 'to' ALMAZ. 'Go home', 'come home' şeklinde yalın kullanılır.",
    fix: (m) => `${m[1]} home`,
    exampleCorrect: "I am going home after my prep class.",
    alternative: "I'm heading home now."
  },
  {
    id: 'did_past_verb',
    category: 'Zaman Uyumu (Past Simple)',
    level: 'A1+ - A2',
    severity: 'critical',
    regex: /\b(did|didn't|did\s+not)\s+(you|i|he|she|we|they)?\s*(went|saw|bought|came|ate|took|had|spoke|wrote|told)\b/i,
    title: "'Did / Didn't' Sonrasında 2. Hal (V2) Kullanımı",
    explain: "Geçmiş zaman sorularında veya olumsuz cümlelerinde 'did' veya 'didn't' zaten cümlenin geçmiş zamanda olduğunu belirtir. Bu yüzden ana fiil kesinlikle 1. haline (V1 - yalın hal) dönmelidir.",
    fix: (m) => {
      const v1Map = { went: 'go', saw: 'see', bought: 'buy', came: 'come', ate: 'eat', took: 'take', had: 'have', spoke: 'speak', wrote: 'write', told: 'tell' };
      const base = v1Map[m[3].toLowerCase()] || m[3];
      return `${m[1]} ${m[2] ? m[2] + ' ' : ''}${base}`;
    },
    exampleCorrect: "Did you go? / I didn't see him.",
    alternative: "Did you manage to go there?"
  },
  {
    id: 'third_person_singular_s',
    category: 'Özne - Fiil Uyumu (Subject-Verb Agreement)',
    level: 'A1 - A2',
    regex: /\b(he|she|it)\s+(like|want|go|need|live|work|play|know|think)\b/i,
    title: "He / She / It Geniş Zaman '-s' Takısı Eksikliği",
    explain: "Present Simple (Geniş Zaman) yapısında 'He, She, It' özneleri kullanıldığında, olumlu cümlelerde fiilin sonuna '-s' veya '-es' takısı getirilmesi zorunludur.",
    fix: (m) => {
      const verb = m[2].toLowerCase();
      const sVerb = (verb === 'go') ? 'goes' : verb + 's';
      return `${m[1]} ${sVerb}`;
    },
    exampleCorrect: "She likes coffee / He works hard.",
    alternative: "She is really keen on coffee."
  },
  {
    id: 'she_dont',
    category: 'Özne - Fiil Uyumu',
    level: 'A1 - A2',
    regex: /\b(he|she|it)\s+don't\b/i,
    title: "'He/She/It' İle 'Don't' Yerine 'Doesn't' Kullanımı",
    explain: "3. tekil şahıslar (He, She, It) geniş zamanda olumsuz yapılırken 'don't' değil 'doesn't' yardımcı fiili kullanılır.",
    fix: (m) => `${m[1]} doesn't`,
    exampleCorrect: "She doesn't know the answer.",
    alternative: "She is not aware of the answer."
  },
  {
    id: 'uncountable_plural_s',
    category: 'Sayılamayan İsimler (Uncountables)',
    level: 'A2 - B1',
    regex: /\b(informations|advices|furnitures|homeworks|equipments|luggages|baggages)\b/i,
    title: "Sayılamayan İsimlere Çoğul '-s' Eklenmesi",
    explain: "İngilizcede 'information, advice, furniture, homework, luggage' gibi kelimeler sayılamaz (uncountable) kabul edilir ve çoğul eki (-s) ALMAZLAR. Çoğulluk için 'some advice', 'pieces of information' gibi yapılar kullanılır.",
    fix: (m) => m[1].replace(/s$/i, ''),
    exampleCorrect: "I need some information / Can you give me some advice?",
    alternative: "A useful piece of advice would be..."
  },
  {
    id: 'depend_of',
    category: 'Edat (Preposition) Hatası',
    level: 'A2',
    regex: /\b(depend|depends|depending)\s+of\b/i,
    title: "'Depend' Fiili 'Of' Değil 'On' Alır",
    explain: "Türkçedeki 'buna bağlı' ifadesi zihinde 'of' çağrışımı yapsa da, İngilizcede 'depend' fiili daima 'on' (veya upon) edatı ile kullanılır.",
    fix: (m) => `${m[1]} on`,
    exampleCorrect: "It depends on the weather tomorrow.",
    alternative: "That really hinges on the schedule."
  },
  {
    id: 'explain_me',
    category: 'Fiil Kalıbı (Verb Pattern)',
    level: 'A2',
    regex: /\b(explain|explains|explained)\s+(me|him|her|us|them)\b/i,
    title: "'Explain me' Yerine 'Explain to me' Kullanımı",
    explain: "'Explain' fiili 'tell' fiili gibi doğrudan kişi zamiri almaz. Açıklanan konu ve kişi arasına 'to' edatı gelir: 'Explain something TO someone' ya da 'Explain to me'.",
    fix: (m) => `${m[1]} to ${m[2]}`,
    exampleCorrect: "Can you explain this rule to me?",
    alternative: "Could you walk me through this?"
  },
  {
    id: 'look_forward_to_inf',
    category: 'Gerund / Infinitive',
    level: 'B1',
    regex: /\b(look\s+forward\s+to|looking\s+forward\s+to)\s+(see|meet|hear|receive|visit)\b/i,
    title: "'Look forward to' Kalıbından Sonra Fiile '-ing' Gelmeli",
    explain: "'Look forward to' ifadesindeki 'to' bir mastar eki (infinitive) değil, bir edattır (preposition). İngilizcede edatlardan sonra fiil '-ing' haliyle (gerund) gelir.",
    fix: (m) => `${m[1]} ${m[2]}ing`,
    exampleCorrect: "I look forward to meeting you.",
    alternative: "I'm eagerly anticipating our meeting."
  },
  {
    id: 'make_photo',
    category: 'Kollokasyon (Doğru Kelime Eşleşmesi)',
    level: 'A1 - A2',
    regex: /\b(make|makes|made|making)\s+(a\s+)?(photo|photos|picture|pictures)\b/i,
    title: "Fotoğraf Çekmek İçin 'Make' Değil 'Take' Kullanılır",
    explain: "İngilizcede fotoğraf çekmek eylemi 'take a photo' veya 'take a picture' olarak ifade edilir; 'make' (üretmek/yapmak) kullanılmaz.",
    fix: (m) => `${m[1].replace(/make/i, 'take').replace(/made/i, 'took')} ${m[2] || ''}${m[3]}`,
    exampleCorrect: "Can you take a photo of us, please?",
    alternative: "Could you snap a quick picture for us?"
  },
  {
    id: 'modal_with_to',
    category: 'Modal Fiil Yapısı',
    level: 'A1+ - A2',
    regex: /\b(can|could|must|should|will|would|might)\s+to\s+([a-z]+)\b/i,
    title: "Modal Fiillerden Sonra 'To' Kullanılmaz",
    explain: "'Can, could, must, should, will' gibi modal yardımcı fiillerden sonra fiil doğrudan YALIN (bare infinitive) olarak gelir; araya 'to' mastar eki girmez.",
    fix: (m) => `${m[1]} ${m[2]}`,
    exampleCorrect: "I can speak English / You must study.",
    alternative: "I am able to speak English fluently."
  },
  {
    id: 'double_comparative',
    category: 'Sıfat Karşılaştırmaları (Comparatives)',
    level: 'A2',
    regex: /\bmore\s+(taller|faster|easier|cheaper|smaller|bigger|older|better|worse)\b/i,
    title: "Çift Karşılaştırma (Double Comparative) Hatası",
    explain: "Tek heceli sıfatlar zaten '-er' eki alarak (taller, faster) karşılaştırma haline geçer. Bu kelimelerin başına ayrıca 'more' getirilmez.",
    fix: (m) => m[1],
    exampleCorrect: "He is taller than me (more taller denmez).",
    alternative: "He is significantly taller than me."
  },
  {
    id: 'i_born',
    category: 'Kalıp & Geçmiş Zaman',
    level: 'A1 - A2',
    regex: /\b(i|he|she)\s+(am|is)?\s*born\s+in\b/i,
    title: "Doğum Yılı / Şehri Söylerken 'Was born' Kullanımı",
    explain: "Doğum geçmişte gerçekleşmiş tamamlanmış bir olaydır ve pasif bir yapıdır. 'I am born' değil, daima 'I was born in...' şeklinde söylenir.",
    fix: (m) => `${m[1]} was born in`,
    exampleCorrect: "I was born in Istanbul in 2004.",
    alternative: "I was raised in Istanbul."
  },
  {
    id: 'discuss_about',
    category: 'Edat (Preposition) Hatası',
    level: 'A2+ - B1',
    regex: /\b(discuss|discussed|discussing)\s+about\b/i,
    title: "'Discuss' Fiilinden Sonra 'About' Kullanılmaz",
    explain: "Türkçede 'bir konu hakkında tartışmak' denildiği için sıkça 'discuss about' yapılır. Fakat İngilizcede 'discuss' doğrudan konuyu nesne alır: 'discuss the topic'.",
    fix: (m) => m[1],
    exampleCorrect: "We need to discuss this problem together.",
    alternative: "We should talk about this matter."
  },
  {
    id: 'marry_with',
    category: 'Edat (Preposition) Hatası',
    level: 'A2',
    regex: /\b(married|marry)\s+with\b/i,
    title: "'Marry with' Değil 'Married to' ya da 'Marry someone'",
    explain: "İngilizcede biriyle evlenmek 'marry someone' (fiil) ya da evli olmak 'married to someone' (sıfat) şeklindedir. 'With' edatı kullanılmaz.",
    fix: () => "married to / marry",
    exampleCorrect: "He is married to Sarah.",
    alternative: "He got married to Sarah."
  },
  {
    id: 'wait_someone_for',
    category: 'Edat (Preposition) Hatası',
    level: 'A1+ - A2',
    regex: /\b(wait|waited|waiting)\s+(you|him|her|them|the bus)\b/i,
    title: "'Wait' Fiilinde 'For' Edatı Eksikliği",
    explain: "Birini veya bir şeyi beklerken 'wait' fiili arkasına 'for' edatı almalıdır: 'wait FOR someone / wait FOR the bus'.",
    fix: (m) => `${m[1]} for ${m[2]}`,
    exampleCorrect: "I am waiting for you at the library entrance.",
    alternative: "I'm expecting you at the library."
  },
  {
    id: 'interested_for',
    category: 'Edat (Preposition) Hatası',
    level: 'A2',
    regex: /\b(interested)\s+(for|with|about)\b/i,
    title: "'Interested' Sıfatı 'In' Edatı Alır",
    explain: "Bir konuya veya hobiye ilgi duyarken 'interested for/with' denmez; doğru edat 'interested in' şeklindedir.",
    fix: () => "interested in",
    exampleCorrect: "I am very interested in learning new languages.",
    alternative: "I have a keen interest in foreign languages."
  },
  {
    id: 'think_yes_no',
    category: 'Kalıp Yanlışlığı',
    level: 'A1 - A2',
    regex: /\bi\s+think\s+(yes|no)\b/i,
    title: "'I think yes/no' Yerine 'I think so / I don't think so'",
    explain: "İngilizcede bir fikre katılıp katılmadığını onaylarken 'I think yes' denmez. Bunun yerine 'I think so' (Sanırım öyle) ya da 'I don't think so' (Sanmıyorum) kullanılır.",
    fix: (m) => (m[1].toLowerCase() === 'yes' ? 'I think so' : "I don't think so"),
    exampleCorrect: "Is the exam tomorrow? - I think so / I don't think so.",
    alternative: "I believe so."
  },
  {
    id: 'since_duration',
    category: 'Zaman Edatları (For vs Since)',
    level: 'A2 - B1',
    regex: /\bsince\s+(\d+|two|three|four|five|several|a\s+few)\s+(years|months|days|weeks|hours)\b/i,
    title: "Süreç Bildirirken 'Since' Değil 'For' Kullanılmalıdır",
    explain: "'Since' bir olayın başladığı sabit noktayı belirtir (since 2020, since Monday). Aradan geçen zaman diliminin uzunluğunu (süreç) belirtirken 'for' kullanılır (for 3 years).",
    fix: (m) => `for ${m[1]} ${m[2]}`,
    exampleCorrect: "I have lived here for 3 years (since 3 years denmez).",
    alternative: "It has been three years since I moved here."
  },
  {
    id: 'small_i',
    category: 'Yazım & İmla (Capitalization)',
    level: 'A1',
    regex: /(^|[^\w])i([^\w]|$)/,
    title: "'I' (Ben) Zamirinin Küçük Harfle Yazılması",
    explain: "İngilizcede birinci tekil şahıs zamiri olan 'I' (Ben), cümlenin neresinde olursa olsun DAİMA BÜYÜK HARFLE yazılır; asla küçük 'i' olarak bırakılmaz.",
    fix: () => "I",
    exampleCorrect: "Yesterday I went to class.",
    alternative: "Always capitalize 'I'."
  },
  {
    id: 'missing_article_student',
    category: 'Tanımlık (Article a/an)',
    level: 'A1',
    regex: /\b(i\s+am|he\s+is|she\s+is|i'm|he's|she's)\s+(student|teacher|doctor|engineer|waiter)\b/i,
    title: "Meslek/Unvan Önünde 'A / An' Eksikliği",
    explain: "İngilizcede sayılabilen tekil meslek ve rollerin önüne mutlaka 'a' veya 'an' belgisiz tanımlığı (indefinite article) getirilmelidir.",
    fix: (m) => {
      const art = /^[aeiou]/i.test(m[2]) ? 'an' : 'a';
      return `${m[1]} ${art} ${m[2]}`;
    },
    exampleCorrect: "I am a student at the prep school.",
    alternative: "I currently study as a prep student."
  },
  {
    id: 'good_in_subject',
    category: 'Edat (Preposition) Hatası',
    level: 'A1+ - A2',
    regex: /\bgood\s+in\s+(english|math|speaking|football|music)\b/i,
    title: "Bir Alanda Başarılı Olurken 'Good in' Değil 'Good at'",
    explain: "Bir ders, spor veya beceride iyi olduğunuzu söylerken 'good in' değil 'good at' kalıbı kullanılır.",
    fix: (m) => `good at ${m[1]}`,
    exampleCorrect: "She is very good at English grammar.",
    alternative: "She excels at speaking English."
  }
];

class GrammarAnalysisEngine {
  constructor() {
    this.rules = TURKISH_LEARNER_RULES;
  }

  /**
   * Kullanıcının yazdığı mesajlar dizisini detaylı analiz eder
   * @param {Array<string>} userMessages - Kullanıcının diyalog boyunca gönderdiği İngilizce cümleler
   * @param {string} scenarioContext - Hangi senaryoda konuşulduğu
   * @param {string} userLevel - Kullanıcının seçtiği A1, A2 vb. seviye
   * @returns {Object} Kapsamlı Türkçe analiz raporu
   */
  analyzeConversation(userMessages, scenarioContext = '', userLevel = 'A1') {
    if (!userMessages || userMessages.length === 0) {
      return {
        totalMessages: 0,
        score: 100,
        summaryText: "Analiz edilecek mesaj bulunamadı.",
        errors: [],
        positiveFeedback: ["Henüz bir mesaj göndermedin."],
        tips: ["Sohbete başlayıp pratik yaparak hatalarını görebilirsin."]
      };
    }

    const detectedErrors = [];
    let cleanMessageCount = 0;
    let totalWordCount = 0;

    userMessages.forEach((msg, msgIndex) => {
      const cleanMsg = msg.trim();
      if (!cleanMsg) return;

      const words = cleanMsg.split(/\s+/);
      totalWordCount += words.length;

      let msgHasError = false;

      // Kural bazlı tarama
      this.rules.forEach(rule => {
        const match = cleanMsg.match(rule.regex);
        if (match) {
          msgHasError = true;
          // Zaten aynı hatayı bu mesaj için eklemediysek
          const alreadyFound = detectedErrors.some(e => e.msgIndex === msgIndex && e.ruleId === rule.id);
          if (!alreadyFound) {
            let suggestedSentence = cleanMsg;
            try {
              if (typeof rule.fix === 'function') {
                suggestedSentence = cleanMsg.replace(rule.regex, rule.fix(match));
              }
            } catch (err) {
              console.warn("Fix replacement error", err);
            }

            detectedErrors.push({
              msgIndex,
              ruleId: rule.id,
              originalSentence: cleanMsg,
              faultyPart: match[0],
              category: rule.category,
              title: rule.title,
              severity: rule.severity || 'medium',
              explanation: rule.explain,
              suggestedCorrection: suggestedSentence,
              exampleCorrect: rule.exampleCorrect,
              alternative: rule.alternative || ''
            });
          }
        }
      });

      // Genel noktalama ve başlangıç büyük harf kontrolü
      if (!msgHasError) {
        if (/^[a-z]/.test(cleanMsg) && cleanMsg.length > 3) {
          detectedErrors.push({
            msgIndex,
            ruleId: 'capital_start',
            originalSentence: cleanMsg,
            faultyPart: cleanMsg.charAt(0),
            category: 'Yazım Kuralları (Capitalization)',
            title: "Cümleye Büyük Harfle Başlama",
            severity: 'low',
            explanation: "İngilizcede tüm cümleler büyük harfle başlar. Yazılı sınavlarda ve ödevlerde bu kurala dikkat etmek puan kazandırır.",
            suggestedCorrection: cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1),
            exampleCorrect: cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1),
            alternative: ""
          });
        } else {
          cleanMessageCount++;
        }
      }
    });

    // Puanlama Hesaplama (100 üzerinden)
    // Hataların ağırlığına göre düşüş
    let penalty = 0;
    detectedErrors.forEach(err => {
      if (err.severity === 'critical') penalty += 14;
      else if (err.severity === 'medium') penalty += 8;
      else penalty += 4;
    });

    // Puanın 40'ın altına düşmemesini sağlayarak öğrenciyi motive tut
    const baseScore = Math.max(45, 100 - penalty);
    const finalScore = Math.min(100, Math.round(baseScore));

    // Olumlu geri bildirim ve pedagojik tavsiyeler
    const positiveFeedback = this._generatePositiveNotes(userMessages, totalWordCount, detectedErrors.length, userLevel);
    const studyTips = this._generateStudyTips(detectedErrors, userLevel);

    return {
      totalMessages: userMessages.length,
      totalWords: totalWordCount,
      score: finalScore,
      errorsCount: detectedErrors.length,
      errors: detectedErrors,
      positiveFeedback,
      studyTips,
      levelAppraisal: this._getLevelAppraisal(finalScore, userLevel)
    };
  }

  _generatePositiveNotes(messages, wordCount, errorCount, level) {
    const notes = [];
    if (messages.length >= 3) {
      notes.push("Diyaloğu kesintisiz sürdürdün ve karşındaki karaktere aktif yanıt verdin.");
    }
    if (wordCount >= 25) {
      notes.push(`Toplamda ${wordCount} kelime kullanarak düşüncelerini ifade etmeye çalıştın.`);
    }
    if (errorCount === 0 && messages.length > 0) {
      notes.push("Tebrikler! Belirgin hiçbir gramer veya kalıp hatası yapmadan konuşmayı tamamladın.");
    } else if (errorCount <= 2) {
      notes.push("Hata sayın oldukça az; genel cümle yapın ve akıcılığın harika bir seviyede.");
    } else {
      notes.push("Hata yapmaktan çekinmeden kendini ifade etmeye odaklandın, bu dil öğrenimindeki en değerli adımdır.");
    }
    return notes;
  }

  _generateStudyTips(errors, level) {
    const tips = [];
    const categories = new Set(errors.map(e => e.category));

    if (categories.has('Edat (Preposition) Hatası')) {
      tips.push("📌 Edatlar (Prepositions): İngilizcede fiillerin aldıkları edatları (listen to, depend on, interested in) tek tek değil, kalıp olarak not alıp tekrar etmek işini çok kolaylaştırır.");
    }
    if (categories.has('Zaman Uyumu (Past Simple)')) {
      tips.push("📌 Past Simple: 'Did' ve 'didn't' yardımcı fiillerinin zaten geçmişi belirttiğini ve arkasından gelen fiilin 1. haliyle kalacağını bir kural kağıdına yazıp masana asabilirsin.");
    }
    if (categories.has('Özne - Fiil Uyumu (Subject-Verb Agreement)')) {
      tips.push("📌 3. Tekil Şahıs: Geniş zamanda 'He/She/It' öznelerini gördüğün an fiilin sonuna '-s' takısını otomatik ekleme refleksini geliştirmek için her gün 5 basit cümle yazabilirsin.");
    }
    tips.push("💡 Günlük Pratik Tavsiyesi: Bu senaryoyu sesli olarak bir kez daha dene. Hatalı olan cümlelerin doğru hallerini yüksek sesle 3 kez tekrar etmek telaffuz ve kalıcılık sağlar.");

    return tips;
  }

  _getLevelAppraisal(score, level) {
    if (score >= 90) {
      return {
        badge: 'Mükemmel Performans ⭐',
        message: `${level} seviyesi için harika bir akıcılık ve doğruluk sergiledin. Bir sonraki seviye senaryolarına geçmeye hazırsın!`
      };
    } else if (score >= 75) {
      return {
        badge: 'Başarılı ve Akıcı 👍',
        message: `İletişim amacına tam olarak ulaştın. Ufak tefek kalıp ve edat düzeltmeleriyle konuşman çok daha doğal hale gelecektir.`
      };
    } else {
      return {
        badge: 'Gelişime Açık / İyi Çaba 💪',
        message: `Kendini ifade etme cesaretin takdire şayan. Aşağıdaki Türkçe açıklamaları inceleyip aynı senaryoyu bir kez daha denemeni öneririz!`
      };
    }
  }
}

// Global instance
window.grammarEngine = new GrammarAnalysisEngine();
