import type { Lang } from '../context/translations';

export interface GuideArticle {
  id: string;
  title: string;
  teaser: string;
  paragraphs: string[];
}

const ar: GuideArticle[] = [
  {
    id: 'school-types',
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
    title: 'كيف تسجّل طفلك بالمدرسة (Schulanmeldung)',
    teaser: 'الأوراق المطلوبة، ومدرسة المنطقة (Sprengelschule)',
    paragraphs: [
      'كل عيلة بالنمسا إلها "مدرسة منطقة" (Sprengelschule) — يعني المدرسة الابتدائية الرسمية القريبة من عنوان سكنك، وهي غالباً أول خيار، بس ممكن تسجّل بمدرسة تانية إذا في مقاعد فاضية.',
      'التسجيل بالـ Volksschule (الابتدائية) بيصير عادة بالربيع (حوالي شباط-آذار) للسنة الدراسية الجاية، والبلدية أو المدرسة بترسل دعوة رسمية للأهل يلي عندهم طفل بعمر التسجيل.',
      'الأوراق يلي غالباً بتحتاجها: شهادة ميلاد الطفل، إثبات عنوان السكن، ووثيقة تثبت حالة التطعيمات إذا طلبت المدرسة.',
      'إذا لسا مو متأكدة وين تسجّل أو شو الأوراق المطلوبة بالضبط، اتصل مباشرة بالمدرسة أو ببلدية منطقتك (Gemeinde) — كل بلدية إلها تفاصيل شوي مختلفة.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    title: 'صف دعم اللغة الألمانية (Deutschförderklasse)',
    teaser: 'لو طفلك لسا ما بيحكي ألماني منيح',
    paragraphs: [
      'إذا طفلك وصل حديثاً للنمسا وألمانيته لسا ضعيفة، المدرسة بتحطه بصف خاص (Deutschförderklasse) أو دعم إضافي (Deutschförderkurs) حتى يقوّي اللغة قبل ما يندمج كلياً بالصف العادي.',
      'الطالب بياخد أغلب حصصه بصف الدعم، بس بيشارك مع رفاقه بالصف العادي بمواد متل الرياضة أو الفن يلي ما بتحتاج لغة قوية كتير.',
      'المدة عادة سنة إلى سنتين حسب مستوى الطفل، وبتتقيّم لغته بشكل دوري لتحديد متى جاهز ينتقل كلياً للصف العادي.',
      'هاد الدعم مجاني وحق لكل طفل — لو حسّيت طفلك محتاج مساعدة إضافية باللغة وما تم اقتراحها عليكم، اسأل المدرسة مباشرة.',
    ],
  },
  {
    id: 'school-holidays',
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
    title: 'تكاليف المدرسة: شو مجاني وشو لأ',
    teaser: 'الكتب المدرسية مجانية، بس في مصاريف تانية',
    paragraphs: [
      'الكتب المدرسية مجانية أو شبه مجانية بفضل برنامج اسمه Schulbuchaktion — بتدفع مبلغ رمزي بسيط بس مو الثمن الكامل.',
      'التعليم الرسمي بالمدارس الحكومية مجاني، بس في مصاريف إضافية عادة: الرحلات المدرسية (Schulveranstaltungen)، بعض الأدوات المدرسية، وأحياناً وجبات الظهر لو الطفل بدوام ممتد.',
      'إذا الوضع المادي للعيلة صعب، اسأل المدرسة أو البلدية عن إمكانية دعم أو إعفاء من بعض هالمصاريف — كتير مدارس عندها حلول لهيك حالات، بس لازم تسأل وتوضح وضعك.',
      'أي طلب دفع من المدرسة لازم يوصلك برسالة رسمية واضحة (المبلغ، السبب، آخر موعد) — إذا وصلتك رسالة مو واضحة، اسأل المدرسة تشرحلك قبل ما تدفع.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    title: 'الدوام الممتد ورعاية بعد الدوام',
    teaser: 'لو الأهل شغّالين ومحتاجين حل لبعد الدوام',
    paragraphs: [
      'كتير مدارس بتقدّم دوام ممتد (Ganztagsschule) أو رعاية بعد الدوام (Nachmittagsbetreuung) — الطفل بيضل بالمدرسة بعد الدوام الرسمي، بيعمل واجباته وبيشارك بنشاطات، لحد ما يجي أهله ياخدوه.',
      'مو كل مدرسة عندها هالخيار تلقائياً — لازم تسجّل طفلك فيه لحاله، وأحياناً في مصروف شهري بسيط.',
      'إذا شغلك بيخليك محتاجة هالخدمة، اسأل إدارة المدرسة من بداية السنة الدراسية، لأنه أحياناً عدد الأماكن محدود.',
    ],
  },
  {
    id: 'elternverein',
    title: 'كيف تشارك بحياة المدرسة',
    teaser: 'Elternabend، Elternverein، وممثل الأهل',
    paragraphs: [
      'اجتماع الصف (Elternabend): لقاء بيصير عادة مرة أو مرتين بالسنة، بيحكي فيه المعلم عن خطة الصف والمواضيع المهمة لكل الأهل مع بعض.',
      'جمعية الأهل (Elternverein): مجموعة من الأهل المتطوعين بتنظّم نشاطات وبتكون صوت الأهل تجاه إدارة المدرسة — الانضمام عادة اختياري ومجاني أو برسم بسيط جداً.',
      'ممثل أهل الصف (Klassenelternvertreter): أهل بينتخبوا واحد منهم يمثلهم ويوصل ملاحظاتهم لإدارة المدرسة.',
      'المشاركة مش إلزامية، بس هي فرصة كويسة تتعرف على أهل تانيين وتفهم أكتر شو عم يصير بمدرسة طفلك — وخصوصاً مفيدة إذا لسا بتتعلم الألمانية، لأنه بتقدر تستفيد من خبرة أهل قبلك.',
    ],
  },
  {
    id: 'uebertritt',
    title: 'الانتقال من مرحلة لمرحلة',
    teaser: 'من Volksschule لـ Mittelschule أو Gymnasium',
    paragraphs: [
      'بآخر سنة بالـ Volksschule (الصف الرابع)، المدرسة بتعطي الأهل "إشعار مدرسي" (Schulnachricht) بمنتصف السنة يوضّح مستوى الطفل ويساعد بقرار المرحلة الجاية.',
      'القرار بين Mittelschule أو Gymnasium/AHS بيرجع للأهل بالنهاية، بس المدرسة بتقدّم توصية بناءً على أداء الطفل — لو حسّيت محتاجة نصيحة أكتر، اطلب موعد Sprechstunde مع المعلم لتحكوا بالموضوع.',
      'حتى بعد ما يختار الطفل مسار معين، التنقل بين المسارات (مثلاً من Mittelschule لـ AHS) لسا ممكن بمراحل لاحقة إذا تغيّر وضع الطالب أو رغبته — اسأل إدارة المدرسة الجديدة عن الشروط.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "الفواتير والتذكير بالدفع (Mahnung)",
    teaser: "مهلة الدفع، شو بيصير إذا فاتت، وشو تعمل إذا ما فيك تدفع",
    paragraphs: [
      "مهلة الدفع بالنمسا عادةً 14 يوم من تاريخ الفاتورة، إلا إذا مكتوب غير هيك. دوّر بالورقة على «zahlbar bis» أو «Fälligkeit» أو «Zahlungsziel» — هي المهلة.",
      "إذا فاتت المهلة، بتوصلك «Mahnung» (تذكير). عادةً بيجي تذكير أول وبعدين تاني. بهي المرحلة الموضوع لسا بسيط وبينحل بدفعة.",
      "إذا ضلّيت ما دفعت، الملف بيروح لشركة تحصيل (Inkasso) — وهون بتزيد التكاليف كتير، لأنو بينضاف رسوم تحصيل وفوائد تأخير (للمستهلكين 4% بالسنة حسب القانون). لهيك أرخص شي إنك تتصرف بدري.",
      "أهم نصيحة: إذا ما معك تدفع، **تواصل مع الجهة قبل ما تفوت المهلة** واطلب تقسيط (Ratenzahlung). معظم الشركات بتوافق، بس لازم يكون الطلب مكتوب (إيميل بيكفي). تجاهل الرسالة بيخلي المبلغ يكبر، ما بيخليه يروح.",
      "في مساعدة مجانية وسرّية: «Schuldenberatung» موجودة بكل ولاية نمساوية، معترف فيها من الدولة، وبتساعدك تنظّم ديونك بدون مقابل.",
      "احتفظ بالفاتورة الأصلية وبإثبات الدفع (سكرين شوت من البنك بيكفي) لحد ما تتأكد إنو الموضوع خلص.",
    ],
  },
  {
    id: "termine",
    title: "المواعيد: دكتور، دائرة، مدرسة",
    teaser: "شو تاخد معك، وشو بيصير إذا ما رحت",
    paragraphs: [
      "موعد الدكتور: خد معك الـ e-card دايماً. وإذا ما فيك تروح، ألغِ قبل 24 ساعة على الأقل — في عيادات بتحاسب على الموعد الضايع.",
      "موعد بدائرة رسمية (AMS، المجستْرات، MA 35، مكتب الضرائب): خد معك **الرسالة نفسها** وهوية سارية. الرسالة عادةً بتعدّد شو لازم تجيب معك — جيب كل شي مذكور، حتى لو بيبيّن مو ضروري.",
      "ما تروح بدون موعد إذا الرسالة عم تحدد وقت — كتير دوائر ما بتستقبل بدون موعد.",
      "إذا ما فيك تحضر، خبرهم **قبل** الموعد (تلفون أو إيميل). غياب بدون خبر ممكن تكون إلو نتايج فعلية — مثلاً عند الـ AMS ممكن يتوقف الدعم المالي مؤقتاً.",
      "اللغة: من حقك تجيب معك حدا يترجملك. وبعض الدوائر بتأمّن مترجم إذا طلبت مسبقاً — اسأل وقت ما تاخد الموعد.",
      "سجّل الموعد فوراً لما توصلك الرسالة. Brifo بيقدر يحفظه من الصورة ويذكّرك فيه.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "الرسائل الرسمية والمهل (RSa / RSb)",
    teaser: "ليش المهلة بتبلّش قبل ما تستلم الرسالة — وشو تعمل",
    paragraphs: [
      "الرسائل الرسمية المهمة بتجي كـ «Einschreiben» بشريط ملوّن: RSa (أزرق) و RSb (بيج). هدول إلهم مفعول قانوني، مو رسائل عادية.",
      "**النقطة الأهم:** إذا ما كنت بالبيت، الرسالة بتنحفظ بمكتب البريد (Hinterlegung) — والمهلة عادةً بتبلّش من **أول يوم صارت فيه جاهزة للاستلام**، مو من اليوم اللي رحت جبتها فيه. يعني ممكن تكون خسرت أيام وإنت ما بتعرف. روح جيبها بسرعة.",
      "ما ترمي الظرف. تاريخ الاستلام مطبوع عليه، وهو اللي بيثبت متى بلّشت المهلة.",
      "دوّر بالرسالة على كلمات: «Frist»، «binnen»، «innerhalb von» — بعدها بيكون مكتوب كم عندك وقت. مهل الاعتراض عادةً أسبوعين أو أربع أسابيع.",
      "إذا مو موافقة على القرار، عادةً بيكون مكتوب بآخر الرسالة طريق الاعتراض (Einspruch أو Beschwerde) والمهلة. إذا فاتت المهلة، القرار بيصير نهائي بمعظم الحالات — لهيك المهلة أهم من محتوى الرسالة.",
      "في استشارة مجانية: غرفة العمل (Arbeiterkammer) للأعضاء، وديوان المظالم (Volksanwaltschaft)، ومراكز استشارة المهاجرين بكل ولاية.",
      "ملاحظة: هالمعلومات عامة للتوضيح فقط، وما بتغني عن استشارة قانونية بالحالات الجدّية.",
    ],
  },
];

const de: GuideArticle[] = [
  {
    id: 'school-types',
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
    title: 'Der Übertritt zwischen den Schulstufen',
    teaser: 'Von der Volksschule zu Mittelschule oder Gymnasium',
    paragraphs: [
      'Im letzten Volksschuljahr (4. Klasse) erhalten Eltern zur Semestermitte eine Schulnachricht, die den Leistungsstand des Kindes zeigt und bei der Entscheidung für die nächste Schulstufe hilft.',
      'Die Entscheidung zwischen Mittelschule und Gymnasium/AHS liegt letztlich bei den Eltern, die Schule gibt aber eine Empfehlung basierend auf der Leistung des Kindes ab — bei Unsicherheit lohnt sich ein Sprechstunden-Termin mit der Lehrperson.',
      'Auch nach der ersten Wahl ist ein späterer Wechsel zwischen den Schulformen (z. B. von der Mittelschule ins Gymnasium) möglich, wenn sich die Situation oder die Wünsche des Kindes ändern — die Bedingungen dafür bei der neuen Schule erfragen.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "Rechnungen und Mahnungen",
    teaser: "Zahlungsfrist, was bei Verzug passiert, und was tun, wenn das Geld fehlt",
    paragraphs: [
      "Die Zahlungsfrist beträgt in Österreich meist 14 Tage ab Rechnungsdatum, sofern nichts anderes angegeben ist. Suchen Sie auf dem Schreiben nach „zahlbar bis“, „Fälligkeit“ oder „Zahlungsziel“.",
      "Wird die Frist versäumt, kommt eine Mahnung — üblicherweise eine erste und dann eine zweite. In dieser Phase lässt sich die Sache noch einfach durch Zahlung erledigen.",
      "Bleibt die Rechnung offen, geht der Fall an ein Inkassobüro. Dort steigen die Kosten deutlich, weil Inkassospesen und Verzugszinsen dazukommen (für Verbraucher:innen gesetzlich 4 % pro Jahr). Früh zu reagieren ist deshalb immer billiger.",
      "Der wichtigste Rat: Wenn das Geld fehlt, melden Sie sich **vor Ablauf der Frist** beim Absender und bitten Sie um Ratenzahlung. Die meisten Unternehmen stimmen zu, verlangen es aber schriftlich — eine E-Mail genügt. Ignorieren lässt den Betrag wachsen, nicht verschwinden.",
      "Es gibt kostenlose und vertrauliche Hilfe: die staatlich anerkannte Schuldenberatung gibt es in jedem Bundesland.",
      "Bewahren Sie die Originalrechnung und den Zahlungsnachweis (ein Screenshot aus dem Online-Banking reicht) auf, bis die Sache erledigt ist.",
    ],
  },
  {
    id: "termine",
    title: "Termine: Arzt, Amt, Schule",
    teaser: "Was mitnehmen — und was passiert, wenn Sie nicht hingehen",
    paragraphs: [
      "Arzttermin: Nehmen Sie immer die e-card mit. Wenn Sie nicht können, sagen Sie mindestens 24 Stunden vorher ab — manche Ordinationen verrechnen versäumte Termine.",
      "Amtstermin (AMS, Magistrat, MA 35, Finanzamt): Nehmen Sie **das Schreiben selbst** und einen gültigen Ausweis mit. Im Brief steht meist, was mitzubringen ist — bringen Sie alles Genannte mit, auch wenn es unnötig wirkt.",
      "Kommen Sie nicht ohne Termin, wenn im Schreiben eine Uhrzeit steht — viele Stellen nehmen ohne Termin niemanden an.",
      "Wenn Sie nicht kommen können, sagen Sie **vorher** ab (Telefon oder E-Mail). Unentschuldigtes Fernbleiben kann echte Folgen haben — beim AMS etwa kann die Geldleistung vorübergehend eingestellt werden.",
      "Sprache: Sie dürfen jemanden zum Dolmetschen mitbringen. Manche Stellen stellen auf Anfrage selbst eine Dolmetschung bereit — fragen Sie bei der Terminvereinbarung.",
      "Tragen Sie den Termin sofort ein, wenn das Schreiben kommt. Brifo kann ihn aus dem Foto übernehmen und Sie daran erinnern.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "Behördenbriefe und Fristen (RSa / RSb)",
    teaser: "Warum die Frist oft schon läuft, bevor Sie den Brief in der Hand haben",
    paragraphs: [
      "Wichtige behördliche Schreiben kommen als Einschreiben mit farbigem Streifen: RSa (blau) und RSb (beige). Sie haben rechtliche Wirkung und sind keine gewöhnliche Post.",
      "**Der wichtigste Punkt:** Sind Sie nicht zu Hause, wird der Brief bei der Post hinterlegt — und die Frist beginnt in der Regel mit dem **ersten Tag der Abholbereitschaft**, nicht mit dem Tag, an dem Sie ihn tatsächlich holen. Es können also schon Tage verstrichen sein. Holen Sie hinterlegte Briefe rasch ab.",
      "Werfen Sie das Kuvert nicht weg. Darauf steht das Datum, das den Fristbeginn belegt.",
      "Suchen Sie im Schreiben nach „Frist“, „binnen“ oder „innerhalb von“ — dort steht, wie viel Zeit Sie haben. Rechtsmittelfristen betragen häufig zwei oder vier Wochen.",
      "Sind Sie mit der Entscheidung nicht einverstanden, steht am Ende meist der Weg dorthin (Einspruch oder Beschwerde) samt Frist. Läuft die Frist ab, wird die Entscheidung in den meisten Fällen endgültig — die Frist ist daher wichtiger als der Inhalt.",
      "Kostenlose Beratung gibt es unter anderem bei der Arbeiterkammer (für Mitglieder), bei der Volksanwaltschaft und bei Migrationsberatungsstellen in jedem Bundesland.",
      "Hinweis: Das sind allgemeine Informationen zur Orientierung und ersetzen in ernsten Fällen keine Rechtsberatung.",
    ],
  },
];

const tr: GuideArticle[] = [
  {
    id: 'school-types',
    title: 'Avusturya\'da okul türleri',
    teaser: 'Volksschule, Mittelschule, Gymnasium — aralarındaki fark ne?',
    paragraphs: [
      'Volksschule (ilkokul): 6-10 yaş arası, dört sınıf, okuma, yazma ve temel matematik öğretilir.',
      'Mittelschule (ortaokul): 10-14 yaş arası, öğrenciyi bir sonraki aşamaya (akademik veya mesleki) hazırlar.',
      'Gymnasium/AHS: 10 yaşından itibaren (veya Mittelschule\'den sonra 14 yaşında), daha yüksek akademik seviye, Matura\'dan sonra doğrudan üniversiteye açılan yol.',
      'Berufsschule / Lehre (meslek okulu ve çıraklık): bir işverende gerçek çalışmayla paralel yürüyen mesleki eğitim.',
      '14 yaşından sonra, ebeveyn ve öğrenci birlikte çocuğun ilgi ve becerilerine en uygun yolu seçer.',
    ],
  },
  {
    id: 'grading-system',
    title: 'Not sistemi ve karneler',
    teaser: '1 (pekiyi) ile 5 (kaldı) arası — her rakam ne anlama gelir',
    paragraphs: [
      'Avusturya\'da notlar 1 ile 5 arasındadır, 1 en iyi nottur.',
      '1 = Sehr gut (pekiyi), 2 = Gut (iyi), 3 = Befriedigend (orta), 4 = Genügend (geçer), 5 = Nicht genügend (kaldı).',
      'Karne (Zeugnis) yılda iki kez verilir: yarıyıl karnesi (Semesterzeugnis) ve yıl sonu karnesi (Jahreszeugnis). Öğrencinin bir üst sınıfa geçip geçmeyeceğine yıl sonu karnesi karar verir.',
    ],
  },
  {
    id: 'sprechstunde',
    title: 'Sprechstunde: Öğretmenle nasıl görüşülür',
    teaser: 'Ebeveynler için öğretmenle birebir görüşme zamanı',
    paragraphs: [
      'Sprechstunde nedir? Ebeveynlerin randevu alıp öğretmenle çocuklarının durumu hakkında yüz yüze konuşabildiği haftalık sabit bir zaman dilimi.',
      'Randevu nasıl alınır? Genellikle not defteri (Mitteilungsheft), okul e-postası veya Schoolfox gibi bir uygulama üzerinden.',
      'Randevu öncesi ne hazırlanmalı? Sorularınızı önceden yazın, önemli belgeleri hazırlayın; Almancanız yetersizse yanınıza tercüme edebilecek birini alabilirsiniz.',
      'Görüşmede ne sorulmalı? Çocuğunuzun sınıftaki performansı, bir gelişme var mı yoksa dikkat gerektiren bir durum mu var, ve evde nasıl destek olabileceğiniz.',
    ],
  },
  {
    id: 'parent-rights',
    title: 'Ebeveynlerin hakları ve sorumlulukları',
    teaser: 'Ebeveyn olarak hakların neler, senden ne bekleniyor',
    paragraphs: [
      'Ebeveyn hakları: çocuğunuzun okul durumu hakkında düzenli bilgi almak, sınıf toplantısına (Elternabend) katılmak, ve tüm ebeveynler adına konuşan bir temsilci (Elternverein / Klassenelternvertreter) seçmek.',
      'Ebeveyn sorumlulukları: çocuğunuzun düzenli okula devamını sağlamak (her devamsızlığın resmi bir mazereti olmalı), okuldan istenen belgeleri zamanında imzalayıp geri göndermek, ve ev ödevlerini takip etmek.',
      'Avusturya\'da zorunlu eğitim (Schulpflicht) 6-15 yaş arasıdır — bu yaş aralığındaki her çocuk resmi bir okula devam etmek zorundadır.',
    ],
  },
  {
    id: 'fruehwarnung',
    title: 'Frühwarnung: Ne anlama gelir, ne yapılmalı',
    teaser: '"Erken uyarı" — kesin sınıfta kalma anlamına gelmez',
    paragraphs: [
      'Frühwarnung nedir? Bir öğrencinin belirli bir dersten kalma riski olduğunda okuldan gelen resmi bir bildirim ("erken uyarı").',
      'Neden tam bu zamanda gelir? Genellikle yarıyıl sonrasında, yıl sonu karnesinden önce durumu düzeltecek yeterli zaman kalmışken gönderilir.',
      'Ne yapılmalı? Ciddiye alın ama paniğe kapılmayın — öğretmenle bir Sprechstunde randevusu alın, tam olarak neyin eksik olduğunu sorun, gerekirse özel ders (Nachhilfe) düşünün.',
      'Bilinmesi gereken önemli nokta: Frühwarnung kesin sınıfta kalma anlamına gelmez — vakit varken harekete geçme fırsatıdır.',
    ],
  },
  {
    id: 'enrollment',
    title: 'Çocuğunuzu okula nasıl kaydettirirsiniz (Schulanmeldung)',
    teaser: 'Gerekli belgeler ve bölge okulu (Sprengelschule)',
    paragraphs: [
      'Avusturya\'daki her ailenin bir "bölge okulu" (Sprengelschule) vardır — yani ev adresinize en yakın resmi ilkokul. Bu genellikle ilk seçenektir, ancak boş kontenjan varsa başka bir okula da kayıt yaptırabilirsiniz.',
      'Volksschule (ilkokul) kaydı genellikle ilkbaharda (yaklaşık Şubat-Mart) bir sonraki eğitim yılı için yapılır; belediye veya okul, kayıt yaşındaki çocuğu olan aileleri resmi olarak davet eder.',
      'Genellikle istenen belgeler: çocuğun doğum belgesi, ikametgah belgesi, ve okul isterse aşı durumunu gösteren bir belge.',
      'Nereye veya hangi belgelerle kayıt yaptıracağınızdan emin değilseniz, doğrudan okulu veya bölgenizin belediyesini (Gemeinde) arayın — her belediyenin detayları biraz farklı olabilir.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    title: 'Almanca destek sınıfı (Deutschförderklasse)',
    teaser: 'Çocuğunuz henüz iyi Almanca konuşmuyorsa',
    paragraphs: [
      'Çocuğunuz Avusturya\'ya yeni geldiyse ve Almancası henüz zayıfsa, okul onu normal sınıfa tam olarak katılmadan önce dili güçlendirmesi için özel bir destek sınıfına (Deutschförderklasse) veya ek desteğe (Deutschförderkurs) yerleştirir.',
      'Öğrenci derslerinin çoğunu destek sınıfında alır, ancak spor veya sanat gibi fazla dil gerektirmeyen derslerde normal sınıf arkadaşlarıyla birlikte olur.',
      'Süre genellikle çocuğun seviyesine göre bir ila iki yıldır; dil düzeyi düzenli olarak değerlendirilerek normal sınıfa ne zaman tam olarak geçebileceği belirlenir.',
      'Bu destek ücretsizdir ve her çocuğun hakkıdır — çocuğunuzun dil konusunda ek desteğe ihtiyacı olduğunu düşünüyorsanız ve bu size önerilmediyse, doğrudan okula sorun.',
    ],
  },
  {
    id: 'school-holidays',
    title: 'Avusturya\'da okul tatilleri',
    teaser: 'Yaz, Noel, yarıyıl... aralarındaki fark',
    paragraphs: [
      'Yaz tatili (Sommerferien): en uzun tatil, Temmuz başından Ağustos sonuna kadar.',
      'Noel tatili (Weihnachtsferien): Aralık sonu-Ocak başı civarında yaklaşık iki hafta.',
      'Yarıyıl tatili (Semesterferien): Şubat ortasında bir hafta, tam tarihi eyalete (Bundesland) göre değişir.',
      'Paskalya tatili (Osterferien): ilkbaharda yaklaşık iki hafta.',
      'Yıl içine dağılmış kısa tatil günleri de vardır (Fenstertage ve resmi tatiller) — kesin tarihler her yıl değişir, en güvenilir kaynak okulun dağıttığı resmi takvim veya Avusturya Eğitim Bakanlığı\'nın web sitesidir.',
    ],
  },
  {
    id: 'school-costs',
    title: 'Okul masrafları: neler ücretsiz, neler değil',
    teaser: 'Ders kitapları ücretsiz, ama başka masraflar da var',
    paragraphs: [
      'Ders kitapları, Schulbuchaktion adlı bir program sayesinde ücretsiz veya neredeyse ücretsizdir — tam fiyat değil, küçük sembolik bir katkı payı ödersiniz.',
      'Devlet okullarında resmi eğitim ücretsizdir, ancak genellikle ek masraflar olur: okul gezileri (Schulveranstaltungen), bazı okul malzemeleri, ve tam gün bakımdaysa bazen öğle yemeği.',
      'Ailenin maddi durumu zorsa, bazı bu masraflardan destek veya muafiyet olup olmadığını okula veya belediyeye sorun — birçok okulun bu tür durumlar için çözümleri vardır, ama durumu açıklayıp sormanız gerekir.',
      'Okuldan gelen her ödeme talebi net ve resmi bir mektupla gelmelidir (tutar, sebep, son tarih) — belirsiz bir mesaj alırsanız, ödemeden önce okuldan açıklama isteyin.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    title: 'Tam gün okul ve öğleden sonra bakımı',
    teaser: 'Çalışan ebeveynler için bir çözüm',
    paragraphs: [
      'Birçok okul tam gün eğitim (Ganztagsschule) veya öğleden sonra bakımı (Nachmittagsbetreuung) sunar — çocuk resmi ders bitiminden sonra okulda kalır, ödevlerini yapar ve etkinliklere katılır, ailesi onu almaya gelene kadar.',
      'Her okul bunu otomatik olarak sunmaz — çocuğunuzu ayrıca bu programa kaydettirmeniz gerekir ve genellikle küçük bir aylık ücret alınır.',
      'İşiniz nedeniyle bu hizmete ihtiyacınız varsa, kontenjan genellikle sınırlı olduğundan eğitim yılının başında okul yönetimine sorun.',
    ],
  },
  {
    id: 'elternverein',
    title: 'Okul hayatına nasıl katılırsınız',
    teaser: 'Elternabend, Elternverein ve ebeveyn temsilcisi',
    paragraphs: [
      'Sınıf toplantısı (Elternabend): genellikle yılda bir veya iki kez yapılan, öğretmenin sınıf planını ve önemli konuları tüm ebeveynlerle birlikte konuştuğu bir buluşma.',
      'Ebeveyn derneği (Elternverein): etkinlikler düzenleyen ve ebeveynlerin sesini okul yönetimine ileten gönüllü ebeveyn grubu — katılım genellikle isteğe bağlı ve ücretsiz ya da çok düşük bir ücretle olur.',
      'Sınıf ebeveyn temsilcisi (Klassenelternvertreter): ebeveynlerin kendi aralarından seçtiği, görüşlerini okul yönetimine ileten kişi.',
      'Katılım zorunlu değildir, ama diğer ebeveynleri tanımak ve çocuğunuzun okulunda neler olup bittiğini daha iyi anlamak için iyi bir fırsattır — özellikle Almanca öğreniyorsanız, diğer ebeveynlerin deneyiminden faydalanabilirsiniz.',
    ],
  },
  {
    id: 'uebertritt',
    title: 'Bir aşamadan diğerine geçiş',
    teaser: 'Volksschule\'den Mittelschule veya Gymnasium\'a',
    paragraphs: [
      'Volksschule\'nin son yılında (4. sınıf), okul yıl ortasında ailelere çocuğun seviyesini gösteren ve bir sonraki aşama kararına yardımcı olan bir "okul bildirimi" (Schulnachricht) verir.',
      'Mittelschule veya Gymnasium/AHS arasındaki karar sonuçta ebeveynlere aittir, ancak okul çocuğun performansına dayalı bir öneri sunar — daha fazla tavsiyeye ihtiyacınız varsa, öğretmenle bir Sprechstunde randevusu isteyin.',
      'Çocuk bir yol seçtikten sonra bile, durumu veya isteği değişirse daha sonraki aşamalarda yollar arasında geçiş (örneğin Mittelschule\'den AHS\'ye) hâlâ mümkündür — yeni okulun koşullarını sorun.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "Faturalar ve ödeme hatırlatmaları (Mahnung)",
    teaser: "Ödeme süresi, gecikince ne olur ve para yoksa ne yapmalı",
    paragraphs: [
      "Avusturya'da ödeme süresi, aksi belirtilmedikçe genellikle fatura tarihinden itibaren 14 gündür. Belgede „zahlbar bis“, „Fälligkeit“ veya „Zahlungsziel“ ifadelerini arayın.",
      "Süre kaçırılırsa bir „Mahnung“ (hatırlatma) gelir — genelde önce birinci, sonra ikinci. Bu aşamada konu ödeme yapılarak kolayca kapanır.",
      "Fatura ödenmezse dosya bir tahsilat bürosuna (Inkasso) gider. Orada masraflar belirgin şekilde artar; tahsilat ücretleri ve gecikme faizi eklenir (tüketiciler için yasal olarak yılda %4). Bu yüzden erken hareket etmek her zaman daha ucuzdur.",
      "En önemli tavsiye: Para yoksa, **süre dolmadan önce** gönderene ulaşın ve taksitlendirme (Ratenzahlung) isteyin. Çoğu şirket kabul eder ama yazılı talep ister — bir e-posta yeterlidir. Görmezden gelmek tutarı büyütür, yok etmez.",
      "Ücretsiz ve gizli yardım var: devletçe tanınan „Schuldenberatung“ her eyalette bulunur.",
      "Asıl faturayı ve ödeme kanıtını (internet bankacılığından bir ekran görüntüsü yeterli) konu kapanana kadar saklayın.",
    ],
  },
  {
    id: "termine",
    title: "Randevular: doktor, resmi daire, okul",
    teaser: "Yanınıza ne almalı — ve gitmezseniz ne olur",
    paragraphs: [
      "Doktor randevusu: e-card'ı her zaman yanınıza alın. Gidemeyecekseniz en az 24 saat önce iptal edin — bazı muayenehaneler kaçırılan randevu için ücret alır.",
      "Resmi daire randevusu (AMS, Magistrat, MA 35, vergi dairesi): **Mektubun kendisini** ve geçerli bir kimlik alın. Mektupta genellikle ne getirmeniz gerektiği yazar — gereksiz görünse bile listelenen her şeyi götürün.",
      "Mektupta bir saat yazıyorsa randevusuz gitmeyin — birçok kurum randevusuz kimseyi kabul etmez.",
      "Gelemeyecekseniz **önceden** haber verin (telefon veya e-posta). Habersiz gitmemenin gerçek sonuçları olabilir — örneğin AMS'de ödeme geçici olarak durdurulabilir.",
      "Dil: Tercüme için yanınızda birini getirebilirsiniz. Bazı kurumlar talep üzerine tercüman sağlar — randevu alırken sorun.",
      "Mektup gelir gelmez randevuyu kaydedin. Brifo bunu fotoğraftan alıp size hatırlatabilir.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "Resmi yazılar ve süreler (RSa / RSb)",
    teaser: "Süre neden siz mektubu elinize almadan önce başlar",
    paragraphs: [
      "Önemli resmi yazılar renkli şeritli iadeli taahhütlü olarak gelir: RSa (mavi) ve RSb (bej). Bunların hukuki sonuçları vardır, sıradan posta değildirler.",
      "**En önemli nokta:** Evde değilseniz mektup postanede saklanır (Hinterlegung) ve süre genellikle **teslim alınabilir hale geldiği ilk günden** başlar, sizin gidip aldığınız günden değil. Yani farkında olmadan günler geçmiş olabilir. Saklanan mektupları hemen alın.",
      "Zarfı atmayın. Sürenin başlangıcını kanıtlayan tarih üzerindedir.",
      "Yazıda „Frist“, „binnen“ veya „innerhalb von“ kelimelerini arayın — ne kadar süreniz olduğu orada yazar. İtiraz süreleri sıklıkla iki veya dört haftadır.",
      "Karara katılmıyorsanız, genelde yazının sonunda itiraz yolu (Einspruch veya Beschwerde) ve süresi belirtilir. Süre dolarsa karar çoğu durumda kesinleşir — bu yüzden süre, içerikten daha önemlidir.",
      "Ücretsiz danışmanlık: İşçi Odası (Arbeiterkammer, üyeler için), Volksanwaltschaft ve her eyaletteki göçmen danışma merkezleri.",
      "Not: Bunlar yalnızca yol gösterici genel bilgilerdir ve ciddi durumlarda hukuki danışmanlığın yerini tutmaz.",
    ],
  },
];

const fa: GuideArticle[] = [
  {
    id: 'school-types',
    title: 'انواع مدارس در اتریش',
    teaser: 'Volksschule، Mittelschule، Gymnasium — چه فرقی دارند؟',
    paragraphs: [
      'Volksschule (دبستان): از ۶ تا ۱۰ سالگی، چهار پایه، پایه‌های خواندن، نوشتن و حساب اولیه.',
      'Mittelschule (مدرسه راهنمایی): از ۱۰ تا ۱۴ سالگی، آماده‌سازی دانش‌آموز برای مسیر تحصیلی بعدی (دانشگاهی یا حرفه‌ای).',
      'Gymnasium/AHS: از ۱۰ سالگی (یا بعد از Mittelschule از ۱۴ سالگی)، سطح آکادمیک بالاتر، و مسیر مستقیم به دانشگاه بعد از Matura.',
      'Berufsschule / Lehre (مدرسه حرفه‌ای و کارآموزی): آموزش حرفه‌ای همراه با کار واقعی نزد یک کارفرما.',
      'بعد از ۱۴ سالگی، والدین و دانش‌آموز با هم مسیر مناسب را بر اساس علاقه و توانایی‌های دانش‌آموز انتخاب می‌کنند.',
    ],
  },
  {
    id: 'grading-system',
    title: 'سیستم نمره‌دهی و کارنامه‌ها',
    teaser: 'از ۱ (عالی) تا ۵ (مردود) — معنی هر عدد چیست',
    paragraphs: [
      'نمرات در اتریش از ۱ تا ۵ است، و ۱ بهترین نمره است.',
      '۱ = Sehr gut (عالی)، ۲ = Gut (خوب)، ۳ = Befriedigend (متوسط)، ۴ = Genügend (قبول)، ۵ = Nicht genügend (مردود).',
      'کارنامه (Zeugnis) دو بار در سال داده می‌شود: کارنامه نیم‌سال (Semesterzeugnis) و کارنامه پایان سال (Jahreszeugnis). کارنامه پایان سال تعیین می‌کند که دانش‌آموز به پایه بعدی می‌رود یا نه.',
    ],
  },
  {
    id: 'sprechstunde',
    title: 'Sprechstunde: چطور با معلم صحبت کنیم',
    teaser: 'زمانی مشخص برای گفتگوی مستقیم والدین با معلم',
    paragraphs: [
      'Sprechstunde چیست؟ یک زمان ثابت هفتگی که والدین می‌توانند وقت بگیرند و رو در رو با معلم درباره وضعیت فرزندشان صحبت کنند.',
      'چطور وقت بگیریم؟ معمولاً از طریق دفترچه یادداشت (Mitteilungsheft)، ایمیل مدرسه، یا اپلیکیشنی مثل Schoolfox.',
      'قبل از جلسه چه چیزی آماده کنیم؟ سؤالاتت رو از قبل بنویس، مدارک مهم رو آماده کن، و اگه آلمانیت کافی نیست، می‌تونی یک نفر رو برای ترجمه همراهت ببری.',
      'در جلسه چه بپرسیم؟ عملکرد فرزندت در کلاس چطوره، پیشرفتی هست یا نکته‌ای که نیاز به توجه بیشتر داره، و چطور می‌تونی در خانه کمکش کنی.',
    ],
  },
  {
    id: 'parent-rights',
    title: 'حقوق و وظایف والدین',
    teaser: 'به‌عنوان والدین چه حقی داری، و چه چیزی از تو انتظار می‌ره',
    paragraphs: [
      'حقوق والدین: مطلع شدن مداوم از وضعیت تحصیلی فرزند، شرکت در جلسه کلاس (Elternabend)، و انتخاب نماینده والدین (Elternverein / Klassenelternvertreter) که به نمایندگی همه والدین صحبت کنه.',
      'وظایف والدین: اطمینان از حضور منظم فرزند در مدرسه (هر غیبتی باید عذر رسمی داشته باشه)، امضا و برگرداندن به‌موقع فرم‌های درخواستی مدرسه، و پیگیری تکالیف مدرسه.',
      'تحصیل اجباری (Schulpflicht) در اتریش از ۶ تا ۱۵ سالگی است — یعنی هر کودکی در این سن باید به یک مدرسه رسمی بره.',
    ],
  },
  {
    id: 'fruehwarnung',
    title: 'Frühwarnung: یعنی چی و چه باید کرد',
    teaser: '"هشدار زودهنگام" — به معنای مردودی قطعی نیست',
    paragraphs: [
      'Frühwarnung چیست؟ اطلاعیه رسمی مدرسه ("هشدار زودهنگام") وقتی که خطر افت نمره یک دانش‌آموز در یک درس وجود داره.',
      'چرا دقیقاً این زمان می‌رسه؟ معمولاً بعد از نیم‌سال، وقتی هنوز زمان کافی برای بهبود وضعیت قبل از کارنامه پایان سال هست.',
      'چه باید کرد؟ جدی بگیر ولی نگران نشو — یک وقت Sprechstunde با معلم بگیر، دقیقاً بپرس چی کم داره، و در صورت نیاز به کلاس تقویتی (Nachhilfe) فکر کن.',
      'نکته مهم: Frühwarnung به معنای مردودی قطعی نیست — فرصتیه برای اقدام زودهنگام قبل از اینکه دیر بشه.',
    ],
  },
  {
    id: 'enrollment',
    title: 'چطور فرزندت را در مدرسه ثبت‌نام کنی (Schulanmeldung)',
    teaser: 'مدارک لازم، و مدرسه منطقه (Sprengelschule)',
    paragraphs: [
      'هر خانواده در اتریش یک "مدرسه منطقه" (Sprengelschule) داره — یعنی نزدیک‌ترین دبستان رسمی به آدرس محل سکونت. این معمولاً اولین گزینه‌ست، ولی در صورت وجود جای خالی می‌تونی مدرسه دیگه‌ای هم انتخاب کنی.',
      'ثبت‌نام در Volksschule (دبستان) معمولاً در بهار (تقریباً فوریه-مارس) برای سال تحصیلی بعد انجام می‌شه، و شهرداری یا مدرسه رسماً از خانواده‌های دارای کودک در سن ثبت‌نام دعوت می‌کنه.',
      'مدارکی که معمولاً لازمه: شناسنامه کودک، مدرک آدرس محل سکونت، و در صورت درخواست مدرسه، مدرکی از وضعیت واکسیناسیون.',
      'اگه هنوز مطمئن نیستی کجا یا با چه مدارکی ثبت‌نام کنی، مستقیم با مدرسه یا شهرداری منطقه‌ات (Gemeinde) تماس بگیر — جزئیات هر شهرداری کمی متفاوته.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    title: 'کلاس تقویت زبان آلمانی (Deutschförderklasse)',
    teaser: 'اگه فرزندت هنوز آلمانی خوبی صحبت نمی‌کنه',
    paragraphs: [
      'اگه فرزندت تازه به اتریش اومده و آلمانیش هنوز ضعیفه، مدرسه اونو در یک کلاس ویژه (Deutschförderklasse) یا حمایت اضافی (Deutschförderkurs) قرار می‌ده تا قبل از ادغام کامل در کلاس عادی، زبان رو تقویت کنه.',
      'دانش‌آموز بیشتر ساعات درسی رو در کلاس تقویتی می‌گذرونه، ولی در درس‌هایی مثل ورزش یا هنر که نیاز کمتری به زبان دارن، با همکلاسی‌های عادیش همراهه.',
      'مدت زمان معمولاً یک تا دو سال بسته به سطح کودکه، و سطح زبانش به‌طور مرتب ارزیابی می‌شه تا مشخص بشه کی آماده انتقال کامل به کلاس عادیه.',
      'این حمایت رایگانه و حق هر کودکیه — اگه فکر می‌کنی فرزندت به حمایت اضافی زبانی نیاز داره و بهتون پیشنهاد نشده، مستقیم از مدرسه بپرس.',
    ],
  },
  {
    id: 'school-holidays',
    title: 'تعطیلات مدارس در اتریش',
    teaser: 'تابستان، کریسمس، نیم‌سال... فرقشون چیه',
    paragraphs: [
      'تعطیلات تابستان (Sommerferien): طولانی‌ترین تعطیلات، از اوایل ژوئیه تا اواخر اوت.',
      'تعطیلات کریسمس (Weihnachtsferien): تقریباً دو هفته، حوالی اواخر دسامبر و اوایل ژانویه.',
      'تعطیلات نیم‌سال (Semesterferien): یک هفته در نیمه فوریه، تاریخ دقیقش بسته به ایالت (Bundesland) کمی فرق می‌کنه.',
      'تعطیلات عید پاک (Osterferien): تقریباً دو هفته در بهار.',
      'در طول سال چند روز تعطیل کوتاه پراکنده هم هست (Fenstertage و روزهای رسمی) — تاریخ‌های دقیق هر سال فرق می‌کنه، بهترین منبع تقویم رسمی مدرسه یا وب‌سایت وزارت آموزش اتریشه.',
    ],
  },
  {
    id: 'school-costs',
    title: 'هزینه‌های مدرسه: چی رایگانه و چی نه',
    teaser: 'کتاب‌های درسی رایگانن، ولی هزینه‌های دیگه‌ای هم هست',
    paragraphs: [
      'کتاب‌های درسی به لطف برنامه‌ای به نام Schulbuchaktion رایگان یا تقریباً رایگانن — فقط یه مبلغ سمبلیک کوچیک پرداخت می‌کنی، نه قیمت کامل.',
      'آموزش رسمی در مدارس دولتی رایگانه، ولی معمولاً هزینه‌های اضافی هم هست: اردوهای مدرسه (Schulveranstaltungen)، بعضی لوازم مدرسه، و گاهی ناهار اگه کودک در برنامه تمام‌وقت باشه.',
      'اگه وضعیت مالی خانواده سخته، از مدرسه یا شهرداری درباره امکان کمک یا معافیت از بعضی هزینه‌ها بپرس — خیلی از مدارس برای این موارد راه‌حل دارن، فقط باید بپرسی و وضعیتت رو توضیح بدی.',
      'هر درخواست پرداختی از طرف مدرسه باید با یک پیام رسمی و واضح بهت برسه (مبلغ، دلیل، مهلت) — اگه پیام نامشخصی دریافت کردی، قبل از پرداخت از مدرسه توضیح بخواه.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    title: 'مدرسه تمام‌وقت و نگهداری بعدازظهر',
    teaser: 'راه‌حلی برای والدین شاغل',
    paragraphs: [
      'خیلی از مدارس برنامه تمام‌وقت (Ganztagsschule) یا نگهداری بعدازظهر (Nachmittagsbetreuung) ارائه می‌دن — کودک بعد از پایان کلاس رسمی در مدرسه می‌مونه، تکالیفش رو انجام می‌ده و در فعالیت‌ها شرکت می‌کنه، تا وقتی خانواده‌اش بیان دنبالش.',
      'همه مدارس این گزینه رو به‌طور خودکار ندارن — باید فرزندت رو جداگانه در این برنامه ثبت‌نام کنی، و معمولاً هزینه ماهانه کمی داره.',
      'اگه به این خدمت به‌خاطر کارت نیاز داری، از همون ابتدای سال تحصیلی از مدیریت مدرسه بپرس، چون معمولاً ظرفیت محدوده.',
    ],
  },
  {
    id: 'elternverein',
    title: 'چطور در زندگی مدرسه مشارکت کنی',
    teaser: 'Elternabend، Elternverein، و نماینده والدین',
    paragraphs: [
      'جلسه کلاس (Elternabend): جلسه‌ای که معمولاً یک یا دو بار در سال برگزار می‌شه و معلم برنامه کلاس و موضوعات مهم رو با همه والدین با هم مطرح می‌کنه.',
      'انجمن والدین (Elternverein): گروهی از والدین داوطلب که فعالیت‌هایی سازماندهی می‌کنن و صدای والدین رو به مدیریت مدرسه می‌رسونن — عضویت معمولاً اختیاری و رایگان یا با هزینه‌ای بسیار کمه.',
      'نماینده والدین کلاس (Klassenelternvertreter): فردی که والدین از میان خودشون انتخاب می‌کنن تا نظراتشون رو به مدیریت مدرسه منتقل کنه.',
      'مشارکت اجباری نیست، ولی فرصت خوبیه برای آشنایی با والدین دیگه و فهم بهتر اتفاقات مدرسه فرزندت — به‌خصوص اگه هنوز آلمانی یاد می‌گیری، چون می‌تونی از تجربه والدین دیگه استفاده کنی.',
    ],
  },
  {
    id: 'uebertritt',
    title: 'انتقال از یک مرحله به مرحله دیگر',
    teaser: 'از Volksschule به Mittelschule یا Gymnasium',
    paragraphs: [
      'در آخرین سال Volksschule (پایه چهارم)، مدرسه در نیمه سال یک "اطلاعیه مدرسه" (Schulnachricht) به والدین می‌ده که سطح کودک رو نشون می‌ده و به تصمیم‌گیری برای مرحله بعدی کمک می‌کنه.',
      'تصمیم نهایی بین Mittelschule و Gymnasium/AHS با والدینه، ولی مدرسه بر اساس عملکرد کودک یک توصیه ارائه می‌ده — اگه به راهنمایی بیشتری نیاز داری، یک وقت Sprechstunde با معلم بگیر.',
      'حتی بعد از انتخاب اول، تغییر مسیر بین انواع مدرسه (مثلاً از Mittelschule به AHS) در مراحل بعدی هم ممکنه، اگه وضعیت یا خواسته کودک تغییر کنه — شرایطش رو از مدرسه جدید بپرس.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "صورتحساب‌ها و یادآوری پرداخت (Mahnung)",
    teaser: "مهلت پرداخت، اگر بگذرد چه می‌شود، و اگر پول ندارید چه کنید",
    paragraphs: [
      "مهلت پرداخت در اتریش معمولاً ۱۴ روز از تاریخ صورتحساب است، مگر خلاف آن نوشته شده باشد. در برگه دنبال «zahlbar bis»، «Fälligkeit» یا «Zahlungsziel» بگردید.",
      "اگر مهلت بگذرد، یک «Mahnung» (یادآوری) می‌آید — معمولاً اول یکی و بعد دومی. در این مرحله موضوع با پرداخت به‌سادگی حل می‌شود.",
      "اگر پرداخت نشود، پرونده به شرکت وصول مطالبات (Inkasso) می‌رود و هزینه‌ها به‌طور محسوسی بالا می‌رود، چون هزینه وصول و بهره دیرکرد اضافه می‌شود (برای مصرف‌کنندگان طبق قانون سالانه ۴٪). به همین دلیل اقدام زودهنگام همیشه ارزان‌تر است.",
      "مهم‌ترین توصیه: اگر پول ندارید، **پیش از پایان مهلت** با فرستنده تماس بگیرید و درخواست پرداخت قسطی (Ratenzahlung) بدهید. بیشتر شرکت‌ها موافقت می‌کنند اما درخواست کتبی می‌خواهند — یک ایمیل کافی است. نادیده گرفتن، مبلغ را بزرگ‌تر می‌کند، نه ناپدید.",
      "کمک رایگان و محرمانه وجود دارد: «Schuldenberatung» که مورد تأیید دولت است در هر ایالت وجود دارد.",
      "صورتحساب اصلی و سند پرداخت (یک اسکرین‌شات از بانک اینترنتی کافی است) را تا پایان کار نگه دارید.",
    ],
  },
  {
    id: "termine",
    title: "قرارها: پزشک، اداره، مدرسه",
    teaser: "چه چیزی همراه ببرید — و اگر نروید چه می‌شود",
    paragraphs: [
      "قرار پزشک: همیشه e-card را همراه ببرید. اگر نمی‌توانید بروید، دست‌کم ۲۴ ساعت قبل لغو کنید — برخی مطب‌ها برای قرار از‌دست‌رفته هزینه می‌گیرند.",
      "قرار اداری (AMS، Magistrat، MA 35، اداره مالیات): **خود نامه** و یک مدرک شناسایی معتبر همراه ببرید. معمولاً در نامه نوشته شده چه چیزهایی لازم است — همه موارد ذکرشده را ببرید، حتی اگر غیرضروری به نظر برسد.",
      "اگر در نامه ساعت مشخص شده، بدون قرار نروید — بسیاری از ادارات بدون قرار کسی را نمی‌پذیرند.",
      "اگر نمی‌توانید حاضر شوید، **از قبل** اطلاع دهید (تلفن یا ایمیل). غیبت بدون اطلاع می‌تواند پیامد واقعی داشته باشد — مثلاً در AMS ممکن است پرداخت موقتاً قطع شود.",
      "زبان: می‌توانید کسی را برای ترجمه همراه ببرید. برخی ادارات در صورت درخواست مترجم فراهم می‌کنند — هنگام گرفتن وقت بپرسید.",
      "به‌محض رسیدن نامه، قرار را ثبت کنید. Brifo می‌تواند آن را از عکس بردارد و به شما یادآوری کند.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "نامه‌های اداری و مهلت‌ها (RSa / RSb)",
    teaser: "چرا مهلت اغلب پیش از رسیدن نامه به دست شما آغاز می‌شود",
    paragraphs: [
      "نامه‌های اداری مهم به‌صورت سفارشی با نوار رنگی می‌آیند: RSa (آبی) و RSb (بژ). این‌ها اثر حقوقی دارند و پست معمولی نیستند.",
      "**مهم‌ترین نکته:** اگر خانه نباشید، نامه در اداره پست نگهداری می‌شود (Hinterlegung) و مهلت معمولاً از **نخستین روزی که آماده تحویل شده** آغاز می‌شود، نه از روزی که شما آن را گرفته‌اید. یعنی ممکن است بدون اطلاع شما روزها گذشته باشد. نامه‌های نگهداری‌شده را سریع بگیرید.",
      "پاکت را دور نیندازید. تاریخی که روی آن است آغاز مهلت را ثابت می‌کند.",
      "در نامه دنبال «Frist»، «binnen» یا «innerhalb von» بگردید — آنجا نوشته چقدر وقت دارید. مهلت اعتراض اغلب دو یا چهار هفته است.",
      "اگر با تصمیم موافق نیستید، معمولاً در پایان نامه راه اعتراض (Einspruch یا Beschwerde) و مهلت آن نوشته شده است. اگر مهلت بگذرد، تصمیم در بیشتر موارد قطعی می‌شود — پس مهلت از محتوا مهم‌تر است.",
      "مشاوره رایگان: اتاق کار (Arbeiterkammer، برای اعضا)، Volksanwaltschaft و مراکز مشاوره مهاجران در هر ایالت.",
      "توجه: این‌ها اطلاعات عمومی برای آشنایی است و در موارد جدی جایگزین مشاوره حقوقی نمی‌شود.",
    ],
  },
];

const en: GuideArticle[] = [
  {
    id: 'school-types',
    title: 'Types of schools in Austria',
    teaser: 'Volksschule, Mittelschule, Gymnasium — what is the difference?',
    paragraphs: [
      'Volksschule (primary school): ages 6 to 10, four grades, teaches the basics of reading, writing, and arithmetic.',
      'Mittelschule (middle school): ages 10 to 14, prepares the student for the next stage, whether academic or vocational.',
      'Gymnasium (AHS): from age 10 (or after Mittelschule at age 14), a higher academic level, leading directly to university after finishing the Matura.',
      'Berufsschule / Lehre (vocational school and apprenticeship): vocational training that runs alongside real work with an employer.',
      'After age 14, parents and the student decide together on the path that best suits the student\'s interests and abilities.',
    ],
  },
  {
    id: 'grading-system',
    title: 'Grading system and report cards',
    teaser: 'From 1 (excellent) to 5 (fail) — what each number means',
    paragraphs: [
      'Grades in Austria range from 1 to 5, with 1 being the best grade.',
      '1 = Sehr gut (excellent), 2 = Gut (good), 3 = Befriedigend (satisfactory), 4 = Genügend (sufficient), 5 = Nicht genügend (fail).',
      'The report card (Zeugnis) is issued twice a year: the mid-year report (Semesterzeugnis) and the year-end report (Jahreszeugnis). The year-end report determines whether the student moves up to the next grade.',
    ],
  },
  {
    id: 'sprechstunde',
    title: 'Sprechstunde: how to talk to the teacher',
    teaser: 'A dedicated time for parents to speak directly with the teacher',
    paragraphs: [
      'What is the Sprechstunde? A fixed weekly time slot when parents can book an appointment and speak face-to-face with the teacher about their child\'s situation.',
      'How do you book an appointment? Usually through the notebook (Mitteilungsheft), the school\'s email, or an app like Schoolfox.',
      'What should you prepare beforehand? Write down your questions in advance, bring any important documents, and if your German isn\'t strong enough, you can bring someone along to translate.',
      'What should you ask during the appointment? How your child is doing in class, whether there\'s progress or something that needs more attention, and how you can help at home.',
    ],
  },
  {
    id: 'parent-rights',
    title: 'Parents\' rights and responsibilities',
    teaser: 'What you\'re entitled to as a parent, and what\'s expected of you',
    paragraphs: [
      'Parents\' rights: to be kept informed of your child\'s academic situation, to take part in the class meeting (Elternabend), and to elect a parent representative (Elternverein / Klassenelternvertreter) who speaks on behalf of all parents.',
      'Parents\' responsibilities: making sure your child attends school regularly (any absence needs a formal excuse), signing and returning any forms the school requires on time, and following up on homework.',
      'Compulsory education (Schulpflicht) in Austria runs from age 6 to 15 — meaning every child must attend an official school during this age range.',
    ],
  },
  {
    id: 'fruehwarnung',
    title: 'Frühwarnung: what it means and what to do',
    teaser: 'An "early warning" — not necessarily a failing grade',
    paragraphs: [
      'What is a Frühwarnung? An official notice from the school ("early warning") sent when there\'s a risk that a student will fail a particular subject.',
      'Why does it arrive at this specific time? Usually after mid-year, while there\'s still enough time to improve the situation before the year-end report.',
      'What should you do? Take it seriously but don\'t panic — book a Sprechstunde appointment with the teacher, ask exactly what\'s missing, and consider tutoring (Nachhilfe) if needed.',
      'Important to know: a Frühwarnung doesn\'t automatically mean failing — it\'s a chance to act early before it\'s too late.',
    ],
  },
  {
    id: 'enrollment',
    title: 'How to enroll your child in school (Schulanmeldung)',
    teaser: 'Required documents, and the district school (Sprengelschule)',
    paragraphs: [
      'Every family in Austria has an assigned "district school" (Sprengelschule) — the nearest official primary school to your home address. This is usually the first option, but you can enroll in a different school if there are open spots.',
      'Enrollment for Volksschule (primary school) usually happens in spring (around February-March) for the upcoming school year, and the municipality or school officially invites families with a child of enrollment age.',
      'Documents you\'ll typically need: the child\'s birth certificate, proof of home address, and, if the school requests it, proof of vaccination status.',
      'If you\'re still not sure where or with what documents to enroll, contact the school or your local municipality (Gemeinde) directly — the details differ slightly from one municipality to another.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    title: 'German support class (Deutschförderklasse)',
    teaser: 'If your child doesn\'t speak German well yet',
    paragraphs: [
      'If your child has recently arrived in Austria and their German is still weak, the school places them in a special support class (Deutschförderklasse) or extra support (Deutschförderkurs) to strengthen the language before fully joining the regular class.',
      'The student spends most lessons in the support class, but joins their regular classmates for subjects like sports or art that don\'t require strong language skills.',
      'The duration is usually one to two years depending on the child\'s level, and their language is assessed regularly to determine when they\'re ready to move fully into the regular class.',
      'This support is free and every child\'s right — if you feel your child needs extra language support and it hasn\'t been offered, ask the school directly.',
    ],
  },
  {
    id: 'school-holidays',
    title: 'School holidays in Austria',
    teaser: 'Summer, Christmas, mid-year... what\'s the difference',
    paragraphs: [
      'Summer holidays (Sommerferien): the longest break, from early July to the end of August.',
      'Christmas holidays (Weihnachtsferien): about two weeks around late December and early January.',
      'Mid-year holidays (Semesterferien): one week in mid-February, the exact date varies slightly by state (Bundesland).',
      'Easter holidays (Osterferien): about two weeks in spring.',
      'There are also a few short scattered days off throughout the year (Fenstertage and public holidays) — the exact dates change every year, so the best reference is the official calendar distributed by the school or the Austrian Ministry of Education\'s website.',
    ],
  },
  {
    id: 'school-costs',
    title: 'School costs: what\'s free and what isn\'t',
    teaser: 'Textbooks are free, but there are other costs',
    paragraphs: [
      'Textbooks are free or nearly free thanks to a program called Schulbuchaktion — you pay a small symbolic contribution, not the full price.',
      'Official education at public schools is free, but there are usually additional costs: school trips (Schulveranstaltungen), some school supplies, and sometimes lunch if your child is in all-day care.',
      'If your family\'s financial situation is difficult, ask the school or municipality about support or exemption from some of these costs — many schools have solutions for this, but you need to ask and explain your situation.',
      'Any request for payment from the school should come to you as a clear, official message (amount, reason, deadline) — if you receive an unclear message, ask the school to explain before paying.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    title: 'All-day school and afternoon care',
    teaser: 'A solution for working parents',
    paragraphs: [
      'Many schools offer all-day schooling (Ganztagsschule) or afternoon care (Nachmittagsbetreuung) — the child stays at school after regular class ends, does homework, and takes part in activities until picked up.',
      'Not every school offers this automatically — you need to enroll your child separately, and there\'s usually a small monthly fee.',
      'If your work makes you need this service, ask the school administration right at the start of the school year, since spots are often limited.',
    ],
  },
  {
    id: 'elternverein',
    title: 'How to get involved in school life',
    teaser: 'Elternabend, Elternverein, and the parent representative',
    paragraphs: [
      'Class meeting (Elternabend): a meeting, usually held once or twice a year, where the teacher discusses the class plan and important topics with all the parents together.',
      'Parents\' association (Elternverein): a group of volunteer parents who organize activities and represent parents\' voice to the school administration — membership is usually voluntary and free or very low-cost.',
      'Class parent representative (Klassenelternvertreter): a person parents elect from among themselves to pass their feedback on to the school administration.',
      'Participation isn\'t mandatory, but it\'s a good opportunity to get to know other parents and better understand what\'s happening at your child\'s school — especially useful if you\'re still learning German, since you can benefit from other parents\' experience.',
    ],
  },
  {
    id: 'uebertritt',
    title: 'Moving from one stage to the next',
    teaser: 'From Volksschule to Mittelschule or Gymnasium',
    paragraphs: [
      'In the final year of Volksschule (4th grade), the school gives parents a "school notice" (Schulnachricht) at mid-year that shows the child\'s level and helps with the decision for the next stage.',
      'The decision between Mittelschule and Gymnasium/AHS ultimately rests with the parents, but the school provides a recommendation based on the child\'s performance — if you feel you need more guidance, ask for a Sprechstunde appointment with the teacher.',
      'Even after the first choice, switching between paths (for example from Mittelschule to AHS) is still possible at later stages if the student\'s situation or wishes change — ask the new school about the conditions.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "Invoices and payment reminders (Mahnung)",
    teaser: "The payment deadline, what happens if you miss it, and what to do if you can't pay",
    paragraphs: [
      "In Austria the payment deadline is usually 14 days from the invoice date unless stated otherwise. Look on the letter for „zahlbar bis“, „Fälligkeit“ or „Zahlungsziel“.",
      "If the deadline passes, a „Mahnung“ (reminder) arrives — normally a first one, then a second. At this stage paying still settles it easily.",
      "If the invoice stays unpaid, the case goes to a debt collection agency (Inkasso). Costs rise sharply there, because collection fees and default interest are added (4% per year for consumers, by law). Acting early is always cheaper.",
      "The most important advice: if the money isn't there, contact the sender **before the deadline passes** and ask for instalments (Ratenzahlung). Most companies agree, but want the request in writing — an email is enough. Ignoring it makes the amount grow, not disappear.",
      "Free and confidential help exists: the state-recognised Schuldenberatung (debt counselling) is available in every province.",
      "Keep the original invoice and proof of payment (a screenshot from online banking is enough) until the matter is closed.",
    ],
  },
  {
    id: "termine",
    title: "Appointments: doctor, authority, school",
    teaser: "What to bring — and what happens if you don't go",
    paragraphs: [
      "Doctor's appointment: always bring your e-card. If you can't make it, cancel at least 24 hours ahead — some practices charge for missed appointments.",
      "Appointment at an authority (AMS, Magistrat, MA 35, tax office): bring **the letter itself** and valid photo ID. The letter usually lists what to bring — take everything named, even if it seems unnecessary.",
      "Don't turn up without an appointment if the letter states a time — many offices won't see anyone without one.",
      "If you can't attend, tell them **beforehand** (phone or email). Missing an appointment without notice can have real consequences — at the AMS, for example, payments can be suspended temporarily.",
      "Language: you may bring someone to interpret for you. Some offices provide an interpreter on request — ask when the appointment is arranged.",
      "Write the appointment down as soon as the letter arrives. Brifo can take it from the photo and remind you.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "Official letters and deadlines (RSa / RSb)",
    teaser: "Why the deadline is often already running before the letter reaches you",
    paragraphs: [
      "Important official letters arrive as registered mail with a coloured stripe: RSa (blue) and RSb (beige). They carry legal effect and are not ordinary post.",
      "**The most important point:** if you aren't home, the letter is held at the post office (Hinterlegung), and the deadline normally starts on the **first day it became collectable** — not the day you actually pick it up. Days may already have passed without your knowing. Collect held letters quickly.",
      "Don't throw the envelope away. The date on it is what proves when the deadline started.",
      "Look in the letter for „Frist“, „binnen“ or „innerhalb von“ — that's where the time you have is stated. Deadlines for appeals are often two or four weeks.",
      "If you disagree with the decision, the route to challenge it (Einspruch or Beschwerde) and its deadline are usually given at the end. Once the deadline passes, the decision becomes final in most cases — so the deadline matters more than the content.",
      "Free advice is available from the Arbeiterkammer (for members), the Volksanwaltschaft, and migration advice centres in every province.",
      "Note: this is general information for orientation and does not replace legal advice in serious cases.",
    ],
  },
];

const uk: GuideArticle[] = [
  {
    id: 'school-types',
    title: 'Типи шкіл в Австрії',
    teaser: 'Volksschule, Mittelschule, Gymnasium — у чому різниця?',
    paragraphs: [
      'Volksschule (початкова школа): від 6 до 10 років, чотири класи, базові навички читання, письма та рахунку.',
      'Mittelschule (неповна середня школа): від 10 до 14 років, готує учня до наступного етапу навчання, академічного чи професійного.',
      'Gymnasium (AHS): з 10 років (або після Mittelschule з 14 років), вищий академічний рівень, прямий шлях до університету після завершення Matura.',
      'Berufsschule / Lehre (професійна школа та учнівство): професійна освіта, що поєднується з реальною роботою у роботодавця.',
      'Після 14 років батьки й учень разом обирають шлях, що найкраще відповідає інтересам і здібностям учня.',
    ],
  },
  {
    id: 'grading-system',
    title: 'Система оцінювання та табелі',
    teaser: 'Від 1 (відмінно) до 5 (незадовільно) — що означає кожна цифра',
    paragraphs: [
      'Оцінки в Австрії від 1 до 5, і 1 — найкраща оцінка.',
      '1 = Sehr gut (відмінно), 2 = Gut (добре), 3 = Befriedigend (задовільно), 4 = Genügend (достатньо), 5 = Nicht genügend (незадовільно).',
      'Табель (Zeugnis) видається двічі на рік: за півріччя (Semesterzeugnis) і за рік (Jahreszeugnis). Річний табель визначає, чи переходить учень до наступного класу.',
    ],
  },
  {
    id: 'sprechstunde',
    title: 'Sprechstunde: як говорити з учителем',
    teaser: 'Спеціальний час для особистої розмови батьків з учителем',
    paragraphs: [
      'Що таке Sprechstunde? Фіксований щотижневий час, коли батьки можуть записатися і поговорити з учителем особисто про свою дитину.',
      'Як записатися? Зазвичай через щоденник (Mitteilungsheft), електронну пошту школи або застосунок на кшталт Schoolfox.',
      'Що підготувати заздалегідь? Запишіть свої запитання наперед, підготуйте важливі документи, а якщо вашої німецької не вистачає, можете взяти когось для перекладу.',
      'Про що запитати на зустрічі? Як дитина навчається в класі, чи є прогрес або щось, що потребує більшої уваги, і як ви можете допомогти вдома.',
    ],
  },
  {
    id: 'parent-rights',
    title: 'Права та обов\'язки батьків',
    teaser: 'На що ви маєте право як батьки, і чого від вас очікують',
    paragraphs: [
      'Права батьків: отримувати постійну інформацію про навчальну ситуацію дитини, брати участь у батьківських зборах (Elternabend) і обирати представника батьків (Elternverein / Klassenelternvertreter), який говорить від імені всіх батьків.',
      'Обов\'язки батьків: забезпечувати регулярне відвідування дитиною школи (будь-яка відсутність має бути офіційно виправдана), вчасно підписувати й повертати необхідні шкільні документи та стежити за виконанням домашніх завдань.',
      'Обов\'язкова освіта (Schulpflicht) в Австрії триває з 6 до 15 років — тобто кожна дитина цього віку повинна відвідувати офіційну школу.',
    ],
  },
  {
    id: 'fruehwarnung',
    title: 'Frühwarnung: що це означає і що робити',
    teaser: '"Раннє попередження" — не обов\'язково означає незадовільну оцінку',
    paragraphs: [
      'Що таке Frühwarnung? Офіційне повідомлення від школи ("раннє попередження"), яке надсилають, коли є ризик, що учень отримає незадовільну оцінку з певного предмета.',
      'Чому воно приходить саме в цей час? Зазвичай після півріччя, коли ще є достатньо часу, щоб покращити ситуацію до річного табеля.',
      'Що робити? Поставтеся серйозно, але не панікуйте — запишіться на Sprechstunde до вчителя, з\'ясуйте, чого саме бракує, і, якщо потрібно, розгляньте репетиторство (Nachhilfe).',
      'Важливо знати: Frühwarnung не означає автоматично незадовільну оцінку — це шанс діяти заздалегідь, поки не пізно.',
    ],
  },
  {
    id: 'enrollment',
    title: 'Як записати дитину до школи (Schulanmeldung)',
    teaser: 'Необхідні документи та районна школа (Sprengelschule)',
    paragraphs: [
      'Кожна родина в Австрії має закріплену "районну школу" (Sprengelschule) — найближчу офіційну початкову школу за адресою проживання. Це зазвичай перший варіант, але за наявності вільних місць можна записатися й до іншої школи.',
      'Запис до Volksschule (початкової школи) зазвичай відбувається навесні (приблизно лютий-березень) на наступний навчальний рік, і громада або школа офіційно запрошують родини з дитиною відповідного віку.',
      'Документи, які зазвичай потрібні: свідоцтво про народження дитини, підтвердження адреси проживання та, якщо школа вимагає, підтвердження стану вакцинації.',
      'Якщо ви ще не впевнені, куди і з якими документами звертатися, зв\'яжіться безпосередньо зі школою або своєю громадою (Gemeinde) — деталі трохи відрізняються залежно від громади.',
    ],
  },
  {
    id: 'deutschfoerderklasse',
    title: 'Клас підтримки німецької мови (Deutschförderklasse)',
    teaser: 'Якщо ваша дитина ще не дуже добре говорить німецькою',
    paragraphs: [
      'Якщо ваша дитина нещодавно приїхала до Австрії і її німецька ще слабка, школа розміщує її в спеціальному класі підтримки (Deutschförderklasse) або надає додаткову підтримку (Deutschförderkurs), щоб зміцнити мову перед повною інтеграцією до звичайного класу.',
      'Учень проводить більшість уроків у класі підтримки, але приєднується до звичайних однокласників на предметах на кшталт спорту чи мистецтва, які не потребують сильних мовних навичок.',
      'Тривалість зазвичай від одного до двох років залежно від рівня дитини, і її мовний рівень регулярно оцінюють, щоб визначити, коли вона готова повністю перейти до звичайного класу.',
      'Ця підтримка безкоштовна і є правом кожної дитини — якщо вважаєте, що вашій дитині потрібна додаткова мовна підтримка, а її не запропонували, запитайте безпосередньо в школі.',
    ],
  },
  {
    id: 'school-holidays',
    title: 'Шкільні канікули в Австрії',
    teaser: 'Літо, Різдво, півріччя... у чому різниця',
    paragraphs: [
      'Літні канікули (Sommerferien): найдовші канікули, з початку липня до кінця серпня.',
      'Різдвяні канікули (Weihnachtsferien): приблизно два тижні наприкінці грудня та на початку січня.',
      'Канікули на півріччя (Semesterferien): один тиждень у середині лютого, точна дата трохи відрізняється залежно від землі (Bundesland).',
      'Великодні канікули (Osterferien): приблизно два тижні навесні.',
      'Протягом року також є кілька коротких вихідних днів (Fenstertage та державні свята) — точні дати щороку змінюються, тому найкраще звірятися з офіційним календарем, який поширює школа, або сайтом Міністерства освіти Австрії.',
    ],
  },
  {
    id: 'school-costs',
    title: 'Шкільні витрати: що безкоштовно, а що ні',
    teaser: 'Підручники безкоштовні, але є й інші витрати',
    paragraphs: [
      'Підручники безкоштовні або майже безкоштовні завдяки програмі Schulbuchaktion — ви сплачуєте лише невеликий символічний внесок, а не повну ціну.',
      'Офіційна освіта в державних школах безкоштовна, але зазвичай є додаткові витрати: шкільні поїздки (Schulveranstaltungen), деяке шкільне приладдя і часом обід, якщо дитина перебуває в групі повного дня.',
      'Якщо фінансове становище родини складне, запитайте в школі або громаді про можливість підтримки чи звільнення від деяких витрат — багато шкіл мають рішення для таких випадків, але потрібно запитати й пояснити свою ситуацію.',
      'Будь-яка вимога оплати від школи має надходити чітким офіційним повідомленням (сума, причина, термін) — якщо повідомлення незрозуміле, попросіть школу пояснити перед оплатою.',
    ],
  },
  {
    id: 'nachmittagsbetreuung',
    title: 'Школа повного дня та післяобідній догляд',
    teaser: 'Рішення для працюючих батьків',
    paragraphs: [
      'Багато шкіл пропонують навчання повного дня (Ganztagsschule) або післяобідній догляд (Nachmittagsbetreuung) — дитина залишається в школі після звичайних уроків, робить домашні завдання і бере участь у заходах, поки за нею не прийдуть.',
      'Не кожна школа пропонує це автоматично — потрібно записати дитину окремо, і зазвичай є невелика місячна оплата.',
      'Якщо ця послуга потрібна вам через роботу, запитайте в адміністрації школи на початку навчального року, оскільки місць часто обмаль.',
    ],
  },
  {
    id: 'elternverein',
    title: 'Як брати участь у шкільному житті',
    teaser: 'Elternabend, Elternverein і представник батьків',
    paragraphs: [
      'Батьківські збори (Elternabend): зустріч, яка зазвичай відбувається раз чи двічі на рік, де вчитель обговорює план класу та важливі теми з усіма батьками разом.',
      'Батьківська асоціація (Elternverein): група батьків-волонтерів, які організовують заходи та представляють голос батьків перед адміністрацією школи — членство зазвичай добровільне і безкоштовне або дуже недороге.',
      'Представник батьків класу (Klassenelternvertreter): особа, яку батьки обирають з-поміж себе, щоб передавати їхні думки адміністрації школи.',
      'Участь не є обов\'язковою, але це гарна нагода познайомитися з іншими батьками й краще зрозуміти, що відбувається в школі вашої дитини — особливо корисно, якщо ви ще вивчаєте німецьку, адже можна скористатися досвідом інших батьків.',
    ],
  },
  {
    id: 'uebertritt',
    title: 'Перехід з одного етапу до іншого',
    teaser: 'Від Volksschule до Mittelschule або Gymnasium',
    paragraphs: [
      'В останньому класі Volksschule (4 клас) школа в середині року видає батькам "шкільне повідомлення" (Schulnachricht), яке показує рівень дитини і допомагає з рішенням щодо наступного етапу.',
      'Рішення між Mittelschule та Gymnasium/AHS зрештою ухвалюють батьки, але школа надає рекомендацію на основі успішності дитини — якщо потрібна додаткова порада, запишіться на Sprechstunde до вчителя.',
      'Навіть після першого вибору перехід між типами шкіл (наприклад, з Mittelschule до AHS) все ще можливий на пізніших етапах, якщо ситуація чи бажання дитини зміняться — запитайте про умови в новій школі.',
    ],
  },
  {
    id: "rechnung-mahnung",
    title: "Рахунки та нагадування про оплату (Mahnung)",
    teaser: "Строк оплати, що буде в разі прострочення і що робити, якщо немає грошей",
    paragraphs: [
      "В Австрії строк оплати зазвичай становить 14 днів від дати рахунку, якщо не вказано інше. Шукайте в документі «zahlbar bis», «Fälligkeit» або «Zahlungsziel».",
      "Якщо строк пропущено, надходить «Mahnung» (нагадування) — зазвичай спершу перше, потім друге. На цьому етапі питання ще легко закрити оплатою.",
      "Якщо рахунок залишається несплаченим, справа переходить до колекторської компанії (Inkasso). Там витрати помітно зростають, бо додаються збори за стягнення та пеня (для споживачів за законом 4 % річних). Тому реагувати раніше завжди дешевше.",
      "Найважливіша порада: якщо грошей немає, зверніться до відправника **до завершення строку** і попросіть розстрочку (Ratenzahlung). Більшість компаній погоджуються, але вимагають запит у письмовій формі — достатньо електронного листа. Ігнорування збільшує суму, а не прибирає її.",
      "Є безкоштовна та конфіденційна допомога: державно визнана «Schuldenberatung» діє в кожній федеральній землі.",
      "Зберігайте оригінал рахунку та підтвердження оплати (достатньо скріншоту з онлайн-банкінгу), доки справу не закрито.",
    ],
  },
  {
    id: "termine",
    title: "Візити: лікар, установа, школа",
    teaser: "Що взяти з собою — і що буде, якщо не прийти",
    paragraphs: [
      "Візит до лікаря: завжди беріть e-card. Якщо не можете прийти, скасуйте щонайменше за 24 години — деякі практики виставляють рахунок за пропущений візит.",
      "Візит до установи (AMS, Magistrat, MA 35, податкова): візьміть **сам лист** і чинне посвідчення особи. У листі зазвичай перелічено, що взяти — беріть усе назване, навіть якщо здається зайвим.",
      "Не приходьте без запису, якщо в листі вказано час — багато установ без запису не приймають.",
      "Якщо не можете прийти, повідомте **заздалегідь** (телефон або електронна пошта). Неявка без попередження може мати реальні наслідки — наприклад, в AMS виплати можуть тимчасово припинити.",
      "Мова: ви маєте право взяти когось для перекладу. Деякі установи на запит надають перекладача — запитайте під час запису.",
      "Запишіть візит одразу, щойно надійшов лист. Brifo може взяти його з фотографії та нагадати вам.",
    ],
  },
  {
    id: "behoerdenbrief",
    title: "Офіційні листи та строки (RSa / RSb)",
    teaser: "Чому строк часто вже спливає до того, як лист потрапив вам до рук",
    paragraphs: [
      "Важливі офіційні листи надходять рекомендованою поштою з кольоровою смугою: RSa (синя) і RSb (бежева). Вони мають юридичну силу і не є звичайною поштою.",
      "**Найважливіше:** якщо вас немає вдома, лист зберігається на пошті (Hinterlegung), і строк зазвичай починається з **першого дня, коли лист став доступним для отримання**, а не з дня, коли ви його забрали. Тобто дні могли вже минути без вашого відома. Забирайте такі листи швидко.",
      "Не викидайте конверт. Дата на ньому підтверджує початок строку.",
      "Шукайте в листі «Frist», «binnen» або «innerhalb von» — там указано, скільки у вас часу. Строки оскарження часто становлять два або чотири тижні.",
      "Якщо ви не згодні з рішенням, шлях оскарження (Einspruch або Beschwerde) і його строк зазвичай наведені в кінці листа. Після спливу строку рішення в більшості випадків стає остаточним — тож строк важливіший за зміст.",
      "Безкоштовні консультації надають Палата праці (Arbeiterkammer, для членів), Volksanwaltschaft і центри консультування мігрантів у кожній землі.",
      "Примітка: це загальна інформація для орієнтації, вона не замінює юридичної консультації у серйозних випадках.",
    ],
  },
];

export function getGuideArticles(lang: Lang): GuideArticle[] {
  if (lang === 'de') return de;
  if (lang === 'tr') return tr;
  if (lang === 'fa') return fa;
  if (lang === 'en') return en;
  if (lang === 'uk') return uk;
  return ar;
}
