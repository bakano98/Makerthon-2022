import React, { useState, useEffect } from "react";
import { Image, Text, LogBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

LogBox.ignoreAllLogs(true); // enable this when debugging

// Navigation stuff
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Redux stuff
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store as moodStore, persistor } from "./redux/mood/store";
import store from "./redux/questionnaire/store";

// local imports
import dailyContext from "./contexts/dailyContext";
import contentContext from "./contexts/contentContext";

import {
  About,
  Dashboard,
  Mood,
  MoodSelector,
  ResourcesMain,
  Services,
  Helplines,
  Callback,
  Settings,
  Questionnaire,
  FormDetails,
  PFAScreen
} from "./screens";

const icons = require("./icons/icons.js"); // use icons['name'] to get the icon!

// Function that takes a route and returns a screen name
const setNameFromRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  // Takes a route name and returns a different name
  switch (routeName) {
    case "Resources":
      return "Resources";
    case "Dashboard":
      return "Dashboard";
    case "SettingsStack":
      return "Settings";
  }
};

// we make all the Navigation Screens in App for easy referencing
const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

const CONTENT_KEY = "@content_key";
// contains the mood stuff
const SubMoodStack = () => {
  const [content, setContent] = useState(["normal"]);

  const saveContent = async () => {
    try {
      await AsyncStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    } catch (e) {}
  };

  const readContent = async () => {
    try {
      const res = await AsyncStorage.getItem(CONTENT_KEY);
      if (res !== null) {
        setContent(JSON.parse(res));
      }
    } catch (e) {}
  };

  useEffect(() => {
    readContent();
  }, []);

  useEffect(() => {
    saveContent();
  }, [content]);

  return (
    <contentContext.Provider value={{ content, setContent }}>
      <Stack.Navigator>
        <Stack.Screen
          component={Mood}
          name="Mood"
          options={{ title: "My Moodal", headerShown: false }}
        />
        <Stack.Screen
          component={MoodSelector}
          name="MoodSelector"
          options={{ title: "Select mood", headerShown: false }}
        />
      </Stack.Navigator>
    </contentContext.Provider>
  );
};

// contains all the resources stuff. Add exercises, face massage, etc...
const Resources = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ResourcesMain}
        name="ResourcesMain"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// contains all the Services stuff
