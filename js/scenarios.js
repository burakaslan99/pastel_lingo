/**
 * scenarios.js
 * İngilizce Hazırlık Öğrencileri İçin Seviye ve Senaryo Veritabanı
 */

const LEVELS_DATA = {
  'A1': {
    code: 'A1',
    name: 'A1 - Başlangıç Seviyesi (Beginner)',
    badge: 'Temel Seviye',
    description: 'Kendini tanıtma, basit selamlaşmalar, temel ihtiyaçları ve günlük somut durumları kısa cümlelerle ifade etme.',
    colorClass: 'pastel-blue',
    targetTopics: ['Selamlaşma', 'Sipariş Verme', 'Basit Tanışma', 'Kısa Yön Sorma']
  },
  'A1+': {
    code: 'A1+',
    name: 'A1+ - Gelişen Başlangıç (Elementary)',
    badge: 'Başlangıç+',
    description: 'Alışveriş, temel saat ve fiyat sorma, basit geçmiş ve gelecek planları ile sınırlı günlük rutinleri anlatma.',
    colorClass: 'pastel-mint',
    targetTopics: ['Alışveriş Yapma', 'Kütüphanede Arama', 'Restoran Siparişi', 'Günlük Rutinler']
  },
  'A2': {
    code: 'A2',
    name: 'A2 - Temel İletişim (Pre-Intermediate)',
    badge: 'Temel İletişim',
    description: 'Aile, çevre, basit iş/okul durumları, hoca ile diyalog, otel ve seyahat gibi yaygın alanlarda iletişim kurma.',
    colorClass: 'pastel-purple',
    targetTopics: ['Hoca ile Konuşma', 'Havalimanı & Otel', 'Eczane & Sağlık', 'Yolculuk']
  },
  'A2+': {
    code: 'A2+',
    name: 'A2+ - Güçlenen İletişim (High Pre-Intermediate)',
    badge: 'Hazırlık İleri Temel',
    description: 'Beklenmedik durumlarda çözüm arama, ev arkadaşıyla anlaşma, kayıp eşya bildirme ve detaylı rica cümleleri.',
    colorClass: 'pastel-yellow',
    targetTopics: ['Ev Arkadaşı İletişimi', 'Kayıp Eşya', 'Spor & Kurs Kaydı', 'Seyahat Rezervasyonu']
  },
  'B1': {
    code: 'B1',
    name: 'B1 - Orta Seviye (Intermediate)',
    badge: 'Bağımsız İletişim',
    description: 'Kişisel görüş belirtme, akademik/iş konularında danışmanla tartışma, sorun çözme ve duyguları ifade etme.',
    colorClass: 'pastel-coral',
    targetTopics: ['Danışmanla Görüşme', 'Görüş Belirtme', 'Mülakat Simülasyonu', 'Şikayet & İade']
  }
};

