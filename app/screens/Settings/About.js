import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

const icons = require("../../icons/icons.js");

const About = () => {
  return (
    <ImageBackground
      style={{ flex: 1, height: "100%", width: "100%" }}
      source={icons["BG_pic"]}
    >
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          marginLeft: 10,
        }}
      >
        <Image
          style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          source={icons["group_pic"]}
        />
      </SafeAreaView>
      <SafeAreaView style={{ flex: 1 }}>
        <Text style={styles.text}>
          The Moodal Masters are 4 students from 4 different faculties of NUS
          who came together for the NUS Makerthon 2022. We made Moodal in the
          winter break of AY21/22 in hopes of helping students get barrier-free
          access to mental health services.
        </Text>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  text: {
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: "left",
    fontFamily: "Itim",
    fontSize: 22,
    color: "black",
  },
});

export default About;
