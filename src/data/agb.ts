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
