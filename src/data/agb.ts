/** AGB / شروط الاستخدام — draft general terms of use, written for the app's
 * current free feature set plus a planned premium tier (the in-app "Paywall"
 * screen is a placeholder as of this writing). Update the pricing/tier
 * details once that's finalized, and have a lawyer review before this
 * governs real paid contracts — especially the withdrawal-rights clause. */
import type { PolicySection } from './privacyPolicy';

export const AGB_VERSION = 1;
export const AGB_LAST_UPDATED = '2026-07-11';

export const agbDe: PolicySection[] = [
  {
    heading: '1. Geltungsbereich',
    body: 'Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der App "Brifo", angeboten von Smartordi OG, Steingasse 6A, Linz, Österreich ("wir", "Anbieter"). Mit der Nutzung der App erklären Sie sich mit diesen AGB einverstanden.',
  },
  {
    heading: '2. Leistungsbeschreibung',
    body: 'Brifo hilft arabischsprachigen Eltern in Österreich, Schulbriefe mittels KI-gestützter Analyse zu verstehen, Termine und Zahlungen zu organisieren und Antworten auf Deutsch zu verfassen. Die App bietet einen kostenlosen Funktionsumfang; einzelne Zusatzfunktionen können künftig kostenpflichtig ("Premium") angeboten werden — die jeweils aktuellen Leistungen und Preise werden vor Kauf in der App angezeigt.\n\nDie automatisiert erstellten Zusammenfassungen und Übersetzungen sind ein Hilfsmittel und ersetzen nicht die eigene Prüfung des Originalschreibens. Wir übernehmen keine Haftung für Entscheidungen, die allein auf Basis der App-Ausgabe getroffen werden.',
  },
  {
    heading: '3. Vertragsabschluss und Preise',
    body: 'Ein kostenpflichtiger Vertrag kommt erst zustande, wenn Sie einen Kauf- bzw. Abo-Vorgang in der App aktiv abschließen und die jeweils angezeigten Preise, Leistungen und Zahlungsbedingungen bestätigen. Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer, sofern nicht anders angegeben.',
  },
  {
    heading: '4. Widerrufsrecht',
    body: 'Als Verbraucher:in haben Sie grundsätzlich das Recht, einen Vertrag über digitale Inhalte/Dienstleistungen innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen.\n\nDieses Recht erlischt vorzeitig, wenn wir mit der Ausführung der Leistung begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung beginnen, und Sie gleichzeitig bestätigt haben, dass Sie dadurch Ihr Widerrufsrecht verlieren. Eine entsprechende ausdrückliche Bestätigung wird beim jeweiligen Kaufvorgang separat eingeholt.',
  },
  {
    heading: '5. Laufzeit und Kündigung von Abonnements',
    body: 'Sofern ein Premium-Zugang im Abonnement angeboten wird, gelten die bei Abschluss angezeigte Laufzeit und Kündigungsfrist. Eine Kündigung kann über die in der App vorgesehene Funktion oder per E-Mail an team@smartordi.eu erfolgen.',
  },
  {
    heading: '6. Haftungsbeschränkung',
    body: 'Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie nach zwingenden gesetzlichen Bestimmungen (z. B. Produkthaftungsgesetz). Für leichte Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten und beschränkt auf den vorhersehbaren, vertragstypischen Schaden.\n\nBrifo liefert automatisiert erstellte Analysen; wir übernehmen keine Gewähr für deren Vollständigkeit oder Richtigkeit. Für Fristen, Zahlungsbeträge und sonstige verbindliche Angaben ist stets das Originalschreiben der Schule maßgeblich.',
  },
  {
    heading: '7. Änderungen dieser AGB',
    body: 'Wir können diese AGB mit Wirkung für die Zukunft ändern, etwa bei neuen Funktionen oder rechtlichen Anforderungen. Über wesentliche Änderungen informieren wir Sie in der App.',
  },
  {
    heading: '8. Anwendbares Recht und Gerichtsstand',
    body: 'Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Für Verbraucher:innen gelten die zwingenden Bestimmungen des Staates ihres gewöhnlichen Aufenthalts, sofern dieser innerhalb der EU liegt.',
  },
  {
    heading: '9. Kontakt',
    body: 'Bei Fragen zu diesen AGB erreichen Sie uns unter: team@smartordi.eu',
  },
];

