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

export const privacyPolicyTr: PolicySection[] = [
  {
    heading: '1. Veri sorumlusu',
    body: 'Smartordi OG, Steingasse 6A, Linz, Avusturya\nE-posta: team@smartordi.eu\nTicaret sicil numarası: FN 675586 i\n\n"Brifo" uygulaması kapsamında kişisel verilerin işlenmesinden Genel Veri Koruma Yönetmeliği (GDPR) anlamında yukarıda belirtilen şirket sorumludur.',
  },
  {
    heading: '2. Genel bilgiler',
    body: 'Brifo, Avusturya\'daki Arapça konuşan ebeveynlerin okul mektuplarını anlamalarına, randevuları yönetmelerine ve Almanca cevap yazmalarına yardımcı olur. Bu metin, uygulamanın hangi verileri, hangi amaçla işlediğini ve ilgili kişi olarak haklarınızı açıklar.\n\nBrifo\'yu kullanmak için, verilerinizin cihazlar arasında güvenle erişilebilir olması amacıyla bir kullanıcı hesabı (e-posta adresi ve şifre) gereklidir. Aile ve kullanım verileriniz hem cihazınızda yerel olarak hem de — hesabınızla ilişkilendirilmiş bir yedek kopya olarak — sunucumuzda saklanır (bkz. madde 3 ve 4).',
  },
  {
    heading: '3. Hangi verileri işliyoruz',
    body: 'a) Hesap verileri: kimlik doğrulama sağlayıcımız Supabase üzerinden yönetilen e-posta adresiniz ve şifreniz (bkz. madde 5). Şifrenizi biz hiçbir zaman açık metin olarak görmeyiz. Ayrıca bu gizlilik politikasına onayınızın kaydını (sürüm ve zaman) saklarız.\n\nb) Aile profilleri: kendinizin girdiği ad, rol (çocuk/yetişkin), sınıf düzeyi ve okul adı.\n\nc) Okul mektuplarının fotoğrafları: bir mektubu fotoğrafladığınızda, görsel analiz için bir kez yapay zeka sağlayıcımız Anthropic\'e gönderilir (bkz. madde 5). Görselin kendisi ne bizde ne de Anthropic\'te kalıcı olarak saklanır — yalnızca oluşturulan metin özeti (konu, son tarihler, istenen ödemeler) saklanır.\n\nd) Cevap taslakları: bir okul mektubuna cevap oluşturmanızı istediğinizde, bunun için gerekli bilgileri (örn. çocuğun adı ve sınıf düzeyi ile girdiğiniz serbest metin notları) cevap metnini oluşturmak üzere Anthropic\'e iletiriz.\n\ne) Randevular, ödemeler, görevler ve uygulamaya ilişkin değerlendirmeniz/geri bildiriminiz. Değerlendirmeniz/geri bildiriminiz ayrıca hesabınız veya cihazınızla ilişkilendirilmeden anonim olarak da saklanır, böylece uygulamaya dair geri bildirimleri değerlendirebiliriz.\n\nf) Ödeme verileri: bir abonelik satın aldığınızda, ödeme sağlayıcımız Stripe (bkz. madde 5) e-posta adresinizi ve abonelik/ödeme durumunuzu işler. Ödeme bilgilerini (örn. kredi kartı numarası) biz hiçbir zaman görmeyiz — bunlar yalnızca Stripe tarafından işlenir.\n\ng) Push bildirimleri (isteğe bağlı, yalnızca etkinleştirirseniz): cihazınıza rastgele bir cihaz kimliği ve bir push izni (tarayıcınızın uç nokta URL\'si ve şifreleme anahtarları) atanır. Bunlar ile yaklaşan randevularınızın başlığı ve tarihleri, size yalnızca hatırlatma göndermek amacıyla sunucumuzda saklanır.\n\nh) Teknik veriler: dil ayarı (Arapça/Almanca/Türkçe) ve görünüm modu (açık/koyu) — yerel olarak saklanır.\n\nb), c) ve e) maddelerinde belirtilen veriler hem cihazınızda yerel olarak hem de hesabınızla ilişkilendirilmiş bir yedek kopya olarak sunucumuzda saklanır (bkz. madde 4).',
  },
  {
    heading: '4. Saklama yeri ve süresi',
    body: 'Aile profilleriniz, mektup özetleriniz, randevularınız, ödemeleriniz, görevleriniz ve değerlendirmeleriniz hem cihazınızda yerel olarak hem de kullanıcı hesabınızla ilişkilendirilmiş bir yedek kopya olarak sunucumuzda saklanır — böylece yeni bir cihazda oturum açtığınızda verileriniz korunur. Tek tek kayıtları, bir profili veya tüm verilerinizi istediğiniz zaman ayarlar üzerinden silebilirsiniz; bu, sunucumuzdaki kopyaya da yansıtılır. Kullanıcı hesabınızın tamamen silinmesini isterseniz, madde 1\'de belirtilen e-posta adresinden bizimle iletişime geçin — bu durumda, yasal bir saklama yükümlülüğü (örn. faturalar için) engel olmadığı sürece sunucudaki yedek kopyanızı, hesap verilerinizi ve ödeme geçmişinizi de sileriz.\n\nPush bildirimleri için veriler (cihaz kimliği, push izni, randevu başlıkları/tarihleri), hatırlatma özelliği etkin olduğu sürece saklanır ve bunu devre dışı bıraktığınızda veya push iznini iptal ettiğinizde otomatik olarak silinir.',
  },
  {
    heading: '5. Üçüncü taraflarla paylaşım (veri işleyenler)',
    body: 'Anthropic PBC (ABD): fotoğraflanan okul mektuplarını metin tanıma/analiz için ve madde 3d\'de belirtilen bilgileri cevap taslakları oluşturmak için işler. Bu, bir üçüncü ülkeye (ABD) veri aktarımı anlamına gelir; bunun için uygun güvencelerin (örn. standart sözleşme maddeleri) bulunmasını sağlarız.\n\nSupabase Inc.: kullanıcı hesabınız için kimlik doğrulama sağlayıcısı (e-posta, şifre, oturum açma işlemi).\n\nStripe: abonelikler için ödeme sağlayıcısı (bkz. madde 3f).\n\nVercel Inc.: uygulamanın barındırılması ve madde 3 ile 4\'te belirtilen sunucu verilerinin (hesap verileri, yedek kopya, push bildirimleri) Avrupa Birliği içindeki sunucularda saklanması.\n\nVerileri üçüncü taraflara satmıyoruz ve reklam veya izleme hizmetleri kullanmıyoruz.',
  },
  {
    heading: '6. Çocuklara ait veriler',
    body: 'Brifo, okul mektuplarını düzenlemek için çocuklarına ait bilgileri (ad, sınıf düzeyi) kendileri giren ebeveynlere/velilere yöneliktir. Bu bilgilerin girilmesi ve yönetilmesi sorumluluğu ebeveynlere/velilere aittir. Bilgiler madde 3 ve 4\'te açıklandığı şekilde saklanır.',
  },
  {
    heading: '7. Haklarınız',
    body: 'GDPR uyarınca, verilerinizin işlenmesine ilişkin bilgi alma, düzeltme, silme ve kısıtlama hakkına, ayrıca veri taşınabilirliği ve itiraz hakkına sahipsiniz. Cihazınızda yerel olarak saklanan veriler için bu hakları doğrudan uygulama üzerinden kullanabilirsiniz (görüntüleme, düzenleme, silme, "kullanım verilerini yedekle" ile dosya olarak dışa aktarma). Sunucumuzdaki veriler (hesap, yedek kopya, ödeme verileri, push bildirimleri) için, hesabınızın tamamen silinmesi dahil, madde 1\'de belirtilen e-posta adresinden bizimle iletişime geçin.\n\nAyrıca Avusturya Veri Koruma Kurumu\'na (dsb.gv.at) şikayette bulunma hakkınız vardır.',
  },
  {
    heading: '8. İletişim',
    body: 'Veri gizliliğiyle ilgili sorularınız için bize şu adresten ulaşabilirsiniz: team@smartordi.eu',
  },
];

