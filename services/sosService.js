import AsyncStorage from "@react-native-async-storage/async-storage";

import { startLocationTracking, stopLocationTracking } from "./locationTracker";
import { startAudioEvidence, stopAudioEvidence } from "./audioEvidence";
import { startEvidenceSession, endEvidenceSession } from "./evidenceService";
import { startPhotoEvidence, stopPhotoEvidence } from "./photoEvidence";
import { getContacts } from "./contactService";
import { sendSOSAlert } from "./alertService";
import { db } from "./firebase";
import { ref, set } from "firebase/database";



const SOS_STATE_KEY = "SOS_ACTIVE";
const PASSCODE_KEY = "SOS_PASSCODE";


// START SOS
export const triggerSOS = async () => {

  try {

    const active = await AsyncStorage.getItem(SOS_STATE_KEY);

    if (active === "true") {
      console.log("SOS already running");
      return;
    }

    const sessionId = Date.now().toString();

    await AsyncStorage.setItem("SOS_SESSION_ID", sessionId);
    await set(ref(db, `sessions/${sessionId}/status`), {
      active: true,
      startTime: Date.now()
    });


    console.log("🚨 SOS ACTIVATED");

    await AsyncStorage.setItem(SOS_STATE_KEY, "true");

    console.log("Starting evidence session...");
    await startEvidenceSession();

    console.log("Starting audio evidence...");
    await startAudioEvidence();

    console.log("Starting location tracking...");
    await startLocationTracking();

    // wait for first location to be stored
    await new Promise(resolve => setTimeout(resolve, 5000));

    const contacts = await getContacts();

    if (contacts.length !== 0) {
      await sendSOSAlert();
      console.log("SOS alert sent to trusted contacts");
    }


    console.log("Starting photo evidence...");
    await startPhotoEvidence();


    console.log("SOS systems running");

  } catch (error) {

    console.log("SOS error:", error);

  }

};




// STOP SOS (requires passcode)
export const stopSOS = async () => {

  try {

    console.log("Stopping SOS systems...");

    await stopLocationTracking();
    await stopAudioEvidence();
    await stopPhotoEvidence();
    await endEvidenceSession();

    const sessionId = await AsyncStorage.getItem("SOS_SESSION_ID");

    if (sessionId) {
      await set(ref(db, `sessions/${sessionId}/status/active`), false);
    }

    await AsyncStorage.setItem(SOS_STATE_KEY, "false");

    console.log("SOS stopped");

    return true;

  } catch (error) {

    console.log("Stop SOS error:", error);
    return false;

  }

};


export const forceResetSOS = async () => {

  try {

    console.log("Force resetting SOS...");

    await stopLocationTracking();
    await stopAudioEvidence();
    await stopPhotoEvidence();
    await endEvidenceSession();

    await AsyncStorage.setItem(SOS_STATE_KEY, "false");

    console.log("SOS force reset complete");

  } catch (error) {

    console.log("Force reset error:", error);

  }

};





// CHECK IF SOS IS ACTIVE
export const isSOSActive = async () => {

  const state = await AsyncStorage.getItem(SOS_STATE_KEY);

  return state === "true";

};



// SET PASSCODE
export const setSOSPasscode = async (code) => {

  await AsyncStorage.setItem(PASSCODE_KEY, code);

};
