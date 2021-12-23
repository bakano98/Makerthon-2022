import React, { useState, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  Button,
  Alert,
  Picker,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_MOOD,
  MODIFY_MOOD,
  SPEND_POINTS,
} from "../../redux/mood/moodReducer"; // action takes place here, so import
import contentContext from "../../contexts/contentContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useIsFocused } from "@react-navigation/native";

const icons = require("../../icons/icons.js");

const normal = [
  { id: "0", title: "happy", src: "mood_happy" },
  { id: "1", title: "okay", src: "mood_okay" },
  { id: "2", title: "calm", src: "mood_calm" },
  { id: "3", title: "sad", src: "mood_sad" },
  { id: "4", title: "stressed", src: "mood_stressed" },
  { id: "5", title: "angry", src: "mood_angry" },
  { id: "6", title: "anxious", src: "mood_anxious" },
];

const sunglasses = [
  { id: "0_sunglasses", title: "happy", src: "mood_happy_sunglasses" },
  { id: "1_sunglasses", title: "okay", src: "mood_okay_sunglasses" },
  { id: "2_sunglasses", title: "calm", src: "mood_calm_sunglasses" },
  { id: "3_sunglasses", title: "sad", src: "mood_sad_sunglasses" },
  { id: "4_sunglasses", title: "stressed", src: "mood_stressed_sunglasses" },
  { id: "5_sunglasses", title: "angry", src: "mood_angry_sunglasses" },
  { id: "6_sunglasses", title: "anxious", src: "mood_anxious_sunglasses" },
];

const moustache = [
  { id: "0_moustache", title: "happy", src: "mood_happy_moustache" },
  { id: "1_moustache", title: "okay", src: "mood_okay_moustache" },
  { id: "2_moustache", title: "calm", src: "mood_calm_moustache" },
  { id: "3_moustache", title: "sad", src: "mood_sad_moustache" },
  { id: "4_moustache", title: "stressed", src: "mood_stressed_moustache" },
  { id: "5_moustache", title: "angry", src: "mood_angry_moustache" },
  { id: "6_moustache", title: "anxious", src: "mood_anxious_moustache" },
];

// when adding themes, add to here (0) --> add array of objects

// when adding themes, add to here (1)
// possible_themes is an object of objects
// Each object is a possible theme that can be chosen
// Each theme contains the theme name, and the cost to unlock
const possible_themes = {
  normal: {
    theme: normal,
    cost: 0,
  },
  sunglasses: {
    theme: sunglasses,
    cost: 10,
  },
  moustache: {
    theme: moustache,
    cost: 10,
  },
};

const all_themes = [
  { name: "normal", theme: normal, pv: "skin1_unlocked", cost: 0 },
  { name: "sunglasses", theme: sunglasses, pv: "skin2_unlocked", cost: 10 },
  { name: "moustache", theme: moustache, pv: "skin3_unlocked", cost: 10 },
];

// when adding themes, add to here (2)
// all_content is an array that contains the name of all possible themes.
// This is used to render out the names within a Picker.
const all_content = ["normal", "sunglasses", "moustache"];

// Customisable alert
const customAlert = (title, msg, accept, decline) => {
  Alert.alert(title, msg, [
    {
      text: "No",
      onPress: decline,
      style: "cancel",
    },
    {
      text: "Yes!",
      onPress: accept,
      style: "default",
    },
  ]);
};