const ServicesStack = () => {
  return (
    <Stack.Navigator initialRouteName="ServicesScreen">
      <Stack.Screen
        component={Services}
        name="Services"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Helplines}
        name="Helplines"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={Callback}
        name="Callback"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const DAILY_KEY = "@daily_key";
// Entire thing is wrapped with mood store, so Dashboard can have access to the mood object
// Furthermore, we also pass down a dailyContext which tells us whether today's mood has been inputted.
// If it has, the value is set to true, which will then set out initialRoute to Dashboard.
// In order to ensure that the value is still true upon app restart on the same day, we have to store this in AsyncStorage, and fetch it.
const Bottoms = () => {
  const [done, setDone] = useState(false);
  const [todayMood, setTodayMood] = useState(false);
  const [loading, setLoading] = useState(true);
  let [fontsLoaded] = useFonts({
    Itim: require("./assets/fonts/Itim.ttf"),
  });

  const saveDone = async () => {
    try {
      await AsyncStorage.setItem(DAILY_KEY, JSON.stringify(done));
    } catch (e) {}
  };

  const readDone = async () => {
    try {
      const res = await AsyncStorage.getItem(DAILY_KEY);
      if (res !== null) {
        setDone(JSON.parse(res));
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    readDone();
  }, []);

  useEffect(() => {
    saveDone();
  }, [done]);

  // console.log("From app: " + done);
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  if (loading) {
    // just a dummy. Set a loading screen so that nothing is rendered while fetching from AsyncStorage
    // This step can take quite long depending on the user's device (I guess), so best to have a loading page.
    return <AppLoading />;
  } else {
    return (
      <Provider store={moodStore}>
        <PersistGate loading={null} persistor={persistor}>
          <dailyContext.Provider
            value={{ done, setDone, todayMood, setTodayMood }}
          >
            <BottomTabs.Navigator
              // initialRouteName={done ? "Dashboard" : "SubMoodStack"}
              screenOptions={{ tabBarStyle: { backgroundColor: "white" } }}
            >
              <BottomTabs.Screen
                component={Resources}
                name="Resources"
                options={screenStyles.resourcesOptions}
              />
              <BottomTabs.Screen
                component={SubMoodStack}
                name="SubMoodStack"
                options={screenStyles.subMoodOptions}
              />
              <BottomTabs.Screen
                component={Dashboard}
                name="Dashboard"
                options={screenStyles.dashboardOptions}
              />
              <BottomTabs.Screen
                component={ServicesStack}
                name="ServicesStack"
                options={screenStyles.servicesOptions}
              />
              <BottomTabs.Screen
                component={Settings}
                name="Settings"
                options={screenStyles.settingsOptions}
              />
            </BottomTabs.Navigator>
          </dailyContext.Provider>
        </PersistGate>
      </Provider>
    );
  }
};


// Render the entire thing
// QuestionnaireStack and About should not have bottom tabs. So for anything that should not have bottom tabs, add to here.
const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          barStyle={{ backgroundColor: "#694fad" }}
          screenOptions={{ headerShown: false, animationEnabled: false }}
        >
          <Stack.Screen
            component={Bottoms}
            name="Bottoms"
            options={({ route }) => ({
              title: setNameFromRouteName(route),
              headerShown: false,
            })}
          />
          <Stack.Screen
            component={Questionnaire}
            name="Questionnaire"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            component={About}
            name="About"
            options={{ headerShown: true, title: "About Us" }}
          />
          <Stack.Screen
            component={FormDetails}
            name="FormDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={PFAScreen}
            name="PFAScreen"
            options={{headerShown: true}} // change to false next time
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

// all the screen styles' options
const screenStyles = {
  resourcesOptions: {
    headerShown: false,
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Itim",
            color: focused ? "#e09000" : "grey",
          }}
        >
          Resources
        </Text>
      );
    },
    unmountOnBlur: true,
    tabBarIcon: ({ size, focused, color }) => {
      return (
        <Image
          style={{
            width: size,
            height: size,
            tintColor: focused ? "#ffbf00" : "#bcbcbc",
          }}
          source={icons["resources"]}
        />
      );
    },
  },

  subMoodOptions: {
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Itim",
            color: focused ? "#e09000" : "grey",
          }}
        >
          My Moodal
        </Text>
      );
    },
    headerShown: false,
    tabBarIcon: ({ size, focused, color }) => {
      return (
        <Image
          style={{
            width: size,
            height: size,
            tintColor: focused ? "#ffbf00" : "#bcbcbc",
          }}
          source={icons["moodscreen"]}
        />
      );
    },
  },

  dashboardOptions: {
    unmountOnBlur: true,
    headerShown: false,
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Itim",
            color: focused ? "#e09000" : "grey",
          }}
        >
          Dashboard
        </Text>
      );
    },
    tabBarIcon: ({ size, focused, color }) => {
      return (
        <Image
          style={{
            width: size,
            height: size,
            tintColor: focused ? "#ffbf00" : "#bcbcbc",
          }}
          source={icons["dashboard"]}
        />
      );
    },
  },

  servicesOptions: {
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Itim",
            color: focused ? "#e09000" : "grey",
          }}
        >
          Services
        </Text>
      );
    },
    unmountOnBlur: true,
    headerShown: false,
    tabBarIcon: ({ size, focused, color }) => {
      return (
        <Image
          style={{
            width: size,
            height: size,
            tintColor: focused ? "#ffbf00" : "#bcbcbc",
          }}
          source={icons["services"]}
        />
      );
    },
  },

  settingsOptions: {
    tabBarLabel: ({ focused, color }) => {
      return (
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Itim",
            color: focused ? "#e09000" : "grey",
          }}
        >
          Settings
        </Text>
      );
    },
    unmountOnBlur: true,
    headerShown: false,
    tabBarIcon: ({ size, focused, color }) => {
      return (
        <Image
          style={{
            width: size,
            height: size,
            tintColor: focused ? "#ffbf00" : "#bcbcbc",
          }}
          source={icons["settings"]}
        />
      );
    },
  },
};

export default App;
