import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { seedDatabase } from '../../services/seedDatabase';

interface Unidade {
  id: string;
  nome: string;
}

const HomeAdminScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [unidades, setUnidades] = useState<Unidade[]>([]);

  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'unidades'));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Unidade[];

        setUnidades(lista);
      } catch (error) {
        console.error('Erro ao carregar unidades:', error);
      }
    };

    fetchUnidades();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const irParaCadastro = () => {
    navigation.navigate('CadastroUsuario');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Administrador</Text>
      <Text style={styles.subtitle}>Usuário: {user?.email}</Text>

      <TouchableOpacity style={styles.cadastrarButton} onPress={irParaCadastro}>
        <Text style={styles.cadastrarText}>+ Cadastrar Novo Usuário</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Unidades Cadastradas:</Text>
      <FlatList
        data={unidades}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.unidadeItem}>
            <Text style={styles.unidadeText}>{item.nome}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma unidade cadastrada.</Text>
        }
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={seedDatabase}>
  <Text style={styles.logoutText}>Popular Base de Dados</Text>
</TouchableOpacity>
    </View>
  );
};

export default HomeAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  cadastrarButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  cadastrarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: '600',
  },
  unidadeItem: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
  },
  unidadeText: {
    fontSize: 16,
  },
  empty: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
