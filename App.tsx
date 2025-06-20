import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import Routes from './src/navigation'; // ← Aqui você define qual rota exibir

export default function App() {
  return (
    <AuthProvider>
      {' '}
      {/* 1️⃣ Fornece contexto global do usuário */}
      <NavigationContainer>
        {' '}
        {/* 2️⃣ Gerencia as telas e a navegação */}
        <Routes /> {/* 3️⃣ Exibe telas com base no tipo de usuário */}
      </NavigationContainer>
    </AuthProvider>
  );
}
