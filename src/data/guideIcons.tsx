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
  type LucideIcon,
} from 'lucide-react';

/** Guide article ids are the same across languages, so one icon map covers
 * both — see guideArticles.ts. */
export const GUIDE_ARTICLE_ICONS: Record<string, LucideIcon> = {
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
};
