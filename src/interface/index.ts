export interface User {
    uid: string;
    email: string;
    displayName?: string;
}

export interface SleepRecord {
    id: string;
    userId: string;
    date: string;
    bedTime: string;
    wakeTime: string;
    hoursSlept: number;
    quality: 1 | 2 | 3 | 4 | 5;
    notes: string;
    createdAt: string;
}

export type SleepRecordInput = Omit<SleepRecord, 'id' | 'userId' | 'createdAt'>;

export interface RitualSession {
    id: string;
    userId: string;
    duration: number;
    type: 'breathing' | 'meditation';
    completedAt: string;
}

export interface Tip {
    id: string;
    title: string;
    description: string;
    category: 'sleep' | 'routine' | 'environment';
}

export type Theme = 'light' | 'dark';
