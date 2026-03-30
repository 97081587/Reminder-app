import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
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

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [repeat, setRepeat] = useState<"none" | "daily" | "weekly">("none");
  const [repeatPickerVisible, setRepeatPickerVisible] = useState(false);

  const repeatOptions: ("none" | "daily" | "weekly")[] = [
    "none",
    "daily",
    "weekly",
  ];

  // ✅ Android notification channel
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  // ✅ DATE CHANGE
  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setFullYear(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setDate(newDate);
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
      setShowTimePicker(true); // open time picker after date
    }
  };

  // ✅ TIME CHANGE
  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setDate(newDate);
    }

    setShowTimePicker(false);
  };

  // ✅ ADD REMINDER
  const handleAddReminder = async () => {
    if (!title) {
      alert("Please enter a title");
      return;
    }

    if (date < new Date()) {
      alert("Please select a future date and time");
      return;
    }
    
    await addReminder({
      text: title,
      description,
      date: date.toISOString(),
    });

    router.back(); // go back to Home
    };

    // Permissions
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

    // ✅ FIXED TRIGGER (EXPO NEW API)
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Test Reminder",
        body: description || "This should appear in 5 seconds",
      },
      trigger: {
        type: "timeInterval",
        seconds: 5,
        repeats: false,
      },
    });

    // Save reminder
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

    alert("Reminder saved! Fires in 5 seconds 🚀");
    router.back();
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

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>

            {/* ✅ iOS Pickers (INLINE) */}
            {Platform.OS === "ios" && showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="inline"
                onChange={onChangeDate}
              />
            )}

            {Platform.OS === "ios" && showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="spinner"
                onChange={onChangeTime}
              />
            )}

            {/* ✅ Android Pickers */}
            {Platform.OS === "android" && showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}

            {Platform.OS === "android" && showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}

            <Text style={styles.label}>Repeat</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: "center" }]}
              onPress={() => setRepeatPickerVisible(true)}
            >
              <Text>{repeat}</Text>
            </TouchableOpacity>

            <Modal
              transparent
              visible={repeatPickerVisible}
              animationType="fade"
              onRequestClose={() => setRepeatPickerVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setRepeatPickerVisible(false)}
              >
                <View style={styles.modalContent}>
                  <FlatList
                    data={repeatOptions}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.option,
                          item === repeat && styles.activeOption,
                        ]}
                        onPress={() => {
                          setRepeat(item);
                          setRepeatPickerVisible(false);
                        }}
                      >
                        <Text
                          style={{
                            color: item === repeat ? "white" : "black",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </TouchableOpacity>
            </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  option: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  activeOption: {
    backgroundColor: "#2f9e6f",
  },
});