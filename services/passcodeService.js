import AsyncStorage from "@react-native-async-storage/async-storage";

export const setPasscode = async (code) => {
  await AsyncStorage.setItem("sosPasscode", code);
};

export const getPasscode = async () => {
  return await AsyncStorage.getItem("sosPasscode");
};
