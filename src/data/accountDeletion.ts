/** The public account-deletion page.
 *
 * Google Play requires an app that creates accounts to publish a URL where
 * deletion can be requested — reachable by someone who has already uninstalled
 * the app, so it cannot live behind sign-in, and it is listed in
 * src/lib/gateFreePaths.ts for that reason. The URL also goes in the Play
 * Console listing under Data safety.
 *
 * The text lives here rather than in the translation table because that is
 * what the other two legal pages do (impressum.ts, privacyPolicy.ts): these
 * are documents, read start to finish, not interface strings reused across
 * screens.
 *
 * It describes what the app does and nothing more. Anything about legal
 * grounds or retention periods belongs in the privacy policy, which is
 * reviewed as a whole — a second place making its own claims is a second
 * place to keep in step, and the two disagreeing would be worse than either
 * alone. */
import type { PolicySection } from './privacyPolicy';

export const ACCOUNT_DELETION_LAST_UPDATED = '2026-10-27';

/** Where a request goes when the app is already gone. Same address as the
 * Impressum, so there is one inbox to watch rather than two. */
export const DELETION_CONTACT_EMAIL = 'team@smartordi.eu';

export const accountDeletionDe: PolicySection[] = [
  {
    heading: 'Konto in der App löschen',
    body: 'Öffne Brifo und gehe zu Einstellungen → Konto löschen. Tippe auf „Konto löschen“ und danach noch einmal zur Bestätigung.\n\nDas geschieht sofort und lässt sich nicht rückgängig machen.',
  },
  {
    heading: 'Was gelöscht wird',
    body: 'Dein Konto und deine E-Mail-Adresse.\n\nAlle Kinder, die du angelegt hast, samt Namen und Schulen.\n\nAlle Briefe mit ihren Fotos und Übersetzungen.\n\nAlle Termine und Aufgaben.\n\nDie Sicherung deiner Daten am Server.\n\nDanach ist deine E-Mail-Adresse nicht mehr bei uns registriert. Du kannst dich jederzeit neu anmelden und beginnst dann bei null.',
  },
  {
    heading: 'Wenn du ein laufendes Abo hast',
    body: 'Kündige es zuerst in der App unter Einstellungen → Abo verwalten. Solange ein Abo läuft, wird die Löschung abgelehnt — sonst würdest du weiter bezahlen, ohne dass wir die Zahlung noch dir zuordnen oder beenden könnten.',
  },
  {
    heading: 'Wenn du die App nicht mehr hast',
    body: `Schreib uns an ${DELETION_CONTACT_EMAIL} von der E-Mail-Adresse, mit der du dich angemeldet hast. Wir löschen das Konto und melden uns, sobald es erledigt ist.`,
  },
  {
    heading: 'Weitere Informationen',
    body: 'Welche Daten Brifo überhaupt verarbeitet und auf welcher Grundlage, steht in der Datenschutzerklärung in der App unter Einstellungen → Datenschutz.',
  },
];

export const accountDeletionAr: PolicySection[] = [
  {
    heading: 'احذف حسابك من داخل التطبيق',
    body: 'افتح بريفو وروح على الإعدادات ← حذف الحساب. اضغط «احذف حسابي»، وبعدها اضغط مرة تانية للتأكيد.\n\nبينحذف فوراً، وما في رجعة.',
  },
  {
    heading: 'شو بينحذف',
    body: 'حسابك وعنوان إيميلك.\n\nكل الأطفال اللي ضفتهم، بأسمائهم ومدارسهم.\n\nكل الرسائل مع صورها وترجماتها.\n\nكل المواعيد والمهام.\n\nالنسخة المحفوظة من بياناتك عالسيرفر.\n\nبعدها إيميلك ما بيضل مسجّل عنا. فيك تفتح حساب جديد وقت ما بدك، بس بتبلّش من صفر.',
  },
  {
    heading: 'إذا عندك اشتراك شغّال',
    body: 'ألغيه أول من التطبيق: الإعدادات ← إدارة الاشتراك. طالما في اشتراك فعّال، الحذف بينرفض — لأنك بتضل تدفع ونحنا ما بيضل عنا شي يربط الدفعة فيك ولا يوقّفها.',
  },
  {
    heading: 'إذا ما عاد عندك التطبيق',
    body: `ابعتلنا على ${DELETION_CONTACT_EMAIL} من نفس الإيميل اللي سجّلت فيه. منحذف الحساب ومنردّ عليك لما نخلّص.`,
  },
  {
    heading: 'معلومات أكتر',
    body: 'شو البيانات اللي بريفو بيستعملها وعلى أي أساس — كل هاد موجود بسياسة الخصوصية جوّا التطبيق: الإعدادات ← الخصوصية.',
  },
];

export const accountDeletionTr: PolicySection[] = [
  {
    heading: 'Hesabını uygulamadan sil',
    body: 'Brifo’yu aç ve Ayarlar → Hesabı sil bölümüne git. „Hesabımı sil“e dokun, sonra onaylamak için bir kez daha dokun.\n\nBu işlem hemen gerçekleşir ve geri alınamaz.',
  },
  {
    heading: 'Neler silinir',
    body: 'Hesabın ve e-posta adresin.\n\nEklediğin bütün çocuklar, adları ve okullarıyla birlikte.\n\nBütün mektuplar, fotoğrafları ve çevirileriyle.\n\nBütün randevular ve görevler.\n\nSunucudaki yedeğin.\n\nArdından e-posta adresin artık bizde kayıtlı olmaz. İstediğin zaman yeniden kaydolabilirsin ama sıfırdan başlarsın.',
  },
  {
    heading: 'Devam eden bir aboneliğin varsa',
    body: 'Önce uygulamadan iptal et: Ayarlar → Aboneliği yönet. Abonelik sürerken silme reddedilir — aksi hâlde ödemeye devam ederdin ve biz ödemeyi ne sana bağlayabilir ne de durdurabilirdik.',
  },
  {
    heading: 'Uygulama artık sende yoksa',
    body: `Kaydolurken kullandığın e-posta adresinden ${DELETION_CONTACT_EMAIL} adresine yaz. Hesabı siler ve tamamlandığında sana haber veririz.`,
  },
  {
    heading: 'Daha fazla bilgi',
    body: 'Brifo’nun hangi verileri hangi dayanakla işlediği, uygulamadaki gizlilik politikasında yazılıdır: Ayarlar → Gizlilik.',
  },
];

