// services/dossierService.js
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export const dossierService = {
  async createDossier(userId, dossierData) {
    try {
      const dossierId = `DOS-${Date.now()}`;
      const dossierRef = doc(collection(db, 'users', userId, 'dossiers'), dossierId);
      
      const dossier = {
        id: dossierId,
        ...dossierData,
        userId: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: 'En cours',
        documentsCount: 0
      };
      
      await setDoc(dossierRef, dossier);
      return { success: true, dossier };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getUserDossiers(userId) {
    try {
      const dossiersRef = collection(db, 'users', userId, 'dossiers');
      const q = query(dossiersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const dossiers = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        dossiers.push({ 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });
      
      return { success: true, dossiers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getDossier(userId, dossierId) {
    try {
      const dossierRef = doc(db, 'users', userId, 'dossiers', dossierId);
      const dossierSnap = await getDoc(dossierRef);
      
      if (dossierSnap.exists()) {
        const data = dossierSnap.data();
        return { 
          success: true, 
          dossier: { 
            id: dossierSnap.id, 
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } 
        };
      } else {
        return { success: false, error: 'Dossier not found' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateDossier(userId, dossierId, updates) {
    try {
      const dossierRef = doc(db, 'users', userId, 'dossiers', dossierId);
      await updateDoc(dossierRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteDossier(userId, dossierId) {
    try {
      const dossierRef = doc(db, 'users', userId, 'dossiers', dossierId);
      await deleteDoc(dossierRef);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};