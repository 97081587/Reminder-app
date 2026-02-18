import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "REMINDERS";

export const loadReminders = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReminders = async (reminders: any[]) => {
  await AsyncStorage.setItem(KEY, JSON.stringify(reminders));
};
