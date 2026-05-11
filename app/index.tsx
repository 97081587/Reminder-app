import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  router,
  useFocusEffect,
} from "expo-router";
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

  // LOAD REMINDERS
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

  // DELETE REMINDER
  const handleDelete = async (
    id: string | number
  ) => {
    try {
      const stored = await AsyncStorage.getItem(
        "reminders"
      );

      const remindersData: Reminder[] = stored
        ? JSON.parse(stored)
        : [];

      const updated = remindersData.filter(
        (item) => item.id !== id
      );

      await AsyncStorage.setItem(
        "reminders",
        JSON.stringify(updated)
      );

      setReminders(updated);
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // REFRESH SCREEN
  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

  // REMINDER CARD
  const ReminderCard = ({
    item,
  }: {
    item: Reminder;
  }) => {
    return (
      <View style={styles.card}>
        {/* TITLE */}
        <Text style={styles.cardTitle}>
          {item.title}
        </Text>

        {/* DESCRIPTION */}
        <Text style={styles.cardDescription}>
          {item.description}
        </Text>

        {/* ACTIONS */}
        <View style={styles.actions}>
          {/* DELETE */}
          <TouchableOpacity
            onPress={() =>
              handleDelete(item.id)
            }
          >
            <Text style={styles.icon}>
              🗑️
            </Text>
          </TouchableOpacity>

          {/* EDIT */}
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/editReminder?id=${item.id}`
              )
            }
          >
            <Text style={styles.icon}>
              ✏️
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#2a8c82", "#d1913c"]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() =>
              setMenuOpen(!menuOpen)
            }
          >
            <Text style={styles.menuIcon}>
              {menuOpen ? "✕" : "☰"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.heading}>
            Reminders
          </Text>
        </View>

        {/* SIDEBAR MENU */}
        {menuOpen && (
          <View style={styles.sidebar}>
            <Text style={styles.sidebarTitle}>
              Menu
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>
                📝 Past Reminders
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>
                🗑️ Trash Bin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>
                ⚙️ Settings
              </Text>
            </TouchableOpacity>

            <Text style={styles.version}>
              v1.0.0
            </Text>
          </View>
        )}

        {/* MAIN CONTENT */}
        <View
          style={[
            styles.content,
            menuOpen && {
              marginLeft: width * 0.65,
            },
          ]}
        >
          {/* REMINDER LIST */}
          <FlatList
            data={reminders}
            keyExtractor={(item) =>
              item.id.toString()
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContainer
            }
            renderItem={({ item }) => (
              <ReminderCard item={item} />
            )}
          />

          {/* ADD BUTTON */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              router.push("/newReminder")
            }
          >
            <Text style={styles.plus}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  /* TOP BAR */
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
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

  /* SIDEBAR */
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    width: width * 0.65,
    height: "100%",
    backgroundColor:
      "rgba(255,255,255,0.15)",
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
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

  version: {
    position: "absolute",
    bottom: 30,
    left: 20,
    color: "#fff",
    opacity: 0.7,
  },

  /* CONTENT */
  content: {
    flex: 1,
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  /* CARD */
  card: {
    width: "100%",
    backgroundColor:
      "rgba(255,255,255,0.25)",
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
    elevation: 5,
  },

  plus: {
    fontSize: 42,
    color: "#d1913c",
    marginTop: -4,
  },
});