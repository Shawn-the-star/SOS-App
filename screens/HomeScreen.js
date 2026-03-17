import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PanicButton from "../components/PanicButton";
import ActionCard from "../components/ActionCard";
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

  }

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
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>Your safety companion</Text>
      </View>

      <StatusCard
        contactsReady={contactsReady}
        locationReady={locationReady}
        audioReady={audioReady}
        cameraReady={cameraReady}
      />


      <PanicButton
        onActivate={handleSOS}
        onStop={stopSOSHandler}
        isActive={isSOSActive}
      />

      <Text style={styles.instructions}>
        Hold the button for 3 seconds to trigger emergency
      </Text>

      <View style={styles.actionsContainer}>
        <ActionCard title="Contacts" icon="contacts" />
        <ActionCard title="Location" icon="location-on" />
        <ActionCard title="Evidence" icon="videocam" />
      </View>


      <PasscodeModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePasscodeSubmit}
      />


    </View >


  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: "space-evenly",
    alignItems: "center"
  },

  header: {
    alignItems: "center"
  },

  title: {
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: "bold"
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 5
  },

  instructions: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: 14
  },

  actionsContainer: {
    flexDirection: "row",
    width: "100%"
  },

  permissionButton: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10
  },

  permissionText: {
    color: "#aaa"
  }


});
