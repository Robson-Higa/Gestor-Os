import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

import LoginScreen from '../screens/Auth/LoginScreen';
import HomeAdminScreen from '../screens/Admin/HomeAdminScreen';
import HomeTecnicoScreen from '../screens/Tecnico/HomeTecnicoScreen';
import HomeUsuarioScreen from '../screens/Usuario/HomeUsuarioScreen';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const { user, loading } = useAuth();
  const [userType, setUserType] = useState<string | null>(null);
  const [loadingUserType, setLoadingUserType] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserType(null);
      setLoadingUserType(false);
      return;
    }

    const fetchUserType = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserType(data?.tipo || null);
        } else {
          setUserType(null);
        }
      } catch (error) {
        console.error('Erro ao buscar tipo do usuário:', error);
        setUserType(null);
      } finally {
        setLoadingUserType(false);
      }
    };

    fetchUserType();
  }, [user]);

  if (loading || loadingUserType) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : userType === 'admin' ? (
        <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
      ) : userType === 'tecnico' ? (
        <Stack.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
      ) : userType === 'usuario' ? (
        <Stack.Screen name="HomeUsuario" component={HomeUsuarioScreen} />
      ) : (
        <Stack.Screen
          name="SemPermissao"
          key="no-role"
          component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text>Tipo de usuário não definido.</Text>
            </View>
          )}
        />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
