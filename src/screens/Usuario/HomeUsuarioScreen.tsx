import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

interface Demanda {
  id: string;
  descricaoProblema: string;
  status: string;
  unidade: string;
  feedback?: string;
}

const HomeUsuarioScreen = () => {
  const { user } = useAuth();

  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [modalNovaDemandaVisivel, setModalNovaDemandaVisivel] = useState(false);

  const [modalFeedbackVisivel, setModalFeedbackVisivel] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [demandaSelecionadaId, setDemandaSelecionadaId] = useState<string | null>(null);

  const [descricao, setDescricao] = useState('');
  const [unidade, setUnidade] = useState('');

  const carregarDemandas = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'demandas'), where('usuarioId', '==', user.uid));
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Demanda[];
      setDemandas(lista);
    } catch (error) {
      console.error('Erro ao buscar demandas do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas demandas.');
    }
  };

  useEffect(() => {
    carregarDemandas();
  }, [user]);

  const confirmarConclusao = (id: string) => {
    setDemandaSelecionadaId(id);
    setFeedback('');
    setModalFeedbackVisivel(true);
  };

  const enviarFeedback = async () => {
    if (!demandaSelecionadaId) return;
    try {
      const ref = doc(db, 'demandas', demandaSelecionadaId);
      await updateDoc(ref, {
        status: 'concluida',
        feedback: feedback.trim(),
      });
      setModalFeedbackVisivel(false);
      setDemandaSelecionadaId(null);
      carregarDemandas();
    } catch (error) {
      console.error('Erro ao enviar feedback:', error);
      Alert.alert('Erro', 'Não foi possível enviar o feedback.');
    }
  };

  const abrirModalNovaDemanda = () => {
    setDescricao('');
    setUnidade('');
    setModalNovaDemandaVisivel(true);
  };

  const criarNovaDemanda = async () => {
    if (!descricao.trim() || !unidade.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos para criar uma nova demanda.');
      return;
    }

    try {
      await addDoc(collection(db, 'demandas'), {
        usuarioId: user?.uid,
        descricaoProblema: descricao.trim(),
        unidade: unidade.trim(),
        status: 'aberta',
        dataCriacao: serverTimestamp(),
      });
      setModalNovaDemandaVisivel(false);
      carregarDemandas();
      Alert.alert('Sucesso', 'Demanda criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar nova demanda:', error);
      Alert.alert('Erro', 'Não foi possível criar a demanda.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Demandas</Text>

      <FlatList
        data={demandas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Você ainda não criou nenhuma demanda.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.unidade}>{item.unidade}</Text>
            <Text style={styles.problema}>{item.descricaoProblema}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            {item.status === 'em_atendimento' && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => confirmarConclusao(item.id)}
              >
                <Text style={styles.buttonText}>Confirmar Serviço</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={abrirModalNovaDemanda}>
        <Text style={styles.addButtonText}>+ Nova Demanda</Text>
      </TouchableOpacity>

      {/* Modal para criação de nova demanda */}
      <Modal visible={modalNovaDemandaVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nova Demanda</Text>
            <TextInput
              placeholder="Unidade (ESF)"
              style={styles.input}
              value={unidade}
              onChangeText={setUnidade}
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Descreva o problema"
              style={[styles.input, { height: 80 }]}
              multiline
              value={descricao}
              onChangeText={setDescricao}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.modalButton} onPress={criarNovaDemanda}>
              <Text style={styles.modalButtonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para feedback de conclusão */}
      <Modal visible={modalFeedbackVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Feedback do Serviço</Text>
            <TextInput
              placeholder="Deixe seu feedback"
              style={[styles.input, { height: 80 }]}
              multiline
              value={feedback}
              onChangeText={setFeedback}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.modalButton} onPress={enviarFeedback}>
              <Text style={styles.modalButtonText}>Enviar Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeUsuarioScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: {
    padding: 14,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  unidade: { fontWeight: 'bold', fontSize: 16 },
  problema: { marginTop: 5, fontSize: 15 },
  status: { marginTop: 8, fontSize: 14, color: '#555' },
  button: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  empty: { marginTop: 30, fontSize: 14, color: '#777', textAlign: 'center' },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontSize: 16 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: { color: '#fff', textAlign: 'center' },
});
