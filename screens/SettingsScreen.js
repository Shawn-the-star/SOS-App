import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen({ navigation }) {

  const [hasPasscode, setHasPasscode] = useState(false);

  useEffect(() => {

    const checkPasscode = async () => {
      const code = await AsyncStorage.getItem("SOS_PASSCODE");
      setHasPasscode(!!code);
    };

    checkPasscode();

  }, []);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate("SetPasscode")}
      >
        <Text style={styles.settingText}>
          {hasPasscode ? "Change Passcode" : "Set Passcode"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    justifyContent: "center",
    paddingHorizontal: 20
  },

  title: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center"
  },

  settingItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#111",
    marginBottom: 10
  },

  settingText: {
    color: "white",
    fontSize: 16
  }

});
