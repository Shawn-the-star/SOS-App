import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { colors } from "../constants/theme";
import { getContacts, addContact, deleteContact } from "../services/contactService";

export default function ContactsScreen() {

  const [contacts, setContacts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const loadContacts = async () => {
    const data = await getContacts();
    setContacts(data);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async () => {

    if (!name || !phone) return;

    await addContact({ name, phone });

    setName("");
    setPhone("");
    setModalVisible(false);

    loadContacts();
  };

  const removeContact = async (index) => {
    await deleteContact(index);
    loadContacts();
  };

  return (

    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Emergency Contacts</Text>

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => (

          <View style={styles.contactCard}>

            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
            </View>

            <TouchableOpacity onPress={() => removeContact(index)}>
              <Text style={styles.delete}>Remove</Text>
            </TouchableOpacity>

          </View>

        )}
      />

      {/* Floating Add Button */}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>

      {/* Add Contact Modal */}

      <Modal visible={modalVisible} animationType="slide" transparent>

        <View style={styles.modalContainer}>

          <View style={styles.modalContent}>

            <Text style={styles.modalTitle}>Add Emergency Contact</Text>

            <TextInput
              placeholder="Contact Name"
              placeholderTextColor="#777"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              placeholder="Phone Number"
              placeholderTextColor="#777"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddContact}
            >
              <Text style={styles.saveText}>Save Contact</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24
  },

  title: {
    fontSize: 30,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20
  },

  contactCard: {
    backgroundColor: colors.card,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  name: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "600"
  },

  phone: {
    color: colors.textSecondary,
    marginTop: 3
  },

  delete: {
    color: "#ff3b30",
    fontWeight: "bold"
  },

  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: "#ff3b30",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10
  },

  plus: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold"
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 24
  },

  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24
  },

  modalTitle: {
    fontSize: 22,
    color: colors.textPrimary,
    fontWeight: "bold",
    marginBottom: 20
  },

  input: {
    backgroundColor: "#121212",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: "white"
  },

  saveButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10
  },

  saveText: {
    color: "white",
    fontWeight: "bold"
  },

  cancel: {
    textAlign: "center",
    marginTop: 12,
    color: "#aaa"
  }

});