const SCENARIOS_DATA = [
  // --- A1 SEVİYESİ ---
  {
    id: 'a1-cafe',
    level: 'A1',
    title: 'Kafede Kahve Siparişi Verme',
    shortDesc: 'Kampüs kafesinde barista ile konuşup kahve ve tatlı siparişi ver.',
    icon: '☕',
    category: 'Günlük Yaşam',
    character: {
      name: 'Sam',
      role: 'Kampüs Baristası',
      avatar: '🧑‍🍳',
      tone: 'Güleryüzlü ve sabırlı bir kahve dükkanı çalışanı'
    },
    context: 'Bir kafedesin. Barista sana ne içmek istediğini soruyor. Boyutunu ve süt tercihini belirtebilirsin.',
    initialMessage: "Hi there! Welcome to Campus Brew. What can I get for you today?",
    initialMessageTr: "Merhaba! Campus Brew'a hoş geldin. Bugün senin için ne hazırlayabilirim?",
    targetGoal: "İstediğin kahve türünü söyle (Örn: 'A latte, please') ve süt/şeker tercihini belirt.",
    suggestedPhrases: [
      { en: "Hello! Can I have a latte, please?", tr: "Merhaba! Bir latte alabilir miyim, lütfen?" },
      { en: "A small black coffee, please.", tr: "Küçük boy sade kahve, lütfen." },
      { en: "Without sugar, please.", tr: "Şekersiz olsun, lütfen." },
      { en: "How much is it?", tr: "Ne kadar tuttu / Fiyatı ne kadar?" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['latte', 'cappuccino', 'coffee', 'tea', 'americano', 'water'],
        response: "Great choice! Would you like that small, medium, or large? And regular milk or oat milk?",
        tr: "Harika seçim! Küçük, orta mı yoksa büyük boy mu istersin? Normal süt mü yulaf sütü mü?"
      },
      {
        trigger: ['small', 'medium', 'large', 'regular', 'oat', 'milk'],
        response: "Got it! Would you like anything to eat with that, like a warm chocolate croissant?",
        tr: "Anladım! Yanında sıcak çikolatalı kruvasan gibi yiyecek bir şey ister misin?"
      },
      {
        trigger: ['yes', 'no', 'croissant', 'cookie', 'muffin', 'nothing', 'please', 'thanks'],
        response: "Perfect. That will be 4.50 dollars. Will you pay with cash or card?",
        tr: "Mükemmel. 4.50 dolar tuttu. Nakit mi kartla mı ödeyeceksiniz?"
      },
      {
        trigger: ['card', 'cash', 'here', 'pay'],
        response: "Here is your receipt and your drink will be ready in two minutes. Have a wonderful day!",
        tr: "İşte fişiniz, içeceğiniz iki dakika içinde hazır olacak. Harika bir gün geçirin!"
      }
    ]
  },
  {
    id: 'a1-meet',
    level: 'A1',
    title: 'Yeni Sınıf Arkadaşıyla Tanışma',
    shortDesc: 'Hazırlık sınıfının ilk günü yanına oturan yeni arkadaşınla tanış.',
    icon: '🤝',
    category: 'Üniversite',
    character: {
      name: 'Alex',
      role: 'Yeni Sınıf Arkadaşın',
      avatar: '🎒',
      tone: 'Enerjik ve heyecanlı hazırlık öğrencisi'
    },
    context: 'Ders başlamak üzere. Yanındaki öğrenci sana dönüp gülümsüyor ve adını soruyor.',
    initialMessage: "Hey! Is this seat taken? By the way, I'm Alex. Nice to meet you!",
    initialMessageTr: "Selam! Bu yer boş mu? Bu arada, ben Alex. Tanıştığımıza memnun oldum!",
    targetGoal: "Adını söyle, yerin boş olduğunu belirt ve nereli olduğunu paylaş.",
    suggestedPhrases: [
      { en: "No, it's free. Please sit down!", tr: "Hayır, boş. Lütfen otur!" },
      { en: "Nice to meet you too! My name is...", tr: "Ben de tanıştığıma sevindim! Benim adım..." },
      { en: "I am a new student here.", tr: "Ben burada yeni öğrenciyim." },
      { en: "Where are you from?", tr: "Nerelisin?" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['name', 'my name', 'i am', 'free', 'sit'],
        response: "Thanks! Are you studying at the English prep school too? What department are you in?",
        tr: "Teşekkürler! Sen de İngilizce hazırlıkta mısın? Hangi bölümdensin?"
      },
      {
        trigger: ['engineering', 'business', 'medicine', 'prep', 'student', 'yes'],
        response: "Oh, cool! I'm in Computer Science. Where are you from originally?",
        tr: "Ooo harika! Ben Bilgisayar Mühendisliği'ndeyim. Aslen nerelisin?"
      },
      {
        trigger: ['from', 'turkey', 'istanbul', 'ankara', 'izmir', 'city'],
        response: "I've heard great things about that city! Are you nervous about the speaking exams?",
        tr: "O şehir hakkında çok güzel şeyler duymuştum! Konuşma sınavları için heyecanlı mısın?"
      },
      {
        trigger: ['nervous', 'yes', 'no', 'easy', 'hard', 'a little', 'practicing'],
        response: "Me too, but we can practice together! The teacher is coming, let's talk after class!",
        tr: "Ben de öyle, ama birlikte pratik yapabiliriz! Hoca geliyor, dersten sonra konuşalım!"
      }
    ]
  },
  {
    id: 'a1-directions',
    level: 'A1',
    title: 'Sokakta Basit Yol Tarifi Sorma',
    shortDesc: 'Kampüste veya şehir merkezinde kütüphaneyi / metro durağını bul.',
    icon: '🗺️',
    category: 'Şehir & Yol',
    character: {
      name: 'Emma',
      role: 'Yoldan Geçen Sakin',
      avatar: '🚶‍♀️',
      tone: 'Yardımsever ve yavaş, anlaşılır konuşan bir yerel'
    },
    context: 'Şehirde ya da kampüste yönünü kaybettin. Yoldan geçen birine en yakın metro istasyonunu sor.',
    initialMessage: "Excuse me! Do you need some help? You look a bit lost.",
    initialMessageTr: "Affedersiniz! Yardıma ihtiyacınız var mı? Biraz kaybolmuş gibi görünüyorsunuz.",
    targetGoal: "Metro istasyonunun nerede olduğunu ve ne kadar sürdüğünü sor.",
    suggestedPhrases: [
      { en: "Excuse me, where is the metro station?", tr: "Affedersiniz, metro istasyonu nerede?" },
      { en: "Is it far from here?", tr: "Buradan uzak mı?" },
      { en: "Can I walk there?", tr: "Oraya yürüyerek gidebilir miyim?" },
      { en: "Thank you so much for your help!", tr: "Yardımınız için çok teşekkür ederim!" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['where', 'metro', 'subway', 'station', 'library'],
        response: "Ah, the station is very close! Just go straight and turn right at the traffic lights.",
        tr: "Ah, istasyon çok yakın! Dümdüz gidin ve trafik ışıklarından sağa dönün."
      },
      {
        trigger: ['far', 'walk', 'minute', 'time', 'how'],
        response: "It's only about a 5-minute walk. You will see a big blue sign that says 'Metro'.",
        tr: "Sadece 5 dakikalık bir yürüyüş mesafesinde. 'Metro' yazan büyük mavi bir tabela göreceksiniz."
      },
      {
        trigger: ['thank', 'thanks', 'understand', 'great', 'ok'],
        response: "You are very welcome! Take care and have a safe journey!",
        tr: "Rica ederim! Kendinize iyi bakın ve iyi yolculuklar!"
      }
    ]
  },

  // --- A1+ SEVİYESİ ---
  {
    id: 'a1plus-library',
    level: 'A1+',
    title: 'Kütüphanede Kitap ve Çalışma Masası Arama',
    shortDesc: 'Üniversite kütüphanesinde hazırlık kitabı ödünç al ve sessiz oda sor.',
    icon: '📚',
    category: 'Üniversite',
    character: {
      name: 'Clara',
      role: 'Kütüphane Görevlisi',
      avatar: '👩‍💼',
      tone: 'Kibar ve düzenli'
    },
    context: 'İngilizce hazırlık gramer kitabını arıyorsun ve öğrenci kartınla ödünç almak istiyorsun.',
    initialMessage: "Good afternoon! Welcome to the University Library. How may I assist you?",
    initialMessageTr: "Tünaydın! Üniversite Kütüphanesi'ne hoş geldiniz. Size nasıl yardımcı olabilirim?",
    targetGoal: "Gramer kitabını sor, ödünç alma süresini öğren ve sessiz çalışma alanının yerini sor.",
    suggestedPhrases: [
      { en: "I'm looking for English grammar books.", tr: "İngilizce gramer kitaplarını arıyorum." },
      { en: "How long can I borrow this book?", tr: "Bu kitabı ne kadar süreyle ödünç alabilirim?" },
      { en: "Where is the quiet study room?", tr: "Sessiz çalışma odası nerede?" },
      { en: "Here is my student ID card.", tr: "İşte öğrenci kimlik kartım." }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['book', 'grammar', 'english', 'find', 'looking'],
        response: "All English learning books are on the 2nd floor in Section B. Do you have your student card with you?",
        tr: "Tüm İngilizce öğrenme kitapları 2. katta B Bölümündedir. Öğrenci kartınız yanınızda mı?"
      },
      {
        trigger: ['yes', 'card', 'here', 'have', 'borrow'],
        response: "Excellent. You can borrow up to three books for two weeks. Do you need a study desk today?",
        tr: "Harika. İki haftalığına üç kitaba kadar ödünç alabilirsiniz. Bugün bir çalışma masasına ihtiyacınız var mı?"
      },
      {
        trigger: ['quiet', 'room', 'desk', 'study', 'yes', 'where'],
        response: "The quiet study area is on the 3rd floor. Please keep your phone on silent. Happy studying!",
        tr: "Sessiz çalışma alanı 3. kattadır. Lütfen telefonunuzu sessizde tutun. İyi çalışmalar!"
      }
    ]
  },
  {
    id: 'a1plus-restaurant',
    level: 'A1+',
    title: 'Restoranda Sipariş ve Hesap İsteme',
    shortDesc: 'Garsonla yemek seçeneklerini konuş, ana yemek seç ve hesabı iste.',
    icon: '🍝',
    category: 'Günlük Yaşam',
    character: {
      name: 'Leo',
      role: 'Garson',
      avatar: '🤵',
      tone: 'Nezaketli ve hızlı'
    },
    context: 'Bir restoranda masaya oturdun. Garson menüyü getirdi ve siparişini almaya hazır.',
    initialMessage: "Good evening! Here is your menu. Are you ready to order or do you need a few more minutes?",
    initialMessageTr: "İyi akşamlar! İşte menünüz. Sipariş vermeye hazır mısınız yoksa birkaç dakikaya mı ihtiyacınız var?",
    targetGoal: "Bir makarna veya ızgara tavuk sipariş et, içecek seç ve sonra hesabı iste.",
    suggestedPhrases: [
      { en: "I'm ready to order, thank you.", tr: "Sipariş vermeye hazırım, teşekkürler." },
      { en: "I would like the grilled chicken with pasta.", tr: "Makarna ile ızgara tavuk rica ediyorum." },
      { en: "Could I have a bottle of water, please?", tr: "Bir şişe su alabilir miyim, lütfen?" },
      { en: "Could we have the bill / check, please?", tr: "Hesabı alabilir miyiz, lütfen?" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['ready', 'like', 'order', 'pasta', 'chicken', 'salad', 'pizza'],
        response: "Great choice! The chicken pasta is our chef's special. Would you like anything to drink with it?",
        tr: "Harika seçim! Tavuklu makarna şefimizin spesiyali. Yanında içecek bir şey ister misiniz?"
      },
      {
        trigger: ['water', 'coke', 'juice', 'soda', 'lemonade', 'drink'],
        response: "Right away! I'll bring your drink first and the food will follow in ten minutes.",
        tr: "Hemen getiriyorum! Önce içeceğinizi getireceğim, yemek 10 dakika sonra hazır olacak."
      },
      {
        trigger: ['bill', 'check', 'pay', 'much', 'finished', 'delicious'],
        response: "Here is your bill. It comes to 18 euros. You can pay by card right at the table.",
        tr: "İşte hesabınız. 18 euro tuttu. Masada doğrudan kartla ödeyebilirsiniz."
      }
    ]
  },

  // --- A2 SEVİYESİ ---
  {
    id: 'a2-teacher',
    level: 'A2',
    title: 'Sınıfta Hoca ile Ödev ve Sınavı Konuşma',
    shortDesc: 'Hocanın ofisine gidip son ödevdeki notunu ve speaking sınavı tavsiyelerini sor.',
    icon: '🎓',
    category: 'Akademik',
    character: {
      name: 'Prof. Davis',
      role: 'Hazırlık İngilizce Hocası',
      avatar: '👨‍🏫',
      tone: 'Teşvik edici, yapıcı ve akademik'
    },
    context: 'Hocanızın ofis saatindesiniz. Yazdığınız kompozisyon (essay) hakkında geri bildirim almak istiyorsunuz.',
    initialMessage: "Come in! Hello. How can I help you today regarding our prep class?",
    initialMessageTr: "İçeri gel! Merhaba. Bugün hazırlık dersimizle ilgili sana nasıl yardımcı olabilirim?",
    targetGoal: "Ödevin hakkında soru sor, speaking sınavı için tavsiye iste ve ofis ziyareti için teşekkür et.",
    suggestedPhrases: [
      { en: "I have a question about my last essay score.", tr: "Son deneme notum hakkında bir sorum vardı." },
      { en: "How can I improve my speaking fluency?", tr: "Konuşma akıcılığımı nasıl geliştirebilirim?" },
      { en: "Could you recommend some grammar websites?", tr: "Bazı gramer web siteleri tavsiye edebilir misiniz?" },
      { en: "Thank you for your valuable feedback, Professor.", tr: "Değerli geri bildiriminiz için teşekkürler, Hocam." }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['essay', 'writing', 'score', 'feedback', 'homework', 'grade'],
        response: "Your ideas were very clear! However, you should pay more attention to past tense verbs and connecting words like 'however' and 'because'.",
        tr: "Fikirlerin çok netti! Ancak geçmiş zaman fiillerine ve 'however', 'because' gibi bağlaçlara biraz daha dikkat etmelisin."
      },
      {
        trigger: ['speaking', 'practice', 'exam', 'fluency', 'improve', 'better'],
        response: "For speaking, do not fear making mistakes! Try speaking for 2 minutes every day about your daily routine or listen to English podcasts.",
        tr: "Konuşma için, hata yapmaktan korkma! Her gün günlük rutinin hakkında 2 dakika İngilizce konuşmayı dene veya İngilizce podcast dinle."
      },
      {
        trigger: ['thank', 'thanks', 'understand', 'will do', 'appreciate'],
        response: "You are making steady progress. Keep up the good work and see you in class tomorrow!",
        tr: "Düzenli olarak ilerliyorsun. Böyle devam et ve yarın derste görüşmek üzere!"
      }
    ]
  },
  {
    id: 'a2-airport',
    level: 'A2',
    title: 'Havalimanında Check-in ve Bagaj İşlemleri',
    shortDesc: 'Uçağa binmeden önce pasaportunu göster, bagajını ver ve cam kenarı koltuk rica et.',
    icon: '✈️',
    category: 'Seyahat',
    character: {
      name: 'Sophie',
      role: 'Check-in Görevlisi',
      avatar: '🧳',
      tone: 'Profesyonel ve resmi'
    },
    context: 'Havalimanı check-in kontuarındasın. Görevli pasaportunu ve uçuş biletini istiyor.',
    initialMessage: "Good morning! Can I see your ticket and passport, please?",
    initialMessageTr: "Günaydın! Biletinizi ve pasaportunuzu görebilir miyim, lütfen?",
    targetGoal: "Pasaportunu sun, cam kenarı koltuk (window seat) iste ve kapı numarasını sor.",
    suggestedPhrases: [
      { en: "Here are my passport and boarding confirmation.", tr: "İşte pasaportum ve biniş onayım." },
      { en: "Could I have a window seat, if possible?", tr: "Mümkünse cam kenarı bir koltuk alabilir miyim?" },
      { en: "Is this bag okay as a carry-on?", tr: "Bu çanta kabin bagajı olarak uygun mu?" },
      { en: "Which boarding gate should I go to?", tr: "Hangi biniş kapısına gitmeliyim?" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['passport', 'ticket', 'here', 'seat', 'window', 'aisle'],
        response: "Thank you. Yes, I have a window seat available in row 14. Do you have any luggage to check in?",
        tr: "Teşekkürler. Evet, 14. sırada uygun bir cam kenarı koltuk var. Uçağa vereceğiniz bagajınız var mı?"
      },
      {
        trigger: ['bag', 'luggage', 'suitcase', 'one', 'two', 'carry', 'cabin'],
        response: "Please put your suitcase on the scale. Perfect, it's 18 kg, well within the limit.",
        tr: "Lütfen bavulunuzu tartının üzerine koyun. Mükemmel, 18 kg, limit dahilinde."
      },
      {
        trigger: ['gate', 'time', 'board', 'where', 'thank'],
        response: "Here is your boarding pass. Boarding starts at 10:30 at Gate B12. Have a safe and pleasant flight!",
        tr: "İşte biniş kartınız. Biniş 10:30'da B12 kapısında başlıyor. İyi ve güvenli uçuşlar!"
      }
    ]
  },

  // --- A2+ SEVİYESİ ---
  {
    id: 'a2plus-flatmate',
    level: 'A2+',
    title: 'Ev Arkadaşıyla Ev İşleri ve Kuralları Konuşma',
    shortDesc: 'Yeni taşındığın uluslararası ev arkadaşınla mutfak temizliği ve müzik saatlerini planla.',
    icon: '🏠',
    category: 'Sosyal Yaşam',
    character: {
      name: 'Liam',
      role: 'Yeni Ev Arkadaşın',
      avatar: '🛋️',
      tone: 'Arkadaş canlısı ve açık sözlü'
    },
    context: 'Yeni bir eve taşındın. Ev arkadaşın Liam mutfak masasında oturuyor ve haftalık işleri konuşmak istiyor.',
    initialMessage: "Hey! Now that we are both settled in, do you have five minutes to chat about a cleaning schedule and apartment rules?",
    initialMessageTr: "Selam! İkimiz de yerleştiğimize göre, temizlik programı ve ev kuralları hakkında konuşmak için 5 dakikan var mı?",
    targetGoal: "Hangi günleri tercih ettiğini söyle, sessizlik saati öner ve anlaşmaya var.",
    suggestedPhrases: [
      { en: "Sure! I think making a weekly schedule is a great idea.", tr: "Tabii! Haftalık bir program yapmak bence harika bir fikir." },
      { en: "I can clean the kitchen on weekends if you take the bathroom.", tr: "Sen banyoyu alırsan ben hafta sonları mutfağı temizleyebilirim." },
      { en: "Could we agree on quiet hours after 11 PM?", tr: "Gece saat 23:00'ten sonra sessizlik saatleri konusunda anlaşabilir miyiz?" },
      { en: "That sounds completely fair to me.", tr: "Bu bana gayet adil geliyor." }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['clean', 'schedule', 'kitchen', 'bathroom', 'weekend', 'take'],
        response: "That sounds awesome. I don't mind doing the bathroom on Fridays. What about cooking and groceries?",
        tr: "Harika görünüyor. Cuma günleri banyoyu temizlemek benim için sorun değil. Peki yemek pişirme ve market alışverişi ne olacak?"
      },
      {
        trigger: ['grocery', 'food', 'quiet', 'music', 'hours', 'night', 'sleep'],
        response: "Totally agree! Quiet hours after 11 PM is perfect because I have an early morning lecture at 9.",
        tr: "Kesinlikle katılıyorum! Saat 23:00'ten sonra sessizlik harika olur çünkü sabah saat 9'da erken bir dersim var."
      },
      {
        trigger: ['great', 'deal', 'fair', 'cool', 'perfect', 'thanks'],
        response: "Awesome! I'll write this down on the fridge whiteboard. Living together is going to be fun!",
        tr: "Süper! Bunu buzdolabındaki yazı tahtasına yazıyorum. Birlikte yaşamak çok eğlenceli olacak!"
      }
    ]
  },

  // --- B1 SEVİYESİ ---
  {
    id: 'b1-advisor',
    level: 'B1',
    title: 'Akademik Danışmanla Ders Değişimi ve Kariyer',
    shortDesc: 'Zorlandığın bir seçmeli dersi değiştirmek için gerekçelerini sunarak danışmanını ikna et.',
    icon: '🏛️',
    category: 'Akademik Danışmanlık',
    character: {
      name: 'Dr. Eleanor',
      role: 'Akademik Bölüm Danışmanı',
      avatar: '👩‍🏫',
      tone: 'Analitik, kibar ama ikna edici argümanlar bekleyen'
    },
    context: 'Hazırlık sonrası bölüm derslerini planlıyorsun. İleri düzey istatistik dersi yerine yazılım giriş dersi almak istiyorsun.',
    initialMessage: "Good morning. Please take a seat. I received your request regarding course changes. Could you explain your reasoning?",
    initialMessageTr: "Günaydın. Lütfen oturun. Ders değişiklikleriyle ilgili talebinizi aldım. Gerekçenizi açıklayabilir misiniz?",
    targetGoal: "Neden dersi değiştirmek istediğini açıkla, kariyer hedeflerinden bahset ve onay iste.",
    suggestedPhrases: [
      { en: "Thank you for seeing me. I believe software development aligns better with my career goals.", tr: "Görüştüğünüz için teşekkürler. Yazılım geliştirmenin kariyer hedeflerimle daha uyumlu olduğuna inanıyorum." },
      { en: "The workload of advanced statistics might affect my overall GPA negatively.", tr: "İleri istatistiğin iş yükü genel not ortalamamı olumsuz etkileyebilir." },
      { en: "I have already discussed this prerequisite with the lecturer.", tr: "Bu önkoşul konusunu dersin hocasıyla zaten görüştüm." },
      { en: "Would you approve this substitution form?", tr: "Bu ders değişim formunu onaylar mısınız?" }
    ],
    maxTurns: 5,
    simulatedResponses: [
      {
        trigger: ['career', 'software', 'programming', 'interest', 'align', 'goal'],
        response: "I see your point. Software engineering is indeed very valuable. However, statistics provides fundamental analytical skills. How do you plan to compensate for that?",
        tr: "Noktanızı anlıyorum. Yazılım mühendisliği gerçekten çok değerli. Ancak istatistik temel analitik beceriler sağlar. Bunu nasıl telafi etmeyi planlıyorsunuz?"
      },
      {
        trigger: ['online', 'project', 'study', 'compensate', 'learn', 'work'],
        response: "That demonstrates genuine initiative on your part. If you are confident you can maintain a strong grade, I am willing to sign the substitution form.",
        tr: "Bu sizin tarafınızda gerçek bir inisiyatif gösteriyor. Yüksek bir notu koruyabileceğinize güveniyorsanız, ders değişim formunu imzalamaya hazırım."
      },
      {
        trigger: ['thank', 'sign', 'form', 'appreciate', 'opportunity'],
        response: "Here is your signed approval. Make sure to submit it to the registrar before Friday 5 PM. Best of luck with your studies!",
        tr: "İşte imzalı onayınız. Cuma günü saat 17:00'den önce öğrenci işlerine teslim ettiğinizden emin olun. Derslerinizde başarılar!"
      }
    ]
  }
];

