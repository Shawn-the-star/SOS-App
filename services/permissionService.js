import { Audio } from "expo-av";
import * as Location from "expo-location";
import { Camera } from "expo-camera";

export const requestAllPermissions = async () => {

  try {

    const mic = await Audio.requestPermissionsAsync();

    const foreground = await Location.requestForegroundPermissionsAsync();

    let background = { status: "denied" };

    if (foreground.status === "granted") {
      background = await Location.requestBackgroundPermissionsAsync();
    }


    const cam = await Camera.requestCameraPermissionsAsync();

    return {
      microphone: mic.status === "granted",
      location:
        foreground.status === "granted" &&
        background.status === "granted",

      camera: cam.status === "granted"
    };

  } catch (error) {

    console.log("Permission request error:", error);

    return {
      microphone: false,
      location: false,
      camera: false
    };

  }

};

export const checkPermissions = async () => {

  try {

    const mic = await Audio.getPermissionsAsync();

    const loc = await Location.getForegroundPermissionsAsync();

    const cam = await Camera.getCameraPermissionsAsync();

    return {
      microphone: mic.status === "granted",
      location: loc.status === "granted",
      camera: cam.status === "granted"
    };

  } catch (error) {

    console.log("Permission check error:", error);

    return {
      microphone: false,
      location: false,
      camera: false
    };

  }

};
