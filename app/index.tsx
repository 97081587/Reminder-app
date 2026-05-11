import React, { useState, useCallback } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type Reminder = {
  id: string | number;
  title?: string;
  description?: string;
};

export default function Home() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  // LOAD
  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem("reminders");

      if (stored) {
        setReminders(JSON.parse(stored));
      } else {
        setReminders([]);
      }
    } catch (error) {
      console.log("Error loading reminders:", error);
    }
  };

  // DELETE
  const handleDelete = async (id: string | number) => {
    const stored = await AsyncStorage.getItem("reminders");
    const data: Reminder[] = stored ? JSON.parse(stored) : [];

    const updated = data.filter((item) => item.id !== id);

    await AsyncStorage.setItem(
      "reminders",
      JSON.stringify(updated)
    );

    setReminders(updated);
  };

  // REFRESH
  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  // CARD
  const ReminderCard = ({ item }: { item: Reminder }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title}</Text>

        <Text style={styles.cardDescription}>
          {item.description}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.icon}>🗑️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push(`/editReminder?id=${item.id}`)
            }
          >
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#2a8c82", "#d1913c"]}
      style={styles.container}
    >
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setMenuOpen((p) => !p)}
        >
          <Text style={styles.menuIcon}>
            {menuOpen ? "✕" : "☰"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.heading}>
          Reminders
        </Text>
      </View>

      {/* OVERLAY MENU */}
      {menuOpen && (
        <View style={styles.overlay}>
          {/* BACKDROP */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setMenuOpen(false)}
          />

          {/* SIDEBAR */}
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>
              Menu
            </Text>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>
                📝 Past Reminders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>
                🗑️ Trash Bin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>
                ⚙️ Settings
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ReminderCard item={item} />
          )}
        />

        {/* ADD BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/newReminder")}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  menuIcon: {
    fontSize: 32,
    color: "#fff",
    marginRight: 20,
  },

  heading: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
  },

  content: {
    flex: 1,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    paddingTop: 20,
  },

  /* CARD */
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  cardDescription: {
    fontSize: 15,
    color: "#f5f5f5",
    lineHeight: 22,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 15,
  },

  icon: {
    fontSize: 22,
    marginLeft: 15,
  },

  /* ADD BUTTON */
  addButton: {
    position: "absolute",
    bottom: 40,
    right: 25,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    fontSize: 40,
    color: "#d1913c",
  },

  /* OVERLAY */
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
  },

  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width * 0.7,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingTop: 100,
    paddingHorizontal: 20,
  },

  sidebarTitle: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 30,
  },

  menuItem: {
    marginBottom: 25,
  },

  menuText: {
    fontSize: 18,
    color: "#fff",
  },
});
