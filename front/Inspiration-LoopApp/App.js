import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import HomeScreen from "./screens/Inicio";
import CrearScreen from "./screens/Crear";
import PerfilScreen from "./screens/Perfil";
import BuscarScreen from "./screens/Buscar";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,

                    tabBarStyle: {
                        position: "absolute",

                        bottom: 50,
                        left: 10,
                        right: 10,
                        height: 50,

                        borderRadius: 20,

                        backgroundColor: "#969aa8",

                        //borderTopWidth: 0,

                        borderWidth: 2,
                        borderColor:'black',

                        elevation: 5,
                    },

                    tabBarItemStyle: {
                        paddingVertical: 0,
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
                                style={{
                                width: 30,
                                height: 30,
                                }}
                            />
                        )
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
    );
}