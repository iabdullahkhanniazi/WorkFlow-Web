import { auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '../firebase';

export const authService = {
  onAuthChange: (callback) => onAuthStateChanged(auth, callback),
  login: (email, password) => signInWithEmailAndPassword(auth, email, password),
  register: (email, password) => createUserWithEmailAndPassword(auth, email, password),
  logout: () => signOut(auth),
};