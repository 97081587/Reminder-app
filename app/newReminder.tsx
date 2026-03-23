import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
// ✅ Notification handler
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
  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");

  // ✅ Android notification channel
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

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
          showMode("time"); // open time picker automatically
        }
      } else {
        currentDate.setHours(
          selectedDate.getHours(),
          selectedDate.getMinutes(),
        );
        setDate(currentDate);
      }
    }
    setShowPicker(false);
  };

  // ✅ Main function
  const handleAddReminder = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    if (date < new Date()) {
      alert("Please select a future date and time");
      return;
    }

    // ✅ Permissions
    const { status } = await Notifications.getPermissionsAsync();
    let finalStatus = status;

    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted");
      return;
    }

    // ✅ Trigger logic (repeat support)
    let trigger: any;

    if (repeat === "daily") {
      trigger = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else if (repeat === "weekly") {
      trigger = {
        weekday: date.getDay() + 1, // Expo: 1 = Sunday
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else {
      trigger = {
        date: new Date(date),
      };
    }

    // ✅ Schedule notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: description || "Reminder",
      },
      trigger,
    });

    // ✅ Save reminder (IMPORTANT for team)
    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      date: date.toISOString(),
      repeat,
      notificationId,
    };

    const stored = await AsyncStorage.getItem("reminders");
    const reminders = stored ? JSON.parse(stored) : [];

    reminders.push(newReminder);

    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

    alert("Reminder saved!");
    router.back(); // go back to list screen
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
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

            <Text style={styles.label}>Repeat</Text>
            <View style={styles.repeatRow}>
              {["none", "daily", "weekly"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.repeatBtn,
                    repeat === item && styles.activeBtn,
                  ]}
                  onPress={() => setRepeat(item as any)}
                >
                  <Text
                    style={{
                      color: repeat === item ? "white" : "black",
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
  header: { fontSize: 30, color: "white", marginBottom: 20 },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 20,
  },
  label: { marginTop: 10 },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  textArea: {
    height: 70,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  repeatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  repeatBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  activeBtn: {
    backgroundColor: "#2f9e6f",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#ccc",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: "45%",
    height: 45,
    backgroundColor: "#2f9e6f",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
