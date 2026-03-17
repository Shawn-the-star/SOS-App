import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addAudioEvidence } from "./evidenceService";


let recording = null;
let interval = null;

const SEGMENT_TIME = 20000;

export const startAudioEvidence = async () => {

  try {

    if (interval) {
      console.log("Audio evidence already running");
      return;
    }

    console.log("Starting audio evidence...");

    await startSegment();

    interval = setInterval(async () => {

      await startSegment();

    }, SEGMENT_TIME);

  } catch (error) {

    console.log("Audio start error:", error);

  }

};


const startSegment = async () => {

  try {

    if (recording) {

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      console.log("[AudioEvidence] Segment saved:", uri);

      const saved = JSON.parse(
        (await AsyncStorage.getItem("audioEvidence")) || "[]"
      );

      await addAudioEvidence(uri);

      await AsyncStorage.setItem(
        "audioEvidence",
        JSON.stringify(saved)
      );

    }

    recording = new Audio.Recording();

    await recording.prepareToRecordAsync({
      android: {
        extension: ".m4a",
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 22050,
        numberOfChannels: 1,
        bitRate: 32000
      },
      ios: {
        extension: ".m4a",
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_LOW,
        sampleRate: 22050,
        numberOfChannels: 1,
        bitRate: 32000
      }
    });

    await recording.startAsync();

    console.log("[AudioEvidence] Recording segment started");

  } catch (error) {

    console.log("Segment error:", error);

  }

};


export const stopAudioEvidence = async () => {

  try {

    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    if (recording) {

      await recording.stopAndUnloadAsync();

      const uri = recording.getURI();

      console.log("[AudioEvidence] Final segment saved:", uri);

      const saved = JSON.parse(
        (await AsyncStorage.getItem("audioEvidence")) || "[]"
      );

      saved.push(uri);

      await AsyncStorage.setItem(
        "audioEvidence",
        JSON.stringify(saved)
      );

      recording = null;

    }

    console.log("Audio evidence stopped");

  } catch (error) {

    console.log("Stop error:", error);

  }

};

