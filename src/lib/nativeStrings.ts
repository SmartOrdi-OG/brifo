import type { Lang } from '../context/translations';

/** Paywall note for the iOS build while it sells nothing in-app (see
 * sellsNothingInApp). Kept here rather than in the six locale files: it is
 * temporary and goes away once in-app purchase lands. */
export const NATIVE_PAYWALL_NOTE: Record<Lang, string> = {
  ar: "الاشتراك غير متاح داخل تطبيق iOS بعد. باقي التطبيق يعمل كاملًا ومجانًا، وإن كان لديك اشتراك مفعّل فهو يعمل هنا أيضًا بعد تسجيل الدخول.",
  de: "Das Abo ist in der iOS-App noch nicht verfügbar. Der Rest der App funktioniert vollständig und kostenlos – ein bestehendes Abo gilt hier auch, sobald du angemeldet bist.",
  tr: "Abonelik iOS uygulamasında henüz mevcut değil. Uygulamanın geri kalanı tamamen ve ücretsiz çalışır; mevcut bir aboneliğin varsa giriş yaptığında burada da geçerlidir.",
  fa: "اشتراک هنوز در برنامهٔ iOS در دسترس نیست. بقیهٔ برنامه کامل و رایگان کار می‌کند و اگر اشتراک فعالی داری، پس از ورود اینجا هم معتبر است.",
  en: "The subscription isn't available in the iOS app yet. The rest of the app works fully and for free — an existing subscription also works here once you're signed in.",
  uk: "Підписка поки що недоступна в застосунку для iOS. Решта застосунку працює повністю й безкоштовно, а наявна підписка діє й тут після входу.",
};
