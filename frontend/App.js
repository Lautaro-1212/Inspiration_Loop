import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StatusBar } from "react-native";

import HomeScreen from "./screens/Inicio";
import CrearScreen from "./screens/Crear";
import PerfilScreen from "./screens/Perfil";
import BuscarScreen from "./screens/Buscar";
import LoginScreen from "./screens/IniciarSesion"; // <-- Asegúrate de crear este archivo en tu carpeta screens

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tus 4 pestañas actuales agrupadas
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#043ca4',
          height: 70,
          borderBottomWidth: 0,
          elevation: 0,
        },
        headerTintColor: '#ffffff',
        tabBarShowLabel: false,
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: "bold",
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 75,
          backgroundColor: "#043ca4",
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 15,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("./assets/Home2.png") : require("./assets/Home.png")}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Crear"
        component={CrearScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("./assets/Crear2.png") : require("./assets/Crear.png")}
              style={{ width: 30, height: 30 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={BuscarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("./assets/Buscar2.png") : require("./assets/Buscar.png")}
              style={{ width: 32, height: 32 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? require("./assets/Perfil2.png") : require("./assets/Perfil.png")}
              style={{ width: 24, height: 24 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Componente principal de la app con el control de sesión
export default function App() {
  // Estado que define si el usuario ya inició sesión (empieza en false para mostrar el Login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            // Si NO está logueado, muestra la pantalla de Login
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLoginSuccess={() => setIsAuthenticated(true)} />}
            </Stack.Screen>
          ) : (
            // Si YA está logueado, carga tus 4 pestañas de navegación
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}