let cameraRef = null;

export const setCameraRef = (ref) => {
  cameraRef = ref;
};

export const getCameraRef = () => {
  return cameraRef;
};

export const takePhoto = async () => {

  try {

    if (!cameraRef?.current) {
      console.log("[CameraService] Camera not ready");
      return null;
    }

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.4,
      skipProcessing: true
    });

    console.log("[CameraService] Photo captured");

    return photo.uri;

  } catch (error) {

    console.log("[CameraService] Photo error:", error);
    return null;

  }

};