export const agbAr: PolicySection[] = [
  {
    heading: '١. نطاق السريان',
    body: 'شروط الاستخدام هاي بتنطبق على استخدام تطبيق "Brifo"، المقدَّم من شركة Smartordi OG، Steingasse 6A، Linz، النمسا ("إحنا"، "مزوّد الخدمة"). باستخدامك للتطبيق، إنتِ موافقة على هالشروط.',
  },
  {
    heading: '٢. وصف الخدمة',
    body: 'Brifo بيساعد الأهل الناطقين بالعربي بالنمسا يفهموا رسائل المدرسة عبر تحليل بالذكاء الاصطناعي، وينظّموا المواعيد والمدفوعات، ويكتبوا ردود بالألماني. التطبيق بيقدّم مجموعة ميزات مجانية؛ وممكن مستقبلاً نقدّم ميزات إضافية مدفوعة ("بريميوم") — الأسعار والميزات المحددة بتنعرض بالتطبيق قبل أي عملية شراء.\n\nالملخصات والترجمات المولّدة آلياً هي أداة مساعدة بس، وما بتغني عن مراجعتك للرسالة الأصلية بنفسك. ما منتحمّل مسؤولية أي قرار يُتخذ بالاعتماد الكامل على نتيجة التطبيق.',
  },
  {
    heading: '٣. إبرام العقد والأسعار',
    body: 'أي عقد مدفوع ما بيصير سارياً إلا لما تكملي عملية شراء أو اشتراك فعلية بالتطبيق وتأكدي على الأسعار والميزات وشروط الدفع المعروضة. كل الأسعار شاملة ضريبة القيمة المضافة القانونية ما لم يُذكر خلاف ذلك.',
  },
  {
    heading: '٤. حق الرجوع (Widerrufsrecht)',
    body: 'كمستهلك/ة، إلك الحق أساساً بالرجوع عن عقد محتوى/خدمة رقمية خلال ١٤ يوم بدون إبداء أسباب.\n\nهاد الحق بينتهي مبكراً إذا بلّشنا بتنفيذ الخدمة بعد ما توافقي صراحةً إنه نبلش قبل انتهاء مدة الـ ١٤ يوم، وبنفس الوقت تأكدي إنك فاهمة إنك بهيك رح تفقدي حق الرجوع. هالتأكيد الصريح بينطلب بشكل منفصل وقت عملية الشراء.',
  },
  {
    heading: '٥. مدة ووقف الاشتراكات',
    body: 'إذا انعرض اشتراك بريميوم، بتنطبق مدة الاشتراك وشروط الإلغاء المعروضة وقت الاشتراك. الإلغاء ممكن عبر خاصية بالتطبيق أو بمراسلتنا على team@smartordi.eu.',
  },
  {
    heading: '٦. حدود المسؤولية',
    body: 'مسؤوليتنا غير محدودة بحالات القصد والإهمال الجسيم، وحسب الأحكام القانونية الإلزامية. بحالة الإهمال البسيط، مسؤوليتنا محدودة بالأضرار المتوقعة والمعتادة بهيك نوع عقد، وبس بحالة الإخلال بالتزامات جوهرية.\n\nBrifo بيقدّم تحليلات مولّدة آلياً؛ ما منضمن اكتمالها أو دقتها الكاملة. بخصوص المواعيد والمبالغ المطلوبة وأي معلومة ملزمة، الرسالة الأصلية من المدرسة هي المرجع دائماً.',
  },
  {
    heading: '٧. تعديل هالشروط',
    body: 'فيناً نعدّل هالشروط مستقبلاً، مثلاً عند إضافة ميزات جديدة أو متطلبات قانونية. رح نعلمك بأي تعديل جوهري من خلال التطبيق.',
  },
  {
    heading: '٨. القانون المطبَّق والاختصاص القضائي',
    body: 'يسري القانون النمساوي باستثناء اتفاقية الأمم المتحدة للبيع الدولي للبضائع. بالنسبة للمستهلكين، تسري الأحكام الإلزامية بدولة إقامتهم المعتادة إذا كانت ضمن الاتحاد الأوروبي.',
  },
  {
    heading: '٩. تواصل معنا',
    body: 'لأي سؤال عن هالشروط، تواصلي معنا عبر: team@smartordi.eu',
  },
];

