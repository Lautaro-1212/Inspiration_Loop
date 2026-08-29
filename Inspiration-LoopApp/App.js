import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/Inicio";
import CrearScreen from "./screens/Crear";
import PerfilScreen from "./screens/Perfil";
import BuscarScreen from "./screens/Buscar";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen
                    name="Inicio"
                    component={HomeScreen}
                />

                <Tab.Screen
                    name="Crear"
                    component={CrearScreen}
                />

                <Tab.Screen
                    name="Perfil"
                    component={PerfilScreen}
                />

                <Tab.Screen
                    name="Buscar"
                    component={BuscarScreen}
                />
            </Tab.Navigator>
        </NavigationContainer>
        
    );
}