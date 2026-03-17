import React, { useRef } from "react";
import { Pressable, Text, StyleSheet, View, Animated } from "react-native";

export default function PanicButton({ onActivate, onStop, isActive }) {

  const timer = useRef(null);
  const activated = useRef(false);

  const scale = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {

    activated.current = false;

    Animated.spring(scale, {
      toValue: 0.9,
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
    } else {
      // DO NOTHING after activation
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
                styles.button,
                { transform: [{ scale }] }
              ]}
            >

              <Text style={styles.text}>SOS</Text>

              <Animated.View
                style={[
                  styles.progress,
                  { width: widthInterpolate }
                ]}
              />

            </Animated.View>

          </Pressable>
        </>

      ) : (

        <>
          <Text style={styles.activeTitle}>SOS ACTIVE</Text>

          <Text style={styles.subtitle}>
            Recording & tracking in progress
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.stopButton,
              { transform: [{ scale: pressed ? 0.95 : 1 }] }
            ]}
            onPress={onStop}
          >
            <Text style={styles.stopText}>STOP SOS</Text>
          </Pressable>
        </>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    alignItems: "center",
    marginTop: 40
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 6
  },

  activeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ff3b30",
    marginBottom: 10
  },

  subtitle: {
    color: "#aaa",
    marginBottom: 30
  },

  button: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ef4444",
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden"
  },

  text: {
    color: "white",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 3
  },

  progress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 6,
    backgroundColor: "#fff"
  },

  stopButton: {
    marginTop: 30,
    backgroundColor: "#111",
    borderWidth: 2,
    borderColor: "#ff3b30",
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 14
  },

  stopText: {
    color: "#ff3b30",
    fontSize: 18,
    fontWeight: "700"
  }

});
