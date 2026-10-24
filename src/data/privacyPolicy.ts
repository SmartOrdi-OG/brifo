/** Datenschutzerklärung / سياسة الخصوصية — v6.
 *
 * The German text is the master (v6, from the 2026-10-23 audit, corrected to
 * what the code does — see DataContext, src/server/{auth,backup,consent,
 * eraseAccount,entitlement,ratings,appErrors,telegram,push,reply}.ts and
 * api/{analyze,reply}.ts). The five other languages are still the v5
 * translations with every statement that was false removed or corrected, and a
 * note pointing to the German version; full v6 translations follow once a
 * lawyer has signed off the German text.
 *
 * NOT ready to publish as-is: every "[PRÜFEN: …]" below is a fact that could
 * not be verified from the code (contract partners, regions, DPF status) and
 * must be confirmed and replaced before this goes live. */

export interface PolicySection {
  heading: string;
  body: string;
}

/** Bumping this re-prompts every user on their next start (src/lib/consent.ts). */
export const PRIVACY_POLICY_VERSION = 6;
/** Set to the actual publication date when v6 goes live. */
export const PRIVACY_POLICY_LAST_UPDATED = '2026-10-23';

/** Version of the separate Art. 9 consent text (SensitiveConsentGate). Must
 * match SENSITIVE_CONSENT_VERSION in src/server/consent.ts — see
 * tests/constantsInSync.test.ts. */
export const SENSITIVE_CONSENT_VERSION = 1;

