/** Every word the Telegram bot says, in the six languages the app already
 * speaks (src/context/translations.ts).
 *
 * The bot is a doorway, not a second Brifo: it says what the app is and opens
 * it. Reading letters, writing replies and keeping appointments all happen
 * inside the app itself (the Mini App, see src/lib/telegramWebApp.ts), which
 * is why this vocabulary is small.
 *
 * Deliberately NOT shared with the app's own translation table: that one lives
 * in src/context (an ESM, browser-side module tree) and this one is imported
 * from src/server, which the api tsconfig compiles as CommonJS — importing
 * across that boundary is what nodenext refuses. */

export const BOT_LANGS = ['ar', 'de', 'tr', 'fa', 'en', 'uk'] as const;
export type BotLang = (typeof BOT_LANGS)[number];

export function isBotLang(value: unknown): value is BotLang {
  return typeof value === 'string' && (BOT_LANGS as readonly string[]).includes(value);
}

/** Shown on the language-picker buttons — each in its own language, so someone
 * who cannot read the current one can still find theirs. */
export const LANG_NAMES: Record<BotLang, string> = {
  ar: 'العربية',
  de: 'Deutsch',
  tr: 'Türkçe',
  fa: 'فارسی',
  en: 'English',
  uk: 'Українська',
};

/** Maps a Telegram `language_code` (which is an IETF tag like "de-AT") onto a
 * language the bot speaks, so a first-time user usually gets their own without
 * touching the picker. Arabic stays the fallback: it is who the app is for. */
export function langFromTelegramCode(code: unknown): BotLang {
  if (typeof code !== 'string') return 'ar';
  const base = code.toLowerCase().split('-')[0];
  return isBotLang(base) ? base : 'ar';
}

interface BotStrings {
  welcome_title: string;
  welcome_body: string;
  lang_prompt: string;
  lang_done: string;
  help: string;
  /** Answer to anything the bot is sent — a photo, a question, small talk.
   * The bot does not do the work; it opens the thing that does. */
  nudge_open_app: string;
  open_app_body: string;
  btn_open_app: string;
  btn_website: string;
}

