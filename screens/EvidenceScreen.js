import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Modal, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import MapView, { Marker } from "react-native-maps";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";


const SESSION_KEY = "CURRENT_EVIDENCE_SESSION";

export default function EvidenceScreen() {

  const [session, setSession] = useState(null);
  const [sound, setSound] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadEvidence = async () => {
    try {
      const data = await AsyncStorage.getItem(SESSION_KEY);
      if (data) setSession(JSON.parse(data));
    } catch (err) {
      console.log("Evidence load error:", err);
    }
  };

  const playAudio = async (uri) => {

    try {

      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });

      setSound(newSound);

      await newSound.playAsync();

    } catch (err) {
      console.log("Audio play error:", err);
    }

  };

  useEffect(() => {

    loadEvidence();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true
    }).start();

  }, []);

  if (!session) {
    return (
      <LinearGradient colors={["#0a0a0a", "#000"]} style={styles.center}>
        <Text style={styles.title}>No Evidence Recorded</Text>

        <Pressable style={styles.button} onPress={loadEvidence}>
          <Text style={styles.buttonText}>Refresh</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  return (

    <LinearGradient colors={["#0a0a0a", "#000"]} style={{ flex: 1 }}>

      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >

          <Text style={styles.title}>Evidence Session</Text>

          <View style={styles.metaCard}>

            <Text style={styles.meta}>
              Start: {new Date(session.startTime).toLocaleString()}
            </Text>

            <Text style={styles.meta}>
              End: {session.endTime
                ? new Date(session.endTime).toLocaleString()
                : "Active"}
            </Text>

          </View>


          {/* AUDIO */}

          <Text style={styles.section}>Audio Evidence</Text>

          {session.audio?.length === 0 && (
            <Text style={styles.empty}>No audio recorded</Text>
          )}

          {session.audio?.map((item, index) => (

            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.audioCard,
                { transform: [{ scale: pressed ? 0.96 : 1 }] }
              ]}
              onPress={() => playAudio(item.uri)}
            >

              <Text style={styles.audioText}>
                🎤 Audio Segment {index + 1}
              </Text>

              <Text style={styles.playText}>Tap to Play</Text>

            </Pressable>

          ))}


          {/* PHOTOS */}

          <Text style={styles.section}>Photo Evidence</Text>

          {session.photos?.length === 0 && (
            <Text style={styles.empty}>No photos captured</Text>
          )}

          {session.photos?.map((item, index) => (

            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.photoCard,
                { transform: [{ scale: pressed ? 0.97 : 1 }] }
              ]}
              onPress={() => setSelectedImage(item.uri)}
            >

              <Image
                source={{ uri: item.uri }}
                style={styles.photo}
                contentFit="cover"
              />

            </Pressable>

          ))}


          {/* MAP */}

          <Text style={styles.section}>Location Map</Text>

          {session.locations?.length > 0 && (

            <View style={styles.mapCard}>

              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: session.locations[0].coords.latitude,
                  longitude: session.locations[0].coords.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                }}
              >

                {session.locations.map((item, index) => (

                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.coords.latitude,
                      longitude: item.coords.longitude
                    }}
                  />

                ))}

              </MapView>

            </View>

          )}

          <View style={{ height: 100 }} />

        </ScrollView>

      </Animated.View>


      {/* FLOATING REFRESH */}

      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          { transform: [{ scale: pressed ? 0.9 : 1 }] }
        ]}
        onPress={loadEvidence}
      >
        <Text style={styles.floatingText}>↻</Text>
      </Pressable>


      {/* FULLSCREEN IMAGE */}

      <Modal visible={!!selectedImage} transparent>

        <Pressable
          style={styles.modal}
          onPress={() => setSelectedImage(null)}
        >

          <Image
            source={{ uri: selectedImage }}
            style={styles.fullImage}
            contentFit="contain"
          />

        </Pressable>

      </Modal>

    </LinearGradient>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 15
  },

  metaCard: {
    backgroundColor: "#141414",
    padding: 15,
    borderRadius: 14
  },

  meta: {
    color: "#bbb",
    marginBottom: 4
  },

  section: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff3b30",
    marginTop: 30,
    marginBottom: 10
  },

  audioCard: {
    backgroundColor: "#161616",
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222"
  },

  audioText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },

  playText: {
    color: "#888",
    marginTop: 4,
    fontSize: 12
  },

  photoCard: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12
  },

  photo: {
    width: "100%",
    height: 200
  },

  mapCard: {
    borderRadius: 16,
    overflow: "hidden"
  },

  map: {
    height: 260,
    width: "100%"
  },

  empty: {
    color: "#666"
  },

  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6
  },

  floatingText: {
    color: "white",
    fontSize: 28
  },

  modal: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center"
  },

  fullImage: {
    width: "100%",
    height: "100%"
  },

  button: {
    marginTop: 15,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10
  },

  buttonText: {
    color: "white"
  }

});
