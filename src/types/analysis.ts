export interface LetterDeadline {
  date: string;
  what: string;
}

export interface LetterPayment {
  amount: number;
  currency: string;
  reason: string;
  due_date: string;
}

export interface LetterAnalysis {
  summary: string;
  /** Who the letter came from, as printed on it — the school's name, the
   * clinic, the office. Null when the model can't tell, and absent entirely
   * on letters scanned before this field existed, so every reader must cope
   * with both. Used to pre-fill the recipient when replying. */
  sender?: string | null;
  action_required: boolean;
  actions: string[];
  deadlines: LetterDeadline[];
  needs_reply: boolean;
  urgency: 'high' | 'medium' | 'low';
  detected_child_name: string | null;
  detected_child_class: string | null;
  payments: LetterPayment[];
}
