// services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export const authService = {
  async register(userData) {
    try {
      const { email, password, firstName, lastName, phone, address, city, postalCode } = userData;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await firebaseUpdateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address || '',
        city: city || '',
        postalCode: postalCode || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;
      
      return { success: true, user: { ...user, ...userData } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateProfile(uid, userData) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...userData,
        updatedAt: new Date().toISOString()
      });
      
      if (userData.firstName || userData.lastName) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await firebaseUpdateProfile(currentUser, {
            displayName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          });
        }
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCurrentUser() {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return { uid: user.uid, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }
};