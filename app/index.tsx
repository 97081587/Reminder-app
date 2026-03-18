import { StyleSheet, Text, View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const [reminders, setReminders] = useState([]);

  // useEffect(() => {}, [reminders]);

  return (
    <LinearGradient 
      colors={["#2a8c82", "#d1913c"]} 
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Reminders</Text>

      {/* reminder list */}
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

      {/* add button */}
      <Link href="/newReminder" style={styles.addWrap}>
        <View style={styles.div} />
      </Link>
    </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