export const agbTr: PolicySection[] = [
  {
    heading: '1. Uygulama alanı',
    body: 'Bu Genel Kullanım Koşulları (AGB), Smartordi OG, Steingasse 6A, Linz, Avusturya ("biz", "sağlayıcı") tarafından sunulan "Brifo" uygulamasının kullanımı için geçerlidir. Uygulamayı kullanarak bu koşulları kabul etmiş olursunuz.',
  },
  {
    heading: '2. Hizmet tanımı',
    body: 'Brifo, Avusturya\'daki Arapça konuşan ebeveynlerin yapay zeka destekli analiz yoluyla okul mektuplarını anlamalarına, randevu ve ödemeleri düzenlemelerine ve Almanca cevap yazmalarına yardımcı olur. Uygulama ücretsiz bir özellik kapsamı sunar; bazı ek özellikler ileride ücretli ("Premium") olarak sunulabilir — güncel hizmetler ve fiyatlar satın almadan önce uygulamada gösterilir.\n\nOtomatik oluşturulan özetler ve çeviriler bir yardımcı araçtır ve orijinal mektubun kendiniz incelemesinin yerini tutmaz. Yalnızca uygulama çıktısına dayanarak alınan kararlardan sorumluluk kabul etmiyoruz.',
  },
  {
    heading: '3. Sözleşmenin kurulması ve fiyatlar',
    body: 'Ücretli bir sözleşme, yalnızca uygulamada bir satın alma veya abonelik işlemini bizzat tamamlayıp gösterilen fiyatları, hizmetleri ve ödeme koşullarını onayladığınızda geçerli olur. Aksi belirtilmedikçe tüm fiyatlara yasal katma değer vergisi dahildir.',
  },
  {
    heading: '4. Cayma hakkı',
    body: 'Tüketici olarak, dijital içerik/hizmetlerle ilgili bir sözleşmeden gerekçe göstermeksizin 14 gün içinde cayma hakkına genel olarak sahipsiniz.\n\nCayma süresi dolmadan önce hizmetin ifasına başlamamızı açıkça onayladığınızda ve bununla cayma hakkınızı kaybedeceğinizi aynı anda teyit ettiğinizde bu hak erken sona erer. İlgili açık onay, her satın alma işleminde ayrıca alınır.',
  },
  {
    heading: '5. Aboneliklerin süresi ve feshi',
    body: 'Premium erişim abonelik olarak sunulursa, abonelik başlangıcında gösterilen süre ve fesih süresi geçerlidir. Fesih, uygulamadaki ilgili işlev üzerinden veya team@smartordi.eu adresine e-posta ile yapılabilir.',
  },
  {
    heading: '6. Sorumluluk sınırlaması',
    body: 'Kasıt ve ağır ihmal ile zorunlu yasal hükümler (örn. Ürün Sorumluluğu Kanunu) çerçevesinde sınırsız sorumluluk taşırız. Hafif ihmal durumunda yalnızca temel sözleşme yükümlülüklerinin ihlali halinde ve öngörülebilir, sözleşmeye özgü zararla sınırlı olarak sorumluyuz.\n\nBrifo otomatik olarak oluşturulan analizler sunar; bunların eksiksizliği veya doğruluğu için garanti vermiyoruz. Süreler, ödeme tutarları ve diğer bağlayıcı bilgiler için her zaman okulun orijinal mektubu esas alınır.',
  },
  {
    heading: '7. Bu koşullardaki değişiklikler',
    body: 'Yeni özellikler veya yasal gereklilikler gibi nedenlerle bu koşulları ileriye dönük olarak değiştirebiliriz. Önemli değişiklikler hakkında sizi uygulama üzerinden bilgilendiririz.',
  },
  {
    heading: '8. Uygulanacak hukuk ve yetkili mahkeme',
    body: 'BM Satış Hukuku hariç olmak üzere Avusturya hukuku geçerlidir. Tüketiciler için, olağan ikametgahlarının bulunduğu ülke AB içindeyse, o ülkenin zorunlu hükümleri geçerlidir.',
  },
  {
    heading: '9. İletişim',
    body: 'Bu koşullarla ilgili sorularınız için bize şu adresten ulaşabilirsiniz: team@smartordi.eu',
  },
];

