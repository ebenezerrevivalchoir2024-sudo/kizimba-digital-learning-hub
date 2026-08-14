import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { KDLHResource, ResourceCategory } from '../types';
import { KdlhStorageService } from './storage';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export class FirestoreResourceService {
  private static COLLECTION_NAME = 'resources';

  /**
   * Save a resource to Firestore and sync with local storage
   */
  static async uploadResource(resource: KDLHResource): Promise<void> {
    const docId = resource.id || `res-${Date.now()}`;
    const path = `${this.COLLECTION_NAME}/${docId}`;

    try {
      const docRef = doc(db, this.COLLECTION_NAME, docId);
      
      // Clean undefined values for Firestore compatibility
      const firestorePayload: Record<string, any> = {
        ...resource,
        id: docId,
        uploaderId: auth.currentUser?.uid || resource.uploaderId || 'anonymous-educator',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      };

      // Remove undefined keys
      Object.keys(firestorePayload).forEach(key => {
        if (firestorePayload[key] === undefined) {
          delete firestorePayload[key];
        }
      });

      await setDoc(docRef, firestorePayload, { merge: true });
      
      // Also cache in local storage / IndexedDB
      KdlhStorageService.saveResource(resource);
    } catch (error) {
      console.warn('Firestore upload fallback to local storage:', error);
      // Ensure local storage still receives the resource even if offline
      KdlhStorageService.saveResource(resource);
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  /**
   * Fetch all resources from Firestore
   */
  static async getAllResources(): Promise<KDLHResource[]> {
    const path = this.COLLECTION_NAME;
    try {
      const colRef = collection(db, this.COLLECTION_NAME);
      const q = query(colRef, orderBy('dateAdded', 'desc'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return KdlhStorageService.getAllResources();
      }

      const resources: KDLHResource[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data() as KDLHResource;
        resources.push({
          ...data,
          id: docSnap.id
        });
      });

      // Synchronize back to local storage
      KdlhStorageService.saveAllResources(resources);
      return resources;
    } catch (error) {
      console.warn('Firestore read failed, serving from local cache:', error);
      return KdlhStorageService.getAllResources();
    }
  }

  /**
   * Listen to real-time resource updates from Firestore
   */
  static subscribeToResources(onUpdate: (resources: KDLHResource[]) => void) {
    const path = this.COLLECTION_NAME;
    const colRef = collection(db, this.COLLECTION_NAME);
    
    return onSnapshot(
      colRef, 
      (snapshot) => {
        const resources: KDLHResource[] = [];
        snapshot.forEach(docSnap => {
          resources.push({
            ...(docSnap.data() as KDLHResource),
            id: docSnap.id
          });
        });
        if (resources.length > 0) {
          onUpdate(resources);
          KdlhStorageService.saveAllResources(resources);
        }
      },
      (error) => {
        console.warn('Resource real-time listener error:', error);
        handleFirestoreError(error, OperationType.GET, path);
      }
    );
  }

  /**
   * Delete resource from Firestore
   */
  static async deleteResource(id: string): Promise<void> {
    const path = `${this.COLLECTION_NAME}/${id}`;
    try {
      await deleteDoc(doc(db, this.COLLECTION_NAME, id));
      KdlhStorageService.deleteResource(id);
    } catch (error) {
      console.warn('Firestore delete error, removing locally:', error);
      KdlhStorageService.deleteResource(id);
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
}
