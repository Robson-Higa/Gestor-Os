import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import firestore from 'firebase/firestore';
import { Text } from 'react-native-paper'; // ou qualquer outro componente de texto que você prefira
import { useAuth } from '../contexts/AuthContext';

// Import das telas
import HomeAdminScreen from '../screens/Admin/HomeAdminScreen';
import HomeTecnicoScreen from '../screens/Tecnico/HomeTecnicoScreen';
import HomeUsuarioScreen from '../screens/Usuario/HomeUsuárioScreen';
import LoginScreen from '../screens/Auth/LoginScreens'; // se tiver login

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserType(null);
      setLoading(false);
      return;
    }

    // Supondo que o tipo do usuário está salvo no documento firestore: users/{user.uid}
    const fetchUserType = async () => {
      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUserType(data?.tipo || null); // ex: 'admin', 'tecnico', 'usuario'
        } else {
          setUserType(null);
        }
      } catch (error) {
        console.error('Erro ao buscar tipo do usuário:', error);
        setUserType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // Usuário não está logado, mostrar tela de login
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* outras telas públicas */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userType === 'admin' && (
          <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
        )}
        {userType === 'tecnico' && (
          <Stack.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
        )}
        {userType === 'usuario' && (
          <Stack.Screen name="HomeUsuario" component={HomeUsuarioScreen} />
        )}
        {!userType && (
          <Stack.Screen
            name="SemPermissao"
            component={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}
              >
                <Text>Tipo de usuário não definido.</Text>
              </View>
            )}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
