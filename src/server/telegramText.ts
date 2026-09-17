/** Every word the Telegram bot says, in the six languages the app already
 * speaks (src/context/translations.ts). Kept as its own module so telegram.ts
 * stays about behaviour, and so a missing translation is visible as a gap in a
 * table rather than buried in a template string.
 *
 * Deliberately NOT shared with the app's own translation table: that one lives
 * in src/context (an ESM, browser-side module tree) and this one is imported
 * from src/server, which the api tsconfig compiles as CommonJS — importing
 * across that boundary is what nodenext refuses. The bot's chrome is also a
 * different, much smaller vocabulary than the app's screens. */

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
  reading: string;
  err_generic: string;
  err_unreadable: string;
  err_too_big: string;
  err_unsupported: string;
  err_limit: string;
  label_sender: string;
  label_actions: string;
  label_deadlines: string;
  label_payments: string;
  saved_reminders: string;
  hint_send_as_file: string;
  hint_send_photo: string;
  btn_reply: string;
  btn_cancel: string;
  btn_open_app: string;
  open_app_body: string;
  reply_no_letter: string;
  reply_pick_intent: string;
  reply_ask_details: string;
  reply_writing: string;
  reply_german: string;
  reply_translation: string;
  reply_cancelled: string;
  appts_title: string;
  appts_empty: string;
  appts_cleared: string;
  urgency_high: string;
  urgency_medium: string;
  urgency_low: string;
  intent_entschuldigung: string;
  intent_termin: string;
  intent_absage: string;
  intent_zustimmung: string;
  intent_ratenzahlung: string;
  intent_einspruch: string;
  intent_frage: string;
}

