import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { editReminder, getReminders } from "@/src/storage/reminders";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, Link } from "expo-router";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

export default function EditReminder() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const { id } = useLocalSearchParams();

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

  // Save edited reminder
  const saveEditedReminder = async () => {
    // if (!title) {
    //   alert("Please enter a title");
    //   return;
    //   }

    await editReminder(Number(id), {
      text: title,
      description,
      date: date.toISOString(),
    });

    router.back();

    if (date < new Date()) {
      alert("Please select a future date and time");
      return;
    }
  };

  // Load existing reminder data on mount
  useEffect(() => {
    const loadReminder = async () => {
      const reminders = await getReminders();
      const reminder = reminders.find((r: any) => r.id === Number(id));
      if (reminder) {
        setTitle(reminder.text || "");
        setDescription(reminder.description || "");
        setDate(reminder.date ? new Date(reminder.date) : new Date());
      }
    };

    loadReminder();
  }, []);

  //"HTML"
  return (
    <LinearGradient colors={["#2a8c82", "#d1913c"]} style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* page title */}
        <Text style={styles.title}>Edit Reminder</Text>

        <View style={styles.card}>
          {/* title field of the reminder */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* description field of the reminder */}
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={styles.inputDesc}
            value={description}
            onChangeText={setDescription}
          />

          {/* date selector for the reminder */}
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

          {/* cancel and edit buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.back()}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={saveEditedReminder}
            >
              <Text>Edit Reminder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

//"CSS"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 30,
    color: "white",
    marginBottom: 30,
  },
  card: {
    width: "85%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 25,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    height: 45,
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 15,
  },
  inputDesc: {
    height: 80,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
  },
  buttonContainer: {
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
