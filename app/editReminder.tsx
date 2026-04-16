import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { editReminder, getReminders } from "@/src/storage/reminders";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { handleDateTimeChange } from "@/src/utils/dateTimeHandler";

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

  // Save edited reminder
  const saveEditedReminder = async () => {
    if (date < new Date()) {
      alert("Please select a future date and time");
      return;
    }

    await editReminder(Number(id), {
      title,
      description,
      date: date.toISOString(),
    });

    router.back();
  };

  // Load existing reminder data on mount
  useEffect(() => {
    const loadReminder = async () => {
      const reminders = await getReminders();
      const reminder = reminders.find((r: any) => r.id === Number(id));
      if (reminder) {
        setTitle(reminder.title || "");
        setDescription(reminder.description || "");
        setDate(reminder.date ? new Date(reminder.date) : new Date());
      }
    };

    loadReminder();
  }, [id]);

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
              onChange={(event, selectedDate) =>
                handleDateTimeChange(
                  event,
                  selectedDate,
                  date,
                  mode,
                  setDate,
                  setShowPicker,
                  showMode,
                )
              }
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
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 34,
    color: "white",
    marginBottom: 30,
    fontWeight: "600",
  },
  card: {
    width: "88%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 30,
    padding: 25,
  },
  label: {
    marginTop: 15,
    marginBottom: 8,
    color: "#222",
  },
  input: {
    height: 50,
    backgroundColor: "#f1f1f1",
    borderRadius: 25,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  inputDesc: {
    height: 90,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
  },
  cancelBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addBtn: {
    width: "45%",
    height: 50,
    backgroundColor: "#2f9e6f",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
