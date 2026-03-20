import { View, Text, StyleSheet, ScrollView } from "react-native";
import { subscribeToActivities } from "../services/activityLogger";
import { useEffect, useState, useRef } from "react";

export default function ActivityFeed() {

  const [activities, setActivities] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {

    const unsubscribe = subscribeToActivities(setActivities);

    return unsubscribe;

  }, []);

  const getType = (message) => {
    if (message.includes("SOS") || message.includes("🚨")) return "danger";
    if (message.includes("error")) return "error";
    if (message.includes("started")) return "success";
    return "normal";
  };


  return (
    <ScrollView
      ref={scrollRef}
      style={styles.feed}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >


      <Text style={styles.title}>Live Activity</Text>

      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
        {activities.length === 0 ? (
          <Text style={styles.empty}>No activity yet</Text>
        ) : (
          activities.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))
        )}
      </ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#161616",
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    maxHeight: 180
  },

  title: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 10
  },

  feed: {
    maxHeight: 140
  },

  item: {
    marginBottom: 10
  },

  message: {
    color: "#ddd",
    fontSize: 13
  },

  time: {
    color: "#666",
    fontSize: 11
  },

  empty: {
    color: "#666",
    fontSize: 12
  }

});
