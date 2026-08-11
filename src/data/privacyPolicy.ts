/** Draft Datenschutzerklärung / سياسة الخصوصية — describes what Brifo actually
 * does technically (see DataContext, src/server/{auth,backup,consent,stripe,
 * push,reply}.ts, api/{analyze,reply}.*). This is NOT a substitute for legal
 * review: a lawyer should sign off before this is relied on for a paying
 * product. v5 corrects v4, which was written before account sign-in, cloud
 * backup, Stripe billing, the reply-drafting AI call, and the server-side
 * consent record existed — v4 incorrectly claimed no account/no server copy
 * of data. All placeholders (company details, hosting region) are filled in
 * — but the "servers within the EU" claim in section 5 is only true once the
 * Vercel project's Function Region is actually pinned to an EU region
 * (Project Settings → Functions), which is a separate step from this text. */

export interface PolicySection {
  heading: string;
  body: string;
}

export const PRIVACY_POLICY_VERSION = 5;
export const PRIVACY_POLICY_LAST_UPDATED = '2026-08-11';

export const privacyPolicyDe: PolicySection[] = [
  {
    heading: '1. Verantwortlicher',
    body: 'Smartordi OG, Steingasse 6A, Linz, Österreich\nE-Mail: team@smartordi.eu\nFirmenbuchnummer: FN 675586 i\n\nVerantwortlich für die Verarbeitung personenbezogener Daten im Rahmen der App "Brifo" im Sinne der Datenschutz-Grundverordnung (DSGVO) ist die oben genannte Gesellschaft.',
  },
  {
    heading: '2. Allgemeines',
    body: 'Brifo hilft arabischsprachigen Eltern in Österreich, Schulbriefe zu verstehen, Termine zu verwalten und Antworten auf Deutsch zu verfassen. Diese Erklärung beschreibt, welche Daten die App verarbeitet, wofür, und welche Rechte Sie als betroffene Person haben.\n\nUm Brifo zu nutzen, ist ein Benutzerkonto (E-Mail-Adresse und Passwort) erforderlich, damit Ihre Daten geräteübergreifend sicher zugänglich sind. Ihre Familien- und Nutzungsdaten werden sowohl lokal auf Ihrem Gerät als auch — als Sicherungskopie, verknüpft mit Ihrem Konto — auf unserem Server gespeichert (siehe Punkt 3 und 4).',
  },
  {
    heading: '3. Welche Daten wir verarbeiten',
    body: 'a) Kontodaten: Ihre E-Mail-Adresse und Ihr Passwort, verwaltet über unseren Authentifizierungs-Dienstleister Supabase (siehe Punkt 5). Wir selbst sehen Ihr Passwort nie im Klartext. Zusätzlich speichern wir einen Nachweis Ihrer Zustimmung zu dieser Datenschutzerklärung (Version und Zeitpunkt).\n\nb) Familienprofile: Name, Rolle (Kind/Erwachsene:r), Schulstufe und Schulname, die Sie selbst eingeben.\n\nc) Fotos von Schulbriefen: Wenn Sie einen Brief fotografieren, wird das Bild einmalig zur Analyse an unseren KI-Dienstleister Anthropic (siehe Punkt 5) übermittelt. Das Bild selbst wird weder von uns noch von Anthropic dauerhaft gespeichert — nur die daraus erstellte Textzusammenfassung (Betreff, Fristen, geforderte Zahlungen) wird gespeichert.\n\nd) Antwortentwürfe: Wenn Sie sich eine Antwort auf einen Schulbrief formulieren lassen, übermitteln wir die dafür nötigen Angaben (z. B. Name und Schulstufe des Kindes sowie von Ihnen eingegebene Freitext-Hinweise) an Anthropic, um den Antworttext zu erstellen.\n\ne) Termine, Zahlungen, Aufgaben und Ihre Bewertung/Ihr Feedback zur App. Ihre Bewertung/Ihr Feedback wird zusätzlich anonym (ohne Verknüpfung zu Ihrem Konto oder Gerät) gespeichert, damit wir Rückmeldungen zur App auswerten können.\n\nf) Zahlungsdaten: Bei Abschluss eines Abonnements verarbeitet unser Zahlungsdienstleister Stripe (siehe Punkt 5) Ihre E-Mail-Adresse sowie Ihren Abonnement- und Zahlungsstatus. Zahlungsdaten (z. B. Kreditkartennummer) sehen wir selbst nie — diese werden ausschließlich von Stripe verarbeitet.\n\ng) Push-Benachrichtigungen (optional, nur wenn Sie diese aktivieren): Ihr Gerät erhält eine zufällige Geräte-ID sowie eine Push-Berechtigung (Endpoint-URL und Verschlüsselungsschlüssel Ihres Browsers). Diese sowie die Titel und Daten Ihrer bevorstehenden Termine werden auf unserem Server gespeichert, ausschließlich um Ihnen Erinnerungen zuzustellen.\n\nh) Technische Daten: Spracheinstellung (Arabisch/Deutsch) und Anzeigemodus (hell/dunkel) — lokal gespeichert.\n\nDie unter b), c) und e) genannten Daten werden lokal auf Ihrem Gerät gespeichert und zusätzlich, verknüpft mit Ihrem Konto, als Sicherungskopie auf unserem Server (siehe Punkt 4).',
  },
  {
    heading: '4. Speicherort und Speicherdauer',
    body: 'Ihre Familienprofile, Briefzusammenfassungen, Termine, Zahlungen, Aufgaben und Bewertungen werden lokal auf Ihrem Gerät sowie als Sicherungskopie auf unserem Server gespeichert, verknüpft mit Ihrem Benutzerkonto — damit Ihre Daten erhalten bleiben, wenn Sie sich auf einem neuen Gerät anmelden. Sie können einzelne Einträge, ein Profil, oder alle Daten jederzeit über die Einstellungen löschen; dies wird auch auf unserem Server nachvollzogen. Möchten Sie zusätzlich Ihr Benutzerkonto vollständig löschen lassen, kontaktieren Sie uns unter der in Punkt 1 genannten E-Mail-Adresse — wir löschen dann auch die serverseitige Sicherungskopie, Ihre Kontodaten und Ihren Zahlungsverlauf, soweit keine gesetzliche Aufbewahrungspflicht (z. B. für Rechnungen) entgegensteht.\n\nDaten für Push-Benachrichtigungen (Geräte-ID, Push-Berechtigung, Termintitel/-daten) werden gespeichert, solange die Erinnerungsfunktion aktiviert ist, und automatisch gelöscht, wenn Sie diese deaktivieren oder Ihre Push-Berechtigung widerrufen.',
  },
  {
    heading: '5. Weitergabe an Dritte (Auftragsverarbeiter)',
    body: 'Anthropic PBC (USA): verarbeitet fotografierte Schulbriefe zur Texterkennung/Analyse sowie die in Punkt 3d genannten Angaben zur Erstellung von Antwortentwürfen. Es gilt eine Datenübermittlung in ein Drittland (USA); wir stellen sicher, dass hierfür geeignete Garantien (z. B. Standardvertragsklauseln) bestehen.\n\nSupabase Inc.: Authentifizierungs-Dienstleister für Ihr Benutzerkonto (E-Mail, Passwort, Anmeldevorgang).\n\nStripe: Zahlungsdienstleister für Abonnements (siehe Punkt 3f).\n\nVercel Inc.: Hosting der App und Speicherung der in Punkt 3 und 4 genannten Server-Daten (Kontodaten, Sicherungskopie, Push-Benachrichtigungen), auf Servern innerhalb der Europäischen Union.\n\nWir verkaufen keine Daten an Dritte und nutzen keine Werbe- oder Tracking-Dienste.',
  },
  {
    heading: '6. Daten von Kindern',
    body: 'Brifo richtet sich an Erziehungsberechtigte, die Angaben zu ihren Kindern (Name, Schulstufe) selbst eingeben, um Schulbriefe zu organisieren. Es liegt in der Verantwortung der Erziehungsberechtigten, diese Angaben einzugeben und zu verwalten. Die Angaben werden wie in Punkt 3 und 4 beschrieben gespeichert.',
  },
  {
    heading: '7. Ihre Rechte',
    body: 'Sie haben nach der DSGVO das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten sowie auf Datenübertragbarkeit und Widerspruch. Für lokal gespeicherte Daten können Sie diese Rechte direkt in der App ausüben (Ansehen, Bearbeiten, Löschen, Export als Datei über "Nutzungsdaten sichern"). Für Daten auf unserem Server (Konto, Sicherungskopie, Zahlungsdaten, Push-Benachrichtigungen), einschließlich der vollständigen Löschung Ihres Kontos, kontaktieren Sie uns unter der in Punkt 1 genannten E-Mail-Adresse.\n\nSie haben zudem das Recht, sich bei der österreichischen Datenschutzbehörde (dsb.gv.at) zu beschweren.',
  },
  {
    heading: '8. Kontakt',
    body: 'Bei Fragen zum Datenschutz erreichen Sie uns unter: team@smartordi.eu',
  },
];

