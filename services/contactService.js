import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "EMERGENCY_CONTACTS";

export const getContacts = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveContacts = async (contacts) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
};

export const addContact = async (contact) => {
  const contacts = await getContacts();
  contacts.push(contact);
  await saveContacts(contacts);
};

export const deleteContact = async (index) => {
  const contacts = await getContacts();
  contacts.splice(index, 1);
  await saveContacts(contacts);
};
