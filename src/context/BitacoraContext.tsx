import { createContext } from "react";
import type { SleepRecord, SleepRecordInput } from "../interface";

export interface BitacoraContextType {
  sleepRecords: SleepRecord[];
  loading: boolean;
  error: string | null;
  addSleepRecord: (record: SleepRecordInput) => Promise<void>;
  updateSleepRecord: (
    id: string,
    record: Partial<SleepRecordInput>
  ) => Promise<void>;
  deleteSleepRecord: (id: string) => Promise<void>;
  refreshRecords: () => Promise<void>;
}

export const BitacoraContext = createContext<BitacoraContextType | undefined>(
  undefined
);
