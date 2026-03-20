import React, { useRef, useEffect } from "react";
import { Pressable, Text, StyleSheet, View, Animated } from "react-native";

export default function PanicButton({ onActivate, onStop, isActive }) {

  const timer = useRef(null);
  const activated = useRef(false);

  const scale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  // 🔥 NEW: pulse animation for active state
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [isActive]);

  const handlePressIn = () => {

    activated.current = false;

    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true
    }).start();

    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false
    }).start();

    timer.current = setTimeout(() => {
      activated.current = true;
      onActivate();
      progress.setValue(0);
    }, 3000);
  };

  const handlePressOut = () => {

    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true
    }).start();

    if (!activated.current) {
      clearTimeout(timer.current);
      progress.setValue(0);
    }
  };

  const widthInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"]
  });

  return (

    <View style={styles.container}>

      {!isActive ? (

        <>
          <Text style={styles.title}>Emergency SOS</Text>

          <Text style={styles.subtitle}>
            Hold for 3 seconds to activate
          </Text>

          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View
              style={[
                styles.buttonWrapper,
                { transform: [{ scale }] }
              ]}
            >

              {/* Glow Ring */}
              <View style={styles.outerRing} />

              {/* Main Button */}
              <View style={styles.button}>
                <Text style={styles.text}>SOS</Text>

                <Animated.View
                  style={[
                    styles.progress,
                    { width: widthInterpolate }
                  ]}
                />
              </View>

            </Animated.View>
          </Pressable>
        </>

      ) : (

        <>
          <Text style={styles.activeTitle}>🚨 SOS ACTIVE</Text>

          <Text style={styles.subtitle}>
            Recording & tracking in progress
          </Text>

          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <Pressable
              style={({ pressed }) => [
                styles.stopButton,
                { transform: [{ scale: pressed ? 0.96 : 1 }] }
              ]}
              onPress={onStop}
            >
              <Text style={styles.stopText}>STOP SOS</Text>
            </Pressable>
          </Animated.View>
        </>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    marginTop: 30
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 0.5
  },

  activeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ff3b30",
    marginBottom: 10,
    letterSpacing: 1
  },

  subtitle: {
    color: "#888",
    marginBottom: 30,
    fontSize: 13
  },

  buttonWrapper: {
    justifyContent: "center",
    alignItems: "center"
  },

  outerRing: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,59,48,0.08)",
  },

  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff3b30",
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
    overflow: "hidden"
  },

  text: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 3
  },

  progress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 6,
    backgroundColor: "#fff",
    opacity: 0.9
  },

  stopButton: {
    marginTop: 30,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#ff3b30",
    paddingVertical: 18,
    paddingHorizontal: 45,
    borderRadius: 18,
  },

  stopText: {
    color: "#ff3b30",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1
  }

});
