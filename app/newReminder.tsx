import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NewReminder() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");

  // Open picker
  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setShowPicker(true);
  };

  // Handle date/time change
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      const currentDate = new Date(date);

      if (mode === "date") {
        currentDate.setFullYear(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
        );
        setDate(currentDate);

        if (Platform.OS === "android") {
          // Open time picker automatically on Android
          showMode("time");
          return; // Don't hide picker yet
        }
      } else if (mode === "time") {
        currentDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
        );
        setDate(currentDate);
      }
    }

    // Hide picker on iOS or after time selection on Android
    if (Platform.OS === "ios" || mode === "time") {
      setShowPicker(false);
    }
  };

  const handleAddReminder = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    if (date < new Date()) {
      alert("Please select a future date and time");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission not granted");
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      date: date.toISOString(),
    };

    const storedReminders = await AsyncStorage.getItem("reminders");
    const reminders = storedReminders ? JSON.parse(storedReminders) : [];

    reminders.push(newReminder);
    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: { title: newReminder.title, body: newReminder.description },
      trigger: new Date(newReminder.date),
    });

    alert("Reminder saved!");
    router.back();
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter title"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => showMode("date")}
            >
              <Text>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={date}
                mode={mode}
                display="default"
                onChange={onChangeDate}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => router.back()}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddReminder}
              >
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingTop: 60 },
  header: { fontSize: 30, color: "white", marginBottom: 30 },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 25,
  },
  label: { marginTop: 15, marginBottom: 8 },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  textArea: {
    height: 80,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  cancelBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#2f9e6f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
