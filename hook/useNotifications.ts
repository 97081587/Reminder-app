import * as Notifications from "expo-notifications";
import { Platform } from "react-native";


// make notification show while app open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export function useNotifications() {

  // ask user permission
  async function requestPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission needed to send reminders!");
      return false;
    }
    return true;
  }

  // schedule reminder
  async function scheduleReminder(text: string, seconds: number) {
    const granted = await requestPermission();
    if (!granted) return;
  
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder ⏰",
        body: text,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
        repeats: false,
      },
    });
  }

  // edit reminder by canceling old and scheduling new
  async function editReminder(
    oldNotficationId: string,
    newText: string,
    newSeconds: number 
  ) {
    // remove old notification
    await Notifications.cancelScheduledNotificationAsync(
      oldNotficationId
    );

    // create new notification
    const newNotificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder ⏰",
        body: newText,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: newSeconds,
        repeats: false,
      },
    });
  }
}