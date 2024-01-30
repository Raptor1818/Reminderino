import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, StatusBar } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const addNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hello! 📬",
        body: 'This is your temporary notification.',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 }, // Notification will appear after 2 seconds
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Notification List */}
      <FlatList
        data={[]} // This will be your notifications array
        renderItem={({ item }) => (
          <Text style={styles.notificationText}>{item.title}</Text>
        )}
        keyExtractor={(item, index) => index.toString()}
        style={styles.list}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={addNotification}>
        <AntDesign name="pluscircle" size={50} color="#4CAF50" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: '100%',
  },
  notificationText: {
    color: '#E0E0E0', // Light grey color for text
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#424242', // Slightly lighter shade for list item separators
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
});

async function registerForPushNotificationsAsync() {
  console.log("CIS TA")
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
