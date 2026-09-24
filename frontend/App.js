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
              backgroundColor: "#224484",
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
                  source={
                    focused
                      ? require("./assets/Home2.png")
                      : require("./assets/Home.png")
                  }
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
                  source={
                    focused
                      ? require("./assets/Crear2.png")
                      : require("./assets/Crear.png")
                  }
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
                  source={
                    focused
                      ? require("./assets/Buscar2.png")
                      : require("./assets/Buscar.png")
                  }
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
                  source={
                    focused
                      ? require("./assets/Perfil2.png")
                      : require("./assets/Perfil.png")
                  }
                  style={{ width: 24, height: 24 }}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}