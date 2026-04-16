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