import type { Lang } from '../context/translations';

export interface GuideArticle {
  id: string;
  icon: string;
  title: string;
  teaser: string;
  paragraphs: string[];
}

const ar: GuideArticle[] = [
  {
    id: 'school-types',
    icon: '🏫',
    title: 'أنواع المدارس بالنمسا',
    teaser: 'Volksschule، Mittelschule، Gymnasium... شو الفرق؟',
    paragraphs: [
      'Volksschule (المدرسة الابتدائية): من عمر 6 لـ10 سنوات، أربع صفوف، بتتعلم فيها القراءة والكتابة والحساب الأساسي.',
      'Mittelschule (المدرسة المتوسطة): من عمر 10 لـ14 سنة، بتحضّر الطالب للمرحلة اللي بعدها، سواء أكاديمية أو مهنية.',
      'Gymnasium/AHS (الغيمنازيوم): من عمر 10 سنوات (أو بعد الـ Mittelschule بعمر 14)، مستوى أكاديمي أعلى، وبيأهّل للجامعة مباشرة بعد إنهاء الـ Matura.',
      'Berufsschule / Lehre (المدرسة المهنية والتلمذة الحرفية): تعليم مهني بيمشي بموازاة شغل حقيقي عند صاحب عمل.',
      'بعد عمر 14 سنة، الأهل والطالب مع بعض بيقرروا المسار الأنسب حسب ميول الطالب وقدراته.',
    ],
  },
  {
    id: 'grading-system',
    icon: '📊',
    title: 'نظام العلامات والشهادات',
    teaser: 'من 1 (ممتاز) لـ 5 (راسب) — وشو معنى كل رقم',
    paragraphs: [
      'العلامات بالنمسا من 1 لـ 5، ورقم 1 هو الأحسن.',
      '1 = Sehr gut (ممتاز)',
      '2 = Gut (جيد جداً)',
      '3 = Befriedigend (جيد)',
      '4 = Genügend (مقبول)',
      '5 = Nicht genügend (راسب بالمادة)',
      'الشهادة (Zeugnis) بتنعطى مرتين بالسنة: شهادة نص السنة (Semesterzeugnis) وشهادة آخر السنة (Jahreszeugnis). شهادة آخر السنة هي اللي بتحدد إذا الطالب ناجح وبينتقل للصف اللي بعده.',
    ],
  },
  {
    id: 'sprechstunde',
    icon: '🗣️',
    title: 'Sprechstunde: كيف تحكي مع المعلم',
    teaser: 'وقت مخصص للأهل يحكوا مباشرة مع المعلم',
    paragraphs: [
      'شو هو الـ Sprechstunde؟ وقت محدد أسبوعياً بيقدر فيه الأهل يحجزوا موعد ويحكوا مع المعلم وجهاً لوجه عن وضع ابنهم أو بنتهم.',
      'كيف تحجز موعد؟ عادة عن طريق دفتر الملاحظات (Mitteilungsheft)، أو إيميل المدرسة، أو تطبيق مثل Schoolfox.',
      'شو تحضّر قبل الموعد؟ اكتب أسئلتك مسبقاً، جهّز أي أوراق أو شهادات مهمة، ولو حسّيت الحكي بالألماني صعب، تقدر تاخذ معك حدا يترجم لك.',
      'شو تسأل بالموعد؟ كيف أداء ابنك أو بنتك بالصف، في تحسّن ولا في شي محتاج انتباه أكتر، وكيف فيك تساعد بالبيت.',
    ],
  },
  {
    id: 'parent-rights',
    icon: '⚖️',
    title: 'حقوق وواجبات الأهل',
    teaser: 'شو إلك كأهل، وشو المطلوب منك',
    paragraphs: [
      'حقوق الأهل: تعرف وضع ابنك الدراسي أول بأول، تشارك باجتماع الصف (Elternabend)، وتنتخب ممثل عن الأهل (Elternverein / Klassenelternvertreter) يحكي باسم كل الأهل.',
      'واجبات الأهل: تتأكد إن ابنك يواظب على الدوام (أي غياب لازم يكون إله عذر رسمي)، توقّع وترجّع أي ورقة مطلوبة من المدرسة بالوقت المحدد، وتتابع الواجبات المدرسية معه.',
      'التعليم إلزامي (Schulpflicht) بالنمسا من عمر 6 لـ 15 سنة — يعني لازم كل طفل يواظب على مدرسة رسمية بهاد العمر.',
    ],
  },
  {
    id: 'fruehwarnung',
    icon: '🚨',
    title: 'Frühwarnung: شو يعني وشو تعمل',
    teaser: '"إنذار مبكر" — مو معناها رسوب أكيد',
    paragraphs: [
      'شو هو الـ Frühwarnung؟ رسالة رسمية من المدرسة ("إنذار مبكر") بتوصل لما يكون في خطر إن الطالب يرسب بمادة معينة.',
      'ليش بتوصل هلق بالتحديد؟ عادة بعد نص السنة، لما يكون لسا في وقت كافي يتحسّن فيه الوضع قبل الشهادة النهائية.',
      'شو لازم تعمل؟ خذها بجدية بس ما تنهار — احجز موعد Sprechstunde مع المعلم، اسأل شو بالضبط ناقص، وفكر بدروس تقوية (Nachhilfe) إذا لزم الأمر.',
      'مهم تعرف: الـ Frühwarnung مو معناها رسوب أكيد — هي فرصة تتحرك من بدري قبل ما يفوت الوقت.',
    ],
  },
  {
    id: 'enrollment',
    icon: '📝',
    title: 'كيف تسجّلي طفلك بالمدرسة (Schulanmeldung)',
    teaser: 'الأوراق المطلوبة، ومدرسة المنطقة (Sprengelschule)',
    paragraphs: [
      'كل عيلة بالنمسا إلها "مدرسة منطقة" (Sprengelschule) — يعني المدرسة الابتدائية الرسمية القريبة من عنوان سكنك، وهي غالباً أول خيار، بس ممكن تسجّلي بمدرسة تانية إذا في مقاعد فاضية.',
      'التسجيل بالـ Volksschule (الابتدائية) بيصير عادة بالربيع (حوالي شباط-آذار) للسنة الدراسية الجاية، والبلدية أو المدرسة بترسل دعوة رسمية للأهل يلي عندهم طفل بعمر التسجيل.',
      'الأوراق يلي غالباً بتحتاجيها: شهادة ميلاد الطفل، إثبات عنوان السكن، ووثيقة تثبت حالة التطعيمات إذا طلبت المدرسة.',
      'إذا لسا مو متأكدة وين تسجّلي أو شو الأوراق المطلوبة بالضبط، اتصلي مباشرة بالمدرسة أو ببلدية منطقتك (Gemeinde) — كل بلدية إلها تفاصيل شوي مختلفة.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    icon: '🗨️',
    title: 'صف دعم اللغة الألمانية (Deutschförderklasse)',
    teaser: 'لو طفلك لسا ما بيحكي ألماني منيح',
    paragraphs: [
      'إذا طفلك وصل حديثاً للنمسا وألمانيته لسا ضعيفة، المدرسة بتحطه بصف خاص (Deutschförderklasse) أو دعم إضافي (Deutschförderkurs) حتى يقوّي اللغة قبل ما يندمج كلياً بالصف العادي.',
      'الطالب بياخد أغلب حصصه بصف الدعم، بس بيشارك مع رفاقه بالصف العادي بمواد متل الرياضة أو الفن يلي ما بتحتاج لغة قوية كتير.',
      'المدة عادة سنة إلى سنتين حسب مستوى الطفل، وبتتقيّم لغته بشكل دوري لتحديد متى جاهز ينتقل كلياً للصف العادي.',
      'هاد الدعم مجاني وحق لكل طفل — لو حسّيتي طفلك محتاج مساعدة إضافية باللغة وما تم اقتراحها عليكم، اسألي المدرسة مباشرة.',
    ],
  },
  {
    id: 'school-holidays',
    icon: '🏖️',
    title: 'العطل المدرسية بالنمسا',
    teaser: 'الصيفية، عيد الميلاد، السيميستر... شو الفرق',
    paragraphs: [
      'العطلة الصيفية (Sommerferien): أطول عطلة، من مطلع تموز لحد نهاية آب تقريباً.',
      'عطلة عيد الميلاد (Weihnachtsferien): أسبوعين تقريباً حوالي أواخر كانون الأول وبداية كانون الثاني.',
      'عطلة السيميستر (Semesterferien): أسبوع بمنتصف شباط، وموعدها بيختلف شوي حسب المحافظة (Bundesland).',
      'عطلة عيد الفصح (Osterferien): أسبوعين تقريباً بالربيع.',
      'فيه كمان أيام عطلة قصيرة متفرقة خلال السنة (Fenstertage وأعياد رسمية) — التواريخ الدقيقة بتختلف كل سنة، فأحسن مرجع هو التقويم الرسمي يلي بتوزّعه المدرسة أو موقع وزارة التربية النمساوية.',
    ],
  },
  {
    id: 'school-costs',
    icon: '💶',
    title: 'تكاليف المدرسة: شو مجاني وشو لأ',
    teaser: 'الكتب المدرسية مجانية، بس في مصاريف تانية',
    paragraphs: [
      'الكتب المدرسية مجانية أو شبه مجانية بفضل برنامج اسمه Schulbuchaktion — بتدفعي مبلغ رمزي بسيط بس مو الثمن الكامل.',
      'التعليم الرسمي بالمدارس الحكومية مجاني، بس في مصاريف إضافية عادة: الرحلات المدرسية (Schulveranstaltungen)، بعض الأدوات المدرسية، وأحياناً وجبات الظهر لو الطفل بدوام ممتد.',
      'إذا الوضع المادي للعيلة صعب، اسألي المدرسة أو البلدية عن إمكانية دعم أو إعفاء من بعض هالمصاريف — كتير مدارس عندها حلول لهيك حالات، بس لازم تسألي وتوضحي وضعك.',
      'أي طلب دفع من المدرسة لازم يوصلك برسالة رسمية واضحة (المبلغ، السبب، آخر موعد) — إذا وصلتك رسالة مو واضحة، اسألي المدرسة تشرحلك قبل ما تدفعي.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    icon: '🕓',
    title: 'الدوام الممتد ورعاية بعد الدوام',
    teaser: 'لو الأهل شغّالين ومحتاجين حل لبعد الدوام',
    paragraphs: [
      'كتير مدارس بتقدّم دوام ممتد (Ganztagsschule) أو رعاية بعد الدوام (Nachmittagsbetreuung) — الطفل بيضل بالمدرسة بعد الدوام الرسمي، بيعمل واجباته وبيشارك بنشاطات، لحد ما يجي أهله ياخدوه.',
      'مو كل مدرسة عندها هالخيار تلقائياً — لازم تسجّلي طفلك فيه لحاله، وأحياناً في مصروف شهري بسيط.',
      'إذا شغلك بيخليك محتاجة هالخدمة، اسألي إدارة المدرسة من بداية السنة الدراسية، لأنه أحياناً عدد الأماكن محدود.',
    ],
  },
  {
    id: 'elternverein',
    icon: '🤝',
    title: 'كيف تشاركي بحياة المدرسة',
    teaser: 'Elternabend، Elternverein، وممثل الأهل',
    paragraphs: [
      'اجتماع الصف (Elternabend): لقاء بيصير عادة مرة أو مرتين بالسنة، بيحكي فيه المعلم عن خطة الصف والمواضيع المهمة لكل الأهل مع بعض.',
      'جمعية الأهل (Elternverein): مجموعة من الأهل المتطوعين بتنظّم نشاطات وبتكون صوت الأهل تجاه إدارة المدرسة — الانضمام عادة اختياري ومجاني أو برسم بسيط جداً.',
      'ممثل أهل الصف (Klassenelternvertreter): أهل بينتخبوا واحد منهم يمثلهم ويوصل ملاحظاتهم لإدارة المدرسة.',
      'المشاركة مش إلزامية، بس هي فرصة كويسة تتعرفي على أهل تانيين وتفهمي أكتر شو عم يصير بمدرسة طفلك — وخصوصاً مفيدة إذا لسا بتتعلمي الألمانية، لأنه بتقدري تستفيدي من خبرة أهل قبلك.',
    ],
  },
  {
    id: 'uebertritt',
    icon: '🔀',
    title: 'الانتقال من مرحلة لمرحلة',
    teaser: 'من Volksschule لـ Mittelschule أو Gymnasium',
    paragraphs: [
      'بآخر سنة بالـ Volksschule (الصف الرابع)، المدرسة بتعطي الأهل "إشعار مدرسي" (Schulnachricht) بمنتصف السنة يوضّح مستوى الطفل ويساعد بقرار المرحلة الجاية.',
      'القرار بين Mittelschule أو Gymnasium/AHS بيرجع للأهل بالنهاية، بس المدرسة بتقدّم توصية بناءً على أداء الطفل — لو حسّيتي محتاجة نصيحة أكتر، اطلبي موعد Sprechstunde مع المعلم لتحكوا بالموضوع.',
      'حتى بعد ما يختار الطفل مسار معين، التنقل بين المسارات (مثلاً من Mittelschule لـ AHS) لسا ممكن بمراحل لاحقة إذا تغيّر وضع الطالب أو رغبته — اسألي إدارة المدرسة الجديدة عن الشروط.',
    ],
  },
];

const de: GuideArticle[] = [
  {
    id: 'school-types',
    icon: '🏫',
    title: 'Schularten in Österreich',
    teaser: 'Volksschule, Mittelschule, Gymnasium — was ist der Unterschied?',
    paragraphs: [
      'Volksschule: 6 bis 10 Jahre, vier Schulstufen, Grundlagen in Lesen, Schreiben und Rechnen.',
      'Mittelschule: 10 bis 14 Jahre, Vorbereitung auf den weiterführenden Bildungsweg.',
      'Gymnasium (AHS): ab 10 Jahren (oder nach der Mittelschule ab 14), höheres akademisches Niveau, direkter Weg zur Universität nach der Matura.',
      'Berufsschule / Lehre: Berufsausbildung parallel zu echter Arbeit bei einem Betrieb.',
      'Ab dem 14. Lebensjahr entscheiden Eltern und Kind gemeinsam über den passenden Bildungsweg.',
    ],
  },
  {
    id: 'grading-system',
    icon: '📊',
    title: 'Notensystem und Zeugnisse',
    teaser: 'Von 1 (sehr gut) bis 5 (nicht genügend)',
    paragraphs: [
      'Die Noten in Österreich reichen von 1 bis 5, wobei 1 die beste Note ist.',
      '1 = Sehr gut, 2 = Gut, 3 = Befriedigend, 4 = Genügend, 5 = Nicht genügend.',
      'Das Zeugnis gibt es zweimal im Jahr: das Semesterzeugnis und das Jahreszeugnis. Das Jahreszeugnis entscheidet, ob das Kind in die nächste Schulstufe aufsteigt.',
    ],
  },
  {
    id: 'sprechstunde',
    icon: '🗣️',
    title: 'Sprechstunde: Wie man mit der Lehrperson spricht',
    teaser: 'Eine feste Zeit für ein direktes Gespräch',
    paragraphs: [
      'Was ist die Sprechstunde? Eine wöchentliche, feste Zeit, zu der Eltern einen Termin vereinbaren und persönlich mit der Lehrperson sprechen können.',
      'Wie vereinbart man einen Termin? Meist über das Mitteilungsheft, per E-Mail an die Schule oder über eine App wie Schoolfox.',
      'Was sollte man vorbereiten? Fragen vorher aufschreiben, wichtige Unterlagen mitbringen und bei Bedarf eine Vertrauensperson zum Übersetzen mitnehmen.',
      'Was kann man fragen? Wie steht es um die schulischen Leistungen, gibt es Fortschritte oder Punkte, die Aufmerksamkeit brauchen, und wie kann man zuhause unterstützen.',
    ],
  },
  {
    id: 'parent-rights',
    icon: '⚖️',
    title: 'Rechte und Pflichten der Eltern',
    teaser: 'Was Eltern dürfen — und was von ihnen erwartet wird',
    paragraphs: [
      'Rechte der Eltern: laufend über die schulische Situation informiert zu werden, am Elternabend teilzunehmen und einen Elternvertreter zu wählen (Elternverein / Klassenelternvertreter).',
      'Pflichten der Eltern: den regelmäßigen Schulbesuch sicherstellen (Fehlzeiten müssen entschuldigt werden), geforderte Formulare rechtzeitig unterschreiben und zurückgeben, und die Hausaufgaben begleiten.',
      'Die Schulpflicht in Österreich gilt von 6 bis 15 Jahren — jedes Kind muss in diesem Alter eine anerkannte Schule besuchen.',
    ],
  },
  {
    id: 'fruehwarnung',
    icon: '🚨',
    title: 'Frühwarnung: Was sie bedeutet und was zu tun ist',
    teaser: 'Eine "frühe Warnung" — kein sicheres Sitzenbleiben',
    paragraphs: [
      'Was ist eine Frühwarnung? Eine offizielle Mitteilung der Schule, wenn die Gefahr besteht, dass ein Kind in einem Fach eine negative Note bekommt.',
      'Warum kommt sie zu diesem Zeitpunkt? Meist nach dem Semester, wenn noch genug Zeit bleibt, die Situation bis zum Jahreszeugnis zu verbessern.',
      'Was sollte man tun? Ernst nehmen, aber nicht in Panik geraten — einen Sprechstunden-Termin vereinbaren, genau nachfragen, was fehlt, und bei Bedarf Nachhilfe in Betracht ziehen.',
      'Wichtig zu wissen: Eine Frühwarnung bedeutet nicht automatisch ein Sitzenbleiben — sie ist eine Chance, frühzeitig zu handeln.',
    ],
  },
  {
    id: 'enrollment',
    icon: '📝',
    title: 'Schulanmeldung: So meldest du dein Kind an',
    teaser: 'Benötigte Unterlagen und die Sprengelschule',
    paragraphs: [
      'Jede Familie in Österreich hat eine zuständige "Sprengelschule" — die nächstgelegene öffentliche Volksschule laut Wohnadresse. Das ist meist die erste Option, eine andere Schule ist bei freien Plätzen aber auch möglich.',
      'Die Anmeldung für die Volksschule findet meist im Frühjahr statt (etwa Februar–März) für das kommende Schuljahr. Gemeinde oder Schule laden Eltern schulpflichtiger Kinder offiziell dazu ein.',
      'Häufig benötigte Unterlagen: Geburtsurkunde des Kindes, Meldezettel/Adressnachweis, und bei Bedarf ein Nachweis des Impfstatus.',
      'Bei Unsicherheit, wo oder mit welchen Unterlagen genau angemeldet wird, am besten direkt bei der Schule oder der Gemeinde nachfragen — die Details unterscheiden sich je nach Gemeinde.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    icon: '🗨️',
    title: 'Deutschförderklasse',
    teaser: 'Wenn dein Kind noch nicht gut Deutsch spricht',
    paragraphs: [
      'Ist ein Kind neu nach Österreich gekommen und spricht noch wenig Deutsch, kommt es meist in eine Deutschförderklasse oder einen Deutschförderkurs, um die Sprache gezielt aufzubauen, bevor es voll in die Regelklasse integriert wird.',
      'Das Kind verbringt die meiste Zeit in der Förderklasse, nimmt aber bei Fächern wie Sport oder Kunst, die weniger Sprache brauchen, gemeinsam mit der Regelklasse teil.',
      'Die Dauer beträgt meist ein bis zwei Jahre, abhängig vom Sprachniveau — es gibt regelmäßige Sprachstandsfeststellungen, die den Übertritt in die Regelklasse bestimmen.',
      'Diese Förderung ist kostenlos und steht jedem Kind zu — falls euer Kind zusätzliche Sprachunterstützung braucht und das noch nicht angesprochen wurde, direkt bei der Schule nachfragen.',
    ],
  },
  {
    id: 'school-holidays',
    icon: '🏖️',
    title: 'Schulferien in Österreich',
    teaser: 'Sommer, Weihnachten, Semester — was ist wann',
    paragraphs: [
      'Sommerferien: die längsten Ferien, von Anfang Juli bis Ende August.',
      'Weihnachtsferien: etwa zwei Wochen um Ende Dezember/Anfang Januar.',
      'Semesterferien: eine Woche Mitte Februar, das genaue Datum variiert je nach Bundesland.',
      'Osterferien: etwa zwei Wochen im Frühjahr.',
      'Zusätzlich gibt es übers Jahr verteilt einzelne freie Tage (Fenstertage, Feiertage) — die genauen Termine ändern sich jährlich, am besten im offiziellen Schulkalender der Schule oder des Bildungsministeriums nachschauen.',
    ],
  },
  {
    id: 'school-costs',
    icon: '💶',
    title: 'Schulkosten: Was kostenlos ist und was nicht',
    teaser: 'Schulbücher sind gratis — aber es gibt weitere Kosten',
    paragraphs: [
      'Schulbücher sind dank der Schulbuchaktion kostenlos oder fast kostenlos — es fällt nur ein kleiner Selbstbehalt an, nicht der volle Preis.',
      'Der Unterricht an öffentlichen Schulen ist kostenlos, aber es gibt oft zusätzliche Kosten: Schulveranstaltungen (Ausflüge), manche Unterrichtsmaterialien, und teils das Mittagessen bei Ganztagsbetreuung.',
      'Bei finanziellen Schwierigkeiten lohnt es sich, bei Schule oder Gemeinde nach Unterstützung oder Befreiung von bestimmten Kosten zu fragen — viele Schulen haben dafür Lösungen, man muss aber aktiv nachfragen und die Situation erklären.',
      'Jede Zahlungsaufforderung der Schule sollte klar und offiziell sein (Betrag, Grund, Frist) — bei einer unklaren Mitteilung vor der Zahlung bei der Schule nachfragen.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    icon: '🕓',
    title: 'Ganztagsschule und Nachmittagsbetreuung',
    teaser: 'Eine Lösung für berufstätige Eltern',
    paragraphs: [
      'Viele Schulen bieten eine Ganztagsschule oder Nachmittagsbetreuung an — das Kind bleibt nach dem regulären Unterricht in der Schule, macht Hausaufgaben und nimmt an Aktivitäten teil, bis es abgeholt wird.',
      'Nicht jede Schule bietet das automatisch an — eine gesonderte Anmeldung ist nötig, und oft fällt ein kleiner monatlicher Beitrag an.',
      'Wer diese Betreuung berufsbedingt braucht, sollte gleich zu Schulbeginn bei der Schulleitung nachfragen, da die Plätze oft begrenzt sind.',
    ],
  },
  {
    id: 'elternverein',
    icon: '🤝',
    title: 'Am Schulleben teilnehmen',
    teaser: 'Elternabend, Elternverein und Klassenelternvertreter',
    paragraphs: [
      'Elternabend: ein Treffen, meist ein- bis zweimal im Jahr, bei dem die Lehrperson den Klassenplan und wichtige Themen mit allen Eltern gemeinsam bespricht.',
      'Elternverein: eine Gruppe freiwilliger Eltern, die Aktivitäten organisiert und die Stimme der Eltern gegenüber der Schulleitung vertritt — die Mitgliedschaft ist meist freiwillig und kostenlos oder sehr günstig.',
      'Klassenelternvertreter: von den Eltern gewählte Person, die ihre Anliegen an die Schulleitung weiterträgt.',
      'Die Teilnahme ist nicht verpflichtend, aber eine gute Gelegenheit, andere Eltern kennenzulernen und mehr über den Schulalltag des eigenen Kindes zu erfahren — besonders hilfreich, wenn man selbst noch Deutsch lernt, da man von der Erfahrung anderer Eltern profitieren kann.',
    ],
  },
  {
    id: 'uebertritt',
    icon: '🔀',
    title: 'Der Übertritt zwischen den Schulstufen',
    teaser: 'Von der Volksschule zu Mittelschule oder Gymnasium',
    paragraphs: [
      'Im letzten Volksschuljahr (4. Klasse) erhalten Eltern zur Semestermitte eine Schulnachricht, die den Leistungsstand des Kindes zeigt und bei der Entscheidung für die nächste Schulstufe hilft.',
      'Die Entscheidung zwischen Mittelschule und Gymnasium/AHS liegt letztlich bei den Eltern, die Schule gibt aber eine Empfehlung basierend auf der Leistung des Kindes ab — bei Unsicherheit lohnt sich ein Sprechstunden-Termin mit der Lehrperson.',
      'Auch nach der ersten Wahl ist ein späterer Wechsel zwischen den Schulformen (z. B. von der Mittelschule ins Gymnasium) möglich, wenn sich die Situation oder die Wünsche des Kindes ändern — die Bedingungen dafür bei der neuen Schule erfragen.',
    ],
  },
];

export function getGuideArticles(lang: Lang): GuideArticle[] {
  return lang === 'de' ? de : ar;
}
