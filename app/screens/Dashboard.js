// the Dashboard screen
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import {
  ImageBackground,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  View,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getModeMood,
  getModeMoodArray,
  getProgress,
  getProgressAsFraction,
  toDict,
  displayModeMood,
} from "./Stats/DataProcessing";
import ProgressBar from "./Stats/ProgessBar";
import SwiperComponent from "./Stats/SwiperComponent";
import SwipeableLineGraph from "./Stats/SwipeableLineGraph";
import dailyContext from "../contexts/dailyContext";

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
    console.log(e);
  }

  console.log("Done.");
};

// navigation may be used later so we keep it here for now.
const Dashboard = () => {
  const { streak } = useContext(dailyContext);
  // Note that if we want to update anything related to the state, we have to directly call user_state.(dataType) = ....
  const moodState = useSelector((state) => state);
  const moodsData = moodState.data;

  const logPoints = moodState.logPoints;

  // console.log(streak);
  // parse data into a dictionary
  const dict = toDict(moodsData);
  const icons = require("../icons/icons");
  const progress = getProgressAsFraction(dict);

  const legend = () => {
    const mood = [
      "mood_okay",
      "mood_calm",
      "mood_happy",
      "mood_sad",
      "mood_stressed",
      "mood_anxious",
      "mood_angry",
    ];
    const result = mood.map((x) => {
      return (
        <Image
          style={{ width: 24, height: 30 }}
          source={icons[x]}
          key={mood[x]}
        />
      );
    });
    return <View style={styles.legendContainer}>{result}</View>;
  };

  const renderText = () => {
    switch (getModeMood(moodsData, 7)) {
      case "happy":
        return "You are living life positively! Remember these memories and days that bring you joy.";
      case "okay":
        return "No news is good news and the days move by quickly. Try something new if you need to spice up your week!";
      case "calm":
        return "As peace fills your soul, keep up the good work! Helping a friend or stranger when you are your best self may feel rewarding";
      case "sad":
        return "Everyone has bad days. Find the little things to be grateful for and give yourself time to feel better";
      case "stressed":
        return "Are there too many things on your plate right now? Make sure to take regular breaks!";
      case "anxious":
        return "What’s causing your worries? Write down your worries somewhere and remember to focus on the present";
      case "angry":
        return "Anger is a natural emotion. You may not always be able to change your environment, but you can control your reaction";
      case "mixed moods":
        return "You have been experiencing the ups and downs of life. Let the joy of the good days tide you through bad times";
      default:
        return "Start tracking today!";
    }
  };

  return (
    <ImageBackground source={icons["BG_pic"]} style={styles.image}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressHeaderText}>This month's progress</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {ProgressBar(dict)}
            <Text style={styles.progressBarText}>
              {progress[0]} / {progress[1]} days
              {"\n"}
              {Math.ceil(getProgress(dict) * 100)}%
            </Text>
          </View>
          <Text style={styles.progressText}>
            {streak === 0 ? "Start tracking today!" : "🔥 streak: " + streak}
          </Text>
          <View style={{ flexDirection: "row", paddingLeft: 10 }}>
            <Image
              style={{ height: 25, width: 25 }}
              source={icons["noodals"]}
            />
            <Text style={[styles.progressText, { right: 5, bottom: 2.5 }]}>
              Noodals: {logPoints}
            </Text>
          </View>
        </View>

        <View style={styles.pieContainer}>
          <Text style={styles.subheader}>Overview</Text>
          {legend()}
          <View style={{ height: 300, width: 330 }}>
            {SwiperComponent(dict)}
          </View>
        </View>

        <View style={styles.graphContainer}>
          <Text style={styles.subheader}>
            <Text style={styles.subheader}>Trend</Text>
            <Text style={styles.trendDescriptionText}>
              {"\n\n"}A graphical representation of your change in mood
            </Text>
          </Text>
          <View style={{ height: 340 }}>{SwipeableLineGraph(moodsData)}</View>
        </View>

        <View style={styles.subcontainer}>
          <View style={styles.moodContainer}>
            {displayModeMood(getModeMoodArray(moodsData, 7))}
          </View>
          <View style={{ width: 280, bottom: 10, alignItems: "center" }}>
            <Text style={styles.moodText}>
              {getModeMood(moodsData, 7).toUpperCase()}
            </Text>
            <Text style={styles.moodDescriptionText}>{renderText()}</Text>
          </View>
        </View>
        <Button title="Clear" onPress={() => clearAll()} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  subcontainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    flexDirection: "row",
    marginTop: 0,
    marginBottom: 10,
  },
  subheader: {
    fontSize: 28,
    fontFamily: "Itim",
    color: "black",
    marginStart: 10,
    marginEnd: 0,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  moodContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginStart: 20,
  },
  pieContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
  },
  progressContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 15,
    marginStart: 10,
    marginEnd: 10,
    marginTop: 40,
  },
  progressHeaderText: {
    fontSize: 28,
    marginBottom: 10,
    fontFamily: "Itim",
    color: "black",
    alignSelf: "center",
  },

  progressText: {
    fontSize: 20,
    fontFamily: "Itim",
    color: "black",
    height: 30,
    marginStart: 10,
  },
  progressBarText: {
    fontSize: 18,
    fontFamily: "Itim",
    color: "black",
    height: 60,
    marginStart: 10,
    textAlign: "center",
    padding: 10,
  },
  pieText: {
    fontFamily: "Itim",
    fontSize: 18,
    padding: 10,
    paddingBottom: 10,
  },

  graphContainer: {
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 10,
    margin: 10,
  },

  moodText: {
    fontSize: 26,
    color: "black",
    fontFamily: "Itim",
    height: 40,
    marginTop: 20,
    marginStart: 20,
    marginEnd: 10,
    paddingHorizontal: 7,
    borderRadius: 15,
    borderWidth: 2,
    alignSelf: "flex-start",
  },

  moodDescriptionText: {
    fontSize: 15,
    fontFamily: "Itim",
    color: "black",
    paddingLeft: 20,
    paddingRight: 50,
    paddingTop: 10,
  },

  trendDescriptionText: {
    fontSize: 15,
    color: "black",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 340,
    height: 40,
  },
});

export default Dashboard;
