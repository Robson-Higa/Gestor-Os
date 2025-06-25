import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

/**
 * Cadastra um novo usuário no Firebase Auth e salva dados no Firestore.
 * @param nome - Nome completo do usuário
 * @param email - E-mail do novo usuário
 * @param senha - Senha do novo usuário
 * @param tipo - Tipo do usuário: 'admin', 'tecnico' ou 'usuario'
 */
export const cadastrarNovoUsuario = async (
  nome: string,
  email: string,
  senha: string,
  tipo: 'admin' | 'tecnico' | 'usuario'
) => {
  // Cria o usuário no Firebase Auth
  const credenciais = await createUserWithEmailAndPassword(auth, email, senha);
  const uid = credenciais.user.uid;

  // Salva dados no Firestore na coleção "usuarios"
  await setDoc(doc(db, 'usuarios', uid), {
    nome,
    email,
    tipo,
  });

  return uid;
};
