import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    onSnapshot,
  } from "firebase/firestore";
  
  import { db } from "../firebase";
  
  /**
   * SALVAR / EDITAR APOSTA
   */
  export async function salvarAposta(usuarioId, jogoId, golsMandante, golsVisitante) {
    const ref = collection(db, "apostas");
  
    const q = query(
      ref,
      where("usuarioId", "==", usuarioId),
      where("jogoId", "==", jogoId)
    );
  
    const snap = await getDocs(q);
  
    if (!snap.empty) {
      const id = snap.docs[0].id;
  
      await updateDoc(doc(db, "apostas", id), {
        golsMandante,
        golsVisitante,
      });
  
      return;
    }
  
    await addDoc(ref, {
      usuarioId,
      jogoId,
      golsMandante,
      golsVisitante,
    });
  }
  
  /**
   * 🔥 BUSCAR APOSTAS DO USUÁRIO (HOME DEPENDE DISSO)
   */
  export async function buscarApostasUsuario(usuarioId) {
    const snap = await getDocs(collection(db, "apostas"));
  
    const apostas = {};
  
    snap.forEach((d) => {
      const data = d.data();
  
      if (data.usuarioId === usuarioId) {
        apostas[data.jogoId] = data;
      }
    });
  
    return apostas;
  }
  
  /**
   * 🔥 CALCULAR PONTOS (ADMIN USA ISSO)
   */
  export async function calcularPontosUsuarios() {
    const apostasSnap = await getDocs(collection(db, "apostas"));
    const resultadosSnap = await getDocs(collection(db, "resultados"));
  
    const resultados = {};
  
    resultadosSnap.forEach((d) => {
      resultados[d.id] = d.data();
    });
  
    const pontos = {};
  
    apostasSnap.forEach((d) => {
      const a = d.data();
      const res = resultados[a.jogoId];
  
      if (!res?.finalizado) return;
  
      const apM = Number(a.golsMandante);
      const apV = Number(a.golsVisitante);
      const reM = Number(res.golsMandante);
      const reV = Number(res.golsVisitante);
  
      let p = 0;
  
      if (apM === reM && apV === reV) {
        p = 3;
      } else if (
        (apM > apV && reM > reV) ||
        (apM < apV && reM < reV) ||
        (apM === apV && reM === reV)
      ) {
        p = 1;
      }
  
      if (!pontos[a.usuarioId]) pontos[a.usuarioId] = 0;
  
      pontos[a.usuarioId] += p;
    });
  
    return pontos;
  }