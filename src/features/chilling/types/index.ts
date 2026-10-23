export type NudgeCategory = 'pesado' | 'frango' | 'brother';

export interface ChillingNudgeItem {
  id: string;
  category: NudgeCategory;
  text: string;
  intensity: 'heavy' | 'medium' | 'hyped';
}

export interface ChillingNudgeLog {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_initials: string;
  receiver_id: string;
  nudge_text: string;
  category: NudgeCategory;
  audio_url?: string | null;
  exhibited?: boolean;
  read_at?: string | null;
  created_at: string;
}
