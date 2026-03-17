import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import ContactsScreen from "./screens/ContactsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import EvidenceScreen from "./screens/EvidenceScreen";
import SetPasscodeScreen from "./screens/SetPasscodeScreen";

import { requestAllPermissions } from "./services/permissionService";
import { setCameraRef } from "./services/cameraService";

import { CameraView } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();


// 🔹 Bottom Tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#222",
          height: 65,
        },
        tabBarActiveTintColor: "#ff3b30",
        tabBarInactiveTintColor: "#777",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="contacts" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Evidence"
        component={EvidenceScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="videocam" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


// 🔹 Main App
export default function App() {

  const cameraRef = useRef(null);

  useEffect(() => {

    const init = async () => {

      const permissions = await requestAllPermissions();
      console.log("Permissions:", permissions);

      setCameraRef(cameraRef);

    };

    init();

  }, []);

  return (
    <>
      {/* Hidden Camera */}
      <CameraView
        ref={cameraRef}
        style={{
          width: 1,
          height: 1,
          position: "absolute",
          top: -100,
          left: -100
        }}
      />

      <NavigationContainer>

        <Stack.Navigator screenOptions={{ headerShown: false }}>

          {/* Tabs */}
          <Stack.Screen name="MainTabs" component={TabNavigator} />

          {/* NEW SCREEN */}
          <Stack.Screen name="SetPasscode" component={SetPasscodeScreen} />

        </Stack.Navigator>

      </NavigationContainer>
    </>
  );
}
