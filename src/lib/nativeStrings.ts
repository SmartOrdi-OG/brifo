import type { Lang } from '../context/translations';

/** Texts only the iOS build shows: the App Store subscription (in-app
 * purchase through Apple). Kept together here rather than spread over the six
 * locale files, since no other build uses them. `{price}` and `{days}` are
 * filled in from the App Store's own, localised values. */
export interface IosPaywallStrings {
  trial: string;
  then: string;
  subscribe: string;
  subscribeNoTrial: string;
  disclosure: string;
  restore: string;
  restored: string;
  nothingToRestore: string;
  error: string;
  unavailable: string;
  terms: string;
  privacy: string;
  manage: string;
}

export const IOS_PAYWALL: Record<Lang, IosPaywallStrings> = {
  de: {
    trial: '{days} Tage kostenlos testen',
    then: 'danach {price} pro Monat',
    subscribe: 'Kostenlos testen',
    subscribeNoTrial: 'Abonnieren',
    disclosure:
      'Die Zahlung erfolgt über deine Apple-ID. Das Abo verlängert sich automatisch monatlich, wenn es nicht mindestens 24 Stunden vor Ende der laufenden Periode gekündigt wird. Kündigen kannst du jederzeit in den Einstellungen deiner Apple-ID.',
    restore: 'Käufe wiederherstellen',
    restored: 'Dein Abo ist wieder aktiv ✓',
    nothingToRestore: 'Kein aktives Abo gefunden.',
    error: 'Der Kauf hat nicht geklappt. Bitte versuch es noch mal.',
    unavailable: 'Das Abo kann gerade nicht geladen werden. Bitte später erneut versuchen.',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    manage: 'Abo verwalten',
  },
  en: {
    trial: 'Try {days} days for free',
    then: 'then {price} per month',
    subscribe: 'Start free trial',
    subscribeNoTrial: 'Subscribe',
    disclosure:
      'Payment is charged to your Apple ID. The subscription renews automatically every month unless cancelled at least 24 hours before the end of the current period. You can cancel anytime in your Apple ID settings.',
    restore: 'Restore purchases',
    restored: 'Your subscription is active again ✓',
    nothingToRestore: 'No active subscription found.',
    error: 'The purchase did not go through. Please try again.',
    unavailable: 'The subscription cannot be loaded right now. Please try again later.',
    terms: 'Terms of Use',
    privacy: 'Privacy',
    manage: 'Manage subscription',
  },
  ar: {
    trial: 'جرّب مجانًا لمدة {days} أيام',
    then: 'ثم {price} شهريًا',
    subscribe: 'ابدأ التجربة المجانية',
    subscribeNoTrial: 'اشترك',
    disclosure:
      'يتم الدفع عبر حساب Apple ID الخاص بك. يتجدد الاشتراك تلقائيًا كل شهر ما لم يُلغَ قبل 24 ساعة على الأقل من نهاية الفترة الحالية. يمكنك الإلغاء في أي وقت من إعدادات Apple ID.',
    restore: 'استعادة المشتريات',
    restored: 'اشتراكك مفعّل من جديد ✓',
    nothingToRestore: 'لم يتم العثور على اشتراك مفعّل.',
    error: 'لم تتم عملية الشراء. يُرجى المحاولة مرة أخرى.',
    unavailable: 'تعذّر تحميل الاشتراك الآن. يُرجى المحاولة لاحقًا.',
    terms: 'شروط الاستخدام',
    privacy: 'الخصوصية',
    manage: 'إدارة الاشتراك',
  },
  tr: {
    trial: '{days} gün ücretsiz dene',
    then: 'sonra ayda {price}',
    subscribe: 'Ücretsiz denemeyi başlat',
    subscribeNoTrial: 'Abone ol',
    disclosure:
      'Ödeme Apple kimliğinden alınır. Abonelik, mevcut dönemin bitiminden en az 24 saat önce iptal edilmezse her ay otomatik olarak yenilenir. Apple kimliği ayarlarından istediğin zaman iptal edebilirsin.',
    restore: 'Satın alımları geri yükle',
    restored: 'Aboneliğin yeniden aktif ✓',
    nothingToRestore: 'Aktif abonelik bulunamadı.',
    error: 'Satın alma gerçekleşmedi. Lütfen tekrar dene.',
    unavailable: 'Abonelik şu anda yüklenemiyor. Lütfen daha sonra tekrar dene.',
    terms: 'Kullanım Koşulları',
    privacy: 'Gizlilik',
    manage: 'Aboneliği yönet',
  },
  fa: {
    trial: '{days} روز رایگان امتحان کن',
    then: 'سپس ماهانه {price}',
    subscribe: 'شروع دورهٔ رایگان',
    subscribeNoTrial: 'اشتراک',
    disclosure:
      'پرداخت از طریق Apple ID تو انجام می‌شود. اشتراک هر ماه به‌طور خودکار تمدید می‌شود، مگر اینکه دست‌کم ۲۴ ساعت پیش از پایان دورهٔ جاری لغو شود. هر زمان می‌توانی از تنظیمات Apple ID لغو کنی.',
    restore: 'بازیابی خریدها',
    restored: 'اشتراکت دوباره فعال است ✓',
    nothingToRestore: 'اشتراک فعالی پیدا نشد.',
    error: 'خرید انجام نشد. لطفاً دوباره تلاش کن.',
    unavailable: 'اشتراک الان بارگیری نمی‌شود. لطفاً بعداً دوباره تلاش کن.',
    terms: 'شرایط استفاده',
    privacy: 'حریم خصوصی',
    manage: 'مدیریت اشتراک',
  },
  uk: {
    trial: 'Спробуй {days} днів безкоштовно',
    then: 'потім {price} на місяць',
    subscribe: 'Почати безкоштовний період',
    subscribeNoTrial: 'Підписатися',
    disclosure:
      'Оплата стягується з твого Apple ID. Підписка автоматично поновлюється щомісяця, якщо її не скасувати щонайменше за 24 години до кінця поточного періоду. Скасувати можна будь-коли в налаштуваннях Apple ID.',
    restore: 'Відновити покупки',
    restored: 'Твоя підписка знову активна ✓',
    nothingToRestore: 'Активну підписку не знайдено.',
    error: 'Покупка не вдалася. Спробуй ще раз.',
    unavailable: 'Зараз не вдається завантажити підписку. Спробуй пізніше.',
    terms: 'Умови використання',
    privacy: 'Конфіденційність',
    manage: 'Керувати підпискою',
  },
};

/** Apple's standard licence agreement — the "Terms of Use (EULA)" link App
 * Review asks for on a subscription screen when the app has no own EULA. */
export const APPLE_EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