export const privacyPolicyFa: PolicySection[] = [
  {
    heading: '۱. مسئول حفاظت از داده‌ها',
    body: 'Smartordi OG، Steingasse 6A، لینتس، اتریش\nایمیل: team@smartordi.eu\nشماره ثبت شرکت: FN 675586 i\n\nشرکت فوق مسئول پردازش داده‌های شخصی در چارچوب اپلیکیشن «Brifo» طبق مقررات عمومی حفاظت از داده اتحادیه اروپا (GDPR) است.',
  },
  {
    heading: '۲. کلیات',
    body: 'Brifo به والدین عرب‌زبان در اتریش کمک می‌کند نامه‌های مدرسه را بفهمند، قرارها را مدیریت کنند و پاسخ به آلمانی بنویسند. این سند توضیح می‌دهد اپلیکیشن چه داده‌هایی را برای چه هدفی پردازش می‌کند و به‌عنوان فرد صاحب داده چه حقوقی دارید.\n\nبرای استفاده از Brifo، ایجاد یک حساب کاربری (ایمیل و رمز عبور) لازم است تا داده‌هایت به‌طور امن بین دستگاه‌ها در دسترس باشد. داده‌های خانوادگی و استفاده‌ات هم به‌صورت محلی روی دستگاهت و هم — به‌عنوان یک نسخه پشتیبان مرتبط با حسابت — روی سرور ما ذخیره می‌شود (به بند ۳ و ۴ مراجعه کن).',
  },
  {
    heading: '۳. چه داده‌هایی را پردازش می‌کنیم',
    body: 'الف) داده‌های حساب: ایمیل و رمز عبورت، که از طریق ارائه‌دهنده احراز هویت ما Supabase مدیریت می‌شود (به بند ۵ مراجعه کن). ما هرگز رمز عبورت را به‌صورت متن ساده نمی‌بینیم. علاوه بر این، سابقه موافقتت با این سیاست حفظ حریم خصوصی (نسخه و زمان) را ذخیره می‌کنیم.\n\nب) پروفایل‌های خانواده: نام، نقش (کودک/بزرگسال)، پایه تحصیلی و نام مدرسه که خودت وارد می‌کنی.\n\nج) عکس نامه‌های مدرسه: وقتی یک نامه را عکس می‌گیری، تصویر یک‌بار برای تحلیل به ارائه‌دهنده هوش مصنوعی ما Anthropic ارسال می‌شود (به بند ۵ مراجعه کن). خود تصویر نه پیش ما و نه پیش Anthropic به‌طور دائم ذخیره نمی‌شود — فقط خلاصه متنی تولیدشده (موضوع، مهلت‌ها، پرداخت‌های درخواستی) ذخیره می‌شود.\n\nد) پیش‌نویس پاسخ‌ها: وقتی از اپلیکیشن می‌خواهی برایت پاسخی برای یک نامه مدرسه بنویسد، اطلاعات لازم برای این کار (مثلاً نام و پایه تحصیلی کودک و یادداشت‌های متنی که خودت می‌نویسی) را برای تولید متن پاسخ به Anthropic ارسال می‌کنیم.\n\nه) قرارها، پرداخت‌ها، کارها و ارزیابی/بازخوردت درباره اپلیکیشن. ارزیابی/بازخوردت به‌طور جداگانه و ناشناس (بدون ارتباط با حساب یا دستگاهت) هم ذخیره می‌شود تا بتوانیم بازخوردها را بررسی کنیم.\n\nو) داده‌های پرداخت: هنگام خرید اشتراک، ارائه‌دهنده پرداخت ما Stripe (به بند ۵ مراجعه کن) ایمیل و وضعیت اشتراک/پرداختت را پردازش می‌کند. اطلاعات پرداخت (مثلاً شماره کارت اعتباری) را ما هرگز نمی‌بینیم — این اطلاعات فقط توسط Stripe پردازش می‌شود.\n\nز) اعلان‌های فوری (اختیاری، فقط در صورت فعال‌سازی): دستگاهت یک شناسه تصادفی و یک مجوز اعلان (آدرس نقطه پایانی و کلیدهای رمزنگاری مرورگرت) دریافت می‌کند. این اطلاعات به همراه عنوان و تاریخ قرارهای پیش‌رویت، فقط برای ارسال یادآوری، روی سرور ما ذخیره می‌شود.\n\nح) داده‌های فنی: تنظیم زبان (عربی/آلمانی/ترکی/فارسی) و حالت نمایش (روشن/تیره) — به‌صورت محلی ذخیره می‌شود.\n\nداده‌های ذکرشده در بندهای ب، ج و ه هم به‌صورت محلی روی دستگاهت و هم به‌عنوان نسخه پشتیبان مرتبط با حسابت روی سرور ما ذخیره می‌شود (به بند ۴ مراجعه کن).',
  },
  {
    heading: '۴. محل و مدت نگهداری داده‌ها',
    body: 'پروفایل‌های خانواده، خلاصه نامه‌ها، قرارها، پرداخت‌ها، کارها و ارزیابی‌هایت هم به‌صورت محلی روی دستگاهت و هم به‌عنوان نسخه پشتیبان مرتبط با حساب کاربری‌ات روی سرور ما ذخیره می‌شود — تا هنگام ورود از دستگاه جدید، داده‌هایت حفظ شوند. می‌توانی هر زمان تک‌تک موارد، یک پروفایل، یا همه داده‌هایت را از طریق تنظیمات حذف کنی؛ این تغییر در سرور ما نیز اعمال می‌شود. اگر بخواهی حساب کاربری‌ات به‌طور کامل حذف شود، از طریق ایمیل ذکرشده در بند ۱ با ما تماس بگیر — در این صورت نسخه پشتیبان سرور، داده‌های حساب و سابقه پرداختت را نیز حذف می‌کنیم، مگر اینکه الزام قانونی برای نگهداری (مثلاً برای فاکتورها) مانع شود.\n\nداده‌های اعلان‌های فوری (شناسه دستگاه، مجوز اعلان، عنوان/تاریخ قرارها) تا زمانی که قابلیت یادآوری فعال باشد ذخیره می‌شود و با غیرفعال کردن آن یا لغو مجوز اعلان، به‌طور خودکار حذف می‌شود.',
  },
  {
    heading: '۵. اشتراک‌گذاری با اشخاص ثالث (پردازشگران داده)',
    body: 'Anthropic PBC (آمریکا): نامه‌های مدرسه عکس‌گرفته‌شده را برای تشخیص متن/تحلیل و همچنین اطلاعات ذکرشده در بند ۳-د را برای تولید پیش‌نویس پاسخ پردازش می‌کند. این به معنای انتقال داده به یک کشور ثالث (آمریکا) است؛ ما اطمینان حاصل می‌کنیم که تضمین‌های مناسب (مثلاً بندهای قراردادی استاندارد) برای آن وجود دارد.\n\nSupabase Inc.: ارائه‌دهنده احراز هویت برای حساب کاربری‌ات (ایمیل، رمز عبور، فرآیند ورود).\n\nStripe: ارائه‌دهنده پرداخت برای اشتراک‌ها (به بند ۳-و مراجعه کن).\n\nVercel Inc.: میزبانی اپلیکیشن و ذخیره داده‌های سرور ذکرشده در بند ۳ و ۴ (داده‌های حساب، نسخه پشتیبان، اعلان‌های فوری) روی سرورهایی در اتحادیه اروپا.\n\nما هیچ داده‌ای را به اشخاص ثالث نمی‌فروشیم و از هیچ سرویس تبلیغاتی یا ردیابی استفاده نمی‌کنیم.',
  },
  {
    heading: '۶. داده‌های کودکان',
    body: 'Brifo برای والدین/سرپرستانی طراحی شده که خودشان اطلاعات فرزندانشان (نام، پایه تحصیلی) را برای سازماندهی نامه‌های مدرسه وارد می‌کنند. مسئولیت وارد کردن و مدیریت این اطلاعات بر عهده والدین/سرپرست است. این اطلاعات طبق توضیح بند ۳ و ۴ ذخیره می‌شود.',
  },
  {
    heading: '۷. حقوق شما',
    body: 'طبق GDPR، حق دارید از پردازش داده‌هایت مطلع شوی، آن را اصلاح، حذف یا محدود کنی، و همچنین حق انتقال داده و اعتراض داری. برای داده‌های ذخیره‌شده به‌صورت محلی روی دستگاهت، می‌توانی این حقوق را مستقیماً از طریق اپلیکیشن اعمال کنی (مشاهده، ویرایش، حذف، خروجی‌گیری به‌صورت فایل از طریق «پشتیبان‌گیری از داده‌های استفاده»). برای داده‌هایی که روی سرور ما هستند (حساب، نسخه پشتیبان، اطلاعات پرداخت، اعلان‌های فوری)، از جمله حذف کامل حسابت، از طریق ایمیل ذکرشده در بند ۱ با ما تماس بگیر.\n\nهمچنین حق داری از اداره حفاظت از داده‌های اتریش (dsb.gv.at) شکایت کنی.',
  },
  {
    heading: '۸. تماس با ما',
    body: 'برای هر سؤالی درباره حریم خصوصی، می‌توانید از طریق team@smartordi.eu با ما تماس بگیرید.',
  },
];

