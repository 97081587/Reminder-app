import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { getReminders, deleteReminder } from "../src/storage/reminders";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [reminders, setReminders] = useState([]);

  // Refresh reminders when screen is focused
  const loadReminders = async () => {
    const stored = await AsyncStorage.getItem("reminders");
    setReminders(stored ? JSON.parse(stored) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, []),
  );

  //reminder cards
  const ReminderCard = ({ item, onDelete }) => {
    return (
      <View style={styles.reminderCard}>
        <Text>{item.title}</Text>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link href={`/editReminder?id=${item.id}`}>
            <Text>✏️</Text>
          </Link>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>Reminders</Text>

        {/* reminder list */}
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ReminderCard item={item} onDelete={deleteReminder} />
          )}
        />

        {/* add button */}
        <TouchableOpacity style={styles.addWrap}>
          <Link href="/newReminder">
            <View style={styles.div}>
              <Text style={styles.addText}>+</Text>
            </View>
            {/* <View style={styles.div} /> */}
          </Link>
        </TouchableOpacity>
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
    color: "#fff",
    marginTop: 60,
    fontSize: 35,
  },
  addWrap: {
    position: "absolute",
    bottom: 40,
    right: 25,
  },
  div: {
    width: 70,
    height: 70,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 100,
  },
  addText: {
    fontSize: 50,
    color: "#2a8c82",
    position: "absolute",
    top: 1,
    left: 22,
  },
  reminderCard: {
    width: "200%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 25,
  },
});