export const privacyPolicyDe: PolicySection[] = [
  {
    heading: "1. Verantwortlicher",
    body: "SmartOrdi OG\nSteingasse 6a, 4020 Linz, Österreich\nFirmenbuchnummer: FN 675586 i\nE-Mail: team@smartordi.eu\n\nDie SmartOrdi OG ist Verantwortliche im Sinne der Datenschutz-Grundverordnung (DSGVO) für die Verarbeitung personenbezogener Daten in der App „Brifo“ (Web-App unter mybrifo.com, Android-App über Google Play sowie Telegram-Mini-App). Ein Datenschutzbeauftragter ist nicht bestellt. [PRÜFEN: Rechtsanwalt – Pflicht nach Art. 37 DSGVO?]",
  },
  {
    heading: "2. Überblick",
    body: "Brifo hilft Familien in Österreich, deutschsprachige Briefe zu verstehen – etwa von Schulen, Ärzt:innen und Kliniken, Versicherungen, Behörden, Vermieter:innen oder Unternehmen. Die App erstellt mithilfe künstlicher Intelligenz (KI) eine Zusammenfassung in Ihrer Sprache (Arabisch, Deutsch, Türkisch, Persisch, Englisch, Ukrainisch), entwirft auf Wunsch Antwortbriefe auf Deutsch und hilft Ihnen, Termine, Zahlungen und Aufgaben für Ihre Familie zu organisieren.\n\nFür die Nutzung ist ein Benutzerkonto erforderlich. Ihre Daten werden auf Ihrem Gerät gespeichert und – damit sie auf mehreren Geräten verfügbar sind – zusätzlich als Sicherungskopie auf unserem Server.\n\nWichtig: Briefe können sehr persönliche Informationen enthalten, z. B. Gesundheitsdaten (Arztbriefe, Befunde, Termine), Angaben zu Sozialleistungen oder Behördenverfahren. Solche Briefe analysieren wir nur, wenn Sie dem vorher ausdrücklich zugestimmt haben (siehe Punkt 5).",
  },
  {
    heading: "3. Welche Daten wir verarbeiten, wofür und auf welcher Rechtsgrundlage",
    body: "3.1 Benutzerkonto. E-Mail-Adresse, Einmal-Anmeldecodes, optional ein Passwort (nur verschlüsselt gespeichert – wir sehen es nie im Klartext), gewählte App-Sprache (für die Sprache unserer E-Mails) und Zeitpunkt der Kontoerstellung (für die Berechnung des kostenlosen Testzeitraums). Zweck: Anmeldung, geräteübergreifende Nutzung, Vertragsdurchführung. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag).\n\n3.2 Familienprofile. Name, Rolle (Kind/Erwachsene:r), Klasse und Schule, Farbe sowie Ihre Bestätigung, dass Sie diese Angaben speichern dürfen. Zweck: Briefe, Termine und Aufgaben einer Person zuordnen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Zu Daten von Kindern und anderen Personen siehe Punkt 9.\n\n3.3 Briefe und KI-Analyse. Wenn Sie einen Brief fotografieren oder ein Bild hochladen, wird das Bild verkleinert und über unseren Server an unseren KI-Dienstleister Anthropic übermittelt (siehe Punkte 4 und 6). Das Ergebnis – Zusammenfassung, Absender, erforderliche Schritte, Fristen und Termine, geforderte Zahlungen, ggf. erkannter Name und Klasse eines Kindes, Dringlichkeit – wird gespeichert.\n\nDas Foto selbst wird nicht auf unserem Server gespeichert. Eine verkleinerte Kopie wird jedoch auf Ihrem Gerät zusammen mit dem Brief gespeichert, damit Sie das Original später wieder ansehen können; sie ist auch in einer Datei enthalten, die Sie über „Nutzungsdaten sichern“ selbst exportieren. Sie können sie jederzeit löschen, indem Sie den Brief löschen.\n\nRechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Enthält ein Brief besondere Kategorien personenbezogener Daten (insbesondere Gesundheitsdaten), verarbeiten wir diese ausschließlich auf Grundlage Ihrer ausdrücklichen Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die wir vor der ersten Analyse gesondert einholen (Punkt 5). Betrifft der Brief Ihr minderjähriges Kind, erteilen Sie diese Einwilligung als gesetzliche:r Vertreter:in. Sie können die Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen (Punkt 11); danach sind Brief-Analyse und Antwortentwürfe nicht mehr nutzbar.\n\n3.4 Antwortentwürfe. Wenn Sie einen Antwortbrief erstellen lassen, übermitteln wir an Anthropic: die gewählte Art der Antwort, ggf. Empfänger, die Zusammenfassung des Briefes, auf den Sie antworten, ggf. Name und Klasse der betroffenen Person sowie Ihre eigenen Hinweise. Der erzeugte Text wird Ihnen angezeigt; ob und wie Sie ihn versenden, entscheiden Sie selbst (z. B. über WhatsApp oder E-Mail – dann gelten die Datenschutzbestimmungen dieses Dienstes). Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO; bei Gesundheitsdaten Art. 9 Abs. 2 lit. a DSGVO (Punkt 5).\n\n3.5 Termine, Zahlungen, Aufgaben. Titel, Datum, Uhrzeit, bei wem, Ort, Grund des Termins (z. B. Grund eines Arztbesuchs), Zahlungsbeträge, Fälligkeiten und Aufgaben – von Ihnen eingegeben oder aus einem Brief übernommen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO; bei Gesundheitsdaten Art. 9 Abs. 2 lit. a DSGVO.\n\n3.6 Synchronisierung und Sicherungskopie. Die Daten aus 3.2 bis 3.5 sowie Ihre App-Bewertung werden (ohne Fotos) verknüpft mit Ihrem Konto auf unserem Server gespeichert, damit sie auf all Ihren angemeldeten Geräten verfügbar sind und nicht verloren gehen. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO; bei Gesundheitsdaten Art. 9 Abs. 2 lit. a DSGVO.\n\n3.7 Abonnement und Zahlung. Beim Abschluss eines Abonnements legt unser Zahlungsdienstleister Stripe ein Kundenkonto mit Ihrer E-Mail-Adresse und Ihrer Brifo-Konto-ID an und verarbeitet Ihre Zahlungsdaten. Wir selbst sehen keine Kartennummern; wir speichern nur Ihre Stripe-Kundennummer, den Abo-Status und das Laufzeitende. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO; Aufbewahrung von Buchhaltungsunterlagen: Art. 6 Abs. 1 lit. c DSGVO i. V. m. § 132 BAO und § 212 UGB. Wenn Sie über einen Einladungslink Bonustage erhalten, speichern wir die Anzahl der Bonustage und dass der Link eingelöst wurde (Art. 6 Abs. 1 lit. b DSGVO).\n\n3.8 Erinnerungen (Push-Benachrichtigungen, optional). Nur wenn Sie Erinnerungen aktivieren und Ihr Browser/Gerät dies erlaubt: zufällige Geräte-ID, Push-Adresse und Schlüssel Ihres Browsers, Titel, Datum und ggf. Uhrzeit Ihrer anstehenden Termine und Aufgaben sowie Ihre Sprache. Die Zustellung erfolgt über den Push-Dienst Ihres Browser- bzw. Geräteherstellers (z. B. Google, Apple, Mozilla); der Inhalt der Nachricht wird dabei verschlüsselt übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch Aktivieren) und § 165 Abs. 3 TKG 2021.\n\n3.9 Nachweis Ihrer Zustimmung und Einwilligung. Version dieser Datenschutzerklärung, Zeitpunkt Ihrer Zustimmung und Ihre E-Mail-Adresse; für die Einwilligung nach Punkt 5 zusätzlich deren Version und der Zeitpunkt von Erteilung bzw. Widerruf. Zweck: Nachweis gemäß Art. 7 Abs. 1 DSGVO. Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO.\n\n3.10 Bewertung und Feedback (freiwillig). Sternebewertung, optionaler Kommentar und Sprache. Eine Kopie wird ohne Verknüpfung zu Ihrem Konto oder Gerät gespeichert, damit wir Rückmeldungen auswerten können. Bitte schreiben Sie keine persönlichen Angaben in den Kommentar. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Verbesserung der App).\n\n3.11 Fehlerberichte. Tritt in der App ein Fehler auf, senden wir Fehlertext, technische Fehlerspur, betroffene Bildschirmseite (ohne Parameter), Sprache, App-Version und Umgebung (Browser, Android-App oder Telegram) an unseren Server. Vor dem Senden werden E-Mail-Adressen, Zugangsschlüssel, Kennungen und längere Zahlenfolgen automatisch entfernt; die Berichte sind nicht mit Ihrem Konto oder Gerät verknüpft. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer funktionsfähigen, sicheren App).\n\n3.12 Server-Protokolle und Missbrauchsschutz. Beim Aufruf unserer Server verarbeitet unser Hosting-Anbieter technisch notwendige Verbindungsdaten (u. a. IP-Adresse, Zeitpunkt, aufgerufene Adresse, Statuscode) in Protokollen. Briefinhalte, Analyse-Ergebnisse und Antworttexte schreiben wir nicht in diese Protokolle. Zum Schutz vor Missbrauch zählen wir pro Konto und Tag die Anzahl der KI-Analysen und Antwortentwürfe. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (Sicherheit, Missbrauchsabwehr, Kostenkontrolle).\n\n3.13 Telegram. [PRÜFEN: nur, solange der Bot produktiv aktiv ist] Wenn Sie unseren Telegram-Bot verwenden, speichern wir Ihre Telegram-Chat-ID und die gewählte Sprache, um Ihnen in dieser Sprache zu antworten. Der Bot liest keine Briefe. Öffnen Sie Brifo als Telegram-Mini-App, wird zusätzlich ein Skript von Telegram geladen. Für die Verarbeitung durch Telegram selbst ist Telegram verantwortlich. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.\n\n3.14 Speicherung auf Ihrem Gerät. Brifo verwendet keine Cookies und keine Analyse-, Werbe- oder Tracking-Dienste. Im lokalen Speicher Ihres Browsers bzw. Geräts werden nur Daten abgelegt, die für die von Ihnen gewünschte Funktion unbedingt erforderlich sind: Ihre Anmeldesitzung, Ihre App-Daten (inkl. Brieffotos, siehe 3.3), Sprache, gewählte Anredeform, Anzeigemodus, Geräte-ID für Erinnerungen, Ihre Zustimmung und Ihre Einwilligung nach Punkt 5. Dafür ist keine Einwilligung erforderlich (§ 165 Abs. 3 TKG 2021).",
  },
  {
    heading: "4. Künstliche Intelligenz",
    body: "Für die Analyse von Briefen und die Erstellung von Antwortentwürfen nutzen wir KI-Modelle von Anthropic über deren Programmierschnittstelle (API).\n• An Anthropic übermitteln wir nur das Bild des Briefes und die gewünschte Ausgabesprache bzw. bei Antwortentwürfen die in 3.4 genannten Angaben – keine E-Mail-Adresse, Konto-ID oder sonstige Kennung von Ihnen.\n• Anthropic verarbeitet die Daten als unser Auftragsverarbeiter und verwendet sie nicht zum Training seiner Modelle. [PRÜFEN: Auftragsverarbeitungsvertrag (DPA) von Anthropic in der Console akzeptiert?]\n• Anthropic löscht API-Eingaben und -Ausgaben standardmäßig innerhalb von 30 Tagen. Länger werden sie nur aufbewahrt, wenn sie wegen eines möglichen Verstoßes gegen Anthropics Nutzungsrichtlinien zur Prüfung markiert werden oder eine gesetzliche Pflicht dazu besteht. Eine Vereinbarung über eine Null-Speicherung („Zero Data Retention“) besteht nicht.\n• KI-Ergebnisse können fehlerhaft oder unvollständig sein. Sie sind ein Hilfsmittel; maßgeblich ist immer das Originalschreiben.\n• Es findet keine ausschließlich automatisierte Entscheidung im Sinne von Art. 22 DSGVO statt, die Ihnen gegenüber rechtliche Wirkung entfaltet oder Sie ähnlich erheblich beeinträchtigt. Über die Verwendung der Ergebnisse entscheiden ausschließlich Sie.",
  },
  {
    heading: "5. Ausdrückliche Einwilligung für Gesundheits- und andere sensible Daten",
    body: "Vor der ersten Brief-Analyse bzw. dem ersten Antwortentwurf bitten wir Sie gesondert um Ihre ausdrückliche Einwilligung, dass Gesundheitsdaten und andere besondere Kategorien personenbezogener Daten (Art. 9 DSGVO), die in Ihren Briefen, Terminen oder Hinweisen enthalten sein können, für die in Punkt 3.3 bis 3.6 genannten Zwecke verarbeitet, an Anthropic übermittelt (auch in die USA, siehe Punkt 7) und als Sicherungskopie gespeichert werden.\n\nDie Einwilligung ist freiwillig. Ohne sie können Sie alle übrigen Funktionen (Kalender, Aufgaben, Ratgeber, Erinnerungen) weiter nutzen. Sie können sie jederzeit in den Einstellungen („Einwilligung für sensible Daten“) oder per E-Mail widerrufen; die bis dahin erfolgte Verarbeitung bleibt rechtmäßig. Bereits gespeicherte Briefe können Sie einzeln oder über „Konto und Daten löschen“ entfernen.",
  },
  {
    heading: "6. Empfänger und Auftragsverarbeiter",
    body: "Wir geben Ihre Daten nur an folgende Empfänger weiter, die – soweit als Auftragsverarbeiter tätig – vertraglich nach Art. 28 DSGVO an unsere Weisungen gebunden sind:\n• Anthropic (KI-Analyse und Antwortentwürfe, Punkte 3.3, 3.4) – [PRÜFEN: Vertragspartner Anthropic Ireland, Limited, Dublin, oder Anthropic PBC, San Francisco, USA].\n• Supabase (Benutzerkonto und Anmeldung, Punkt 3.1) – Supabase Inc., USA; Speicherort der Kontodaten: [PRÜFEN: Region des Brifo-Projekts, z. B. Frankfurt (eu-central-1)].\n• Upstash (Datenbank für Sicherungskopie, Zustimmungs- und Einwilligungsnachweise, Erinnerungen, Abo-Status, Bewertungen, Fehlerberichte, Telegram-Einstellungen) – Upstash, Inc., USA; Speicherort: [PRÜFEN: Region der KV-Datenbank, z. B. Frankfurt].\n• Vercel (Hosting der App und der Server-Funktionen, Server-Protokolle, Punkt 3.12) – Vercel Inc., USA; die Server-Funktionen werden in Frankfurt (fra1) ausgeführt.\n• Resend (Versand von Anmelde-E-Mails, Punkt 3.1) – Resend, Inc. (Plus Five Five, Inc.), USA.\n• Stripe (Zahlungsabwicklung, Punkt 3.7) – Stripe Payments Europe Ltd., Dublin, Irland. Für eigene Zwecke (z. B. Betrugsprävention, gesetzliche Pflichten) ist Stripe teilweise selbst Verantwortlicher.\n• Push-Dienste der Browser- bzw. Gerätehersteller (z. B. Google, Apple, Mozilla) für die Zustellung von Erinnerungen (Punkt 3.8).\n• Telegram (Telegram Messenger Inc.) – nur bei Nutzung des Bots bzw. der Mini-App (Punkt 3.13), eigenverantwortlich.\n• Google (Google Play) stellt die Android-App bereit und verarbeitet dabei Daten als eigener Verantwortlicher nach seinen Datenschutzbestimmungen.\n\nWir verkaufen keine Daten und geben sie nicht zu Werbezwecken weiter. An Behörden geben wir Daten nur bei gesetzlicher Verpflichtung heraus.",
  },
  {
    heading: "7. Übermittlung in Drittländer",
    body: "Einige der genannten Anbieter haben ihren Sitz in den USA oder können von dort auf Daten zugreifen, auch wenn diese in der EU gespeichert sind. Eine Übermittlung erfolgt nur, wenn\n• der Empfänger unter dem EU-US Data Privacy Framework zertifiziert ist (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO) – [PRÜFEN auf dataprivacyframework.gov und hier namentlich nennen, z. B. Vercel, Stripe, Supabase …], oder\n• mit dem Empfänger EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO) samt ergänzender Maßnahmen vereinbart sind – [PRÜFEN: z. B. Anthropic, Upstash, Resend].\n\nEine Kopie der jeweiligen Garantien erhalten Sie auf Anfrage unter team@smartordi.eu.",
  },
  {
    heading: "8. Speicherdauer",
    body: "• Konto (3.1): bis zur Löschung Ihres Kontos.\n• Familienprofile, Briefe, Termine, Zahlungen, Aufgaben (3.2–3.6): auf Ihrem Gerät und am Server, bis Sie sie löschen oder Ihr Konto löschen.\n• Brieffotos: nur auf Ihrem Gerät, bis Sie den Brief löschen.\n• Bei Anthropic: siehe Punkt 4.\n• Abo-Status und Stripe-Zuordnung (3.7): bis zur Kontolöschung; Rechnungs- und Buchhaltungsunterlagen 7 Jahre (§ 132 BAO), bei Stripe nach dessen gesetzlichen Pflichten.\n• Erinnerungen (3.8): solange die Funktion auf dem jeweiligen Gerät aktiv ist; Löschung beim Deaktivieren, beim Widerruf der Berechtigung, wenn der Push-Dienst das Abonnement beendet, oder – für dieses Gerät – beim Löschen Ihres Kontos.\n• Zustimmungs- und Einwilligungsnachweise (3.9): bis zur Löschung Ihres Kontos. [PRÜFEN Rechtsanwalt: ggf. 3 Jahre darüber hinaus zum Nachweis.]\n• Bewertungen (3.10): höchstens 24 Monate.\n• Fehlerberichte (3.11): 30 Tage.\n• Server-Protokolle (3.12): [PRÜFEN: Aufbewahrung laut Vercel-Plan, z. B. höchstens 30 Tage]; Nutzungszähler: 36 Stunden.\n• Telegram-Chat-ID (3.13): bis Sie den Bot blockieren bzw. stoppen, spätestens 12 Monate nach Ihrer letzten Nachricht an den Bot.",
  },
  {
    heading: "9. Kinder und Daten anderer Personen",
    body: "Brifo richtet sich an Erwachsene (ab 18 Jahren). Angaben zu Kindern und weiteren Familienmitgliedern geben Sie selbst ein. Bitte erfassen Sie Daten anderer Erwachsener nur, wenn diese damit einverstanden sind, und informieren Sie sie über diese Datenschutzerklärung. Für Ihre minderjährigen Kinder handeln Sie als gesetzliche:r Vertreter:in; das gilt auch für die Einwilligung nach Punkt 5. Wir verwenden Daten von Kindern ausschließlich für die in Punkt 3 genannten Zwecke, nie für Werbung oder Profilbildung.",
  },
  {
    heading: "10. Löschen Ihrer Daten und Ihres Kontos",
    body: "• Einzelne Briefe, Termine, Profile: jederzeit in der App; die Löschung wird auch am Server nachvollzogen.\n• „Konto und Daten löschen“ (Einstellungen): löscht Ihr Anmeldekonto (E-Mail-Adresse und Anmeldedaten), alle App-Daten auf diesem Gerät, die Sicherungskopie, die Zustimmungs- und Einwilligungsnachweise, Einladungs-Boni und die Abo-Zuordnung am Server sowie die Erinnerungen dieses Geräts. Voraussetzung: kein laufendes Abonnement (Kündigung über „Abo verwalten“). Erinnerungen, die Sie auf anderen Geräten aktiviert haben, schalten Sie bitte dort aus.\n• Ohne Zugang zur App: E-Mail an team@smartordi.eu; wir löschen Ihr Konto innerhalb eines Monats.\n• Gesetzlich aufzubewahrende Rechnungsdaten werden bis zum Ablauf der Frist gesperrt und danach gelöscht; Ihr Kundenkonto bei Stripe unterliegt dessen gesetzlichen Aufbewahrungspflichten.",
  },
  {
    heading: "11. Ihre Rechte",
    body: "Sie haben das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO).\n\nWiderspruchsrecht: Soweit wir Daten auf Grundlage berechtigter Interessen verarbeiten (Punkte 3.10–3.12), können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.\n\nWiderruf von Einwilligungen: Erteilte Einwilligungen (Punkte 3.3, 3.8, 5) können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO), die Einwilligung nach Punkt 5 direkt in den Einstellungen.\n\nViele Rechte können Sie direkt in der App ausüben (Ansehen, Bearbeiten, Löschen, Export über „Nutzungsdaten sichern“). Im Übrigen genügt eine E-Mail an team@smartordi.eu; wir antworten innerhalb eines Monats.\n\nBeschwerderecht: Österreichische Datenschutzbehörde, Barichgasse 40–42, 1030 Wien, dsb@dsb.gv.at, www.dsb.gv.at.",
  },
  {
    heading: "12. Pflicht zur Bereitstellung",
    body: "Die Kontodaten (3.1) sind für den Vertragsabschluss erforderlich; ohne sie ist eine Nutzung nicht möglich. Alle anderen Angaben sind freiwillig; ohne sie stehen nur die jeweiligen Funktionen nicht zur Verfügung.",
  },
  {
    heading: "13. Datensicherheit",
    body: "Alle Verbindungen sind TLS-verschlüsselt. Der Zugriff auf Serverdaten ist auf das für den Betrieb erforderliche Personal beschränkt und durch Zugangsschlüssel geschützt. Auf Ihrem Gerät gespeicherte Daten sind so sicher wie Ihr Gerät – bitte verwenden Sie eine Bildschirmsperre.",
  },
  {
    heading: "14. Änderungen und Sprachfassungen",
    body: "Wir passen diese Erklärung an, wenn sich die App oder die Rechtslage ändert. Bei wesentlichen Änderungen bitten wir Sie in der App erneut um Kenntnisnahme bzw. Zustimmung. Diese Erklärung liegt in mehreren Sprachen vor; bei Abweichungen ist die deutsche Fassung maßgeblich. [PRÜFEN Rechtsanwalt]",
  },
  {
    heading: "15. Kontakt",
    body: "Fragen zum Datenschutz: team@smartordi.eu",
  },
];