const SELECTION_KEY = "@selection_key";
const MoodSelector = ({ navigation, route }) => {
  // content is the list of themes that we have unlocked
  const { content, setContent } = useContext(contentContext);
  const [selectedValue, setSelectedValue] = useState("normal"); // default state.
  const { item } = route.params;
  const user_state = useSelector((state) => state);
  const addedMoods = user_state.data; // get the array of added moods, aka our state array
  const logPoints = user_state.logPoints;
  // just store the content, additional icons as an array, and just read from the array if we want to check if user has access to it

  const isFocused = useIsFocused();
  // This is to ensure that persistentItem in Moods will always have a reference to the current day.
  if (!isFocused) {
    navigation.goBack();
  }

  const dispatch = useDispatch();

  // AsyncStorage to remember the last selected series. For better UX, so user does not need to constantly choose a series that is not default.
  const storeSelected = async () => {
    try {
      await AsyncStorage.setItem(SELECTION_KEY, JSON.stringify(selectedValue));
    } catch (e) {
      console.log("Store selected failed: " + e);
    }
  };

  const readSelected = async () => {
    try {
      const res = await AsyncStorage.getItem(SELECTION_KEY);
      if (res !== null) {
        setSelectedValue(JSON.parse(res));
      }
    } catch (e) {
      console.log("Read selected failed: " + e);
    }
  };

  useEffect(() => {
    readSelected();
  }, []);

  useEffect(() => {
    storeSelected();
  }, [selectedValue]);

  // console.log(theme);
  // Actions. Item to be passed down to Reducer. actualMood is "src".
  const addMoods = (mood, moodValue) =>
    dispatch({
      type: ADD_MOOD,
      payload: { mood: mood, moodValue: moodValue, item: item },
    });
  const modifyMoods = (mood, moodValue) => {
    dispatch({
      type: MODIFY_MOOD,
      payload: { mood: mood, moodValue: moodValue, item: item },
    });
  };

  const spendPoints = (pointsToSpend, seriesName) => {
    dispatch({
      type: SPEND_POINTS,
      payload: { pointsToSpend: pointsToSpend, seriesName: seriesName },
    });
  };

  // console.log(content);

  // The action to be taken when attempting to unlock a theme
  // Themes can only be unlocked if the user has sufficient logPoints.
  const unlockTheme = (themeObject) => {
    if (logPoints >= themeObject.cost) {
      spendPoints(themeObject.cost, selectedValue);
      setContent([...content, selectedValue]);
    } else {
      console.log(themeObject);
      Alert.alert(
        "Insufficient points",
        "You do not have enough points to unlock this series yet. Track your mood daily to earn points!"
      );
    }
  };

  // Logic for an unlocked theme.
  const Item = ({ imageSrc, moodName, moodSrc }) => {
    // Logic for what to do when a mood is selected
    const _onPress = () => {
      // Determine the "value" based on the moodName
      // moodValue is just an integer indicator to make things simpler for comparison.
      let moodValue = 0;
      switch (moodName) {
        case "happy":
          moodValue = 1;
          break;
        case "okay":
          moodValue = 2;
          break;
        case "calm":
          moodValue = 3;
          break;
        case "sad":
          moodValue = 4;
          break;
        case "stressed":
          moodValue = 5;
          break;
        case "angry":
          moodValue = 6;
          break;
        case "anxious":
          moodValue = 7;
          break;
      }
      // if the key already exists, it means we are modifying a mood instead of adding
      addedMoods.some((x) => x.key === item.key)
        ? modifyMoods(moodSrc, moodValue)
        : addMoods(moodSrc, moodValue);
      navigation.goBack();
    };

    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => _onPress()}
      >
        <Image style={styles.imageStyle} source={imageSrc} />
        <Text>{moodName}</Text>
      </TouchableOpacity>
    );
  };

  // Logic for a locked theme
  const LockedItem = ({ imageSrc, moodName }) => {
    const _onPress = () => {
      customAlert(
        "Sorry!",
        `You do not have access to the ${selectedValue} series yet. Would you like to unlock it for ${themeObject.cost} points?`,
        () => unlockTheme(themeObject), // logic on accept. In the form of () => ....
        () => console.log("User declined") // logic on decline. In the form of () => ... || For this purpose, we can just do nothing if user does not want to unlock it.
      );
    };

    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => _onPress()}
      >
        <ImageBackground style={styles.imageStyle} source={imageSrc}>
          <Image
            style={{
              height: 31.25,
              width: 25,
              opacity: 1,
              position: "absolute",
              marginLeft: 12,
              marginTop: 20,
              // backgroundColor: "hsl(360, 100%, 100%)",
            }}
            source={icons["lock"]}
          />
        </ImageBackground>
        <Text>{moodName}</Text>
      </TouchableOpacity>
    );
  };

  // The actual rendering of each item
  const renderItem = ({ item }) => {
    return (
      <Item
        imageSrc={icons[item.src]}
        moodName={item.title}
        moodSrc={item.src}
      />
    );
  };

  // The actual rendering of each locked item
  const renderLockedItem = ({ item }) => {
    return (
      <LockedItem
        imageSrc={icons[item.src]}
        moodName={item.title}
        moodSrc={item.src}
      />
    );
  };

  // Rendering the items within the picker. Picker is used to select the themes
  const renderPicker = all_content.map((item) => {
    return <Picker.Item value={item} label={item} />;
  });

  // when adding themes, add to here (3)
  // We have to retrieve the correct object from possible_themes, based on the selected theme.
  let themeObject = "";
  switch (selectedValue) {
    case "normal":
      themeObject = possible_themes.normal;
      break;
    case "sunglasses":
      themeObject = possible_themes.sunglasses;
      break;
    case "moustache":
      themeObject = possible_themes.moustache;
      break;
    default:
      themeObject = possible_themes.normal;
      break;
  }

  // Logs to check whether a user has access to a particular theme.
  /*if (content.some((x) => x === selectedValue)) {
    console.log("User has access to " + selectedValue);
  } else {
    console.log("User does not have access to " + selectedValue);
  }*/

  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <SafeAreaView
        style={{
          backgroundColor: "white",
        }}
      >
        <Picker
          style={{ height: 25, width: 150, alignItems: "center" }}
          selectedValue={selectedValue}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          {renderPicker}
        </Picker>
      </SafeAreaView>
      <SafeAreaView style={styles.headerView}>
        <Text style={{ fontSize: 24, marginBottom: 10 }}>
          Select your mood!
        </Text>
        <Image
          style={styles.headerImageStyle}
          source={icons[themeObject.theme[0].src]}
        />
      </SafeAreaView>

      <SafeAreaView style={styles.iconsContainer}>
        <FlatList
          contentContainerStyle={styles.flatListStyle}
          data={themeObject.theme}
          numColumns={4} // Render only 4 columns per row
          renderItem={
            content.some((x) => x === selectedValue)
              ? renderItem
              : renderLockedItem
          }
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  iconsContainer: {
    // position: "absolute",
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    width: "90%",
    height: "30%",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    marginTop: 100,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  flatListStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  moodStyle: {
    flexDirection: "row",
    margin: 10,
  },

  moodSplit: {
    justifyContent: "center",
    alignItems: "center",
  },

  imageStyle: {
    // Height to width ratio is 1.25 : 1
    height: 62.5,
    width: 50,
    marginLeft: 10,
    marginRight: 10,
  },

  headerView: {
    position: "absolute",
    top: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  headerImageStyle: {
    height: 150,
    width: 120,
  },
});

export default MoodSelector;
