import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas
import HomeAdminScreen from '../screens/Admin/HomeAdminScreen';
import HomeTecnicoScreen from '../screens/Tecnico/HomeTecnicoScreen';
import HomeUsuarioScreen from '../screens/Usuario/HomeUsuarioScreen';
import CadastroUsuarioScreen from '../screens/Admin/CadastroUsuarioScreen';

const Stack = createNativeStackNavigator();

export const AdminRoutes = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdmin" component={HomeAdminScreen} />
      <Stack.Screen name="CadastroUsuario" component={CadastroUsuarioScreen} />
      {/* Outras telas do admin */}
    </Stack.Navigator>
  );

export const TecnicoRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTecnico" component={HomeTecnicoScreen} />
    {/* Outras telas do técnico */}
  </Stack.Navigator>
);

export const UsuarioRoutes = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeUsuario" component={HomeUsuarioScreen} />
    {/* Outras telas do usuário */}
  </Stack.Navigator>
);
