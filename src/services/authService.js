import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  
  import {
    doc,
    setDoc,
    getDoc,
  } from "firebase/firestore";
  
  import { auth, db } from "../firebase";
  
  export const authService = {
    async cadastrar(nome, email, senha) {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
  
      const usuario = {
        nome,
        email,
        admin: email === "admin@admin.com", // 🔥 garante admin automático
        pontos: 0,
        boloes: [], // 🔥 importante pro seu sistema de bolão
        criadoEm: new Date().toISOString(),
      };
  
      await setDoc(
        doc(db, "usuarios", credencial.user.uid),
        usuario
      );
  
      return {
        id: credencial.user.uid,
        ...usuario,
      };
    },
  
    async login(email, senha) {
      const credencial = await signInWithEmailAndPassword(
        auth,
        email,
        senha
      );
  
      const userRef = doc(db, "usuarios", credencial.user.uid);
      const docRef = await getDoc(userRef);
  
      if (!docRef.exists()) {
        throw new Error("Usuário não encontrado no Firestore.");
      }
  
      const data = docRef.data();
  
      return {
        id: credencial.user.uid,
        ...data,
        admin: email === "admin@admin.com" || data.admin === true,
      };
    },
  
    async logout() {
      await signOut(auth);
    },
  };