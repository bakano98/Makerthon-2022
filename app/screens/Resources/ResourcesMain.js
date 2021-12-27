import React from "react";
import {
  StyleSheet,
  Text,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

const icons = require("../../icons/icons.js");

const ResourcesMain = ({ navigation }) => {
  return (
    <ImageBackground style={styles.container} source={icons["BG_pic"]}>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("Panic")}
      >
        <Text style={styles.text}>What Are Panic Attacks?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("Breathing")}
      >
        <Text style={styles.text}>Breathing Techniques</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.text}>Placeholder</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.text}>Placeholder</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => navigation.navigate("")}
      >
        <Text style={styles.text}>Placeholder</Text>
      </TouchableOpacity>
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
  touchableContainer: {
    flexDirection: "row",
    borderWidth: 2,
    color: "black",
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "#FBF8D6",
    marginTop: 10,
    marginBottom: 20,
    height: 50,
    width: 250,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  text: {
    fontFamily: "Itim",
    fontSize: 18,
  },
});

export default ResourcesMain;