export const BOT_TEXT: Record<BotLang, BotStrings> = {
  ar: {
    welcome_title: '👋 أهلاً فيك ببريفو',
    welcome_body:
      'صوّر أي رسالة ألمانية وابعتها لهون، ورح إقرأها وإشرحلك شو فيها بلغتك، وقلّك شو المطلوب منك.\n\n' +
      '📸 ابعت صورة الرسالة\n' +
      '✍️ بعدها فيك تطلب رد جاهز بالألماني\n' +
      '🔔 والمواعيد بتنحفظ وبذكّرك فيها قبلها بيوم\n\n' +
      '/help للمساعدة · /lang لتغيير اللغة',
    lang_prompt: 'اختار لغتك:',
    lang_done: 'تمام، صرت إحكي معك بالعربي. ابعتلي صورة رسالة لنبلّش.',
    help:
      '📖 كيف بيشتغل بريفو:\n\n' +
      '• ابعتلي صورة الرسالة (أو ابعتها كملف Datei لدقة أعلى)\n' +
      '• رح إشرحلك شو فيها وشو المطلوب منك\n' +
      '• المواعيد بتنحفظ وبوصلك تذكير قبلها بيوم\n\n' +
      'الأوامر:\n' +
      '/mawaid — مواعيدك المحفوظة\n' +
      '/clear — مسح المواعيد المحفوظة\n' +
      '/app — فتح التطبيق\n' +
      '/lang — تغيير اللغة\n' +
      '/start — من الأول',
    reading: '📖 عم إقرأ الرسالة… خود بالك، بياخد شوي وقت.',
    err_generic: 'صار خلل عندي وما قدرت إقرأ الرسالة. جرّب كمان مرة بعد شوي.',
    err_unreadable: 'ما قدرت إقرأ الرسالة من الصورة. جرّب صورة أوضح، والورقة كاملة بالكادر وبإضاءة منيحة.',
    err_too_big: 'الملف كبير كتير. ابعت الصورة كصورة عادية (مو كملف) وبيزبط.',
    err_unsupported: 'بقدر إقرأ الصور بس (JPG أو PNG). إذا معك PDF، صوّر الورقة بالكاميرا وابعتها.',
    err_limit: 'وصلت للحد اليومي للرسائل. جرّب بكرا، أو استعمل التطبيق على mybrifo.com',
    label_sender: '📤 المرسِل',
    label_actions: '📌 المطلوب منك',
    label_deadlines: '📅 المواعيد',
    label_payments: '💶 المبالغ',
    saved_reminders: '🔔 حفظت المواعيد، ورح يوصلك تذكير قبل كل موعد بيوم.',
    hint_send_as_file: '💡 إذا الخط مو واضح، ابعت الصورة كملف (Datei / File) وبتطلع الدقة أعلى.',
    hint_send_photo: 'ابعتلي صورة الرسالة وأنا إشرحلك شو فيها. /help للمساعدة.',
    btn_reply: '✍️ اكتب رد بالألماني',
    btn_cancel: '✖️ إلغاء',
    btn_open_app: '📱 افتح تطبيق بريفو',
    open_app_body: 'تطبيق بريفو فيه كل رسائلك ومواعيدك ودليل الدوائر الرسمية — بينفتح هون جوا تيلغرام.',
    reply_no_letter: 'ابعتلي صورة الرسالة أول شي، وبعدين بكتبلك الرد.',
    reply_pick_intent: 'شو بدك تكتب؟',
    reply_ask_details:
      'اكتبلي التفاصيل بكلماتك (بأي لغة بتريحك) — مثلاً السبب، والتاريخ، واسم الشخص المعني.\n\n' +
      'لإلغاء الرد اكتب /cancel',
    reply_writing: '✍️ عم إكتب الرسالة…',
    reply_german: '✉️ الرسالة بالألماني',
    reply_translation: '🔤 الترجمة',
    reply_cancelled: 'تمام، ألغيت الرد.',
    appts_title: '📅 مواعيدك المحفوظة',
    appts_empty: 'ما في مواعيد محفوظة. أي موعد بلاقيه برسالة بتبعتها رح ينحفظ لحالو.',
    appts_cleared: 'مسحت كل المواعيد المحفوظة.',
    urgency_high: '🔴 مهم',
    urgency_medium: '🟡 متوسط',
    urgency_low: '🟢 عادي',
    intent_entschuldigung: 'اعتذار عن غياب',
    intent_termin: 'طلب موعد',
    intent_absage: 'إلغاء أو تأجيل موعد',
    intent_zustimmung: 'موافقة',
    intent_ratenzahlung: 'طلب تقسيط أو تأجيل دفع',
    intent_einspruch: 'اعتراض على قرار',
    intent_frage: 'سؤال',
  },

  de: {
    welcome_title: '👋 Willkommen bei Brifo',
    welcome_body:
      'Fotografiere einen deutschen Brief und schick ihn hierher. Ich lese ihn und erkläre dir in deiner Sprache, ' +
      'worum es geht und was du tun musst.\n\n' +
      '📸 Schick ein Foto des Briefes\n' +
      '✍️ Danach kannst du eine fertige Antwort auf Deutsch anfordern\n' +
      '🔔 Termine werden gespeichert, du bekommst einen Tag vorher eine Erinnerung\n\n' +
      '/help für Hilfe · /lang für die Sprache',
    lang_prompt: 'Wähle deine Sprache:',
    lang_done: 'Alles klar, ab jetzt auf Deutsch. Schick mir ein Foto eines Briefes.',
    help:
      '📖 So funktioniert Brifo:\n\n' +
      '• Schick mir ein Foto des Briefes (als Datei für bessere Qualität)\n' +
      '• Ich erkläre dir, worum es geht und was zu tun ist\n' +
      '• Termine werden gespeichert, Erinnerung kommt einen Tag vorher\n\n' +
      'Befehle:\n' +
      '/mawaid — gespeicherte Termine\n' +
      '/clear — gespeicherte Termine löschen\n' +
      '/app — die App öffnen\n' +
      '/lang — Sprache ändern\n' +
      '/start — von vorne',
    reading: '📖 Ich lese den Brief … das dauert einen Moment.',
    err_generic: 'Bei mir ist etwas schiefgelaufen. Bitte versuch es gleich noch einmal.',
    err_unreadable: 'Ich konnte den Brief auf dem Foto nicht lesen. Versuch ein schärferes Foto mit dem ganzen Blatt im Bild.',
    err_too_big: 'Die Datei ist zu groß. Schick das Bild als normales Foto (nicht als Datei), dann klappt es.',
    err_unsupported: 'Ich kann nur Bilder lesen (JPG oder PNG). Bei einem PDF: fotografiere das Blatt und schick das Foto.',
    err_limit: 'Du hast das Tageslimit erreicht. Versuch es morgen wieder oder nutze die App auf mybrifo.com',
    label_sender: '📤 Absender',
    label_actions: '📌 Das musst du tun',
    label_deadlines: '📅 Termine',
    label_payments: '💶 Beträge',
    saved_reminders: '🔔 Die Termine sind gespeichert. Du bekommst jeweils einen Tag vorher eine Erinnerung.',
    hint_send_as_file: '💡 Wenn die Schrift undeutlich ist: schick das Bild als Datei, dann ist die Qualität besser.',
    hint_send_photo: 'Schick mir ein Foto des Briefes, dann erkläre ich ihn dir. /help für Hilfe.',
    btn_reply: '✍️ Antwort auf Deutsch schreiben',
    btn_cancel: '✖️ Abbrechen',
    btn_open_app: '📱 Brifo-App öffnen',
    open_app_body: 'In der Brifo-App findest du alle deine Briefe, Termine und den Behörden-Ratgeber — sie öffnet sich hier in Telegram.',
    reply_no_letter: 'Schick mir zuerst ein Foto des Briefes, dann schreibe ich die Antwort.',
    reply_pick_intent: 'Was möchtest du schreiben?',
    reply_ask_details:
      'Schreib mir die Details in deinen eigenen Worten (in jeder Sprache) — zum Beispiel den Grund, das Datum ' +
      'und den Namen der betroffenen Person.\n\n' +
      'Zum Abbrechen: /cancel',
    reply_writing: '✍️ Ich schreibe den Brief …',
    reply_german: '✉️ Der Brief auf Deutsch',
    reply_translation: '🔤 Übersetzung',
    reply_cancelled: 'Alles klar, abgebrochen.',
    appts_title: '📅 Deine gespeicherten Termine',
    appts_empty: 'Keine gespeicherten Termine. Jeder Termin, den ich in einem Brief finde, wird automatisch gespeichert.',
    appts_cleared: 'Alle gespeicherten Termine wurden gelöscht.',
    urgency_high: '🔴 Wichtig',
    urgency_medium: '🟡 Mittel',
    urgency_low: '🟢 Normal',
    intent_entschuldigung: 'Entschuldigung wegen Abwesenheit',
    intent_termin: 'Termin anfragen',
    intent_absage: 'Termin absagen oder verschieben',
    intent_zustimmung: 'Zustimmung',
    intent_ratenzahlung: 'Ratenzahlung oder Aufschub',
    intent_einspruch: 'Einspruch gegen eine Entscheidung',
    intent_frage: 'Frage',
  },

  tr: {
    welcome_title: '👋 Brifo’ya hoş geldin',
    welcome_body:
      'Almanca bir mektubun fotoğrafını çek ve buraya gönder. Okuyup kendi dilinde ne yazdığını ve ne yapman ' +
      'gerektiğini anlatayım.\n\n' +
      '📸 Mektubun fotoğrafını gönder\n' +
      '✍️ Sonra Almanca hazır bir cevap isteyebilirsin\n' +
      '🔔 Randevular kaydedilir, bir gün önce hatırlatırım\n\n' +
      '/help yardım · /lang dil',
    lang_prompt: 'Dilini seç:',
    lang_done: 'Tamam, artık Türkçe konuşuyorum. Bana bir mektup fotoğrafı gönder.',
    help:
      '📖 Brifo nasıl çalışır:\n\n' +
      '• Bana mektubun fotoğrafını gönder (daha net olması için dosya olarak gönderebilirsin)\n' +
      '• Ne yazdığını ve ne yapman gerektiğini anlatayım\n' +
      '• Randevular kaydedilir, bir gün önce hatırlatma gelir\n\n' +
      'Komutlar:\n' +
      '/mawaid — kayıtlı randevular\n' +
      '/clear — kayıtlı randevuları sil\n' +
      '/app — uygulamayı aç\n' +
      '/lang — dili değiştir\n' +
      '/start — baştan başla',
    reading: '📖 Mektubu okuyorum… biraz sürebilir.',
    err_generic: 'Bir sorun oldu, mektubu okuyamadım. Birazdan tekrar dene.',
    err_unreadable: 'Fotoğraftaki mektubu okuyamadım. Sayfanın tamamı görünecek şekilde daha net bir fotoğraf dene.',
    err_too_big: 'Dosya çok büyük. Görseli normal fotoğraf olarak gönder (dosya olarak değil), o zaman olur.',
    err_unsupported: 'Sadece görselleri okuyabiliyorum (JPG veya PNG). PDF varsa sayfanın fotoğrafını çekip gönder.',
    err_limit: 'Günlük sınıra ulaştın. Yarın tekrar dene ya da mybrifo.com üzerinden uygulamayı kullan.',
    label_sender: '📤 Gönderen',
    label_actions: '📌 Yapman gerekenler',
    label_deadlines: '📅 Randevular ve son tarihler',
    label_payments: '💶 Tutarlar',
    saved_reminders: '🔔 Randevuları kaydettim. Her birinden bir gün önce hatırlatma göndereceğim.',
    hint_send_as_file: '💡 Yazı net değilse görseli dosya olarak gönder, kalite daha iyi olur.',
    hint_send_photo: 'Bana mektubun fotoğrafını gönder, ne yazdığını anlatayım. /help yardım için.',
    btn_reply: '✍️ Almanca cevap yaz',
    btn_cancel: '✖️ İptal',
    btn_open_app: '📱 Brifo uygulamasını aç',
    open_app_body: 'Brifo uygulamasında tüm mektupların, randevuların ve resmî kurumlar rehberi var — burada, Telegram içinde açılır.',
    reply_no_letter: 'Önce bana mektubun fotoğrafını gönder, sonra cevabı yazayım.',
    reply_pick_intent: 'Ne yazmak istiyorsun?',
    reply_ask_details:
      'Detayları kendi cümlelerinle yaz (istediğin dilde) — örneğin sebep, tarih ve ilgili kişinin adı.\n\n' +
      'İptal için: /cancel',
    reply_writing: '✍️ Mektubu yazıyorum…',
    reply_german: '✉️ Almanca mektup',
    reply_translation: '🔤 Çeviri',
    reply_cancelled: 'Tamam, iptal ettim.',
    appts_title: '📅 Kayıtlı randevuların',
    appts_empty: 'Kayıtlı randevu yok. Bir mektupta bulduğum her randevu otomatik olarak kaydedilir.',
    appts_cleared: 'Tüm kayıtlı randevular silindi.',
    urgency_high: '🔴 Önemli',
    urgency_medium: '🟡 Orta',
    urgency_low: '🟢 Normal',
    intent_entschuldigung: 'Devamsızlık için mazeret',
    intent_termin: 'Randevu talebi',
    intent_absage: 'Randevu iptali veya ertelemesi',
    intent_zustimmung: 'Onay',
    intent_ratenzahlung: 'Taksit veya erteleme talebi',
    intent_einspruch: 'Karara itiraz',
    intent_frage: 'Soru',
  },

  fa: {
    welcome_title: '👋 به بریفو خوش آمدی',
    welcome_body:
      'از نامهٔ آلمانی عکس بگیر و همین‌جا بفرست. من می‌خوانمش و به زبان خودت توضیح می‌دهم چه نوشته و باید چه کار کنی.\n\n' +
      '📸 عکس نامه را بفرست\n' +
      '✍️ بعد می‌توانی یک پاسخ آمادهٔ آلمانی بخواهی\n' +
      '🔔 قرارها ذخیره می‌شوند و یک روز قبل یادآوری می‌فرستم\n\n' +
      '/help راهنما · /lang زبان',
    lang_prompt: 'زبانت را انتخاب کن:',
    lang_done: 'باشه، از حالا فارسی حرف می‌زنم. یک عکس از نامه برایم بفرست.',
    help:
      '📖 بریفو چطور کار می‌کند:\n\n' +
      '• عکس نامه را بفرست (برای کیفیت بهتر به‌صورت فایل بفرست)\n' +
      '• توضیح می‌دهم چه نوشته و باید چه کار کنی\n' +
      '• قرارها ذخیره می‌شوند و یک روز قبل یادآوری می‌آید\n\n' +
      'دستورها:\n' +
      '/mawaid — قرارهای ذخیره‌شده\n' +
      '/clear — پاک کردن قرارها\n' +
      '/app — باز کردن اپ\n' +
      '/lang — تغییر زبان\n' +
      '/start — از اول',
    reading: '📖 دارم نامه را می‌خوانم… کمی طول می‌کشد.',
    err_generic: 'مشکلی پیش آمد و نتوانستم نامه را بخوانم. کمی بعد دوباره امتحان کن.',
    err_unreadable: 'نتوانستم نامه را از روی عکس بخوانم. عکس واضح‌تری بگیر که تمام برگه در کادر باشد.',
    err_too_big: 'فایل خیلی بزرگ است. عکس را به‌صورت عکس معمولی بفرست (نه فایل).',
    err_unsupported: 'فقط می‌توانم عکس بخوانم (JPG یا PNG). اگر PDF داری، از برگه عکس بگیر و بفرست.',
    err_limit: 'به سقف روزانه رسیدی. فردا دوباره امتحان کن یا از برنامه در mybrifo.com استفاده کن.',
    label_sender: '📤 فرستنده',
    label_actions: '📌 کاری که باید بکنی',
    label_deadlines: '📅 قرارها و مهلت‌ها',
    label_payments: '💶 مبالغ',
    saved_reminders: '🔔 قرارها را ذخیره کردم. یک روز قبل از هر کدام یادآوری می‌فرستم.',
    hint_send_as_file: '💡 اگر خط واضح نیست، عکس را به‌صورت فایل بفرست تا کیفیت بهتر شود.',
    hint_send_photo: 'عکس نامه را بفرست تا توضیح بدهم چه نوشته. /help برای راهنما.',
    btn_reply: '✍️ نوشتن پاسخ به آلمانی',
    btn_cancel: '✖️ لغو',
    btn_open_app: '📱 باز کردن اپ بریفو',
    open_app_body: 'در اپ بریفو همهٔ نامه‌ها، قرارها و راهنمای ادارات هست — همین‌جا داخل تلگرام باز می‌شود.',
    reply_no_letter: 'اول عکس نامه را بفرست، بعد پاسخ را می‌نویسم.',
    reply_pick_intent: 'چه چیزی می‌خواهی بنویسی؟',
    reply_ask_details:
      'جزئیات را به زبان خودت بنویس (هر زبانی که راحتی) — مثلاً دلیل، تاریخ و نام شخص مورد نظر.\n\n' +
      'برای لغو: /cancel',
    reply_writing: '✍️ دارم نامه را می‌نویسم…',
    reply_german: '✉️ نامه به آلمانی',
    reply_translation: '🔤 ترجمه',
    reply_cancelled: 'باشه، لغو شد.',
    appts_title: '📅 قرارهای ذخیره‌شدهٔ تو',
    appts_empty: 'قرار ذخیره‌شده‌ای نیست. هر قراری که در نامه‌ای پیدا کنم خودکار ذخیره می‌شود.',
    appts_cleared: 'همهٔ قرارهای ذخیره‌شده پاک شدند.',
    urgency_high: '🔴 مهم',
    urgency_medium: '🟡 متوسط',
    urgency_low: '🟢 عادی',
    intent_entschuldigung: 'عذرخواهی بابت غیبت',
    intent_termin: 'درخواست قرار',
    intent_absage: 'لغو یا جابه‌جایی قرار',
    intent_zustimmung: 'رضایت‌نامه',
    intent_ratenzahlung: 'درخواست قسط یا تعویق پرداخت',
    intent_einspruch: 'اعتراض به تصمیم',
    intent_frage: 'پرسش',
  },

  en: {
    welcome_title: '👋 Welcome to Brifo',
    welcome_body:
      'Photograph a German letter and send it here. I read it and explain, in your language, what it says and ' +
      'what you need to do.\n\n' +
      '📸 Send a photo of the letter\n' +
      '✍️ Then you can ask for a ready-made reply in German\n' +
      '🔔 Appointments get saved, and I remind you a day before\n\n' +
      '/help for help · /lang for language',
    lang_prompt: 'Choose your language:',
    lang_done: 'Done — English from now on. Send me a photo of a letter to start.',
    help:
      '📖 How Brifo works:\n\n' +
      '• Send me a photo of the letter (send it as a file for better quality)\n' +
      '• I explain what it says and what you need to do\n' +
      '• Appointments are saved and I remind you a day before\n\n' +
      'Commands:\n' +
      '/mawaid — your saved appointments\n' +
      '/clear — delete saved appointments\n' +
      '/app — open the app\n' +
      '/lang — change language\n' +
      '/start — start over',
    reading: '📖 Reading the letter… this takes a moment.',
    err_generic: 'Something went wrong on my side and I could not read the letter. Please try again shortly.',
    err_unreadable: 'I could not read the letter from that photo. Try a sharper one with the whole page in frame.',
    err_too_big: 'That file is too large. Send the image as a normal photo (not as a file) and it will work.',
    err_unsupported: 'I can only read images (JPG or PNG). If you have a PDF, photograph the page and send that.',
    err_limit: 'You have reached the daily limit. Try again tomorrow, or use the app at mybrifo.com',
    label_sender: '📤 From',
    label_actions: '📌 What you need to do',
    label_deadlines: '📅 Dates and deadlines',
    label_payments: '💶 Amounts',
    saved_reminders: '🔔 Appointments saved. You will get a reminder a day before each one.',
    hint_send_as_file: '💡 If the print is faint, send the image as a file — the quality is better that way.',
    hint_send_photo: 'Send me a photo of the letter and I will explain it. /help for help.',
    btn_reply: '✍️ Write a reply in German',
    btn_cancel: '✖️ Cancel',
    btn_open_app: '📱 Open the Brifo app',
    open_app_body: 'The Brifo app has all your letters, appointments and the guide to Austrian offices — it opens right here inside Telegram.',
    reply_no_letter: 'Send me a photo of the letter first, then I will write the reply.',
    reply_pick_intent: 'What would you like to write?',
    reply_ask_details:
      'Write the details in your own words (in any language) — for example the reason, the date, and the name ' +
      'of the person concerned.\n\n' +
      'To cancel: /cancel',
    reply_writing: '✍️ Writing the letter…',
    reply_german: '✉️ The letter in German',
    reply_translation: '🔤 Translation',
    reply_cancelled: 'Cancelled.',
    appts_title: '📅 Your saved appointments',
    appts_empty: 'No saved appointments. Any date I find in a letter you send is saved automatically.',
    appts_cleared: 'All saved appointments deleted.',
    urgency_high: '🔴 Important',
    urgency_medium: '🟡 Medium',
    urgency_low: '🟢 Normal',
    intent_entschuldigung: 'Excuse for an absence',
    intent_termin: 'Request an appointment',
    intent_absage: 'Cancel or move an appointment',
    intent_zustimmung: 'Consent',
    intent_ratenzahlung: 'Ask to pay in instalments',
    intent_einspruch: 'Object to a decision',
    intent_frage: 'A question',
  },

  uk: {
    welcome_title: '👋 Вітаємо у Brifo',
    welcome_body:
      'Сфотографуй німецький лист і надішли сюди. Я прочитаю його й поясню твоєю мовою, про що він і що треба зробити.\n\n' +
      '📸 Надішли фото листа\n' +
      '✍️ Потім можеш попросити готову відповідь німецькою\n' +
      '🔔 Зустрічі зберігаються, і я нагадаю за день\n\n' +
      '/help довідка · /lang мова',
    lang_prompt: 'Обери свою мову:',
    lang_done: 'Готово — далі українською. Надішли мені фото листа.',
    help:
      '📖 Як працює Brifo:\n\n' +
      '• Надішли фото листа (як файл — якість буде краща)\n' +
      '• Я поясню, про що він і що треба зробити\n' +
      '• Зустрічі зберігаються, нагадування приходить за день\n\n' +
      'Команди:\n' +
      '/mawaid — збережені зустрічі\n' +
      '/clear — видалити збережені зустрічі\n' +
      '/app — відкрити застосунок\n' +
      '/lang — змінити мову\n' +
      '/start — почати спочатку',
    reading: '📖 Читаю лист… це трохи триває.',
    err_generic: 'У мене сталася помилка, і я не зміг прочитати лист. Спробуй ще раз трохи згодом.',
    err_unreadable: 'Не вдалося прочитати лист із цього фото. Спробуй чіткіше, щоб уся сторінка була в кадрі.',
    err_too_big: 'Файл завеликий. Надішли зображення як звичайне фото (не як файл) — тоді спрацює.',
    err_unsupported: 'Я читаю лише зображення (JPG або PNG). Якщо маєш PDF, сфотографуй сторінку й надішли фото.',
    err_limit: 'Ти досяг денного ліміту. Спробуй завтра або скористайся застосунком на mybrifo.com',
    label_sender: '📤 Відправник',
    label_actions: '📌 Що потрібно зробити',
    label_deadlines: '📅 Дати та терміни',
    label_payments: '💶 Суми',
    saved_reminders: '🔔 Зустрічі збережено. Нагадування прийде за день до кожної.',
    hint_send_as_file: '💡 Якщо шрифт нечіткий, надішли зображення як файл — якість буде краща.',
    hint_send_photo: 'Надішли мені фото листа, і я поясню, про що він. /help — довідка.',
    btn_reply: '✍️ Написати відповідь німецькою',
    btn_cancel: '✖️ Скасувати',
    btn_open_app: '📱 Відкрити застосунок Brifo',
    open_app_body: 'У застосунку Brifo є всі ваші листи, зустрічі та довідник установ — він відкривається тут, усередині Telegram.',
    reply_no_letter: 'Спершу надішли фото листа, а тоді я напишу відповідь.',
    reply_pick_intent: 'Що ти хочеш написати?',
    reply_ask_details:
      'Напиши деталі своїми словами (будь-якою мовою) — наприклад причину, дату та ім’я особи, якої це стосується.\n\n' +
      'Щоб скасувати: /cancel',
    reply_writing: '✍️ Пишу лист…',
    reply_german: '✉️ Лист німецькою',
    reply_translation: '🔤 Переклад',
    reply_cancelled: 'Скасовано.',
    appts_title: '📅 Твої збережені зустрічі',
    appts_empty: 'Збережених зустрічей немає. Кожну дату, яку я знайду в листі, буде збережено автоматично.',
    appts_cleared: 'Усі збережені зустрічі видалено.',
    urgency_high: '🔴 Важливо',
    urgency_medium: '🟡 Середньо',
    urgency_low: '🟢 Звичайно',
    intent_entschuldigung: 'Пояснення щодо відсутності',
    intent_termin: 'Запит на зустріч',
    intent_absage: 'Скасувати або перенести зустріч',
    intent_zustimmung: 'Згода',
    intent_ratenzahlung: 'Прохання про розстрочку',
    intent_einspruch: 'Заперечення проти рішення',
    intent_frage: 'Питання',
  },
};

export function t(lang: BotLang, key: keyof BotStrings): string {
  return BOT_TEXT[lang][key];
}
