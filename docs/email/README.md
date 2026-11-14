# The sign-in code email

`confirm-signup.html` is pasted into the **Body** of Supabase → Authentication →
Emails → *Magic link or OTP*. The **Subject** is a separate box there and is not
part of this file.

It is kept here because it is part of the product even though it is configured
in a dashboard: a template that lives only in a web form has no history, no
review, and no copy if the form is ever cleared. The file and the dashboard are
meant to be identical — paste the whole file, nothing else.

## Why the explanation is in this file and not in the HTML

Not because a comment would reach the recipient. It would not: `html/template`
strips HTML comments from its output, so nothing in a comment is ever
transmitted. Worth stating plainly, because the opposite is easy to assume and
leads to the wrong worry.

The actual reason is that Go parses template actions **inside HTML comments**,
so a comment that quotes an `else` or an `end` tag is not a comment — it is a
stray action, and it fails the whole template. A template that fails to parse
sends nothing at all. That happened once while writing this, and it would have
turned "the code lands in spam" into "the code never arrives". Prose about
template syntax is exactly the prose most likely to quote template syntax, so
it is safer beside the file than inside it.

It also keeps the file equal to what goes in the dashboard box, with nothing in
it that is not the template.

## Why it branches on language

`AuthContext` sends the reader's language with the sign-in request
(`data: { language: lang }`), and it arrives in the template as
`.Data.language` — one of `ar`, `de`, `tr`, `fa`, `en`, `uk`. Accounts created
before the app sent that have no value and fall through to the English branch.

Only the sentences branch, not the layout. Six copies of the markup would be six
places to fix every time anything moves, and five of them would be forgotten.

Arabic and Persian get `dir="rtl"` on both the document and the table, because
mail clients differ on which one they keep. The code itself and the address
block stay `ltr`: a right-to-left run around digits is how a pasted code comes
back reversed.

## Why it looks like a company

Yahoo filed a customer's code under Spam. Authentication was not the problem —
SPF, DKIM and DMARC all pass — and the message was accepted; Yahoo then had to
decide where to put it, and the template at the time gave it nothing to decide
with: five bare tags, no `<html>`, no logo, no sender name, no company, no
address.

"Here is your code, ignore this if it wasn't you" is also the exact shape of a
phishing mail. A filter that cannot separate the two by content falls back on
asking who sent it, and a three-week-old domain with nothing in the message to
show a real company behind it is an easy call to make against.

The footer is therefore both the evidence a filter looks for and what § 5 ECG
asks of commercial mail in Austria. It stays in German in every language: a
Firmenbuch entry is a legal identifier, not a phrase.

## Checking a change before pasting it

Supabase renders these with Go's `html/template`. Render it with the same engine
rather than reading it and hoping — a parse error is silent until nobody can
sign in:

```go
// go run check.go — renders the file for every language plus an account
// that carries none, and fails loudly on a bad tag.
package main

import (
	"fmt"
	"html/template"
	"os"
	"strings"
)

func main() {
	src, err := os.ReadFile("confirm-signup.html")
	if err != nil {
		panic(err)
	}
	t, err := template.New("otp").Parse(string(src))
	if err != nil {
		fmt.Println("PARSE ERROR:", err)
		os.Exit(1)
	}
	for _, lang := range []string{"ar", "de", "tr", "fa", "uk", "en", ""} {
		var sb strings.Builder
		data := map[string]any{"Token": "77802383", "Data": map[string]string{"language": lang}}
		if err := t.Execute(&sb, data); err != nil {
			fmt.Printf("%-3s EXECUTE ERROR: %v\n", lang, err)
			os.Exit(1)
		}
		out := sb.String()
		if !strings.Contains(out, "77802383") || strings.Contains(out, "{{") {
			fmt.Printf("%-3s BAD: token missing or tags left unrendered\n", lang)
			os.Exit(1)
		}
		fmt.Printf("%-3s ok\n", lang)
	}
}
```

The `{{ .Token }}` placeholder is where Supabase substitutes the code. Remove it
and the email goes out empty.
