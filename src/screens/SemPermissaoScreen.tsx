import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SemPermissaoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tipo de usuário não definido.</Text>
    </View>
  );
};

export default SemPermissaoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
