import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NewReminder() {
  const router = useRouter();
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [repeatPickerVisible, setRepeatPickerVisible] = useState(false);

  // 🔊 MULTIPLE SOUNDS
  const [selectedSounds, setSelectedSounds] = useState<string[]>([]);
  const [soundPickerVisible, setSoundPickerVisible] = useState(false);

  const soundOptions = ["Bell", "Chime", "Alert", "Digital", "Echo"];

  const repeatOptions: ("none" | "daily" | "weekly")[] = [
    "none",
    "daily",
    "weekly",
  ];

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
      });
    }
  }, []);

  const toggleSound = (sound: string) => {
    if (selectedSounds.includes(sound)) {
      setSelectedSounds(selectedSounds.filter((s) => s !== sound));
    } else {
      setSelectedSounds([...selectedSounds, sound]);
    }
  };

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
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event: DateTimePickerEvent, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDate(newDate);
    }
    setShowTimePicker(false);
  };

  // ✅ ADD REMINDER
  const handleAddReminder = async () => {
    if (!title) {
      alert("Enter title");
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Notifications.requestPermissionsAsync();
      finalStatus = newStatus;
    }

    if (finalStatus !== "granted") {
      alert("Permission not granted");
      return;
    }

    let trigger: any;
    if (repeat === "daily") {
      trigger = {
        type: "calendar",
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else if (repeat === "weekly") {
      trigger = {
        type: "calendar",
        weekday: date.getDay() + 1,
        hour: date.getHours(),
        minute: date.getMinutes(),
        repeats: true,
      };
    } else {
      trigger = { type: "date", date: date };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: { title, body: description },
      trigger,
    });

    const newReminder = {
      id: Date.now().toString(),
      title,
      description,
      date: date.toISOString(),
      repeat,
      sounds: selectedSounds, // ✅ MULTIPLE SAVED
      notificationId,
    };

    const stored = await AsyncStorage.getItem("reminders");
    const reminders = stored ? JSON.parse(stored) : [];
    reminders.push(newReminder);
    await AsyncStorage.setItem("reminders", JSON.stringify(reminders));

    alert("Reminder saved 🎉");
    router.back();
  };

  // 🔊 TEST SOUND
  const testSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/bell.mp3")
    );
    await sound.playAsync();
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
        {/* Hamburger */}
        <View style={{ position: "absolute", top: 60, left: 20, zIndex: 100 }}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{
              padding: 10,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 12,
            }}
          >
            <Text style={{ fontSize: 26, color: "white" }}>☰</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.header}>New Reminder</Text>

          <View style={styles.card}>
            <Text>Title</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter description"
            />

            <Text>Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
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

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={onChangeDate}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                onChange={onChangeTime}
              />
            )}

            <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Add</Text>
            </TouchableOpacity>

        {/* Repeat Modal */}
        {repeatPickerVisible && (
          <Modal transparent animationType="fade" visible={repeatPickerVisible}>
            <View style={modalStyles.modalOverlay}>
              <LinearGradient colors={["#2a8c82", "#d1913c"]} style={modalStyles.modalContent}>
                {repeatOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={modalStyles.optionBtn}
                    onPress={() => {
                      setRepeat(option);
                      setRepeatPickerVisible(false);
                    }}
                  >
                    <Text style={modalStyles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[modalStyles.optionBtn, { backgroundColor: "rgba(255,255,255,0.3)" }]}
                  onPress={() => setRepeatPickerVisible(false)}
                >
                  <Text style={[modalStyles.optionText, { color: "white" }]}>Cancel</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", paddingTop: 100 },
  header: { fontSize: 28, color: "white", marginBottom: 20, fontWeight: "bold" },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    padding: 20,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  textArea: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  pillButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    paddingHorizontal: 15,
    height: 40,
    marginTop: 5,
    alignSelf: "flex-start",
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
    backgroundColor: "#2f9e6f",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: "center",
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  option: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 