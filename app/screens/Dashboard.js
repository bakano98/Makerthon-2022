// the Dashboard screen
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  ImageBackground,
  StyleSheet,
  Text,
  SafeAreaView,
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
  getTrend,
  toDict,
  displayModeMood,
} from "./Stats/DataProcessing";
import ProgressBar from "./Stats/ProgessBar";
import LineGraph from "./Stats/LineGraph";
import SwiperComponent from "./Stats/SwiperComponent";

// image is just a placeholder for now
const icons = require("../icons/icons.js");
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
  // Note that if we want to update anything related to the state, we have to directly call user_state.(dataType) = ....
  const moodState = useSelector((state) => state);
  const moodsData = moodState.data;

  const logPoints = moodState.logPoints;

  //parse data into a dictionary
  const dict = toDict(moodsData);
  const icons = require("../icons/icons");

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
      return <Image style={{ width: 24, height: 30 }} source={icons[x]} />;
    });
    return <View style={styles.legendContainer}>{result}</View>;
  };

  return (
    <ImageBackground source={icons["BG_pic"]} style={styles.image}>
      <ScrollView contentContainerStyle={{ justifyContent: "center" }}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressHeaderText}>This month's progress</Text>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {ProgressBar(dict)}
            <Text style={styles.pieText}>
              {Math.ceil(getProgress(dict) * 100)}%
            </Text>
          </View>
          <Text style={styles.progressText}>
            🔥  streak: ? days
            {/* To do streaks, we'll need to use context and pass it down */}
          </Text>
          <View style={{ flexDirection: "row", paddingLeft: 10 }}>
            <Image
              style={{ height: 25, width: 25 }}
              source={icons["noodals"]}
            />
            <Text style={styles.progressText}>Noodals: {logPoints}</Text>
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
          <Text style={styles.subheader}>Trend {getTrend(moodsData, 7)}</Text>
          {LineGraph(moodsData, 7)}
        </View>

        <View style={styles.subcontainer}>
          <View style={styles.moodContainer}>
            {displayModeMood(getModeMoodArray(moodsData, 5))}
          </View>
          <View style={{ flexDirection: "column", width: 280 }}>
            <Text style={styles.moodText}>
              {getModeMood(moodsData, 5).toUpperCase()}
            </Text>
            <Text style={styles.moodDescriptionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
              pharetra sapien erat, sed sagittis lacus varius eget.
            </Text>
          </View>
        </View>

        <Button
          title="Show data on console"
          onPress={() => console.log(dict)}
        />
        <Button title="Clear whole AsyncStorage" onPress={() => clearAll()} />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  subcontainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    marginStart: 10,
    marginEnd: 10,
    height: 150,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  subheader: {
    fontFamily: "Itim",
    fontSize: 20,
    color: "black",
    width: 400,
    marginStart: 80,
    marginEnd: 0,
    paddingBottom: 10,
  },
  text: {
    fontSize: 20,
    color: "black",
    height: 60,
    fontFamily: "Itim",
    //backgroundColor: '#f5f5f5',
    //borderRadius: 25,
    //padding: 10,
    marginStart: 25,
    marginEnd: 10,
    paddingTop: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },
  moodContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginTop: 70,
    marginStart: 20,
    height: 10,
  },

  pieContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
  },
  progressContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 10,
    justifyContent: "space-around",
    flexDirection: "column",
    flexWrap: "nowrap",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 40,
  },
  progressHeaderText: {
    fontSize: 28,
    fontFamily: "Itim",
    color: "black",
    height: 60,
    marginStart: 25,
    marginEnd: 10,
    paddingTop: 10,
    alignSelf: "center",
  },
  progressText: {
    fontSize: 20,
    fontFamily: "Itim",
    color: "black",
    height: 30,
    marginStart: 10,
  },
  pieText: {
    fontFamily: "Itim",
    fontSize: 18,
    padding: 10,
    paddingBottom: 10,
  },
  graphContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  circle: {
    height: 100,
    width: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: 100,
    overflow: "hidden",
    opacity: 1,
    justifyContent: "center",
    alignContent: "center",
    marginStart: 150,
    marginTop: 10,
    marginBottom: 10,
  },
  pointsText: {
    color: "black",
    fontSize: 40,
    padding: 0,
    paddingStart: 25,
    fontFamily: "Itim",
  },
  moodText: {
    fontSize: 28,
    color: "black",
    height: 40,
    marginTop: 20,
    marginStart: 20,
    marginEnd: 10,
    paddingTop: 0,
    paddingHorizontal: 7,
    borderRadius: 20,
    borderWidth: 2,
    alignSelf: "flex-start",
    fontFamily: "Itim",
  },
  moodDescriptionText: {
    fontSize: 12,
    color: "black",
    height: 60,
    fontFamily: "Itim",
    marginStart: 25,
    marginEnd: 10,
    paddingTop: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 340,
    height: 40,
  },
});

export default Dashboard;
