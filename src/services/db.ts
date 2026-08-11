import { KDLHResource, SavedNote, OfflineCachedResource, OfflineQueueAction } from '../types';

const DB_NAME = 'kdlh_offline_db_v1';
const DB_VERSION = 1;

export const STORE_RESOURCES = 'cached_resources';
export const STORE_NOTES = 'saved_notes';
export const STORE_QUEUE = 'offline_queue';
export const STORE_METADATA = 'app_metadata';

export class IndexedDbService {
  private static dbPromise: Promise<IDBDatabase> | null = null;

  public static getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB is not supported in this browser.'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORE_RESOURCES)) {
          db.createObjectStore(STORE_RESOURCES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORE_NOTES)) {
          const notesStore = db.createObjectStore(STORE_NOTES, { keyPath: 'id' });
          notesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          db.createObjectStore(STORE_QUEUE, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORE_METADATA)) {
          db.createObjectStore(STORE_METADATA, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.dbPromise;
  }

  // --- Cached Resources ---
  public static async cacheResource(resource: KDLHResource): Promise<void> {
    const db = await this.getDB();
    const sizeBytes = new Blob([JSON.stringify(resource)]).size;
    const item: OfflineCachedResource = {
      id: resource.id,
      resource,
      cachedAt: new Date().toISOString(),
      sizeBytes,
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readwrite');
      const store = tx.objectStore(STORE_RESOURCES);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async bulkCacheResources(resources: KDLHResource[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readwrite');
      const store = tx.objectStore(STORE_RESOURCES);
      const now = new Date().toISOString();

      resources.forEach((resource) => {
        const sizeBytes = new Blob([JSON.stringify(resource)]).size;
        store.put({
          id: resource.id,
          resource,
          cachedAt: now,
          sizeBytes,
        });
      });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public static async getAllCachedResources(): Promise<OfflineCachedResource[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readonly');
      const store = tx.objectStore(STORE_RESOURCES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public static async getCachedResourceById(id: string): Promise<KDLHResource | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readonly');
      const store = tx.objectStore(STORE_RESOURCES);
      const req = store.get(id);
      req.onsuccess = () => {
        resolve(req.result ? req.result.resource : null);
      };
      req.onerror = () => reject(req.error);
    });
  }

  public static async removeCachedResource(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readwrite');
      const store = tx.objectStore(STORE_RESOURCES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async clearAllCachedResources(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RESOURCES, 'readwrite');
      const store = tx.objectStore(STORE_RESOURCES);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Saved Student Notes ---
  public static async saveNote(note: SavedNote): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.put(note);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async getAllNotes(): Promise<SavedNote[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readonly');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public static async deleteNote(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NOTES, 'readwrite');
      const store = tx.objectStore(STORE_NOTES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Offline Actions Queue ---
  public static async enqueueOfflineAction(action: OfflineQueueAction): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.put(action);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public static async getOfflineQueue(): Promise<OfflineQueueAction[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, 'readonly');
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public static async clearOfflineQueue(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_QUEUE, 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Metadata & Storage Statistics ---
  public static async getStorageStats(): Promise<{
    resourceCount: number;
    notesCount: number;
    queuedActionsCount: number;
    totalSizeBytes: number;
  }> {
    try {
      const [resources, notes, queue] = await Promise.all([
        this.getAllCachedResources(),
        this.getAllNotes(),
        this.getOfflineQueue(),
      ]);

      const resourcesSize = resources.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
      const notesSize = new Blob([JSON.stringify(notes)]).size;
      const queueSize = new Blob([JSON.stringify(queue)]).size;

      return {
        resourceCount: resources.length,
        notesCount: notes.length,
        queuedActionsCount: queue.length,
        totalSizeBytes: resourcesSize + notesSize + queueSize,
      };
    } catch (e) {
      console.warn('Failed to calculate IDB storage stats:', e);
      return { resourceCount: 0, notesCount: 0, queuedActionsCount: 0, totalSizeBytes: 0 };
    }
  }
}
