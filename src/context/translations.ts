import { ar } from './locales/ar';
import { de } from './locales/de';
import { tr } from './locales/tr';
import { fa } from './locales/fa';
import { en } from './locales/en';
import { uk } from './locales/uk';

/** The six app languages — the one runtime list; everything else keys off it. */
export const LANGS = ['ar', 'de', 'tr', 'fa', 'en', 'uk'] as const;
export type Lang = (typeof LANGS)[number];

const RTL_LANGS: readonly Lang[] = ['ar', 'fa'];
export function isRtlLang(lang: Lang): boolean {
  return RTL_LANGS.includes(lang);
}

/** "3 appointments", in the plural form each language actually needs.
 *
 * A fixed word next to a number is wrong in most of the six. Arabic alone has
 * six plural categories and does not take the numeral at all in the dual —
 * "موعدين", never "2 موعدين" — which is why these are whole phrases rather
 * than a bare noun with {count} glued on by the caller. Ukrainian needs three
 * forms; Turkish and Persian keep the singular after any number; German and
 * English need two.
 *
 * The category comes from Intl.PluralRules, which is the browser's own copy
 * of the CLDR rules, so the boundaries are right without anyone here having
 * to encode them. */
type PluralForms = { other: string } & Partial<Record<Intl.LDMLPluralRule, string>>;

const APPOINTMENT_COUNT: Record<Lang, PluralForms> = {
  ar: {
    zero: 'ما في مواعيد',
    one: 'موعد واحد',
    two: 'موعدين',
    few: '{count} مواعيد',
    many: '{count} موعداً',
    other: '{count} موعد',
  },
  de: { one: 'einen Termin', other: '{count} Termine' },
  tr: { one: 'bir randevu', other: '{count} randevu' },
  fa: { one: 'یک قرار', other: '{count} قرار' },
  en: { one: 'one appointment', other: '{count} appointments' },
  uk: {
    one: '{count} зустріч',
    few: '{count} зустрічі',
    many: '{count} зустрічей',
    other: '{count} зустрічі',
  },
};

/** The phrase for a number of appointments, e.g. "موعدين" or "3 appointments". */
export function appointmentCount(lang: Lang, count: number): string {
  const forms = APPOINTMENT_COUNT[lang];
  const form = forms[new Intl.PluralRules(lang).select(count)] ?? forms.other;
  return form.replace('{count}', String(count));
}

export const translations = { ar, de, tr, fa, en, uk };
export type TranslationKey = keyof typeof ar;

/** Reader gender. `null` means they haven't said, and the base tables in
 * ./locales stay as written: masculine verb forms (the conventional generic in Arabic)
 * with a greeting that names the family rather than either parent. */
export type Gender = 'm' | 'f';

/** Arabic is the only one of the six that changes with the reader's gender —
 * Turkish and Farsi have no grammatical gender in address, and German,
 * English and Ukrainian address the reader without it here. So this is a
 * partial override on `ar` alone, holding only the strings that differ
 * rather than a second copy of all 290. */