const FREE_CHAT_PERSONAS = [
  {
    id: 'buddy',
    name: 'Charlie (Samimi Sohbet Arkadaşı)',
    avatar: '☕',
    description: 'Arkadaş canlısı, günlük dille konuşan, hazırlık öğrencileriyle sohbet etmeyi seven bir üniversiteli.',
    welcomeMessage: "Hey there! I'm Charlie, your English practice buddy. You can tell me about your day, your favorite movies, or anything on your mind. How's your week going so far?",
    welcomeMessageTr: "Selam! Ben Charlie, senin İngilizce pratik arkadaşınım. Bana gününü, en sevdiğin filmleri ya da aklındaki herhangi bir şeyi anlatabilirsin. Haftan nasıl geçiyor?"
  },
  {
    id: 'tutor',
    name: 'Sarah (Sabırlı Hazırlık Koçu)',
    avatar: '👩‍🏫',
    description: 'Sana cesaret veren, kelime zenginliğine odaklanan ve kibarca yol gösteren bir dil öğretmeni.',
    welcomeMessage: "Hello! Welcome to our free practice space. I am Coach Sarah. Don't worry about making mistakes here; every mistake is a learning step! What topic would you like to explore today?",
    welcomeMessageTr: "Merhaba! Serbest pratik alanımıza hoş geldin. Ben Koç Sarah. Burada hata yapmaktan asla çekinme; her hata bir öğrenme adımıdır! Bugün hangi konuyu keşfetmek istersin?"
  },
  {
    id: 'traveler',
    name: 'Leo (Dünya Gezgini)',
    avatar: '🌍',
    description: 'Farklı ülkeleri, kültürleri, yemekleri ve seyahat anılarını konuşmaktan keyif alan bir gezgin.',
    welcomeMessage: "Hi there! Leo here. I just got back from a backpacking trip. Do you enjoy traveling? Where is a dream country or city you'd love to visit one day?",
    welcomeMessageTr: "Selam! Ben Leo. Sırt çantalı bir seyahatten yeni döndüm. Seyahat etmeyi sever misin? Bir gün ziyaret etmeyi çok istediğin rüya bir ülke veya şehir var mı?"
  }
];

const FREE_CHAT_TOPIC_STARTERS = [
  { title: "🎬 Favori Dizi/Filmler", prompt: "What is your favorite TV show or movie, and why do you recommend it?" },
  { title: "🍕 Yemek & Kahve Kültürü", prompt: "What is your favorite local food or breakfast routine?" },
  { title: "🎓 Üniversite & Hazırlık", prompt: "How is prep school life treating you? What is the hardest part of learning English?" },
  { title: "✈️ Hayalindeki Tatil", prompt: "If you could fly to any city in the world tomorrow for free, where would you go?" },
  { title: "🎵 Müzik & Hobiler", prompt: "What kind of music do you listen to when you study or relax?" }
];
