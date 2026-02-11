import { View, Text, Button } from "react-native";
import { useNotifications } from "../hook/useNotifications";

export default function HomeScreen() {

  const { scheduleReminder } = useNotifications();

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      <Text>Welcome</Text>

      <Button
        title="Test Notification (5s)"
        onPress={() => scheduleReminder("Hello! this is your reminder", 5)}
      />
    </View>
  );
}


