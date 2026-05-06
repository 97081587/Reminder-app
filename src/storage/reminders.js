// storage/reminders.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "reminders";

// Get all reminders
export const getReminders = async () => {
  try {
    const json = await AsyncStorage.getItem(KEY);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.log("Error loading reminders", e);
    return [];
  }
};

// Save full list of reminders
export const saveReminders = async (reminders) => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(reminders));
  } catch (e) {
    console.log("Error saving reminders", e);
  }
};

// Add a new reminder
export const addReminder = async (reminder) => {
  const reminders = await getReminders();

  const newReminder = {
    id: Date.now(),
    title: reminder.title,
    description: reminder.description || "",
    date: reminder.date,
  };

  const updated = [...reminders, newReminder];
  await saveReminders(updated);

  return updated;
};  

// Delete a reminder
export const deleteReminder = async (id) => {
  const reminders = await getReminders();
  const updated = reminders.filter((r) => r.id !== id);
  await saveReminders(updated);
  return updated;
};

// Toggle done/not done
export const toggleReminder = async (id) => {
  const reminders = await getReminders();
  const updated = reminders.map((r) =>
    r.id === id ? { ...r, done: !r.done } : r
  );
  await saveReminders(updated);
  return updated;
};

// Edit reminder text
export const editReminder = async (id: number, updatedFields: any) => {
  const stored = await AsyncStorage.getItem("reminders");
  const reminders = stored ? JSON.parse(stored) : [];

  const updated = reminders.map((r: any) =>
    r.id === id ? { ...r, ...updatedFields } : r
  );

  await saveReminders(updated);
  return updated;
};
