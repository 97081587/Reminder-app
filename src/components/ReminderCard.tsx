import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import formatDate from "../utils/formatDate";

export default function ReminderCard({ item, onToggle, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.circle, item.completed && styles.circleDone]}
        onPress={() => onToggle(item.id)}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.description}</Text>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>

      <View style={{ gap: 14 }}>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onEdit(item)}>
          <Feather name="edit-2" size={20} color="#777" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.25)",
    marginVertical: 12,
    padding: 18,
    borderRadius: 28,
    alignItems: "center",
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#3dbb86",
    marginRight: 15,
  },
  circleDone: { backgroundColor: "#3dbb86" },
  title: { fontSize: 18, fontWeight: "600" },
  desc: { fontSize: 14, marginTop: 3 },
  date: { marginTop: 6, color: "#666", fontSize: 12 },
});
