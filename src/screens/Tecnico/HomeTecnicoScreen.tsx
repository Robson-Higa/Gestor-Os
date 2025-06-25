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
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

interface Demanda {
  id: string;
  descricaoProblema: string;
  status: string;
  unidade: string;
  descricaoServico?: string;
}

const HomeTecnicoScreen = () => {
  const { user } = useAuth();
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState<Demanda | null>(
    null,
  );
  const [descricaoServico, setDescricaoServico] = useState('');

  const carregarDemandas = async () => {
    try {
      const q = query(
        collection(db, 'demandas'),
        where('tecnicoId', '==', user?.uid),
        where('status', 'in', ['aberta', 'em_atendimento']),
      );
      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Demanda[];
      setDemandas(lista);
    } catch (error) {
      console.error('Erro ao buscar demandas do técnico:', error);
      Alert.alert('Erro', 'Falha ao carregar demandas.');
    }
  };

  useEffect(() => {
    carregarDemandas();
  }, []);

  const abrirModal = (demanda: Demanda) => {
    setDemandaSelecionada(demanda);
    setDescricaoServico(demanda.descricaoServico || '');
    setModalVisivel(true);
  };

  const salvarServico = async () => {
    if (!demandaSelecionada) return;
    try {
      const ref = doc(db, 'demandas', demandaSelecionada.id);
      await updateDoc(ref, {
        descricaoServico,
        status: 'em_atendimento',
      });
      setModalVisivel(false);
      setDemandaSelecionada(null);
      setDescricaoServico('');
      carregarDemandas();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      Alert.alert('Erro', 'Falha ao salvar o serviço.');
    }
  };

  const fecharDemanda = async () => {
    if (!demandaSelecionada) return;
    try {
      const ref = doc(db, 'demandas', demandaSelecionada.id);
      await updateDoc(ref, {
        status: 'concluida',
      });
      setModalVisivel(false);
      setDemandaSelecionada(null);
      setDescricaoServico('');
      carregarDemandas();
    } catch (error) {
      console.error('Erro ao fechar demanda:', error);
      Alert.alert('Erro', 'Falha ao fechar demanda.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao sair:', error);
      Alert.alert('Erro', 'Falha ao sair da conta.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com título e logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Demandas Atribuídas</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={demandas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma demanda atribuída.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.unidade}>{item.unidade}</Text>
            <Text style={styles.problema}>{item.descricaoProblema}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => abrirModal(item)}
            >
              <Text style={styles.buttonText}>Registrar Serviço</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal para descrição do serviço */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Descrever Serviço</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              placeholder="Descreva o serviço prestado"
              value={descricaoServico}
              onChangeText={setDescricaoServico}
            />

            <TouchableOpacity style={styles.modalButton} onPress={salvarServico}>
              <Text style={styles.modalButtonText}>Salvar Serviço</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#dc3545', marginTop: 10 }]}
              onPress={fecharDemanda}
            >
              <Text style={styles.modalButtonText}>Fechar Demanda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#6c757d', marginTop: 10 }]}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeTecnicoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
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
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
  },
  buttonText: { color: '#fff', textAlign: 'center' },
  empty: { marginTop: 30, fontSize: 14, color: '#777', textAlign: 'center' },
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
    textAlignVertical: 'top',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: { color: '#fff', textAlign: 'center' },
});
