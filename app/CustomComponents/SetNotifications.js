// Component that allows users to select a time for their daily notifications.
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Switch,
  Image,
} from "react-native";
import dailyContext from "../contexts/dailyContext";
import * as Notifications from "expo-notifications"; // REQUIRED. Need this for all things related to Notifications from Expo
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

// The keys for AsyncStorage
const TIME_KEY = "@time_key";
const NOTIFS_SWITCH_KEY = "@switch_key";

// Required by Expo. This tells Expo how to handle notifications.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Importing this to get access to all icons by their names
const icons = require("../icons/icons.js");

const SetNotifications = () => {
  // Define your time with hooks. We use this as the default time. This is a string used to display time only.
  const [time, setTime] = useState("12:00 PM");

  // Switch's hook
  const [toggle, setToggle] = useState(false);

  // Getting dailyContext
  // We use dailyContext in order to tell whether we should disable the notifications for today 
  // as we do not want to prompt the user to track their mood if it has already been tracked.
  const { done } = useContext(dailyContext);

  // <------------------------------------ DateTimePicker stuff ------------------------------------->
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  // Function to handle an onChange event, which is when the user picks and confirms the time.
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    // getting time and formatting it to the correct string
    let curr_hr =
      selectedDate.getHours() < 12
        ? selectedDate.getHours()
        : selectedDate.getHours() - 12;
    const curr_min =
      selectedDate.getMinutes() < 10
        ? "0" + selectedDate.getMinutes()
        : selectedDate.getMinutes();
    const AM_PM = selectedDate.getHours() >= 12 ? " PM" : " AM";
    if (curr_hr === 0) {
      curr_hr = 12;
    }
    const curr_time = curr_hr + ":" + curr_min + AM_PM;
    setTime(curr_time);
    cancelBeforeAndSchedule();
    if (!toggle) {
      setToggle(true);
    }
  };

  // Decides what to show. For our context, we only need to show the time picker
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode("time");
  };

  // <------------------------------------ DateTimePicker stuff end ------------------------------------->

  // <------------------------------------ Async Storage Stuff ------------------------------------->
  const saveTime = async () => {
    try {
      await AsyncStorage.setItem(TIME_KEY, JSON.stringify(time));
    } catch (e) {
      console.log(e);
    }
  };

  // Retrieving time
  const readTime = async () => {
    try {
      const getTime = await AsyncStorage.getItem(TIME_KEY);
      if (getTime !== null) {
        setTime(JSON.parse(getTime));
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  const saveToggle = async () => {
    try {
      await AsyncStorage.setItem(NOTIFS_SWITCH_KEY, JSON.stringify(toggle));
    } catch (e) {
      console.log(e);
    }
  };

  const readToggle = async () => {
    try {
      const getToggle = await AsyncStorage.getItem(NOTIFS_SWITCH_KEY);
      if (getToggle !== null) {
        setToggle(JSON.parse(getToggle));
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Clearing the AsyncStorage. Will be useful for next time when we have to use ONE key to manage an ARRAY OF OBJECTS
  // Not super useful for our context, but keeping it here for now
  /*
  const clearTime = async () => {
    try {
      await AsyncStorage.clear();
      alert("Storage cleared successfully");
    } catch (e) {
      alert("Failed to clear local storage");
    }
  };*/

  // <------------------------------------ AsyncStorage stuff end ------------------------------------->

  // <------------------------------------ Toggle stuff ------------------------------------->

  const toggleSwitch = () => {
    setToggle((prevState) => !prevState);
  };

  // <------------------------------------ Mounting stuff ------------------------------------->
  useEffect(() => {
    readTime();
    readToggle();
  }, []);

  // call this to ensure that time and scheduling is saved properly on first click
  useEffect(() => {
    // if notifications are turned on
    if (toggle && !done) {
      cancelBeforeAndSchedule();
    } else {
      // notifications are turned off, then cancel all notifs
      Notifications.cancelAllScheduledNotificationsAsync();
    }

    if (done) {
      Notifications.cancelAllScheduledNotificationsAsync();
    }

    saveTime();
    saveToggle();
  }, [time, toggle]);

  // <------------------------------------ Notifications logic  ------------------------------------->
  const split_time = time.split(":"); // split by ':', because the hour and minute are separated that way
  const AM_PM = split_time[1].split(" ")[1];
  const hrs = Number(split_time[0]);
  const mins = Number(split_time[1].split(" ")[0]);

  // Notifications logic. Because we're setting a repeated notification, we need to make sure we cancel all notifications
  // before scheduling a new one each day
  const cancelBeforeAndSchedule = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Moodal",
        body: "Remember to do your mood tracking for today!",
      },
      trigger: {
        hour: AM_PM === "PM" ? (hrs === 12 ? 12 : hrs + 12) : hrs, // converting to the correct 24h time, since Notifications does by hours
        minute: mins,
        repeats: true,
      },
    });
  };


  // If today's tracking has been done, then cancel all notifications.
  if (done) {
    console.log("Done, should not receive notifs");
    Notifications.cancelAllScheduledNotificationsAsync();
  }

  // remove comment if you want to do some debugging
  // console.log(time);
  return (
    <SafeAreaView>
      <SafeAreaView style={styles.touchableContainer}>
        <SafeAreaView style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 25,
              width: 25,
              tintColor: toggle ? "#ffbf00" : "#bcbcbc",
            }}
            source={icons["icon_notifs"]}
          />
          <Text style={[styles.text, { paddingLeft: 10 }]}>
            Notifications OFF/ON
          </Text>
        </SafeAreaView>

        <SafeAreaView style={{ flexDirection: "row", alignItems: "center" }}>
          <SafeAreaView
            style={[
              styles.smallContainer,
              { backgroundColor: toggle ? "#FFFFFF" : "#bcbcbc" },
            ]}
          >
            <TouchableOpacity onPress={() => showTimepicker()}>
              <Text style={styles.text}>{time}</Text>
            </TouchableOpacity>
          </SafeAreaView>
          <Switch onValueChange={toggleSwitch} value={toggle} />
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView>
        {
          show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          ) /* Can just ignore this entire thing. It's simply used to help open up the time picker*/
        }
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  touchableContainer: {
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    marginTop: 10,
    marginBottom: 20,
    height: 90,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  smallContainer: {
    bottom: 0,
    borderWidth: 2,
    borderRadius: 15,
    width: 100,
    borderColor: "black",
    elevation: 3,
  },

  text: {
    fontSize: 18,
    fontFamily: "Itim",
    textAlign: "center",
    color: "black",
  },
});

export default SetNotifications;