export const privacyPolicyEn: PolicySection[] = [
  {
    heading: '1. Data controller',
    body: 'Smartordi OG, Steingasse 6A, Linz, Austria\nEmail: team@smartordi.eu\nCompany register number: FN 675586 i\n\nThe company named above is responsible for processing personal data within the "Brifo" app under the General Data Protection Regulation (GDPR).',
  },
  {
    heading: '2. General',
    body: 'Brifo helps Arabic-speaking parents in Austria understand school letters, manage appointments, and draft replies in German. This notice describes what data the app processes, for what purpose, and what rights you have as the data subject.\n\nTo use Brifo, a user account (email address and password) is required so your data is securely accessible across devices. Your family and usage data is stored both locally on your device and — as a backup copy linked to your account — on our server (see sections 3 and 4).',
  },
  {
    heading: '3. What data we process',
    body: 'a) Account data: your email address and password, managed via our authentication provider Supabase (see section 5). We never see your password in plain text ourselves. We also store a record of your consent to this privacy policy (version and timestamp).\n\nb) Family profiles: name, role (child/adult), grade level, and school name, which you enter yourself.\n\nc) Photos of school letters: when you photograph a letter, the image is sent once for analysis to our AI provider Anthropic (see section 5). The image itself is not permanently stored by us or by Anthropic — only the resulting text summary (subject, deadlines, requested payments) is stored.\n\nd) Reply drafts: when you have the app draft a reply to a school letter, we send the information needed for this (e.g. the child\'s name and grade level, plus any free-text notes you enter) to Anthropic to generate the reply text.\n\ne) Appointments, payments, tasks, and your rating/feedback about the app. Your rating/feedback is additionally stored anonymously (without any link to your account or device) so we can review feedback about the app.\n\nf) Payment data: when you take out a subscription, our payment provider Stripe (see section 5) processes your email address and your subscription/payment status. We ourselves never see payment details (e.g. credit card number) — these are processed exclusively by Stripe.\n\ng) Push notifications (optional, only if you enable them): your device receives a random device ID and a push permission (your browser\'s endpoint URL and encryption keys). These, along with the titles and dates of your upcoming appointments, are stored on our server solely to deliver reminders to you.\n\nh) Technical data: language setting (Arabic/German/Turkish/Persian/English) and display mode (light/dark) — stored locally.\n\nThe data listed under b), c), and e) is stored both locally on your device and, linked to your account, as a backup copy on our server (see section 4).',
  },
  {
    heading: '4. Storage location and retention period',
    body: 'Your family profiles, letter summaries, appointments, payments, tasks, and ratings are stored both locally on your device and as a backup copy on our server, linked to your user account — so your data is preserved when you sign in on a new device. You can delete individual entries, a profile, or all your data at any time via Settings; this is also reflected on our server. If you would additionally like your user account fully deleted, contact us at the email address given in section 1 — we will then also delete the server-side backup copy, your account data, and your payment history, unless a legal retention obligation (e.g. for invoices) prevents this.\n\nData for push notifications (device ID, push permission, appointment titles/dates) is stored as long as the reminder feature is enabled, and automatically deleted when you disable it or revoke your push permission.',
  },
  {
    heading: '5. Sharing with third parties (data processors)',
    body: 'Anthropic PBC (USA): processes photographed school letters for text recognition/analysis, as well as the information listed in section 3d, to generate reply drafts. This involves a data transfer to a third country (USA); we ensure appropriate safeguards (e.g. standard contractual clauses) are in place for this.\n\nSupabase Inc.: authentication provider for your user account (email, password, sign-in process).\n\nStripe: payment provider for subscriptions (see section 3f).\n\nVercel Inc.: hosting of the app and storage of the server data listed in sections 3 and 4 (account data, backup copy, push notifications), on servers within the European Union.\n\nWe do not sell data to third parties and do not use advertising or tracking services.',
  },
  {
    heading: '6. Children\'s data',
    body: 'Brifo is intended for parents/guardians who themselves enter information about their children (name, grade level) to organize school letters. Entering and managing this information is the responsibility of the parents/guardian. The information is stored as described in sections 3 and 4.',
  },
  {
    heading: '7. Your rights',
    body: 'Under the GDPR, you have the right to access, rectify, delete, and restrict the processing of your data, as well as the right to data portability and to object. For data stored locally on your device, you can exercise these rights directly in the app (viewing, editing, deleting, exporting as a file via "back up usage data"). For data on our server (account, backup copy, payment data, push notifications), including full deletion of your account, contact us at the email address given in section 1.\n\nYou also have the right to lodge a complaint with the Austrian Data Protection Authority (dsb.gv.at).',
  },
  {
    heading: '8. Contact',
    body: 'For questions about privacy, reach us at: team@smartordi.eu',
  },
];

