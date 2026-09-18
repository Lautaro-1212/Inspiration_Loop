import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StatusBar } from "react-native";


import HomeScreen from "./screens/Inicio";
import CrearScreen from "./screens/Crear";
import PerfilScreen from "./screens/Perfil";
import BuscarScreen from "./screens/Buscar";

const Tab = createBottomTabNavigator();
        
export default function App() {
  return (
    <>
      {/* Transparencia total en la barra superior del sistema */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,

            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 75,
              backgroundColor: "#224484", // Mismo fondo gris de tus pantallas
              borderTopWidth: 0,
              elevation: 0, // Quita la línea superior y sombra en Android
              paddingBottom: 15, // Eleva los íconos por encima de los botones de Android
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
              tabBarIcon: () => (
                <Image
                  source={require("./assets/Home.png")}
                  style={{ width: 28, height: 28, tintColor: "#000000" }}
                />
              ),
            }}
          />

                <Tab.Screen
                    name="Crear"
                    component={CrearScreen}
                    options={{
                        tabBarIcon: () => (
                            <Image
                                source={require("./assets/Crear.png")}
                                style={{
                                width: 30,
                                height: 30,
                                }}
                            />
                        )
                    }}
                />

                 <Tab.Screen
                    name="Buscar"
                    component={BuscarScreen}
                    options={{
                        tabBarIcon: () => (
                            <Image
                                source={require("./assets/Buscar.png")}
                                style={{
                                width: 32,
                                height: 32,
                                }}
                            />
                        )
                    }}
                />

                <Tab.Screen
                    name="Perfil"
                    component={PerfilScreen}
                    options={{
                        tabBarIcon: () => (
                            <Image
                                source={require("./assets/Perfil.png")}
                                style={{
                                width: 24,
                                height: 24, 
                                }}
                            />
                        )
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
        </>
    );
}