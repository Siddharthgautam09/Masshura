import { auth, db } from '../components/firebase';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// This utility helps clean up test accounts that conflict with legitimate suppliers
export const cleanupTestAccount = async (email: string, testPassword: string = 'test123') => {
  try {
    console.log(`Attempting to clean up test account for: ${email}`);
    
    // First, try to sign in with the test account
    const userCredential = await signInWithEmailAndPassword(auth, email, testPassword);
    const user = userCredential.user;
    
    console.log(`Successfully signed in to test account: ${user.uid}`);
    
    // Delete any test supplier documents
    const suppliersQuery = query(collection(db, 'suppliers'), where('email', '==', email));
    const supplierDocs = await getDocs(suppliersQuery);
    
    for (const supplierDoc of supplierDocs.docs) {
      console.log(`Deleting test supplier document: ${supplierDoc.id}`);
      await deleteDoc(doc(db, 'suppliers', supplierDoc.id));
    }
    
    // Delete any test user documents
    const usersQuery = query(collection(db, 'users'), where('email', '==', email));
    const userDocs = await getDocs(usersQuery);
    
    for (const userDoc of userDocs.docs) {
      console.log(`Deleting test user document: ${userDoc.id}`);
      await deleteDoc(doc(db, 'users', userDoc.id));
    }
    
    // Finally, delete the Firebase Auth account
    await deleteUser(user);
    console.log(`Successfully deleted Firebase Auth account for: ${email}`);
    
    return { success: true, message: `Successfully cleaned up test account for ${email}` };
    
  } catch (error: any) {
    console.error('Error cleaning up test account:', error);
    
    if (error.code === 'auth/user-not-found') {
      return { success: false, message: 'No Firebase Auth account found for this email' };
    } else if (error.code === 'auth/wrong-password') {
      return { success: false, message: 'Wrong password for test account cleanup' };
    } else {
      return { success: false, message: `Cleanup failed: ${error.message}` };
    }
  }
};

// Quick function to check if an email has conflicting accounts
export const checkAccountConflicts = async (email: string) => {
  try {
    // Check if supplier exists in Firestore
    const suppliersQuery = query(collection(db, 'suppliers'), where('email', '==', email));
    const supplierDocs = await getDocs(suppliersQuery);
    const hasSupplierData = !supplierDocs.empty;
    
    // We can't directly check Firebase Auth without signing in,
    // but we can check if there are any user documents
    const usersQuery = query(collection(db, 'users'), where('email', '==', email));
    const userDocs = await getDocs(usersQuery);
    const hasUserData = !userDocs.empty;
    
    return {
      email,
      hasSupplierData,
      hasUserData,
      supplierDocs: supplierDocs.docs.map(doc => ({ id: doc.id, data: doc.data() })),
      userDocs: userDocs.docs.map(doc => ({ id: doc.id, data: doc.data() }))
    };
    
  } catch (error: any) {
    console.error('Error checking account conflicts:', error);
    return { email, error: error.message };
  }
};