export const privacyPolicyUk: PolicySection[] = [
  {
    heading: '1. Контролер даних',
    body: 'Smartordi OG, Steingasse 6A, Лінц, Австрія\nЕлектронна пошта: team@smartordi.eu\nНомер у торговому реєстрі: FN 675586 i\n\nЗазначена вище компанія відповідає за обробку персональних даних у межах застосунку "Brifo" відповідно до Загального регламенту про захист даних (GDPR).',
  },
  {
    heading: '2. Загальні відомості',
    body: 'Brifo допомагає арабськомовним батькам в Австрії розуміти шкільні листи, керувати зустрічами та писати відповіді німецькою. Цей документ описує, які дані обробляє застосунок, з якою метою і які права ви маєте як суб\'єкт даних.\n\nДля користування Brifo потрібен обліковий запис (електронна пошта та пароль), щоб ваші дані були безпечно доступні на всіх пристроях. Ваші дані про родину та використання зберігаються як локально на вашому пристрої, так і — як резервна копія, пов\'язана з вашим обліковим записом — на нашому сервері (див. пункти 3 і 4).',
  },
  {
    heading: '3. Які дані ми обробляємо',
    body: 'а) Дані облікового запису: ваша електронна пошта та пароль, якими керує наш постачальник автентифікації Supabase (див. пункт 5). Ми самі ніколи не бачимо ваш пароль у відкритому вигляді. Ми також зберігаємо запис про вашу згоду на цю політику конфіденційності (версію та час).\n\nб) Профілі родини: ім\'я, роль (дитина/дорослий), клас і назва школи, які ви вводите самостійно.\n\nв) Фото шкільних листів: коли ви фотографуєте лист, зображення одноразово надсилається для аналізу нашому постачальнику ШІ Anthropic (див. пункт 5). Саме зображення не зберігається постійно ні нами, ні Anthropic — зберігається лише текстовий підсумок (тема, терміни, необхідні платежі).\n\nг) Чернетки відповідей: коли ви просите застосунок скласти відповідь на шкільний лист, ми надсилаємо необхідну для цього інформацію (наприклад, ім\'я та клас дитини, а також будь-які текстові нотатки, які ви вводите) до Anthropic для створення тексту відповіді.\n\nд) Зустрічі, платежі, завдання та ваша оцінка/відгук про застосунок. Ваша оцінка/відгук також зберігається окремо й анонімно (без прив\'язки до вашого облікового запису чи пристрою), щоб ми могли аналізувати відгуки про застосунок.\n\nе) Дані платежів: коли ви оформлюєте підписку, наш платіжний провайдер Stripe (див. пункт 5) обробляє вашу електронну пошту та статус підписки/платежу. Дані платежу (наприклад, номер кредитної картки) ми самі ніколи не бачимо — їх обробляє виключно Stripe.\n\nє) Push-сповіщення (необов\'язково, лише якщо ви їх увімкнете): ваш пристрій отримує випадковий ідентифікатор пристрою та дозвіл на push-сповіщення (URL-адресу кінцевої точки та ключі шифрування вашого браузера). Ці дані разом із назвами та датами ваших найближчих зустрічей зберігаються на нашому сервері виключно для надсилання вам нагадувань.\n\nж) Технічні дані: налаштування мови (арабська/німецька/турецька/перська/англійська/українська) та режим показу (світлий/темний) — зберігаються локально.\n\nДані, зазначені в пунктах б), в) і д), зберігаються як локально на вашому пристрої, так і, пов\'язані з вашим обліковим записом, як резервна копія на нашому сервері (див. пункт 4).',
  },
  {
    heading: '4. Місце та термін зберігання даних',
    body: 'Ваші профілі родини, підсумки листів, зустрічі, платежі, завдання та оцінки зберігаються як локально на вашому пристрої, так і як резервна копія на нашому сервері, пов\'язана з вашим обліковим записом — щоб ваші дані збереглися, коли ви входите з нового пристрою. Ви можете видалити окремі записи, профіль або всі свої дані будь-коли через налаштування; це також відображається на нашому сервері. Якщо ви хочете, щоб ваш обліковий запис було повністю видалено, зв\'яжіться з нами за електронною адресою, вказаною в пункті 1 — тоді ми також видалимо резервну копію на сервері, дані вашого облікового запису та історію платежів, якщо цьому не перешкоджає юридичне зобов\'язання щодо зберігання (наприклад, для рахунків).\n\nДані для push-сповіщень (ідентифікатор пристрою, дозвіл на сповіщення, назви/дати зустрічей) зберігаються, поки функція нагадувань увімкнена, і автоматично видаляються, коли ви її вимикаєте або відкликаєте дозвіл на сповіщення.',
  },
  {
    heading: '5. Передача третім особам (обробникам даних)',
    body: 'Anthropic PBC (США): обробляє сфотографовані шкільні листи для розпізнавання тексту/аналізу, а також інформацію, зазначену в пункті 3г, для створення чернеток відповідей. Це передбачає передачу даних до третьої країни (США); ми забезпечуємо наявність відповідних гарантій (наприклад, стандартних договірних положень) для цього.\n\nSupabase Inc.: постачальник автентифікації для вашого облікового запису (електронна пошта, пароль, процес входу).\n\nStripe: платіжний провайдер для підписок (див. пункт 3е).\n\nVercel Inc.: хостинг застосунку та зберігання серверних даних, зазначених у пунктах 3 і 4 (дані облікового запису, резервна копія, push-сповіщення), на серверах у межах Європейського Союзу.\n\nМи не продаємо дані третім особам і не використовуємо рекламні чи трекінгові сервіси.',
  },
  {
    heading: '6. Дані дітей',
    body: 'Brifo призначений для батьків/опікунів, які самостійно вводять інформацію про своїх дітей (ім\'я, клас) для впорядкування шкільних листів. Введення й керування цією інформацією є відповідальністю батьків/опікуна. Інформація зберігається так, як описано в пунктах 3 і 4.',
  },
  {
    heading: '7. Ваші права',
    body: 'Відповідно до GDPR ви маєте право на доступ, виправлення, видалення та обмеження обробки ваших даних, а також право на перенесення даних і заперечення. Для даних, що зберігаються локально на вашому пристрої, ви можете реалізувати ці права безпосередньо в застосунку (перегляд, редагування, видалення, експорт у файл через "резервне копіювання даних використання"). Щодо даних на нашому сервері (обліковий запис, резервна копія, дані платежів, push-сповіщення), включно з повним видаленням вашого облікового запису, зв\'яжіться з нами за електронною адресою, вказаною в пункті 1.\n\nВи також маєте право подати скаргу до Австрійського органу захисту даних (dsb.gv.at).',
  },
  {
    heading: '8. Контакти',
    body: 'З питань конфіденційності ви можете зв\'язатися з нами за адресою: team@smartordi.eu',
  },
];
