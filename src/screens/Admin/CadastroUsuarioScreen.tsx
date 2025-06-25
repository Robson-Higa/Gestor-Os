import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { cadastrarNovoUsuario } from '../../services/userService';
import { TipoUsuario } from '../../types/UserTypes';

const CadastroUsuarioScreen = () => {
  const { user } = useAuth(); // Admin logado
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState<TipoUsuario>('usuario');
  const [loading, setLoading] = useState(false);

  const cadastrarUsuario = async () => {
    if (!nome || !email || !senha || !tipo) {
      Alert.alert('Preencha todos os campos');
      return;
    }

    const senhaAdmin = senha; // Senha do novo usuário
    const adminEmail = user?.email; // E-mail do admin logado

    setLoading(true);

    try {
      await cadastrarNovoUsuario(nome, email, senhaAdmin, tipo);

      Alert.alert('Sucesso', `Usuário ${nome} cadastrado com sucesso.`);

      if (adminEmail) {
        await signInWithEmailAndPassword(auth, adminEmail, '123456'); // <- lembre de tratar isso corretamente depois!
      }

      setNome('');
      setEmail('');
      setSenha('');
      setTipo('usuario');
    } catch (error: any) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', error.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Usuário</Text>

      <TextInput
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de usuário:</Text>
      <View style={styles.buttonGroup}>
        {(['admin', 'tecnico', 'usuario'] as TipoUsuario[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.tipoButton,
              tipo === t && styles.tipoButtonSelected,
            ]}
            onPress={() => setTipo(t)}
          >
            <Text style={styles.tipoButtonText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={cadastrarUsuario}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CadastroUsuarioScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tipoButton: {
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  tipoButtonSelected: {
    backgroundColor: '#007bff',
  },
  tipoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});
