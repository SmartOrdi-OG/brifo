# نشر Brifo على Google Play — سجل التقدّم

هذا الملف بيوثّق خطوات نشر تطبيق Brifo (PWA) على Google Play، عشان أي حد يكمل من بعد ما وقفنا (حتى لو من جلسة Claude Code تانية) يعرف احنا واقفين فين بالظبط.

**آخر تحديث**: 2026-10-21 (التطبيق اتنشر رسميًا على Google Play ✅)

## الطريقة المستخدمة: PWA → TWA عبر PWABuilder

بريفو مش تطبيق native — هو React + Vite PWA (`vite-plugin-pwa`) متنشر على Vercel. الطريقة المتبعة للنشر على Google Play هي **Trusted Web Activity (TWA)**: غلاف Android بيفتح الموقع الحقيقي جوه Chrome بدون شريط عنوان، من غير ما نعيد كتابة التطبيق.

الأداة المستخدمة: **[PWABuilder.com](https://www.pwabuilder.com/)** (مش Bubblewrap CLI).

## قيم أساسية لازم تتحفظ بره الريبو (حساسة)

القيم دي **موجودة بس عند صاحب المشروع** (مش في الريبو، ومتحطش هنا لو حد هيشارك الملف ده):
- ملف الـ **signing keystore** (`signing.keystore`) + الباسورد بتاعه — لو ضاع، مينفعش نحدّث التطبيق على Play تاني أبدًا. **نسخة احتياطية آمنة ضرورية.**
- بيانات دخول **حساب المراجعين التجريبي** (test/demo account) المسجّلة في Play Console → App content → Sign in details.

## الدومين والـ Package ID

- **الدومين النهائي**: `mybrifo.com` (بدون www — الـ `www` subdomain كانت مش متظبطة DNS وقت البداية، اتحل الموضوع لاحقًا بالتحويل لاستخدام الدومين الأساسي)
- **Package name**: `com.mybrifo.twa`
- **App name على المتجر**: `Brifo` (إنجليزي بس، من غير "بريفو")

## التغييرات اللي اتعملت في كود الريبو (اتدمجت في `main`)

### 1. PR #99 — إخفاء الدفع داخل التطبيق على أندرويد
Google Play بيفرض إن أي اشتراك رقمي بيتفعّل جوه التطبيق لازم يمر بـ Google Play Billing، مش معالج خارجي زي Stripe. بدل ما نعمل تكامل كامل مع Play Billing، قررنا إن نسخة أندرويد **متعرضش زرار الدفع خالص**، وتوجّه المستخدم للموقع بدالها.

- `src/lib/platform.ts` (جديد): `isAndroidTwa` بيكتشف إن التطبيق شغال جوه TWA عن طريق `document.referrer` (`android-app://<package>`)، والنتيجة بتتخزن في `localStorage` لأنها بتضيع بعد أي navigation كامل (زي الرايح جاي لـ Stripe).
- `src/screens/Paywall.tsx`: على أندرويد، بيتبدّل checkbox الموافقة + زرار "اشترك الآن" برسالة توجّه المستخدم للموقع.
- `src/context/translations.ts`: أضيف مفتاح `paywall_android_web_only` في اللغات الستة.

### 2. PR #100 — ملف Digital Asset Links
- `public/.well-known/assetlinks.json`: بيربط `com.mybrifo.twa` بالدومين `mybrifo.com` عن طريق الـ SHA-256 fingerprint بتاع الـ signing key، عشان التطبيق يفتح من غير شريط عنوان Chrome.

### 3. PR #125 — إضافة شهادة Play App Signing لملف assetlinks.json
تفاصيل كاملة تحت في قسم "مشاكل اتلاقت #2".

### 4. PR #127 و #128 — مخرج حقيقي للمتصفح على أندرويد + الدفع المباشر
تفاصيل كاملة تحت في قسم "مشاكل اتلاقت #3". خلاصة: زرار "اشترك الآن" دلوقتي بياخد المستخدم على أندرويد وTelegram **مباشرة** للينك الدفع الحقيقي (Stripe) في متصفح خارجي حقيقي، مش بس صفحة الـ paywall.

## Play Console — الحالة الحالية

### حساب Play Console
موجود من قبل (مش اتعمل في الجلسة دي).

### إنشاء التطبيق
- ✅ App name: `Brifo`
- ✅ Default language: Arabic – ar
- ✅ Package name: `com.mybrifo.twa`
- ✅ Free (مش Paid)

### "Set up your app" checklist — كله خلص ✅
- ✅ Privacy policy: `https://mybrifo.com/datenschutz`
- ✅ Sign in details: حساب تجريبي منفصل بإيميل قديم (مش الإيميل الشخصي)، بكلمة سر مضبوطة من صفحة الإعدادات داخل التطبيق. التعليمات المكتوبة للمراجع: استخدام تسجيل الدخول بإيميل+باسورد، مش الكود المُرسل بالإيميل.
- ✅ Ads: No
- ✅ Content rating: استبيان IARC خلص — طلعت كل التصنيفات في أقل درجة (3+ / Everyone / PEGI 3 / USK All ages)
- ✅ Target audience: 18 and over بس
- ✅ Data safety: خلص بالكامل — Email address (Collected), User IDs (Collected), Financial info/Purchase history (Collected, عن طريق Stripe كـ service provider)، Photos and videos (Collected + Shared مع Anthropic لتحليل الرسائل)، Device or other IDs (Collected، لـ push notifications). Delete account/data URL: `https://mybrifo.com/datenschutz`
- ✅ Government apps: No
- ✅ Financial features: "My app doesn't provide any financial features"
- ✅ Health: "My app does not have any health features"
- ✅ App category: Education

### Store listing — خلص ✅
- **Short description**: "بريفو: افهم رسائل مدرسة أولادك بالعربي، واكتب ردودك بالألماني بثواني"
- **Full description**: نص كامل (تسويقي، بيشرح المميزات: تصوير الرسائل، التقويم، مساعد الرد بالألماني، الدليل، اللغات المدعومة، سياسة الخصوصية)
- **App icon**: `icon-512-v2.png` من الريبو (512×512، الأصلية الحقيقية بتاعة التطبيق)
- **Feature graphic**: صورة تسويقية 1024×500 اتعملت خصيصًا (mockup مبني بـ HTML/CSS ومتطابق مع ألوان وخطوط التطبيق الحقيقية، Playwright screenshot)
- **Phone screenshots**: 5 صور 1080×1920 (Home, Scan, Result, Reply, Calendar) — نفس الطريقة، mockups مش سكرين شوت حقيقي من جهاز
- **Tablet screenshots (7-inch & 10-inch)**: نفس الـ 5 صور بتاعة الموبايل معاد استخدامها (أبعادها بتقع جوه المدى المسموح للاتنين)
- **AI asset declaration**: اتحدد إن الـ Feature graphic والـ 5 screenshots هما AI-generated (لأني أنا "كلود" ولّدتهم كـ mockups)، أما الأيقونة فمُعلّمة إنها مش AI (أصلية من التطبيق)

> ⚠️ **ملاحظة للمستقبل**: الصور دي mockups مش سكرين شوت حقيقي من التطبيق شغال فعليًا. بعد ما التطبيق ينشر، الأفضل تستبدلهم بسكرين شوت حقيقي مأخوذ من جهاز أندرويد فعلي لانطباع أدق (مش إجباري، بس مستحسن).

### Internal testing release — ✅ لايف
- ✅ AAB (`My Brifo.aab`) اترفع بنجاح على track "Internal testing"
- ✅ الـ Release notes اتكتبت، وتم **"Start rollout to Internal testing"**
- ✅ الحالة الحالية في Play Console (تأكدنا منها فعليًا): Release `1 (1.0.0.0)` — **Active** · "Available to internal testers" · 1 version code · "Not reviewed" (يعني لسه Google ما راجعتش التطبيق رسميًا، ده طبيعي وبياخد وقت — Internal testing عادةً بيبقى متاح للتسترز فورًا من غير ما ننتظر المراجعة)
- ⚠️ لاحظنا كمان تنبيه من Play Console: **"Your temporary app name is 'com.mybrifo.twa (unreviewed)'"** — يعني لحد ما الـ "Set up your app" يتراجع بالكامل من جوجل، التسترز هيشوفوا اسم مؤقت (الـ package name) بدل "Brifo" وقت التنزيل. ده هيتصلح تلقائيًا بعد المراجعة، مش حاجة نعملها إحنا.

### Production release — ✅ منشور (Published)
- ✅ نفس الـ App bundle (`1 (1.0.0.0)`) اتعمله **Promote** من Internal testing لـ Production، من غير رفع AAB جديد
- ✅ Countries/regions: 20 دولة (Austria, Belgium, +18، وبعد كده اتضافت **مصر** بتاريخ 2026-10-21 عن طريق Play Console → Countries/regions → Add countries — إعداد Console بحت، مش محتاج AAB جديد ولا مراجعة Google)
- ✅ اتحل تحذير "Incomplete advertising ID declaration" بـ "No"
- ✅ اتبعت "Submit 12 changes for review" — راحت لحالة "Changes in review"
- ✅ **Google وافقت ونشرت التطبيق**: Submission 1 → Status **"Published"** بتاريخ **18 أكتوبر 2026، 4:48 مساءً** (Changes submitted: 13 أكتوبر 2026، 10:55 مساءً). التطبيق دلوقتي متاح رسميًا على Google Play Store ويقدر أي حد يدوّر عليه ويحمّله عادي، من غير الحاجة للينك التيستنج.

## الخطوات المتبقية

1. ✅ **قايمة الـ Testers** موجودة ("Testers"، عضو واحد مضاف)
2. ✅ **رابط الانضمام (opt-in URL)** اتنسخ من تبويب "Testers" واتبعت لشريك المشروع — هو جرّب من موبايل أندرويد حقيقي بنفس الإيميل المضاف في القايمة (صاحب المشروع نفسه شغال من آيفون، فمش قادر يجرب بنفسه)
3. ✅ **اختبار الجهاز الحقيقي خلص بنجاح** — شريك المشروع أكّد: التطبيق بيفتح full-screen من غير شريط Chrome، وزرار "اشترك الآن" بيوصل صح لصفحة الدفع الحقيقية (Stripe checkout) في متصفح خارجي
4. ✅ **اتعمل Promote من Internal testing لـ Production** (نفس الـ App bundle، من غير رفع جديد) — خطوات: Internal testing → Promote release → Production → Next → (مفيش خيار Rollout percentage ظهر في النسخة دي من Console، فالنشر هيبقى 100% على طول)
5. ✅ **اتحل تحذير "Incomplete advertising ID declaration"** اللي ظهر في Publishing overview قبل الإرسال — الإجابة: **"No"** (التطبيق مبيستخدمش Advertising ID، مفيش أي SDK إعلانات/تحليلات في الكود)
6. ✅ **اتبعت 12 تغيير لمراجعة Google** ("Submit 12 changes for review") — الحالة وصلت **"Changes in review"**
7. ✅ **Google وافقت ونشرت** — الحالة بقت **"Published"** (18 أكتوبر 2026). التطبيق لايف على Google Play Store رسميًا. 🎉
8. (اختياري) استبدال صور الـ Store listing بسكرين شوت حقيقي من جهاز فعلي بدل الـ mockups
9. (اختياري) بعد ما Google تراجع التطبيق بالكامل، اسم التطبيق وقت التحميل هيتحوّل تلقائيًا من `com.mybrifo.twa (unreviewed)` لـ "Brifo" — متابعة دي مش إجراء مطلوب، بتحصل لوحدها

## الحالة النهائية: التطبيق منشور ✅

مفيش خطوة إجبارية متبقية لنشر التطبيق — دورة PWABuilder → TWA → Play Console اكتملت بالكامل من البداية للنهاية. أي شغل بعد كده هو صيانة/تحسين اختياري:
- استبدال صور الـ Store listing بسكرين شوت حقيقي (مذكور فوق)
- متابعة الـ reviews والتقييمات على Play Store بعد ما المستخدمين يبدأوا ينزلوه
- لو حبيت تحدّث التطبيق مستقبلًا: أي تغيير في كود الـ PWA بينشر أوتوماتيك عن طريق Vercel (مفيش حاجة تتعمل في Play Console)، إلا لو التغيير في حاجة جوهرية بتخص التغليف نفسه (زي الأيقونة أو اسم الـ package) فهتحتاج AAB جديد من PWABuilder وترفعه كـ release جديد.

### ✅ Checklist الاختبار على جهاز حقيقي — خلص بنجاح
لما التطبيق اتحمّل وفُتح، اتأكد من النقط دي:

- [x] التطبيق بيفتح **من غير شريط عنوان Chrome** فوق الشاشة ✅ (بعد إصلاح PR #125)
- [x] اسم التطبيق وقت التحميل ظهر مؤقتًا كـ `com.mybrifo.twa (unreviewed)` بدل "Brifo" — متوقّع وطبيعي، هيتصلح أوتوماتيك بعد المراجعة الكاملة (التطبيق بقى Published دلوقتي، فالاسم المؤقت ده في طريقه للزوال لو لسه ظاهر)
- [x] صفحة الاشتراك (Paywall) بتوصّل المستخدم لصفحة الدفع الحقيقية في متصفح خارجي ✅ (بعد إصلاح PR #127 و#128)
- [x] باقي المميزات الأساسية شغالة عادي

لو أي بند يرجع يبوظ بعد كده، سجّله هنا تحت قسم "مشاكل اتلاقت" قبل ما تحاول تصلحه، عشان أي حد يكمل يعرف السياق.

### 🐛 مشاكل اتلاقت أثناء الاختبار الحقيقي وتصلّحت

#### 1. `isAndroidTwa` كان بيسرّب لتابات المتصفح العادية (PR #105)
أول تجربة على جهاز حقيقي: فتحنا `mybrifo.com` في تاب Chrome عادي عشان نكمل اشتراك (بعد ما التطبيق وجّهنا للموقع)، فلقينا رسالة "افتح من المتصفح" ظاهرة **حتى وإحنا بالفعل في المتصفح**. السبب: `src/lib/platform.ts` كان بيحفظ "أنا جوه TWA" في `localStorage`، وده بيتشارك بين كل تابات Chrome لنفس الدومين على نفس الموبايل — فأول ما التطبيق يسجّلها، أي تاب تاني بيورثها.
**الحل**: استبدلنا `localStorage` بـ `sessionStorage` (معزولة لكل تاب لوحده). التبرير الأصلي للحفظ الدائم (النجاة من رحلة Stripe) ملوش لازمة أصلاً دلوقتي لأن أندرويد مبقاش بيودّي حد لـ Stripe خالص.

#### 2. شريط Chrome ظاهر فوق التطبيق (PR #125)
بعد التثبيت، التطبيق فتح وشريط Chrome (الدومين + مشاركة + ⋮) ظاهر فوقه بدل ما يفتح full-screen — معناه Digital Asset Links verification فاشل.
**السبب**: Google Play بيعيد توقيع أي AAB بترفعه بمفتاحه الخاص (**App Signing key**) قبل ما يوزّعه على المستخدمين — ده مختلف تمامًا عن مفتاح الرفع (**Upload key**) اللي PWABuilder ولّده واللي كان الـ fingerprint بتاعه موجود في `assetlinks.json` من الأول.
**إزاي لقيناها**: Play Console → القائمة الجانبية → Test and release → App integrity → (بتحوّل لـ "Protected with Play"، متجاهلها) → استخدمنا **خانة البحث فوق في Play Console** وكتبنا "signing key certificate" → وصلنا لصفحة **"App signing"** مباشرة (`/keymanagement`) → لقينا قسمين منفصلين: "App signing key certificate" (فوق) و"Upload key certificate" (تحت) — الاتنين عندهم SHA-256 مختلف تمامًا.
**الحل**: ضفنا الـ fingerprint بتاع الـ **App signing key certificate** لمصفوفة `sha256_cert_fingerprints` في `public/.well-known/assetlinks.json`، جنب الـ fingerprint القديم بتاع الـ upload key (سيبنا الاتنين، الملف بيدعم أكتر من fingerprint).

**ملاحظة للمستقبل**: لو عملت "Request upload key reset" أو أي تغيير في مفتاح الرفع، الـ App signing key certificate **بيفضل ثابت** (هو ده اللي بيتحط في `assetlinks.json` دايمًا)، فمتحتاجش تغيّره تاني إلا لو غيّرت الـ package name أو عملت تطبيق جديد من الصفر.

#### 3. زرار "اشترك" كان بيرجّع المستخدم لنفس التطبيق بدل المتصفح (PR #127 و#128)
بعد ما مشكلة شريط Chrome اتصلحت، ظهرت مشكلة جديدة (نتيجة طبيعية لنفس الإصلاح): لما المستخدم على أندرويد يحاول يفتح `mybrifo.com` — حتى من تاب Chrome عادي — كان بيترجّع لنفس التطبيق المثبت تاني بدل ما يفتح كـ موقع عادي. السبب: بما إن الدومين بقى "موثّق" (verified Android App Link)، أي محاولة فتح ليه (حتى `window.open` من جوه الكود) كانت بترجع لنفس التطبيق.
**الحل**:
- `openOutsideAndroidTwa` (`src/lib/platform.ts`): بيستخدم `intent://...#Intent;scheme=https;package=com.android.chrome;end` — توجيه صريح لـ Chrome بالاسم، وده بيتخطى نظام "التحقق من الدومين الموثّق" بالكامل.
- `Paywall.tsx`: زرار "اشترك الآن" بقى موحّد لكل المنصات (ويب / أندرويد / Telegram) — بيجيب لينك الدفع الحقيقي من Stripe أول حاجة، وبعدين يفتحه بره التطبيق لو لازم (أندرويد/Telegram)، أو يروح عليه مباشرة لو ويب عادي. مفيش صفحة وسيطة ("افتح الموقع") تاني — الزرار بيوصل مباشرة على لينك الدفع.
- **اتأكد الحل شغال فعليًا** من شريك المشروع على جهاز أندرويد حقيقي: الزرار فتح Chrome صح ووصل لصفحة Stripe checkout.

## مرجع سريع

| العنصر | القيمة |
|---|---|
| Domain | `mybrifo.com` |
| Package name | `com.mybrifo.twa` |
| Privacy policy | `https://mybrifo.com/datenschutz` |
| Play Console app name | `Brifo` |
| نوع النشر | Free |
| الفئة | Education |
| الفئة العمرية | 18+ |
