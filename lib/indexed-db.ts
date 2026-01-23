"use client";

const DB_NAME = "OrcaFlowDB";
const STORE_NAME = "AgentContracts";

export async function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveContract(agentId: string, contractAddress: string) {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: agentId, contractAddress, updatedAt: new Date().toISOString() });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getContract(agentId: string) {
    const db = await openDB();
    return new Promise<string | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(agentId);
        request.onsuccess = () => resolve(request.result?.contractAddress || null);
        request.onerror = () => reject(request.error);
    });
}
