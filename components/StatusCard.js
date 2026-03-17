import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StatusCard({
  contactsReady,
  locationReady,
  audioReady,
  cameraReady
}) {

  const StatusRow = ({ label, active }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.dot,
          { backgroundColor: active ? "#22c55e" : "#ef4444" }
        ]}
      />
    </View>
  );

  return (
    <View style={styles.card}>

      <Text style={styles.title}>System Status</Text>

      <StatusRow
        label="Emergency Contacts"
        active={contactsReady}
      />

      <StatusRow
        label="Location Permission"
        active={locationReady}
      />

      <StatusRow
        label="Microphone Permission"
        active={audioReady}
      />

      <StatusRow
        label="Camera Permission"
        active={cameraReady}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#1c1c1e",
    borderRadius: 14,
    padding: 18,
    marginBottom: 20
  },

  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6
  },

  label: {
    color: "#e5e5e5",
    fontSize: 15
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6
  }

});
