import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors } from "../constants/theme";

export default function ActionCard({ title }) {

  return (

    <TouchableOpacity style={styles.card} activeOpacity={0.8}>

      <Text style={styles.title}>{title}</Text>

    </TouchableOpacity>

  );

}

const styles = StyleSheet.create({

  card: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    marginHorizontal: 6
  },

  title: {
    color: colors.textPrimary,
    fontWeight: "600"
  }

});
