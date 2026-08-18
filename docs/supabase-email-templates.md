# Supabase email templates (localised)

Brifo's sign-in codes are sent by **Supabase**, not by our own code, so these
templates live in the Supabase dashboard rather than in this repo. They are
kept here so the wording isn't lost and can be re-pasted after any dashboard
change.

Supabase renders templates with the **Go template language**, and exposes the
account's metadata as `{{ .Data }}`. The app writes the chosen language to
`user_metadata.language` (see `AuthContext.signInWithEmail` for new sign-ups
and `syncUserLanguage` for everyone else), so the templates below can branch on
`{{ .Data.language }}` and send the code in the user's own language.

**Where to paste:** Supabase Dashboard → your Brifo project → Authentication →
Emails → Templates.

There are two separate templates and they are easy to confuse:

| Template | Who gets it |
| --- | --- |
| **Confirm signup** | A brand-new email address, signing up for the first time |
| **Magic Link** | An existing account requesting a code (also "forgot password") |

Both must be updated — editing only one leaves the other on Supabase's English
default, which sends a *link* instead of a *code* and breaks the in-app flow.

`{{ .Token }}` is the 6-digit code. Keep it exactly as written.

## Fallback behaviour

The final `{{ else }}` branch is English and covers:

- accounts created before the language metadata existed,
- anyone who never opened the app after this shipped,
- any future language added to the app but not yet to these templates.

Nobody gets a broken or empty email; they get English.

---

## 1. Confirm signup

**Subject**

```
{{ if eq .Data.language "ar" }}تأكيد حسابك في Brifo{{ else if eq .Data.language "de" }}Bestätige dein Brifo-Konto{{ else if eq .Data.language "tr" }}Brifo hesabını doğrula{{ else if eq .Data.language "fa" }}تأیید حساب Brifo{{ else if eq .Data.language "uk" }}Підтвердьте свій обліковий запис Brifo{{ else }}Confirm your Brifo account{{ end }}
```

**Message body**

```html
{{ if eq .Data.language "ar" }}
<h2 style="font-family:system-ui,sans-serif;">أهلاً فيك بـ Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">كود التأكيد تبعك:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">دخّلي هالرقم بنفس شاشة Brifo يلي فتحتيها لتكملي إنشاء حسابك.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">إذا ما إنتي يلي طلبتي إنشاء حساب، تجاهلي هالإيميل.</p>
{{ else if eq .Data.language "de" }}
<h2 style="font-family:system-ui,sans-serif;">Willkommen bei Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Dein Bestätigungscode lautet:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Gib diese Nummer auf demselben Brifo-Bildschirm ein, den du geöffnet hast, um dein Konto fertig einzurichten.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Wenn du kein Brifo-Konto erstellen wolltest, kannst du diese E-Mail ignorieren.</p>
{{ else if eq .Data.language "tr" }}
<h2 style="font-family:system-ui,sans-serif;">Brifo'ya hoş geldin</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Doğrulama kodun:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Hesabını oluşturmayı tamamlamak için bu numarayı açık olan Brifo ekranına gir.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Brifo hesabı oluşturmak istemediysen bu e-postayı yok sayabilirsin.</p>
{{ else if eq .Data.language "fa" }}
<h2 style="font-family:system-ui,sans-serif;">به Brifo خوش آمدید</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">کد تأیید شما:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">این شماره را در همان صفحه Brifo که باز کرده‌اید وارد کنید تا ساخت حسابتان کامل شود.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">اگر شما درخواست ساخت حساب نداده‌اید، این ایمیل را نادیده بگیرید.</p>
{{ else if eq .Data.language "uk" }}
<h2 style="font-family:system-ui,sans-serif;">Ласкаво просимо до Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Ваш код підтвердження:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Введіть це число на тому самому екрані Brifo, який ви відкрили, щоб завершити створення облікового запису.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Якщо ви не створювали обліковий запис Brifo, просто проігноруйте цей лист.</p>
{{ else }}
<h2 style="font-family:system-ui,sans-serif;">Welcome to Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Your confirmation code is:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Enter this number on the same Brifo screen you have open to finish creating your account.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">If you didn't try to create a Brifo account, you can ignore this email.</p>
{{ end }}
```

---

## 2. Magic Link

**Subject**

```
{{ if eq .Data.language "ar" }}رمز الدخول لـ Brifo{{ else if eq .Data.language "de" }}Dein Brifo-Anmeldecode{{ else if eq .Data.language "tr" }}Brifo giriş kodun{{ else if eq .Data.language "fa" }}کد ورود Brifo{{ else if eq .Data.language "uk" }}Ваш код входу Brifo{{ else }}Your Brifo sign-in code{{ end }}
```

**Message body**

```html
{{ if eq .Data.language "ar" }}
<h2 style="font-family:system-ui,sans-serif;">رمز الدخول لـ Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">رمزك هو:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">دخّلي هالرقم بنفس شاشة Brifo يلي فتحتيها.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">إذا ما إنتي يلي طلبتي الرمز، تجاهلي هالإيميل.</p>
{{ else if eq .Data.language "de" }}
<h2 style="font-family:system-ui,sans-serif;">Brifo-Anmeldecode</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Dein Code lautet:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Gib diese Nummer auf demselben Brifo-Bildschirm ein, den du geöffnet hast.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Wenn du diesen Code nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
{{ else if eq .Data.language "tr" }}
<h2 style="font-family:system-ui,sans-serif;">Brifo giriş kodu</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Kodun:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Bu numarayı açık olan Brifo ekranına gir.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Bu kodu sen istemediysen bu e-postayı yok sayabilirsin.</p>
{{ else if eq .Data.language "fa" }}
<h2 style="font-family:system-ui,sans-serif;">کد ورود Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">کد شما:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">این شماره را در همان صفحه Brifo که باز کرده‌اید وارد کنید.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">اگر شما این کد را درخواست نکرده‌اید، این ایمیل را نادیده بگیرید.</p>
{{ else if eq .Data.language "uk" }}
<h2 style="font-family:system-ui,sans-serif;">Код входу Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Ваш код:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Введіть це число на тому самому екрані Brifo, який ви відкрили.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">Якщо ви не запитували цей код, просто проігноруйте цей лист.</p>
{{ else }}
<h2 style="font-family:system-ui,sans-serif;">Brifo sign-in code</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Your code is:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Enter this number on the same Brifo screen you have open.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">If you didn't request this code, you can ignore this email.</p>
{{ end }}
```

---

## Before launch: custom SMTP

Supabase's built-in email sender is rate-limited (a handful of messages per
hour) and its own docs say it is **not intended for production**. Once real
users start signing up, sign-ins will silently fail once that limit is hit.

Configure a custom SMTP provider under Authentication → Emails → SMTP Settings
before launch. This is independent of the templates above — the templates keep
working unchanged once SMTP is switched over.