export const accountDeletionFa: PolicySection[] = [
  {
    heading: 'حساب خود را در برنامه حذف کنید',
    body: 'بریفو را باز کنید و به تنظیمات ← حذف حساب بروید. روی «حذف حساب من» بزنید و بعد برای تأیید یک بار دیگر بزنید.\n\nاین کار بلافاصله انجام می‌شود و برگشت‌پذیر نیست.',
  },
  {
    heading: 'چه چیزهایی حذف می‌شود',
    body: 'حساب و نشانی ایمیل شما.\n\nهمهٔ کودکانی که اضافه کرده‌اید، با نام و مدرسه‌شان.\n\nهمهٔ نامه‌ها با عکس‌ها و ترجمه‌هایشان.\n\nهمهٔ قرارها و کارها.\n\nنسخهٔ پشتیبان داده‌هایتان روی سرور.\n\nپس از آن ایمیل شما دیگر نزد ما ثبت نیست. هر وقت بخواهید می‌توانید دوباره ثبت‌نام کنید، اما از صفر شروع می‌کنید.',
  },
  {
    heading: 'اگر اشتراک فعال دارید',
    body: 'ابتدا آن را در برنامه لغو کنید: تنظیمات ← مدیریت اشتراک. تا وقتی اشتراک فعال است، حذف رد می‌شود — وگرنه همچنان پرداخت می‌کردید و ما دیگر نمی‌توانستیم پرداخت را به شما ربط دهیم یا متوقفش کنیم.',
  },
  {
    heading: 'اگر دیگر برنامه را ندارید',
    body: `از همان ایمیلی که با آن ثبت‌نام کرده‌اید به ${DELETION_CONTACT_EMAIL} بنویسید. حساب را حذف می‌کنیم و پس از انجام به شما خبر می‌دهیم.`,
  },
  {
    heading: 'اطلاعات بیشتر',
    body: 'اینکه بریفو چه داده‌هایی و بر چه مبنایی پردازش می‌کند، در سیاست حریم خصوصی داخل برنامه آمده است: تنظیمات ← حریم خصوصی.',
  },
];

export const accountDeletionEn: PolicySection[] = [
  {
    heading: 'Delete your account in the app',
    body: 'Open Brifo and go to Settings → Delete account. Tap “Delete my account”, then tap again to confirm.\n\nThis happens immediately and cannot be undone.',
  },
  {
    heading: 'What is deleted',
    body: 'Your account and your email address.\n\nEvery child you added, with their names and schools.\n\nEvery letter, with its photos and translations.\n\nEvery appointment and task.\n\nThe backup of your data on the server.\n\nAfterwards your email address is no longer registered with us. You can sign up again whenever you like, but you start from scratch.',
  },
  {
    heading: 'If you have an active subscription',
    body: 'Cancel it first in the app, under Settings → Manage subscription. While a subscription is running, deletion is refused — otherwise you would keep paying with nothing left on our side able to connect the payment to you or stop it.',
  },
  {
    heading: 'If you no longer have the app',
    body: `Write to ${DELETION_CONTACT_EMAIL} from the email address you signed up with. We will delete the account and let you know once it is done.`,
  },
  {
    heading: 'More information',
    body: 'Which data Brifo processes, and on what basis, is set out in the privacy policy inside the app: Settings → Privacy.',
  },
];

export const accountDeletionUk: PolicySection[] = [
  {
    heading: 'Видалити акаунт у застосунку',
    body: 'Відкрийте Brifo та перейдіть до Налаштування → Видалити акаунт. Натисніть «Видалити мій акаунт», а потім ще раз для підтвердження.\n\nЦе відбувається одразу й не може бути скасовано.',
  },
  {
    heading: 'Що буде видалено',
    body: 'Ваш акаунт і вашу електронну пошту.\n\nУсіх дітей, яких ви додали, з іменами та школами.\n\nУсі листи з їхніми фотографіями та перекладами.\n\nУсі зустрічі та завдання.\n\nРезервну копію ваших даних на сервері.\n\nПісля цього ваша пошта більше не зареєстрована в нас. Зареєструватися можна будь-коли, але все почнеться з нуля.',
  },
  {
    heading: 'Якщо у вас активна підписка',
    body: 'Спершу скасуйте її в застосунку: Налаштування → Керувати підпискою. Поки підписка діє, видалення відхиляється — інакше ви продовжували б платити, а в нас не лишилося б нічого, що пов’язує платіж із вами або дозволяє його зупинити.',
  },
  {
    heading: 'Якщо застосунку у вас уже немає',
    body: `Напишіть на ${DELETION_CONTACT_EMAIL} з тієї електронної адреси, з якою ви реєструвалися. Ми видалимо акаунт і повідомимо, коли це буде зроблено.`,
  },
  {
    heading: 'Докладніше',
    body: 'Які дані Brifo обробляє та на якій підставі — викладено в політиці конфіденційності в застосунку: Налаштування → Конфіденційність.',
  },
];
