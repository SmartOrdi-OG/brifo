# Supabase email templates (English)

Brifo's sign-in codes are sent by **Supabase**, not by our own code, so these
templates live in the Supabase dashboard rather than in this repo. They are
kept here so the wording isn't lost and can be re-pasted after any dashboard
change.

Supabase renders one template per email type for the whole project — it has no
per-user language switch — so these are intentionally English-only. The code
itself is the payload; the sentence under it is secondary.

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

---

## 1. Confirm signup

**Subject**

```
Confirm your Brifo account
```

**Message body**

```html
<h2 style="font-family:system-ui,sans-serif;">Welcome to Brifo</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Your confirmation code is:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Enter this number on the same Brifo screen you have open to finish creating your account.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">If you didn't try to create a Brifo account, you can ignore this email.</p>
```

---

## 2. Magic Link

**Subject**

```
Your Brifo sign-in code
```

**Message body**

```html
<h2 style="font-family:system-ui,sans-serif;">Brifo sign-in code</h2>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Your code is:</p>
<p style="font-family:system-ui,sans-serif;font-size:34px;font-weight:800;letter-spacing:6px;margin:16px 0;">{{ .Token }}</p>
<p style="font-family:system-ui,sans-serif;font-size:15px;">Enter this number on the same Brifo screen you have open.</p>
<p style="font-family:system-ui,sans-serif;font-size:13px;color:#666;">If you didn't request this code, you can ignore this email.</p>
```

---

## Before launch: custom SMTP

Supabase's built-in email sender is rate-limited (a handful of messages per
hour) and its own docs say it is **not intended for production**. Once real
users start signing up, sign-ins will silently fail once that limit is hit.

Configure a custom SMTP provider under Authentication → Emails → SMTP Settings
before launch. This is independent of the templates above — the templates keep
working unchanged once SMTP is switched over.
