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
    zero: 'لا مواعيد',
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
    greeting_title_named: 'أهلاً يا أبا {name}',
  },
  f: {
    child_consent_label: 'بموافقتي، أسمح لتطبيق Brifo بتخزين بيانات هذا الفرد (الاسم والصف/المدرسة إن وُجدا) لتنظيم الرسائل والمواعيد. بالنسبة لطفلي القاصر، أوافق بصفتي وليّة أمره.',
    sensitive_consent_checkbox: 'أوافق صراحةً على أن يرسل Brifo هذه البيانات من رسائلي ومواعيدي وملاحظاتي — وكذلك ما يخص أطفالي القاصرين بصفتي وليّة أمرهم — إلى Anthropic (بما في ذلك في الولايات المتحدة) للتحليل وكتابة الردود، وأن يخزّنها كنسخة احتياطية في حسابي.',
    sensitive_consent_note: 'الموافقة اختيارية، ويمكنكِ سحبها في أي وقت من الإعدادات. من دونها، يمكنكِ الاستمرار في استخدام التقويم والمهام والدليل والتذكيرات.',
    settings_sensitive_granted: 'لقد وافقتِ على أن يحلّل Brifo البيانات الصحية والحساسة في الرسائل. إذا سحبتِ الموافقة، لن يعود تحليل الرسائل وكتابة الردود متاحَين؛ ويمكنكِ حذف الرسائل المحفوظة واحدة واحدة أو عبر «حذف الحساب».',
    greeting_title_named: 'أهلاً يا أم {name}',
    privacy_gate_welcome: 'أهلاً بكِ في Brifo',
    privacy_gate_tagline: 'افهمي أي رسالة ألمانية — بلغتك أنتِ.',
    privacy_gate_point2_body: 'يمكنكِ حذف أي رسالة، أي ملف، أو كل شيء — في أي وقت تريدين.',
    greeting_subtitle_new: 'ابدئي بإضافة أول فرد من العائلة، ثم صوّري أول رسالة.',
    auth_intro: 'سجّلي الدخول ببريدك الإلكتروني لتبدئي استخدام Brifo. سنرسل لك رمزًا تكتبينه هنا، من دون كلمة مرور.',
    auth_pricing_note: 'Brifo مجاني (الدليل، التقويم، المهام، التذكيرات). أما تصوير الرسائل وتحليلها بالذكاء الاصطناعي، وتوليد الردود، فيحتاج اشتراكًا بعد 7 أيام تجربة مجانية — 2.90 € شهريًا أو 20 € سنويًا، ويمكنكِ الإلغاء في أي وقت.',
    auth_tagline: 'صوّري أي رسالة ألمانية — وافهميها بلغتك خلال ثوانٍ',
    auth_check_email: 'أرسلنا لكِ رابطًا إلى بريدك الإلكتروني — افتحي الرسالة واضغطي على الرابط لتسجيل الدخول.',
    auth_enter_code: 'أرسلنا رمزًا مؤلفًا من 6 أرقام إلى {email} — أدخليه هنا (في التطبيق نفسه، وليس من البريد الإلكتروني) لتسجيل الدخول.',
    auth_code_required: 'أدخلي الرمز الذي وصلكِ عبر البريد الإلكتروني',
    auth_code_invalid: 'الرمز غير صحيح أو منتهي الصلاحية — تأكدي منه أو اطلبي رمزًا جديدًا',
    auth_error: 'حدثت مشكلة، حاولي مرة أخرى',
    auth_email_required: 'أدخلي بريدك الإلكتروني أولًا',
    auth_not_configured: 'نظام تسجيل الدخول لم يُفعَّل بعد، حاولي بعد قليل',
    settings_manage_subscription_error: 'حدثت مشكلة، حاولي مرة أخرى',
    referral_title: 'ادعي صديقة',
    referral_subtitle: 'شاركي الرابط، ويحصل كل منكما على {days} أيام تجربة إضافية عندما تسجّل صديقتك حسابًا جديدًا.',
    referral_whatsapp_message: 'جرّبي تطبيق Brifo، يساعدك على فهم الرسائل الألمانية بلغتك 🙌',
    auth_intro_password: 'سجّلي الدخول ببريدك الإلكتروني وكلمة المرور الخاصة بكِ.',
    auth_password_required: 'اكتبي كلمة المرور',
    auth_use_code_link: 'أول مرة أو نسيتِ كلمة المرور؟ سجّلي الدخول برمز',
    auth_set_password_title: 'عيّني كلمة مرور خاصة بكِ',
    auth_set_password_subtitle: 'ستستخدمينها في المرات القادمة بدل انتظار رمز جديد عبر البريد الإلكتروني في كل مرة',
    auth_password_confirm_placeholder: 'أكّدي كلمة المرور',
    error_offline: 'لا يوجد اتصال بالإنترنت. تأكدي من الشبكة وحاولي مرة أخرى.',
    error_connection: 'تعذّر الوصول إلى الخدمة. تأكدي من الإنترنت وحاولي مرة أخرى.',
    settings_erase_note: 'وسيُحذف حسابكِ أيضًا — لن يبقى بريدكِ الإلكتروني مسجّلًا لدينا. يمكنكِ فتح حساب جديد بالبريد الإلكتروني نفسه وقتما تشائين، لكنكِ ستبدئين من الصفر.',
    settings_erase_partial: 'حُذفت بياناتكِ كاملة، لكن تعذّر علينا حذف تسجيل الدخول نفسه. حاولي مرة أخرى، وإذا استمرت المشكلة تواصلي معنا.',
    settings_erase_confirm: 'متأكدة؟ اضغطي مرة أخرى للحذف النهائي',
    settings_erase_blocked: 'لديكِ اشتراك فعّال. ألغيه أولًا من «إدارة الاشتراك» أعلاه، ثم عودي إلى هنا.',
    settings_erase_error: 'لم تنجح عملية الحذف. حاولي مرة أخرى.',
    error_busy: 'الخدمة مشغولة حاليًا. حاولي بعد دقيقة.',
    error_daily_limit: 'وصلتِ إلى الحد اليومي لقراءة الرسائل. حاولي غدًا.',
    scan_error_unreadable: 'تعذّرت قراءة الرسالة من الصورة. صوّريها بإضاءة أفضل مع إبقاء الورقة كاملة داخل الإطار.',
    result_tip_label: 'من المفيد أن تعرفي',
    home_no_children_title: 'أضيفي أول فرد من العائلة',
    search_placeholder: 'ابحثي عن رسالة أو دفعة...',
    todo_empty: 'أضيفي أول مهمة',
    reminders_permission_denied: 'يجب أن تسمحي بالإشعارات من إعدادات المتصفح أو الهاتف',
    rate_comment_placeholder: 'اكتبي ملاحظاتك (اختياري)',
    backup_subtitle: 'بياناتك محفوظة تلقائيًا في حسابك، وتعود معكِ فور تسجيل الدخول من أي جهاز. هذا الخيار إضافي فقط، إن رغبتِ في الاحتفاظ بنسخة ملف على جهازك.',
    privacy_gate_summary: 'قبل متابعة استخدام Brifo، يجب أن تطّلعي على سياسة الخصوصية الجديدة وتوافقي عليها.',
    paywall_value_line: 'صوّري أي رسالة ألمانية — وافهميها بلغتك خلال ثوانٍ.',
    paywall_annual_compare: 'بدلًا من 34.80 € لو دفعتِ شهريًا',
    paywall_annual_savings: 'وفّري أكثر من 40% مقارنة بالاشتراك الشهري',
    paywall_consent_label: 'موافقة على أن يبدأ الاشتراك فورًا، ومُدركة أنني بذلك أفقد حقي في الرجوع خلال 14 يومًا (وفقًا للمادة 4 من شروط الاستخدام).',
    paywall_trial_ended: 'انتهت فترتك التجريبية — اشتركي للمتابعة',
    paywall_checkout_error: 'حدثت مشكلة، حاولي مرة أخرى',
    paywall_checkout_cancelled: 'ألغيتِ عملية الاشتراك',
    paywall_store_web_only: 'للاشتراك في Brifo، افتحي التطبيق من متصفح هاتفك على mybrifo.com.',
    paywall_open_website: 'افتحي موقع بريفو',
  },
};
