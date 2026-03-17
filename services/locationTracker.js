import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { addLocationEvidence } from "./evidenceService"

const LOCATION_TASK = "SOS_LOCATION_TASK";

let locationInterval = null;

/* =====================================================
   BACKGROUND TRACKING (DEV BUILD MODE ONLY)
   This requires a development build and WILL NOT WORK
   inside Expo Go.

   To enable later:
   1) Uncomment the TaskManager code
   2) Use startLocationUpdatesAsync()
   3) Run: npx expo run:android
===================================================== */

/*

if (!TaskManager.isTaskDefined(LOCATION_TASK)) {

  TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {

    if (error) {
      console.error("[LocationTask] Error:", error);
      return;
    }

    const { locations } = data;

    if (locations && locations.length > 0) {

      const loc = locations[0];

      console.log("[LocationTask] Background location:", loc.coords);

      // TODO:
      // save to evidence system
      // send to trusted contacts

    }

  });

}

export const startLocationTracking = async () => {

  const isRunning =
    await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);

  if (isRunning) {
    console.log("[LocationTracker] Already running");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000,
    distanceInterval: 0,
    pausesUpdatesAutomatically: false,

    foregroundService: {
      notificationTitle: "SOS Active",
      notificationBody: "Location tracking running",
      notificationColor: "#FF0000",
    },
  });

  console.log("[LocationTracker] Background tracking started");

};

*/


/* =====================================================
   PROTOTYPE MODE (Expo Go Compatible)

   This runs location polling every 5 seconds
   while the app is OPEN.
===================================================== */

let tracking = false;

export const startLocationTracking = async () => {

  if (tracking) {
    console.log("[LocationTracker] Already running");
    return;
  }

  tracking = true;

  console.log("[LocationTracker] Starting prototype tracking");

  const track = async () => {

    if (!tracking) return;

    try {

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      console.log(
        "[LocationTracker] Prototype location:",
        location.coords
      );

      await addLocationEvidence(location.coords);

    } catch (err) {

      console.log("Location fetch error:", err);

    }

    setTimeout(track, 5000);

  };

  track();

};


/* =====================================================
   STOP TRACKING
===================================================== */
export const stopLocationTracking = async () => {

  tracking = false;

  console.log("[LocationTracker] Prototype tracking stopped");

};
