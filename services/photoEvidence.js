import * as Camera from "expo-camera";
import { takePhoto } from "./cameraService";
import { addPhotoEvidence } from "./evidenceService";


let interval = null;

const PHOTO_INTERVAL = 15000;

export const startPhotoEvidence = async (cameraRef) => {

  try {

    console.log("[PhotoEvidence] Starting");

    if (interval) return;

    interval = setInterval(async () => {

      const uri = await takePhoto();

      if (uri) {
        await addPhotoEvidence(uri);
      }
      console.log("[PhotoEvidence] Photo captured:", uri);

    }, PHOTO_INTERVAL);

  } catch (error) {

    console.log("Photo evidence error:", error);

  }

};

export const stopPhotoEvidence = () => {

  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  console.log("[PhotoEvidence] Stopped");

};
