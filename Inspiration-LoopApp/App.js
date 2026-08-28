import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "./screens/Inicio";
import CrearScreen from "./screens/Crear";

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
            </Tab.Navigator>
        </NavigationContainer>
    );
}