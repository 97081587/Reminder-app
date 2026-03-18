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

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reminders</Text>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ReminderCard item={item} onDelete={deleteReminder} />
        )}
      />

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
    color: "#fff",
    marginTop: 60,
    fontSize: 35,
  },
  div: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 100,
  },
  addWrap: {
    position: "absolute",
    bottom: 40,
    right: 25,
  },
});