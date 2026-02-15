
export enum RecordType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface EnvelopeRecord {
  id: string;
  type: RecordType;
  date: string;
  amount: number;
  name: string;
  contact: string;
  address?: string;
  event: string;
  category: string;
  reminder: boolean;
  reminderTime?: string;
  createdAt: number;
}

export interface AppState {
  records: EnvelopeRecord[];
  isFormOpen: boolean;
  editingRecord: EnvelopeRecord | null;
  activeType: RecordType;
}