export const privacyPolicyAr: PolicySection[] = [
  {
    heading: 'ملاحظة عن هالترجمة',
    body: 'هاي الترجمة مأخوذة من نسخة أقدم من سياسة الخصوصية، وتم تصحيح المعلومات الغلط فيها. النسخة الكاملة والمعتمدة هي النسخة الألمانية (الإصدار ٦)، وفيها تفاصيل كل مزوّدي الخدمة، والأساس القانوني لكل معالجة، ومدد الحفظ، والحقوق كاملة. الترجمة الكاملة رح تنضاف قريباً.',
  },
  {
    heading: '١. المسؤول عن حماية البيانات',
    body: 'SmartOrdi OG، Steingasse 6a، 4020 Linz، النمسا\nالبريد الإلكتروني: team@smartordi.eu\nرقم السجل التجاري: FN 675586 i\n\nالشركة المذكورة أعلاه هي المسؤولة عن معالجة البيانات الشخصية ضمن تطبيق "Brifo" وفق اللائحة الأوروبية العامة لحماية البيانات (GDPR).',
  },
  {
    heading: '٢. عموميات',
    body: 'Brifo بيساعد العائلات بالنمسا يفهموا الرسائل الألمانية (من المدرسة، الدكتور، التأمين، الدوائر الرسمية وغيرها) بلغتهم، وينظّموا المواعيد، ويكتبوا ردود بالألماني. هاي الوثيقة بتوضح شو البيانات يلي التطبيق بيعالجها، لأي هدف، وشو حقوقك كصاحب/ة البيانات.\n\nلاستخدام Brifo لازم يكون في حساب (إيميل مع كود دخول، وكلمة سر اختيارية)، حتى بياناتك تضل متاحة إلك بأمان من أي جهاز. بياناتك (العائلة، الاستخدام) بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية مرتبطة بحسابك على سيرفرنا (شوفي البند ٣ و٤).',
  },
  {
    heading: '٣. شو البيانات يلي منعالجها',
    body: 'أ) بيانات الحساب: إيميلك وكلمة السر، يلي بندير معالجتهم عبر مزوّد خدمة تسجيل الدخول Supabase (شوفي البند ٥). إحنا نفسنا ما منشوف كلمة سرّك أبداً بشكلها الصريح. كمان منخزّن إثبات موافقتك على سياسة الخصوصية هاي (رقم النسخة والوقت).\n\nب) ملفات أفراد العائلة: الاسم، النوع (طفل/بالغ)، الصف واسم المدرسة، يلي بتدخليهم إنتِ بنفسك.\n\nج) صور الرسائل: الصورة بتنبعت لمزوّد الذكاء الاصطناعي Anthropic لتحليلها (البند ٥). الصورة ما بتتخزن على سيرفرنا، بس نسخة مصغّرة منها بتتخزن على جهازك مع الرسالة لحد ما تنحذف الرسالة. Anthropic بتحذف مدخلات ومخرجات الـ API عادةً خلال ٣٠ يوم، وبتحتفظ فيها مدة أطول بس إذا انعلّمت للمراجعة بسبب مخالفة محتملة لسياسة الاستخدام أو إذا القانون فرض هالشي، وما بتستخدمها لتدريب نماذجها. الرسائل ممكن يكون فيها بيانات صحية — هاي البيانات منعالجها بس بموافقة صريحة منفصلة قبل أول تحليل.\n\nد) مسودات الردود: لما تطلبي من التطبيق يساعدك تكتبي رد على رسالة مدرسة، منبعت المعلومات اللازمة (متل اسم الطفل وصفّه، وأي ملاحظات نصية بتكتبيها إنتِ) لـAnthropic لتوليد نص الرد.\n\nه) المواعيد والمدفوعات والمهام وتقييمك/ملاحظاتك عن التطبيق. تقييمك/ملاحظاتك بتتخزن كمان بشكل منفصل ومجهول الهوية (بدون ربط بحسابك أو جهازك)، حتى نقدر نطّلع عليها ونستفيد منها.\n\nو) بيانات الدفع: لما تشتركي بخطة مدفوعة، مزوّد الدفع Stripe (شوفي البند ٥) بيعالج إيميلك وحالة اشتراكك ودفعك. بيانات الدفع نفسها (متل رقم البطاقة) إحنا ما منشوفها أبداً — Stripe لحاله يلي بيعالجها.\n\nز) إشعارات التذكير (اختيارية، بس إذا فعّلتيها): جهازك بياخد معرّف عشوائي وصلاحية إشعارات من المتصفح. هاد المعرّف مع عناوين وتواريخ مواعيدك القادمة بيتخزنوا على سيرفرنا، بس لإرسال التذكيرات إلك.\n\nح) بيانات تقنية: إعداد اللغة (عربي/ألماني) والمظهر (فاتح/داكن) — محلياً بس.\n\nط) تقارير الأخطاء: إذا صار خطأ بالتطبيق، منبعت لسيرفرنا نص الخطأ وتفاصيله التقنية، والشاشة اللي صار فيها، وإعداد اللغة، ونسخة التطبيق — عشان نلاقي الخطأ ونصلّحه. هالتقارير مو مربوطة بحسابك ولا بجهازك، والإيميلات والمفاتيح والمعرّفات والأرقام الطويلة بتنشال تلقائياً قبل الإرسال. وبتنمسح بعد ٣٠ يوم.\n\nالبيانات المذكورة بالبنود ب) وج) وه) بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية على سيرفرنا مرتبطة بحسابك (البند ٤) — ما عدا صور الرسائل، يلي بتضل بس على جهازك.',
  },
  {
    heading: '٤. مكان وحفظ البيانات',
    body: 'ملفات العائلة وملخصات الرسائل والمواعيد والمدفوعات والمهام والتقييمات بتتخزن محلياً على جهازك، وكمان كنسخة احتياطية على سيرفرنا مرتبطة بحسابك — حتى بياناتك ما تضيع لو سجّلتي دخول من جهاز جديد. فيك تحذفي أي عنصر، أو ملف كامل، أو كل بياناتك بأي وقت من الإعدادات، وهاد بينعكس كمان على النسخة عندنا بالسيرفر. حذف الحساب بالكامل (مع النسخة الاحتياطية وبيانات الدخول) بيصير من الإعدادات عبر «حذف الحساب والبيانات»، أو بطلب على البريد الإلكتروني المذكور بالبند ١. الفواتير يلي القانون بيفرض الاحتفاظ فيها بتضل لحد ما تخلص المدة.\n\nبيانات إشعارات التذكير (المعرّف، صلاحية الإشعارات، عناوين/تواريخ المواعيد) بتتخزن عندنا طول ما ميزة التذكير مفعّلة، وبتنمسح تلقائياً لما توقفيها.',
  },
  {
    heading: '٥. مشاركة البيانات مع أطراف تالتة',
    body: 'Anthropic PBC (أمريكا): بتعالج صور رسائل المدرسة لتحليلها، وكمان المعلومات المذكورة بالبند ٣-د لتوليد مسودات الردود. هاد نقل بيانات لدولة خارج الاتحاد الأوروبي؛ منتأكد إنه في ضمانات مناسبة إلها (متل بنود تعاقدية معيارية).\n\nSupabase Inc.: مزوّد خدمة تسجيل الدخول لحسابك (الإيميل، كلمة السر، عملية الدخول).\n\nStripe: مزوّد خدمة الدفع للاشتراكات (شوفي البند ٣-و).\n\nVercel Inc. (أمريكا): استضافة التطبيق ووظائف السيرفر وسجلات السيرفر.\n\nUpstash, Inc. (أمريكا): قاعدة البيانات يلي فيها النسخة الاحتياطية وإثبات الموافقة وإشعارات التذكير وحالة الاشتراك والتقييمات وتقارير الأخطاء.\n\nResend (أمريكا): إرسال إيميلات كود الدخول.\n\nمكان التخزين وضمانات نقل البيانات لكل مزوّد موضّحة بالنسخة الألمانية (البند ٦ و٧).\n\nما منبيع أي بيانات لأي جهة، وما منستخدم أدوات إعلانات أو تتبّع.',
  },
  {
    heading: '٦. بيانات الأطفال',
    body: 'Brifo موجّه للأهل/الأوصياء يلي بيدخلوا معلومات عن أطفالهم (الاسم، الصف) بأنفسهم لتنظيم رسائل المدرسة. المسؤولية بإدخال وإدارة هالمعلومات على عاتق الأهل/الوصي. المعلومات بتتخزن متل ما موضّح بالبند ٣ و٤.',
  },
  {
    heading: '٧. حقوقك',
    body: 'حسب GDPR، إلك الحق بالاطلاع على بياناتك وتصحيحها وحذفها وتقييد معالجتها، وكمان حق نقل البيانات والاعتراض. للبيانات المحلية على جهازك، فيك تمارسي هالحقوق مباشرة من التطبيق (اطلاع، تعديل، حذف، تصدير كملف عبر "نسخة احتياطية"). حذف الحساب بالكامل متاح من الإعدادات. لأي طلب تاني بخصوص البيانات يلي عندنا بالسيرفر، التواصل بيكون عبر البريد الإلكتروني المذكور بالبند ١.\n\nكمان إلك الحق تقدمي شكوى لهيئة حماية البيانات النمساوية (Barichgasse 40–42, 1030 Wien، dsb.gv.at).',
  },
  {
    heading: '٨. تواصل معنا',
    body: 'لأي سؤال عن الخصوصية، تواصلي معنا عبر: team@smartordi.eu',
  },
];

