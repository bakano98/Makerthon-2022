import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  ImageBackground,
  Alert,
  Linking,
} from "react-native";

// Each of the containers should be changed into an image instead.

const icons = require("../../icons/icons.js");

const customAlert = (title, msg, accept, decline) => {
  Alert.alert(title, msg, [
    {
      text: "Cancel",
      onPress: decline, // for this purpose, we don't need to do anything.
      style: "cancel",
    },
    {
      text: "Accept",
      onPress: accept,
      style: "default",
    },
  ]);
};

// Services screen should navigate to other screens related to services
const Services = ({ navigation }) => {
  return (
    <ImageBackground source={icons["BG_pic"]} style={styles.imageBg}>
      <SafeAreaView style={{ flexDirection: "row", marginTop: 100 }}>
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() => navigation.navigate("Helplines")}
        >
          <Image
            style={styles.touchableContainerImage}
            source={icons["icon_emergency"]}
          />
          <Text style={styles.touchableContainerText}> Helplines </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchableContainer}
          onPress={() =>
            // customAlert(
            //   "Acknowledgement",
            //   "By clicking, 'Accept', you will be brought to your calling app. Click call to connect with one of our PFAs!",
            //   () => Linking.openURL(`tel: ${+6512345678}`)
            //   // console.log("User declined")
            // )
            navigation.navigate("Callback")
          }
        >
          <Image
            style={[styles.touchableContainerImage]}
            source={icons["icon_PFA"]}
          />
          <Text style={styles.touchableContainerText}>
            Talk to a {"\n"}PFA Personnel
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("Questionnaire")}
      >
        <Image
          style={styles.touchableContainerImage}
          source={icons["icon_survey"]}
        />
        <Text style={styles.touchableContainerText}>Mental Health Survey</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    // default button, change later?
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 15,
  },

  text: {
    fontSize: 24,
    fontFamily: "Itim",
  },

  touchableContainer: {
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    margin: 20,
    height: 150,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },

  touchableContainerText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    fontFamily: "Itim",
  },

  touchableContainerImage: {
    height: "50%",
    width: "50%",
  },

  imageBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
});

export default Services;
