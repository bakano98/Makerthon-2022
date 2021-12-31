import React from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const icons = require("../icons/icons.js");

const slides = [
  {
    key: 1,
    text: "Welcome to Moodal! This is where you can keep track of your mood with the Moodals",
    image: icons["tut1"],
    style: {
      width: "70%",
      height: "50%",
      resizeMode: "contain",
    },
    backgroundColor: "#fbf8d6",
  },
  {
    key: 2,
    text: "This is a quick button you can use in to quickly add to today's mood",
    image: icons["tut2"],
    style: { width: "35%", height: "50%", resizeMode: "contain" },
    backgroundColor: "#fbf8d6",
  },
  {
    key: 3,
    text: "Earn Noodals by logging your mood daily\nExchange them for different Moodals!",
    image: icons["tut3"],
    style: { width: "50%", height: "50%", resizeMode: "contain" },
    backgroundColor: "#fbf8d6",
  },
  {
    key: 4,
    text: "Our services & resources page can get you help in times of need",
    image: icons["tut4"],
    style: { width: "70%", height: "50%", resizeMode: "contain" },
    backgroundColor: "#fbf8d6",
  },
  {
    key: 5,
    text: "View your progress on the dashboard",
    image: icons["tut5"],
    style: { width: "50%", height: "50%", resizeMode: "contain" },
    backgroundColor: "#fbf8d6",
  },
  {
    key: 6,
    text: "Let's start logging!",
    backgroundColor: "#fbf8d6",
  },
];

const doneButton = () => {
  return <Text style={styles.buttonText}>Done</Text>;
};

const nextButton = () => {
  return <Text style={styles.buttonText}>Next</Text>;
};

const Intro = (props) => {
  const _renderItem = ({ item }) => {
    if (item.key === 6) {
      return (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
          <TouchableOpacity onPress={() => props.setDone(true)}>
            <Text style={[styles.title, { fontSize: 36 }]}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <Image style={item.style} source={item.image} />
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  return (
    <AppIntroSlider
      renderItem={_renderItem}
      data={slides}
      onDone={() => props.setDone(true)}
      renderNextButton={nextButton}
      renderDoneButton={doneButton}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Itim",
    fontSize: 32,
  },

  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },

  text: {
    fontSize: 24,
    textAlign: "left",
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Itim",
  },

  buttonText: {
    paddingTop: 10,
    paddingRight: 20,
    fontSize: 20,
    fontFamily: "Itim",
    color: "black",
  },
});

export default Intro;