export const privacyPolicyTr: PolicySection[] = [
  {
    heading: 'Bu çeviri hakkında',
    body: 'Bu çeviri gizlilik politikasının daha eski bir sürümüne dayanmaktadır; yanlış ifadeler düzeltilmiştir. Eksiksiz ve bağlayıcı sürüm Almanca sürümdür (sürüm 6); tüm hizmet sağlayıcılar, her işlemenin hukuki dayanağı, saklama süreleri ve haklarınız orada eksiksiz yer alır. Tam çeviri yakında eklenecektir.',
  },
  {
    heading: '1. Veri sorumlusu',
    body: 'SmartOrdi OG, Steingasse 6a, 4020 Linz, Avusturya\nE-posta: team@smartordi.eu\nTicaret sicil numarası: FN 675586 i\n\n"Brifo" uygulaması kapsamında kişisel verilerin işlenmesinden Genel Veri Koruma Yönetmeliği (GDPR) anlamında yukarıda belirtilen şirket sorumludur.',
  },
  {
    heading: '2. Genel bilgiler',
    body: 'Brifo, Avusturya\'daki ailelerin Almanca mektupları (okul, doktor, sigorta, resmi makamlar vb.) kendi dillerinde anlamalarına, randevuları yönetmelerine ve Almanca cevap yazmalarına yardımcı olur. Bu metin, uygulamanın hangi verileri, hangi amaçla işlediğini ve ilgili kişi olarak haklarınızı açıklar.\n\nBrifo\'yu kullanmak için, verilerinizin cihazlar arasında güvenle erişilebilir olması amacıyla bir kullanıcı hesabı (tek kullanımlık giriş kodlu e-posta adresi, şifre isteğe bağlı) gereklidir. Aile ve kullanım verileriniz hem cihazınızda yerel olarak hem de — hesabınızla ilişkilendirilmiş bir yedek kopya olarak — sunucumuzda saklanır (bkz. madde 3 ve 4).',
  },
  {
    heading: '3. Hangi verileri işliyoruz',
    body: 'a) Hesap verileri: kimlik doğrulama sağlayıcımız Supabase üzerinden yönetilen e-posta adresiniz ve şifreniz (bkz. madde 5). Şifrenizi biz hiçbir zaman açık metin olarak görmeyiz. Ayrıca bu gizlilik politikasına onayınızın kaydını (sürüm ve zaman) saklarız.\n\nb) Aile profilleri: kendinizin girdiği ad, rol (çocuk/yetişkin), sınıf düzeyi ve okul adı.\n\nc) Mektup fotoğrafları: bir mektubu fotoğrafladığınızda, görsel analiz için yapay zeka sağlayıcımız Anthropic\'e gönderilir (bkz. madde 5). Görsel sunucumuzda saklanmaz; ancak küçültülmüş bir kopyası, mektubu silene kadar mektupla birlikte cihazınızda saklanır. Anthropic, API girdilerini ve çıktılarını varsayılan olarak 30 gün içinde siler; yalnızca kullanım politikası incelemesi için işaretlenirse veya yasal olarak gerekirse daha uzun saklar ve bunları modellerini eğitmek için kullanmaz. Mektuplar sağlık verileri içerebilir; bu tür verileri yalnızca ilk analizden önce ayrıca alınan açık onayınızla işleriz.\n\nd) Cevap taslakları: bir okul mektubuna cevap oluşturmanızı istediğinizde, bunun için gerekli bilgileri (örn. çocuğun adı ve sınıf düzeyi ile girdiğiniz serbest metin notları) cevap metnini oluşturmak üzere Anthropic\'e iletiriz.\n\ne) Randevular, ödemeler, görevler ve uygulamaya ilişkin değerlendirmeniz/geri bildiriminiz. Değerlendirmeniz/geri bildiriminiz ayrıca hesabınız veya cihazınızla ilişkilendirilmeden anonim olarak da saklanır, böylece uygulamaya dair geri bildirimleri değerlendirebiliriz.\n\nf) Ödeme verileri: bir abonelik satın aldığınızda, ödeme sağlayıcımız Stripe (bkz. madde 5) e-posta adresinizi ve abonelik/ödeme durumunuzu işler. Ödeme bilgilerini (örn. kredi kartı numarası) biz hiçbir zaman görmeyiz — bunlar yalnızca Stripe tarafından işlenir.\n\ng) Push bildirimleri (isteğe bağlı, yalnızca etkinleştirirseniz): cihazınıza rastgele bir cihaz kimliği ve bir push izni (tarayıcınızın uç nokta URL\'si ve şifreleme anahtarları) atanır. Bunlar ile yaklaşan randevularınızın başlığı ve tarihleri, size yalnızca hatırlatma göndermek amacıyla sunucumuzda saklanır.\n\nh) Teknik veriler: dil ayarı (Arapça/Almanca/Türkçe) ve görünüm modu (açık/koyu) — yerel olarak saklanır.\n\ni) Hata raporları: uygulamada bir hata oluştuğunda, hata metni ve teknik hata izi, hatanın oluştuğu ekran, dil ayarınız ve uygulama sürümü, hatayı bulup düzeltebilmemiz için sunucumuza gönderilir. Bu raporlar hesabınız veya cihazınızla ilişkilendirilmez; e-posta adresleri, erişim anahtarları, kimlikler ve uzun sayı dizileri gönderilmeden önce otomatik olarak kaldırılır. Raporlar 30 gün sonra silinir.\n\nb), c) ve e) maddelerinde belirtilen veriler hem cihazınızda yerel olarak hem de hesabınızla ilişkilendirilmiş bir yedek kopya olarak sunucumuzda saklanır (bkz. madde 4) — mektup fotoğrafları hariç; bunlar yalnızca cihazınızda kalır.',
  },
  {
    heading: '4. Saklama yeri ve süresi',
    body: 'Aile profilleriniz, mektup özetleriniz, randevularınız, ödemeleriniz, görevleriniz ve değerlendirmeleriniz hem cihazınızda yerel olarak hem de kullanıcı hesabınızla ilişkilendirilmiş bir yedek kopya olarak sunucumuzda saklanır — böylece yeni bir cihazda oturum açtığınızda verileriniz korunur. Tek tek kayıtları, bir profili veya tüm verilerinizi istediğiniz zaman ayarlar üzerinden silebilirsiniz; bu, sunucumuzdaki kopyaya da yansıtılır. Kullanıcı hesabınızı (sunucudaki yedek kopya ve giriş bilgileri dahil) Ayarlar\'da «Hesabı ve verileri sil» ile veya madde 1\'deki e-posta adresine yazarak tamamen silebilirsiniz. Yasal olarak saklamamız gereken faturalar, saklama süresi dolana kadar tutulur.\n\nPush bildirimleri için veriler (cihaz kimliği, push izni, randevu başlıkları/tarihleri), hatırlatma özelliği etkin olduğu sürece saklanır ve bunu devre dışı bıraktığınızda veya push iznini iptal ettiğinizde otomatik olarak silinir.',
  },
  {
    heading: '5. Üçüncü taraflarla paylaşım (veri işleyenler)',
    body: 'Anthropic PBC (ABD): fotoğraflanan okul mektuplarını metin tanıma/analiz için ve madde 3d\'de belirtilen bilgileri cevap taslakları oluşturmak için işler. Bu, bir üçüncü ülkeye (ABD) veri aktarımı anlamına gelir; bunun için uygun güvencelerin (örn. standart sözleşme maddeleri) bulunmasını sağlarız.\n\nSupabase Inc.: kullanıcı hesabınız için kimlik doğrulama sağlayıcısı (e-posta, şifre, oturum açma işlemi).\n\nStripe: abonelikler için ödeme sağlayıcısı (bkz. madde 3f).\n\nVercel Inc. (ABD): uygulamanın ve sunucu fonksiyonlarının barındırılması, sunucu kayıtları.\n\nUpstash, Inc. (ABD): yedek kopya, onay kaydı, push hatırlatmaları, abonelik durumu, değerlendirmeler ve hata raporlarının tutulduğu veritabanı.\n\nResend (ABD): giriş e-postalarının gönderimi.\n\nHer sağlayıcının saklama yeri ve aktarım güvenceleri Almanca sürümde (madde 6 ve 7) açıklanmıştır.\n\nVerileri üçüncü taraflara satmıyoruz ve reklam veya izleme hizmetleri kullanmıyoruz.',
  },
  {
    heading: '6. Çocuklara ait veriler',
    body: 'Brifo, okul mektuplarını düzenlemek için çocuklarına ait bilgileri (ad, sınıf düzeyi) kendileri giren ebeveynlere/velilere yöneliktir. Bu bilgilerin girilmesi ve yönetilmesi sorumluluğu ebeveynlere/velilere aittir. Bilgiler madde 3 ve 4\'te açıklandığı şekilde saklanır.',
  },
  {
    heading: '7. Haklarınız',
    body: 'GDPR uyarınca, verilerinizin işlenmesine ilişkin bilgi alma, düzeltme, silme ve kısıtlama hakkına, ayrıca veri taşınabilirliği ve itiraz hakkına sahipsiniz. Cihazınızda yerel olarak saklanan veriler için bu hakları doğrudan uygulama üzerinden kullanabilirsiniz (görüntüleme, düzenleme, silme, "kullanım verilerini yedekle" ile dosya olarak dışa aktarma). Hesabınızı Ayarlar\'dan tamamen silebilirsiniz. Sunucumuzdaki verilerle ilgili diğer talepler için madde 1\'de belirtilen e-posta adresinden bizimle iletişime geçin.\n\nAyrıca Avusturya Veri Koruma Kurumu\'na (Barichgasse 40–42, 1030 Viyana, dsb.gv.at) şikayette bulunma hakkınız vardır.',
  },
  {
    heading: '8. İletişim',
    body: 'Veri gizliliğiyle ilgili sorularınız için bize şu adresten ulaşabilirsiniz: team@smartordi.eu',
  },
];

