# نشر Brifo على Google Play — سجل التقدّم

هذا الملف بيوثّق خطوات نشر تطبيق Brifo (PWA) على Google Play، عشان أي حد يكمل من بعد ما وقفنا (حتى لو من جلسة Claude Code تانية) يعرف احنا واقفين فين بالظبط.

**آخر تحديث**: 2026-08-23 (بعد نجاح أول Internal testing release)

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

## الخطوات المتبقية

1. **تأكد من قايمة الـ Testers** (تبويب "Testers" جنب "Releases" في نفس صفحة Internal testing) — لو لسه معملتش email list، اعملها وحط فيها إيميلك (وإيميلات أي حد تاني عايز يجرب)
2. **خد رابط الانضمام (opt-in URL)** من تبويب "Testers" وابعته للتسترز — من غيره محدش هيقدر ينزّل النسخة حتى لو إيميله مضاف
3. **جرّب التطبيق فعليًا على جهاز أندرويد حقيقي** (أو إيموليتور) من خلال الرابط ده — أهم حاجة تتأكد منها:
   - التطبيق بيفتح من غير شريط عنوان Chrome (يعني `assetlinks.json` شغال صح)
   - صفحة الاشتراك (Paywall) بتوري رسالة "افتح من المتصفح" بدل زرار الدفع (تأكيد إن `isAndroidTwa` بيشتغل صح على جهاز حقيقي، مش بس في الكود)
4. بعد التأكد إن كل حاجة شغالة، الترقية لـ **Production track** (ممكن rollout تدريجي، وهيحتاج مراجعة كاملة من جوجل أول — ممكن تاخد من ساعات لأيام)
5. (اختياري) استبدال صور الـ Store listing بسكرين شوت حقيقي من جهاز فعلي

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
