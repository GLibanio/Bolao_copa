import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

function gerarCodigo() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    letras[Math.floor(Math.random() * letras.length)] +
    letras[Math.floor(Math.random() * letras.length)] +
    Math.floor(100 + Math.random() * 900)
  );
}

export async function criarBolao(
  dados,
  usuario
) {
  const codigo = gerarCodigo();

  await setDoc(doc(db, "boloes", codigo), {
    nome: dados.nome,
    descricao: dados.descricao,
    valorAposta: dados.valorAposta,
    codigo,
    criadoPor: usuario.id,
    criadoEm: new Date(),

    participantes: [
      {
        id: usuario.id,
        nome: usuario.nome,
      },
    ],
  });

  await updateDoc(doc(db, "usuarios", usuario.id), {
    boloes: arrayUnion(codigo),
  });

  return codigo;
}

export async function entrarBolao(
  codigo,
  usuario
) {

  const userRef = doc(
    db,
    "usuarios",
    usuario.id
  );

  const userSnap = await getDoc(userRef);

  const userData = userSnap.data();

  if (
    (userData?.boloes?.length || 0) >= 3
  ) {
    throw new Error(
      "Você já participa de 3 bolões."
    );
  }

  const ref = doc(db, "boloes", codigo);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error(
      "Bolão não encontrado"
    );
  }

  const data = snap.data();

  const existe =
    data.participantes?.some(
      (p) => p.id === usuario.id
    );

  if (!existe) {
    await updateDoc(ref, {
      participantes: arrayUnion({
        id: usuario.id,
        nome: usuario.nome,
      }),
    });
  }

  await updateDoc(userRef, {
    boloes: arrayUnion(codigo),
  });
}

export async function sairBolao(codigo, usuarioId) {
  const ref = doc(db, "boloes", codigo);

  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const bolao = snap.data();

  const participante = bolao.participantes.find(
    (p) => p.id === usuarioId
  );

  if (!participante) return;

  await updateDoc(ref, {
    participantes: arrayRemove(participante),
  });

  await updateDoc(doc(db, "usuarios", usuarioId), {
    boloes: arrayRemove(codigo),
  });
}

export async function buscarBolaoUsuario(usuarioId) {
  const snap = await getDocs(collection(db, "boloes"));

  const encontrados = [];

  snap.forEach((d) => {
    const data = d.data();

    const existe = data.participantes?.some(
      (p) => p.id === usuarioId
    );

    if (existe) {
      encontrados.push(data);
    }
  });

  return encontrados;
}