export const privacyPolicyFa: PolicySection[] = [
  {
    heading: 'درباره این ترجمه',
    body: 'این ترجمه بر پایه نسخه قدیمی‌تری از سیاست حریم خصوصی است و جمله‌های نادرست آن اصلاح شده‌اند. نسخه کامل و معتبر، نسخه آلمانی (نسخه ۶) است که همه ارائه‌دهندگان خدمات، مبنای قانونی هر پردازش، مدت نگهداری و حقوقت را به‌طور کامل شرح می‌دهد. ترجمه کامل به‌زودی اضافه می‌شود.',
  },
  {
    heading: '۱. مسئول حفاظت از داده‌ها',
    body: 'SmartOrdi OG، Steingasse 6a، 4020 لینتس، اتریش\nایمیل: team@smartordi.eu\nشماره ثبت شرکت: FN 675586 i\n\nشرکت فوق مسئول پردازش داده‌های شخصی در چارچوب اپلیکیشن «Brifo» طبق مقررات عمومی حفاظت از داده اتحادیه اروپا (GDPR) است.',
  },
  {
    heading: '۲. کلیات',
    body: 'Brifo به خانواده‌ها در اتریش کمک می‌کند نامه‌های آلمانی (از مدرسه، پزشک، بیمه، ادارات و غیره) را به زبان خودشان بفهمند، قرارها را مدیریت کنند و پاسخ به آلمانی بنویسند. این سند توضیح می‌دهد اپلیکیشن چه داده‌هایی را برای چه هدفی پردازش می‌کند و به‌عنوان فرد صاحب داده چه حقوقی دارید.\n\nبرای استفاده از Brifo، ایجاد یک حساب کاربری (ایمیل با کد ورود یک‌بارمصرف، رمز عبور اختیاری) لازم است تا داده‌هایت به‌طور امن بین دستگاه‌ها در دسترس باشد. داده‌های خانوادگی و استفاده‌ات هم به‌صورت محلی روی دستگاهت و هم — به‌عنوان یک نسخه پشتیبان مرتبط با حسابت — روی سرور ما ذخیره می‌شود (به بند ۳ و ۴ مراجعه کن).',
  },
  {
    heading: '۳. چه داده‌هایی را پردازش می‌کنیم',
    body: 'الف) داده‌های حساب: ایمیل و رمز عبورت، که از طریق ارائه‌دهنده احراز هویت ما Supabase مدیریت می‌شود (به بند ۵ مراجعه کن). ما هرگز رمز عبورت را به‌صورت متن ساده نمی‌بینیم. علاوه بر این، سابقه موافقتت با این سیاست حفظ حریم خصوصی (نسخه و زمان) را ذخیره می‌کنیم.\n\nب) پروفایل‌های خانواده: نام، نقش (کودک/بزرگسال)، پایه تحصیلی و نام مدرسه که خودت وارد می‌کنی.\n\nج) عکس نامه‌ها: وقتی یک نامه را عکس می‌گیری، تصویر برای تحلیل به ارائه‌دهنده هوش مصنوعی ما Anthropic ارسال می‌شود (به بند ۵ مراجعه کن). تصویر روی سرور ما ذخیره نمی‌شود، اما یک نسخه کوچک‌شده از آن همراه نامه روی دستگاهت ذخیره می‌شود تا وقتی نامه را حذف کنی. Anthropic ورودی‌ها و خروجی‌های API را به‌طور پیش‌فرض ظرف ۳۰ روز حذف می‌کند، فقط در صورت علامت‌گذاری برای بررسی نقض سیاست استفاده یا الزام قانونی آن‌ها را بیشتر نگه می‌دارد و از آن‌ها برای آموزش مدل‌هایش استفاده نمی‌کند. نامه‌ها ممکن است داده‌های سلامت داشته باشند؛ چنین داده‌هایی را فقط با رضایت صریح جداگانه‌ات که پیش از اولین تحلیل گرفته می‌شود پردازش می‌کنیم.\n\nد) پیش‌نویس پاسخ‌ها: وقتی از اپلیکیشن می‌خواهی برایت پاسخی برای یک نامه مدرسه بنویسد، اطلاعات لازم برای این کار (مثلاً نام و پایه تحصیلی کودک و یادداشت‌های متنی که خودت می‌نویسی) را برای تولید متن پاسخ به Anthropic ارسال می‌کنیم.\n\nه) قرارها، پرداخت‌ها، کارها و ارزیابی/بازخوردت درباره اپلیکیشن. ارزیابی/بازخوردت به‌طور جداگانه و ناشناس (بدون ارتباط با حساب یا دستگاهت) هم ذخیره می‌شود تا بتوانیم بازخوردها را بررسی کنیم.\n\nو) داده‌های پرداخت: هنگام خرید اشتراک، ارائه‌دهنده پرداخت ما Stripe (به بند ۵ مراجعه کن) ایمیل و وضعیت اشتراک/پرداختت را پردازش می‌کند. اطلاعات پرداخت (مثلاً شماره کارت اعتباری) را ما هرگز نمی‌بینیم — این اطلاعات فقط توسط Stripe پردازش می‌شود.\n\nز) اعلان‌های فوری (اختیاری، فقط در صورت فعال‌سازی): دستگاهت یک شناسه تصادفی و یک مجوز اعلان (آدرس نقطه پایانی و کلیدهای رمزنگاری مرورگرت) دریافت می‌کند. این اطلاعات به همراه عنوان و تاریخ قرارهای پیش‌رویت، فقط برای ارسال یادآوری، روی سرور ما ذخیره می‌شود.\n\nح) داده‌های فنی: تنظیم زبان (عربی/آلمانی/ترکی/فارسی) و حالت نمایش (روشن/تیره) — به‌صورت محلی ذخیره می‌شود.\n\nط) گزارش خطا: اگر در برنامه خطایی رخ دهد، متن خطا و جزئیات فنی آن، صفحه‌ای که خطا در آن رخ داده، تنظیم زبان شما و نسخه برنامه به سرور ما فرستاده می‌شود تا خطا را پیدا و برطرف کنیم. این گزارش‌ها به حساب یا دستگاه شما پیوند ندارند؛ نشانی‌های ایمیل، کلیدهای دسترسی، شناسه‌ها و رشته‌های عددی طولانی پیش از ارسال به‌طور خودکار حذف می‌شوند. گزارش‌ها پس از ۳۰ روز پاک می‌شوند.\n\nداده‌های ذکرشده در بندهای ب، ج و ه هم به‌صورت محلی روی دستگاهت و هم به‌عنوان نسخه پشتیبان مرتبط با حسابت روی سرور ما ذخیره می‌شود (به بند ۴ مراجعه کن) — به‌جز عکس نامه‌ها که فقط روی دستگاهت می‌مانند.',
  },
  {
    heading: '۴. محل و مدت نگهداری داده‌ها',
    body: 'پروفایل‌های خانواده، خلاصه نامه‌ها، قرارها، پرداخت‌ها، کارها و ارزیابی‌هایت هم به‌صورت محلی روی دستگاهت و هم به‌عنوان نسخه پشتیبان مرتبط با حساب کاربری‌ات روی سرور ما ذخیره می‌شود — تا هنگام ورود از دستگاه جدید، داده‌هایت حفظ شوند. می‌توانی هر زمان تک‌تک موارد، یک پروفایل، یا همه داده‌هایت را از طریق تنظیمات حذف کنی؛ این تغییر در سرور ما نیز اعمال می‌شود. می‌توانی حساب کاربری‌ات را (همراه با نسخه پشتیبان سرور و اطلاعات ورود) از تنظیمات با «حذف حساب و داده‌ها» یا با درخواست از طریق ایمیل ذکرشده در بند ۱ به‌طور کامل حذف کنی. فاکتورهایی که قانوناً باید نگه داریم تا پایان مهلت نگهداری می‌شوند.\n\nداده‌های اعلان‌های فوری (شناسه دستگاه، مجوز اعلان، عنوان/تاریخ قرارها) تا زمانی که قابلیت یادآوری فعال باشد ذخیره می‌شود و با غیرفعال کردن آن یا لغو مجوز اعلان، به‌طور خودکار حذف می‌شود.',
  },
  {
    heading: '۵. اشتراک‌گذاری با اشخاص ثالث (پردازشگران داده)',
    body: 'Anthropic PBC (آمریکا): نامه‌های مدرسه عکس‌گرفته‌شده را برای تشخیص متن/تحلیل و همچنین اطلاعات ذکرشده در بند ۳-د را برای تولید پیش‌نویس پاسخ پردازش می‌کند. این به معنای انتقال داده به یک کشور ثالث (آمریکا) است؛ ما اطمینان حاصل می‌کنیم که تضمین‌های مناسب (مثلاً بندهای قراردادی استاندارد) برای آن وجود دارد.\n\nSupabase Inc.: ارائه‌دهنده احراز هویت برای حساب کاربری‌ات (ایمیل، رمز عبور، فرآیند ورود).\n\nStripe: ارائه‌دهنده پرداخت برای اشتراک‌ها (به بند ۳-و مراجعه کن).\n\nVercel Inc. (آمریکا): میزبانی اپلیکیشن و توابع سرور، گزارش‌های سرور.\n\nUpstash, Inc. (آمریکا): پایگاه داده نسخه پشتیبان، سابقه رضایت، یادآوری‌ها، وضعیت اشتراک، ارزیابی‌ها و گزارش‌های خطا.\n\nResend (آمریکا): ارسال ایمیل‌های ورود.\n\nمحل ذخیره و تضمین‌های انتقال هر ارائه‌دهنده در نسخه آلمانی (بند ۶ و ۷) آمده است.\n\nما هیچ داده‌ای را به اشخاص ثالث نمی‌فروشیم و از هیچ سرویس تبلیغاتی یا ردیابی استفاده نمی‌کنیم.',
  },
  {
    heading: '۶. داده‌های کودکان',
    body: 'Brifo برای والدین/سرپرستانی طراحی شده که خودشان اطلاعات فرزندانشان (نام، پایه تحصیلی) را برای سازماندهی نامه‌های مدرسه وارد می‌کنند. مسئولیت وارد کردن و مدیریت این اطلاعات بر عهده والدین/سرپرست است. این اطلاعات طبق توضیح بند ۳ و ۴ ذخیره می‌شود.',
  },
  {
    heading: '۷. حقوق شما',
    body: 'طبق GDPR، حق دارید از پردازش داده‌هایت مطلع شوی، آن را اصلاح، حذف یا محدود کنی، و همچنین حق انتقال داده و اعتراض داری. برای داده‌های ذخیره‌شده به‌صورت محلی روی دستگاهت، می‌توانی این حقوق را مستقیماً از طریق اپلیکیشن اعمال کنی (مشاهده، ویرایش، حذف، خروجی‌گیری به‌صورت فایل از طریق «پشتیبان‌گیری از داده‌های استفاده»). حذف کامل حسابت از تنظیمات ممکن است. برای درخواست‌های دیگر درباره داده‌های روی سرور ما، از طریق ایمیل ذکرشده در بند ۱ با ما تماس بگیر.\n\nهمچنین حق داری از اداره حفاظت از داده‌های اتریش (Barichgasse 40–42, 1030 وین، dsb.gv.at) شکایت کنی.',
  },
  {
    heading: '۸. تماس با ما',
    body: 'برای هر سؤالی درباره حریم خصوصی، می‌توانید از طریق team@smartordi.eu با ما تماس بگیرید.',
  },
];

