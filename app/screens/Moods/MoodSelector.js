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
// all_content is an array that contains the name of all possible themes.
// This is used to render out the names within a Picker.
const all_content = ["normal", "sunglasses", "moustache"];

// when adding themes, add to here (2)
// Each object is a possible theme that can be chosen
// Each theme contains the theme name, and the cost to unlock
const all_themes = [
  { name: "normal", theme: normal, pv_unlocked: "skin1_unlocked", cost: 0 },
  {
    name: "sunglasses",
    theme: sunglasses,
    pv_unlocked: "skin2_unlocked",
    pv_locked: "skin2_locked",
    cost: 10,
  },
  {
    name: "moustache",
    theme: moustache,
    pv_unlocked: "skin3_unlocked",
    pv_locked: "skin3_locked",
    cost: 10,
  },
];

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
  const Skin = ({ imageSrc, skinName, cost, themeObject }) => {
    const _onSkinPress = () => {
      if (content.some((x) => x === skinName)) {
        setSelectedValue(skinName);
      } else {
        customAlert(
          "Locked Skin",
          `Would you like to unlock the ${skinName} series for ${cost} Noodals?`,
          () => unlockSkin(themeObject),
          () => console.log("User denied")
        );
      }
    };

    return (
      <TouchableOpacity
        style={{
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => _onSkinPress()}
      >
        <Image style={styles.imageStyle} source={imageSrc} />
      </TouchableOpacity>
    );
  };

  const renderSkins = ({ item }) => {
    return (
      <Skin
        imageSrc={
          icons[
            content.some((x) => x === item.name)
              ? item.pv_unlocked
              : item.pv_locked
          ]
        }
        skinName={item.name}
        cost={item.cost}
        themeObject={item}
      />
    );
  };

  // The action to be taken when attempting to unlock a theme
  // Themes can only be unlocked if the user has sufficient logPoints.
  const unlockSkin = (themeObject) => {
    console.log(logPoints);
    console.log(themeObject);
    if (logPoints >= themeObject.cost) {
      spendPoints(themeObject.cost, themeObject.name);
      setContent([...content, themeObject.name]);
    } else {
      // console.log(themeObject);
      Alert.alert(
        "Insufficient points",
        "You do not have enough Noodals to unlock this series yet. Track your mood daily to earn points!"
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
      let curr = "";
      let modify = false;
      // if the key already exists, it means we are modifying a mood instead of adding
      addedMoods.some((x) => {
        if (x.key === item.key) {
          // so item already exists
          curr = x;
          modify = true;
        } else {
          modify = false;
        }
      });

      if (modify) {
        if (curr.moodValue !== moodValue) {
          // Only prompt the user if they're changing between moods
          // So if they're changing series but using the same mood, don't prompt
          customAlert(
            "Are you sure?",
            `Changing from ${curr.mood.split("_")[1]} to ${moodName}`,
            () => {
              modifyMoods(moodSrc, moodValue);
              navigation.goBack();
            },
            () => console.log("User was not sure")
          );
        } else {
          modifyMoods(moodSrc, moodValue);
          navigation.goBack();
        }
      } else {
        addMoods(moodSrc, moodValue);
        navigation.goBack();
      }
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
        <Text style={styles.itemText}>{moodName}</Text>
      </TouchableOpacity>
    );
  };

  // Uncomment only if we want user to see PV of the skins before deciding to unlock
  // Logic for a locked theme
  // const LockedItem = ({ imageSrc, moodName }) => {
  //   const _onPress = () => {
  //     customAlert(
  //       "Sorry!",
  //       `You do not have access to the ${selectedValue} series yet. Would you like to unlock it for ${themeObject.cost} points?`,
  //       () => unlockSkin(themeObject), // logic on accept. In the form of () => ....
  //       () => console.log("User declined") // logic on decline. In the form of () => ... || For this purpose, we can just do nothing if user does not want to unlock it.
  //     );
  //   };

  //   return (
  //     <TouchableOpacity
  //       style={{
  //         marginTop: 10,
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //       onPress={() => _onPress()}
  //     >
  //       <Image style={styles.imageStyle} source={imageSrc} />
  //       <Text style={[styles.itemText]}>{moodName}</Text>
  //     </TouchableOpacity>
  //   );
  // };

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

  // Uncomment only if we want users to see the PV before deciding whether they want to unlock the skin
  // // The actual rendering of each locked item
  // const renderLockedItem = ({ item }) => {
  //   return (
  //     <LockedItem
  //       imageSrc={icons[item.src]}
  //       moodName={item.title}
  //       moodSrc={item.src}
  //     />
  //   );
  // };

  // when adding themes, add to here (3)
  // We have to retrieve the correct object from all_themes, based on the selected theme.
  let themeObject = "";
  switch (selectedValue) {
    case "normal":
      themeObject = all_themes[0];
      break;
    case "sunglasses":
      themeObject = all_themes[1];
      break;
    case "moustache":
      themeObject = all_themes[2];
      break;
    default:
      themeObject = all_themes[0];
      break;
  }

  // console.log(themeObject);

  // Logs to check whether a user has access to a particular theme.
  /*if (content.some((x) => x === selectedValue)) {
    console.log("User has access to " + selectedValue);
  } else {
    console.log("User does not have access to " + selectedValue);
  }*/

  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <SafeAreaView style={{ marginBottom: 30 }}>
        <Text style={styles.text}>Select your mood!</Text>
      </SafeAreaView>
      <SafeAreaView style={{ flexDirection: "row", marginBottom: 20 }}>
        <Text style={[styles.text, styles.skinsText]}>Skins</Text>
        <SafeAreaView style={styles.noodalView}>
          <Text style={[styles.text, { marginRight: 10 }]}>{logPoints}</Text>
          <Image style={styles.noodalStyle} source={icons["noodals"]} />
        </SafeAreaView>
      </SafeAreaView>
      <SafeAreaView style={styles.skinsContainer}>
        <FlatList
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            marginBottom: 30,
          }}
          data={all_themes}
          numColumns={6}
          renderItem={renderSkins}
        />
      </SafeAreaView>
      <SafeAreaView style={styles.iconsContainer}>
        <FlatList
          contentContainerStyle={styles.flatListStyle}
          data={themeObject.theme}
          numColumns={4} // Render only 4 columns per row
          renderItem={
            // Uncomment only if we want to allow users to click on locked skins and see a preview
            // content.some((x) => x === selectedValue)
            //   ? renderItem
            //   : renderLockedItem
            renderItem
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

  text: {
    fontFamily: "Itim",
    fontSize: 32,
  },

  itemText: {
    fontFamily: "Itim",
    fontSize: 16,
  },

  iconsContainer: {
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    width: "90%",
    height: "30%",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  skinsContainer: {
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    width: "90%",
    height: "15%",
    borderRadius: 15,
    marginBottom: 70,
    backgroundColor: "#FBF8D6",
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

  noodalStyle: {
    height: 50,
    width: 40,
  },

  noodalView: {
    flex: 0.8,
    marginLeft: 100,
    flexDirection: "row",
    borderWidth: 2,
    height: "110%",
    color: "black",
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  skinsText: {
    top: 20,
    left: 10,
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
