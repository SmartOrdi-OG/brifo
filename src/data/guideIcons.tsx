import {
  School,
  BarChart3,
  MessageCircle,
  Scale,
  AlertTriangle,
  FileText,
  MessagesSquare,
  Umbrella,
  Euro,
  Clock,
  Handshake,
  Shuffle,
  ReceiptText,
  CalendarCheck,
  Stamp,
  Baby,
  Home,
  Stethoscope,
  Briefcase,
  BookUser,
  Blocks,
  PiggyBank,
  type LucideIcon,
} from 'lucide-react';
import type { GuideArticleId } from './guideArticles';

/** Guide article ids are the same across languages, so one icon map covers
 * both — see guideArticles.ts.
 *
 * Every article needs an entry: both screens do `GUIDE_ARTICLE_ICONS[id]` and
 * render the result directly, so a missing one is not a blank space, it is
 * `<undefined />` and a blank screen. Keying the record on GuideArticleId
 * rather than string is what keeps that from ever shipping — omit one and the
 * build fails here. */
export const GUIDE_ARTICLE_ICONS: Record<GuideArticleId, LucideIcon> = {
  'school-types': School,
  'grading-system': BarChart3,
  sprechstunde: MessageCircle,
  'parent-rights': Scale,
  fruehwarnung: AlertTriangle,
  enrollment: FileText,
  deutschfoerderklasse: MessagesSquare,
  'school-holidays': Umbrella,
  'school-costs': Euro,
  nachmittagsbetreuung: Clock,
  elternverein: Handshake,
  uebertritt: Shuffle,
  'rechnung-mahnung': ReceiptText,
  termine: CalendarCheck,
  behoerdenbrief: Stamp,
  familienbeihilfe: Baby,
  meldezettel: Home,
  'ecard-oegk': Stethoscope,
  'ams-briefe': Briefcase,
  aufenthaltstitel: BookUser,
  kindergarten: Blocks,
  arbeitnehmerveranlagung: PiggyBank,
};
