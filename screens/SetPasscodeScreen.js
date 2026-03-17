import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

/* ---------------- ANIMATED KEY ---------------- */

const AnimatedKey = ({ label, onPress, isBackspace }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
    }).start();

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
    >
      <Animated.View style={[styles.key, { transform: [{ scale }] }]}>
        <Text style={styles.keyText}>
          {isBackspace ? "⌫" : label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

/* ---------------- MAIN SCREEN ---------------- */

export default function SetPasscodeScreen({ navigation }) {

  const [step, setStep] = useState(1);
  const [oldCode, setOldCode] = useState("");
  const [code, setCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [error, setError] = useState("");

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const check = async () => {
      const saved = await AsyncStorage.getItem("SOS_PASSCODE");
      if (saved) setStep(0);
      else setStep(1);
    };
    check();
  }, []);

  /* ---------------- ANIMATIONS ---------------- */

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const successAnimation = () => {
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => navigation.goBack());
  };

  /* ---------------- LOGIC ---------------- */

  const handlePress = (num) => {

    if (step === 0) {
      if (oldCode.length >= 4) return;
      const newCode = oldCode + num;
      setOldCode(newCode);
      if (newCode.length === 4) verifyOld(newCode);
    }

    else if (step === 1) {
      if (code.length >= 4) return;
      const newCode = code + num;
      setCode(newCode);
      if (newCode.length === 4) setStep(2);
    }

    else {
      if (confirmCode.length >= 4) return;
      const newCode = confirmCode + num;
      setConfirmCode(newCode);
      if (newCode.length === 4) verifyNew(newCode);
    }
  };

  const handleBackspace = () => {
    if (step === 0) setOldCode(oldCode.slice(0, -1));
    else if (step === 1) setCode(code.slice(0, -1));
    else setConfirmCode(confirmCode.slice(0, -1));
  };

  const verifyOld = async (entered) => {
    const saved = await AsyncStorage.getItem("SOS_PASSCODE");

    if (entered !== saved) {
      setError("Incorrect passcode");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setOldCode("");
      return;
    }

    setError("");
    setOldCode("");
    setStep(1);
  };

  const verifyNew = async (entered) => {
    if (entered !== code) {
      setError("Passcodes do not match");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setConfirmCode("");
      return;
    }

    await AsyncStorage.setItem("SOS_PASSCODE", code);
    successAnimation();
  };

  const current = step === 0 ? oldCode : step === 1 ? code : confirmCode;

  const title =
    step === 0 ? "Enter Old Passcode"
      : step === 1 ? "Set Passcode"
        : "Confirm Passcode";

  /* ---------------- UI ---------------- */

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {[0, 1, 2, 3].map((i) => (
        <Animated.View
          key={i}
          style={[
            styles.dot,
            i < current.length && styles.activeDot,
            i === current.length - 1 && {
              transform: [{ scale: successAnim }]
            }
          ]}
        />
      ))}
    </View>
  );

  const renderButton = (num) => (
    <AnimatedKey
      key={num}
      label={num}
      onPress={() => handlePress(num)}
    />
  );

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnim }] }
      ]}
    >

      <View style={styles.top}>
        <Text style={styles.title}>{title}</Text>
        {renderDots()}
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.keypad}>

        <View style={styles.row}>{[1, 2, 3].map(renderButton)}</View>
        <View style={styles.row}>{[4, 5, 6].map(renderButton)}</View>
        <View style={styles.row}>{[7, 8, 9].map(renderButton)}</View>

        <View style={styles.row}>
          <View style={styles.placeholder} />
          {renderButton(0)}
          <AnimatedKey isBackspace onPress={handleBackspace} />
        </View>

      </View>

    </Animated.View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    paddingVertical: 70
  },

  top: {
    alignItems: "center"
  },

  title: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 25,
    opacity: 0.85
  },

  dotsContainer: {
    flexDirection: "row",
    marginBottom: 20
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#333",
    marginHorizontal: 10
  },

  activeDot: {
    backgroundColor: "#fff"
  },

  error: {
    color: "#ff4d4d",
    marginTop: 10,
    fontSize: 13
  },

  keypad: {
    width: "85%",
    alignSelf: "center"
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  key: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222"
  },

  placeholder: {
    width: 80,
    height: 80
  },

  keyText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "500"
  }

});
