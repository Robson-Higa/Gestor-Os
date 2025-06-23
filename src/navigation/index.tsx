import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
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
  const [userRole, setUserRole] = useState<
    'admin' | 'tecnico' | 'usuario' | null
  >(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'usuarios', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserRole(data.tipo);
          }
        } catch (error) {
          console.error('Erro ao buscar tipo de usuário:', error);
        }
      }
      setRoleLoading(false);
    };

    if (user) {
      fetchUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  if (loading || roleLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : userRole === 'admin' ? (
        <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
      ) : userRole === 'tecnico' ? (
        <Stack.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
      ) : userRole === 'usuario' ? (
        <Stack.Screen name="HomeUsuario" component={HomeUsuarioScreen} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default Routes;
