// services/seedDatabase.ts
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export const seedDatabase = async () => {
  try {
    // 1. Criar usuários
    const users = [
      { nome: 'Admin Teste', email: 'admin@teste.com', senha: '123456', tipo: 'admin' },
      { nome: 'Tecnico João', email: 'tecnico@teste.com', senha: '123456', tipo: 'tecnico' },
      { nome: 'Usuário Maria', email: 'usuario@teste.com', senha: '123456', tipo: 'usuario' },
    ];

    for (const u of users) {
      const cred = await createUserWithEmailAndPassword(auth, u.email, u.senha);
      await setDoc(doc(db, 'users', cred.user.uid), {
        nome: u.nome,
        email: u.email,
        tipo: u.tipo,
      });
    }

    // 2. Criar unidades
    const unidades = ['ESF Central', 'UBS Norte', 'Posto Sul'];
    for (const nome of unidades) {
      await addDoc(collection(db, 'unidades'), { nome });
    }

    // 3. Criar demanda de exemplo (ligada ao UID do usuário criado acima)
    // Pega o usuário "usuario@teste.com"
    const usuarioCred = await signInWithEmailAndPassword(auth, 'usuario@teste.com', '123456');
    const usuarioId = usuarioCred.user.uid;

    await addDoc(collection(db, 'demandas'), {
      usuarioId,
      descricaoProblema: 'Impressora sem papel.',
      status: 'aberta',
      unidade: 'ESF Central',
      dataCriacao: serverTimestamp(),
    });

    alert('Base de dados populada com sucesso!');
  } catch (error: any) {
    console.error('Erro ao popular Firestore:', error);
    alert('Erro ao popular Firestore: ' + error.message);
  }
};
