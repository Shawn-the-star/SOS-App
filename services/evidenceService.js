import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "CURRENT_EVIDENCE_SESSION";

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

};
