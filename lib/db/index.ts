import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { ScoreResult, ErrorAnalysis } from '@/types';

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    ttsRate: number;
    voiceURI?: string;
    keyboardGuide: boolean;
}

export interface Session {
    id?: number;
    mode: 'dictation' | 'speed' | 'drill';
    textId?: string;
    sentences: string[]; // The sentences practiced
    results: ScoreResult;
    errors: ErrorAnalysis;
    createdAt: Date;
}

export interface ContentPack {
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    topic: string;
    sentences: string[];
    tags: string[];
}

interface KTypeDB extends DBSchema {
    users: {
        key: string;
        value: {
            id: string;
            settings: UserSettings;
        };
    };
    sessions: {
        key: number;
        value: Session;
        indexes: { 'by-date': Date };
    };
    content_packs: {
        key: string;
        value: ContentPack;
    };
}

const DB_NAME = 'k-type-coach-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<KTypeDB>>;

export function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<KTypeDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
                    sessionStore.createIndex('by-date', 'createdAt');
                }
                if (!db.objectStoreNames.contains('content_packs')) {
                    db.createObjectStore('content_packs', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

export const db = {
    async getUserSettings(): Promise<UserSettings | null> {
        const db = await getDB();
        const user = await db.get('users', 'default');
        return user ? user.settings : null;
    },

    async saveUserSettings(settings: UserSettings) {
        const db = await getDB();
        await db.put('users', { id: 'default', settings });
    },

    async saveSession(session: Omit<Session, 'id'>) {
        const db = await getDB();
        return await db.add('sessions', session as Session);
    },

    async getSessions(limit = 10): Promise<Session[]> {
        const db = await getDB();
        const sessions = await db.getAllFromIndex('sessions', 'by-date');
        return sessions.reverse().slice(0, limit);
    },

    async saveContentPack(pack: ContentPack) {
        const db = await getDB();
        await db.put('content_packs', pack);
    },

    async getAllContentPacks(): Promise<ContentPack[]> {
        const db = await getDB();
        return await db.getAll('content_packs');
    }
};
