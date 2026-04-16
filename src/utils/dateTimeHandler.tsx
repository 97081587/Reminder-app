import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

// Handle date/time change
export const handleDateTimeChange = (
  event: DateTimePickerEvent,
  selectedDate?: Date,
  date: Date,
  mode: "date" | "time",
  setDate: (date: Date) => void,
  setShowPicker: (show: boolean) => void,
  showMode: (mode: "date" | "time") => void,
) => {
  
  // Open picker
  // const showMode = (currentMode: "date" | "time") => {
  //   setMode(currentMode);
  //   setShowPicker(true);
  // };

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
