import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { user } from '../data/user.js'

const IP = process.env.EXPO_PUBLIC_API_IP;

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [nombre, setNombre] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !nombre)) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    try {
      // Aquí conectas con tu API real de Login o Registro
      // const response = await fetch(`https://${IP}/api/auth/${isLogin ? 'login' : 'register'}`, { ... });
      
      // Simulación de respuesta exitosa del backend con datos del usuario:
      const usuarioSimulado = {
        nombre: isLogin ? "Usuario de Prueba" : nombre,
        email: email,
        avatar: 'https://via.placeholder.com/150' // O la URL de su foto de perfil si la hay
      };

      Alert.alert('¡Éxito!', isLogin ? 'Bienvenido' : 'Cuenta creada con éxito');

      user.name = nombre;
      
      // Llamamos a la función que cambia el estado global y pasa el usuario
      onLoginSuccess(usuarioSimulado);

    } catch (error) {
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</Text>

        {!isLogin && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre completo"
              placeholderTextColor="#888"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#888"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? 'Entrar' : 'Registrarse'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
          <Text style={styles.switchText}>
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#111111',
    width: '100%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  title: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#222',
    color: '#FFF',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#043ca4',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: '#4da6ff',
    fontSize: 14,
  },
});