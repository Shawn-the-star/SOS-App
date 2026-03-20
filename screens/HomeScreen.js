import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import PanicButton from "../components/PanicButton";
import StatusCard from "../components/StatusCard";
import { colors } from "../constants/theme";
import { startLocationTracking } from "../services/locationTracker";
import { checkPermissions } from "../services/permissionService";
import { getContacts } from "../services/contactService";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useState, useCallback } from "react";
import { triggerSOS, stopSOS, setSOSPasscode } from "../services/sosService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PasscodeModal from "../components/PasscodeModal";
import ActivityFeed from "../components/ActivityFeed";
import { sendSOSAlert } from "../services/alertService";



const SOS_STATE_KEY = "SOS_ACTIVE";

export default function HomeScreen() {

  const [contactsReady, setContactsReady] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadSOSState = async () => {
      const state = await AsyncStorage.getItem(SOS_STATE_KEY);
      setIsSOSActive(state === "true");
    };
    loadSOSState();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const refreshStatus = async () => {
        const permissions = await checkPermissions();

        setLocationReady(permissions.location);
        setAudioReady(permissions.microphone);
        setCameraReady(permissions.camera);

        const contacts = await getContacts();
        setContactsReady(contacts.length > 0);
      };

      refreshStatus();
    }, [])
  );

  const handleSOS = async () => {
    try {
      await triggerSOS();

      setIsSOSActive(true);
    } catch (error) {
      console.log("SOS error:", error);
    }
  };

  const stopSOSHandler = () => {
    setShowModal(true);
  };
  
  const handlePasscodeSubmit = async (code) => {
    const success = await stopSOS(code);
    if (success) {
      setIsSOSActive(false);
      return true;
    }
    return false;
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>Your safety companion</Text>
      </View>

      {/* STATUS CARD */}
      <View style={styles.section}>
        <StatusCard
          contactsReady={contactsReady}
          locationReady={locationReady}
          audioReady={audioReady}
          cameraReady={cameraReady}
        />
      </View>

      {/* PANIC BUTTON */}
      <View style={styles.buttonSection}>
        <PanicButton
          onActivate={handleSOS}
          onStop={stopSOSHandler}
          isActive={isSOSActive}
        />
        <Text style={styles.instructions}>
          Hold for 3 seconds to trigger emergency
        </Text>
      </View>

      {/* ACTIVITY FEED */}
      <ActivityFeed />


      {/* PASSCODE MODAL */}
      <PasscodeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePasscodeSubmit}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#0c0c0c",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  subtitle: {
    color: "#888",
    marginTop: 6,
    fontSize: 14,
  },

  section: {
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
  },

  buttonSection: {
    alignItems: "center",
    marginBottom: 10,
  },

  instructions: {
    color: "#777",
    textAlign: "center",
    fontSize: 13,
    marginTop: 10,
  },

  actionsWrapper: {
    marginTop: 10,
  },

  sectionTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 5,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

});