export const agbFa: PolicySection[] = [
  {
    heading: '۱. حوزه شمول',
    body: 'این شرایط عمومی استفاده (AGB) برای استفاده از اپلیکیشن «Brifo»، ارائه‌شده توسط Smartordi OG، Steingasse 6A، لینتس، اتریش («ما»، «ارائه‌دهنده»)، اعمال می‌شود. با استفاده از اپلیکیشن، این شرایط را می‌پذیرید.',
  },
  {
    heading: '۲. توضیح خدمات',
    body: 'Brifo به والدین عرب‌زبان در اتریش کمک می‌کند تا نامه‌های مدرسه را با تحلیل مبتنی بر هوش مصنوعی بفهمند، قرارها و پرداخت‌ها را سازماندهی کنند و پاسخ به آلمانی بنویسند. اپلیکیشن مجموعه‌ای از امکانات رایگان ارائه می‌دهد؛ برخی امکانات اضافی ممکن است در آینده به‌صورت پولی («Premium») ارائه شوند — خدمات و قیمت‌های فعلی همیشه پیش از خرید در اپلیکیشن نمایش داده می‌شوند.\n\nخلاصه‌ها و ترجمه‌های تولیدشده به‌صورت خودکار صرفاً ابزار کمکی هستند و جایگزین بررسی شخصی نامه اصلی نیستند. ما هیچ مسئولیتی در قبال تصمیماتی که صرفاً بر اساس خروجی اپلیکیشن گرفته می‌شوند نمی‌پذیریم.',
  },
  {
    heading: '۳. انعقاد قرارداد و قیمت‌ها',
    body: 'یک قرارداد پولی تنها زمانی معتبر می‌شود که شما شخصاً یک فرآیند خرید یا اشتراک را در اپلیکیشن کامل کرده و قیمت‌ها، خدمات و شرایط پرداخت نمایش‌داده‌شده را تأیید کنید. تمام قیمت‌ها، مگر خلاف آن ذکر شده باشد، شامل مالیات بر ارزش‌افزوده قانونی است.',
  },
  {
    heading: '۴. حق انصراف',
    body: 'به‌عنوان مصرف‌کننده، شما اصولاً حق دارید ظرف ۱۴ روز، بدون ذکر دلیل، از قراردادی درباره محتوا/خدمات دیجیتال انصراف دهید.\n\nاین حق زودتر از موعد منقضی می‌شود اگر ما پس از موافقت صریح شما با شروع اجرای خدمات پیش از پایان مهلت انصراف، اجرای آن را آغاز کرده باشیم و شما همزمان تأیید کرده باشید که با این کار حق انصراف خود را از دست می‌دهید. این تأییدیه صریح جداگانه در هر فرآیند خرید دریافت می‌شود.',
  },
  {
    heading: '۵. مدت و لغو اشتراک‌ها',
    body: 'در صورت ارائه دسترسی Premium به‌صورت اشتراک، مدت و مهلت لغوی که در زمان ثبت اشتراک نمایش داده می‌شود، معتبر است. لغو اشتراک از طریق قابلیت مربوطه در اپلیکیشن یا با ارسال ایمیل به team@smartordi.eu امکان‌پذیر است.',
  },
  {
    heading: '۶. محدودیت مسئولیت',
    body: 'ما مسئولیت نامحدودی در قبال عمد و سهل‌انگاری فاحش و همچنین طبق مقررات قانونی الزامی (مثلاً قانون مسئولیت محصول) داریم. در موارد سهل‌انگاری جزئی، فقط در صورت نقض تعهدات اساسی قرارداد و محدود به خسارت قابل‌پیش‌بینی و متعارف مسئولیم.\n\nBrifo تحلیل‌های تولیدشده به‌صورت خودکار ارائه می‌دهد؛ ما هیچ تضمینی برای کامل بودن یا صحت آن‌ها نمی‌دهیم. برای مهلت‌ها، مبالغ پرداختی و سایر اطلاعات الزام‌آور، همیشه نامه اصلی مدرسه ملاک است.',
  },
  {
    heading: '۷. تغییرات در این شرایط',
    body: 'ممکن است این شرایط را در آینده، مثلاً به دلیل امکانات جدید یا الزامات قانونی، تغییر دهیم. درباره تغییرات مهم شما را از طریق اپلیکیشن مطلع می‌کنیم.',
  },
  {
    heading: '۸. قانون قابل‌اعمال و صلاحیت قضایی',
    body: 'قانون اتریش، به استثنای کنوانسیون بیع بین‌المللی کالای سازمان ملل، اعمال می‌شود. برای مصرف‌کنندگان، مقررات الزامی کشور محل اقامت معمولشان، در صورتی که در اتحادیه اروپا باشد، اعمال می‌شود.',
  },
  {
    heading: '۹. تماس با ما',
    body: 'برای هر سؤالی درباره این شرایط، می‌توانید از طریق team@smartordi.eu با ما تماس بگیرید.',
  },
];

