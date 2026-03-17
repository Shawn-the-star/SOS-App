import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal
} from "react-native";

export default function PasscodeModal({ visible, onClose, onSubmit }) {

  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {

    if (code.length < 4) {
      setError("Enter 4 digit passcode");
      return;
    }

    const success = await onSubmit(code);

    if (!success) {
      setError("Incorrect passcode");
    } else {
      setCode("");
      setError("");
      onClose();
    }

  };

  return (

    <Modal visible={visible} transparent animationType="fade">

      <View style={styles.overlay}>

        <View style={styles.container}>

          <Text style={styles.title}>Enter Passcode</Text>

          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            placeholder="••••"
            placeholderTextColor="#666"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttons}>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.submit}>Unlock</Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>

    </Modal>

  );

}

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center"
  },

  container: {
    width: "80%",
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 20
  },

  title: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center"
  },

  input: {
    backgroundColor: "#222",
    color: "white",
    padding: 12,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 8
  },

  error: {
    color: "#ef4444",
    marginTop: 10,
    textAlign: "center"
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20
  },

  cancel: {
    color: "#aaa"
  },

  submit: {
    color: "#4ade80",
    fontWeight: "bold"
  }

});