export const privacyPolicyEn: PolicySection[] = [
  {
    heading: 'About this translation',
    body: 'This translation is based on an earlier version of the privacy policy, with incorrect statements corrected. The complete and authoritative version is the German one (version 6), which sets out all service providers, the legal basis for each processing activity, retention periods and your rights in full. A full translation will follow.',
  },
  {
    heading: '1. Data controller',
    body: 'SmartOrdi OG, Steingasse 6a, 4020 Linz, Austria\nEmail: team@smartordi.eu\nCompany register number: FN 675586 i\n\nThe company named above is responsible for processing personal data within the "Brifo" app under the General Data Protection Regulation (GDPR).',
  },
  {
    heading: '2. General',
    body: 'Brifo helps families in Austria understand German letters (from schools, doctors, insurers, authorities and others) in their own language, manage appointments, and draft replies in German. This notice describes what data the app processes, for what purpose, and what rights you have as the data subject.\n\nTo use Brifo, a user account (email address with a one-time sign-in code, password optional) is required so your data is securely accessible across devices. Your family and usage data is stored both locally on your device and — as a backup copy linked to your account — on our server (see sections 3 and 4).',
  },
  {
    heading: '3. What data we process',
    body: 'a) Account data: your email address and password, managed via our authentication provider Supabase (see section 5). We never see your password in plain text ourselves. We also store a record of your consent to this privacy policy (version and timestamp).\n\nb) Family profiles: name, role (child/adult), grade level, and school name, which you enter yourself.\n\nc) Photos of letters: when you photograph a letter, the image is sent to our AI provider Anthropic for analysis (see section 5). The image is not stored on our server, but a reduced copy is stored on your device together with the letter until you delete the letter. Anthropic deletes API inputs and outputs within 30 days by default, keeps them longer only if they are flagged for usage-policy review or where required by law, and does not use them to train its models. Letters can contain health data; we process such data only with your separate explicit consent, asked before the first analysis.\n\nd) Reply drafts: when you have the app draft a reply to a school letter, we send the information needed for this (e.g. the child\'s name and grade level, plus any free-text notes you enter) to Anthropic to generate the reply text.\n\ne) Appointments, payments, tasks, and your rating/feedback about the app. Your rating/feedback is additionally stored anonymously (without any link to your account or device) so we can review feedback about the app.\n\nf) Payment data: when you take out a subscription, our payment provider Stripe (see section 5) processes your email address and your subscription/payment status. We ourselves never see payment details (e.g. credit card number) — these are processed exclusively by Stripe.\n\ng) Push notifications (optional, only if you enable them): your device receives a random device ID and a push permission (your browser\'s endpoint URL and encryption keys). These, along with the titles and dates of your upcoming appointments, are stored on our server solely to deliver reminders to you.\n\nh) Technical data: language setting (Arabic/German/Turkish/Persian/English) and display mode (light/dark) — stored locally.\n\ni) Error reports: when something goes wrong in the app, the error text and its technical trace, the screen it happened on, your language setting and the app version are sent to our server so we can find and fix the fault. These reports are not linked to your account or your device; email addresses, access keys, identifiers and longer number sequences are removed automatically before sending. The reports are deleted after 30 days.\n\nThe data listed under b), c), and e) is stored both locally on your device and, linked to your account, as a backup copy on our server (see section 4) — except letter photos, which stay on your device only.',
  },
  {
    heading: '4. Storage location and retention period',
    body: 'Your family profiles, letter summaries, appointments, payments, tasks, and ratings are stored both locally on your device and as a backup copy on our server, linked to your user account — so your data is preserved when you sign in on a new device. You can delete individual entries, a profile, or all your data at any time via Settings; this is also reflected on our server. You can delete your user account completely (including the server-side backup copy and your login) in Settings via “Delete account and data”, or by request to the email address given in section 1. Invoices we are legally required to keep are retained until the retention period ends.\n\nData for push notifications (device ID, push permission, appointment titles/dates) is stored as long as the reminder feature is enabled, and automatically deleted when you disable it or revoke your push permission.',
  },
  {
    heading: '5. Sharing with third parties (data processors)',
    body: 'Anthropic PBC (USA): processes photographed school letters for text recognition/analysis, as well as the information listed in section 3d, to generate reply drafts. This involves a data transfer to a third country (USA); we ensure appropriate safeguards (e.g. standard contractual clauses) are in place for this.\n\nSupabase Inc.: authentication provider for your user account (email, password, sign-in process).\n\nStripe: payment provider for subscriptions (see section 3f).\n\nVercel Inc. (USA): hosting of the app and the server functions, server logs.\n\nUpstash, Inc. (USA): database holding the backup copy, proof of consent, push reminders, subscription status, ratings and error reports.\n\nResend (USA): sending sign-in emails.\n\nStorage locations and transfer safeguards for each provider are set out in the German version (sections 6 and 7).\n\nWe do not sell data to third parties and do not use advertising or tracking services.',
  },
  {
    heading: '6. Children\'s data',
    body: 'Brifo is intended for parents/guardians who themselves enter information about their children (name, grade level) to organize school letters. Entering and managing this information is the responsibility of the parents/guardian. The information is stored as described in sections 3 and 4.',
  },
  {
    heading: '7. Your rights',
    body: 'Under the GDPR, you have the right to access, rectify, delete, and restrict the processing of your data, as well as the right to data portability and to object. For data stored locally on your device, you can exercise these rights directly in the app (viewing, editing, deleting, exporting as a file via "back up usage data"). You can delete your account completely in Settings. For any other request about data on our server, contact us at the email address given in section 1.\n\nYou also have the right to lodge a complaint with the Austrian Data Protection Authority (Barichgasse 40–42, 1030 Vienna, dsb.gv.at).',
  },
  {
    heading: '8. Contact',
    body: 'For questions about privacy, reach us at: team@smartordi.eu',
  },
];