export const agbEn: PolicySection[] = [
  {
    heading: '1. Scope',
    body: 'These Terms of Use (AGB) apply to the use of the "Brifo" app, offered by Smartordi OG, Steingasse 6A, Linz, Austria ("we", "provider"). By using the app, you agree to these Terms of Use.',
  },
  {
    heading: '2. Service description',
    body: 'Brifo helps Arabic-speaking parents in Austria understand school letters through AI-powered analysis, organize appointments and payments, and draft replies in German. The app offers a free feature set; individual additional features may be offered as paid ("Premium") in the future — the current features and prices are always shown in the app before purchase.\n\nThe automatically generated summaries and translations are an aid and do not replace reviewing the original letter yourself. We accept no liability for decisions made solely on the basis of the app\'s output.',
  },
  {
    heading: '3. Formation of contract and prices',
    body: 'A paid contract only comes into effect once you actively complete a purchase or subscription process in the app and confirm the prices, features, and payment terms shown. Unless stated otherwise, all prices include statutory VAT.',
  },
  {
    heading: '4. Right of withdrawal',
    body: 'As a consumer, you generally have the right to withdraw from a contract for digital content/services within 14 days without giving a reason.\n\nThis right expires early if we have begun performing the service after you expressly agreed that we may begin before the withdrawal period ends, and you simultaneously confirmed that you understand you will lose your right of withdrawal as a result. This express confirmation is obtained separately during each purchase process.',
  },
  {
    heading: '5. Term and cancellation of subscriptions',
    body: 'If Premium access is offered as a subscription, the term and cancellation notice shown at the time of purchase apply. Cancellation can be done via the relevant function in the app or by email to team@smartordi.eu.',
  },
  {
    heading: '6. Limitation of liability',
    body: 'We are liable without limitation for intent and gross negligence, and under mandatory statutory provisions (e.g. Product Liability Act). For slight negligence, we are only liable for breach of material contractual obligations and limited to foreseeable, typical damage.\n\nBrifo provides automatically generated analyses; we make no guarantee as to their completeness or accuracy. For deadlines, payment amounts, and other binding information, the school\'s original letter is always authoritative.',
  },
  {
    heading: '7. Changes to these Terms',
    body: 'We may change these Terms with future effect, for example when adding new features or due to legal requirements. We will inform you of material changes within the app.',
  },
  {
    heading: '8. Applicable law and jurisdiction',
    body: 'Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods. For consumers, the mandatory provisions of the country of their habitual residence apply, provided it is within the EU.',
  },
  {
    heading: '9. Contact',
    body: 'For questions about these Terms, reach us at: team@smartordi.eu',
  },
];
