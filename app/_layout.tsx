import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" />
      <Drawer.Screen name="newReminder" />
    </Drawer>
  );
}
