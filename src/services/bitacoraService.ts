import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
    updateDoc,
    limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { SleepRecord, SleepRecordInput } from "../interface";

const COLLECTION_NAME = "Bitacora";

export const bitacoraService = {
    async fetchRecords(userId: string, limitCount: number = 3): Promise<SleepRecord[]> {
        try {
            console.log(`Fetching last ${limitCount} records for user:`, userId);

            // Con índice compuesto: ordena y limita directamente en Firestore
            const q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId),
                orderBy("date", "desc"),
                limit(limitCount)
            );

            const snapshot = await getDocs(q);
            console.log("Records found:", snapshot.size);

            const records = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as SleepRecord[];

            return records;
        } catch (error) {
            console.error("Error fetching records:", error);
            throw error;
        }
    },

    async addRecord(userId: string, record: SleepRecordInput): Promise<SleepRecord> {
        try {
            const newRecord = {
                ...record,
                userId,
                createdAt: new Date().toISOString(),
            };

            console.log("Adding record:", newRecord);

            const docRef = await addDoc(collection(db, COLLECTION_NAME), newRecord);

            return { id: docRef.id, ...newRecord };
        } catch (error) {
            console.error("Error adding record:", error);
            throw error;
        }
    },

    async updateRecord(id: string, updates: Partial<SleepRecordInput>) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, updates);
        } catch (error) {
            console.error("Error updating record:", error);
            throw error;
        }
    },

    async deleteRecord(id: string) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting record:", error);
            throw error;
        }
    },
};