export const BOT_TEXT: Record<BotLang, BotStrings> = {
  ar: {
    welcome_title: '👋 أهلاً فيك ببريفو',
    welcome_body:
      'بريفو بيساعدك تفهم الرسائل الألمانية اللي بتوصلك بالنمسا.\n\n' +
      '📸 صوّر أي رسالة — من المدرسة، الدكتور، البلدية، التأمين — ورح يشرحلك شو فيها بلغتك\n' +
      '📅 بيطلعلك المواعيد والمبالغ والمهل تلقائياً\n' +
      '✍️ وبيكتبلك رد جاهز بالألماني\n' +
      '📚 وفيه دليل يشرحلك كيف بتتعامل مع الدوائر الرسمية\n\n' +
      'اضغط الزر تحت ويفتح معك هون جوا تيلغرام 👇',
    lang_prompt: 'اختار لغتك:',
    lang_done: 'تمام، صرت إحكي معك بالعربي. افتح بريفو من الزر تحت 👇',
    help:
      '📖 بريفو بيفتح جوا تيلغرام — اضغط الزر تحت وبيشتغل معك على طول.\n\n' +
      'أول مرة بيطلب منك إيميلك، وبيبعتلك رمز من ٦ أرقام تكتبه. بعدها ما بيسأل كمان مرة.\n\n' +
      'الأوامر:\n' +
      '/app — افتح بريفو\n' +
      '/lang — غيّر اللغة\n' +
      '/start — من الأول',
    nudge_open_app:
      'بريفو بيقرأ الرسائل **جوا التطبيق** مو هون بالمحادثة.\n\n' +
      'اضغط الزر تحت، ومن جوا صوّر رسالتك — وهناك بتنحفظ الرسائل والمواعيد عندك.',
    open_app_body: 'اضغط الزر وبينفتح بريفو هون جوا تيلغرام 👇',
    btn_open_app: '📱 افتح بريفو',
    btn_website: '🌐 افتحه بالمتصفح',
  },

  de: {
    welcome_title: '👋 Willkommen bei Brifo',
    welcome_body:
      'Brifo hilft dir, die deutschen Briefe zu verstehen, die du in Österreich bekommst.\n\n' +
      '📸 Fotografiere einen Brief — von der Schule, vom Arzt, vom Amt, von der Versicherung — und Brifo erklärt ihn dir in deiner Sprache\n' +
      '📅 Termine, Beträge und Fristen werden automatisch herausgezogen\n' +
      '✍️ Und eine fertige Antwort auf Deutsch schreibt es dir auch\n' +
      '📚 Dazu ein Ratgeber für den Umgang mit Behörden\n\n' +
      'Tipp auf den Button — Brifo öffnet sich hier in Telegram 👇',
    lang_prompt: 'Wähle deine Sprache:',
    lang_done: 'Alles klar, ab jetzt auf Deutsch. Öffne Brifo mit dem Button 👇',
    help:
      '📖 Brifo öffnet sich direkt in Telegram — einfach auf den Button tippen.\n\n' +
      'Beim ersten Mal fragt es nach deiner E-Mail und schickt dir einen 6-stelligen Code. Danach nie wieder.\n\n' +
      'Befehle:\n' +
      '/app — Brifo öffnen\n' +
      '/lang — Sprache ändern\n' +
      '/start — von vorne',
    nudge_open_app:
      'Brifo liest Briefe **in der App**, nicht hier im Chat.\n\n' +
      'Tipp auf den Button und fotografiere den Brief dort — so werden Briefe und Termine auch gespeichert.',
    open_app_body: 'Tipp auf den Button, dann öffnet sich Brifo hier in Telegram 👇',
    btn_open_app: '📱 Brifo öffnen',
    btn_website: '🌐 Im Browser öffnen',
  },

  tr: {
    welcome_title: '👋 Brifo’ya hoş geldin',
    welcome_body:
      'Brifo, Avusturya’da sana gelen Almanca mektupları anlamana yardım eder.\n\n' +
      '📸 Bir mektubun fotoğrafını çek — okuldan, doktordan, belediyeden, sigortadan — Brifo sana kendi dilinde anlatsın\n' +
      '📅 Randevular, tutarlar ve son tarihler otomatik çıkarılır\n' +
      '✍️ Almanca hazır bir cevap da yazar\n' +
      '📚 Ayrıca resmî kurumlarla nasıl başa çıkılır diye bir rehber var\n\n' +
      'Aşağıdaki düğmeye dokun — Brifo burada, Telegram’ın içinde açılır 👇',
    lang_prompt: 'Dilini seç:',
    lang_done: 'Tamam, artık Türkçe konuşuyorum. Aşağıdaki düğmeden Brifo’yu aç 👇',
    help:
      '📖 Brifo doğrudan Telegram içinde açılır — sadece düğmeye dokun.\n\n' +
      'İlk seferde e-postanı ister ve sana 6 haneli bir kod gönderir. Sonra bir daha sormaz.\n\n' +
      'Komutlar:\n' +
      '/app — Brifo’yu aç\n' +
      '/lang — dili değiştir\n' +
      '/start — baştan başla',
    nudge_open_app:
      'Brifo mektupları **uygulamanın içinde** okur, burada sohbette değil.\n\n' +
      'Düğmeye dokun ve mektubu orada fotoğrafla — mektuplar ve randevular da böyle kaydedilir.',
    open_app_body: 'Düğmeye dokun, Brifo burada Telegram içinde açılsın 👇',
    btn_open_app: '📱 Brifo’yu aç',
    btn_website: '🌐 Tarayıcıda aç',
  },

  fa: {
    welcome_title: '👋 به بریفو خوش آمدی',
    welcome_body:
      'بریفو کمکت می‌کند نامه‌های آلمانی‌ای را که در اتریش می‌گیری بفهمی.\n\n' +
      '📸 از نامه عکس بگیر — از مدرسه، دکتر، شهرداری، بیمه — و بریفو به زبان خودت توضیح می‌دهد\n' +
      '📅 قرارها، مبالغ و مهلت‌ها خودکار بیرون کشیده می‌شوند\n' +
      '✍️ یک پاسخ آمادهٔ آلمانی هم برایت می‌نویسد\n' +
      '📚 و راهنمایی برای سروکار داشتن با ادارات دارد\n\n' +
      'دکمهٔ پایین را بزن — بریفو همین‌جا داخل تلگرام باز می‌شود 👇',
    lang_prompt: 'زبانت را انتخاب کن:',
    lang_done: 'باشه، از حالا فارسی حرف می‌زنم. بریفو را از دکمهٔ پایین باز کن 👇',
    help:
      '📖 بریفو مستقیم داخل تلگرام باز می‌شود — فقط دکمه را بزن.\n\n' +
      'بار اول ایمیلت را می‌پرسد و یک کد ۶ رقمی برایت می‌فرستد. بعد از آن دیگر نمی‌پرسد.\n\n' +
      'دستورها:\n' +
      '/app — باز کردن بریفو\n' +
      '/lang — تغییر زبان\n' +
      '/start — از اول',
    nudge_open_app:
      'بریفو نامه‌ها را **داخل اپ** می‌خواند، نه اینجا در چت.\n\n' +
      'دکمه را بزن و نامه را همان‌جا عکس بگیر — نامه‌ها و قرارها هم همان‌جا ذخیره می‌شوند.',
    open_app_body: 'دکمه را بزن تا بریفو همین‌جا داخل تلگرام باز شود 👇',
    btn_open_app: '📱 باز کردن بریفو',
    btn_website: '🌐 باز کردن در مرورگر',
  },

  en: {
    welcome_title: '👋 Welcome to Brifo',
    welcome_body:
      'Brifo helps you understand the German letters you get in Austria.\n\n' +
      '📸 Photograph any letter — school, doctor, council, insurer — and Brifo explains it in your language\n' +
      '📅 Appointments, amounts and deadlines are pulled out automatically\n' +
      '✍️ It writes you a ready-made reply in German too\n' +
      '📚 Plus a guide to dealing with Austrian offices\n\n' +
      'Tap the button below — Brifo opens right here inside Telegram 👇',
    lang_prompt: 'Choose your language:',
    lang_done: 'Done — English from now on. Open Brifo with the button below 👇',
    help:
      '📖 Brifo opens right inside Telegram — just tap the button.\n\n' +
      'The first time it asks for your email and sends you a 6-digit code. After that it never asks again.\n\n' +
      'Commands:\n' +
      '/app — open Brifo\n' +
      '/lang — change language\n' +
      '/start — start over',
    nudge_open_app:
      'Brifo reads letters **inside the app**, not here in the chat.\n\n' +
      'Tap the button and photograph your letter there — that way your letters and appointments are saved too.',
    open_app_body: 'Tap the button and Brifo opens right here inside Telegram 👇',
    btn_open_app: '📱 Open Brifo',
    btn_website: '🌐 Open in a browser',
  },

  uk: {
    welcome_title: '👋 Вітаємо у Brifo',
    welcome_body:
      'Brifo допомагає зрозуміти німецькі листи, які ви отримуєте в Австрії.\n\n' +
      '📸 Сфотографуйте будь-який лист — зі школи, від лікаря, з установи, від страхової — і Brifo пояснить його вашою мовою\n' +
      '📅 Зустрічі, суми й терміни витягуються автоматично\n' +
      '✍️ А ще він напише вам готову відповідь німецькою\n' +
      '📚 І має довідник, як мати справу з австрійськими установами\n\n' +
      'Натисніть кнопку нижче — Brifo відкриється тут, усередині Telegram 👇',
    lang_prompt: 'Оберіть свою мову:',
    lang_done: 'Готово — далі українською. Відкрийте Brifo кнопкою нижче 👇',
    help:
      '📖 Brifo відкривається прямо в Telegram — просто натисніть кнопку.\n\n' +
      'Першого разу він попросить вашу пошту й надішле 6-значний код. Далі більше не питатиме.\n\n' +
      'Команди:\n' +
      '/app — відкрити Brifo\n' +
      '/lang — змінити мову\n' +
      '/start — почати спочатку',
    nudge_open_app:
      'Brifo читає листи **у застосунку**, а не тут у чаті.\n\n' +
      'Натисніть кнопку й сфотографуйте лист там — так ваші листи та зустрічі ще й збережуться.',
    open_app_body: 'Натисніть кнопку, і Brifo відкриється тут, усередині Telegram 👇',
    btn_open_app: '📱 Відкрити Brifo',
    btn_website: '🌐 Відкрити у браузері',
  },
};

export function t(lang: BotLang, key: keyof BotStrings): string {
  return BOT_TEXT[lang][key];
}
