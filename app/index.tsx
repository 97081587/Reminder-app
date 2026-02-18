import { StyleSheet, Text, View, FlatList } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import ReminderCard from "../src/components/ReminderCard";
import { loadReminders, saveReminders } from "../src/storage/reminderStorage";

export default function Home() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    loadReminders().then(setReminders);
  }, []);

  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);

  // const toggleComplete = (id: string) => {
  //   setReminders(prev =>
  //     prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
  //   );
  // };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reminders</Text>

      {/* 🔽 ADDED LIST (your UI untouched) */}
      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        style={{ width: "100%", marginTop: 20 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        // renderItem={({ item }) => (
          // <ReminderCard
          //   item={item}
          //   onToggle={toggleComplete}
          //   onDelete={deleteReminder}
          //   onEdit={() => {}}
          // />
        // )}
      />

      {/* your original add button */}
      <Link href="/newReminder" style={styles.addWrap}>
        <View style={styles.div} />
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DFA355",
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    marginTop: 60,
    fontSize: 35,
  },
  div: {
    width: 70,
    height: 70,
    backgroundColor: "#ffffff",
    borderRadius: 100,
  },
  addWrap: {
    position: "absolute",
    bottom: 40,
    right: 25,
  },
});