export const privacyPolicyUk: PolicySection[] = [
  {
    heading: 'Про цей переклад',
    body: 'Цей переклад ґрунтується на попередній версії політики конфіденційності, неправильні твердження в ньому виправлено. Повною та обов\'язковою є німецька версія (версія 6), де повністю наведено всіх постачальників послуг, правові підстави кожної обробки, строки зберігання та ваші права. Повний переклад з\'явиться згодом.',
  },
  {
    heading: '1. Контролер даних',
    body: 'SmartOrdi OG, Steingasse 6a, 4020 Лінц, Австрія\nЕлектронна пошта: team@smartordi.eu\nНомер у торговому реєстрі: FN 675586 i\n\nЗазначена вище компанія відповідає за обробку персональних даних у межах застосунку "Brifo" відповідно до Загального регламенту про захист даних (GDPR).',
  },
  {
    heading: '2. Загальні відомості',
    body: 'Brifo допомагає родинам в Австрії розуміти німецькі листи (від школи, лікаря, страхової, установ тощо) своєю мовою, керувати зустрічами та писати відповіді німецькою. Цей документ описує, які дані обробляє застосунок, з якою метою і які права ви маєте як суб\'єкт даних.\n\nДля користування Brifo потрібен обліковий запис (електронна пошта з одноразовим кодом входу, пароль — за бажанням), щоб ваші дані були безпечно доступні на всіх пристроях. Ваші дані про родину та використання зберігаються як локально на вашому пристрої, так і — як резервна копія, пов\'язана з вашим обліковим записом — на нашому сервері (див. пункти 3 і 4).',
  },
  {
    heading: '3. Які дані ми обробляємо',
    body: 'а) Дані облікового запису: ваша електронна пошта та пароль, якими керує наш постачальник автентифікації Supabase (див. пункт 5). Ми самі ніколи не бачимо ваш пароль у відкритому вигляді. Ми також зберігаємо запис про вашу згоду на цю політику конфіденційності (версію та час).\n\nб) Профілі родини: ім\'я, роль (дитина/дорослий), клас і назва школи, які ви вводите самостійно.\n\nв) Фото листів: коли ви фотографуєте лист, зображення надсилається на аналіз нашому постачальнику ШІ Anthropic (див. пункт 5). Зображення не зберігається на нашому сервері, але зменшена копія зберігається на вашому пристрої разом із листом, доки ви не видалите лист. Anthropic за замовчуванням видаляє вхідні та вихідні дані API протягом 30 днів, зберігає їх довше лише в разі позначення для перевірки на порушення правил використання або якщо цього вимагає закон, і не використовує їх для навчання своїх моделей. Листи можуть містити дані про здоров\'я; такі дані ми обробляємо лише з вашої окремої явної згоди, яку запитуємо перед першим аналізом.\n\nг) Чернетки відповідей: коли ви просите застосунок скласти відповідь на шкільний лист, ми надсилаємо необхідну для цього інформацію (наприклад, ім\'я та клас дитини, а також будь-які текстові нотатки, які ви вводите) до Anthropic для створення тексту відповіді.\n\nд) Зустрічі, платежі, завдання та ваша оцінка/відгук про застосунок. Ваша оцінка/відгук також зберігається окремо й анонімно (без прив\'язки до вашого облікового запису чи пристрою), щоб ми могли аналізувати відгуки про застосунок.\n\nе) Дані платежів: коли ви оформлюєте підписку, наш платіжний провайдер Stripe (див. пункт 5) обробляє вашу електронну пошту та статус підписки/платежу. Дані платежу (наприклад, номер кредитної картки) ми самі ніколи не бачимо — їх обробляє виключно Stripe.\n\nє) Push-сповіщення (необов\'язково, лише якщо ви їх увімкнете): ваш пристрій отримує випадковий ідентифікатор пристрою та дозвіл на push-сповіщення (URL-адресу кінцевої точки та ключі шифрування вашого браузера). Ці дані разом із назвами та датами ваших найближчих зустрічей зберігаються на нашому сервері виключно для надсилання вам нагадувань.\n\nж) Технічні дані: налаштування мови (арабська/німецька/турецька/перська/англійська/українська) та режим показу (світлий/темний) — зберігаються локально.\n\nз) Звіти про помилки: якщо в застосунку виникає помилка, текст помилки та її технічний слід, екран, на якому вона сталася, ваше налаштування мови та версія застосунку надсилаються на наш сервер, щоб ми могли знайти та виправити несправність. Ці звіти не пов’язані з вашим обліковим записом або вашим пристроєм; адреси електронної пошти, ключі доступу, ідентифікатори та довгі послідовності цифр автоматично видаляються перед надсиланням. Звіти видаляються через 30 днів.\n\nДані, зазначені в пунктах б), в) і д), зберігаються як локально на вашому пристрої, так і, пов\'язані з вашим обліковим записом, як резервна копія на нашому сервері (див. пункт 4) — крім фото листів, які залишаються лише на вашому пристрої.',
  },
  {
    heading: '4. Місце та термін зберігання даних',
    body: 'Ваші профілі родини, підсумки листів, зустрічі, платежі, завдання та оцінки зберігаються як локально на вашому пристрої, так і як резервна копія на нашому сервері, пов\'язана з вашим обліковим записом — щоб ваші дані збереглися, коли ви входите з нового пристрою. Ви можете видалити окремі записи, профіль або всі свої дані будь-коли через налаштування; це також відображається на нашому сервері. Ви можете повністю видалити свій обліковий запис (разом із резервною копією на сервері та даними входу) в налаштуваннях через «Видалити обліковий запис і дані» або на запит за електронною адресою, вказаною в пункті 1. Рахунки, які ми зобов\'язані зберігати за законом, зберігаються до кінця строку.\n\nДані для push-сповіщень (ідентифікатор пристрою, дозвіл на сповіщення, назви/дати зустрічей) зберігаються, поки функція нагадувань увімкнена, і автоматично видаляються, коли ви її вимикаєте або відкликаєте дозвіл на сповіщення.',
  },
  {
    heading: '5. Передача третім особам (обробникам даних)',
    body: 'Anthropic PBC (США): обробляє сфотографовані шкільні листи для розпізнавання тексту/аналізу, а також інформацію, зазначену в пункті 3г, для створення чернеток відповідей. Це передбачає передачу даних до третьої країни (США); ми забезпечуємо наявність відповідних гарантій (наприклад, стандартних договірних положень) для цього.\n\nSupabase Inc.: постачальник автентифікації для вашого облікового запису (електронна пошта, пароль, процес входу).\n\nStripe: платіжний провайдер для підписок (див. пункт 3е).\n\nVercel Inc. (США): хостинг застосунку та серверних функцій, серверні журнали.\n\nUpstash, Inc. (США): база даних із резервною копією, записом згоди, нагадуваннями, статусом підписки, оцінками та звітами про помилки.\n\nResend (США): надсилання листів для входу.\n\nМісце зберігання та гарантії передачі для кожного постачальника наведено в німецькій версії (пункти 6 і 7).\n\nМи не продаємо дані третім особам і не використовуємо рекламні чи трекінгові сервіси.',
  },
  {
    heading: '6. Дані дітей',
    body: 'Brifo призначений для батьків/опікунів, які самостійно вводять інформацію про своїх дітей (ім\'я, клас) для впорядкування шкільних листів. Введення й керування цією інформацією є відповідальністю батьків/опікуна. Інформація зберігається так, як описано в пунктах 3 і 4.',
  },
  {
    heading: '7. Ваші права',
    body: 'Відповідно до GDPR ви маєте право на доступ, виправлення, видалення та обмеження обробки ваших даних, а також право на перенесення даних і заперечення. Для даних, що зберігаються локально на вашому пристрої, ви можете реалізувати ці права безпосередньо в застосунку (перегляд, редагування, видалення, експорт у файл через "резервне копіювання даних використання"). Повністю видалити обліковий запис можна в налаштуваннях. З іншими запитами щодо даних на нашому сервері звертайтеся за електронною адресою, вказаною в пункті 1.\n\nВи також маєте право подати скаргу до Австрійського органу захисту даних (Barichgasse 40–42, 1030 Відень, dsb.gv.at).',
  },
  {
    heading: '8. Контакти',
    body: 'З питань конфіденційності ви можете зв\'язатися з нами за адресою: team@smartordi.eu',
  },
];
