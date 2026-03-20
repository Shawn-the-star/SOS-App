import AsyncStorage from "@react-native-async-storage/async-storage";
import { logActivity } from "./activityLogger";

const SESSION_KEY = "CURRENT_EVIDENCE_SESSION";

const LAST_LOCATION_KEY = "LAST_KNOWN_LOCATION";

export const setLastLocation = async (coords) => {
  try {
    await AsyncStorage.setItem(
      LAST_LOCATION_KEY,
      JSON.stringify(coords)
    );
  } catch (e) {
    console.log("Error saving last location:", e);
  }
};

export const getLastLocation = async () => {
  try {
    const data = await AsyncStorage.getItem(LAST_LOCATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.log("Error getting last location:", e);
    return null;
  }
};


export const startEvidenceSession = async () => {

  const session = {
    startTime: Date.now(),
    audio: [],
    locations: []
  };

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  console.log("[Evidence] Session started");
  logActivity("🟢 Evidence session started");

};

export const addAudioEvidence = async (uri) => {

  const session = JSON.parse(
    (await AsyncStorage.getItem(SESSION_KEY)) || "{}"
  );

  if (!session.audio) session.audio = [];

  session.audio.push({
    uri,
    timestamp: Date.now()
  });

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  console.log("[Evidence] Audio stored");
  logActivity("🎤 Audio recorded");

};

export const addLocationEvidence = async (coords) => {

  const session = JSON.parse(
    (await AsyncStorage.getItem(SESSION_KEY)) || "{}"
  );

  if (!session.locations) session.locations = [];

  session.locations.push({
    coords,
    timestamp: Date.now()
  });

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  console.log("[Evidence] Location stored");
  logActivity("📍 Location captured");

};

export const addPhotoEvidence = async (uri) => {

  const session = JSON.parse(
    (await AsyncStorage.getItem(SESSION_KEY)) || "{}"
  );

  if (!session.photos) session.photos = [];

  session.photos.push({
    uri,
    timestamp: Date.now()
  });

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  console.log("[Evidence] Photo stored");
  logActivity("📸 Photo captured");

};


export const endEvidenceSession = async () => {

  const session = JSON.parse(
    (await AsyncStorage.getItem(SESSION_KEY)) || "{}"
  );

  session.endTime = Date.now();

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session)
  );

  console.log("[Evidence] Session ended");
  logActivity("🛑 Session ended");

};