export const arByGender: Record<Gender, Partial<Record<TranslationKey, string>>> = {
  m: {
    greeting_title_named: "أهلاً أبو {name}",
  },
  f: {
    child_consent_label: "بموافقتي، بسمح لـ Brifo يخزن معلومات هالفرد (الاسم والصف/المدرسة إذا موجودين) لتنظيم الرسائل والمواعيد. بالنسبة لطفلي القاصر، بوافق بصفتي وليّة أمره.",
    sensitive_consent_checkbox: "بوافق بشكل صريح إنه Brifo يبعت هالبيانات من رسائلي ومواعيدي وملاحظاتي — وكمان يلي بتخص أطفالي القاصرين بصفتي وليّة أمرهم — لـ Anthropic (كمان بأمريكا) للتحليل وكتابة الردود، ويخزنها كنسخة احتياطية بحسابي.",
    sensitive_consent_note: "الموافقة اختيارية، وفيكي تسحبيها بأي وقت من الإعدادات. بدونها بتضلي تقدري تستخدمي التقويم والمهام والدليل والتذكيرات.",
    settings_sensitive_granted: "وافقتي إنه Brifo يحلل البيانات الصحية والحساسة يلي بالرسائل. إذا سحبتي الموافقة، تحليل الرسائل وكتابة الردود ما بيعودوا متاحين؛ والرسائل المحفوظة فيكي تحذفيها وحدة وحدة أو من «حذف الحساب والبيانات».",
    greeting_title_named: "أهلاً أم {name}",
    privacy_gate_welcome: 'أهلاً فيكي ببريفو',
    privacy_gate_tagline: 'افهمي أي رسالة ألمانية — بلغتك إنتِ.',
    privacy_gate_point2_body: 'فيكي تمحي أي رسالة، أي ملف، أو كل شي — وقت ما بدك.',
    greeting_subtitle_new: "ابدي بإضافة أول فرد من العائلة، وبعدين صوّري أول رسالة.",
    auth_intro: "سجّلي دخول بإيميلك عشان تبدئي تستخدمي Brifo. رح نبعتلك كود تكتبيه هون، بدون كلمة سر.",
    auth_pricing_note: "Brifo مجاني (الدليل، التقويم، المهام، التذكيرات). تصوير الرسائل وتحليلها بالذكاء الاصطناعي، وتوليد الردود، بحاجة اشتراك بعد 7 أيام تجربة مجانية — 2.90 € بالشهر أو 20 € بالسنة، تقدري تلغي وقت ما بدك.",
    auth_tagline: "صوّري أي رسالة ألمانية — وافهميها بلغتك بثواني",
    auth_check_email: "بعتنالك رابط عإيميلك — افتحي الإيميل ودوسي عالرابط لتسجيل الدخول.",
    auth_enter_code: "بعتنا كود مؤلف من 6 أرقام لـ {email} — دخّليه هون (نفس التطبيق، مش من الإيميل) حتى تسجّلي دخول.",
    auth_code_required: "دخّلي الكود يلي وصلك بالإيميل",
    auth_code_invalid: "الكود غلط أو منتهي — تأكدي منه أو اطلبي كود جديد",
    auth_error: "صار في مشكلة، جرّبي مرة ثانية",
    auth_email_required: "دخّلي إيميلك الأول",
    auth_not_configured: "نظام تسجيل الدخول لسا ما انظبط، جرّبي بعد شوي",
    settings_manage_subscription_error: "صار في مشكلة، جرّبي مرة ثانية",
    referral_title: "ادعي صديقة",
    referral_subtitle: "شاركي الرابط، وياخد كل واحدة فيكن {days} أيام تجربة إضافية لما تسجّل صديقتك حساب جديد.",
    referral_whatsapp_message: "جربي تطبيق Brifo، بيساعد بفهم الرسائل الألمانية بلغتك 🙌",
    auth_intro_password: "سجّلي دخول بإيميلك وكلمة السر الخاصة فيك.",
    auth_password_required: "اكتبي كلمة السر",
    auth_use_code_link: "أول مرة أو نسيتي كلمة السر؟ ادخلي بكود",
    auth_set_password_title: "حطي كلمة سر خاصة فيك",
    auth_set_password_subtitle: "رح تستخدميها بالمرات الجايّة بدل ما تنطري كود كل مرة عبر الإيميل",
    auth_password_confirm_placeholder: "أكدي كلمة السر",
    error_offline: "ما في اتصال بالإنترنت. تأكدي من الشبكة وجرّبي مرة تانية.",
    error_connection: "ما قدرنا نوصل للخدمة. تأكدي من الإنترنت وجرّبي مرة تانية.",
    settings_erase_note: "إذا سجّلتي دخول بعدين بنفس الإيميل، بينعمل حساب جديد فاضي. الفواتير يلي القانون بيلزمنا نحتفظ فيها بتضل عند Stripe لحد ما تخلص المدة.",
    settings_erase_confirm: "متأكدة؟ اضغطي مرة تانية للحذف النهائي",
    settings_erase_blocked: "عندك اشتراك فعّال. ألغيه أول من «إدارة الاشتراك» فوق، وبعدها ارجعي لهون.",
    settings_erase_error: "ما زبط الحذف. جرّبي كمان مرة.",
    error_busy: "الخدمة مشغولة هلق. جرّبي بعد دقيقة.",
    error_daily_limit: "وصلتي للحد اليومي لقراءة الرسائل. جرّبي بكرا.",
    scan_error_unreadable: "ما قدرنا نقرأ الرسالة من الصورة. صوّريها بضوء أحسن والورقة كلها داخل الكادر.",
    result_tip_label: "مفيد تعرفي",
    home_no_children_title: "أضيفي أول فرد من العائلة",
    search_placeholder: "دوّري برسالة أو دفعة...",
    todo_empty: "أضيفي أول مهمة",
    reminders_permission_denied: "لازم تسمحي بالإشعارات من إعدادات المتصفح أو الموبايل",
    rate_comment_placeholder: "اكتبي ملاحظاتك (اختياري)",
    backup_subtitle: "بياناتك محفوظة تلقائياً بحسابك وبترجع معك بمجرد ما تسجّلي دخول من أي جهاز. هالخيار إضافي بس، لو حبيتي تحتفظي بنسخة ملف على جهازك.",
    privacy_gate_summary: "قبل ما تكملي استخدام Brifo، لازم تطّلعي على سياسة الخصوصية الجديدة وتوافقي عليها.",
    paywall_value_line: "صوّري أي رسالة ألمانية — وافهميها بلغتك بثواني.",
    paywall_annual_compare: "بدل 34.80 € لو دفعتي شهري",
    paywall_annual_savings: "وفّري أكتر من 40% مقارنة بالاشتراك الشهري",
    paywall_consent_label: "موافق/ة إنه الاشتراك يبلش فوراً، وفاهم/ة إنه بهيك بفقد حقي بالرجوع خلال 14 يوم (حسب المادة 4 من شروط الاستخدام).",
    paywall_trial_ended: "انتهت فترتك التجريبية — اشتركي للمتابعة",
    paywall_checkout_error: "صار في مشكلة، جرّبي مرة ثانية",
    paywall_checkout_cancelled: "ألغيتي عملية الاشتراك",
    paywall_store_web_only: "للاشتراك في Brifo، افتحي التطبيق من متصفح جوالك على mybrifo.com.",
    paywall_open_website: "افتحي موقع بريفو",
  },
};
