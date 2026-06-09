import {
    doc,
    setDoc,
    getDoc,
    getDocs,
    collection,
  } from "firebase/firestore";
  
  import { db } from "../firebase";
  
  export async function salvarResultado(jogoId, golsMandante, golsVisitante) {
    await setDoc(doc(db, "resultados", String(jogoId)), {
      golsMandante,
      golsVisitante,
      finalizado: true,
    });
  }
  
  export async function buscarResultado(jogoId) {
    const snap = await getDoc(doc(db, "resultados", String(jogoId)));
  
    if (!snap.exists()) return null;
  
    return snap.data();
  }
  
  // 🔥 SEMPRE retorna ARRAY
  export async function buscarResultados() {
    const snap = await getDocs(collection(db, "resultados"));
  
    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }