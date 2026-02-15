
import { EnvelopeRecord } from '../types';

const STORAGE_KEY = 'amplopku_records';

export const saveRecords = (records: EnvelopeRecord[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecords = (): EnvelopeRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse records", e);
    return [];
  }
};