export const privacyPolicyAr: PolicySection[] = [
  {
    heading: '١. المسؤول عن حماية البيانات',
    body: 'Smartordi OG، Steingasse 6A، Linz، النمسا\nالبريد الإلكتروني: team@smartordi.eu\nرقم السجل التجاري: FN 675586 i\n\nالشركة المذكورة أعلاه هي المسؤولة عن معالجة البيانات الشخصية ضمن تطبيق "Brifo" وفق اللائحة الأوروبية العامة لحماية البيانات (GDPR).',
  },
  {
    heading: '٢. عموميات',
    body: 'Brifo بيساعد الأهل الناطقين بالعربي بالنمسا يفهموا رسائل المدرسة، وينظّموا المواعيد، ويكتبوا ردود بالألماني. هاي الوثيقة بتوضح شو البيانات يلي التطبيق بيعالجها، لأي هدف، وشو حقوقك كصاحب/ة البيانات.\n\nلاستخدام Brifo لازم تسوّي حساب (إيميل وكلمة سر)، حتى بياناتك تضل متاحة إلك بأمان من أي جهاز. بياناتك (العائلة، الاستخدام) بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية مرتبطة بحسابك على سيرفرنا (شوفي البند ٣ و٤).',
  },
  {
    heading: '٣. شو البيانات يلي منعالجها',
    body: 'أ) بيانات الحساب: إيميلك وكلمة السر، يلي بندير معالجتهم عبر مزوّد خدمة تسجيل الدخول Supabase (شوفي البند ٥). إحنا نفسنا ما منشوف كلمة سرّك أبداً بشكلها الصريح. كمان منخزّن إثبات موافقتك على سياسة الخصوصية هاي (رقم النسخة والوقت).\n\nب) ملفات أفراد العائلة: الاسم، النوع (طفل/بالغ)، الصف واسم المدرسة، يلي بتدخليهم إنتِ بنفسك.\n\nج) صور رسائل المدرسة: لما تصوّري رسالة، الصورة بتنبعت مرة وحدة لمزوّد الذكاء الاصطناعي Anthropic لتحليلها (شوفي البند ٥). الصورة نفسها ما بتتخزن، لا عندنا ولا عند Anthropic — بس الملخّص النصي (الموضوع، المواعيد، المبالغ المطلوبة) هو يلي بيتخزن.\n\nد) مسودات الردود: لما تطلبي من التطبيق يساعدك تكتبي رد على رسالة مدرسة، منبعت المعلومات اللازمة (متل اسم الطفل وصفّه، وأي ملاحظات نصية بتكتبيها إنتِ) لـAnthropic لتوليد نص الرد.\n\nه) المواعيد والمدفوعات والمهام وتقييمك/ملاحظاتك عن التطبيق. تقييمك/ملاحظاتك بتتخزن كمان بشكل منفصل ومجهول الهوية (بدون ربط بحسابك أو جهازك)، حتى نقدر نطّلع عليها ونستفيد منها.\n\nو) بيانات الدفع: لما تشتركي بخطة مدفوعة، مزوّد الدفع Stripe (شوفي البند ٥) بيعالج إيميلك وحالة اشتراكك ودفعك. بيانات الدفع نفسها (متل رقم البطاقة) إحنا ما منشوفها أبداً — Stripe لحاله يلي بيعالجها.\n\nز) إشعارات التذكير (اختيارية، بس إذا فعّلتيها): جهازك بياخد معرّف عشوائي وصلاحية إشعارات من المتصفح. هاد المعرّف مع عناوين وتواريخ مواعيدك القادمة بيتخزنوا على سيرفرنا، بس لإرسال التذكيرات إلك.\n\nح) بيانات تقنية: إعداد اللغة (عربي/ألماني) والمظهر (فاتح/داكن) — محلياً بس.\n\nالبيانات المذكورة بالبنود ب) وج) وه) بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية على سيرفرنا مرتبطة بحسابك (شوفي البند ٤).',
  },
  {
    heading: '٤. مكان وحفظ البيانات',
    body: 'ملفات العائلة وملخصات الرسائل والمواعيد والمدفوعات والمهام والتقييمات بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية على سيرفرنا مرتبطة بحسابك — حتى بياناتك ما تضيع لو سجّلتي دخول من جهاز جديد. فيك تحذفي أي عنصر، أو ملف كامل، أو كل بياناتك بأي وقت من الإعدادات، وهاد بينعكس كمان على النسخة عندنا بالسيرفر. إذا بدك كمان تحذفي حسابك بالكامل، تواصلي معنا عبر البريد الإلكتروني المذكور بالبند ١ — وقتها منحذف كمان النسخة الاحتياطية عندنا وبيانات حسابك وسجل دفعاتك، إلا إذا كان في التزام قانوني يفرض الاحتفاظ فيها (متل الفواتير).\n\nبيانات إشعارات التذكير (المعرّف، صلاحية الإشعارات، عناوين/تواريخ المواعيد) بتتخزن عندنا طول ما ميزة التذكير مفعّلة، وبتنمسح تلقائياً لما توقفيها.',
  },
  {
    heading: '٥. مشاركة البيانات مع أطراف تالتة',
    body: 'Anthropic PBC (أمريكا): بتعالج صور رسائل المدرسة لتحليلها، وكمان المعلومات المذكورة بالبند ٣-د لتوليد مسودات الردود. هاد نقل بيانات لدولة خارج الاتحاد الأوروبي؛ منتأكد إنه في ضمانات مناسبة إلها (متل بنود تعاقدية معيارية).\n\nSupabase Inc.: مزوّد خدمة تسجيل الدخول لحسابك (الإيميل، كلمة السر، عملية الدخول).\n\nStripe: مزوّد خدمة الدفع للاشتراكات (شوفي البند ٣-و).\n\nVercel Inc.: استضافة التطبيق وتخزين بيانات السيرفر المذكورة بالبند ٣ و٤ (بيانات الحساب، النسخة الاحتياطية، إشعارات التذكير)، على سيرفرات داخل الاتحاد الأوروبي.\n\nما منبيع أي بيانات لأي جهة، وما منستخدم أدوات إعلانات أو تتبّع.',
  },
  {
    heading: '٦. بيانات الأطفال',
    body: 'Brifo موجّه للأهل/الأوصياء يلي بيدخلوا معلومات عن أطفالهم (الاسم، الصف) بأنفسهم لتنظيم رسائل المدرسة. المسؤولية بإدخال وإدارة هالمعلومات على عاتق الأهل/الوصي. المعلومات بتتخزن متل ما موضّح بالبند ٣ و٤.',
  },
  {
    heading: '٧. حقوقك',
    body: 'حسب GDPR، إلك الحق بالاطلاع على بياناتك وتصحيحها وحذفها وتقييد معالجتها، وكمان حق نقل البيانات والاعتراض. للبيانات المحلية على جهازك، فيك تمارسي هالحقوق مباشرة من التطبيق (اطلاع، تعديل، حذف، تصدير كملف عبر "نسخة احتياطية"). للبيانات يلي عندنا بالسيرفر (الحساب، النسخة الاحتياطية، بيانات الدفع، إشعارات التذكير)، بما فيها حذف حسابك بالكامل، تواصلي معنا عبر البريد الإلكتروني المذكور بالبند ١.\n\nكمان إلك الحق تقدمي شكوى لهيئة حماية البيانات النمساوية (dsb.gv.at).',
  },
  {
    heading: '٨. تواصل معنا',
    body: 'لأي سؤال عن الخصوصية، تواصلي معنا عبر: team@smartordi.eu',
  },
];
