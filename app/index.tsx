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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const [reminders, setReminders] = useState([]);

  // useEffect(() => {}, [reminders]);

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
            <View style={styles.div} />
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
